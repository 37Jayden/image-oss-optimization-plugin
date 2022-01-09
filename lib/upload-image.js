const klaw = require('klaw');
const fs = require("fs");
const path = require("path");
let OSS = require('ali-oss');
const crypto = require('crypto');
const commander = require('commander');
const { version } = require('../package.json');

// 记录
let record = {};
// 需要上传的图片
let uploadItems = [];
// 上传下标，按下标逐一上传
let uploadIndex = 0;

const { getImgCdnPath, isImg } = require("./util");
const { uploadRecordPath, uploadConfig } = require('./constant');


commander
    .name("upload-image")
    .usage("[command] [options]")
    .option("--target [typeName]", "image folder or image file")
    .version(version)
    .parse(process.argv)

commander.on("--help", function () {
    console.log("");
    console.log("Commands:");
    console.log("  upload-image --target <imageFile>");
    console.log("  upload-image --target <imageDir>");

    return ""
});

const { target } = commander;


let client = new OSS({
    // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
    region: uploadConfig.region,
    // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
    accessKeyId: uploadConfig.accessKeyId,
    accessKeySecret: uploadConfig.accessKeySecret,
    // 填写Bucket名称。
    bucket: uploadConfig.bucket
});

// 记录Json
let oldRecord = {};

if (fs.existsSync(uploadRecordPath)) {
    oldRecord = require(uploadRecordPath);
    // 检查被删除的图片
    let delectArr = [];
    for (const key in oldRecord) {
        let checkFilePath = process.cwd() + key;
        if (!fs.existsSync(checkFilePath)) {
            delectArr.push(key);
        }
    }
    if (delectArr.length > 0) {
        for (var i = 0; i < delectArr.length; i++) {
            // 删除已删除图片的记录
            delete oldRecord[delectArr[i]];
            console.log(i + " 删除记录 " + delectArr[i]);
        }
        fs.writeFileSync(uploadRecordPath, JSON.stringify(oldRecord, null, "\t"));
    }
}

//遍历所有图片
klaw(path.resolve(process.cwd(), target ? target : "./src"))
    .on('data', (item) => {
        if (/\.(jpg|jpeg|png)$/.test(item.path)) {
            const filePath = item.path;
            let fileExtension = filePath.substring(filePath.lastIndexOf('.'))
            // fileKey = /src/images/a.png
            const fileKey = filePath.replace(process.cwd(), "");
            const buffer = fs.readFileSync(filePath);
            const hash = crypto.createHash('md5');
            hash.update(buffer);
            const md5 = hash.digest('hex');
            const recordValue = md5 + fileExtension;
            const oldValue = oldRecord[fileKey];

            if (!oldValue || oldValue != recordValue) {//比较是新增、或修改的图片才重新上传
                uploadItems.push(filePath);
            }
        }
    })
    .on('end', async () => {
        if (uploadItems.length > 0) {
            uploadItem();
        }
    })

/**
 * 上传单个文件
 */
async function uploadItem() {

    const filePath = uploadItems[uploadIndex];
    let fileExtension = filePath.substring(filePath.lastIndexOf('.'))
    // fileKey = /src/images/a.png
    const fileKey = filePath.replace(process.cwd(), "");
    const buffer = fs.readFileSync(filePath);
    const hash = crypto.createHash('md5');
    hash.update(buffer);
    const md5 = hash.digest('hex');
    // recordValue = ac34f6c9c84b4779949851180bad6b09.png
    const recordValue = md5 + fileExtension;

    // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
    // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
    const result = await client.put(recordValue, path.normalize(filePath));

    if(result && result.res && result.res.statusCode == 200){
        record[fileKey] = recordValue;
        console.log("上传成功 " + uploadIndex + " " + fileKey + " " + recordValue);
    }

    uploadIndex++;
    if (uploadIndex < uploadItems.length) {
        uploadItem();
    } else {
        const uploadRecordPath =  path.resolve(process.cwd(), "./upload-image-record.json")
        fs.writeFileSync(uploadRecordPath, JSON.stringify(record, null, "\t"));
    }

}

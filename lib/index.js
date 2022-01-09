/**
 * 替换图片路径插件
 */

const t = require('@babel/types');
const pathP = require('path');
const fs = require("fs");
const { isIgnoreImg, isImg, getImgCdnPath } = require('./util');
const { uploadRecordPath, uploadConfig } = require('./constant');

// 上传图片历史记录
let uploadRecord = require(uploadRecordPath);


module.exports = function () {

  return {
    visitor: {

      ImportDeclaration(path) {

      },
      CallExpression(path, ref = { opts: {} }) {
        try {
          const node = path.node;
          if (node.callee.type === 'Identifier'
            && node.callee.name === 'require') {



            /**
             * 以假设存在项目，/Users/zhangsan/rn-app/index.js代码为例
              class HelloWorld extends React.Component {
                render() {
                  return (
                    <View style={styles.container}>
                      <Image source={require('./src/images/a.png')}/>
                    </View>
                  );
                }
              }
             */
            // value = './src/images/a.png'

            const value = node.arguments[0].value;
            if (typeof (value) === 'string' && isImg(value)) {
              // filename = /Users/zhangsan/rn-app/index.js
              let filename = path.hub.file.opts.filename;
              // fileDir = /Users/zhangsan/rn-app
              let fileDir = filename.substring(0, filename.lastIndexOf("/") + 1);
              // imagePath = /Users/zhangsan/rn-app/src/images/a.png
              let imagePath = pathP.resolve(fileDir, value);
              //rootPath = /Users/zhangsan/rn-app
              let rootPath = path.hub.file.opts.root;
              //imagePath = /src/images/a.png
              imagePath = imagePath.replace(rootPath, "");

              let checkPath = rootPath + imagePath;


              if (fs.existsSync(checkPath)) {
                if (imagePath.startsWith("/src") && !isIgnoreImg(uploadConfig.ignoreImages, imagePath)) {
                  let foundPath = uploadRecord[imagePath];
                  if (foundPath) {
                    const uriValue = getImgCdnPath(uploadConfig) + "/" + foundPath;

                    //声明替换的节点，在线转换ast可以参考https://astexplorer.net/
                    const objectExpression = t.objectExpression([
                      t.objectProperty(
                        t.identifier('uri'),
                        t.stringLiteral(uriValue)
                      )
                    ])

                    /**
                     * require('./src/images/a.png') 替换为
                     * {uri: https://my.oss-cn-beijing.aliyuncs.com/src_images_a.png}
                     */

                    path.replaceWith(objectExpression);
                  } else {
                    console.log(filename + " " + imagePath + "在md5表未找到，请检查是否已执行上传脚本");
                  }
                }
              } else {
                console.log("请检查在" + filename + " " + imagePath + "是否存在");
              }
            }
          }



        } catch (e) {
          console.log(e);
        }
      }
    }
  };
};
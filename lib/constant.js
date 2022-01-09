
 const path = require('path');

// 上传图片配置，获取OSS等信息
const uploadConfig  = require(path.resolve(process.cwd(), "./upload-image-config.json"));
// 图片上传记录
const uploadRecordPath =  path.resolve(process.cwd(), "./upload-image-record.json")

module.exports = {
  uploadConfig,
  uploadRecordPath
}
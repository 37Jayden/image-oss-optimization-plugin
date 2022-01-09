
/**
 * 是否是图片
 */
function isImg(path){
  return /\.(jpg|jpeg|png)$/.test(path);
}


/**
 * 是否为忽略图片
 * @param {*} ignoreImages 忽略图片
 * @param {*} imgPath /src/images/ic_bjx.png
 * @returns 
 */
function isIgnoreImg(ignoreImages, imgPath){
  let imageFolder = imgPath.substring(0, imgPath.lastIndexOf("/"));
  if(ignoreImages.indexOf(imageFolder) != -1 || ignoreImages.indexOf(imgPath) != -1){
    return true;
  }

  return false;
}

/**
 * 获取图片在CDN的地址
 */
function getImgCdnPath(uploadConfig){
  return uploadConfig.cdnHost + "/" + uploadConfig.projectName;
}

module.exports = {
  isIgnoreImg,
  isImg,
  getImgCdnPath
}
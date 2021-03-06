### 概述
对于RN包体积比较大的问题，我们发现图片占据了大概80%的比例，因此衍生出了本库，用来减少RN包体积。

本项目主要实现两个功能

1、将本地图片上传至CDN

2、利用babel及AST抽象树，动态将本地资源替换为OSS地址

实现原理参考[React Native本地图片替换OSS图片](https://blog.csdn.net/JaydenKey/article/details/121720659)


### 使用
1、在主项目package.json 引入此依赖
```
npm install --save-dev image-oss-optimization-plugin
```

2、在主项目package.json，加入执行上传图片命令及配置babel
```
{
  "scripts": {
    "start": "yarn react-native start --reset-cache",
    "upload-image": "image-oss-optimization upload --target ./src"
  }
  "babel": {
    "plugins": [
      "module:image-oss-optimization-plugin"
    ]
  }
}
```

注意：start记得加上--reset-cache清理缓存

3、 在主项目新增文件为：根目录/upload-image-config.json，配置如下信息
```
{    
  "ossHost": "https://my.oss-cn-beijing.aliyuncs.com",
  "region": "oss-cn-beijing",
  "accessKeyId": "你的keyId",
  "accessKeySecret": "你的accessKeySecret",
  "bucket": "你的bucket",
  "ignoreImages": [ 
    "/src/images/navigation",
    "/src/images/ic_back.png"
  ]
}
```

|  参数   | 说明  |
|  ----  | ----  |
| ossHost | 图片访问地址，访问地址+md5能访问到，如https://my.oss-cn-beijing.aliyuncs.com/4a8da6930cae6e4cae54d7bae3498fbc.png|
| region  | yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou |
| accessKeyId  | 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户 |
| accessKeySecret  | 阿里云账号accessKeySecret |
| bucket  | 阿里云Bucket名称 |
| ignoreImages  | 忽略文件，支持文件夹或文件，即不上传到OSS | 

4、执行上传图片命令，如下所示
```
npm run upload-image
```

5、新增、替换、删除图片

重复4步骤

注意：删除图片只会更新upload-image-record.json文件记录，并不会删除OSS的图片


6、检查是否正常运行

**开发环境**
运行RN服务，看是否正常运行


**打release包**

打包模式下看包内容是否包含图片
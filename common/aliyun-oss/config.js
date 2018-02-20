var fileHost = "luchong.oss-cn-shenzhen.aliyuncs.com"
//http://luchong.oss-cn-shenzhen.aliyuncs.com/picture/%E8%8B%8F%E5%B7%9E-30.jpeg
var config = {
    //aliyun OSS config
    uploadImageUrl: "https://luchong.oss-cn-shenzhen.aliyuncs.com", //默认存在根目录，可根据需求改
    AccessKeySecret: 'lRLSwItZX4hIRqFbo8exZrf4jL7fZU',
    OSSAccessKeyId: 'LTAIWLCSvFR9BfBi',
    timeout: 87600 //这个是上传文件时Policy的失效时间
};
module.exports = config

const env = require('./config.js');

const Base64 = require('./Base64.js');

require('./hmac.js');
require('./sha1.js');
const Crypto = require('./crypto.js');

//dir, filePath, fileW, objectId, successCB, errorCB
const uploadFile = function (params) {
    if (!params.filePath || params.filePath.length < 9) {
        wx.showModal({
            title: '上传图片错误',
            content: '请重试',
            showCancel: false,
        })
        return;
    }

    //console.log('上传视频…');
    //const aliyunFileKey = fileW+filePath.replace('wxfile://', '')；

    const aliyunFileKey = params.dir + params.fileName;
    console.log("aliyunFileKey = " + aliyunFileKey);

    const aliyunServerURL = env.uploadImageUrl;
    console.log("aliyunServerURL = " + aliyunServerURL);
    const accessid = env.OSSAccessKeyId;
    console.log("accessid = " + accessid);
    const policyBase64 = getPolicyBase64();
    console.log("policyBase64 = " + policyBase64);
    const signature = getSignature(policyBase64);
    console.log("signature = " + signature);

    console.log('params.filePath =', params.filePath);
    //console.log("wx = " + JSON.stringify(wx));


    wx.uploadFile({
        url: aliyunServerURL,
        filePath: params.filePath,
        name: 'file',
        formData: {
            'key': aliyunFileKey,
            'OSSAccessKeyId': accessid,
            'policy': policyBase64,
            'Signature': signature,
            'success_action_status': '200',
        },
        success: function (res) {
            console.log("res = " + JSON.stringify(res));
            if (res.statusCode != 200) {
                params.fail(new Error('上传错误:' + JSON.stringify(res)))
                return;
            }
            console.log('上传视频成功', res)
            var url = aliyunServerURL + "/"+ aliyunFileKey;
            console.log("url = " + url);
            params.success(url);
        },
        fail: function (err) {
            console.log("err = " + JSON.stringify(err));
            //err.wxaddinfo = aliyunServerURL;
            params.fail(err);
        },
    })
}

/*
const uploadFile = function (filePath, fileW, objectId, successCB, errorCB) {
    if (!filePath || filePath.length < 9) {
        wx.showModal({
            title: '视频错误',
            content: '请重试',
            showCancel: false,
        })
        return;
    }

    console.log('上传视频…');
    //const aliyunFileKey = fileW+filePath.replace('wxfile://', '')；

    const aliyunFileKey = fileW + '' + (new Date().getTime()) + '_' + objectId + '.mp4';
    const aliyunServerURL = env.aliyunServerURL;
    const accessid = env.accessid;
    const policyBase64 = getPolicyBase64();
    const signature = getSignature(policyBase64);

    console.log('aliyunFileKey=', aliyunFileKey);

    wx.uploadFile({
        url: aliyunServerURL, //仅为示例，非真实的接口地址
        filePath: filePath,
        name: 'file',
        formData: {
            'key': aliyunFileKey,
            'OSSAccessKeyId': accessid,
            'policy': policyBase64,
            'Signature': signature,
            'success_action_status': '200',
        },
        success: function (res) {
            if (res.statusCode != 200) {
                errorCB(new Error('上传错误:' + JSON.stringify(res)))
                return;
            }
            console.log('上传视频成功', res)
            successCB(aliyunFileKey);
        },
        fail: function (err) {
            err.wxaddinfo = aliyunServerURL;
            errorCB(err);
        },
    })
}
*/
const getPolicyBase64 = function () {
    let date = new Date();
    date.setHours(date.getHours() + env.timeout);
    let srcT = date.toISOString();
    const policyText = {
        "expiration": srcT, //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了 指定了Post请求必须发生在2020年01月01日12点之前("2020-01-01T12:00:00.000Z")。
        "conditions": [
            ["content-length-range", 0, 20 * 1024 * 1024] // 设置上传文件的大小限制,1048576000=1000mb
        ]
    };

    const policyBase64 = Base64.encode(JSON.stringify(policyText));
    return policyBase64;
}

const getSignature = function (policyBase64) {
    const accesskey = env.AccessKeySecret;  //env.accesskey;
    console.log("accesskey = " + accesskey);

    const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
        asBytes: true
    });
    const signature = Crypto.util.bytesToBase64(bytes);

    return signature;
}

module.exports = uploadFile;
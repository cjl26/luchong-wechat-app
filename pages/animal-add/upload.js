import WeCropper from '../../common/we-cropper/we-cropper.js'

const uploadImage = require('../../common/aliyun-oss/uploadAliyun.js');

var netUtil = require('/../../utils/netUtil.js')
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50
var app = getApp();

Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300
      }
    }
  },
  touchStart (e) {
    this.wecropper.touchStart(e)
  },
  touchMove (e) {
    this.wecropper.touchMove(e)
  },
  touchEnd (e) {
    this.wecropper.touchEnd(e)
  },

    /*确定使用图片*/
  getCropperImage () {
    this.wecropper.getCropperImage((avatar) => {
      if (avatar) {
        //console.log("avatar = " + avatar);
        var fileName = app.globalData.openid + "_" + new Date().getTime() + "_" + Math.ceil(Math.random()*100) + ".png";
        //console.log("fileName = " + fileName);

          netUtil.showLoadingDialog();
        //上传图片
          uploadImage(
              {
                  filePath: avatar,
                  dir: "picture/",
                  fileName : fileName,
                  success: function (res) {
                      netUtil.hideLoadingDialog();
                      console.log("上传成功 res = " + res);

                      var pages = getCurrentPages();
                      //var currPage = pages[pages.length - 1];   //当前页面
                      var prevPage = pages[pages.length - 2];  //上一个页面
                      prevPage.setData({
                          animal_avatar: res
                      })
                      wx.navigateBack();   //返回上一个页面

                  },
                  fail: function (res) {
                      netUtil.hideLoadingDialog();
                      netUtil.showAlertDialog("提示 - 上传失败，请重试", res.errMsg, false, "确定", null, null);
                  }
              });

      } else {
        //console.log('获取图片失败，请稍后重试')
        netUtil.showAlertDialog("提示", "获取图片失败，请稍后重试", false, "确定", null, null);
      }
    })
  },
    /**
     * 重新选择

  uploadTap () {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success (res) {
        const src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值

        self.wecropper.pushOrign(src)
      }
    })
  },
     */
  onLoad (option) {
    const { cropperOpt } = this.data

    if (option.src) {
      cropperOpt.src = option.src
      new WeCropper(cropperOpt)
        .on('ready', (ctx) => {
          //console.log(`wecropper is ready for work!`)
        })
        .on('beforeImageLoad', (ctx) => {
          //console.log(`before picture loaded, i can do something`)
          //console.log(`current canvas context:`, ctx)
          wx.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 20000
          })
        })
        .on('imageLoad', (ctx) => {
          //console.log(`picture loaded`)
          //console.log(`current canvas context:`, ctx)
          wx.hideToast()
        })
        .on('beforeDraw', (ctx, instance) => {
          //console.log(`before canvas draw,i can do something`)
          //console.log(`current canvas context:`, ctx)
        })
        .updateCanvas()
    }
  }
})

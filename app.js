//app.js
var netUtil = require('/utils/netUtil.js')
App({
    onLaunch: function () {
        var that = this;
        //  获取手机与系统信息
        wx.getSystemInfo({
            success: function (res) {
                that.globalData.brand = res.platform
                that.globalData.model = res.model
                that.globalData.language = res.language
                that.globalData.version = res.version
                that.globalData.system = res.system
                that.globalData.platform = res.platform
                console.log('app.js--获取版本信息成功')
            }
        })

    },

    getUserOpedId: function (callback,force) {
        console.log('getUserOpedId')
        if(typeof callback == "function" ){
            console.log('callback is function')
        }else {
            console.log('callback not function')
        }
        var that = this
        if(force!=undefined)
            console.log('app.getUserOpedId 强制更新:'+force)

        if (this.globalData.openid == '0' || force==true) {
            console.log('app.getUserOpedId 连网更新userid和sessinkey')
            wx.login({
                success: function (res) {
                    if (res.code) {

                    } else {
                        console.log('wx.login失败！' + res.errMsg)
                    }
                    console.log('wx.login.code:' + res.code)
                    that.globalData.code = res.code
                    wx.getUserInfo({
                        success: function (res) {//微信授权--用户点“允许”
                            that.globalData.exitFlag=false
                            console.log('wx.getUserInfo成功')
                            that.globalData.userInfo=res.userInfo
                            var params = {
                                service: 'xiche.wx.auth',
                                code: that.globalData.code,
                                nickName: res.userInfo.nickName,
                                avaterUrl: res.userInfo.avaterUrl,
                                gender: res.userInfo.gender,
                                province: res.userInfo.province,
                                city: res.userInfo.city,
                                country: res.userInfo.country,
                                language: res.userInfo.language
                            }

                            netUtil.buildRequest(that, '/xicatcard/api', params, {
                                onPre: function () {
                                    netUtil.showLoadingDialog(that);
                                },
                                onSuccess: function (data) {
                                    netUtil.hideLoadingDialog(that);
                                    that.globalData.openid = data.wxAuthOpenid
                                    that.globalData.sessionKey = data.session_key

                                    if(data.userInfo == undefined || data.userInfo.phone == undefined ||data.userInfo.phone.length == 0){
                                        console.log('auth返回手机号为空或异常:'+that.globalData.phone)
                                    }else {
                                        that.globalData.phone = data.userInfo.phone
                                        console.log('auth返回手机号:'+that.globalData.phone)
                                    }

                                    if(typeof callback == "function" ){
                                        console.log('call callback()')
                                        callback()
                                    }else {
                                        console.log(' callback not a function')
                                        wx.reLaunch({
                                            url: '/pages/index/index',
                                        })
                                    }
                                },
                                onError: function (msgCanShow, code, hiddenMsg) {
                                    netUtil.hideLoadingDialog(that);
                                    netUtil.showAlertDialog("提示", msgCanShow, false, "确定", null, null);
                                    // netUtil.showAlertDialog("请检查网络(状态码"+code+")", msgCanShow, false, "确定", null, null);
                                },
                            }).send()

                        },
                        fail: function (res) {//微信授权--用户点“拒绝”
                            // netUtil.showConfirmModal('wx.getUserInfo失败' + res.errMsg)
                            console.log('wx.getUserInfo失败:' + res.errMsg)
                            console.log('wx.navigateBack')
                            that.globalData.exitFlag=true;
                            if(typeof callback == "function" ){
                                console.log('call callback()')
                                callback()
                            }else {
                                console.log(' callback not a function')
                                wx.reLaunch({
                                    url: '/pages/index/index',
                                })
                            }
                            // wx.reLaunch({
                            //     url: '/pages/index/index',
                            // })
                            // wx.openSetting({
                            //     success: (res) => {
                            //         /*
                            //          * res.authSetting = {
                            //          *   "scope.userInfo": true,
                            //          *   "scope.userLocation": true
                            //          * }
                            //          */
                            //     }
                            // })
                        }
                    })
                },
                fail: function (res) {
                    netUtil.showConfirmModal('wx.login失败' + res.errMsg)
                    console.log('wx.login失败:' + res.errMsg)
                }
            })
        }else {
            console.log('getUserOpedId 已有数据：' + this.globalData.openid)
            if(typeof callback == "function" ){
                console.log('call callback()')
                callback()
            }else {
                console.log(' callback not a function')
            }
        }
    },

    globalData: {
        isDebug: true,
        // apiHeadUrl: 'http://127.0.0.1:8086',//切换服务器
       apiHeadUrl: 'https://hicatcitycard.6so2o.com',
        js_version: '0.0.39',
        //公共参数--开始
        openid: "0",
        // openid: "oj34W0fKt6kntIyyuEBtNkkLlFxc",
        phone: null,
        api_version: '1.0',
        charset: 'utf-8',
        brand: 'test',//wx.getSystemInfo
        model: 'test',//wx.getSystemInfo
        language: 'chinese',//wx.getSystemInfo
        version: '1.0',//wx.getSystemInfo
        system: 'test',//wx.getSystemInfo
        platform: 'test',//wx.getSystemInfo

        //公共参数--结束

        userInfo: null,
        subDomain: "jaken150",
        pageType: 1, //0商品列表1核销列表2购卡记录3自用记录4转赠记录5友赠记录
        pageType0ProduceList:0,
        pageType1ShowQrList:1,
        pageType2BuyLIst:2,
        pageType3SelfList:3,
        pageType4ShareList:4,
        pageType5FriendList:5,

        //图片地址配置
        backgroundUrlForCardDetail:"http://hicatcitycardimage.6so2o.com/wxappimage/detail_bg.jpg",//卡片详情背景图
    }

})

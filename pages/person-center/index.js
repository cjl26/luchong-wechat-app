var netUtil = require('/../../utils/netUtil.js')
const app = getApp()
var that;

Page({
    data: {
        balance: 0,
        freeze: 0,
        score: 0,
        score_sign_continuous: 0,
        scrollHeight: 0,
        showModal: false,
        showModalInput: true,
        showModalText: false,
        canvasHidden:true,
        showModalBtn:true
    },
    onLoad() {
        that = this
        app.getUserOpedId(function () {
            if (app.globalData.openid == '0' ) {

            }else {
                var params = {
                    service: 'xiche.car.licence.query',
                }
                netUtil.buildRequest(that, '/xicatcard/api', params, {
                    onPre: function () {
                        netUtil.showLoadingDialog(that);
                    },
                    onSuccess: function (resp) {
                        netUtil.hideLoadingDialog(that);
                        if(resp.car_licence!=undefined){
                            that.setData({
                                carLicence: resp.car_licence
                            })
                        }

                    },
                    onError: function (msgCanShow, code, hiddenMsg) {
                        netUtil.hideLoadingDialog(that);
                        netUtil.showAlertDialog("提示", msgCanShow, false, "确定", null, null);

                    },
                }).send()
            }
        })
        that = this;
        wx.getSystemInfo({
            success: function (res) {
                console.info(res.windowHeight);
                that.setData({
                    scrollHeight: res.windowHeight + 22 //调整底部高度
                });
            }
        });
        console.log('app.globalData.phone:' + app.globalData.phone)
        if (app.globalData.phone == undefined || app.globalData.phone.length == 0) {

        } else {
            that.setData({
                phone: app.globalData.phone
            })
        }

        that.setData({
            js_version: app.globalData.js_version
        })

    },
    onShow() {
        this.setData({
            userInfo: app.globalData.userInfo
        })
    },

    getPhoneNumber: function (e) {
        console.log(e.detail.errMsg)
        if(e.detail.iv == undefined){
            // netUtil.showConfirmModal('取消绑定手机号')
            return
        }
        that = this
        wx.checkSession({
            success: function () {
                netUtil.showSuccessToast(that, '登录状态正常')
                // that.getPhoneFromApi(e)
                setTimeout(function () {
                    app.getUserOpedId(that.getPhoneFromApi(e))
                }, 1000)
            },
            fail: function () {
                //登录态过期
                netUtil.showSuccessToast(that, '登录状态过期，正在刷新')
                setTimeout(function () {
                    app.getUserOpedId(that.getPhoneFromApi(e), true)
                }, 1000)
            }
        })

    },

    getPhoneFromApi: function (e) {
        console.log(e.detail.errMsg)
        console.log(e.detail.iv)
        console.log(e.detail.encryptedData)

        var params = {
            service: 'xiche.wx.decrypt',
            sessionKey: app.globalData.sessionKey,
            encryptedData: e.detail.encryptedData,
            ivStr: e.detail.iv
        }

        netUtil.buildRequest(that, '/xicatcard/api', params, {
            onPre: function () {
                netUtil.showLoadingDialog(that);
            },
            onSuccess: function (resp) {
                netUtil.hideLoadingDialog(that);
                that.setData({
                    phone: resp.decryptedData
                })
                app.globalData.phone = resp.decryptedData
            },
            onError: function (msgCanShow, code, hiddenMsg) {
                netUtil.hideLoadingDialog(that);
                netUtil.showAlertDialog("提示", msgCanShow, false, "确定", null, null);

            },
        }).send()
    },

    //购卡记录
    toBuyCardRecordTap: function (e) {
        app.globalData.pageType = app.globalData.pageType2BuyLIst
        var url = "/pages/person-card-list/index"
        console.log("pageType:" + app.globalData.pageType)
        wx.navigateTo({
            url: url
        })
    },
    //自用记录
    toUserCardRecordTap: function (e) {
        app.globalData.pageType = app.globalData.pageType3SelfList
        var url = "/pages/person-card-list/index"
        console.log("pageType:" + app.globalData.pageType)
        wx.navigateTo({
            url: url
        })
    },
    //转赠记录
    toShareCardRecordTap: function (e) {
        app.globalData.pageType = app.globalData.pageType4ShareList
        var url = "/pages/person-card-list/index"
        console.log("pageType:" + app.globalData.pageType)
        wx.navigateTo({
            url: url
        })
    },
    //友赠记录
    toReceivedCardRecordTap: function (e) {
        app.globalData.pageType = app.globalData.pageType5FriendList
        var url = "/pages/person-card-list/index"
        console.log("pageType:" + app.globalData.pageType)
        wx.navigateTo({
            url: url
        })
    },

    //核销记录
    toTransactionListTap: function (e) {
        var url = "/pages/transaction-list/transaction-list"
        console.log("pageType:" + app.globalData.pageType)
        wx.navigateTo({
            url: url
        })
    },
    toEditCarLicenseTap: function () {
        this.showDialogBtn()
    },
    //获取客服二维码
    toCustomerTap: function () {
        //未测试
        var size = this.setCanvasSize();//动态设置画布大小
        this.setData({
            canvasHidden:false
        })
        //console.log("usercardnumber:"+e.currentTarget.dataset.usercardnumber)
        // if(e.currentTarget.dataset.usercardnumber!=undefined && e.currentTarget.dataset.usercardnumber.length>0){
        //     this.setData({
        //         canvasHidden:false
        //     })
        //     QR.api.draw(e.currentTarget.dataset.usercardnumber,"mycanvas", size.w, size.h);
        //     this.setData({
        //         canvasHidden:false
        //     })
        // }else {
        //     wx.showToast({
        //         title: '卡号不正确',
        //         icon: 'fail',
        //         duration: 2000
        //     })
        // }

    },

    //----弹窗开始----
    showDialogBtn: function () {
        this.setData({
            showModal: true
        })
    },
    /**
     * 弹出框蒙层截断touchmove事件
     */
    preventTouchMove: function () {
    },
    /**
     * 隐藏模态对话框
     */
    hideModal: function () {
        this.setData({
            showModal: false
        });
    },
    /**
     * 对话框取消按钮点击事件
     */
    onCancel: function () {
        this.hideModal();
    },
    /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function () {
        if (this.data.inputValue != undefined && this.data.inputValue.length == 7) {
            //发送绑定车牌请求
            var params = {
                service: 'xiche.car.licence.update',
                type: 2,
                car_licence: this.data.inputValue
            }
            that = this
            netUtil.buildRequest(that, '/xicatcard/api', params, {
                onPre: function () {
                    netUtil.showLoadingDialog(that);
                },
                onSuccess: function (data) {
                    netUtil.hideLoadingDialog(that);
                    //绑定成功
                    wx.showToast({
                        title: '车牌绑定成功',
                        icon: 'success',
                        duration: 2000
                    })
                    that.setData({
                        carLicence: that.data.inputValue
                    })
                    that.hideModal()
                },
                onError: function (msgCanShow, code, hiddenMsg) {
                    netUtil.hideLoadingDialog(that);
                    netUtil.showAlertDialog("提示", msgCanShow, false, "确定", null, null);

                },
            }).send()

        } else {
            if(this.data.carLicence!=undefined && this.data.carLicence.length == 7){
                netUtil.showConfirmModal( '车牌未修改')
            }else {
                netUtil.showConfirmModal( '车牌输入有误')
            }

        }
    },
    bindKeyInput: function (e) {
        this.setData({
            inputValue: e.detail.value
        })
    },
    //----弹窗结束----

    //QR相关--适配不同屏幕大小的canvas
    setCanvasSize:function(){
        var size={};
        try {
            var res = wx.getSystemInfoSync();
            var scale = 750/500;//不同屏幕下canvas的适配比例；设计稿是750宽
            var width = res.windowWidth/scale;
            var height = width;//canvas画布为正方形
            size.w = width;
            size.h = height;
        } catch (e) {
            // Do something when catch error
            console.log("获取设备信息失败"+e);
        }
        return size;
    },
    hiddenCanvas:function () {
        this.setData({
            canvasHidden:true
        })
    },

    previewImage: function (e) {
        // wx.previewImage({
        //     // current: e.currentTarget.dataset.src, // 当前显示图片的http链接
        //     urls: [e.currentTarget.dataset.src] // 需要预览的图片http链接列表
        // })
    },
    customerCall: function () {
        wx.makePhoneCall({
            phoneNumber: '4001178488' //仅为示例，并非真实的电话号码
        })
    }


})
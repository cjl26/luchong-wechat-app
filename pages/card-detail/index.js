var netUtil = require('/../../utils/netUtil.js')
const app = getApp()
var that;

Page({
    data: {
        constantModelTextActivate: '当前账户已注册手机号，将激活卡片至已绑定手机号，是否确定？',
        constantModelTextActivateSuccess: '领卡成功',
        card_id: null,
        card_name: null,
        picture_url: null,
        shareUserCardId: null,
        fee: null,
        detail: null,
        but_status: -1,//-1不显示0注册购买1购买2激活转赠3扫一扫领卡4去使用(核销列表)5领转赠卡
        //展示列表进入(0注册购买,1购买) 对应pagetype=0
        //购卡记录进入(2 激活和转赠) 对应pagetype=2
        //自用记录进入(-1不显示) 对应pagetype=3
        //转赠记录(-1) 对应pagetype=4
        //友赠记录(2 激活和转赠) 对应pagetype=5
        showModal: false,
        showModalInput: true,
        showModalText: false,
        modalText: null,
        smsBtnText: '获取验证码',
        smsBtnFlag: true,
        feeText: null,

    },
    onLoad(e) {
        wx.hideShareMenu()
        var scene = decodeURIComponent(e.scene)
        console.log("scene:" + scene)
        console.log("detailName:" + e.detailName
            // + ",detailPic:"+ e.detailPic
            + ",detailText:" + e.detailText
            + ",detailCardId:" + e.detailCardId
            + ",detailUserCardId:" + e.detailUserCardId
            + ",detailFee:" + e.detailFee
            +",cardStatus:" + e.cardStatus
            + ",shareUserCardId:" + e.shareUserCardId
        )
        that = this;
        wx.getSystemInfo({
            success: function (res) {
                console.info(res.windowHeight);
                that.setData({
                    scrollHeight: res.windowHeight
                });
            }
        });

        app.getUserOpedId(function () {
            //0展示列表1核销列表2购卡记录3自用记录4转赠记录5友赠记录
            if (app.globalData.pageType == app.globalData.pageType0ProduceList) {
                that.setData({
                    but_status: 1
                });
            } else if (app.globalData.pageType == app.globalData.pageType2BuyLIst && e.cardStatus=='1') {
                that.setData({
                    but_status: 2
                });
            } else if (app.globalData.pageType == app.globalData.pageType3SelfList) {
                that.setData({
                    but_status: -1
                });
            } else if (app.globalData.pageType == app.globalData.pageType4ShareList) {
                that.setData({
                    but_status: -1
                });
            } else if (app.globalData.pageType == app.globalData.pageType5FriendList && e.cardStatus=='1') {
                that.setData({
                    but_status: 2
                });
            }else {
                that.setData({
                    but_status: -1
                });
            }

            if ( app.globalData.pageType==app.globalData.pageType0ProduceList && (app.globalData.phone == undefined || app.globalData.phone.length == 0)) {
                that.setData({
                    but_status: 0
                })
            } else {
                that.setData({
                    phone: app.globalData.phone
                })
            }
            console.log("index-手机号phone:" + app.globalData.phone);

            that.setData({
                card_name: e.detailName,
                // picture_url: e.detailPic,
                detail: e.detailText,
                card_id: e.detailCardId,
                fee: e.detailFee,
                // but_status: e.detailBtnStatus,
                user_card_id: e.detailUserCardId,
                shareUserCardId: e.shareUserCardId,
                feeText: that.toMoney(e.detailFee),
                effectiveday: e.effectiveday,
                servicename: e.servicename,
                servicetime: e.servicetime,
            })

            if (e.scene != undefined && e.scene.length > 0) {//情景：扫码进入
                console.log("扫码进入")
                that.setData({
                        scene: scene,
                        // detail: scene + '(' + app.globalData.openid + ')',
                        // picture_url: 'http://hicatcitycardimage.6so2o.com/logo.png',
                        // backgroundUrl:app.globalData.backgroundUrlForCollectCard,
                        but_status: 3//只显示领卡按钮
                    }
                )
                var params = {
                    service: 'xiche.card.detail.query',
                    system_card_number: e.scene,
                }
                netUtil.buildRequest(that, '/xicatcard/api', params, {
                    onPre: function () {
                        netUtil.showLoadingDialog(that);
                    },
                    onSuccess: function (resp) {
                        netUtil.hideLoadingDialog(that);
                        that.setData({
                            picture_url: resp.card.picture_url,
                            backgroundUrl:resp.backgroundImageUrl,
                            backgroundColor:"#ffffff"
                        })
                    },
                    onError: function (msgCanShow, code, hiddenMsg) {
                        netUtil.hideLoadingDialog(that);
                        netUtil.showAlertDialog("提示", msgCanShow, false, "确定", null, null);
                    },
                }).send()

            }
            if (e.shareUserCardId != undefined) {//情景：转发进入
                console.log("转发链接进入")
                // app.globalData.pageType = app.globalData.pageType2BuyLIst
                that.setData({
                        user_card_id: e.shareUserCardId,
                        // detail: e.shareUserCardId + '(' + app.globalData.openid + ')',
                        // picture_url: 'http://hicatcitycardimage.6so2o.com/logo.png',
                        // backgroundUrl:app.globalData.backgroundUrlForCollectCard,
                        but_status: 5//领取转赠卡
                    }
                )

                var params = {
                    service: 'xiche.card.detail.query',
                    user_card_id: e.shareUserCardId,
                }
                netUtil.buildRequest(that, '/xicatcard/api', params, {
                    onPre: function () {
                        netUtil.showLoadingDialog(that);
                    },
                    onSuccess: function (resp) {
                        netUtil.hideLoadingDialog(that);
                        that.setData({
                            picture_url: resp.card.picture_url,
                            backgroundUrl:resp.backgroundImageUrl,
                            backgroundColor:"#ffffff"
                        })
                    },
                    onError: function (msgCanShow, code, hiddenMsg) {
                        netUtil.hideLoadingDialog(that);
                        netUtil.showAlertDialog("提示", msgCanShow, false, "确定", null, null);
                    },
                }).send()

            }
            if(e.shareUserCardId == undefined && e.scene == undefined){
                that.setData({
                    backgroundUrl:app.globalData.backgroundUrlForCardDetail,
                    backgroundColor:"#fa922b"
                })
            }

            console.log("but_status:" + that.data.but_status + "|-1不显示0注册购买1购买2激活转赠3扫一扫领卡4去使用(核销列表)5领转赠卡");
        })


    },

    onReady: function (e) {

    },

    toMoney: function (num) {
        if (num != undefined) {
            num = parseInt(num) / 100
            num = num.toFixed(2);
            num = parseFloat(num)
            num = num.toLocaleString();
            console.log('num:' + num)
            return num + '元';//返回的是字符串23,245.12保留2位小数
        } else {
            return null
        }

    },

    buyCard: function (e) {
        var params = {
            service: 'xiche.card.order',
            card_id: this.data.card_id,
            total_fee: this.data.fee,
            pay_fee: this.data.fee,
        }
        netUtil.buildRequest(that, '/xicatcard/api', params, {
            onPre: function () {
                netUtil.showLoadingDialog(that);
            },
            onSuccess: function (data) {
                netUtil.hideLoadingDialog(that);
                console.log("appId:" + data.appId)
                console.log("timeStamp:" + data.timeStamp)
                console.log("nonceStr:" + data.nonceStr)
                console.log("pkg:" + data.pkg)
                console.log("signType:" + data.signType)
                console.log("paySign:" + data.paySign)
                wx.requestPayment(
                    {
                        'appId': data.appId,
                        'timeStamp': data.timeStamp,
                        'nonceStr': data.nonceStr,
                        'package': data.pkg,
                        'signType': data.signType,
                        'paySign': data.paySign,
                        'success': function (res) {
                            console.log("success")
                            // that.setData({
                            //     but_status:2
                            // })
                            wx.showToast({
                                title: '支付成功',
                                icon: 'success',
                                duration: 2000
                            })
                            app.globalData.pageType = app.globalData.pageType2BuyLIst
                            var url = "/pages/person-card-list/index"
                            // console.log("pageType:" + app.globalData.pageType)
                            wx.navigateTo({
                                url: url
                            })
                        },
                        'fail': function (res) {
                            console.log("fail")
                            console.log(res)
                            wx.showToast({
                                title: '支付失败',
                                icon: 'fail',
                                duration: 2000
                            })
                            // that.setData({
                            //     but_status:2
                            // })
                            // that.setData({
                            //     showModalText:true,
                            //     showModalInput:false
                            // })
                            // that.showDialogBtn()


                            //'当前账户已注册手机号，将激活卡片至已绑定手机号，是否确定？',

                        },
                        'complete': function (res) {
                            console.log("complete")

                        }
                    })

            },
            onError: function (msgCanShow, code, hiddenMsg) {
                netUtil.hideLoadingDialog(that);
                netUtil.showAlertDialog("提示", msgCanShow, false, "确定", null, null);

            },
        }).send()
    },

    getPhoneNumber: function (e) {
        console.log(e.detail.errMsg)
        if(e.detail.iv == undefined){
            netUtil.showConfirmModal('请先绑定手机号码')
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
                if(app.globalData.pageType == app.globalData.pageType0ProduceList){
                    that.buyCard()
                }else {
                    if(that.data.but_status == 2){
                        that.activateCard()
                    }
                }

            },
            onError: function (msgCanShow, code, hiddenMsg) {
                netUtil.hideLoadingDialog(that);
                netUtil.showAlertDialog("提示", msgCanShow, false, "确定", null, null);

            },
        }).send()
    },

    activateCard: function () {
        this.showDialogBtn('text', this.data.constantModelTextActivate)
    },
    // shareCard: function () {
    //     wx.showShareMenu({
    //         withShareTicket: true
    //     })
    // },

    collectCard: function () {//扫一扫领取
        var params = {
            service: 'xiche.system.card.collect',
            card_number: this.data.scene
        }
        netUtil.buildRequest(that, '/xicatcard/api', params, {
            onPre: function () {
                netUtil.showLoadingDialog(that);
            },
            onSuccess: function (data) {
                netUtil.hideLoadingDialog(that);
                // //激活成功
                // wx.showToast({
                //     title: '领取成功',
                //     icon: 'success',
                //     duration: 2000
                // })

                that.showDialogBtn('text', that.data.constantModelTextActivateSuccess,true)
                setTimeout(function () {
                    app.globalData.pageType = app.globalData.pageType5FriendList
                    var url = "/pages/person-card-list/index"
                    // console.log("pageType:" + app.globalData.pageType)
                    wx.navigateTo({
                        url: url
                    })
                },1000)
            },
            onError: function (msgCanShow, code, hiddenMsg) {
                netUtil.hideLoadingDialog(that);
                netUtil.showAlertDialog("提示", msgCanShow, false, "确定", null, null);

            },
        }).send()
    },
    useCard: function () {
        // wx.navigateTo({
        //     url: '/page/card-list/index'
        // })
        app.globalData.pageType =  app.globalData.pageType1ShowQrList
        wx.switchTab({
            url: '/pages/card-list/index'
        })
    },
    collectShareCard: function () {//领取转赠卡
        var params = {
            service: 'xiche.card.collect',//
            user_card_id: this.data.user_card_id
        }
        netUtil.buildRequest(that, '/xicatcard/api', params, {
            onPre: function () {
                netUtil.showLoadingDialog(that);
            },
            onSuccess: function (data) {
                netUtil.hideLoadingDialog(that);
                that.showDialogBtn('text', that.data.constantModelTextActivateSuccess,true)
                setTimeout(function () {
                    app.globalData.pageType = app.globalData.pageType5FriendList
                    var url = "/pages/person-card-list/index"
                    // console.log("pageType:" + app.globalData.pageType)
                    wx.navigateTo({
                        url: url
                    })
                },1000)
            },
            onError: function (msgCanShow, code, hiddenMsg) {
                netUtil.hideLoadingDialog(that);
                netUtil.showAlertDialog("提示", msgCanShow, false, "确定", null, null);

            },
        }).send()
    },

    goHome: function () {
        wx.reLaunch({
            url: '/pages/index/index',
        })
    },

    onShareAppMessage: function () {
        var path = '/pages/index/index'
        var title = '喜卡小程序'
        if (that.data.user_card_id != undefined && (app.globalData.pageType == app.globalData.pageType2BuyLIst || app.globalData.pageType == app.globalData.pageType5FriendList)) {
            path = '/pages/card-detail/index?shareUserCardId=' + that.data.user_card_id
            title = '转赠卡片(' + that.data.user_card_id + ')'
        }

        console.log('onShareAppMessage path:' + path + '|app.globalData.pageType:' + app.globalData.pageType)

        // if(app.globalData.pageType == 2 || app.globalData.pageType == 5){
        return {
            title: title,
            path: path,
            success: function (res) {
                that.setData({
                    but_status:-1
                })
                netUtil.showConfirmModal('用户卡(' + that.data.user_card_id + ')转赠成功')
                // 转发成功

            },
            fail: function (res) {
                // 转发失败
            }
        }
        // }

    },

//----弹窗开始----
    showDialogBtn: function (dialogType, tempModelText,hiddenBtn) {
        if (dialogType == 'text') {//纯文本对话框
            that.setData({
                showModalText: true,
                showModalInput: false
            })
        } else {//input对话框
            that.setData({
                showModalText: false,
                showModalInput: true
            })
        }
        if(hiddenBtn!=undefined && hiddenBtn == true){
            that.setData({
                showModalBtn: false
            })
        }else {
            that.setData({
                showModalBtn: true
            })
        }
        this.setData({
            modalText: tempModelText,
            showModal: true
        })
    }
    ,
    /**
     * 弹出框蒙层截断touchmove事件
     */
    preventTouchMove: function () {
    }
    ,
    /**
     * 隐藏模态对话框
     */
    hideModal: function () {
        this.setData({
            showModal: false
        });
    }
    ,
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
        if (this.data.modalText == '领卡成功') {
            this.hideModal();
            return
        }
        else if (this.data.modalText == '当前账户已注册手机号，将激活卡片至已绑定手机号，是否确定？') {
            // that.setData({
            //     showModalText: false,
            //     showModalInput: true
            // })
            //发送激活请求
            var params = {
                service: 'xiche.card.activate',
                user_card_id: this.data.user_card_id,
                // sms_code: this.data.inputValue
            }
            netUtil.buildRequest(that, '/xicatcard/api', params, {
                onPre: function () {
                    netUtil.showLoadingDialog(that);
                },
                onSuccess: function (data) {
                    netUtil.hideLoadingDialog(that);
                    //激活成功
                    wx.showToast({
                        title: '激活成功',
                        icon: 'success',
                        duration: 2000
                    })
                    that.setData({
                        but_status: 4
                    })
                    that.hideModal()
                },
                onError: function (msgCanShow, code, hiddenMsg) {
                    netUtil.hideLoadingDialog(that);
                    netUtil.showAlertDialog("提示", msgCanShow, false, "确定", null, null);

                },
            }).send()
        }

    }
    ,
    bindKeyInput: function (e) {
        this.setData({
            inputValue: e.detail.value
        })
    }
    ,
    onModalSms: function () {
        var params = {
            service: 'xiche.sms.code',
            phone: this.data.phone,
            type: 1
        }
        netUtil.buildRequest(that, '/xicatcard/api', params, {
            onPre: function () {
                netUtil.showLoadingDialog(that);
            },
            onSuccess: function (data) {
                netUtil.hideLoadingDialog(that);
                that.setData({
                    smsBtnText: 20,
                    smsBtnFlag: false
                })
                let time = setInterval(() => {
                    let smsBtnText = that.data.smsBtnText
                    smsBtnText--
                    that.setData({
                        smsBtnText: smsBtnText
                    })
                    if (smsBtnText == 0) {
                        clearInterval(time)
                        that.setData({
                            smsBtnText: "获取验证码",
                            smsBtnFlag: true
                        })
                    }
                }, 1000)


            },
            onError: function (msgCanShow, code, hiddenMsg) {
                netUtil.hideLoadingDialog(that);
                netUtil.showAlertDialog("提示", msgCanShow, false, "确定", null, null);

            },
        }).send()

    }
//----弹窗结束----
})
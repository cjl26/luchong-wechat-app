//index.js
//获取应用实例
var netUtil = require('/../../utils/netUtil.js')
var QR = require("../../utils/qrcode.js");
var app = getApp();
var that;
Page({
    data: {
        page: 1,
        pagesize: 3,
        scrollHeight: 0,
        needLoadMore: true,
        pageType: 1,
        canvasHidden: true,
        pageType: 1
    },
    onShow: function () {
        app.globalData.pageType = app.globalData.pageType1ShowQrList
        this.setData({
            pageType: app.globalData.pageType
        })
        if (app.globalData.pageType == app.globalData.pageType1ShowQrList) {
            wx.setNavigationBarTitle({
                title: '核销'
            })
            this.setData({
                // reqSource:null,//1-购买2-系统赠送3-用户赠送
                reqStatus: 2 //1-未激活2-已经激活3-已经赠送出去
            })
        }
        else if (app.globalData.pageType == app.globalData.pageType2BuyLIst) {
            wx.setNavigationBarTitle({
                title: '购卡记录'
            })
            this.setData({
                reqSource: 1,//1-购买2-系统赠送3-用户赠送
                reqStatus: 1 //1-未激活2-已经激活3-已经赠送出去
            })
        }
        else if (app.globalData.pageType == app.globalData.pageType3SelfList) {
            wx.setNavigationBarTitle({
                title: '自用记录'
            })
            this.setData({
                // reqSource:null,//1-购买2-系统赠送3-用户赠送
                reqStatus: 2 //1-未激活2-已经激活3-已经赠送出去
            })
        }
        else if (app.globalData.pageType == app.globalData.pageType4ShareList) {
            wx.setNavigationBarTitle({
                title: '转赠记录'
            })
            this.setData({
                // reqSource:null,//1-购买2-系统赠送3-用户赠送
                reqStatus: 3 //1-未激活2-已经激活3-已经赠送出去
            })
        }
        else if (app.globalData.pageType == app.globalData.pageType5FriendList) {
            wx.setNavigationBarTitle({
                title: '友赠记录'
            })
            this.setData({
                reqSource: 2,//1-购买2-系统赠送3-用户赠送
                reqStatus: 1 //1-未激活2-已经激活3-已经赠送出去
            })
        }

    },
    onLoad: function (options) {

        // 生命周期函数--监听页面加载--设置页面高度
        that = this;
        wx.getSystemInfo({
            success: function (res) {
                console.info(res.windowHeight);
                that.setData({
                    scrollHeight: res.windowHeight
                });
            }
        });
        console.log("pageType:" + app.globalData.pageType)
        app.globalData.pageType = app.globalData.pageType1ShowQrList
        this.setData({
            pageType: app.globalData.pageType
        })
        if (app.globalData.pageType == app.globalData.pageType1ShowQrList) {
            wx.setNavigationBarTitle({
                title: '核销'
            })
            this.setData({
                // reqSource:null,//1-购买2-系统赠送3-用户赠送
                reqStatus: 2 //1-未激活2-已经激活3-已经赠送出去
            })
        }
        else if (app.globalData.pageType == app.globalData.pageType2BuyLIst) {
            wx.setNavigationBarTitle({
                title: '购卡记录'
            })
            this.setData({
                reqSource: 1,//1-购买2-系统赠送3-用户赠送
                reqStatus: 1 //1-未激活2-已经激活3-已经赠送出去
            })
        }
        else if (app.globalData.pageType == app.globalData.pageType3SelfList) {
            wx.setNavigationBarTitle({
                title: '自用记录'
            })
            this.setData({
                // reqSource:null,//1-购买2-系统赠送3-用户赠送
                reqStatus: 2 //1-未激活2-已经激活3-已经赠送出去
            })
        }
        else if (app.globalData.pageType == app.globalData.pageType4ShareList) {
            wx.setNavigationBarTitle({
                title: '转赠记录'
            })
            this.setData({
                // reqSource:null,//1-购买2-系统赠送3-用户赠送
                reqStatus: 3 //1-未激活2-已经激活3-已经赠送出去
            })
        }
        else if (app.globalData.pageType == app.globalData.pageType5FriendList) {
            wx.setNavigationBarTitle({
                title: '友赠记录'
            })
            this.setData({
                reqSource: 2,//1-购买2-系统赠送3-用户赠送
                reqStatus: 1 //1-未激活2-已经激活3-已经赠送出去
            })
        }
        app.getUserOpedId(this.apiBannerQuery)
    },
    onReady: function (e) {

    },
    onPullDownRefresh: function () {
        if(!this.data.canvasHidden){
            return;
        }
        console.log("onPullDownRefresh")
        this.setData({
            page: 1,
            scrollViewData: null,
            needLoadMore: true
        })
        setTimeout(function () {
            wx.stopPullDownRefresh()
            that.apiBannerQuery()
        }, 1000)
    },

    // 上拉加载回调接口
    onReachBottom: function () {
        console.log("onReachBottom page:" + that.data.page)
        this.loadMore()
    },

    queryServiceTime: function (userCardId) {
        that = this
        var params = {
            service: 'xiche.card.detail.query',
            user_card_id: userCardId,
        }
        netUtil.buildRequest(that, '/luchong/api', params, {
            onPre: function () {
                // netUtil.showLoadingDialog(that);
            },
            onSuccess: function (resp) {
                netUtil.hideLoadingDialog(that);
                console.log('new serviceTime:'+resp.userCardServiceList[0].serviceTime+'|old serviceTime:'+that.data.servicetime );
                if(!that.data.canvasHidden){
                    if(resp.userCardServiceList[0].serviceTime + 1 != that.data.servicetime){
                        setTimeout(function () {
                            that.queryServiceTime(userCardId)
                        },3000)
                    }else {
                        netUtil.showConfirmModal('核销成功，剩余次数'+resp.userCardServiceList[0].serviceTime)
                        that.hiddenCanvas()
                        that.onPullDownRefresh()
                    }
                }

            },
            onError: function (msgCanShow, code, hiddenMsg) {
                // netUtil.hideLoadingDialog(that);
                // netUtil.showAlertDialog("提示", msgCanShow, false, "确定", null, null);
            },
        }).send()
    },

    //事件处理函数
    toCardDetailTap: function (e) {//点击跳转

        if (app.globalData.exitFlag) {//如果flag为true，提示授权
            wx.showModal({
                title: '提示',
                content: '获取授权失败',
                confirmText: '点击退出',
                cancelText: '重新设置',
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateBack({
                            delta: 1
                        })
                    } else if (res.cancel) {
                        wx.openSetting({
                            complete: (res) => {
                                wx.reLaunch({
                                    url: '/pages/index/index',
                                })
                            }
                        })
                    }
                }
            })
            return
        } else {
            console.log('flag:正常')
        }

        if (app.globalData.pageType == app.globalData.pageType1ShowQrList) {


            var size = this.setCanvasSize();//动态设置画布大小
            console.log("usercardnumber:" + e.currentTarget.dataset.usercardnumber)
            if (e.currentTarget.dataset.usercardnumber != undefined && e.currentTarget.dataset.usercardnumber.length > 0) {
                this.setData({
                    canvasHidden: false
                })
                QR.api.draw(e.currentTarget.dataset.usercardnumber, "mycanvas", size.w, size.h);
                this.setData({
                    canvasHidden: false
                })
            } else {
                wx.showToast({
                    title: '卡号不正确',
                    icon: 'fail',
                    duration: 2000
                })
            }

            //定时查询该卡次数是否已减少，减少则提示核销成功
            // var result_time = 0
            this.setData({
                servicetime:e.currentTarget.dataset.servicetime
            })
            this.queryServiceTime(e.currentTarget.dataset.usercardid)
            // var count = 10
            // console.log('servicetime:'+servicetime)
            // console.log('!this.data.canvasHidden:'+!this.data.canvasHidden)
            // console.log('(servicetime -1 != result_time)'+(servicetime -1 != result_time))
            // while (!this.data.canvasHidden && (servicetime -1 != result_time) && count > 0 ){
            //     console.log('in while')
            //     count = count--
            //     that = this
            //     setTimeout(function () {
            //         var params = {
            //             service: 'xiche.card.detail.query',
            //             system_card_number: e.scene,
            //         }
            //         netUtil.buildRequest(that, '/luchong/api', params, {
            //             onPre: function () {
            //                 netUtil.showLoadingDialog(that);
            //             },
            //             onSuccess: function (resp) {
            //                 netUtil.hideLoadingDialog(that);
            //                 result_time = resp.card.serviceTime;
            //             },
            //             onError: function (msgCanShow, code, hiddenMsg) {
            //                 netUtil.hideLoadingDialog(that);
            //                 netUtil.showAlertDialog("提示", msgCanShow, false, "确定", null, null);
            //             },
            //         }).send()
            //     },3000)
            // }
        }
        else if (app.globalData.pageType == app.globalData.pageType2BuyLIst || app.globalData.pageType == app.globalData.pageType5FriendList) {
            var url = "/pages/card-detail/index?detailName=" + e.currentTarget.dataset.cardname
                + "&detailPic=" + e.currentTarget.dataset.pictureurl
                + "&effectiveday=" + e.currentTarget.dataset.effectiveday
                + "&detailText=" + e.currentTarget.dataset.detail
                + "&detailCardId=" + e.currentTarget.dataset.cardid
                + "&detailFee=" + e.currentTarget.dataset.fee
                + "&detailUserCardId=" + e.currentTarget.dataset.usercardid
                + "&detailBtnStatus=2"
            console.log(url)
            wx.navigateTo({
                url: url
            })
        }
        else if (app.globalData.pageType == app.globalData.pageType3SelfList || app.globalData.pageType == app.globalData.pageType4ShareList) {
            var url = "/pages/card-detail/index?detailName=" + e.currentTarget.dataset.cardname
                + "&detailPic=" + e.currentTarget.dataset.pictureurl
                + "&effectiveday=" + e.currentTarget.dataset.effectiveday
                + "&detailText=" + e.currentTarget.dataset.detail
                + "&detailCardId=" + e.currentTarget.dataset.cardid
                + "&detailFee=" + e.currentTarget.dataset.fee
                + "&detailUserCardId=" + e.currentTarget.dataset.usercardid
                + "&detailBtnStatus=-1"
            console.log(url)
            wx.navigateTo({
                url: url
            })
        }


    },

    loadMore: function () {
        that = this;
        console.log("loadmore page:" + that.data.page)
        if (!that.data.needLoadMore) {
            return;
        }
        var params = {
            service: 'xiche.user.card.list',
            page: this.data.page,
            pagesize: this.data.pagesize,
            source: this.data.reqSource,//1-购买2-系统赠送3-用户赠送
            status: this.data.reqStatus//1-未激活2-已经激活3-已经赠送出去
        }
        //请求前先将page+1，如果是失败就-1，否则当只有一项数据时，下拉刷新和底部加载同时调用，page连续用两次1
        that.setData({
            page: this.data.page + 1
        });
        netUtil.buildRequest(that, '/luchong/api', params, {
            onPre: function () {
                console.log("page:" + that.data.page);
                netUtil.showLoadingDialog(that);
            },
            onSuccess: function (json) {
                // wx.stopPullDownRefresh()
                netUtil.hideLoadingDialog(that)
                if (json.dataList != undefined && json.dataList.length > 0) {
                    console.log("page:" + that.data.page + "|resplist.length:" + json.dataList.length)
                    if (that.data.scrollViewData != undefined && that.data.scrollViewData.length > 0) {
                        for (var i = 0; i < json.dataList.length; i++) {
                            that.data.scrollViewData.push(json.dataList[i])
                        }
                    }
                    else {
                        that.data.scrollViewData = json.dataList;
                    }
                    that.setData({
                        scrollViewData: that.data.scrollViewData,
                        // page: that.data.page + 1
                    });
                }
                if (json.dataList == undefined || json.dataList.length < that.data.pagesize) {
                    that.setData({
                        needLoadMore: false
                    });
                }
            },
            onError: function (msgCanShow, code, hiddenMsg) {
                that.setData({
                    page: that.data.page - 1
                });
                // wx.stopPullDownRefresh()
                netUtil.hideLoadingDialog(that);
                netUtil.showAlertDialog("提示", msgCanShow, false, "确定", null, null);

            },
        }).send()
    },


    //QR相关--适配不同屏幕大小的canvas
    setCanvasSize: function () {
        var size = {};
        try {
            var res = wx.getSystemInfoSync();
            var scale = 750 / 500;//不同屏幕下canvas的适配比例；设计稿是750宽
            var width = res.windowWidth / scale;
            var height = width;//canvas画布为正方形
            size.w = width;
            size.h = height;
        } catch (e) {
            // Do something when catch error
            console.log("获取设备信息失败" + e);
        }
        return size;
    },
    hiddenCanvas: function () {
        this.setData({
            canvasHidden: true
        })
    },

    apiBannerQuery: function () {
        console.log("apiBannerQuery exitFlag:" + app.globalData.exitFlag)

        var params = {
            service: 'xiche.banner.query',
            place: 2
        }
        netUtil.buildRequest(that, '/luchong/api', params, {
            onPre: function () {
                console.log("page:" + that.data.page);
                netUtil.showLoadingDialog(that);
            },
            onSuccess: function (data) {
                netUtil.hideLoadingDialog(that);
                that.setData({
                    banners: data.ads
                });
                that.loadMore()

            }, onError: function (msgCanShow, code, hiddenMsg) {
                netUtil.hideLoadingDialog(that);
                netUtil.showAlertDialog("提示", msgCanShow, false, "确定", null, null);

            }
        }).send()
    },

})

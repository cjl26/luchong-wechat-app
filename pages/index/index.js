//index.js
//获取应用实例
var netUtil = require('/../../utils/netUtil.js')
var app = getApp();
var that;
Page({
    data: {
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,

        page: 1,
        pagesize: 5,
        scrollHeight: 0,
        needLoadMore: true,
        keyWork: ""
    },

    //事件处理函数

    // toCardDetailTap: function (e) {//点击跳转
    //
    //     if (app.globalData.exitFlag) {//如果flag为true，提示授权
    //         wx.showModal({
    //             title: '提示',
    //             content: '获取授权失败',
    //             confirmText: '点击退出',
    //             cancelText: '重新设置',
    //             success: function (res) {
    //                 if (res.confirm) {
    //                     wx.navigateBack({
    //                         delta: 1
    //                     })
    //                 } else if (res.cancel) {
    //                     wx.openSetting({
    //                         complete: (res) => {
    //                             wx.reLaunch({
    //                                 url: '/pages/index/index',
    //                             })
    //                         }
    //                     })
    //                 }
    //             }
    //         })
    //         return
    //     } else {
    //         console.log('flag:正常')
    //     }
    //
    //     app.globalData.pageType = app.globalData.pageType0ProduceList
    //     var url = "/pages/card-detail/index?detailName=" + e.currentTarget.dataset.cardname
    //         + "&detailPic=" + e.currentTarget.dataset.pictureurl
    //         + "&detailText=" + e.currentTarget.dataset.detail
    //         + "&detailCardId=" + e.currentTarget.dataset.cardid
    //         + "&detailFee=" + e.currentTarget.dataset.fee
    //         + "&effectiveday=" + e.currentTarget.dataset.effectiveday
    //         + "&servicename=" + e.currentTarget.dataset.servicename
    //         + "&servicetime=" + e.currentTarget.dataset.servicetime
    //         + "&detailBtnStatus=1"
    //     console.log(url)
    //     wx.navigateTo({
    //         url: url
    //     })
    // },

    search: function () {
        this.setData({
            page: 1,
            scrollViewData: null,
            needLoadMore: true
        })
        this.loadMore(this.data.keyWork)
    },

    bindKeyInput: function (e) {
        this.setData({
            keyWork: e.detail.value
        })
    },

    tapBanner: function (e) {//todo 点击跳转
        console.log("tapBanner");
        // if (e.currentTarget.dataset.id != 0) {
        //      wx.navigateTo({
        //          url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
        //      })
        //  }
    },

    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        that = this;
        wx.getSystemInfo({
            success: function (res) {
                console.info(res.windowHeight);
                that.setData({
                    scrollHeight: res.windowHeight
                });
            }
        });

        console.log("apiBannerQuery0")
        // getApp().getUserOpedId(this.apiBannerQuery, false)
        this.apiBannerQuery()
        getApp().getUserOpedId(function () {

        })
    },

    onShow: function () {
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
    },

    onPullDownRefresh: function () {
        that = this
        console.log("onPullDownRefresh page:" + that.data.page)
        this.setData({
            page: 1,
            scrollViewData: null,
            needLoadMore: true,
            banners: null,
            keyWork: null
        })

        setTimeout(function () {
            wx.stopPullDownRefresh()
            console.log("apiBannerQuery3")
            that.apiBannerQuery()
        }, 1000)


    },

    // 上拉加载回调接口
    onReachBottom: function () {
        console.log("onReachBottom page:" + that.data.page)
        this.loadMore()
    },

    apiBannerQuery: function () {
        console.log("apiBannerQuery exitFlag:" + app.globalData.exitFlag)

        var params = {
            service: 'xiche.banner.query',
            place: 1
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
    onReady: function (e) {

    },

    loadMore: function (keyword) {

        console.log("loadmore page:" + that.data.page)
        // if (!that.data.needLoadMore) {
        //     return;
        // }
        // if (that.data.page <= 0) {
        //     that.setData({
        //         page: 1
        //     });
        // }
        // var params = {
        //     service: 'xiche.card.list',
        //     searchText: '',
        //     page: this.data.page,
        //     pagesize: this.data.pagesize
        // }
        // if (keyword != undefined) {
        //     params.searchText = keyword
        // }
        // //请求前先将page+1，如果是失败就-1，否则当只有一项数据时，下拉刷新和底部加载同时调用，page连续用两次1
        // that.setData({
        //     page: this.data.page + 1
        // });
        // netUtil.buildRequest(that, '/luchong/api', params, {
        //     onPre: function () {
        //         console.log("page:" + that.data.page);
        //         netUtil.showLoadingDialog(that);
        //     },
        //     onSuccess: function (json) {
        //
        //         netUtil.hideLoadingDialog(that);
        //         if (json.card != undefined && json.card.length > 0) {
        //             console.log("page:" + that.data.page + "|resplist.length:" + json.card.length)
        //             if (that.data.scrollViewData != undefined && that.data.scrollViewData.length > 0) {
        //                 for (var i = 0; i < json.card.length; i++) {
        //                     that.data.scrollViewData.push(json.card[i])
        //                 }
        //             }
        //             else {
        //                 that.data.scrollViewData = json.card;
        //             }
        //             that.setData({
        //                 scrollViewData: that.data.scrollViewData,
        //                 // page: that.data.page + 1
        //             });
        //         }
        //         if (json.card == undefined || json.card.length < that.data.pagesize) {
        //             that.setData({
        //                 needLoadMore: false
        //             });
        //         }
        //     },
        //     onError: function (msgCanShow, code, hiddenMsg) {
        //         that.setData({
        //             page: that.data.page - 1
        //         });
        //         netUtil.hideLoadingDialog(that);
        //         // netUtil.showAlertDialog("请检查网络(状态码"+code+")", msgCanShow, false, "确定", null, null);
        //         netUtil.showAlertDialog("提示", msgCanShow, false, "确定", null, null);
        //
        //     },
        // }).send()
    },

    onShareAppMessage: function () {
        return {
            title: '喜卡',
            path: '/pages/index/index',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },

})

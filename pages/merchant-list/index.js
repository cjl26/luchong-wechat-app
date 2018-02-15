var netUtil = require('/../../utils/netUtil.js')
var app = getApp()
Page({
    data: {
        currentType: 0,
        tabClass: ["", "", "", "", ""],
        page: 1,
        pagesize: 10,
        scrollHeight: 0,
        needLoadMore: true
    },

    onLoad: function (options) {
        app.getUserOpedId(this.loadmore)
        // 生命周期函数--监听页面加载
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                console.info(res.windowHeight);
                that.setData({
                    scrollHeight: res.windowHeight
                });
            }
        });
    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成

    },
    onShow: function () {
        // 生命周期函数--监听页面显示
        // 获取订单列表
    },

    onPullDownRefresh: function () {

        console.log("onPullDownRefresh")
        this.setData({
            page: 1,
            scrollViewData: null,
            needLoadMore: true
        })
        var that = this
        setTimeout(function () {
            wx.stopPullDownRefresh()
            that.loadmore()
        }, 1000)
    },

    loadmore: function () {

        var that = this;
        if (!that.data.needLoadMore) {
            return;
        }

        wx.getLocation({
            type: 'gcj02',
            success: function(res) {
                var latitude = res.latitude
                var longitude = res.longitude
                // var speed = res.speed
                // var accuracy = res.accuracy

                var params = {
                    service: 'xiche.merchant.list',
                    longitude: longitude,
                    latitude: latitude,
                    page: that.data.page,
                    pagesize: that.data.pagesize
                }
                netUtil.buildRequest(that, '/luchong/api', params, {
                    onPre: function () {
                        console.log("page:" + that.data.page);
                        netUtil.showLoadingDialog(that);
                    },
                    onSuccess: function (json) {
                        netUtil.hideLoadingDialog(that);
                        if (json.merchant != undefined && json.merchant.length > 0) {
                            console.log("page:" + that.data.page + "|merchant.length:" + json.merchant.length)
                            if (that.data.scrollViewData != undefined && that.data.scrollViewData.length > 0) {
                                for (var i = 0; i < json.merchant.length; i++) {
                                    that.data.scrollViewData.push(json.merchant[i])
                                }
                            }
                            else {
                                that.data.scrollViewData = json.merchant;
                            }
                            that.setData({
                                scrollViewData: that.data.scrollViewData,
                                page: that.data.page + 1
                            });
                        }
                        if (json.merchant == undefined || json.merchant.length < that.data.pagesize) {
                            that.setData({
                                needLoadMore: false
                            });
                        }
                    },
                    onError: function (msgCanShow, code, hiddenMsg) {
                        netUtil.hideLoadingDialog(that);
                        netUtil.showAlertDialog("提示", msgCanShow, false, "确定", null, null);

                    },
                }).send()


            }
        })


    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏

    },
    onUnload: function () {
        // 生命周期函数--监听页面卸载

    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数
        //按老板要求只返回10条最近的，无需自动加载
    },
    toDetailTap: function (e) {
        var url = "/pages/merchant-detail/index?detailpicurl=" + e.currentTarget.dataset.detailpicurl
        console.log(url)
        wx.navigateTo({
            url: url
        })
    },



    toMapTap: function (e) {
        console.log('address：'+e.currentTarget.dataset.name+"|"+e.currentTarget.dataset.address)
        console.log('latitude：'+ parseFloat(e.currentTarget.dataset.latitude))
        console.log('longitude：'+parseFloat(e.currentTarget.dataset.longitude))
        wx.openLocation({
            latitude: parseFloat(e.currentTarget.dataset.latitude),
            longitude: parseFloat(e.currentTarget.dataset.longitude),
            scale: 28,
            address: e.currentTarget.dataset.name+"\n"+e.currentTarget.dataset.address
        })

        // wx.getLocation({
        //     type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        //     success: function (res) {
        //         var latitude = res.latitude
        //         var longitude = res.longitude
        //         console.log('latitude：'+latitude)
        //         console.log('longitude：'+longitude)
        //         wx.openLocation({
        //             latitude: latitude,
        //             longitude: longitude,
        //             scale: 28,
        //             address: e.currentTarget.dataset.name
        //         })
        //     }
        // })

        // wx.navigateTo({
        //     url: "/pages/merchant-map-todo/index"
        // })
    },
})
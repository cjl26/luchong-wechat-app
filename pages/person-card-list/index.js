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
        pageType:1,
        canvasHidden:true,
        pageType:1
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
        console.log("pageType:"+app.globalData.pageType)
        this.setData({
            pageType:app.globalData.pageType
        })
        if(app.globalData.pageType == app.globalData.pageType1ShowQrList){
            wx.setNavigationBarTitle({
                title: '核销'
            })
            this.setData({
                // reqSource:null,//1-购买2-系统赠送3-用户赠送
                reqStatus:2 //1-未激活2-已经激活3-已经赠送出去
            })
        }
        else if(app.globalData.pageType == app.globalData.pageType2BuyLIst){
            wx.setNavigationBarTitle({
                title: '购卡记录'
            })
            this.setData({
                reqSource:1,//1-购买2-系统赠送3-用户赠送
                // reqStatus:1 //1-未激活2-已经激活3-已经赠送出去
            })
        }
        else if(app.globalData.pageType == app.globalData.pageType3SelfList){
            wx.setNavigationBarTitle({
                title: '自用记录'
            })
            this.setData({
                // reqSource:null,//1-购买2-系统赠送3-用户赠送
                reqStatus:2, //1-未激活2-已经激活3-已经赠送出去
                attach:4
            })
        }
        else if(app.globalData.pageType == app.globalData.pageType4ShareList){
            wx.setNavigationBarTitle({
                title: '转赠记录'
            })
            this.setData({
                // reqSource:null,//1-购买2-系统赠送3-用户赠送
                reqStatus:3 //1-未激活2-已经激活3-已经赠送出去
            })
        }
        else if(app.globalData.pageType == app.globalData.pageType5FriendList){
            wx.setNavigationBarTitle({
                title: '友赠记录'
            })
            this.setData({
                reqSource:2,//1-购买2-系统赠送3-用户赠送
                // reqStatus:1 //1-未激活2-已经激活3-已经赠送出去
            })
        }
        app.getUserOpedId(this.loadMore)
    },
    onReady: function (e) {

    },
    onPullDownRefresh:function () {

        console.log("onPullDownRefresh")
        this.setData({
            page: 1,
            scrollViewData:null,
            needLoadMore:true
        })
        setTimeout(function () {
            wx.stopPullDownRefresh()
            that.loadMore()
        },1000)
    },

    // 上拉加载回调接口
    onReachBottom: function () {
        console.log("onReachBottom page:" + that.data.page)
        this.loadMore()
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

        if(app.globalData.pageType == app.globalData.pageType1ShowQrList){
            var size = this.setCanvasSize();//动态设置画布大小
            console.log("usercardnumber:"+e.currentTarget.dataset.usercardnumber)
            if(e.currentTarget.dataset.usercardnumber!=undefined && e.currentTarget.dataset.usercardnumber.length>0){
                this.setData({
                    canvasHidden:false
                })
                QR.api.draw(e.currentTarget.dataset.usercardnumber,"mycanvas", size.w, size.h);
                this.setData({
                    canvasHidden:false
                })
            }else {
                wx.showToast({
                    title: '卡号不正确',
                    icon: 'fail',
                    duration: 2000
                })
            }
        }
        else if(app.globalData.pageType == app.globalData.pageType2BuyLIst
            ||app.globalData.pageType == app.globalData.pageType5FriendList){
            var url = "/pages/card-detail/index?detailName=" + e.currentTarget.dataset.cardname
                + "&detailPic=" + e.currentTarget.dataset.pictureurl
                + "&effectiveday=" + e.currentTarget.dataset.effectiveday
                + "&servicename=" + e.currentTarget.dataset.servicename
                + "&servicetime=" + e.currentTarget.dataset.servicetime
                + "&detailText=" + e.currentTarget.dataset.detail
                + "&detailCardId=" + e.currentTarget.dataset.cardid
                + "&detailFee=" + e.currentTarget.dataset.fee
                + "&detailUserCardId=" + e.currentTarget.dataset.usercardid
                + "&cardStatus="+e.currentTarget.dataset.cardstatus
            console.log(url)
            wx.navigateTo({
                url: url
            })
        }
        else if(app.globalData.pageType == app.globalData.pageType3SelfList){
            var url = "/pages/transaction-list/transaction-list?userCardId=" + e.currentTarget.dataset.usercardid
            console.log(url)
            wx.navigateTo({
                url: url
            })
        }else if( app.globalData.pageType == app.globalData.pageType4ShareList){

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
            source:this.data.reqSource,//1-购买2-系统赠送3-用户赠送
            status:this.data.reqStatus,//1-未激活2-已经激活3-已经赠送出去
            attach:this.data.attach//扩展字段（在自用记录时用，status=2attach=4）
        }
        //请求前先将page+1，如果是失败就-1，否则当只有一项数据时，下拉刷新和底部加载同时调用，page连续用两次1
        that.setData({
            page: this.data.page + 1
        });
        netUtil.buildRequest(that, '/xicatcard/api', params, {
            onPre: function () {
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
                    var expireLineAlreadyShow = false
                    for(var i = 0;i<that.data.scrollViewData.length;i++){
                        if(that.data.scrollViewData[i].is_expired == '1'){
                            if(expireLineAlreadyShow == false){
                                expireLineAlreadyShow = true
                            }else {
                                that.data.scrollViewData[i].is_expired = '0'
                            }
                        }
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
    }

})

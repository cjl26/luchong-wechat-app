var netUtil = require('/../../utils/netUtil.js')
var app = getApp()
Page({
    data: {
        scrollHeight: 0,
    },
    onLoad: function (options) {
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
        this.setData({
            detailPicUrl:options.detailpicurl
        })
    },

})
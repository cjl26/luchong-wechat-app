var netUtil = require('/../../utils/netUtil.js')
var that;

// pages/group/index.js
var app = getApp();
var previewUrl = "";
Page({
    data: {
        currentTab: 0,
        scrollTop: 0,
        page: 0,
        groupData: [],
        loading: true,
        animal_avatar : null
    },
    onLoad: function (options) {
        var systemInfo = wx.getSystemInfoSync()
        this.setData({
            windowHeight: systemInfo.windowHeight
        })
    },
    onShow: function () {
        this.setCurrentData()
    },

    setCurrentData: function () {
        if (!this.data.loading) {
            return false
        }

        this.setData({
            userInfo: app.globalData.userInfo
        })

        var self = this;
    },



    // 滑动切换tab
    avatarTap: function () {
        console.log("avatarTap");
        var that = this
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths[0];
                previewUrl = tempFilePaths;
                const animal_avatar = tempFilePaths;
                console.log("tempFilePaths = " + tempFilePaths);
                that.setData({
                    animal_avatar: tempFilePaths
                })
                console.log("url = " + `/pages/animal-add/upload/upload?src=${animal_avatar}`)

                wx.navigateTo({
                    url: `/pages/animal-add/upload/upload?src=${animal_avatar}`
                })
                //that.preview();
            },
            fail: function () {
            }
        })

    }


})
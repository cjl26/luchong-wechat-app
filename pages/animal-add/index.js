var timeUtil = require('/../../utils/TimeUtil.js')
var inputValidateUtil = require('/../../utils/InputValidateUtil.js')
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
        animal_avatar: null,
        birthday: null,
        nickName: "",
        weight: "",
        signature: "",
        type: "",
        gender: "",
        sterilization: ""

    },
    onLoad: function (options) {
        var systemInfo = wx.getSystemInfoSync()
        this.setData({
            windowHeight: systemInfo.windowHeight,
            today: timeUtil.getNowFormatDate()
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


    // 切换头像
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
                //that.setData({
                //    animal_avatar: tempFilePaths
                //})
                console.log("url = " + `/pages/animal-add/upload?src=${animal_avatar}`)

                wx.navigateTo({
                    url: `/pages/animal-add/upload?src=${animal_avatar}`
                })
                //that.preview();
            },
            fail: function () {
            }
        })

    },

    /**
     * 姓名输入
     */
    nameInput: function (e) {
        var isTooLong = inputValidateUtil.lengthChecker(e.detail, 16);
        this.setData({
            nickName: e.detail.value
        })
        if (isTooLong) {
            wx.showToast({
                title: '太长啦',
                icon: null,
                duration: 500,
                mask: false
            })
        }
        console.log("this = " + JSON.stringify(this));
    },

    /**
     * 体重输入
     */
    weightInput: function (e) {

        var floatNumberChecker = inputValidateUtil.floatNumberChecker(e.detail.value);
        console.log("floatNumberChecker = " + floatNumberChecker);
        if (!floatNumberChecker) {
            //console.log("substr = " + e.detail.value.substr(0, e.detail.value.length - 1))
            //e.detail.value = e.detail.value.substr(0, e.detail.value.length - 1);
            //console.log("e.detail.value = " + e.detail.value);
            this.setData({
                weight: e.detail.value.substr(0, e.detail.value.length - 1)
            })

            if (e.detail.value.length > 0) {
                wx.showToast({
                    title: '请输入数字',
                    icon: null,
                    duration: 500,
                    mask: false
                })
            }

            return;
        }

        var isTooLong = inputValidateUtil.lengthChecker(e.detail, 10);

        this.setData({
            weight: e.detail.value
        })
        console.log("this = " + JSON.stringify(this));
        if (isTooLong) {
            wx.showToast({
                title: '太长啦',
                icon: null,
                duration: 500,
                mask: false
            })
        }
    },

    /**
     * 签名输入
     */
    signatureInput: function (e) {
        var isTooLong = inputValidateUtil.lengthChecker(e.detail, 64);
        this.setData({
            signature: e.detail.value
        })
        if (isTooLong) {
            wx.showToast({
                title: '太长啦',
                duration: 500,
                mask: false
            })
        }
        console.log("this = " + JSON.stringify(this));
    },

    /**
     * 选择日期
     * @param e
     */
    bindBirthDayChange: function (e) {
        this.setData({
            birthday: e.detail.value
        })
    },

    /**
     * 选择猫猫
     * @param e
     */
    catType: function (e) {
        this.setData({
            type: '1'
        })
        //console.log("catType");
        //console.log("e = " + JSON.stringify(e));
    },

    /**
     * 选择狗
     * @param e
     */
    dogType: function (e) {
        this.setData({
            type: '2'
        })
        //console.log("catType");
        //console.log("e = " + JSON.stringify(e));
    },

    /**
     * 男
     * @param e
     */
    maleGender: function (e) {
        this.setData({
            gender: '1'
        })
    },

    /**
     * 女
     * @param e
     */
    femaGender: function (e) {
        this.setData({
            gender: '2'
        })
    },

    /**
     * 已经绝育
     * @param e
     */
    isSterilization: function (e) {
        this.setData({
            sterilization: '1'
        })
    },

    /**
     * 未绝育
     * @param e
     */
    notSterilization: function (e) {
        this.setData({
            sterilization: '2'
        })
    },

    /**
     * 确定输入
     */
    confirmTap: function () {
      console.log("confirmTap");
    }

})
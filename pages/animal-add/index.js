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
            today: this.getNowFormatDate()
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
        var isTooLong = this.lengthChecker(e.detail, 16);
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

        var floatNumberChecker = this.floatNumberChecker(e.detail.value);
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

        var isTooLong = this.lengthChecker(e.detail, 10);

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
        var isTooLong = this.lengthChecker(e.detail, 64);
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

    maleGender: function (e) {
        this.setData({
            gender: '1'
        })
    },

    femaGender: function (e) {
        this.setData({
            gender: '2'
        })
    },

    isSterilization: function (e) {
        this.setData({
            sterilization: '1'
        })
    },

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
    },


    /**
     * 放到util中
     * @returns {string}
     */
    getNowFormatDate: function () {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    },

    /**
     * 检查长度 - 放到 util中
     * @param stringInput
     * @param maxLen
     * @returns {boolean}
     */
    lengthChecker: function (stringInput, maxLen) {
        var w = 0;
        var tempCount = 0;
        //length 获取字数数，不区分汉子和英文
        for (var i = 0; i < stringInput.value.length; i++) {
            //charCodeAt()获取字符串中某一个字符的编码
            var c = stringInput.value.charCodeAt(i);
            //单字节加1
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                w++;
            } else {
                w += 2;
            }
            if (w > maxLen) {
                stringInput.value = stringInput.value.substr(0, i);
                return true;
                break;
            }
        }
        return false;
    },

    /**
     * https://www.cnblogs.com/maxm/p/6743989.html
     * 判断是否浮点数
     * @param valueInput
     * @returns {boolean}
     */
    floatNumberChecker: function (valueInput) {
        if (valueInput == '') {
            return false;
        }
        valueInput = this.valueTrim(valueInput);

        if (this.numberChecker(valueInput)) {
            return true;
        }
        if (valueInput.length >= 2) {
            //console.log("valueInput.indexOf(\".\") = " + valueInput.indexOf("."));
            //console.log("valueInput.length = " + valueInput.length);

            if (valueInput.substr(0, 1) == "0") {
                if (valueInput.substr(0, 2) != "0.") {
                    return false;
                }
                else {
                    if (valueInput.length == 2) {
                        return true;
                    }
                }
            } else if (valueInput.indexOf(".") == valueInput.length - 1) {
                //当前输入的的小数点
                return true;
            }
        }
        var reg = /^\d+(\.\d+)?$/;
        return reg.test(valueInput);
    },

    /**
     * 判断是否数字
     * @param numberValue
     * @returns {boolean}
     */
    numberChecker: function (numberValue) {
        //定义正则表达式部分
        var reg1 = /^[0-9]{0,}$/;
        var reg2 = /^[1-9]{1}[0-9]{0,}$/;
        //alert(numberValue);
        if (numberValue == null || numberValue.length == 0) {
            return false;
        }
        numberValue = this.valueTrim(numberValue);
        //判断当数字只有1位时
        if (numberValue.length < 2) {
            return reg1.test(numberValue);
        }
        return reg2.test(numberValue);
    },

    valueTrim: function (stringInput) {
        return stringInput.replace(/(^\s*)|(\s*$)/g, "");
    }

})
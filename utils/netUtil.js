/**
 * Created by Administrator on 2016/10/13 0013.
 */

function Actions() {

};
const request_firstIn = 1;
const request_refresh = 2;
const request_loadmore = 3;
const request_none = 0;

Actions.request_firstIn = 1;
Actions.request_refresh = 2;
Actions.request_loadmore = 3;
Actions.request_none = 0;

const code_unlogin = 5;
const code_unfound = 2;


function requestConfig() {
    this.page;  //页面对象
    this.urlTail = '';
    this.params = {};
    this.netMethod = 'POST';
    this.callback = {
        onPre: function () {
        },
        onEnd: function () {

        },
        onSuccess: function (data) {
        },
        onEmpty: function () {
        },
        onError: function (msgCanShow, code, hiddenMsg) {
        },
        onUnlogin: function () {
            this.onError("您还没有登录或登录已过期,请登录", 5, '')
        },
        onUnFound: function () {
            this.onError("您要的内容没有找到", 2, '')
        }
    };

    this.setMethodGet = function () {
        this.netMethod = 'GET';
        return this;
    }


    this.send = function () {
        request(this);
    }
}

//todo 回调,拷贝这段代码去用--buildRequest
/*

  {
     onPre: function(){},
     onEnd: function(){
           hideLoadingDialog(page);
     },
     onSuccess:function (data){},
     onEmpty : function(){},
     onError : function(msgCanShow,code,hiddenMsg){},
     onUnlogin: function(){
     this.onError("您还没有登录或登录已过期,请登录",5,'')
     },
     onUnFound: function(){
     this.onError("您要的内容没有找到",2,'')
     }
  }
* */

/**
 * 注意,此方法调用后还要调用.send()才是发送出去.
 * @param page
 * @param urlTail
 * @param params
 * @param callback  拷贝上方注释区的代码使用
 * @returns {requestConfig}
 */
function buildRequest(page, urlTail, params, callback) {
    var config = new requestConfig();
    config.page = page;
    config.urlTail = urlTail;

    if (params.service == null || params.service == '') {
        showFailToast(new Object(), "service不能为空")
        return null;
    }
    //公共参数设置
    if (getApp().globalData.openid == null || getApp().globalData.openid == '') {
        params.openid = '0'
    } else {
        params.openid = getApp().globalData.openid;
    }

    params.api_version = getApp().globalData.api_version;
    params.charset = getApp().globalData.charset;
    params.brand = getApp().globalData.brand;
    params.model = getApp().globalData.model;
    params.language = getApp().globalData.language;
    params.version = getApp().globalData.version;
    params.system = getApp().globalData.system;
    params.platform = getApp().globalData.platform;

    params.timestamp = getNowFormatDate();


    config.params = params;
    log(config.params)

    //config.callback = callback;

    if (isFunction(callback.onPre)) {
        config.callback.onPre = callback.onPre;
    }

    if (isFunction(callback.onEnd)) {
        config.callback.onEnd = callback.onEnd;
    }

    if (isFunction(callback.onEmpty)) {
        config.callback.onEmpty = callback.onEmpty;
    }

    if (isFunction(callback.onSuccess)) {
        config.callback.onSuccess = callback.onSuccess;
    }

    if (isFunction(callback.onError)) {
        config.callback.onError = callback.onError;
    }

    if (isFunction(callback.onUnlogin)) {
        config.callback.onUnlogin = callback.onUnlogin;
    }
    if (isFunction(callback.onUnFound)) {
        config.callback.onUnFound = callback.onUnFound;
    }
    return config;
}

function log(msg) {
    var isDebug = getApp().globalData.isDebug;
    if (isDebug) {
        console.log(msg);
    }
}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}

function isFunction(value) {
    if (typeof ( value) == "function") {
        return true;
    } else {
        return false;
    }
}


function json2Form(json) {
    var str = [];
    for (var p in json) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
    }
    return str.join("&");
}


function isOptStrNull(str) {
    if (str == undefined || str == null || str == '' || str == 'null' || str == '[]' || str == '{}') {
        return true
    } else {
        return false;
    }
}

function objToStr(appendixStr, obj) {
    var str = "";
    for (var p in obj) { // 方法
        if (typeof ( obj [p]) == "function") {
            // obj [ p ]() ; //调用方法

        } else if (obj [p] != undefined && obj [p] != null) { // p 为属性名称，obj[p]为对应属性的值
            str += p + "=" + obj [p] + appendixStr;
        }
    }
    return str;
}

// 封装网络请求通用的处理: 参数拼接和结果处理

/**
 * @deprecated 已过期,请使用buildRequest().send()来发送请求
 * @param requestConfig
 */
function request(requestConfig) {

    //检验三个公有参数并处理

    if (requestConfig.params.session_id == null || requestConfig.params.session_id == '') {
        delete  requestConfig.params.session_id;
    }
    if (requestConfig.params.pageIndex == 0 || requestConfig.params.pageSize == 0) {
        delete requestConfig.params.pageIndex;
        delete  requestConfig.params.pageSize;
    }


    // var paramStr = objToStr("&", requestConfig.params);//拼接请求参数成一个String    json2Form(requestConfig.params);
    if (isFunction(requestConfig.callback.onPre)) {
        requestConfig.callback.onPre();//请求发出前
    }

    //根据请求方法来拼接url:
    var wholeUrl = requestConfig.urlTail;
    if (wholeUrl.indexOf("http://") < 0) {
        wholeUrl = getApp().globalData.apiHeadUrl + requestConfig.urlTail;
    }


    var contentType = '';
    if (requestConfig.netMethod == 'GET') {
        wholeUrl = wholeUrl + "?" + paramStr;
        contentType = 'application/json';
    } else if (requestConfig.netMethod == 'POST') {
        requestConfig.params;//行不通,str传递不过去,微信开发工具的bug
        // data:requestConfig.params; //这时传给服务器的是jsonObject,不符合本项目中的要求
        // wholeUrl = wholeUrl + "?" + paramStr;//目前只能以get请求的方式发送post,这个还需要服务器支持get转post,fuck
        // contentType = "application/x-www-form-urlencoded";
    }

    //todo 能够使用cache-control吗?以目前这工具的尿性估计是不能吧
    wx.request({
        url: wholeUrl,
        method: requestConfig.netMethod,
        head: {
            'Content-Type': contentType
        },
        data: requestConfig.params,
        success: function (res) {
            log('url:'+wholeUrl+'\n'+'request-->:'+JSON.stringify(requestConfig.params)+'\n'+'resp----->:'+JSON.stringify(res.data));
            if (isFunction(requestConfig.callback.onEnd)) {
                requestConfig.callback.onEnd();//请求发出前
            }
            if (res.statusCode = 200) {
                var responseData = res.data;
                //新api

                var code = responseData.result_code;
                var msg = responseData.error_message;

                if (code == '0' || code == 0 ) {
                    var isDataNull = isOptStrNull(responseData);

                    if (isDataNull) {
                        requestConfig.callback.onEmpty();
                    } else {
                        requestConfig.callback.onSuccess(responseData);
                    }
                } else if (code == 2) {
                    if (isOptStrNull(msg)) {
                        requestConfig.callback.onUnFound();
                    } else {
                        requestConfig.callback.onError(msg, code, msg);
                    }

                } else if (code == 5) {

                    if (isOptStrNull(msg)) {
                        requestConfig.callback.onUnlogin();
                    } else {
                        requestConfig.callback.onError(msg, code, msg);
                    }

                } else {
                    var isMsgNull = isOptStrNull(msg);
                    if (isMsgNull) {
                        var isCodeNull = isOptStrNull(code);
                        if (isCodeNull) {
                            requestConfig.callback.onError("数据异常！,请核查", code, '');
                        } else {
                            requestConfig.callback.onError("数据异常！,错误码为" + code, code, '');
                        }

                    } else {
                        requestConfig.callback.onError(msg, code, '');
                    }
                }
            } else if (res.statusCode >= 500) {
                requestConfig.callback.onError("服务器异常！("+res.statusCode+")", res.statusCode, '');
            } else if (res.statusCode >= 400 && res.statusCode < 500) {
                requestConfig.callback.onError("没有找到内容("+res.statusCode+")", res.statusCode, '');
            } else {
                requestConfig.callback.onError("网络返回异常！("+res.statusCode+")", res.statusCode, '');
            }
        },
        fail: function (res) {
            if (isFunction(requestConfig.callback.onEnd)) {
                requestConfig.callback.onEnd();//请求发出前
            }
            console.log(res)
            if(res.statusCode == undefined){
                res.statusCode = res.errMsg;
            }
            requestConfig.callback.onError("网络请求超时("+ res.statusCode+","+requestConfig.urlTail+","+requestConfig.params.timestamp+","+requestConfig.params.service+")", res.statusCode, '');

        },
        complete: function (res) {
            // requestConfig.callback.onEnd();


            // that.setData({hidden:true,toast:true});
        }
    })
}


function netStateBean() {
    this.toastHidden = true,
        this.toastMsg = '',

        this.loadingHidden = false,
        this.emptyMsg = '暂时没有内容,去别处逛逛吧',
        this.emptyHidden = true,
        this.errorHidden = true,
        this.errorMsg = '',

        this.loadmoreMsg = '加载中...',
        this.loadmoreHidden = true,

        this.contentHidden = true,

        // this.contentHeight='600rpx',
        this.toastChange = function (e) {
            dismissToast()

        }
    // this.contentHeight='100%',


}

//显示toast的方法
function showSuccessToast(that, msg) {
    /* var bean = that.data.netStateBean;
     bean.toastMsg = msg;
     bean.toastHidden = false;
     that.setData({
         netStateBean: bean
     });*/

    wx.showToast({
        title: msg,
        icon: 'success',
        duration: 1500
    })
}

function showFailToast(that, msg) {
    /*  var bean = that.data.netStateBean;
      bean.toastMsg = msg;
      bean.toastHidden = false;
      that.setData({
          netStateBean: bean
      });*/

    wx.showToast({
        title: msg,
        icon: 'success',
        duration: 1500
    })

}

function dismissToast(that) {
    /* var bean = that.data.netStateBean;
     bean.toastHidden = true;
     that.setData({
         netStateBean: bean
     });*/

    wx.hideToast();

}

function stopPullRefresh(that) {
    /* var bean = that.data.netStateBean;
     bean.toastHidden = true;
     that.setData({
     netStateBean: bean
     });*/

    wx.stopPullDownRefresh();

}

function hideKeyBoard(that) {
    wx.stopPullDownRefresh();
}


//加载对话框的显示和隐藏
function showLoadingDialog(that) {
    /*var bean = that.data.netStateBean;
    bean.loadingHidden = false;
    that.setData({
        netStateBean: bean
    });*/

    wx.showToast({
        title: "加载中",
        icon: 'loading',
        duration: 10000
    })

}

function hideLoadingDialog(that) {
    /*var bean = that.data.netStateBean;
    bean.loadingHidden = true;
    that.setData({
        netStateBean: bean
    });*/

    wx.hideToast();

}

//loadmore的状态与信息
function loadMoreError(that) {
    var bean = that.data.netStateBean;
    bean.loadmoreHidden = false;
    bean.loadmoreMsg = '加载出错,请上拉重试';
    that.setData({
        netStateBean: bean
    });

}

function loadMoreStart(that) {

    var bean = that.data.netStateBean;
    bean.loadmoreHidden = false;
    bean.loadmoreMsg = '加载中...';
    that.setData({
        netStateBean: bean
    });

}

function loadMoreNoData(that) {
    var bean = that.data.netStateBean;
    bean.loadmoreHidden = false;
    bean.loadmoreMsg = '没有数据了';
    that.setData({
        netStateBean: bean
    });
}

//以下三个方法是用于页面状态管理
function showEmptyPage(that) {
    hideLoadingDialog(that);
    var bean = that.data.netStateBean;
    bean.emptyHidden = false;
    bean.loadingHidden = true;
    var empty = that.data.emptyMsg;
    if (isOptStrNull(empty)) {
        empty = "没有内容,去别的页面逛逛吧"
    }
    bean.emptyMsg = empty;
    bean.contentHidden = true;
    bean.errorHidden = true;
    that.setData({
        netStateBean: bean
    });
}

function showErrorPage(that, msg) {
    hideLoadingDialog(that);
    var bean = that.data.netStateBean;
    bean.errorHidden = false;
    bean.errorMsg = msg;
    bean.loadingHidden = true;
    bean.contentHidden = true;
    that.setData({
        netStateBean: bean
    });

}

function showContent(that) {
    hideLoadingDialog(that);
    var bean = that.data.netStateBean;
    bean.errorHidden = true;
    bean.emptyHidden = true;
    bean.contentHidden = false;
    bean.loadingHidden = true;
    that.setData({
        netStateBean: bean
    });
}

function loadMoreError1(that) {
    var bean = that.data.netStateBean1;
    bean.loadmoreHidden = false;
    bean.loadmoreMsg = '加载出错,请上拉重试';
    that.setData({
        netStateBean1: bean
    });

}

function loadMoreStart1(that) {

    var bean = that.data.netStateBean1;
    bean.loadmoreHidden = false;
    bean.loadmoreMsg = '加载中...';
    that.setData({
        netStateBean1: bean
    });

}

function loadMoreNoData1(that) {
    var bean = that.data.netStateBean1;
    bean.loadmoreHidden = false;
    bean.loadmoreMsg = '没有数据了';
    that.setData({
        netStateBean1: bean
    });
}

//以下三个方法是用于页面状态管理
function showEmptyPage1(that) {
    hideLoadingDialog(that);
    var bean = that.data.netStateBean1;
    bean.emptyHidden = false;
    bean.loadingHidden = true;
    var empty = that.data.emptyMsg;
    if (isOptStrNull(empty)) {
        empty = "没有内容,去别的页面逛逛吧"
    }
    bean.emptyMsg = empty;
    bean.contentHidden = true;
    bean.errorHidden = true;
    that.setData({
        netStateBean1: bean
    });

}

function showErrorPage1(that, msg) {
    hideLoadingDialog(that);
    var bean = that.data.netStateBean1;
    bean.errorHidden = false;
    bean.errorMsg = msg;
    bean.loadingHidden = true;
    bean.contentHidden = true;
    that.setData({
        netStateBean1: bean
    });

}

function showContent1(that) {
    hideLoadingDialog(that);
    var bean = that.data.netStateBean1;
    bean.errorHidden = true;
    bean.emptyHidden = true;
    bean.contentHidden = false;
    bean.loadingHidden = true;
    that.setData({
        netStateBean1: bean
    });
}


/**
 * 调用微信的支付
 */
function pay(page, orderId, callback) {

    //先让服务器生成需要的字段,然后
    var params = new Object();
    params.orderId = orderId;
    params.payway = 4;
    buildRequest(page, 'order/preparePay/v1.json', params, {
        onPre: function (page) {
            showLoadingDialog(page);
        },
        onSuccess: function (data) {

            //调用微信支付
            wx.requestPayment({
                'timeStamp': data.timestamp,
                'nonceStr': data.noncestr,
                'package': data.package,
                'signType': 'MD5',
                'paySign': data.sign,
                'success': function (res) {
                    console.log(res);
                    callback.onSuccess('success')
                    hideLoadingDialog(page)
                    showSuccessToast(page, "支付成功")
                },
                'fail': function (res) {
                    console.log(res);
                    callback.onError("支付失败了", 0, res.toString());
                    hideLoadingDialog(page)
                }
            })
        },
        onEmpty: function () {
            callback.onEmpty()
        },
        onError: function (msgCanShow, code, hiddenMsg) {
            callback.onError(msgCanShow, code, hiddenMsg);
            showSuccessToast(page, msgCanShow)
        },
        onUnlogin: function () {
            this.onError("您还没有登录或登录已过期,请登录", code_unlogin, '')
        },
        onUnFound: function () {
            this.onError("您要的内容没有找到", code_unfound, '')
        }
    }).send();


}

/*public int type;
 public int id;
 public String transId;
 public int goodsId;
 public String goodsName;
 public String fee;
 public String userName;
 public int status;*/


function newPayInfo(type, id, transId, goodsId, goodsName, fee, userName, status) {
    this.type = type;
    this.id = id;
    this.transId = transId;
    this, goodsId = goodsId;
    this.goodsName = goodsName;
    this.fee = fee;
    this.userName = userName;
    this.status = status
}


/**
 * 创建微课订单
 */
function createAudioOrder(that, audioId, discountCode, listener) {
    var url = 'order/voice/create/v1.json';
    var params = {};
    params.voiceId = audioId;
    if (!isOptStrNull(discountCode)) {
        params.promoCode = discountCode;
    }
    buildRequest(that, url, params, {
        onPre: function () {
            showLoadingDialog(that);
        },
        onEnd: function () {
            hideLoadingDialog(that);
        },
        onSuccess: function (data) {
            listener.onSuccess(data);
        },
        onEmpty: function () {
            listener.onError("数据为空");
        },
        onError: function (msgCanShow, code, hiddenMsg) {
            listener.onError(msgCanShow);
        },
        onUnlogin: function () {
            this.onError("您还没有登录或登录已过期,请登录", 5, '')
        },
        onUnFound: function () {
            this.onError("您要的内容没有找到", 2, '')
        }
    }).send();

}
function showConfirmModal(msg) {
    this.showAlertDialog('提示',msg,false,'确定',null,null)
}

function showConfirmModalCallback(msg,confirmtext,callback) {
    this.showAlertDialog('提示',msg,false,confirmtext,null,callback)
}

function showAlertDialog(title, msg, showCancle, confirmText, confirmColor, listener) {
    if (isOptStrNull(confirmColor)) {
        confirmColor = '#3CC51F';
    }
    wx.showModal({
        title: title,
        content: msg,
        success: function (res) {
            if (res.confirm) {
                console.log('用户点击确定')
                if(listener!=undefined)
                    listener();
            }
        },
        showCancel: showCancle,
        confirmText: confirmText,
        confirmColor: confirmColor
    })
}

function loginTest(username, password) {
    var url = encodeURI("http://test.qxinli.com/api.php?s=/user/login");
    var params = new Object();
    params.username = username;
    params.password = password;
    params.platform = "Android";
    buildRequest(new Object(), url, params, {
        onPre: function (page) {
        },
        onSuccess: function (data) {
            // getApp().globalData.session_id = data.session_id;
            // getApp().globalData.uid = data.uid;
            // getApp().globalData.isLogin = true;
        },
        onEmpty: function () {
        },
        onError: function (msgCanShow, code, hiddenMsg) {
        },
        onUnlogin: function () {
            this.onError("您还没有登录或登录已过期,请登录", code_unlogin, '')
        },
        onUnFound: function () {
            this.onError("您要的内容没有找到", code_unfound, '')
        }
    }).setApiOld().send();
}


module.exports = {
    request: request,
    requestConfig: requestConfig,
    // viewBeansForSimpleList:viewBeansForSimpleList
    netStateBean: netStateBean,

    buildRequest: buildRequest,
    action: Actions,


    showContent: showContent,
    showErrorPage: showErrorPage,
    showEmptyPage: showEmptyPage,
    loadMoreNoData: loadMoreNoData,
    loadMoreStart: loadMoreStart,
    loadMoreError: loadMoreError,
    hideLoadingDialog: hideLoadingDialog,
    showLoadingDialog: showLoadingDialog,
    showSuccessToast: showSuccessToast,
    dismissToast: dismissToast,
    showFailToast: showFailToast,

    pay: pay,
    newPayInfo: newPayInfo,
    loginTest: loginTest,
    createAudioOrder: createAudioOrder,
    showAlertDialog: showAlertDialog,
    showConfirmModal: showConfirmModal,
    showConfirmModalCallback: showConfirmModalCallback,
    stopPullRefresh: stopPullRefresh,
    hideKeyBoard: hideKeyBoard,

    loadMoreError1: loadMoreError1,
    loadMoreStart1: loadMoreStart1,
    loadMoreNoData1: loadMoreNoData1,
    showEmptyPage1: showEmptyPage1,
    showErrorPage1: showErrorPage1,
    showContent1: showContent1,
    getNowFormatDate: getNowFormatDate


}
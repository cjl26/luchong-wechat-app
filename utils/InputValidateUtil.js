/**
 * 去掉空格
 * @param stringInput
 * @returns {string | void}
 */
function valueTrim(stringInput) {
    return stringInput.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 判断是否数字
 * @param numberValue
 * @returns {boolean}
 */
function numberChecker(numberValue) {
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
}

/**
 * https://www.cnblogs.com/maxm/p/6743989.html
 * 判断是否浮点数
 * @param valueInput
 * @returns {boolean}
 */
function floatNumberChecker(valueInput) {
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
}

/**
 * 检查长度
 * @param stringInput
 * @param maxLen
 * @returns {boolean}
 */
function lengthChecker(stringInput, maxLen) {
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
}

/**
 * 判断是否全部参数都已经填上
 * @param params
 */
function paramsChecker(params) {
    //var returnParams = new Array();
    for (var key in params) {
        //console.log(key + ":" + params[key]);
        var value = params[key];
        if (value == null || value.length == 0) {
            //console.log("add key = " + key);
            return key;
            //returnParams[key] = value;
            //console.log("returnParams add = " + JSON.stringify(returnParams))
        }
    }
    return "";
    //console.log("returnParams = " + JSON.stringify(returnParams))
    //return returnParams;
}

module.exports = {
    valueTrim: valueTrim,
    numberChecker: numberChecker,
    floatNumberChecker: floatNumberChecker,
    lengthChecker: lengthChecker,
    paramsChecker: paramsChecker
}
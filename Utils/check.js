var app = getApp()
// 检测是否有输入  
function checkIsNotNull(content){  
    return (content && content!=null)  
}  
  
// 检测手机号
function isMobileNumber(phone) {  
    var flag = false;  
    var message = "";  
    var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[4-9]{1})|(18[0-9]{1})|(199))+\d{8})$/;  
    if (phone == '') {  
        // console.log("手机号码不能为空");  
        message = "手机号码不能为空！";  
    } else if (phone.length != 11) {  
        //console.log("请输入11位手机号码！");  
        message = "请输入11位手机号码！";  
    } else if (!myreg.test(phone)) {  
        //console.log("请输入有效的手机号码！");  
        message = "请输入有效的手机号码！";  
    } else {  
        flag = true;  
    }  
    if (message != "") {  
        my.showToast({
         
         content: message,
         duration: app.showToastDuring
        }); 
    }  
    return flag;  
}  
  
// 比较两个内容是否相等  
function isContentEqual(content_1, content_2){  
    if(!checkIsNotNull(content_1)){  
        return false  
    }  
  
    if(content_1 === content_2){  
        return true  
    }  
  
    return false  
}  
module.exports.isMobileNumber = isMobileNumber;
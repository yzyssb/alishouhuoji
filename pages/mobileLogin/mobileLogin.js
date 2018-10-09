var check = require("../../Utils/check.js");
var Base64 = require('../../Libs/base64.js');
var Request = require('../../Utils/Request.js');
var app = getApp()
// var step = 1 // 当前操作的step  
var maxTime = 60
var currentTime = maxTime //倒计时的事件（单位：s）  

var phoneNum = ''
var vertify_code = ''
var isCanClick = true
var interval
Page({
  data: {
    message: '获取验证码',
  },
  onShow() {
    phoneNum = app.phoneNum;
    this.setData({
      phoneNum: phoneNum
    })
  },
  onLoad() {
    my.getAuthCode({
      scopes: 'auth_user',
      success: (res) => {
        my.getAuthUserInfo({
          success: (userInfo) => {
            app.aliUserInfo = userInfo
            my.setStorageSync({
              key: 'aliUserInfo',
              data: userInfo,
            });
            //  if (app.userInfo) {
            //    app.userInfo.nickName = userInfo.nickName
            //    app.userInfo.avatar = userInfo.avatar
            //  }
          }
        });
      },
    });

  },
  //点击登录
  listenerLogin: function () {
    // this.testLogin()
    if (!this.isMobileNumber(phoneNum)) {
      return;
    }
    if (vertify_code == '' || vertify_code == null) {
      my.showToast({
        content: "验证码不能为空",
        duration: app.showToastDuring
      });
      return;
    }
    var that = this

    //var url = app.globalData.user_url + 'user/login'
    //var url = app.globalData.user_url + 'vending/register'
    // var object = {
    //   mobile: phoneNum,
    //   smsCode: vertify_code,
    //   //loginType: 2,
    //   //client: 1
    //   client: 5
    // }
    var userInfo=my.getStorageSync({
      key: 'aliUserInfo',
    });
    console.log(userInfo)
    var url = app.globalData.user_url + 'vendingRegister'
    var object = {
      mobile: phoneNum,
      smsCode: vertify_code,
      client:5,
      nickname: userInfo.data.nickName, 
      headimg: userInfo.data.avatar,
      loginType: 2// 1、账号密码登陆2、手机验证码登陆3、自动登录
    }
    console.log(object)
    //JSON.stringify(object);
    var params = {
      data: Base64.base64_encode(JSON.stringify(object)),
      nickname: userInfo.data.nickName
    };
    Request.request(url, params, '正在登录', function (res) {
      console.log(res);
      if (res.code == '0') {
        console.log('登录成功');
        clearInterval(interval)
        currentTime = maxTime
        isCanClick = true
        that.setData({
          message: '重新获取'
        })
        //登录成功存入本地
        var userInfo = res.data
        my.setStorageSync({
          key: 'userInfo',
          data: userInfo,
        });
        app.getUserInfo()
        my.navigateBack({
          delta: 5
        })
      } else {
        my.showToast({
          content: res.message,
          duration: app.showToastDuring,
        });
      }
      
    }, function () {
      my.showToast({
        content: '登录失败',
        duration: app.showToastDuring
      })
    }
    );
  },
  gotoRegister: function (e) {
    my.navigateTo({
      url: '../mobileRegister/mobileRegister',
    })
  },
  gotoPasswordLogin: function () {
    my.navigateTo({
      url: '../passwordLogin/passwordLogin',
    })

  },
  //获取验证码
  get_vertify_code: function () {
    //   this.change_get_code_button(this);
    if (!isCanClick) {
      return;
    }
    if (!this.isMobileNumber(phoneNum)) {
      return;
    }
    isCanClick = false
    var that = this
    var url = app.globalData.user_url + 'sms/getsms'
    var object = {
      mobile: phoneNum,
      sendType: 1,
      isCheckMobile: 0,
      purposeType: 5
    }
    console.log(url);
    console.log(Base64.base64_encode(JSON.stringify(object)));
    JSON.stringify(Base64.base64_encode(JSON.stringify(object)));
    var params = {
      data: Base64.base64_encode(JSON.stringify(object))
    };
    Request.request(url, params, '正在获取验证码', function (res) {
      console.log(res);
      if (res.code == '0') {
        console.log('获取验证码成功');
        that.change_get_code_button(that);
      } else {
        isCanClick = true
        my.showToast({
          content: res.message,
          duration: app.showToastDuring
        });
      }
    }, function () {
      isCanClick = true
      my.showToast({
        content: '获取验证码失败',
        duration: app.showToastDuring
      })
    }
    );
  },
  //输入框输入监听
  input_phoneNum: function (e) {
    phoneNum = e.detail.value
    app.phoneNum = e.detail.value
  },
  input_code: function (e) {
    console.log(e.detail.value)
    vertify_code = e.detail.value
  },


  //改变获取验证码button
  change_get_code_button: function (that) {
    isCanClick = false
    that.setData({
      message: (currentTime) + '重新获取'
    })
    interval = setInterval(function () {
      currentTime--
      that.setData({
        message: (currentTime) + '重新获取'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        currentTime = maxTime
        isCanClick = true
        that.setData({
          message: '重新获取'
        })
      }
    }, 1000)
  },
  //检查手机号是否合法
  isMobileNumber: function (phone) {
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
      // alert(message);  
      console.log(message);
      my.showToast({

        content: message,
        duration: app.showToastDuring
      });
    }
    return flag;
  },



  testLogin: function () {
    console.log('直接登录')
    var that = this
    var url = app.globalData.user_url + 'user/login'
    var object = {
      mobile: '15333160374',
      password: 'woshini88',
      loginType: 1,
      client: 1
    }
    var params = {
      data: Base64.base64_encode(JSON.stringify(object))
    };
    Request.request(url, params, '注册成功，正在登录', function (res) {
      console.log(res);
      if (res.code == '0') {
        console.log('登录成功');

        //登录成功存入本地
        var userInfo = res.data
        my.setStorageSync({
          key: 'userInfo',
          data: userInfo,
        });
        app.getUserInfo()
        my.navigateBack({
          delta: 2
        })
      } else {
        my.showToast({
          content: res.message,
          duration: 1500,
        });
        my.navigateBack({
          delta: 1
        })
      }
    }, function () {
      my.showToast({
        content: '登录失败',
        duration: app.showToastDuring
      })
      my.navigateBack({
        delta: 1
      })
    }
    );
  },
  onUnload() {
    // 页面被关闭
    clearInterval(interval)
    currentTime = maxTime
    isCanClick = true
    currentTime = maxTime //倒计时的事件（单位：s）  
    phoneNum = ''
    vertify_code = ''
    isCanClick = true
  },
});

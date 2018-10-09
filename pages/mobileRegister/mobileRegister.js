var check = require("../../Utils/check.js");
var Base64 = require('../../Libs/base64.js');
var Request = require('../../Utils/Request.js');
var app = getApp()
// var step = 1 // 当前操作的step  
var maxTime = 60
var currentTime = maxTime //倒计时的事件（单位：s）  

var phoneNum = ""
var vertify_code = ""
var first_pwd = ""
var second_pwd = ""
var isCanClick = true
var interval
Page({
  data: {
    message: '获取验证码',
  },
  onLoad() { },
  onShow() {
    phoneNum = app.phoneNum;
    this.setData({
      phoneNum: phoneNum
    })
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
  input_first_pwd: function (e) {
    console.log(e.detail.value)
    first_pwd = e.detail.value
  },
  input_second_pwd: function (e) {
    console.log(e.detail.value)
    second_pwd = e.detail.value

  },
  gotoLogin: function (e) {
    my.navigateBack({
    })
  },
  //点击注册
  listenerRegister: function () {
    if (!check.isMobileNumber(phoneNum)) {
      return;
    }
    if (vertify_code == '' || vertify_code == null) {
      my.showToast({
        content: "验证码不能为空",
        duration: app.showToastDuring
      });
      return;
    }
    if (first_pwd == '' || first_pwd == null || second_pwd == '' || second_pwd == null) {
      my.showToast({
        content: "密码不能为空",
        duration: app.showToastDuring
      });
      return;
    }
    if (first_pwd != second_pwd) {
      my.showToast({
        content: "两次输入的密码不一致",
        duration: app.showToastDuring
      });
      return;
    }
    var that = this

    var url = app.globalData.user_url + 'association/register'
    var object = {
      mobile: phoneNum,
      smsCode: vertify_code,
      password: first_pwd,
      client: 2,
      deviceToken: ''
    }
    console.log(JSON.stringify(object))
      ;
    var params = {
      data: Base64.base64_encode(JSON.stringify(object))
    };
    Request.request(url, params, '正在注册', function (res) {
      console.log(res);
      if (res.code == '0') {
        console.log('注册成功');
        clearInterval(interval)
        currentTime = maxTime
        isCanClick = true
        that.setData({
          message: '重新获取'
        })
        that.loginAction()
        //登录成功存入本地
        // var userInfo = res.data
        // my.setStorageSync({
        //   key: 'userInfo',
        //   data: userInfo,
        // });
        // app.getUserInfo()
        // my.navigateBack({

        // })
      } else {
        my.showToast({
          content: res.message,
          duration: app.showToastDuring
        });
      }
    }, function () {
      my.showToast({
        content: '注册失败',
        duration: app.showToastDuring
      })
    }
    );
  },
  //获取验证码
  get_vertify_code: function () {
    if (!isCanClick) {
      return;
    }
    if (!check.isMobileNumber(phoneNum)) {

      return;
    }
    isCanClick = false
    var that = this
    var url = app.globalData.user_url + 'sms/getsms'
    var object = {
      mobile: phoneNum,
      sendType: 1,
      isCheckMobile: 1,
      purposeType: 1//1、注册  2、找回密码  3、更换手机号 4、修改支付密码 5、登录
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
        isCanClick = true;
        console.log(res.message);
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
  loginAction: function () {
    console.log('直接登录')
    var that = this
    var url = app.globalData.user_url + 'user/login'
    var object = {
      mobile: phoneNum,
      password: first_pwd,
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
          delta: 5
        })
      } else {
        my.showToast({
          content: res.message,
          duration: app.showToastDuring
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
    first_pwd = ""
    second_pwd = ""
    isCanClick = true
  },
});

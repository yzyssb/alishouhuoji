var check = require("../../Utils/check.js");
var Base64 = require('../../Libs/base64.js');
var Request = require('../../Utils/Request.js');
var app = getApp()
var phoneNum = ''
var password = ''

Page({
  data: {

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
  onShow() {
    phoneNum = app.phoneNum;
    this.setData({
      phoneNum: phoneNum
    })
  },
  gotoMobileLogin: function () {
    // my.navigateTo({
    //   url: '../mobileLogin/mobileLogin',
    // })
    my.navigateBack({
      
    })
  },
  //点击登录
  listenerLogin: function () {
    // this.testLogin()
    if (!this.isMobileNumber(phoneNum)) {
      return;
    }
    if (password == '' || password == null) {
      my.showToast({
        content: "密码不能为空",
        duration: app.showToastDuring
      });
      return;
    }
    var that = this
    var url = app.globalData.user_url + 'user/login'
    var object = {
      mobile: phoneNum,
      password: password,
      loginType: 1,
      client: 1
    }
    var params = {
      data: Base64.base64_encode(JSON.stringify(object))
    };
    Request.request(url, params, '正在登录', function (res) {
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

  //输入框输入监听
  input_phoneNum: function (e) {
    phoneNum = e.detail.value
    app.phoneNum = e.detail.value
  },
  input_password: function (e) {
    console.log(e.detail.value)
    password = e.detail.value
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
      })
      my.navigateBack({
        delta: 1
      })
    }
    );
  },
  onUnload() {
    // 页面被关闭
    phoneNum = ''
    password = ''

  },
});

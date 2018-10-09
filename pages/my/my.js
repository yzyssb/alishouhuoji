var Request = require('../../Utils/Request.js');
var app = getApp()
// var userInfo = getApp().getUserInfo()
var userInfo = null
var ifNonSecretPayment = false
var nonSecretButtonCanClick = true
Page({
  data: {
    userInfo: userInfo,
    my_userInfo:{},
    my_items: [
      {
        'icon': '../../image/ZHIFU.png',
        'title': '交199押金',
        'subTitle': '',
      }
    ],
    ifNonSecretPayment: ifNonSecretPayment
  },
  gotoLogin: function (e) {
    console.log(123)
    my.navigateTo({
      url: '../mobileLogin/mobileLogin',
    })
  },
  mianmi: function (e) {
    if (!nonSecretButtonCanClick) {
      return;
    }
    if (ifNonSecretPayment) {
      var that = this
      console.log('关闭')
      my.confirm({
        title: '关闭免密',
        content: '您确定关闭支付宝免密支付吗？',
        confirmButtonText: '不关了',
        cancelButtonText: '确认关闭',
        success: (result) => {
          if (!result.confirm) {
            that.closeMianmi()
          }
        },
      });

    } else {
      nonSecretButtonCanClick = false;
      this.openMianmi()
      console.log('开通')
    }
  },
  myOrder: function (e) {
    my.navigateTo({
      url: '../orderList/orderList',
    })
  },
  myAppeal: function (e) {
    if (app.userInfo) {
      my.navigateTo({
        url: '../appealList/appealList',
      })
    } else {
      my.navigateTo({
        url: '../mobileLogin/mobileLogin',
      })
    }
  },
  loginOut: function (e) {
    if (userInfo == null) {
      my.navigateTo({
        url: '../mobileLogin/mobileLogin',
      })
      return;
    }
    var that = this
    my.confirm({
      title: '提示',
      content: '昵称和头像仅展示您支付宝的信息，如果切换账号请以手机号为准',
      confirmButtonText: '退出',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          my.setStorageSync({
            key: 'userInfo',
            data: null,
          });
          my.setStorageSync({
            key: 'phoneNum',
            data: null,
          });
          app.getUserInfo()
          userInfo = app.userInfo
          console.log(userInfo)
          that.setData({
            userInfo: userInfo,
          })
          my.navigateTo({
            url: '../mobileLogin/mobileLogin',
          })
        }
      },
    });
  },
  onLoad() {
    //  app.aliUserInfo
    //  var url = app.globalData.userInfo_url + 'user/store'
    // var params = {
    //   nickname: app.aliUserInfo.nickName,
    //   headimg: app.aliUserInfo.avatar,
    //   token: app.userInfo.token,
    // }
    // // JSON.stringify(object);
    // // var params = {
    // //   data: Base64.base64_encode(JSON.stringify(object))
    // // };
    // Request.request(url, params, '正在登录', function (res) {
    //   console.log(res);
    // }, function () {
    // }
    // );
  },
  onShow() {
    var that = this
    userInfo = app.userInfo
    console.log('个人信息')
    console.log(userInfo)
    that.setData({
      userInfo: userInfo,
    })

    my.getAuthCode({
      scopes: 'auth_user',
      success: (res) => {
        console.log(res)
        my.getAuthUserInfo({
         
          success: (userInfo) => {
            console.log(userInfo)
            app.aliUserInfo = userInfo
            my.setStorageSync({
              key: 'aliUserInfo',
              data: userInfo,
            });
             if (app.userInfo) {
               app.userInfo.nickname = userInfo.nickName
               app.userInfo.headimg = userInfo.avatar
               that.setData({
                 userInfo:app.userInfo
               })
             }
          }
        });
      },
    });
    
    // 页面显示
    if (userInfo) {
      this.queryIfNonSecrete();
    }
  },
  queryIfNonSecrete: function () {
    console.log('请求数据')
    my.showLoading({
      content: '加载中...',
    });
    var url = app.globalData.servel_url + 'agreement_query'
    var that = this;
    console.log(url + app.userInfo)
    my.httpRequest({
      url: url,
      method: 'POST',
      data: {
        uid: app.userInfo.uid,
      },
      dataType: 'json',
      success: function (res) {
        console.log('请求数据成功')
        my.hideLoading();
        console.log(res.data)
        if (res.data.code != '0') {
          ifNonSecretPayment = false
        } else {
          ifNonSecretPayment = true
        }
        console.log(ifNonSecretPayment)
        that.setData({
          ifNonSecretPayment: ifNonSecretPayment,
          // isPermission:(res.data.data.ifMember=='1'||res.data.data.ifNonSecretPayment=='1')
        })
        
      },
      fail: function (res) {
        my.hideLoading();
        my.showToast({
          content: '请求失败',
          duration: app.showToastDuring
        })
      },
      complete: function (res) {
        my.hideLoading();
      }
    });
  },

  closeMianmi: function () {
    my.showLoading({
      content: '加载中...',
    });
    var url = app.globalData.servel_url + 'agreement_unsign'
    var that = this;
    console.log(url + app.userInfo)
    my.httpRequest({
      url: url,
      method: 'POST',
      data: {
        uid: app.userInfo.uid,
      },
      dataType: 'json',
      success: function (res) {
        my.hideLoading();
        console.log(res.data)
        if (res.data.code == '0') {
          that.queryIfNonSecrete()
          my.alert({ content: '关闭免密成功' });
        }
      },
      fail: function (res) {
        my.hideLoading();
        my.showToast({
          content: '请求失败',
          duration: app.showToastDuring
        })
      },
      complete: function (res) {
        my.hideLoading();
      }
    });
  },
  openMianmi: function () {
    var that = this
    Request.openMianmi(function (res) {
      nonSecretButtonCanClick = true;
      that.queryIfNonSecrete()
    }, function () {
      nonSecretButtonCanClick = true;
    }
    )
  }
  // my.getAuthCode({
  // scopes: 'auth_user',
  // success: (res) => {
  //    my.getAuthUserInfo({
  //     success: (userInfo) => {
  //     that.setData({
  //       userInfo:{
  //         'avatarUrl':userInfo.avatar,
  //         'nickName':userInfo.nickName,
  //         'phoneNum':'15333160374'
  //      }
  //     })

  //     }
  //   });
  // }
  // })
  // },
});

var count = 0;
var orderNo = '';
var app = getApp()
var userInfo
var isMember
Page({
  data: {
    message: '正在开门,请稍后',
    sub_message: ''
  },
  onLoad(query) {
    //  var windowH = my.getSystemInfoSync().windowHeight
    //  console.log(windowH)
    // this.setData({
    //   to_top:windowH/2
    // })
    userInfo = app.userInfo
    isMember = query.isMember
    this.setData({
      backgroundImage: app.dateImage,
      isMember: isMember
    })
    orderNo = query.orderNo
    console.log(query)
    if (query.open_type == '1') {
      this.pollingOrderUrl()
    } else {
      this.pollingReplenshment();
    }
  },
  pollingOrderUrl: function () {
    console.log(count++)
    var that = this
    var url = app.globalData.servel_url + 'orderDetail'
    my.httpRequest({
      url: url,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        uid: userInfo.uid,
        token: userInfo.token,
        orderNo: orderNo,
      },
      success: function (res) {
        console.log(res.data)
        var orderState = res.data.data.orderState
        var message
        var sub_message = ''
        if (orderState == 2) {
          message = '门已开,请放心拿取'
          if (isMember == 'true') {
            sub_message = "关门后会自动按照会员价结算"
          }
        } else if (orderState == 3) {
          message = '开门失败'
          sub_message = ''
        } else if (orderState == 9 || orderState == 10) {
          my.showLoading({
            content: '门已关闭,正在结算',
          });
          sub_message = ''
          message = '门已关,正在结算订单'
        } else if (!(orderState == 1)) {
          message = '生成订单成功'
          sub_message = ''
          //  my.showToast({
          //    content: message,
          //    type: 'success'
          //  })
        }
        that.setData({
          message: message,
          sub_message: sub_message
        })
        console.log('message = ' + message + 'sub_message = ' + sub_message);
        if (orderState == 1 || orderState == 2 || orderState == 9 || orderState == 10) {
          setTimeout(function () {
            //要延时执行的代码  
            that.pollingOrderUrl()
          }, 1000) //延迟时间 这里是1秒  
        } else {
          if (res.data.data.fault && res.data.data.fault != '') {
            console.log('故障')
            my.alert({
              title: '提示',
              content: '由于机器发生故障,订单暂时无法结算',
              buttonText: '确定',
              success: () => {
                my.navigateBack({

                })
              },
            });
            return
          }
          if (orderState != 3) {
            my.hideLoading();
            my.navigateTo({
              url: '../orderDetail/orderDetail?orderData=' + JSON.stringify(res.data.data) + '&fromType=opendoor',
            })
          } else if (orderState == 3) {
            my.alert({
              title: '提示',
              content: '由于机器故障,开门失败',
              buttonText: '确定',
              success: () => {
                my.navigateBack({

                })
              },
            });
          }
          return
        }
      },
      fail: function (res) {
        setTimeout(function () {
          //要延时执行的代码  
          that.pollingOrderUrl()
        }, 1000)
      }
    })
  },
});

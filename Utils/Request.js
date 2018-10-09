var app = getApp()
function request(url, params, message, success, fail) {
  console.log(params)
  // console.log(url)
  // console.log(message)
  if (message != '') {
    my.showLoading({
      content: message,
    });
  }
  my.httpRequest({
    url: url,
    method: 'POST',
    data: params,

    dataType: 'json',
    success: function (res) {
      my.hideLoading();
      success(res.data)
    },
    fail: function (res) {
      console.log(res);
      my.hideLoading();
      fail()
    },
    complete: function (res) {
      // console.log(res);
      my.hideLoading();
    }
  });
}
function openMianmi(success, fail) {
  var url = app.globalData.servel_url + 'sign_contract'
  var params = {
    uid: app.userInfo.uid,
    returnUrl: 'wayAliSign://',
    type: 'MINI'
  }
  this.request(url, params, '加载中', function (res) {
    if (res.code == '0') {
      my.paySignCenter({
        signStr: res.data,
        success: (res) => {
          var result = JSON.parse(res.result).alipay_user_agreement_page_sign_response
          if (result.code == '10000') {
            my.showToast({
              content: '开通免密成功', // 文字内容
              duration: app.showToastDuring
            });
            success(res)
          } else {
            my.showToast({
              content: result.sub_msg, // 文字内容
              duration: app.showToastDuring
            });
            fail()
          }
        },
        fail: (res) => {
          my.showToast({
            content: '开通免密失败', // 文字内容
            duration: app.showToastDuring
          });
          fail()
        }
      });
    }
  }, function () {
    my.showToast({
      content: '请求失败', // 文字内容
      duration: app.showToastDuring
    });
    fail()
  }
  )

}
function payOrder(orderNo, payAmount, des, success, fail) {
  var url = app.globalData.servel_url + 'get_orderstring'
  var params = {
    outtradeno: orderNo,
    subject: des,
    totalAmount: payAmount,
    type: 'MINI'
  }
  this.request(url, params, '正在获取支付信息', function (res) {
    my.tradePay({
      orderStr: res.data, //完整的支付参数拼接成的字符串，从服务端获取
      success: (res) => {

        var result = res
        if (result.resultCode == '9000') {
          my.showToast({
            content: '支付成功',
            duration: app.showToastDuring
          })
          success()
        } else {
          my.tradePay({
            content: result.memo?result.memo:'支付失败',
            duration: app.showToastDuring
          })
          fail()
        }
      },
      fail: (res) => {
        fail()
      }
    });
  }, function () {
    my.showToast({
      content: '获取支付信息失败',
      duration: app.showToastDuring
    })
    fail()
  })
  //   my.showLoading({
  //    content: '正在获取支付信息',
  //   });

  //   my.httpRequest({
  //    url: url,
  //    method: 'POST',
  //    data: {
  //      outtradeno: orderNo,
  //      subject: des,
  //      totalAmount: payAmount,
  //      type : 'MINI'
  //    },
  //   dataType: 'json',
  //   success: function(res) {
  //     my.hideLoading();
  //     console.log(res.data)
  //     // if(res.data.code == '0'){
  //        my.tradePay({
  //          orderStr: res.data.data, //完整的支付参数拼接成的字符串，从服务端获取
  //          success: (res) => {

  //            var result = res
  //            if(result.resultCode=='9000'){
  //               my.showToast({
  //                  content: '支付成功',
  //               })
  //               success()
  //            }else{
  //               my.showToast({
  //                  content: result.memo,
  //               })
  //               fail()
  //            }
  //          },
  //          fail: (res) => {
  //            fail()
  //          }
  //        });
  //   },
  //   fail: function(res) {
  //     my.hideLoading();
  //     my.showToast({
  //       content: '获取支付信息失败',
  //     })
  //     fail()
  //   },
  //   complete: function(res) {
  //     my.hideLoading();
  //   }
  //  });

}


function payMember(success, fail) {
    var url = app.globalData.servel_url + 'get_member_payment'
    var params = {
        uid: app.userInfo.uid,
        subject: "会员费",
        type: 'MINI'
    }
    this.request(url, params, '正在获取支付信息', function (res) {

        my.tradePay({
            orderStr: res.data, //完整的支付参数拼接成的字符串，从服务端获取
            success: (res) => {

                var result = res
                if (result.resultCode == '9000') {
                    my.showToast({
                        content: '支付成功',
                        duration: app.showToastDuring
                    })
                    success()
                } else {
                    my.showToast({
                        content: '支付失败',
                        duration: app.showToastDuring
                    })
                    fail()
                }
            },
            fail: (res) => {
                fail()
            }
        });
    }, function () {
        my.showToast({
            content: '获取支付信息失败',
            duration: app.showToastDuring

        })
        fail()
    })

}

function queryIsMember(success, fail) {
    // var url = 'http://192.168.17.63/machine/' + 'query_pledge'
    var url = app.globalData.servel_url + 'isMember'
    var params = {
        uid: app.userInfo.uid,
        token:app.userInfo.token,
        qrCode:app.qrCode,
    }
    this.request(url, params, '', function (res) {
            console.log(res)
            success(res)
        },
        function () {
            setTimeout(function () {
                wx.showToast({
                    title: "请求失败",
                    duration: app.showToastDuring,
                    icon: 'none'
                })
            }, app.delayTime)

            fail()
        }
    )
}

module.exports.request = request;
module.exports.openMianmi = openMianmi;
module.exports.payOrder = payOrder;
module.exports.payMember = payMember;
module.exports.queryIsMember = queryIsMember;
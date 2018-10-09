var Request = require('../../Utils/Request.js');
var app = getApp()
var machineID
var userInfo = null
var qrCode = null
var isPermission = 0
var isRequestSuccess = false
var isMember = false
var interval;
var maxTime = 30
var currentTime = maxTime //倒计时的事件（单位：s）

Page({
  data: {
    // condition: 1==0,
    userInfo: userInfo,
    qrCode: qrCode,
    isPermission: isPermission,
    showLimit: false,  //是否显示限制用户页
    isMember: isMember,
    customerServicePhone: '', //客服电话
    items: [
      {
        title: '开通免密支付',
        des: '开通免密支付，拿完商品即可离开，系统会自动完成扣款，体验超赞。免密支付由腾讯、支付宝和悦盒公司签约，保证安全可靠。',
        buttonTitle: '开通免密支付,拿完即走',
        type: '1',
        img: "../../image/bg_figure.png"
      },
      {
        title: '成为路上会员',
        des: '成为路上会员，享受会员价的同时可获得积分，路上会员也可以在超多餐厅门店享受折扣',
        buttonTitle: '成为会员,立享会员价',
        type: '2',
        img: "../../image/bg_member.png"
      }
      // {
      //   title:'下载APP',
      //   des:'去App Store或各大应用市场搜索下载“路上社群”可享受无押金购物',
      //   buttonTitle:''
      //  }
    ],
    isHidden:false,
    orderNo:''
  },
  onShow() {
    // 页面显示
    isPermission = 0
    isRequestSuccess = false
    isMember = false
    this.setData({
      //  isPermission:false,
      isRequestSuccess: isRequestSuccess,
      isMember: isMember,
      isPermission: isPermission
    })
    this.reloadData()

  },
  onHide() {
    // 页面被关闭
    // isPermission = 0
    // isRequestSuccess = false
    // isMember = false
    // this.setData({
    //   //  isPermission:false,
    //   isRequestSuccess: isRequestSuccess,
    //   isMember: isMember,
    //   isPermission: isPermission
    // })
    console.log('unload')
  },
  onLoad(query) {
    // app.qrCode = 'http://vm.27aichi.com/machine?MzE0NDE0MQ=='
    app.getCurrentTimeType()
    this.setData({
      backgroundImage: app.dateImage,
      dateStr: app.dateStr
    })
    // 页面加载
    //     my.getAuthCode({
    //   scopes: 'auth_user',
    //   success: (res) => {
    //     my.getAuthUserInfo({
    //       success: (userInfo) => {
    //        console.log(userInfo)
    //       }
    //     });
    //   },
    // });
    // var userInfo = app.getUserInfo() 
    // if(!userInfo){
    //   my.navigateTo({
    //   url: '../mobileLogin/mobileLogin',
    // })
    // }
    //   console.log(query.qr_code)
    //   var url = app.globalData.test_url + 'qrCodeiOS'
    //   var that = this;
    //   var role;
    //   console.log(url)
    //   my.httpRequest({
    //    url: url,
    //    method: 'POST',
    //   //  data: {
    //   //    from: '支付宝',
    //   //    production: 'AlipayJSAPI',
    //   //  },
    //   dataType: 'json',
    //   success: function(res) {
    //     console.log(res.data)
    //     if(res.data.code == '1'){
    //           my.showToast({
    //             content: res.data.msg,
    //           })
    //           return
    //         }
    //         machineID = res.data.data.machineID
    //         my.showToast({
    //           content: '获取用户信息成功',
    //           type: 'success'
    //         })
    //         that.setData({
    //             // condition: res.data.data.role == '1'
    //             condition:false
    //           })
    //   },
    //   fail: function(res) {
    //     my.alert({content: 'fail'});
    //   },
    //   complete: function(res) {

    //   }
    //  });
  },
  memberOrDeposi: function (e) {
    var type = e.currentTarget.dataset.type;
    console.log(type)
    // //押金
    // if (type == '1') {
    // var url = app.globalData.servel_url + 'get_orderstring_pledge'
    // my.httpRequest({
    //   url: url,
    // method: "POST", 6
    // header: {
    //   "Content-Type": "application/x-www-form-urlencoded"
    // },        
    // data: {
    //   uid:'59394',
    //   subject:'交纳押金199元',
    //   totalAmount:'0.01',
    //   type:'MINI'
    // },
    // success: function (res) {
    //   my.alert({
    //      content: JSON.stringify(res.data),
    //    });
    // },
    // fail: function(res) {
    // my.alert({content: 'fail'});
    // },
    // })
    // }
    //开通免密
    if (type == '1') {
      var that = this
      Request.openMianmi(function (res) {
        that.queryIfNonSecrete()
      }, function () {

      }
      )


    }
    else if (type == '2') {

      if (!this.data.checkedValue) {
        my.showToast({
          content: '请先同意协议',  
        })
        return
      }



      var that = this
      Request.payMember(function (res) {

        console.log('payMembersuccess')
        interval = setInterval(function () {
          currentTime--

          Request.queryIsMember(function (res) {

            if (res.msg == 1) {

              that.setData({
                isPermission: 1,
                isMember: true,
              })

              clearInterval(interval)
            }
          }, function () {

          })

          if (currentTime <= 0) {
            clearInterval(interval)

          }
        }, 2000)

        that.reloadData();

      }, function () {

      }
      )
    }
  },
  myClick: function () {
    console.log('点击了....')
    if (!userInfo) {
      my.navigateTo({
        // url: '../onekeyLogin/onekeyLogin',
        url: '../mobileLogin/mobileLogin',
      })
    }
    else {
      my.navigateTo({
        url: '../my/my',
      })
    }
  },
  orderListClick: function () {
    console.log('点击了....')
    if (!userInfo) {
      my.navigateTo({
        // url: '../onekeyLogin/onekeyLogin',
        url: '../mobileLogin/mobileLogin',
      })
    }
    else {
      my.navigateTo({
        url: '../orderList/orderList',
      })
      //   my.navigateTo({
      //   url: '../orderDetail/orderDetail',
      // })
    }
  },
  
  //轮询开门状态
  openDoorFind: function (open_type, isMember){
    var url = app.globalData.servel_url + 'openDoorFind'
    var params={}
    console.log(this.data)
    params.orderNo = this.data.orderNo;
    params.mode=1;
    params.randomname= new Date();
    params.randompwd= new Date();
    params.machineNo=machineID;
    var that= this
     my.httpRequest({
      url: url,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: params,
      
      success: function (res) {
        console.log(res)
      if (res.data.code == '0') {
        if (res.data.msg==0){
          setTimeout(function () {
            //要延时执行的代码  
            that.openDoorFind(open_type, isMember)
          }, 1000)
        } else if (res.data.msg == 1){
          my.hideLoading()
          that.setData({
            isHidden:false,
            canClick: true
          })
          my.navigateTo({
            url: '../have-opened/have-opened?orderNo=' + that.data.orderNo + '&open_type=' + open_type + '&isMember=' + isMember,
          })
        } else if (res.data.msg == 2){
          my.hideLoading()
          that.setData({
            isHidden:false,
            canClick: true
          })
          my.showToast({
            content: '开门失败，请重新点击开门',
            duration: app.showToastDuring
          })
        }
      }else{
        my.hideLoading()
        that.setData({
          isHidden:false,
          canClick: true
        })
        console.log(url)
        my.showToast({
          content: res.data.msg,
          duration: app.showToastDuring
        })
      }
    }, 
    fail:function (res) {
      that.setData({
        isHidden:false,
        canClick: true
      })
      my.hideLoading()
      my.showToast({
        content: res.data.msg,
        duration: app.showToastDuring
      })
    }
  })
  },
  opendoor: function () {
  
    // if(!userInfo && app.storeId){
    if (!userInfo && app.qrCode) {
      my.navigateTo({
        // url: '../onekeyLogin/onekeyLogin',
        url: '../mobileLogin/mobileLogin',

      })
      return;
    }
    
    if (!qrCode) {
      // qrCode='http://vm.27aichi.com/machine?ODg4ODg4MQ=='  //调试二维码
      // machineID='8888881'  //调试机器号
      //   app.qrCode = 'http://vm.27aichi.com/machine?MzE0NDE0MQ=='
      my.scan({
        type: 'qr',
        success: (res) => {
          app.qrCode = res.code
        },
      });
      return;
    }
    console.log(qrCode)
    // var open_type = e.currentTarget.dataset.type;
    var open_type = '1'
    console.log("开门类型" + open_type + "机器ID：" + machineID)
    var url = app.globalData.servel_url + 'opendoor'
    console.log(url)
    
    var that = this
    my.showLoading({
      content: '正在开门',
    })
    my.httpRequest({
      url: url,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        uid: userInfo.uid,
        token: userInfo.token,
        machineID: machineID,
        type: open_type,
        orderSource: '2'
      },
      success: function (res) {
        console.log('开门接口')
        app.qrCode = null
        qrCode = null
        /*that.setData({
          qrCode: qrCode,
        })
        that.reloadData()*/
        console.log(res.data)
        my.hideLoading()
        if (res.data.code == '0') {
          console.log(res.data.orderNo)
          that.setData({
            canClick: false,
            orderNo: res.data.data.orderNo
          })
          console.log(that.data)
          my.showLoading({
            content: '正在开门',
          })
          that.openDoorFind(open_type, isMember)
        } else {
          my.showToast({
            content: res.data.msg,
            duration: app.showToastDuring
            // type: 'fail'
          })
          that.setData({
            isHidden:false,
          })
        }
      },
      fail: function (res) {
        console.log('opendoor'+JSON.stringify(res.data))
        my.hideLoading()
        my.showToast({
          content: '开门失败,请检查网络',
          duration: app.showToastDuring
        })
        that.setData({
          isHidden:false,
        })
      }
    })
  },
  getStoreId: function () {
    my.showLoading({
      content: '加载中...',
    });
    var url = app.globalData.servel_url + 'qrCode'
    var that = this;
    my.httpRequest({
      url: url,
      method: 'POST',
      data: {
        qrCode: qrCode
      },

      dataType: 'json',
      success: function (res) {
        my.hideLoading();
        console.log(res.data)
        if (res.data.code != '0') {
          my.showToast({
            content: res.data.msg,
          })
          app.qrCode = null
          qrCode = app.qrCode
          that.setData({
            qrCode: qrCode,
          })
          return
        }
        if (!userInfo) {
          console.log('storeId：' + res.data.data.storeId)
          app.storeId = res.data.data.storeId
          // my.navigateTo({
          //   url: '../mobileLogin/mobileLogin',
          // })
        }
      },
      fail: function (res) {
        my.hideLoading();
        // my.alert({content: 'fail'});
      },
      complete: function (res) {
        my.hideLoading();
      }
    });
  },
  reloadData: function () {
   
    var open_type = '1'
    userInfo = app.userInfo
    qrCode = app.qrCode
    isRequestSuccess = false
    this.setData({
      userInfo: userInfo,
      qrCode: qrCode,
      isRequestSuccess: isRequestSuccess,
      isHidden:false,
    })

    if (!userInfo && qrCode) {
      this.getStoreId()
      return;
    }
    console.log(userInfo)
    console.log(qrCode)
    //测试二维码数据
    qrCode='http://vm.27aichi.com/machine?ODg4ODg4MQ=='
    if (userInfo && qrCode) {
      
      my.showLoading({
        content: '加载中...',
      });
      var url = app.globalData.servel_url + 'qrCode'
      var that = this;
      my.httpRequest({
        url: url,
        method: 'POST',
        data: {
          uid: userInfo.uid,
          token: userInfo.token,
          qrCode: qrCode
        },
        dataType: 'json',
        success: function (res) {
          my.hideLoading();
          console.log('qrCode'+ JSON.stringify(res.data))
           console.log('qrCode'+qrCode)
          if (res.data.code != '0') {
            my.showToast({
              content: res.data.msg,
            })
            //  isRequestSuccess = true
            app.qrCode = null
            qrCode = app.qrCode
            that.setData({
              qrCode: qrCode,
            })
            return
          }
          
          //有未支付订单
          if (res.data.data.ifUnpaidOrder == '1') {
            app.qrCode = null
            qrCode = app.qrCode
            that.setData({
              qrCode: qrCode,
            })
            my.confirm({
              title: '温馨提示',
              content: '抱歉,您上次购物还未完成支付,请先完成支付再购物,金额:¥' + res.data.data.unpaidOrderAmount,
              confirmButtonText: '立即支付',
              cancelButtonText: '查看订单',
              success: (result) => {
                if (result.confirm) {
                  that.zhifu(res.data.data)
                } else {
                  my.navigateTo({
                    url: '../orderDetail/orderDetail?orderNo=' + res.data.data.unpaidOrderNo + '&fromType=unpaid',
                  })
                }
              },
            });
            return;
          }
          //机器故障
          if (res.data.data.fault&&res.data.data.fault.length > 0) {
            var faultLevel = 3
            for (var i = 0; i < res.data.data.fault.length; i++) {
              var fault = res.data.data.fault[i]
              if (parseInt(fault.faultLevel) < faultLevel) {
                faultLevel = parseInt(fault.faultLevel)
              }
            }
            if (faultLevel == 1 || faultLevel == 2) {
              app.qrCode = null
              qrCode = app.qrCode
              that.setData({
                qrCode: qrCode,
              })
              my.alert({
                title: '温馨提示',
                content: '当前售卖机处于故障状态,无法购物,抱歉给您造成了困扰',
                buttonText: '确定',
                success: () => {

                },
              });
              return;
            }
          }
          //限制用户
          if (res.data.data.blackRole == '100') {
            app.qrCode = null
            qrCode = app.qrCode
            var phone = res.data.data.customerServicePhone
            that.setData({
              qrCode: qrCode,
              showLimit: true,
              customerServicePhone: phone,
            })
            my.navigateTo({
              url: '../limit-user/limit-user?customerServicePhone=' + phone 
            })
            // my.confirm({
            //   title: '温馨提示',
            //   content: '抱歉,系统检测到您被设置为“限制用户”,无法购物,如有异议请联系客服',
            //   confirmButtonText: '联系客服',
            //   cancelButtonText: '取消',
            //   success: (result) => {
            //     if (result.confirm) {
            //       my.makePhoneCall({ number: res.data.data.customerServicePhone });
            //     } else {

            //     }
            //   },
            // });
            return;
          }
          //根据订单状态，判断执行不同方法
          var orderStateOne=[];
          var orderStateTwo=[];
          console.log(res.data.data)
          if(res.data.data.lisMachineIndent&&res.data.data.lisMachineIndent.length>0){
            var lisMachineIndent = res.data.data.lisMachineIndent
            for(var i=0; i<lisMachineIndent.length;i++){
                if(lisMachineIndent[i].orderState==1){
                  orderStateOne.push(lisMachineIndent[i].orderNo)
                }else if(lisMachineIndent[i].orderState==2){
                  orderStateTwo.push(lisMachineIndent[i].orderNo)
                  
                
                }
            }
          }
          isRequestSuccess = true
          machineID = res.data.data.machineID
          isMember = res.data.data.ifMember == '1'
          if(orderStateOne.length>0){
            console.log()
            that.setData({
              orderNo: orderStateOne[orderStateOne.length-1]
            })
              that.openDoorFind(open_type, isMember)
              return;
          }
          if(orderStateTwo.length>0){
            that.setData({
              orderNo: orderStateTwo[orderStateTwo.length-1]
            })
            my.navigateTo({
              url: '../have-opened/have-opened?orderNo=' + orderStateTwo[orderStateTwo.length-1] + '&open_type=' + open_type + '&isMember=' + isMember,
            })
          }
          
          if (res.data.data.ifMember == '1' && res.data.data.ifNonSecretPayment != '1') {
            isPermission = 1;//会员非免密    
          } else if (res.data.data.ifMember != '1' && res.data.data.ifNonSecretPayment == '1') {
            isPermission = 2;//免密非会员
            that.setData({
              isHidden:true,
            })
           
            that.opendoor();
          } else if (res.data.data.ifMember == '1' && res.data.data.ifNonSecretPayment == '1') {
            isPermission = 3;//会员+免密   
            that.setData({
              isHidden:true,
            })
            that.opendoor();
          } else {
            isPermission = 0;
          }
          that.setData({
            //  isPermission:false,
            isRequestSuccess: isRequestSuccess,
            isMember: isMember,
            isPermission: isPermission
          })
        },
        fail: function (res) {
          my.showToast({
            content: '请求失败',
            duration: app.showToastDuring
          })
          isRequestSuccess = false
          app.qrCode = null
          qrCode = app.qrCode
          that.setData({
            qrCode: qrCode,
            isRequestSuccess: isRequestSuccess
          })
          my.hideLoading();
        },
        complete: function (res) {
          my.hideLoading();
        }
      });
    }
  },
  zhifu: function (orderInfo) {
    var orderNo = orderInfo.unpaidOrderNo
    var amount = orderInfo.unpaidOrderAmount
    var url = app.globalData.servel_url + 'get_orderstring'
    console.log(url)
    var that = this;
    var role;
    Request.payOrder(orderNo, amount, '会员柜订单:' + orderNo, function () {
      that.reloadData()
    }, function () {
      that.reloadData()
    })
  },
  // 是否同意会员协议
  checkboxChange: function () {
    console.log(123)
    let checkedValue = this.data.checkedValue;
    this.setData({
      checkedValue: !checkedValue
    })
  },
  // 点击同意会员协议文字跳转到协议页面
  toAgreement: function () {
    my.navigateTo({
      url: "../agreement/agreement"
    })
  }
});

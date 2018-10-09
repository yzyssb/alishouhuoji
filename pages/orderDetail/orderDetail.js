
var Request = require('../../Utils/Request.js');
var orderData = {};
var reduceList = [];
var orderNo = '';
var app = getApp();
var isMemberReduce = false
var isRequest = 0
var fromType = ''
Page({
  data: {
    reduceList: [],
    scroll_height: 0,
    status_color: app.globalData.red_color,
    orderData: {},
    isMemberReduce: isMemberReduce,
    isRequest: isRequest
  },
  onUnload() {
    // 页面被关闭
    orderData = {};
    reduceList = [];
    orderNo = '';
    isMemberReduce = false
    isRequest = 0
  },
  onLoad(query) {
    var windowH = my.getSystemInfoSync().windowHeight
    var windowW = my.getSystemInfoSync().windowWidth
    var height = windowH - 49;
    var image_width = (windowW - 32) / 3;
    this.setData({
      reduceList: reduceList,
      scroll_height: height,
      image_width: image_width,
      orderData: orderData
    })
    fromType = query.fromType
    if (query.fromType == 'list' || query.fromType == 'unpaid') {
      orderNo = query.orderNo
      this.reloadData()
    } else if (query.fromType == 'opendoor') {
      orderData = JSON.parse(query.orderData)
      reduceList = this.getReduceItems()
      isRequest = 1
      this.setData({
        reduceList: reduceList,
        orderData: orderData,
        isMemberReduce: isMemberReduce,
        isRequest: isRequest
      })
    }
    // orderData = query.orderData
    // orderData.goodsList = orderData.machineIndentCountList
    // console.log(orderData)

  },
  reloadData: function () {
    var that = this
    isRequest = 0
    this.setData({
      isRequest: isRequest
    })
    var url = app.globalData.servel_url + 'orderDetail'
    my.showLoading({
      content: '正在加载',
    });
    my.httpRequest({
      url: url,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        uid: app.userInfo.uid,
        token: app.userInfo.token,
        orderNo: orderNo,
      },
      success: function (res) {
        my.hideLoading();
        console.log(res.data.data);
        isRequest = 1
        if (res.data.code == '0') {
          orderData = res.data.data
          reduceList = that.getReduceItems()
          that.setData({
            reduceList: reduceList,
            orderData: orderData,
            isMemberReduce: isMemberReduce,
            isRequest: isRequest
          })
        } else {
          my.showToast({
            content: res.data.msg,
          })
        }
      },
      fail: function (res) {
        my.hideLoading();
        isRequest = 2
        console.log(isRequest);
        that.setData({
          isRequest: isRequest
        })
        my.showToast({
          content: '请求失败',
          duration: app.showToastDuring
        })
      },
    })
  },
  repurchase: function () {
    my.navigateBack({
      delta: 2
    })
  },
  goAfterSell:function(){
    console.log(orderNo)
    my.navigateTo({
      url: '../afterSale/afterSale?orderNo=' + orderNo
    })
  },
  getReduceItems: function () {
    var reduse = new Array()
    if (parseFloat(orderData.couponReduce) > 0) {
      var item =
        {
          "type": "减",
          "typeName": "优惠券",
          "reduceCount": "-¥" + orderData.couponReduce
        }
      console.log(item)
      reduse.push(item)
    }
    if (parseFloat(orderData.memberReduce) > 0) {
      var item =
        {
          "type": "省",
          "typeName": "会员节省",
          "reduceCount": "-¥" + orderData.memberReduce
        }
      isMemberReduce = true

      console.log(item)
      reduse.push(item)
    }
    if (parseFloat(orderData.integralReduce) > 0) {
      var item =
        {
          "type": "积",
          "typeName": "积分",
          "reduceCount": "-¥" + orderData.integralReduce
        }
      console.log(item)
      reduse.push(item)
    }
    if (parseFloat(orderData.balanceReduce) > 0) {
      var item =
        {
          "type": "余",
          "typeName": "余额",
          "reduceCount": "-¥" + orderData.balanceReduce
        }
      console.log(item)
      reduse.push(item)
    }
    console.log(reduse)
    return reduse;
  },
  zhifu: function (e) {
    if (orderData.orderState == '7') {
      my.navigateBack({
        delta: 5
      })
      return
    }
    orderNo = orderData.orderNo
    var that = this;
    Request.payOrder(orderNo, orderData.payAmount, '会员柜订单:' + orderNo, function () {
      that.reloadData()
      //刷新订单列表页面
      if (fromType = 'list') {
        app.isRefreshOrderList = true
      }
    }, function () {

    })
  },
});

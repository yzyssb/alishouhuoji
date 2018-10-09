var Request = require('../../Utils/Request.js');
var orderData = {};
var reduceList = [];
var orderNo = '1000000369780347';
var app = getApp();
var isMemberReduce = false
var isRequest = 0
var payButtonCanClick = true
var isPaySuccess = false
var reloadCount = 0
var userInfo = null
var fromType
Page({
  data: {
    tabs: [{
      name: "全部",
      after_stare: '0'
    }, {
      name: "待处理",
        after_stare: '2'
    }],
    activeIndex:0,
    sliderLeft: 0,
    sliderOffset: 0,
    tabWidth: 0,
    userInfo:{},
    after_state: 0,
    appealList:[]
  },
  
  onLoad(query) {
    var that =this;
  },
  onShow() {
    userInfo = app.userInfo
    this.setData({
      userInfo:userInfo
    })
    this.reloadData()
  },
  //切换tab
  tabClick:function(e){
    var state = e.currentTarget.dataset.state;
    this.setData({
      after_state: state
    })
    this.reloadData()
  },
  //获取售后列表
  reloadData: function () {
    var that = this
    isRequest = 0
    this.setData({
      isRequest: isRequest
    })
    var url = app.globalData.servel_url + 'machineAfterSale/findlist'
    var params = {
      uid: app.userInfo.uid,
      after_state: this.data.after_state
    }
    Request.request(url, params, '正在加载', function (res) {
      isRequest = 1
      if (res.code == '0') {
        
        orderData = res.data
        that.setData({
          appealList: orderData
        })
      } else {
        setTimeout(function () {
          my.showToast({
            content: res.msg,
            duration: app.showToastDuring
          })
        }, app.delayTime)

      }
    }, function () {
      that.setData({
        isRequest: isRequest
      })
      setTimeout(function () {
        my.showToast({
          content: '请求失败',
          duration: app.showToastDuring
        })
      }, app.delayTime)
    });
  }, 
});
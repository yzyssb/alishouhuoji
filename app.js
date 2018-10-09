App({
  todos: [
    { text: 'Learning Javascript', completed: true },
    { text: 'Learning ES2016', completed: true },
    { text: 'Learning 支付宝小程序', completed: false },
  ],
  onLaunch(options) {
    //获取关联普通二维码的码值，放到全局变量qrCode中
   if(options.query && options.query.qrCode) {
      // console.log(options);//测试普通关联二维码
      this.qrCode = options.query.qrCode;
    }
    this.getUserInfo()
    
  },
  userInfo: null,//用户信息
  phoneNum : '',
  aliUserInfo:null,//支付宝用户信息
  qrCode: null,//二维码
  dateImage:null,//背景图
  dateStr:null,//不同时间提示的文字
  storeId:null,//门店id
  showToastDuring:900,//提示文字时间
  isRefreshOrderList : false,//从订单详情回来是否需要重新刷新订单列表
  getUserInfo() {
    this.userInfo = my.getStorageSync({ key: 'userInfo' }).data;
    this.aliUserInfo =  my.getStorageSync({ key: 'aliUserInfo' }).data;
  },
  getCurrentTimeType(){
    var date = new Date();
    var hour = date.getHours()  
    var minute = date.getMinutes()  
    var second = date.getSeconds() 
    var dateStr = this.formatNumber(hour) +":" +this.formatNumber(minute)  + ":"+this.formatNumber(second)
    var type = 0 
    if(dateStr >= '06:30:00' && dateStr < '10:00:00'){
      this.dateImage = '../../image/morning.jpg'
      this.dateStr = "美好的一天从早餐开始"
    }else if(dateStr >= '10:00:00' && dateStr < '14:00:00'){
      this.dateImage = '../../image/noon.jpg'
      this.dateStr = "完美午餐,请多加一点"
    }else if(dateStr >= '14:00:00' && dateStr < '17:00:00'){
      this.dateImage = '../../image/afternoon.jpg'
      this.dateStr = "困了吗？叫上好友休闲一下吧!"
    }else{
      this.dateImage = '../../image/night.jpg'
      this.dateStr = "努力了一天,犒劳一下自己吧!"
    }
    console.log(dateStr)
  },
  
  formatNumber(n) {  
  n = n.toString()  
  return n[1] ? n : '0' + n  
  },
  globalData: {
    userInfo: null, 
     //servel_url :'http://39.107.205.154:8080/machine/',
     servel_url:'https://machine-pay.27aichi.com/machine/',
    //servel_url:'https://machine.27aichi.com/machine/',
    test_url:'https://www.easy-mock.com/mock/5a5dcde924f2fc35a9bf549c/machine/',
    red_color:"#ff0000",
    green_color: "#009e96",
    //user_url:'http://test1-passport.27aichi.com/passport/',
    // user_url:'https://passport.27aichi.com/passport/',
    //user_url:'https://dev1-passport.27aichi.com/passport/',
     user_url:'https://dev-gds-crius-user.27aichi.com/api/passport/',
    //user_url:'https://gds-crius-user.27aichi.com/api/passport/',

    //userInfo_url: "https://test1-newsns.27aichi.com/api/v2/",
    //userInfo_url: "https://dev1-passport.27aichi.com/api/v2/",
     userInfo_url: "https://dev-gds-crius-user.27aichi.com/api/v2/",
//userInfo_url: "https://gds-crius-user.27aichi.com/api/v2/",
    // userInfo_url: "https://newsns.27aichi.com/api/v2/",
  }
});



var Base64 = require('../../Libs/base64.js'); 
var Request =  require('../../Utils/Request.js');
var app = getApp()
Page({
  data: {},
  onLoad() {
    
  },

  //获取验证码
  getSms:function(){
     var url = app.globalData.user_url+ 'sms/getsms'
    var object = {
      mobile:"15333160374",
      sendType:1,
      isCheckMobile:1,
      purposeType:5
    }
    JSON.stringify(object);
    var params = {
       data: Base64.base64_encode(JSON.stringify(object))
     };
    Request.request(url,params,'try',function (res) {
      console.log(res);
    },function () {
      my.showToast({
        content: '加载数据失败',
      })
    }
    );
  },
});


var app = getApp()

Page({
  data: {
    message: '正在开门,请稍后',
    sub_message: '',
    customerServicePhone: '', //客服电话
    userInfo: {}
  },
  onLoad(query) {
    console.log(query)
    var phone = 
    this.setData({
      backgroundImage: app.dateImage,
      customerServicePhone :query.customerServicePhone
    })
  },
  //拨打客服电话
  callPhone:function(){
    console.log(this.data)
    my.makePhoneCall({
      number: this.data.customerServicePhone 
    })
  },
});

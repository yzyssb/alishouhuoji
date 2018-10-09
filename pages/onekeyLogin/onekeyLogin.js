var app = getApp()  
Page({
  data: {},
  onLoad() {

     my.getAuthCode({
      scopes: 'auth_user',
      success: (res) => {
         my.getAuthUserInfo({
         success: (userInfo) => {
         app.aliUserInfo = userInfo
         if (app.userInfo) {
           app.userInfo.nickName = userInfo.nickName
           app.userInfo.avatar = userInfo.avatar
         }
      }
    });
  },
});
  },
  onShow() {
    if(app.userInfo){
      my.navigateBack({
  
       })
    }
  },
  gotomobileLogin :function(){
     my.navigateTo({
      url: '../mobileLogin/mobileLogin',
    })
  },
  onkeyLogin:function(){
     var url = app.globalData.user_url + 'social.php/ShopMachine/reg_login'
      console.log(url)
      my.httpRequest({
       url: url,
       method: 'POST',
       data: {
         mobile: '15333160374',
         smsCode: '',
         store_id:'41'
        // mobile:phoneNum,
        //  smsCode:vertify_code,
        //  type:2,
        //  client:1
       },
       dataType: 'json',
       success: function(res) {
         console.log(res.data)
         if(res.data.code == '0'){
            var userInfo = res.data.data
            userInfo.nickName = app.aliUserInfo.nickName
            userInfo.avatar = app.aliUserInfo.avatar
            console.log(userInfo)
            //登录成功存入本地
            my.setStorageSync({
              key: 'userInfo',
              data:userInfo,
              success: function() {
                my.alert({content: '登录成功'});
                
              }
            });
            app.getUserInfo()
            my.navigateBack({
  
            })
         }else{
             my.alert({content: res.data.msg});
         }
       },
       fail: function(res) {
         console.log(res)
        //  my.alert({content: 'fail'});
       },
       complete: function(res) {
      
       }
     });
  }
});

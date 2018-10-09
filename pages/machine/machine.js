Page({
  data: {
    title:"售卖机",
    page:'/scan-code/scan-code'
  },
  onLoad() {},

  toscan(){
    my.alert({
      title: '测试', // alert 框的标题
      success: (res) => {
        //  my.alert({ title: res.code });
        
      },
    });
    console.log('haha');
    my.navigateTo({
    url: '../scan-code/scan-code',
    fail: (res) => {
        //  my.alert({ title: res.code });
        console.log(res);
      }
    }) ;
  },

  imageError:function(e){
        console.log('image3 发生错误', e.detail.errMsg)

      },
  imageLoad:function(e){
        console.log('image 加载成功', e);
  }    
      
});

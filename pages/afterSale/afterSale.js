var Request = require('../../Utils/Request.js');
var orderData = {};
var reduceList = [];
var orderNo = '';
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
    cur:0,
    orderData:{},
    isRequest: isRequest,
    noGoodsPromble:false,
    questionArr:[
      {question_title:'商品包装破损'},
      { question_title: '商品保质期问题' },
      { question_title: '多扣费' },
      { question_title: '其他问题' }
    ],
    question_content:'',
    questionCurindex:0,
    showTextarea:false,
    imgList:[],
    userInfo:{},
    goodsList:[],
    goods_no:'',
    goods_name:''
  },
  
  onLoad(query) {
    orderNo = query.orderNo 
    console.log('orderNo'+orderNo)
  },
  onShow() {
    userInfo = app.userInfo
    this.reloadData()
    this.setData({
      userInfo:userInfo
    })
  },
  //选择申请售后商品
  chooseGoods: function(e){
    var noGoodsPromble = this.data.noGoodsPromble;
    var indexId = e.currentTarget.dataset.id
    var goodsList = this.data.goodsList;
    goodsList.map((item,index)=>{
      if(index==indexId){
        item.choose=!item.choose
        if(item.choose){
          noGoodsPromble = false
        }
      }
    })
    this.setData({
      goodsList: goodsList,
      noGoodsPromble: noGoodsPromble
    })
  },
  //选择非商品问题
  chooseNoGoods: function(){
    var noGoodsPromble = this.data.noGoodsPromble;
    noGoodsPromble = !noGoodsPromble;
    var goodsList = this.data.goodsList;
    goodsList.map((item, index) => {
      if (noGoodsPromble){
        item.choose = false
      }
    })
    this.setData({
      noGoodsPromble: noGoodsPromble,
      goodsList: goodsList
    })
  },
  //步骤一 下一步
  oneNext:function(){
    var chooseGoods= false;
    var goodsList = this.data.goodsList;
    goodsList.map((item, index) => {
      if (item.choose ){
        chooseGoods=true;
      } 
    })
    if (!chooseGoods&&!this.data.noGoodsPromble){
      my.showToast({
        content: '请选择商品或者勾选非商品问题',
        duration: app.showToastDuring
      })
      return;
    }
    var goodsNoArr = []
    var goodsNameArr = []
    var goods_no='';
    var goods_name='';
    goodsList.map((item, index) => {
      if (item.choose) {
        goodsNoArr.push(item.goodsID),
          goodsNameArr.push(item.goodsName)
      }
    })
    if (goodsNoArr.length > 0) {
      goods_no = goodsNoArr.join(",");
      goods_name = goodsNameArr.join(",")
    }
    this.setData({
      cur:1,
      goods_no: goods_no,
      goods_name: goods_name
    })
  },
  //步骤二 上一步
  twoPrev:function(){
    this.setData({
      cur: 0
    })
  },
  //步骤二 下一步
  twoNext: function(){
    var questionCurindex = this.data.questionCurindex
    if (questionCurindex == 3 && this.data.question_content==''){
      my.showToast({
        content: '请输入问题描述',
        duration: app.showToastDuring
      })
      return;
    }
    this.setData({
      cur: 2
    })
  },
  //选择售后类型
  chooseQuestion:function(e){
    var showTextarea = this.data.showTextarea
    if (e.currentTarget.dataset.id==3){
      showTextarea=true
    }else{
      showTextarea = false
    }

    this.setData({
      questionCurindex: e.currentTarget.dataset.id,
      showTextarea: showTextarea
    })
  },
  //输入其他问题描述
  inputContent:function(e){
      this.setData({
        question_content:e.detail.value
      })
  },
  //获取订单详情数据
  reloadData: function () {
    var that = this
    isRequest = 0
    this.setData({
      isRequest: isRequest
    })
    var url = app.globalData.servel_url + 'orderDetail'
    var params = {
      uid: app.userInfo.uid,
      token: app.userInfo.token,
      orderNo: orderNo
    }
    Request.request(url, params, '正在加载', function (res) {
      isRequest = 1
      if (res.code == '0') {
        
        orderData = res.data
        orderData.goodsList.map((item)=>{
            item.choose=false
            item.discount=(((item.goodsOriginal-item.memberPrice)/item.goodsOriginal)*100).toFixed(1)
        })

        that.setData({
          orderData: orderData,
          isMemberReduce: isMemberReduce,
          isRequest: isRequest,
          goodsList: orderData.goodsList
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
  // joinImg: function (e) {
  //   var that=this
  //   if(this.data.imgList&&this.data.imgList.length>=3){
  //     setTimeout(function () {
  //       my.showToast({
  //         content: '最多只能上传三张图片哦',
  //         duration: app.showToastDuring
  //       })
  //     }, app.delayTime)
  //     return;
  //   }
  //   my.showActionSheet({
  //     items: ["拍摄", "从手机相册选择"],
  //     itemColor: "#00",
  //     success: function (res) {
  //       console.log(res)
  //       if (res.index!=-1) {
  //         if (res.index == 0) {
  //           that.chooseWxImage("camera");
  //         } else if (res.index == 1) {
  //           that.chooseWxImage("album");
  //         }
  //       }
  //     }
  //   })
  // },
  //选择图片
  chooseWxImage:function(){
    
    var that=this
    if(that.data.imgList&&that.data.imgList.length>=3){
      setTimeout(function () {
        my.showToast({
          content: '最多只能上传三张图片哦',
          duration: app.showToastDuring
        })
      }, app.delayTime)
      return;
    }
    var count = 3- that.data.imgList.length
    if(count>0){
      my.chooseImage({
        count: count,
        success: function (res) {
          that.uploadImg(res.apFilePaths)
        },
      })
    }else{
      setTimeout(function () {
        my.showToast({
          content: '最多只能上传三张图片哦',
          duration: app.showToastDuring
        })
      }, app.delayTime)
      return;
    }
    
  },
  //提交售后
  submit:function(){
    var url = app.globalData.servel_url +'machineAfterSale/update'
    var params={}
    params.uid = this.data.userInfo.uid;
    params.randomname = new Date();
    params.randompwd = new Date();
    params.order_no = orderNo;
    params.question_title = this.data.questionArr[this.data.questionCurindex].question_title
    params.question_content = this.data.question_content
    params.goods_names = this.data.goods_name
    params.goods_nos = this.data.goods_no
    
    if(this.data.imgList.length>0){
      var imgList = this.data.imgList
      imgList.map((item,index)=>{
        params['oss_pic_url' + (index+1)]=item
      })
    }
    console.log(params)
    var that=this
    Request.request(url, params, '提交', function (res) {
      isRequest = 1
      if (res.code == '0') {
          my.navigateTo({
            url: '../appealList/appealList',
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
  //上传图片
  uploadImg: function (tempFilePaths) {
    var uploadImgCount = 0;
    my.showLoading({
      content: '正在上传...',
      delay: 10000,
    });
    var that=this
    for (var i = 0, h = tempFilePaths.length; i < h; i++) {
      my.uploadFile({
        url: app.globalData.servel_url + 'machineAfterSale/batch/uploadPics',
        filePath: tempFilePaths[i],
        fileName: 'oss_pic_url',
        formData: null,
        fileType:'image',
        // header: {
        //   "Content-Type": "multipart/form-data"
        // },
        success: function (res) {
          console.log(res)
          // uploadImgCount++;
          // var imgList = that.data.imgList
          // imgList.push(data.data.oss_pic_url1)
          // that.setData({
          //   imgList: imgList
          // });

          // //如果是最后一张,则隐藏等待中  
          // if (uploadImgCount == tempFilePaths.length) {
          //  my.hideLoading();
          // }
        },
        fail: function (res) {
          my.hideLoading();

          my.alert({
            title: '温馨提示',
            content: '上传图片失败',
            buttonText: '确定',
            success: () => {},
          });
        }
      });
    }
  },
  //删除图片
  delImg:function(e){
    var index = e.currentTarget.dataset.id
    var imgList = this.data.imgList
    imgList.splice(index, 1) 
    this.setData({
      imgList:imgList
    })
  }
});
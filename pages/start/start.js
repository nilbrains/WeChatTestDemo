//login.js
//获取应用实例
var app = getApp();
Page({
  data: {
    remind: true,
    angle: 0
  },
  onLoad:function(){
    wx.showToast({
      title: '加载中...',
      mask: true,
      icon: 'loading',
      duration:200000
    })
    var hturl = app.globalData.hturl;
    var lburl = hturl + '/index/nmshop/initlist'
    wx.request({
      url: lburl,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        app.globalData.goodsList = res.data.lblist;
        app.globalData.goods = res.data.goods;
        app.globalData.categories = res.data.list;
        wx.hideToast();
      },
    })
    var that = this
    that.setData({
      background_color: app.globalData.globalBGColor,
      bgRed: app.globalData.bgRed,
      bgGreen: app.globalData.bgGreen,
      bgBlue: app.globalData.bgBlue
    })
  },
  rushhello:function(){
    wx.showModal({
      title: '你好，开发者',
      content: 'hello world!',
      showCancel: false,
    })
  },
  onShow:function(){
  },
  onReady: function(){
    var that = this;
    that.setData({
      remind: false
    });
    wx.onAccelerometerChange(function(res) {
      var angle = -(res.x*30).toFixed(1);
      if(angle>14){ angle=14; }
      else if(angle<-14){ angle=-14; }
      if(that.data.angle !== angle){
        that.setData({
          angle: angle
        });
      }
    });
  },
  goToIndex:function(){
    wx.showLoading({
      title: '加载中',
    })
    wx.getUserInfo({
      success: function (ress) {
        var nickname = ress.userInfo.nickName;//微信昵称
        var imgtol = ress.userInfo.avatarUrl;//微信头像
        app.globalData.nickname=nickname;
        app.globalData.imgtol=imgtol;
        wx.request({
          url: app.globalData.hturl + 'index/nmshop/insertuser',
          data: {
            openid: app.globalData.openid,
            nickname: nickname
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: "post",
          success: function (res) {
  
            wx.hideLoading();
            console.log(res.data);
            wx.switchTab({
              url: '/pages/classification/index',//数据跳转
            });
          },
        })
      }
    })


  }
});
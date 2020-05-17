// pages/to-pay-order/index.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [], //订单页面的商品信息
    isNeedLogistics: 0, // 是否需要物流信息
    allGoodsPrice: 0, //所有商品的价格
    yunPrice: 0, //运费的价格
    allGoodsAndYunPrice: 0, //所有商品的运费价格
    goodsJsonStr: "", //商品的信息
    orderType: "", //订单类型，购物车下单或立即支付下单，默认是购物车，
    danhao: '', //订单号
    hasNoCoupons: true, //是否有优惠券
    coupons: [], //具体的优惠券内容
    youhuijine: 0, //优惠券金额
    curCoupon: null // 当前选择使用的优惠券
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //显示收货地址标识
    that.setData({
      isNeedLogistics: 1,
      orderType: options.orderType
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var shopList = [];
    //立即购买下单
    if ("buyNow" === that.data.orderType) {
      console.log('buyNow!!')
      var buyNowInfoMem = wx.getStorageSync('buyNowInfo');
      that.data.kjId = buyNowInfoMem.kjId;
      if (buyNowInfoMem && buyNowInfoMem.shopList) {
        shopList = buyNowInfoMem.shopList
      }
    } else {
      //购物车下单
      var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
      that.data.kjId = shopCarInfoMem.kjId;
      if (shopCarInfoMem && shopCarInfoMem.shopList) {
        // shopList = shopCarInfoMem.shopList
        shopList = shopCarInfoMem.shopList.filter(entity => {
          return entity.active;
        });
      }
    }
    that.setData({
      goodsList: shopList,
    });
    // that.initShippingAddress();
  },
  selectAddress:function(){
    wx.navigateTo({
      url: "/pages/select-address/index"
    })
  },

})
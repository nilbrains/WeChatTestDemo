// pages/goods-details/index.js
// 商品 细节
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000,
    goodsDetail: {},
    swiperCurrent: 0,
    hasMoreSelect: false, // 更多
    selectSize: "选择：",
    selectSizePrice: 0,
    shopNum: 0,
    hideShopPopup: true,
    buyNumber: 0,
    buyNumMin: 1,
    buyNumMax: 0,

    shopDeliveryPrice: 0,
    propertyChildIds: "",
    propertyChildNames: "",
    canSubmit: false, //  选中规格尺寸时候是否允许加入购物车
    shopCarInfo: {},
    shopType: "addShopCar", //购物类型，加入购物车或立即购买，默认为加入购物车
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    // 获取购物车数据
    wx.getStorage({
      key: 'shopCarInfo',
      success: function (res) {
        self.setData({
          shopCarInfo: res.data,
          shopNum: res.data.shopNum
        });
      }
    })
    // 加载框
    wx.showToast({
      title: '加载中...',
      mask: true,
      icon: 'loading',
      duration: 200000
    })

    let hturl = app.globalData.hturl;
    wx.request({
      url: `${hturl}/index/nmshop/detail`,
      data: {
        "id": options.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //Todo:返回的数据
        let {
          data
        } = res;
        console.log(data)
        self.setData({
          goodsDetail: data.data,
          selectSizePrice: data.data.basicInfo.minPrice,
          buyNumMax: data.data.basicInfo.stores,
          buyNumber: (data.data.basicInfo.stores > 0) ? 1 : 0
        })
        //加载成功 == 隐藏
        wx.hideToast();
      },
    })
  },
  //事件处理函数
  swiperchange: function (e) {
    // console.log( 'swiperchange index == >'+ e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  // 去购物车页面
  goShopCar: function () {
    wx.reLaunch({
      url: "/pages/shop-cart/index"
    });
  },
  // 加入购物车
  toAddShopCar: function () {
    this.setData({
      shopType: "addShopCar"
    })
    this.bindGuiGeTap();
  },
  // 立即购买
  tobuy: function () {
    this.setData({
      shopType: "tobuy"
    });
    this.bindGuiGeTap();
    /*    if (this.data.goodsDetail.properties && !this.data.canSubmit) {
          this.bindGuiGeTap();
          return;
        }
        if(this.data.buyNumber < 1){
          wx.showModal({
            title: '提示',
            content: '暂时缺货哦~',
            showCancel:false
          })
          return;
        }
        this.addShopCar();
        this.goShopCar();*/
  },
  // 规格选择弹出框
  bindGuiGeTap: function () {
    this.setData({
      hideShopPopup: false
    })
  },
  // 规格选择弹出框隐藏
  closePopupTap: function () {
    this.setData({
      hideShopPopup: true
    })
  },
  // 减 数量
  numJianTap: function () {
    if (this.data.buyNumber > this.data.buyNumMin) {
      var currentNum = this.data.buyNumber;
      currentNum--;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  // 加 数量
  numJiaTap: function () {
    if (this.data.buyNumber < this.data.buyNumMax) {
      var currentNum = this.data.buyNumber;
      currentNum++;
      this.setData({
        buyNumber: currentNum
      })
    }
  },

  // 加入购物车
  addShopCar: function () {
    //  todo 
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel: false
      })
      return;
    }
    //组建购物车
    var shopCarInfo = this.bulidShopCarInfo();

    this.setData({
      shopCarInfo: shopCarInfo,
      shopNum: shopCarInfo.shopNum
    });

    // 写入本地存储
    wx.setStorage({
      key: "shopCarInfo",
      data: shopCarInfo
    })
    this.closePopupTap();
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      duration: 2000
    })
    console.log("goods detail shopCarInfo ====> ");
    console.log(shopCarInfo);
  },
  //立即购买
  buyNow: function () {
    //  todo
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel: false
      })
      return;
    }
    wx.showModal({
      title: '提示',
      content: '没有写！！！',
      showCancel: false
    })
    this.closePopupTap();

    wx.navigateTo({
      url: "/pages/to-pay-order/index?orderType=buyNow"
    })

  },
  // 组建购物车信息
  bulidShopCarInfo: function () {
    //加入购物车
    var shopCarMap = {}; //构建一个购物车对象
    shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id; //将商品信息传递到购物车页面
    shopCarMap.pic = this.data.goodsDetail.basicInfo.pic; //将商品信息传递到购物车页面
    shopCarMap.name = this.data.goodsDetail.basicInfo.name; //将商品信息传递到购物车页面
    //shopCarMap.label=this.data.goodsDetail.basicInfo.id;规格尺寸
    shopCarMap.propertyChildIds = this.data.propertyChildIds; //将商品信息传递到购物车页面
    shopCarMap.label = this.data.propertyChildNames; //将商品信息传递到购物车页面
    shopCarMap.price = this.data.selectSizePrice; //将商品信息传递到购物车页面
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = this.data.buyNumber; //将商品信息传递到购物车页面
    shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId; //将商品信息传递到购物车页面
    shopCarMap.logistics = this.data.goodsDetail.logistics; //将商品信息传递到购物车页面
    shopCarMap.weight = this.data.goodsDetail.basicInfo.weight; //将商品信息传递到购物车页面
    var shopCarInfo = this.data.shopCarInfo; //将全局变量赋值给当前的变量
    if (!shopCarInfo.shopNum) {
      shopCarInfo.shopNum = 0;
    }
    if (!shopCarInfo.shopList) {
      shopCarInfo.shopList = [];
    }
    var hasSameGoodsIndex = -1;
    for (var i = 0; i < shopCarInfo.shopList.length; i++) {
      var tmpShopCarMap = shopCarInfo.shopList[i];
      if (tmpShopCarMap.goodsId == shopCarMap.goodsId && tmpShopCarMap.propertyChildIds == shopCarMap.propertyChildIds) {
        hasSameGoodsIndex = i;
        shopCarMap.number = shopCarMap.number + tmpShopCarMap.number;
        break;
      }
    }
    shopCarInfo.shopNum = shopCarInfo.shopNum + this.data.buyNumber;
    if (hasSameGoodsIndex > -1) {
      shopCarInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap);
    } else {
      shopCarInfo.shopList.push(shopCarMap);
    }
    shopCarInfo.kjId = this.data.kjId;
    return shopCarInfo;
  },
})
// pages/shop-cart/index.js
var  app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: {
      saveHidden: true,
      totalPrice: 0,
      allSelect: true, //全选
      noSelect: false, //全不选
      list: []
    },
    shopDeliveryPrice: [], // 运费 
    delBtnWidth: 120, //删除按钮宽度单位（rpx）
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  onShow: function () {
    var  shopList = [];
    // 获取购物车数据
    var  shopCarInfoMem = wx.getStorageSync('shopCarInfo');
    if (shopCarInfoMem && shopCarInfoMem.shopList) {
      shopList = shopCarInfoMem.shopList
    }
    this.data.goodsList.list = shopList;
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), shopList);
  },
  //设置数据
  setGoodsList: function (saveHidden, total, allSelect, noSelect, list) {
    this.setData({
      goodsList: {
        saveHidden: saveHidden,
        totalPrice: total,
        allSelect: allSelect,
        noSelect: noSelect,
        list: list
      }
    });
    var shopCarInfo = {};
    var tempNumber = 0;
    shopCarInfo.shopList = list;
    for (var i = 0; i < list.length; i++) {
      tempNumber = tempNumber + list[i].number
    }
    shopCarInfo.shopNum = tempNumber;
    wx.setStorage({
      key: "shopCarInfo",
      data: shopCarInfo
    })
  },
  getSaveHide: function () {
    var saveHidden = this.data.goodsList.saveHidden;
    return saveHidden;
  },
  totalPrice: function () {
    var list = this.data.goodsList.list;
    var total = 0;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (curItem.active) {
        total += parseFloat(curItem.price) * curItem.number;
      }
    }
    total = parseFloat(total.toFixed(2)); //js浮点计算bug，取两位小数精度
    return total;
  },
  allSelect: function () {
    var list = this.data.goodsList.list;
    var allSelect = false;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (curItem.active) {
        allSelect = true;
      } else {
        allSelect = false;
        break;
      }
    }
    return allSelect;
  },
  noSelect: function () {
    var list = this.data.goodsList.list;
    var noSelect = 0;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (!curItem.active) {
        noSelect++;
      }
    }
    if (noSelect == list.length) {
      return true;
    } else {
      return false;
    }
  },
  bindAllSelect: function () {
    var currentAllSelect = this.data.goodsList.allSelect;
    var list = this.data.goodsList.list;
    if (currentAllSelect) {
      for (var i = 0; i < list.length; i++) {
        var curItem = list[i];
        curItem.active = false;
      }
    } else {
      for (var i = 0; i < list.length; i++) {
        var curItem = list[i];
        curItem.active = true;
      }
    }

    this.setGoodsList(this.getSaveHide(), this.totalPrice(), !currentAllSelect, this.noSelect(), list);
  },
  selectTap: function (e) {
    // 商品选项 radiobtn
    var index = e.currentTarget.dataset.index;
    console.log(index);
    var list = this.data.goodsList.list;
    if (index !== "" && index != null) {
      list[parseInt(index)].active = !list[parseInt(index)].active;
      this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
    }
  },
  jiaBtnTap: function (e) {
    var that=this
    var index = e.currentTarget.dataset.index;
    var list = that.data.goodsList.list;
    var hturl = app.globalData.hturl;
    if (index !== "" && index != null) {
      //添加判断当前商品购买数量是否超过当前商品可购买库存
      var carShopBean = list[parseInt(index)];
      var carShopBeanStores = 0;
      wx.request({
        url: hturl + "index/nmshop/detail",
        data: {
          id: carShopBean.goodsId,
        },
        success: function (res) {
          carShopBeanStores = res.data.data.basicInfo.stores;
          console.log(
            "currnetgoodidandstoresis:",
            carShopBean.goodsId,
            carShopBeanStores
          );
          if (list[parseInt(index)].number < carShopBeanStores) {
            list[parseInt(index)].number++;
            that.setGoodsList(
              that.getSaveHide(),
              that.totalPrice(),
              that.allSelect(),
              that.noSelect(),
              list
            );
          } else {
            wx.showToast({
              title: '你只能买这么多',
              duration:1000,
            })
            list[parseInt(index)].number = carShopBeanStores;
            that.setGoodsList(
              that.getSaveHide(),
              that.totalPrice(),
              that.allSelect(),
              that.noSelect(),
              list
            );
          }
          that.setData({
            curTouchGoodStores: carShopBeanStores,
          });
        },
      });
    }    
  },
  jianBtnTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if (index !== "" && index != null) {
      if (list[parseInt(index)].number > 1) {
        list[parseInt(index)].number--;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
      }
    }
  },
  setNumberInput:function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var list = that.data.goodsList.list;
    var hturl = app.globalData.hturl;
    if (index !== "" && index != null) {
      // 添加判断当前商品购买数量是否超过当前商品可购买库存
      var carShopBean = list[parseInt(index)];
      var carShopBeanStores = 0;
      wx.request({
        url: hturl + "index/nmshop/detail",
        data: {
          id: carShopBean.goodsId,
        },
        success: function (res) {
          carShopBeanStores = res.data.data.basicInfo.stores;
          console.log(' currnet good id and stores is :', carShopBean.goodsId, carShopBeanStores)
          if (parseInt(e.detail.value) < parseInt(carShopBeanStores)) {
            list[parseInt(index)].number = parseInt(e.detail.value);
            that.setGoodsList(that.getSaveHide(), that.totalPrice(), that.allSelect(), that.noSelect(), list);
          }
          else {
            wx.showToast({
              title: '你只能买这么多',
              duration:1000,
            })
            list[parseInt(index)].number = parseInt(carShopBeanStores);
            that.setGoodsList(that.getSaveHide(), that.totalPrice(), that.allSelect(), that.noSelect(), list);
          }
          that.setData({
            curTouchGoodStores: parseInt(carShopBeanStores)
          })
        }
      })
    }
  },
  editTap: function () {
    var list = this.data.goodsList.list;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      curItem.active = false;
    }
    this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    var index = e.currentTarget.dataset.index;
    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX;
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var left = "";
      if (disX == 0 || disX < 10) {//如果移动距离小于等于0，container位置不变
        left = "margin-left:0px";
      } else if (disX > 10) {//移动距离大于0，container left值等于手指移动距离
        left = "margin-left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          left = "left:-" + delBtnWidth + "px";
        }
      }
      var list = this.data.goodsList.list;
      if (index != "" && index != null) {
        list[parseInt(index)].left = left;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
      }
    }
  },
  touchE: function (e) {
    var index = e.currentTarget.dataset.index;
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var left = disX > delBtnWidth ? "margin-left:-" + delBtnWidth + "px" : "margin-left:0px";
      var list = this.data.goodsList.list;
      if (index !== "" && index != null) {
        list[parseInt(index)].left = left;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);

      }
    }
  },
  deleteSelected: function () {
    var list = this.data.goodsList.list;
    list = list.filter(function (curGoods) {
      return !curGoods.active;
    });
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },
  toIndexPage:function () {
    wx.switchTab({
      url: "/pages/classification/index"
    });
  },
  saveTap: function () {
    var list = this.data.goodsList.list;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      curItem.active = true;
    }
    this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },
  toPayOrder:function(){
    var that = this;
    wx.navigateTo({
      url: "/pages/to-pay-order/index?totalPrice"+that.data.goodsList.totalPrice
    })
  }
})
//app.js

var _goodName = [
  "板栗(熟）",
  "闽和三红柚 (约4斤/个)",
  "冠友土柚约4斤/个",
  "砂糖桔",
  "广西贡桔",
  "南丰蜜桔",
  "冰糖橙",
  "金桔",
  "烟台富士",
  "莲花橙",
  "红蛇果",
  "糖心富士",
  "纸加膜富士",
  "进口桂圆大",
  "广西甘蔗",
  "库尔勒香梨散装 (大)",
  "库尔勒香梨 (箱装)",
  "晚秋黄梨",
  "麒麟西瓜 (8~10斤/个)",
  "越南黑美人 (约4斤/个)",
  "海南菠萝 (约3斤/个)",
  "芒果",
  "白心火龙果 (约1.5斤/个)",
  "猕猴桃",
  "百香果 (2个/袋)",
  "山里红山楂",
  "柠檬 (2个/袋)",
  "马蹄",
  "板栗",
  "进口去皮甘蔗",
  "黑加仑葡萄干 (300g/袋)",
  "香妃葡萄干（300g/袋）",
  "新疆葡萄干 (300g/袋)",
  "特大巴坦木 (300g/袋)",
  "小金豆杏仁 (1斤/袋)",
  "开心果 (300g/袋)",
  "碧根果 (300g/袋)",
  "夏威夷果 (300g/袋)",
  "坚果抱抱果 (4种口味装)",
  "枣夹核桃 (2个/袋)",
  "185核桃",
  "和田俊枣 (1斤/袋)",
  "新疆灰枣",
  "新疆枣干(特大)",
  "小枣圈",
  "嘎嘣脆酥枣 (袋)",
  "芝麻酥枣（袋）",
  "酒枣（300g）/袋",
  "金丝蜜枣",
  "柿饼 (大)",
  "水果玉米/个",
  "柿饼 (中)",
  "柿饼(盒装）",
  "薄脸皮瓜子 (白)",
  "薄脸皮瓜子 五香",
  "南瓜籽",
  "红枸杞子 (100g/盒)",
  "黑枸杞子 (100g/盒)",
  "紫皮糖（1斤）",
  "红皮糖（1斤）",
  "榴莲饼",
];

var starscore = require("./templates/starscore/starscore.js");
App({
  globalData: {
    page: 1, //初始加载商品时的页面号
    pageSize: 1000, //初始加载时的商品数，设置为10000保证小商户能加载完全部商品
    categories: [], //所有分类
    goodsList: [], //所有与分类关联的商品
    goodsName: [], //对应第一种分类的所有商品名称
    goods: [], //对应第一种分类的所有商品
    hotGoods: ["桔", "火龙果", "香蕉", "酸奶", "甘蔗"], //自定义热门搜索商品
    onLoadStatus: true,
    activeCategoryId: 1,
    token: "123123",
    hturl: "http://localhost/wxgzh/",//api 地址
    globalBGColor: "#00afb4",
    bgRed: 0,
    imgtol: "",
    nickname: "",
    openid: "",
    bgGreen: 175,
    bgBlue: 180,
    userInfo: null,
    subDomain: "tggtest", // 商城后台个性域名tgg
    version: "1.0.0",
    shareProfile: "一流的服务，做超新鲜的水果", // 首页转发的时候术语
  },
  onLaunch: function () {
    var that = this;
    wx.login({
      success: function (res) {
        wx.request({
          url: that.globalData.hturl + "index/nmshop/getopenIdandsessionKey",
          data: {
            code: res.code,
          },
          success: function (res) {
            console.log(res.data.code);
            if (res.data.code != 0) {
              // 登录错误
              wx.hideLoading();
              wx.showModal({
                title: "提示",
                content: res.data.msg,
                showCancel: false,
              });
              return;
            } else {
              that.globalData.openid = res.data.openid;
              console.log(res);
            }
          },
        });
      },
    });

    //  获取商城名称
    wx.setStorageSync("mallName", "用能商城");
    //that.globalData.order_reputation_score = '60';
    //that.globalData.recharge_amount_min = '60';
    // 获取砍价设置
    //that.globalData.kanjiaList = '0';
    // 获取产品分类

    that.globalData.goodsName = _goodName;

    /* that.globalData.categories = [];
    that.globalData.goodsList = [];
    that.globalData.goodsName = [];
    that.globalData.goods = []; */
    that.globalData.onLoadStatus = true;
  },
  sendTempleMsg: function (
    orderId,
    trigger,
    template_id,
    form_id,
    page,
    postJsonString,
    emphasis_keyword
  ) {},
  // 根据自己需要修改下单时候的模板消息内容设置，可增加关闭订单、收货时候模板消息提醒
});

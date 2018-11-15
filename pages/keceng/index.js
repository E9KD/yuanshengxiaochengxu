var app = getApp();
var util = require('../../utils/util.js');
const API_KECENG = 'https://wx.biergao.vip/api/index/';
Page({
  data: {
    movies: '',
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    navData: {},
    swiperData: [],
    swiperStatus: false,
    goodsData: {},
    currentCatId: 0,
    classtype: 0,
    openfenxiao: false
  },
  onShow: function () {
    var that = this;
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    var sid = that.data.sid;
    var uid = openid;
    if (openid == null || openid == 'undefined' || !openid) {
      if (sid) {
        wx.redirectTo({
          url: '../logs/index?sid=' + sid,
        })
      } else {
        wx.redirectTo({
          url: '../logs/index',
        })
      }
      return false;
    } else {
      var fenxiao = app.globalData.fenxiao;
      if (fenxiao == 2) {
        var openfenxiao = true;
      } else {
        var openfenxiao = false;
      }
      app.getUserInfo(function (personInfo) {
        that.setData({
          userInfo: personInfo,
          openid: openid,
          openfenxiao: openfenxiao
        })
      })
    }
  },
  onLoad: function () {
    var self = this;
    var fenxiao = app.globalData.fenxiao;
    // util.getarrimg(function (data) {
    //   self.setData({
    //     movies: data['banner']
    //   });
    // })
    if (fenxiao == 1) {
      self.setData({
        openfenxiao: true,
      })
    } else {
      self.setData({
        openfenxiao: false,
      })
    }
    this.loadNav();
    this.loadGoods();
  },
  // 分类
  loadNav: function () {
    var page = this;
    wx.request({
      url: API_KECENG + 'index',
      success: function (res) {
        console.log(res)
        page.setData({
          navData: res.data
        })
      },
      fail: function (res) {
        console.log('asdas');
      }
    })
  },
  //加载轮播图
  loadSwiper: function () {
    var page = this;
    var swiperData = [];
    wx.request({
      url: 'https://shizhencaiyuan.com/groupAdmin.php/Home/Ad/index',
      success: function (res) {
        var data = res.data.data;
        console.log(data)
        //  for(var i in data) {
        //    swiperData.push(data[i].image)
        //  }
        page.setData({
          swiperData: data
        })
      },
      fail: function (res) {
        // fail
      }
    })

  },
  //加载首页商品
  loadGoods: function () {
    var page = this;
    wx.request({
      url: API_KECENG + 'getTeachers',
      data: {
        "is_goods": 1
      },
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        page.setData({
          goodsData: res.data,
          swiperStatus: false,
          currentCatId: 0
        })
      }
    })
  },
  //点击获取分类上的资源列表
  getCateGoods: function (e) {
    console.log('catid', e);
    var catid = e.currentTarget.dataset.catid;
    var page = this;
    wx.request({
      url: API_KECENG + 'getTeachers', //',
      data: {
        "catid": catid
      },
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('getTeachers', res);
        page.setData({
          goodsData: res.data,
          swiperStatus: true,
          currentCatId: catid,
          classtype: 0
        })
      }
    })
  },
  //点击获取免费按钮上的资源列表
  getClasstype: function (e) {
    console.log('getClasstypeResource', e);
    var catid = e.currentTarget.dataset.catid;
    var classtypeid = e.currentTarget.dataset.classtypeid;
    var page = this;
    wx.request({
      url: API_KECENG + 'getClasstypeResource', //',
      data: {
        "catid": catid,
        "classtypeid": classtypeid
      },
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('getClasstypeResource', res);
        page.setData({
          goodsData: res.data,
          swiperStatus: true,
          classtype: classtypeid
        })
      }
    })
  },
  //商品详情页
  showGoods: function (e) {
    var arr = JSON.stringify(e.currentTarget.dataset.arr);
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    arr = escape(arr);
    wx.navigateTo({
      url: '../zhibo/index?arr=' + arr + '&ucode=' + openid
    })
  },
  sharepic: function (e) {
    wx.redirectTo({
      url: '../canvas/canvas?id=putong',
    })
  },
  // 分享
  onShareAppMessage: function () {
    return {
      title: "比尔高身高管理",
      desc: "曾经和你一样高的人更懂你",
      path: `pages/index/index`
    }
  },
  // 下拉刷新回调接口
  onPullDownRefresh: function () {
    this.onLoad();
  }
})

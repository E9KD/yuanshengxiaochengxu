var app = getApp();
const API_KECENG = 'https://wx.biergao.vip/api/';
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price_yue: '',
    price_ji: '',
    openid: '',
    currentTab: 0,
    price: '',
    payMsg: false,
    time:false,
    isvip:false,
    cfBg:false,
    text1:'',
    text2:''
  },
  //点击切换
  clickTab: function (e) {

    var that = this;

    if (e.target.dataset.current == 0) {
      that.setData({
        currentTab: e.target.dataset.current,
        price: that.data.price_yue
      })
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        price: that.data.price_ji
      })
    }
  },
  emojiShowHide: function () {
    this.setData({
      isShow: !this.data.isShow,
      cfBg: !this.data.cfBg,
    })
  },
  cemojiCfBg: function () {
    this.setData({
      isShow: !this.data.isShow,
      cfBg: !this.data.cfBg,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.request({
      url: 'https://wx.biergao.vip/api/vip/price2',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        that.setData({
          text1:res.data[0],
          text2:res.data[1]
        })
      }
    })
  //  
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
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    app.getUserInfo(function (personInfo) {
      that.setData({
        userinfo: personInfo,
        openid: openid,
      })
    })
    var sel = API_KECENG + 'vip/select';
    var keys = {
      openid: openid
    };
    util.getAj(sel, keys, 'POST', function (data) {
      console.log(data)
      if(data.status == 500){
        that.setData({
          isvip: false
        })
      }else if(data.status == 404){
        that.setData({
          isvip: false
        })
      }else{
        that.setData({
          isvip: true,
          time: data.status
        })
      }
    })
    var pri = API_KECENG + 'vip/price';
    util.getAj(pri, keys, 'POST', function (data) {
      console.log(data);
      that.setData({
        price_yue:data[0],
        price_ji: data[1],
        price: data[0]
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  goRegirect: function (){
    wx.redirectTo({
      url: './setvip',
    })
  },
  clickTab: function (e) {

    var that = this;

    if (e.target.dataset.current == 0) {
      that.setData({
        currentTab: e.target.dataset.current,
        price: that.data.price_yue
      })
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        price: that.data.price_ji
      })
    }
    
  }

})
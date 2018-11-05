var app = getApp();
var util = require('../../utils/util.js');
var url = 'https://wx.biergao.vip/api/biaob/getuserfnxiaoinfomsg';
// https://wx.biergao.vip/api/biaob/getuserfnxiaoinfo
Page({
  data: {
    openid: '',
    currentTab: 3,
    userlist: false
  },
  onReady: function () {
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        var hh = res.windowHeight;
        var hw = res.windowWidth - 30;
        var hw20 = hw - 20;
        var hw20_3 = hw20 / 3;
        var hw20_hw20_3 = hw20 - hw20_3 - 25;
        var hw20_3_20 = hw20_3 - 20;
        console.log(hw);
        self.setData({
          hw: hw,
          hh: hh,
          hw20: hw20,
          hw20_3: hw20_3,
          hw20_hw20_3: hw20_hw20_3,
          hw20_3_20: hw20_3_20
        })
      },
    });
  },
  lookuserinfo: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../userifnomsg/userifnomsg?id=' + id,
    })
  },
  onShow:function(){
    var that = this;
    setTimeout(function () {
      console.log();
      wx.request({
        url: url, //',
        data: {
          "g": 3,
          "sid": that.data.userInfo.sid,
          "uid": that.data.userInfo.userid
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log('getTeachers', res);
          that.setData({
            userlist: res.data,
          })
          wx.hideToast();
        }
      })
    }, 4000)
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    var that = this;
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    app.getUserInfo(function (personInfo) {
      that.setData({
        userInfo: personInfo,
        openid: openid,
      })
    })

  },
  //点击切换
  clickTab: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      console.log('catid', e);
      var jm = e.target.dataset.current;
      wx.request({
        url: url, //',
        data: {
          "g": jm,
          "sid": that.data.userInfo.sid,
          "uid": that.data.userInfo.userid
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log('getTeachers', res);
          that.setData({
            userlist: res.data,
            currentTab: e.target.dataset.current
          })
        }
      })
    }
  },

})

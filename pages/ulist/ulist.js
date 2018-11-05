const app = getApp()
var util = require('../../utils/util.js');
let local = 'https://wx.biergao.vip/api/';
Page({
  data: {
    userInfo: {},
    loading: false,
    list:0
  },
  onShow: function () {
    var that = this;
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    setTimeout(function () {
      if (app.globalData.userInfo) {
        that.setData({
          userInfo: app.globalData.userInfo,
          openid: openid
        })
        var url = local + 'biaob/userMorenew/';
        var keys = {
          openid: openid
        };
        util.getAj(url, keys, 'GET', function (data) {
          if (data) {
            that.setData({
              openid: openid,
              list: data
            })
          }
        })
        wx.hideToast();
      } else {
        app.applyNotice();
        return false;
      }
    }, 1800)
  },
  usercount:function(e){
    var arr = JSON.stringify(e.currentTarget.dataset.arr);
    wx.navigateTo({
      url: '/pages/usercount/index?arr=' + arr,
    })
  },
  ChangeHeight(e){
    let param=e.target.dataset
    param.userid=this.data.userInfo.userid
    wx.navigateTo({
      url: `/pages/changeheight/changeheight?param=${JSON.stringify(param)}`
    })
  }
})  
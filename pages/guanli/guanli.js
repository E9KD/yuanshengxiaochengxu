var app = getApp();
var util = require('../../utils/util.js');
const API_CHILD = 'https://wx.biergao.vip/api/Child/';
const API_URL = 'https://wx.biergao.vip/api/biaob/';
Page({
  data: {
    openid: null,
    loadingText: "加载中",
    loading: false,
    disabled: false,
    loadingHide: false,
    showMessage: false,
    messageContent: ''
  },
  backadd: function () {
    var that = this;
    wx.request({//
      url: API_CHILD + 'isChild/openid/' + that.data.openid,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        if (res.data.result == 'error') {
          app.applyNotice();
          return false;
        } else if (res.data.result == 'true') {
          wx.switchTab({    //跳转到tabBar页面，并关闭其他所有tabBar页面
            url: '/pages/user/user',
          })
        } else {
          wx.navigateTo({
            url: '/pages/child/add',
          })
        }
      }
    });
  },
  onLoad: function () {
    var that = this;
    if (!wx.getStorageSync('openid') && !wx.getStorageSync('userid')) {
      wx.showToast({
        title: '请先同意授权',
        icon: 'none'
      })
      return false;
    }
    setTimeout(function () {
      that.setData({
        loadingHide: true,
      })
    }, 2000);

    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo,
        openid: openid
      })
    })
  },
  tap: util.throttle(function (e) {
    console.log(this)
    console.log(e)
    console.log((new Date()).getSeconds())
  }, 1000),
  getInviteCode: function () {
    var that = this;
    app.getUserInfo();
    if (!wx.getStorageSync('openid') && !wx.getStorageSync('userid')) {
      wx.showToast({
        title: '请先同意授权',
        icon: 'none'
      })
    } else {
      setTimeout(function () {
        var openuid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
        if (!openuid) {
          var url1 = false;
          that.setData({
            url: url1
          })
        } else {
          that.setData({
            openid: openuid
          });
          if (openuid) {
            wx.request({//
              url: API_CHILD + 'isChild/openid/' + openuid,
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                var url1 = "/pages/user/user";
                var url2 = "/pages/child/add";
                if (res.data == true) {
                  that.setData({
                    url: url1
                  })
                  console.log('1')
                } else {
                  that.setData({
                    url: url2
                  })
                }
              }
            });
          }
        }
      }, 1000)
      // app.getUserInfo(function (userInfo) {
      //   that.setData({
      //     userInfo: userInfo,
      //     openid: openid
      //   })
      // })
    }
  },
  onShareAppMessage: function () {
    return {
      title: "比尔高身高管理",
      desc: "曾经和你一样高的人更懂你",
      path: `pages/index/index`
    }
  },
  onShow: function () {
  },
})
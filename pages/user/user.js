var app = getApp();
var util = require('../../utils/util.js');
let API_URL = 'https://wx.biergao.vip/api/biaob/',
  local = 'https://wx.biergao.vip/api/';
Page({
  data: {
    openid: null,
    iszhibo: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isvip:false,
    showMessage: false,
    messageContent: ''
  },
  getUserInfo: function (e) {
    var that = this;
    setTimeout(function () {
      if (app.globalData.userInfo) {
        that.setData({
          userInfo: app.globalData.userInfo,
          openid: app.globalData.openid,
          hasUserInfo: true,
        })
      } else {
        app.applyNotice();
        return false;
      }
    }, 990)
  },
  //添加按钮
  childadd: function (e) {
    var that = this;
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    var guanli = local + 'child/isChild';
    var keys = {
      openid: openid
    };
    util.getAj(guanli, keys, 'POST', function (data) {
      if (data.result == 'error') {
        app.applyNotice();
        return false;
      } else if (data.result == 'true') {
        wx.navigateTo({
          url: '/pages/add/add?id=' + openid,
        })
      } else {
        wx.navigateTo({
          url: '/pages/child/add?id=' + openid,
        })
      }
    })
  },
  //成为分销员按钮
  fenxiao: function (e) {
    var that = this;
    var isvip = that.data.isvip;
    if(isvip){
      wx.navigateTo({
        url: '/pages/fenxiao/index',
        success: function (e) {
          var page = getCurrentPages().pop();
          if (page == undefined || page == null) return;
          page.onLoad()
        }
      })
    }else{
      this.showMessage('请先成为会员哟！');
    }
  },
  onLoad: function (e) {
    this.onShow();
  },
  getuserinfo: function () {
    return this.data.userInfo;
  },
  bindGetUserInfo: function (e) {
    //console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      // 用户按了允许授权按钮
      console.log('asdas', e.detail.userInfo);
    } else {
      //用户按了拒绝按钮
      console.log('asdasd', e.detail.userInfo);
    }
  },
  onShow: function () {
    var that = this;
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    var sid = that.data.sid;
    var uid = openid;
    var keys = {
      openid: openid
    }
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
      app.getUserInfo(function (personInfo) {
        var sel = local + 'vip/select';
        util.getAj(sel, keys, 'POST', function (data) {
          console.log(data)
          if (data.status == 500) {
            that.setData({
              isvip: false,
              userInfo: personInfo,
              openid: openid,
              hasUserInfo: true,
            })
          } else if (data.status == 404) {
            that.setData({
              isvip: false,
              userInfo: personInfo,
              openid: openid,
              hasUserInfo: true,
            })
          } else {
            that.setData({
              time: data.status,
              isvip: true,
              userInfo: personInfo,
              openid: openid,
              hasUserInfo: true,
            })
          }
        })
      })
    }
  },
  onReady:function(){

  },
  showMessage: function (text) {
    var that = this
    that.setData({
      showMessage: true,
      messageContent: text
    })
    setTimeout(function () {
      that.setData({
        showMessage: false,
        messageContent: ''
      })
    }, 2500)
  },
})
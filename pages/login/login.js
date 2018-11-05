//index.js  
//获取应用实例  
const app = getApp()
var util = require('../../utils/util.js');
let local = 'https://wx.biergao.vip/api/';
Page({
  data: {
    userInfo: false,
    loading: false,
    sid: false
  },
  //事件处理函数  
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    var that = this;
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
      })
    } else {
      app.applyNotice();
      return false;
    }
  },
  onShow: function () {
    var that = this;
    var userInfo = that.data.userInfo;
    if(userInfo == false){
      if (app.globalData.userInfo) {
        that.setData({
          userInfo: app.globalData.userInfo,
        })
      } else {
        app.applyNotice();
        return false;
      }
    }
  },
  getPhoneNumber: function (e) {
    var that = this;
    // console.log(e.detail.errMsg)
    // console.log(e.detail)
    // console.log(e.detail.encryptedData)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权将不可用',
        success: function (res) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '请您点击授权按钮',
            success: function (res) {
              app.applyNotice();
            }
          })

        }
      })
    } else {
      that.setData({
        'userInfo.iv': e.detail.iv,
        'userInfo.encryptedData': e.detail.encryptedData
      })
      var url = local + 'biaob/getwxbmobile'
      var keys = that.data.userInfo;
      // console.log(keys);
      wx.showToast({
        title: '登录中',
        icon: 'loading',
        duration: 10000
      })
      setTimeout(function () {
        util.getAj(url, keys, 'get', function (data) {
          // console.log('data', data);
          if (data.status == 1) {

            wx.switchTab({
              url: '../index/index',
            })
          } else {
            that.showMessage('非法进入请从新授权');
            setTimeout(function () {
              wx.redirectTo({
                url: '../logs/logs?log=1',
              })
            }, 2000)
          }
        })
      }, 5000)
    }
  }
})
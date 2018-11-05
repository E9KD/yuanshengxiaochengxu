var app = getApp()
var maxTime = 120
var currentTime = maxTime
var interval = null
const API_URL = 'https://wx.biergao.vip/api/biaob/';
Page({
  data: {
    userInfo: {},
    btnName: '获取验证码',
    disabled: false,
    mobile: '1234567890',
    msCodes: '0',
    openid: 0
  },

  mobileInputEvent: function (ev) {
    var mobile = ev.detail.value;
    if (mobile.length == 11) {
      this.setData({
        mobile: ev.detail.value
      })
    }
  },

  reSendPhoneNum: function (e) {
    var that = this;
    var openid = that.data.openid;
    var tel = that.data.mobile;
    if (tel == '1234567890') {
      wx.showToast({
        title: '请填手机号',
        icon: 'loading',
        duration: 1000
      })
    } else if (openid == 0) {
      wx.showToast({
        title: '请先授权给小程序',
        icon: 'loading',
        duration: 1000
      })
    } else {
      currentTime = maxTime;
      interval = setInterval(function () {
        currentTime--
        that.setData({
          time: '(' + currentTime + 's)',
          disabled: true,
          btnName: '请稍后'
        })
        if (currentTime <= 0) {
          currentTime = -1
          clearInterval(interval)
          that.setData({
            time: '',
            disabled: false,
            btnName: '重新获取'
          })
        }
      }, 1000)
      setTimeout(function () {
        wx.request({
          url: API_URL + 'msCode/tel/' + tel,
          data: '',
          header: {
            'Content-Type': 'application/json'
          },
          success: function (e) {
            console.log(e);
            that.setData({
              msCodes: e.data
            })
          }
        })
      }, 1000)
      wx.showToast({
        title: '发送成功',
        icon: 'loading',
        duration: 700
      })
    }
  },

  formBindsubmit: function (e) {
    var that = this;
    console.log(e.detail.value);
    var formData = e.detail.value;
    var openid = that.data.openid;
    var unionId = that.data.userInfo.unionId;
    var msCode = that.data.msCodes;
    var telCode = e.detail.value.telCode;
    var mobile = that.data.mobile;
    if (mobile == '1234567890') {
      wx.showToast({
        title: '请填手机号',
        icon: 'loading',
        duration: 1000
      })
    } else if (!openid) {
      wx.showToast({
        title: '请先授权给小程序',
        icon: 'loading',
        duration: 1000
      })
    } else {
      if (msCode == telCode) {
        wx.request({
          url: API_URL + 'userChick',
          data: formData,
          header: {
            'Content-Type': 'application/json'
          },
          success: function (e) {
            if (e.data) {
              wx.showToast({
                title: '验证通过',
                icon: 'loading',
                duration: 1000
              })
              setTimeout(function () {
                wx.switchTab({
                  url: '../index/index',
                })
              }, 2000)
            }else{
              wx.showToast({
                title: '注册失败',
                icon: 'loading',
                duration: 1000
              })
            }
          }
        })
      } else {
        wx.showToast({
          title: '验证码错误',
          icon: 'loading',
          duration: 1000
        })
      }
    }
  },

  onLoad: function () {
    var that = this;
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    if (wx.getStorageSync('fails') == 0) {
      app.applyNotice();
      return false;
    }
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo,
        openid: openid
      })
    })
  }
})
//获取应用实例  
const app = getApp()
var util = require('../../utils/util.js');
let local = 'https://wx.biergao.vip/api/';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    loading: false,
    showMessage: false,
    messageContent: '',
    finduser: true,
    version: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.sid !== undefined) {
      this.setData({
        sid: options.sid
      })
    }
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        openid: openid,
        hasUserInfo: true,
      })
    }else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          openid: openid,
        })
        console.log(res)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            openid: openid
          })
          console.log(res)
        }
      })
    }
  },
  getUserInfo: function (e) {
    var that = this;
    if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
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
      util.getUserOpenid(local, function (data) {
        that.setData({
          userInfo: data,
          hasUserInfo: true,
          finduser: data.finduser
        })
        if (data.finduser) {
          wx.switchTab({
            url: '../index/index',
          })
        } else {
          wx.showToast({
            title: '请先授权使用',
            icon: 'loading',
            duration: 2000
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    try {
      wx.clearStorage();

    } catch (e) {
      wx.showToast({
        title: '数据清理失败',
        icon: 'loading',
        duration: 2000
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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
          console.log(res);
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '请您点击授权按钮',
            success: function (res) {
              console.log(res);
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
            that.setData({
              hasUserInfo: false,
            })
            that.showMessage('非法进入请从新授权');
          }
        })
      }, 5000)
    }
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
    }, 2000)
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('sadasdas');
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

  }
})
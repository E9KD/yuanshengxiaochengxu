const API_URL = 'https://wx.biergao.vip/api/biaob/';
var appid = 'wx41e93e31c9d4dc26';
var secret = '70454b73581a5c4517791bd89b0564ee';
let openid = null;
//app.js
App({
  onLaunch: function () {
    // this.getUserInfo();
  },
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {

      wx.login({
        success: function (r) {
          var code = r.code;//登录凭证
          if (code) {
            //2、调用获取用户信息接口
            wx.getUserInfo({
              success: res => {
                console.log({ encryptedData: res.encryptedData, iv: res.iv, code: code })
                //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
                wx.request({
                  url: API_URL + 'getOpenid3',
                  data: { encryptedData: res.encryptedData, iv: res.iv, code: code },
                  method: 'post',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: function (res) {
                    console.log(res);
                    wx.setStorageSync('openid', res.data.openId);
                    wx.setStorageSync('userid', res.data.userid);
                    wx.setStorageSync('nickname', res.data.nickName);
                    wx.setStorageSync('unionId', res.data.unionId);
                    wx.setStorageSync('avatarUrl', res.data.avatarUrl);
                    wx.setStorageSync('userInfo', res.data);
                    that.globalData.openid = res.data.openId;
                    that.globalData.openid = res.data.openId;
                    that.globalData.userInfo = res.data;
                    typeof cb == "function" && cb(that.globalData.userInfo)
                  },
                  fail: function () {
                    wx.setStorageSync('openid', false);
                    that.globalData.openid = false;
                    that.globalData.userInfo = false;
                    typeof cb == "function" && cb(that.globalData.userInfo)
                  }
                })
              },
              fail: function () {
                wx.setStorageSync('openid', false);
                that.globalData.openid = false;
                that.globalData.userInfo = false;
                typeof cb == "function" && cb(that.globalData.userInfo)
              }
            })

          } else {
            wx.setStorageSync('openid', false);
            that.globalData.openid = false;
            that.globalData.userInfo = false;
            typeof cb == "function" && cb(that.globalData.userInfo)
          }
        }
      })
    }
  },
  applyNotice: function (cb) {
    var self = this;
    wx.showModal({
      title: '警告通知',
      content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          wx.openSetting({
            success: function (data) {
              if (data) {
                if (data.authSetting["scope.userInfo"] == true) {
                  wx.login({
                    success: function (res_login) {
                      wx.getUserInfo({
                        withCredentials: true,
                        success: function (res_user) {
                          //调用request请求api转换登录凭证
                          wx.request({
                            url: API_URL + 'getOpenid3',
                            data: { encryptedData: res_user.encryptedData, iv: res_user.iv, code: res_login.code },
                            method: 'post',
                            header: {
                              'content-type': 'application/x-www-form-urlencoded'
                            },
                            success: function (data) {
                              console.log(data);
                              wx.setStorageSync('openid', data.data.openId);
                              wx.setStorageSync('userid', data.data.userid);
                              wx.setStorageSync('nickname', data.data.nickName);
                              wx.setStorageSync('unionId', data.data.unionId);
                              wx.setStorageSync('avatarUrl', data.data.avatarUrl);
                              wx.setStorageSync('userInfo', res.data);
                              self.globalData.openid = data.data.openId;
                              self.globalData.userInfo = data.data;
                              typeof cb == "function" && cb(self.globalData.userInfo)
                              wx.switchTab({
                                url: '/pages/index/index',
                              })
                            }
                          })
                          if (this.userInfoReadyCallback) {
                            this.userInfoReadyCallback(res_user)
                          }
                        }
                      })

                    }
                  })
                }
              }
            }
          })
        }
        if (wx.openSetting) {
          wx.openSetting({
            success: (res) => {
              if (!res.authSetting["scope.userInfo"]) {
                console.log('auth error');
                self.applyNotice();
                return;
              } else {
                wx.login({
                  success: function (res_login) {
                    wx.getUserInfo({
                      withCredentials: true,
                      success: function (res_user) {
                        //调用request请求api转换登录凭证
                        wx.request({
                          url: API_URL + 'getOpenid3',
                          data: { encryptedData: res_user.encryptedData, iv: res_user.iv, code: res_login.code },
                          method: 'post',
                          header: {
                            'content-type': 'application/x-www-form-urlencoded'
                          },
                          success: function (data) {
                            console.log(data);
                            wx.setStorageSync('openid', data.data.openId);
                            wx.setStorageSync('userid', data.data.userid);
                            wx.setStorageSync('nickname', data.data.nickName);
                            wx.setStorageSync('unionId', data.data.unionId);
                            wx.setStorageSync('avatarUrl', data.data.avatarUrl);
                            wx.setStorageSync('userInfo', res.data);
                            self.globalData.openid = data.data.openId;
                            self.globalData.userInfo = data.data;
                            typeof cb == "function" && cb(self.globalData.userInfo)
                            wx.switchTab({
                              url: '/pages/index/index',
                            })
                          }
                        })
                        if (this.userInfoReadyCallback) {
                          this.userInfoReadyCallback(res_user)
                        }
                      }
                    })

                  }
                })
              }
            }
          })
        } else {
          // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
          wx.showModal({
            title: '提示',
            content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
          })
        }
      }
    })
  },
  // 返回首页
  backHome: function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  globalData: {
    userInfo: null,
    refreshFlag: false,
    openid: null,
    fenxiao:false,
    newsHref: "https://wedengta.com/wxnews/",
  },
  onShow:function(options){
    console.log(options)
  }
})


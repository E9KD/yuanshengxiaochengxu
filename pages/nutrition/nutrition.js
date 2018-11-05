var app = getApp();
var util = require('../../utils/util.js');
let API_INDEX = 'https://wx.biergao.vip/api/index/',
  local = 'https://wx.biergao.vip/api/';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoad: true,
    cfBg: false,
    radar: 6,
    kaiqideid: false,
    userInfo: false,
    isyingyang: false,
    openbuka: 200,
    yydkpfjl: false,
    showMessage: false,
    messageContent: '',
    radardaka:0,
    radarpingjiatype: false,
    redardakatype: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.getUserInfo(function(personInfo) {
      that.setData({
        userInfo: personInfo,
      })
    })
  },
  // 去打卡
  // 去打卡
  godaka: function (e) {
    var that = this;
    var goid = e.currentTarget.dataset.typeid;
    console.log(e);
    var id = that.data.radardaka;
    var sday = that.data.sday;
    if (id == 0) {
      if (goid == 0) {
        wx.navigateTo({
          url: '../ydaka/ydaka?id=0&sday=' + sday,
        })
      } else {
        wx.navigateTo({
          url: '../ydaka/ydaka?id=1&sday=' + sday,
        })
      }
    } else {
      that.showMessage('暂未开启,敬请期待');
    }
  },
  //leibiao
  yingyanglist: function (e) {
    var that = this;
    var id = that.data.userInfo.userid;
    var typeid = e.currentTarget.dataset.typeid;
    switch (typeid) {
      case '0':
        wx.navigateTo({
          url: '../yingyanglist/yingyanglist?type=0&id=' + id + '&typename=0',
        })
        break;
      case '1':
        wx.navigateTo({
          url: '../yingyanglist/yingyanglist?type=1&id=' + id + '&typename=1',
        })
        break;
      case '2':
        wx.navigateTo({
          url: '../yingyanglist/yingyanglist?type=2&id=' + id + '&typename=2',
        })
        break;
      case '3':
        wx.navigateTo({
          url: '../yingyanglist/yingyanglist?type=3&id=' + id + '&typename=3',
        })
        break;
      default:
        wx.navigateTo({
          url: '../yingyanglist/yingyanglist?type=4&id=' + id + '&typename=4',
        })
        break;
    }
  },
  yydkpfjllist: function (e) {
    var that = this;
    var id = that.data.userInfo.userid;
    var typeid = e.currentTarget.dataset.typeid;
    switch (typeid) {
      case '0':
        wx.navigateTo({
          url: '../yingyanglist/yingyanglist?type=0&id=' + id + '&typename=5',
        })
        break;
      case '1':
        wx.navigateTo({
          url: '../yingyanglist/yingyanglist?type=1&id=' + id + '&typename=6',
        })
        break;
      case '2':
        wx.navigateTo({
          url: '../yingyanglist/yingyanglist?type=2&id=' + id + '&typename=7',
        })
        break;
      case '3':
        wx.navigateTo({
          url: '../yingyanglist/yingyanglist?type=3&id=' + id + '&typename=8',
        })
        break;
      default:
        wx.navigateTo({
          url: '../yingyanglist/yingyanglist?type=4&id=' + id + '&typename=9',
        })
        break;
    }
  },
  //评价
  emojiShowHide: function(e) {
    var that = this;
    var id = e.currentTarget.id; //radarpingjia type
    if (id == 2) {
      that.showMessage('暂未开启,敬请期待');
      return;
    }
    var url = 'https://wx.biergao.vip/api/Yypfjl/getlist';
    var keys = {
      userid: that.data.userInfo.userid,
      pid:id
    };
    that.setData({
      radarpingjiatype: true,
      redardakatype: false,
    })
    util.getAj(url, keys, 'GET', function(data) {
      if (data.status == 500) {
        that.setData({
          isyingyang: false,
          isLoad: false,
          cfBg: !that.data.cfBg,
          radarpingjia: id
        })
      } else {
        that.setData({
          isyingyang: true,
          isLoad: false,
          cfBg: !that.data.cfBg,
          radarpingjia: id
        })
      }
    })
  },
  // 打卡
  emojiShowdaka: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    if (id != 0) {
      that.showMessage('暂未开启,敬请期待');
      return;
    }
    that.setData({
      radarpingjiatype: false,
      redardakatype: true,
    })
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    var sid = that.data.sid;
    var userInfo = that.data.userInfo;
    var uid = openid;
    if (openid == null || openid == 'undefined' || !openid) {
      if (sid != false || sid != 0) {
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
      if (userInfo == false) {
        app.getUserInfo(function (personInfo) {
          var url = 'https://wx.biergao.vip/api/Yybg/getisbuka';
          var keys = {
            uid: personInfo.userid
          };
          util.getAj(url, keys, 'POST', function (data) {
            console.log(data)
            if (data.status == 201) {
              that.setData({

                isLoad: false,
                cfBg: !that.data.cfBg,
                radardaka: id,
                sday: data.sday,
                yydkpfjl: data.yydkpfjl,
                openbuka: 201,
              })
            } else if (data.status == 202) {
              that.setData({

                isLoad: false,
                cfBg: !that.data.cfBg,
                radardaka: id,
                sday: data.sday,
                yydkpfjl: data.yydkpfjl,
                openbuka: 202,
              })
            } else {
              that.setData({

                isLoad: false,
                cfBg: !that.data.cfBg,
                radardaka: id,
                sday: data.sday,
                yydkpfjl: data.yydkpfjl,
                openbuka: 200,
              })
            }

          })
        })
      } else {
        var url = 'https://wx.biergao.vip/api/Yybg/getisbuka';
        if (that.data.userInfo.userid == false || that.data.userInfo.userid == 'false') {
          if (sid != false || sid != 0) {
            wx.redirectTo({
              url: '/pages/login/login?sid=' + sid,
            })
          } else {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          }
          return false;
        } else {
          var keys = {
            uid: that.data.userInfo.userid
          };
          util.getAj(url, keys, 'POST', function (data) {
            console.log(data)
            if (data.status == 201) {
              that.setData({

                isLoad: false,
                cfBg: !that.data.cfBg,
                radardaka: id,
                sday: data.sday,
                yydkpfjl: data.yydkpfjl,
                openbuka: 201,
              })
            } else if (data.status == 202) {
              that.setData({

                isLoad: false,
                cfBg: !that.data.cfBg,
                radardaka: id,
                sday: data.sday,
                yydkpfjl: data.yydkpfjl,
                openbuka: 202,
              })
            } else {
              that.setData({

                isLoad: false,
                cfBg: !that.data.cfBg,
                radardaka: id,
                sday: data.sday,
                yydkpfjl: data.yydkpfjl,
                openbuka: 200,
              })
            }

          })
        }

      }
    }

  },
  //发送uuid
  ces: function(e) {
    var me = this;
    wx.request({
      url: 'https://wx.biergao.vip/home/index',
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值,
        'Cookie': "uuid=12222222" //这个方法放在app.js中，作为全局方法，且自动将Cookie带入。
      },
      success: function(res) {
        console.log(res);
        // var data = JSON.parse(res.data);
        // if (data.ifSuccess == "NeedLogin") {
        //   wx.redirectTo({
        //     url: '../index/index',
        //   })
        //   me.showHint("登录提示", "登录超时，请关闭小程序重新登录！");
        // } else {
        //   json.success(data);
        // }
      },
      fail: function(res) {
        console.log(res);
        // var data = JSON.parse(res.data);
        // json.fail(data);
        //console.log(".....fail.....");
      }
    })
  },

  cemojiCfBg: function () {
    this.setData({
      cfBg: false,
      radarpingjiatype: false,
      redardakatype: false,
    })
  },
  nutrNext: function() {
    // console.log("hhh");
    wx.redirectTo({
      url: '../nutriNext/nutriNext'
    })
  },
  //开始答题跳转按钮
  ystar: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.typeid;
    wx.navigateTo({
      url: '../shanshi/shanshi?typeid=' + id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    app.getUserInfo(function(personInfo) {
      that.setData({
        userInfo: personInfo,
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

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
    }, 1000)
  },
})
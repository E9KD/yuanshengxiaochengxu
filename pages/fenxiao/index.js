const app = getApp();
var util = require('../../utils/util.js');
let API_URL = 'https://wx.biergao.vip/api/biaob/',
  local = 'https://wx.biergao.vip/api/';
Page({
  data: {
    openid: null,
    isIpx: app.globalData.isIpx ? true : false,
    iszhibo: false,
    userInfo: {},
    hasUserInfo: false,
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
  userinfo:function(){
    wx.navigateTo({
      url: '../userinfo/userinfo',
    })
  },
  /**
 * 获取特定页面的小程序码
 */
  emojiShowHide: function () {
    this.setData({
      isShow: !this.data.isShow,
      isLoad: false,
      cfBg: !this.data.cfBg
    })
  },
  cemojiCfBg: function () {
    this.setData({
      isShow: false,
      cfBg: false
    })
  },

  getSpecialM: function (e) {
    var that = this;
    that.setData({
      isShow: !this.data.isShow,
      isLoad: false,
      cfBg: !this.data.cfBg
    })

    //请求获取小程序码
    let url = 'https://wx.biergao.vip/api/child/getwxaqrcode';
    var keys = {
      sid: that.data.userInfo.userid,
      scenc: 'index'
    }
    util.getAj(url, keys, 'get', function (data) {
      // console.log(data)
      wx.downloadFile({
        url: data,
        success: function (res) {
          that.setData({
            icon4: res.tempFilePath,
          })
        },
        fail: function () {
          console.log('fail')
        }
      })
    })
  },
  savePic: function () {
    var that = this;       //保存图片触发事件
    util.savePicToAlbum(that.data.icon4);
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
          url: '/pages/fenxiao/index?id=' + openid,
        })
      } else {
        wx.navigateTo({
          url: '/pages/child/add?id=' + openid,
        })
      }
    })
  },
  onLoad: function () {
    // console.log(options)
    // var that = this;
    // let arr = JSON.parse(options.arr);
    //   that.setData({
    //     hasUserInfo: true,
    //     member: arr
    //   })
  },
  getuserinfo: function () {
    return this.data.userInfo;
  },
  gohome: function () {
    app.backHome();
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
    var fenxiao = local + 'biaob/getuserfnxiaoinfo';
    app.getUserInfo(function (personInfo) {
      console.log('personInfo', personInfo)
      var keys = {
        sid: personInfo.sid,
        uid: personInfo.userid
      };
      util.getAj(fenxiao, keys, 'post', function (data) {
        console.log(data);
        if (data.status == 500) {
          wx.redirectTo({
            url: '../logs/index',
          })
          return false;
        } else {
          that.setData({
            userInfo: personInfo,
            openid: openid,
            fenxiaoinfo: data
          })
        }
      })
    })
  },
  // 服务推广
  gofuwu: function () {
    app.globalData.fenxiao = 1;

    wx.switchTab({
      url: '../team/team',
    })
  },
  // 课程
  kecheng: function () {
    app.globalData.fenxiao = 2;

    wx.switchTab({
      url: '../keceng/index',
    })
  },
  // 分享
  onShareAppMessage: function () {
    var that = this;
    that.cemojiCfBg();
    var sid = that.userInfo.userid;
    // arr = escape(arr);
    // 返回shareObj
    return {
      title: "感觉你又高了呢！",        // 默认是小程序的名称(可以写slogan等)
      imageUrl: '',
      path: '/pages/index/index?sid=' + sid,     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
    }
  }
})
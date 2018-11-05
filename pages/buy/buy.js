var app = getApp();
var util = require("../../utils/util.js");
var R_htmlToWxml = require('../../utils/htmlToWxml.js'); //引入公共方法
var R_util = require('../../utils/util2.js'); //引入公共方法
const API_KECENG = 'https://wx.biergao.vip/api/';
const url = 'https://wx.biergao.vip/api/Fuwu/getoneinfo';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    isShow: false,
    isLoad: true,
    cfBg: false,
    isset: false,
    price: 399,
    currentTab: 0,
    isVip: false,
    show: false,
    ispay: false,
    showMessage: false,
    messageContent: '',
    text1: '',
    text2: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let id = options.id;
    wx.request({
      url: 'https://wx.biergao.vip/api/vip/price2',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          text1: res.data[0],
          text2: res.data[1]
        })
      }
    })
    that.setData({
      fuwuid: id
    })
    wx.showToast({
      title: '请稍后',
      icon: 'loading',
      duration: 10000
    })
    var that = this;
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    if (!openid) {
      this.showMessage('数据错误');
      wx.redirectTo({
        url: '../log/index',
      })
    } else {
      var fenxiao = app.globalData.fenxiao;
      if (fenxiao == 1) {
        var openfenxiao = true;
      } else {
        var openfenxiao = false;
      }
      setTimeout(function () {
        var kid = {
          id: that.data.fuwuid
        };
        util.getAj(url, kid, 'POST', function (data) {
          if (data.status == 500) {
            wx.redirectTo({
              url: '../log/index',
            })
          } else {
            var newsDetail = R_htmlToWxml.html2json(data.content);
            that.setData({
              options: data,
              show: true,
              content: newsDetail
            })
          }
        })
        var apishow = API_KECENG + 'vip/show';
        var keys = {
          openid: openid
        }
        app.getUserInfo(function (personInfo) {
          util.getAj(apishow, keys, 'POST', function (data) {
            if (data == 'success') {
              that.setData({
                userinfo: personInfo,
                openid: openid,
                isVip: true,
                openfenxiao: openfenxiao
              })
            } else {
              that.setData({
                userinfo: personInfo,
                openid: openid,
                isVip: false,
                openfenxiao: openfenxiao
              })
            }
          })
        })
      }, 3000);
    }

  },
  sharepic: function (e) {
    var id = this.data.options.id;
    var img = this.data.options.fuwuimg;
    wx.redirectTo({
      url: '../fcanvas/canvas?id=' + id + '&img=' + img,
    })
  },
  onShow: function () {
    var that = this;
    var url = API_KECENG + 'fuwu/ispay';
    setTimeout(function () {
      var kid = {
        goodsid: that.data.fuwuid,
        id2: that.data.userinfo.userid
      };
      util.getAj(url, kid, 'POST', function (data) {
        if (data.status == 500) {
          that.showMessage('请立即查询');
        } else {
          that.setData({
            ispay: true
          })
        }
      })
      wx.hideToast();
    }, 4000);
  },
  //点击切换
  clickTab: function (e) {

    var that = this;

    if (e.target.dataset.current == 0) {
      that.setData({
        currentTab: e.target.dataset.current,
        price: 399
      })
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        price: 999
      })
    }
  },
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
  backHome: function () {
    var uid = e.currentTarget.id;
    if (!uid) {
      this.showMessage('数据错误');
    } else {
      wx.navigateTo({
        url: '../boing/index?id=' + id,
      })
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
    }, 1000)
  },
  onShareAppMessage: function () {
    return {
      title: '比尔高课程分享',
      path: '/pages/index/index'
    }
  },
  wxParseTagATap: function (e) {
    var src = e.currentTarget.dataset.src.replace('http://', '');
    console.log(src);
    wx.navigateTo({
      url: src
    })
    wx.switchTab({
      url: src,
    })
  }
})
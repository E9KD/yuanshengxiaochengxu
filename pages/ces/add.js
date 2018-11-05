var app = getApp();
var util = require('../../utils/util.js');
const API_URL = 'https://wx.biergao.vip/api/biaob/';
Page({
  data: {
    uid: null,
    openid: null,
    msg: '',
    height: '',
    fm: '',
    showMessage: false,
    messageContent: ''
  },
  onLoad: function (options) {
    if (options.id == 'no') {
      var uid = options.cid;
    } else {
      var uid = options.id;
    }
    console.log('see', options)
    var that = this;
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    console.log('sds', openid);
    wx.request({
      url: API_URL + 'getcesinfo',
      data: options,
      header: {
        'Content-Type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        console.log('sdsdsds', res.data)
        var sex = res.data[0].sex;
        var age = res.data[2].age;
        var nowheight = res.data[1].nowheight;
        var qiwangheight = res.data[0].qiwangheight;
        var fheight = res.data[0].fheight;
        var mheight = res.data[0].mheight;
        
        
        var resp = [];
        (sex == 1) ? resp = util.man : resp = util.woman;
        var nage = age;
        var pingjunageheight = Number(resp[0]['a' + nage]);
        var fage = Number(resp[0]['a' + nage]);
        var gage = Number(resp[1]['b' + nage]);
        var dage = Number(resp[2]['c' + nage]);

        // 与期望身高差
        var nowh = nowheight;
        
        var cha = (nowh - qiwangheight).toFixed(1);
        // 全国平均身高
        var chap = (nowh - pingjunageheight).toFixed(1) ;
        if (sex == 1) {
          var gmanheight = (Number(fheight) + Number(mheight) + 13) / 2 + 7.5;
          var dmanheight = (Number(fheight) + Number(mheight) + 13) / 2 - 7.5;
          var pingjun = ((gmanheight + dmanheight) / 2).toFixed(0);
        } else {
          var gmanheight = (Number(fheight) + Number(mheight) - 13) / 2 + 7.5;
          var dmanheight = (Number(fheight) + Number(mheight) - 13) / 2 - 7.5;
          var pingjun = ((gmanheight + dmanheight) / 2).toFixed(0);
        }

        if (nowh > gage) {
          var height = [
            { "title": "预测遗传身高值：", "msg": "超高" }
          ];
        } else if (fage < nowh && gage > nowh) {
          var height = [
            { "title": "预测遗传身高值：", "msg": "正常" }
          ];
        } else if (nowh > dage && nowh < fage) {
          var height = [
            { "title": "预测遗传身高值：", "msg": "偏矮" }
          ];
        } else {
          var height = [
            { "title": "预测遗传身高值：", "msg": "矮小" }
          ];
        }
        var msg = [
          {
            gmanheight: gmanheight,//"您正在处于发育期，是增高的最佳激活时期"
            dmanheight: dmanheight,
            cha: cha,
            chap: chap
          }
        ];
        that.setData({
          height: height,
          msg: msg,
          uid: uid,
          openid: openid,
          fm: pingjun
        })
      }
    })
    console.log(that.data)
  },
  backHome: function () {
    var uid = this.data.uid;
    if (!uid) {
      this.showMessage('数据错误');
    } else {
      wx.redirectTo({
        url: '../charts/add?uid=' + uid,
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
  }
})
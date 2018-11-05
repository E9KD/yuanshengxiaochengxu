var app = getApp();
var util = require('../../utils/util.js');
let API_URL = 'https://wx.biergao.vip/api/biaob/getuserfnxiaoinfousermsg';
Page({
  data: {
   userlist:false
  },
 
  onLoad: function (options) {
    console.log(options);
    var that = this;
    var id = options.id;
    var keys = {
      id: id
    }

      util.getAj(API_URL, keys, 'get', function (data) {
        that.setData({
          userlist:data
        })
      })
  },

  onShow: function () {
  
  },
  onReady: function () {

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
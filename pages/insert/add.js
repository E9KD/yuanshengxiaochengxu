var area = require('../../utils/util.js');
const API_URL = 'https://wx.biergao.vip/api/child/';
var c = 0;
Page({
  data: {
    nowheightName: [],
    nowheightCode: [],
    provinceSelIndex1: '',
    provinceDefIndex: 123,
    showMessage: false,
    messageContent: '',
    openid: null,
    loading: false,
    disabled: false,
    loadingHide: true,
  },
  // 当前身高
  changeNowheight: function (e) {
    console.log(e)
    var c = e.detail.value
    this.setData({
      provinceSelIndex1: c
    })
  },
  setAreaData: function (c) {
    var c = c || 0 // nowheightSelindex
    // 设置目前身高数据
    var nowheight = area.area['100000']
    var nowheightName = [];
    var nowheightCode = [];
    for (var item in nowheight) {
      nowheightName.push(nowheight[item])
      nowheightCode.push(item)
    }
    this.setData({
      nowheightName: nowheightName,
      nowheightCode: nowheightCode
    })
  },
  savePersonInfo: function (e) {
    console.log(e)
    var data = e.detail.value
    var telRule = /^1[3|4|5|7|8]\d{9}$/, nameRule = /^[\u2E80-\u9FFF]+$/
    if (data.nowheight == '') {
      this.showMessage('请选择目前身高')
    } else if (data.uid == '') {
      this.showMessage('数据错误UID不存在')
    } else if (data.openid == '') {
      this.showMessage('数据错误UID不存在')
    } else if (data.uname == '') {
      this.showMessage('数据错误用户名不存在')
    } else {
      var that = this;
      var formData = e.detail.value;
      var openid = that.data.openid;
      wx.showToast({
        title: '请稍后',
        icon: 'loading',
        duration: 4000
      })
      wx.request({
        url: API_URL + 'addData/openid/' + openid,
        data: formData,
        header: {
          'Content-Type': 'application/json'
        },
        method: 'GET',
        success: function (res) {
          console.log(res.data.id)
          if (res.data) {
            that.showMessage('添加成功');
            that.setData({
              loading: true,
              disabled: true
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '../charts/add',
              })
            }, 2000)
          } else {
            that.showMessage('添加失败');
          }

        }
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
    }, 1200)
  },
  onLoad: function (options) {

    console.log(options)
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    var uid = options.uid;
    var openid = options.openid;
    var uname = options.uname;
    this.setData({
      openid: openid,
      uid: uid,
      uname: uname
    })
  },
  onShow: function () {
    this.setAreaData();
  }

})
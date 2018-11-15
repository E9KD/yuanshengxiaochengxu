//index.js
//获取应用实例
var app = getApp();
var util = require('../../utils/util.js');
// var qzone = 'http://www.a.com/api/qzone/';
var qzone = 'https://wx.biergao.vip/api/qzone/';
Page({
  data:
  {
    content: false,
    imgStr: null,
    httpImg: [],
    imgLength: 0,
    imglist: []
  },
  onLoad: function (e) {
    var that = this;
    var openid = wx.getStorageSync('openid');
    var avatarUrl = wx.getStorageSync('avatarUrl');
    var userid = wx.getStorageSync('userid');
    var nickname = wx.getStorageSync('nickname');
    that.setData({
      avatarUrl: avatarUrl,
      openid: openid,
      suerid: userid,
      nickname: nickname
    })
  },
  onShow: function () {
  },
  // 表单提交
  formSubmit: function (e) {
    var that = this
    // 如果文本为空提示用户输入 否则提交表单
    console.log(e.detail.value.content)
    console.log(that.data.imgStr)
    if (e.detail.value.content == '' && that.data.imgStr == null || that.data.imgStr == '' || that.data.imgStr == 'null') {
      wx.showModal({
        content: '请说点什么再走吧!',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            that.data.imgStr == null;
          }
        }
      });
    }
    else {
      console.log(e);
      var url = qzone + 'setresouse';
      var keys = {
        nickName: that.data.nickname,
        content: e.detail.value.content,
        userId: that.data.openid,
        imgStr: that.data.imgStr,
        headimg: that.data.avatarUrl
      };
      util.getAj(url, keys, 'POST', function (data) {
        if (data) {
          that.bindLoding('发布成功');
          var timeOut = setInterval(function () {
            wx.navigateBack({
              delta: 1
            })
            clearInterval(timeOut)
          }, 800)
        } else {
          that.bindLoding('发布失败');
        }
      })
    }
  },
  // 清除
  formReset: function () {
    console.log('form发生了reset事件')
  },

  // 相册
  chooseImage: function () {
    var that = this
    // 重置上传数组
    that.setData({
      httpImg: []
    })
    // 上传图片
    wx.chooseImage({
      sourceType: ['album', 'camera'],
      sizeType: ['original', 'compressed'],
      count: 9,
      success: function (res) {
        console.log(res);
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          imgLength: tempFilePaths.length,
          imglist: tempFilePaths
        });

        // 遍历缓存图片上传服务器
        for (var a = 0; a < tempFilePaths.length; a++) {
          wx.uploadFile({
            url: qzone + 'uploadsfiles',
            filePath: res.tempFilePaths[a],
            name: 'image',
            success: function (res) {
              //console.log(res.data.img)
              //var data = res.data
              var obj = JSON.parse(res.data);
              // console.log(obj)
              that.data.httpImg.push(obj.img)
            },
            fail: function (res) {
              console.debug(res)
            }
          })
        }
        console.log(that.data.httpImg.join(","))
        var timeS = 0;
        var timeOut = setInterval(function () {
          console.info(that.data.imgLength + "--" + that.data.httpImg.length)
          if (that.data.imgLength == that.data.httpImg.length) {
            that.setData({
              imgStr: that.data.httpImg.join(",")
            })
            // console.log(that.data.imageList.join(","))
            that.bindLoding('图片上传中');
            clearInterval(timeOut)
          }
          else {
            if (timeS > 50) {
              that.bindLodingfail();
              clearInterval(timeOut)
            }
            else {
              that.bindLoding('图片上传中');
            }
          }

          timeS++;

        }, 1000)
      }
    })
  },
  previewImage: function (e) // 显示图片大图
  {
    var current = e.target.dataset.src

    wx.previewImage({
      current: current,
      urls: this.data.imglist
    })
  },
  bindLoding: function (text) { // LOADING加载
  var text;
    wx.showToast({
      title: text,
      icon: 'loading'
    })
  },
  bindLodingfail: function () { // LOADING加载
    wx.showToast({
      title: '图片上传失败',
      icon: 'loading'
    })
  }

})








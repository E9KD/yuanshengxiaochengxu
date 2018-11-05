var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    gimg:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    var uid = openid;
    //请求获取小程序码
    let url = 'https://wx.biergao.vip/api/child/getwxaqrcode';
    app.getUserInfo(function (personInfo) {
      if (options.id == 'putong') {
        var keys = {
          sid: personInfo.userid,
          pid: personInfo.sid,
          scenc: 'keceng'
        }
      }else{
        var keys = {
          sid: personInfo.userid,
          pid: personInfo.sid,
          gid: options.id,
          scenc: 'keceng'
        }
      }
      util.getAj(url, keys, 'get', function (data) {
        // console.log(data)
        wx.downloadFile({
          url: data,
          success: function (res) {
            that.setData({
              userInfo: personInfo,
              openid: openid,
              icon4:res.tempFilePath,
              urlimg:data
            })
          },
        })
        wx.downloadFile({
          url: personInfo.avatarUrl,
          success: function (res) {
            that.setData({
              avatarUrl: res.tempFilePath
            })
          },
        })
        if (options.id != 'putong') {
          wx.downloadFile({
            url: options.img,
            success: function (res) {
              that.setData({
                gimg: res.tempFilePath
              })
            },
          })
        }
      })
    })
  },
  onShow: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...'
    })
    setTimeout(function () {
      let promise1 = new Promise(function (resolve, reject) {
        wx.getImageInfo({
          src: '../../image/qrbg.jpg',
          success: function (res) {
            console.log(res)
            resolve(res);
          }
        })
      });
      Promise.all([
        promise1
      ]).then(res => {
        console.log(res)
        const ctx = wx.createCanvasContext('shareImg')

        //主要就是计算好各个图文的位置
        if (that.data.gimg == false){
          ctx.drawImage('../../' + res[0].path, 0, 0, 545, 771)
          ctx.drawImage(that.data.urlimg, 158, 190, 210, 210)
          ctx.drawImage(that.data.avatarUrl, 158, 400, 210, 210)
        }else{
          ctx.drawImage('../../' + res[0].path, 0, 0, 545, 771)
          ctx.drawImage(that.data.gimg, 0, 0, 545,400)
          ctx.drawImage(that.data.urlimg, 62.5, 500, 210, 210)
          ctx.drawImage(that.data.avatarUrl, 272.5, 500, 210, 210)
        }

        // ctx.setTextAlign('center')
        // ctx.setFillStyle('#ffffff')
        // ctx.setFontSize(22)
        // ctx.fillText('分享文字描述1', 545 / 2, 130)
        // ctx.fillText('分享文字描述2', 545 / 2, 160)

        ctx.stroke()
        ctx.draw()
      })
      wx.hideLoading();
    },5000)
  },
  /**
   * 生成分享图
  */
  share: function () {
    var that = this
    wx.showLoading({
      title: '努力生成中...'
    })
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 545,
      height: 771,
      destWidth: 545,
      destHeight: 771,
      canvasId: 'shareImg',
      success: function (res) {
        console.log(res.tempFilePath);
        that.setData({
          prurl: res.tempFilePath,
          hidden: false
        })
        wx.hideLoading()
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  /**
   * 保存到相册
  */
  save: function () {
    var that = this
    //生产环境时 记得这里要加入获取相册授权的代码
    wx.saveImageToPhotosAlbum({
      filePath: that.data.prurl,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好哒',
          confirmColor: '#72B9C3',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              // that.setData({
              //   hidden: true
              // })
              wx.switchTab({
                url: '../team/team',
              })
            }
          }
        })
      }
    })

  }
})
var app = getApp();
var util = require('../../utils/util.js');
let urls = 'https://wx.biergao.vip/api/dakaup/',
  API_CHILD = 'https://wx.biergao.vip/api/Child/',
  locals = 'https://wx.biergao.vip/api/Dakaup/';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    isLoad: true,
    cfBg: false,
    options: '',
    hx_index: 0,
    lookmoshi: false,
    shareImage: ''
  },
  savePerson: function (e) {
    var formData = e.detail.value;
    this.drawShare(formData);
  },
  savePersonInfo: function (e) {
    var formData = e.detail.value;
    // this.drawSharePic(formData);
    // return false;
    var telRule = /^1[3|4|5|7|8]\d{9}$/, nameRule = /^[\u4e00-\u9fa5]{2,4}$/i;
    var age = this.checkage(formData.useryear);
    if (formData.username == '') {
      this.showMessage('请输入您的姓名')
    }
    else if (!nameRule.test(formData.username)) {
      this.showMessage('请输入中文名2-4位')
    }
    else if (age) {
      this.showMessage('请输入您的年龄数字')
    }
    else if (formData.useryear == '') {
      this.showMessage('请选择您的年龄')
    }
    else if (formData.useryear > 20) {
      this.showMessage('您孩子已经大于20岁！')
    }
    else if (formData.useryear <= 0) {
      this.showMessage('您孩子不能小于或等于0岁！')
    }
    else if (formData.shiyu == '') {
      this.showMessage('请输入您的食欲情况')
    }
    else if (formData.breakfast == '') {
      this.showMessage('请告诉我们您的早饭情况')
    }
    else if (formData.lunch == '') {
      this.showMessage('请告诉我们您的午饭情况')
    }
    else if (formData.dinner == '') {
      this.showMessage('请告诉我们您的晚饭情况')
    }
    else if (formData.sport == '') {
      this.showMessage('请告诉我们您是否运动')
    }
    else if (formData.sporttime == '') {
      this.showMessage('请告诉我们您一周运动几次')
    }
    else if (formData.sporttype == '') {
      this.showMessage('请告诉我们您做了什么运动')
    }
    else if (formData.sporthour == '') {
      this.showMessage('请告诉我们您每次运动多久')
    }
    else if (formData.sleep == '') {
      this.showMessage('请告诉我们您晚上几点睡觉')
    }
    else if (formData.getup == '') {
      this.showMessage('请告诉我们您早上几点起床')
    }
    else if (formData.school == '') {
      this.showMessage('请告诉我们您在学校开心吗')
    }
    else if (formData.home == '') {
      this.showMessage('请告诉我们您在家开心吗')
    }
    else {
      this.setData({
        options: formData
      });
      this.drawSharePic(formData);
    }
  },
  checkage: function (val) {
    // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
    if (val === "" || val == null) {
      return false;
    }
    if (isNaN(val)) {
      return true;
    } else {
      return false;
    }
  },
  emojiShowHide: function () {
    this.setData({
      isShow: !this.data.isShow,
      isLoad: false,
      cfBg: !this.data.cfBg
    })
  },
  // 弹窗提示
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

  /**
   * 生命周期函数--监听页面加载
   */
  onReady: function () {
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        // 宽度
        var windowwidth = res.windowWidth;
        var windowall = res.windowWidth - 30;
        var height = res.windowHeight;
        var swiperheight = res.windowWidth / 1.6;
        // 高度
        var windowhieght = 925;
        var windowlabel = (windowall / 2) - 5;
        self.setData({
          windowwidth: windowwidth,
          windowhieght: windowhieght,
          windowall: windowall,
          windowlabel: windowlabel,
          height: height,
          swiperheight: swiperheight
        });
      }
    })
  },
  onLoad: function (res) {
    wx.hideShareMenu();
    var that = this;
    if (res.uid == undefined){
      var arr = JSON.parse(res.arr);
      if (arr.childid != undefined) {
        that.setData({
          options: arr,
          lookmoshi: true
        });
        return false;
      }
    }
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    setTimeout(function () {
      if (app.globalData.userInfo) {
        var getmobileurl = API_CHILD + 'childlist/openid/';
        var keys = {
          openid: openid,
        };
        util.getAj(getmobileurl, keys, 'POST', function (data) {
          that.setData({
            userInfo: app.globalData.userInfo,
            openid: openid,
            childlists: data,
            age: data[0].age,
            uid: res.uid
          })
          wx.hideToast();
        })

      } else {
        app.applyNotice();
        return false;
      }
    }, 1200)
  },
  /**
 * 绘制分享的图片
 * @param goodsPicPath 商品图片的本地链接
 * @param qrCodePath 二维码的本地链接
 * "嗯嗯"
dinner:"嗯嗯"getup:"嗯嗯"home:"嗯嗯"lunch:"嗯嗯"school:"嗯嗯"shiyu:"嗯嗯"sleep:"嗯嗯"sport:"嗯嗯"sporthour:"嗯呢"sporttime:"嗯嗯sporttype:"嗯嗯"username:"在那个"useryear:"11"
 */
  bindPickerChange_hx: function (e) {
    console.log(e);
    this.setData({
      hx_index: e.detail.value,
      age: e.currentTarget.dataset.age
    })
    console.log(this.age);
  },
  drawShare: function (res) {
    var that = this;
    console.log('asdasd', res);
    var goodPicPath = '/image/wenjuan.png';
    wx.showToast({
      title: '正在生成数据',
      icon: 'loading',
      duration: 10000
    })
    const canvasCtx = wx.createCanvasContext('shr');
    const name = res.username;
    const age = res.useryear;
    const shiyu = res.shiyu;
    const zaocan = res.breakfast;
    const wucan = res.lunch;
    const wancan = res.dinner;
    const sport = res.sport;
    const jici = res.sporttime;
    const whatsport = res.sporttype;
    const time = res.sporthour;
    const jidian = res.sleep;
    const qichuang = res.getup;
    const schoolhappy = res.school;
    const homehappy = res.home;
    const windowall = that.data.windowwidth / 2;
    const w1 = windowall / 2 - 40;
    const w2 = windowall + 50;
    //绘制背景
    // canvasCtx.setFillStyle('white');
    // canvasCtx.fillRect(goodPicPath,0, 0, that.data.windowwidth, that.data.windowhieght);
    //绘制商品图片
    canvasCtx.drawImage(goodPicPath, 0, 0, that.data.windowwidth, that.data.windowhieght);
    //绘制分享的name文字
    canvasCtx.setFontSize(15);
    canvasCtx.setFillStyle('#808080');

    // canvasCtx.setTextAlign('center');
    canvasCtx.fillText(name, w1, 234);
    //age
    canvasCtx.fillText(age, w2, 234);

    // 营养
    canvasCtx.fillText(shiyu, windowall, 312);
    canvasCtx.fillText(zaocan, windowall, 344);
    canvasCtx.fillText(wucan, windowall, 374);
    canvasCtx.fillText(wancan, windowall, 408);
    //运动
    canvasCtx.fillText(sport, windowall, 520);
    canvasCtx.fillText(jici, windowall, 553);
    canvasCtx.fillText(whatsport, windowall, 585);
    canvasCtx.fillText(time, windowall, 620);

    //睡眠
    canvasCtx.fillText(jidian, windowall, 728);
    canvasCtx.fillText(qichuang, windowall, 761);

    // 情绪
    canvasCtx.fillText(schoolhappy, windowall, 858);
    canvasCtx.fillText(homehappy, windowall, 890);
    canvasCtx.stroke()
    canvasCtx.draw()
    //绘制之后加一个延时去生成图片，如果直接生成可能没有绘制完成，导出图片会有问题。
    setTimeout(function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: that.data.windowwidth,
        height: that.data.windowhieght,
        destWidth: that.data.windowwidth,
        destHeight: that.data.windowhieght,
        canvasId: 'shr',
        success: function (data) {
          that.setData({
            shareImage: data.tempFilePath,
          });
          that.emojiShowHide();
          wx.hideToast();
        },
      })
    }, 1200);
  },
  drawSharePic: function (res) {
    var that = this;
    console.log('asdasd', res);
    var goodPicPath = '/image/wenjuan.png';
    wx.showToast({
      title: '正在生成数据',
      icon: 'loading',
      duration: 10000
    })
    var dakaup = locals + 'updakaimg2/';
    var keys = {
      openid: this.data.openid,
      uid: this.data.uid,
      res: res,
    };
    util.getAj(dakaup, keys, 'GET', function (data) {
      console.log(data);
      var sid = data.status;
      if (!data.msg) {
        that.showMessage(res.username + '今天打卡了哟!');
      } else {
        const name = res.username;
        const age = res.useryear;
        const shiyu = res.shiyu;
        const zaocan = res.breakfast;
        const wucan = res.lunch;
        const wancan = res.dinner;
        const sport = res.sport;
        const jici = res.sporttime;
        const whatsport = res.sporttype;
        const time = res.sporthour;
        const jidian = res.sleep;
        const qichuang = res.getup;
        const schoolhappy = res.school;
        const homehappy = res.home;
        const windowall = that.data.windowwidth / 2;
        const w1 = windowall / 2 - 40;
        const w2 = windowall + 50;
        const canvasCtx = wx.createCanvasContext('shareCanvas');
        //绘制背景
        // canvasCtx.setFillStyle('white');
        // canvasCtx.fillRect(goodPicPath,0, 0, that.data.windowwidth, that.data.windowhieght);
        //绘制商品图片
        canvasCtx.drawImage(goodPicPath, 0, 0, that.data.windowwidth, that.data.windowhieght);
        //绘制分享的name文字
        canvasCtx.setFontSize(15);
        canvasCtx.setFillStyle('#808080');

        // canvasCtx.setTextAlign('center');
        canvasCtx.fillText(name, w1, 234);
        //age
        canvasCtx.fillText(age, w2, 234);

        // 营养
        canvasCtx.fillText(shiyu, windowall, 312);
        canvasCtx.fillText(zaocan, windowall, 344);
        canvasCtx.fillText(wucan, windowall, 374);
        canvasCtx.fillText(wancan, windowall, 408);
        //运动
        canvasCtx.fillText(sport, windowall, 520);
        canvasCtx.fillText(jici, windowall, 553);
        canvasCtx.fillText(whatsport, windowall, 585);
        canvasCtx.fillText(time, windowall, 620);

        //睡眠
        canvasCtx.fillText(jidian, windowall, 728);
        canvasCtx.fillText(qichuang, windowall, 761);

        // 情绪
        canvasCtx.fillText(schoolhappy, windowall, 858);
        canvasCtx.fillText(homehappy, windowall, 890);
        canvasCtx.stroke()
        canvasCtx.draw()
        //绘制之后加一个延时去生成图片，如果直接生成可能没有绘制完成，导出图片会有问题。
        setTimeout(function () {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: that.data.windowwidth,
            height: that.data.windowhieght,
            destWidth: that.data.windowwidth,
            destHeight: that.data.windowhieght,
            canvasId: 'shareCanvas',
            success: function (data) {
              that.setData({
                shareImage: data.tempFilePath
              });
              that.emojiShowHide();
              wx.hideToast();
            },
          })
        }, 1200);
        that.showMessage('打卡成功');
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var arr = JSON.stringify(that.data.options);
    // 返回shareObj
    return {
      title: "比尔高打卡",        // 默认是小程序的名称(可以写slogan等)
      imageUrl: '' + that.data.shareImage + '',
      path: '/pages/wenjuan/wenjuan?arr=' + arr,     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
          wx.switchTab({
            url: '../index/index'
          });
        }
      },
    }
  },
  closeKeys: function () {
    wx.hideKeyboard();
  },
  backhome: function () {
    var that = this;
    wx.showModal({
      title: '温柔的通知哟',
      content: '小主人，您确定不要给别人看嘛？',
      showCancel: true,
      cancelText: '是',
      cancelColor: '#F04815',
      confirmText: '否',
      confirmColor: '#7BD13A',
      success: function (res) {
        if (!res.confirm) {
          var deldaka = locals + 'deldaka/';
          var keys = {
            openid: that.data.openid,
            id: that.data.shareid
          };
          util.getAj(deldaka, keys, 'get', function (data) {
            if (data.status) {
              wx.switchTab({
                url: '../index/index',
              })
            } else {
              wx.switchTab({
                url: '../index/index',
              })
            }
          })
        }
      },
      fail: function (res) {

      },
      complete: function (res) { },
    })
  }
})
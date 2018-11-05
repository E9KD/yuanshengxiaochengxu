var app = getApp();
var util = require("../../utils/util.js");
var WxParse = require('../../wxParse/wxParse.js');
const API_KECENG = 'https://wx.biergao.vip/api/';
Page({
  data: {
    goodsData: {},
    openid: '',
    currentTab: 0,
    scrollTop: 0,    //滑动的距离
    navFixed: false,  //导航是否固定
    isShow: true,
    isLoad: true,
    cfBg: false,
    isset: false,
    floorstatus: false,
    classlists: {},
    video_url: '',
    playid: '',
    status: 0,
    swiperheight: 100,
    isVip: false,
    openfenxiao:false
  },
  onShow: function () {

    var self = this;
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    var sid = self.data.sid;
    var uid = openid;
    if (openid == null || openid == 'undefined' || !openid) {
      if (sid) {
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
      app.getUserInfo(function (personInfo) {

        self.setData({
          userInfo: personInfo,
        })

      })
    }
  },
  onLoad: function (options){
    wx.hideShareMenu();
    var that = this;
    if (options.sharearr != undefined) {
      var data = unescape(options.sharearr);
    } else {
      var data = unescape(options.arr);
    }
    var fenxiao = app.globalData.fenxiao;
    var arr = JSON.parse(data);
    WxParse.wxParse('teacher_info', 'html', arr.teacherinfo.teacher_text, that, 5);
    var openid = options.ucode;
    var id = arr.id;
    var classtype = arr.abv_enum;
    var openid = app.globalData.openid ? app.globalData.openid : options.ucode;
    var article = arr.content;
    WxParse.wxParse('article', 'html', article, that, 5);

    that.setData({ openid: openid, goodsData: arr, swiperheight: wx.getSystemInfoSync().windowWidth / 1.74});
    if (fenxiao == 2) {
      that.setData({
        openfenxiao: true
      })
    }
    that.loadGoods(id, classtype);

    wx.request({
      url: API_KECENG + 'vip/show',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        openid: openid
      },
      success: function (res) {
        console.log(res);
        if (res.data == 'success') {
          that.setData({
            isVip: true
          });
        }
      }
    });
  },
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo');
  },
  sharepic: function (e) {

    var id = e.currentTarget.id;
    var img = e.currentTarget.dataset.img;
    wx.redirectTo({
      url: '../canvas/canvas?id=' + id + '&img=' + img,
    })
  },
  //根据id获取课程详情和指导老师
  loadGoods: function (id, classtype) {
    var that = this;
    var cid = id;
    var classtype = classtype;
    var openid = that.data.openid;
    wx.request({
      url: API_KECENG + 'index/getvideourl?cid=' + cid + '&scode=' + classtype + '&openid=' + openid,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({ classlists: res.data, video_url: res.data[0].content, playid: res.data[0].id, isset: res.data.isset, status: res.data.isset })
      }
    })
  },
  //列表调用支付
  changevideourl: function (e) {
    var that = this;
    var playid = that.data.playid;
    if (playid == e.currentTarget.dataset.playid) {
    } else {
      if (!e.currentTarget.dataset.isset) {
        if (!e.currentTarget.dataset.status) {
          that.setData({
            video_url: e.currentTarget.dataset.playurl,
            playid: e.currentTarget.dataset.playid,
          });
        } else {
          that.emojiShowHide(e);
          return false;
        }
      } else {
        that.cemojiCfBg();
        console.log(e);

        that.videoContext.pause();

        that.videoContext.seek(0);

        that.setData({
          video_url: e.currentTarget.dataset.playurl,
          playid: e.currentTarget.dataset.playid,
        });
        that.videoContext.play();
      }
      that.playAv();
    }
  },
  // 调用客服组件
  emojiShowHide: function (e) {
    var abvid = e.currentTarget.id;//数据id
    this.setData({
      isShow: !this.data.isShow,
      isLoad: false,
      cfBg: !this.data.cfBg,
      buyid: abvid
    })
  },
  // 关闭客服主键
  colose: function () {
    this.setData({
      isShow: false,
      cfBg: false
    })
  },
  //商品详情页
  showGoods: function (e) {
    var id = e.currentTarget.id;
    if (!id) {
      this.showMessage('数据错误');
    } else {
      wx.navigateTo({
        url: '../boing/index?id=' + id,
      })
    }
  },
  playAv: function () {
    var that = this;
    that.setData({
      scrollTop: 0
    });
    setTimeout(function () {
      that.cemojiCfBg();
    }, 1000)
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
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      console.log(e.target.dataset.current);
      that.setData({
        currentTab: e.target.dataset.current
      })
      if (e.target.dataset.current == 1) {
        wx.setNavigationBarTitle({
          title: '课程目录',
        })
      } else {
        wx.setNavigationBarTitle({
          title: '课程概述',
        })
      }
    }
  },
  //页面滑动
  layoutScroll: function (e) {
    this.data.scrollTop = this.data.scrollTop * 1 + e.detail.deltaY * 1;
    console.log(this.data.scrollTop)
    console.log(this.data.navFixed)
    if (this.data.scrollTop <= -80) {
      this.setData({
        navFixed: true
      })
    } else {
      this.setData({
        navFixed: false
      })
    }
  },
  
  cemojiCfBg: function () {
    this.setData({
      isShow: false,
      cfBg: false
    })
    this.videoContext.play();
  },
  bindplay: function () {
    wx.setNavigationBarTitle({
      title: '正在播放..',
    })
  },
  bindpause: function () {
    wx.setNavigationBarTitle({
      title: '暂停播放..',
    })
  },
  bindended: function () {
    wx.setNavigationBarTitle({
      title: '已观看..',
    })
  },
  onHide: function () {
    var that = this;
    that.videoContext.pause();
    that.videoContext.seek(0);
  },

  /** v  
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    that.videoContext.pause();
    that.videoContext.seek(0);
  },
  // 返回首页
  backHome: function (e) {
    app.backHome();
  },
  // 分享
  onShareAppMessage: function () {
    var that = this;
    var arr = JSON.stringify(that.data.goodsData);
    arr = escape(arr);
    // 返回shareObj
    return {
      title: "分享课程",        // 默认是小程序的名称(可以写slogan等)
      imageUrl: '',
      path: '/pages/zhibo/index?sharearr=' + arr,     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
    }
  }
})

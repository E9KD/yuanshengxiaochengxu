var app = getApp();
var util = require('../../utils/util.js');
let API_URL = 'https://wx.biergao.vip/api/';
Page({
  data: {
    items: [
      { name: '3', value: '3' },
      { name: '2', value: '2' },
      { name: '1', value: '1' },
      { name: '0', value: '0' }
    ],
    bukatime:'',
    list: [],
    showMessage: false,
    messageContent: '',
    checkday:false,
    isbuka:true,
    hidein:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    var dakatypeid = options.id;
    var sday = options.sday;
    app.getUserInfo(function (personInfo) {
      that.setData({
        userInfo: personInfo,
        dakatypeid: dakatypeid,
        sday: sday
      })
    })
  },
  checkday:function(e){

    this.setData({
      checkday: e.currentTarget.dataset.day
    })
    this.showMessage('请开始完成选项并提交');
  },
  daka: function (e) {
    var that  = this;
    var leng = that.data.list;
    var arr = Object.keys(leng);
    var len = arr.length;
    if (len < 7){
      wx.showToast({
        title: '请选择',
        icon: 'loading',
        duration: 1000
      })
    }else{
      var uid = that.data.userInfo.userid;
      that.setData({
        'list.uid':uid
      })
      
      console.log(that.data.list)
      var yybg = API_URL + 'yybg/sign';
      var keys = that.data.list;
      util.getAj(yybg, keys, 'GET', function (data) {
        console.log(data)
        if (data.status == 200) {
          that.setData({
            sday: 7 - data.week
          })
          that.showMessage('打卡成功');
        }else {
          that.showMessage('打卡失败');
          that.setData({
            sday: 7 - data.week
          })
        }
      })
    }
  },
  buka:function(e){
    console.log(13)
    var that = this;
    var leng = that.data.list;
    var arr = Object.keys(leng);
    var len = arr.length;
    var atime = that.data.checkday;
    if (atime == false){
        that.showMessage('请先选择补卡时间yo！')
    }else{
      var uid = that.data.userInfo.userid;
      that.setData({
        'list.uid': uid,
        'list.atime': atime
      })
      if (len < 7) {
        wx.showToast({
          title: '请选择',
          icon: 'loading',
          duration: 1000
        })
      } else {
        var yybg = API_URL + 'yybg/gobuka';
        var keys = that.data.list;
        util.getAj(yybg, keys, 'GET', function (data) {
          console.log(data)
          if (data.status == 200) {
            that.setData({
              timelist: data.info,
              isbuka:false,
              checkday:false,
              hidein:true
            })
          } else {
            that.showMessage('补卡失败');
          }
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var url = API_URL + 'Yybg/index';
    var that = this;
    setTimeout(function () {
    var res = {
      uid: that.data.userInfo.userid
    }
    var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
   

    util.getAj(url, res, 'POST', function (data) {
      that.setData({
        timelist: data,
        nowtime: currentdate
      })
    });
    },2000)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  handleRadioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.detail.value)
    var id = e.currentTarget.id;
    var list = 'list.' + id
    this.setData({
      [list]: e.detail.detail.value
    })
    console.log(this.data.list)
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
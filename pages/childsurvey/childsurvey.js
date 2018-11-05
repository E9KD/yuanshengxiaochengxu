var app = getApp();
var util = require('../../utils/util.js');
let API_URL = 'https://wx.biergao.vip/api/survey/',
  local = 'https://wx.biergao.vip/api/';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showView: false,
    messageContent: '',
    showMessage: false,
    weightName: [],
    weightCode: [],
    weightSelIndex: '',
    heightName: [],
    heightCode: [],
    heightSelIndex: '',
    yj:false,
    yc:false,
    mx:false,
    birthday:'',
    sex:[
      '',
      '男',
      '女'
    ],
    weightDefIndex: 49,
    heightDefIndex: 123,
    sexIndex: '',
    hx_index: 0,
    region: ["北京市", "北京市", "朝阳区"],
    // 多列选择器(二级联动)列表设置,及初始化
    multiArray: [[1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 4, 5, 6, 7, 8, 9]],
    multiIndex: [3, 5],
    // 多列选择器(三级联动)列表设置,及初始化
    multiArray3: [[1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 4, 5, 6, 7, 8, 9]],
    multiIndex3: [3, 5, 4],
    localheight:true,
  },


  

  // 选择省市区函数
  changeRegin(e) {
    this.setData({ region: e.detail.value });
  },


  changeheight: function (e) {
    this.setData({ localheight: false });
    var h = e.detail.value;
    // var w = 'undefine';
    this.setAreaData('height', h)

    // console.log(d)
  },
  //体重
  changeWeight: function (e) {

    var w = e.detail.value
    // var h = 'undefine';
    // var g = 'undefine';
    this.setAreaData('weight', w)
  },

  setAreaData: function (t, data) {
    console.log(data)

    switch (t) {
      case 'weight':
        this.setData({
          weightSelIndex: data
        })
        break;
      case 'height':
        this.setData({
          heightSelIndex: data
        })
        break;
    }


    // 设置h数据
    var height = util.area['100001']
    var heightName = [];
    var heightCode = [];
    for (var item in height) {
      heightName.push(height[item])
      heightCode.push(item)
    }
    this.setData({
      heightName: heightName,
      heightCode: heightCode
    })


    // 设置w数据
    var weight = util.kg;
    var weightName = [];
    var weightCode = [];
    for (var item in weight) {
      weightName.push(weight[item])
      weightCode.push(item)
    }
    this.setData({
      weightName: weightName,
      weightCode: weightCode
    })

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


  bindPickerChange_hx: function (e) {
    console.log(e);
    this.setData({
      hx_index: e.detail.value,
      localheight: e.currentTarget.dataset.lc
    })
  },

  savePersonInfo: function (e) {
    var index = this.data.hx_index;
    console.log(index);
    console.log(this.data.childlists[index].id);
    var cid = this.data.childlists[index].id;
    var sex = this.data.childlists[index].sex;
    var pid = this.data.pid;
    var data = e.detail.value
    var telRule = /^1[3|4|5|7|8]\d{9}$/, nameRule = /^[\u4e00-\u9fa5]{2,4}$/i
    // var age = this.jsGetAge(data.brithday);
    if (data.birthdayplace == '') {
      this.showMessage('请输入出生地')
    } else if (data.localheight == '') {
      this.showMessage('请输入最近一个月测量身高')
    } else if (data.localweight == '') {
      this.showMessage('请输入最近一个月测量体重')
    } 
    else {

      var that = this;
      var formData = e.detail.value;
      var openid = that.data.openid;

    //   var userid = that.data.userInfo.userid;
    //   // formData.append('userid',userid);
    //   // console.log(openid);
      wx.showToast({
        title: '请稍后',
        icon: 'loading',
        duration: 4000
      })
      wx.request({
        url: API_URL + 'childsurveyadd?openid=' + openid + '&cid=' + cid + '&sex=' + sex + '&pid=' + pid,
        data: formData,

        header: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          if (res.data.status == 500) {
            wx.showToast({
              title: '网络请求失败',
              icon: 'loading',
              duration: 2000
            })
          } else {
            wx.redirectTo({
              url: '../shanshi/shanshi?svid=' + res.data,
            })
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this;
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
     
      app.getUserInfo(function (personInfo) {
        that.setData({
          userInfo: personInfo,
          openid: openid,
          
        })
      })


    var getmobileurl = API_URL + 'childshow';
    var keys = {
      openid: openid,
    };
    util.getAj(getmobileurl, keys, 'POST', function (data) {
      console.log(data)
      that.setData({
        childlists: data,
      })
    })
    

    this.setAreaData();
    that.setData({
      pid:options.svid
    })
    // console.log(options);
  },

  // 生日
  bindBirthdayChange: function (e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  // 性别
  bindSexChange: function (e) {
    // console.log(e);
    this.setData({
      sexIndex: e.detail.value
    })
  },

  othershow: function (event) {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },

  isyuejing: function (event) {
    var that = this;
    that.setData({
      yj: true
    })
  },
  noyuejing: function (event) {
    var that = this;
    that.setData({
      yj: false
    })
  },

  isyichuan: function (event) {
    var that = this;
    that.setData({
      yc: true
    })
  },
  noyichuan: function (event) {
    var that = this;
    that.setData({
      yc: false
    })
  },

  ismanxing: function (event) {
    var that = this;
    that.setData({
      mx: true
    })
  },
  nomanxing: function (event) {
    var that = this;
    that.setData({
      mx: false
    })
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

  }
})
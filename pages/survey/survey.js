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
    showMessage:false,
    weightName:[],
    weightCode:[],
    weightSelIndex:'',
    cultrueName: [],
    cultrueCode: [],
    cultrueSelIndex: '',
    fheightName: [],
    fheightCode: [],
    provinceSelIndex2: '',
    mheightName: [],
    mheightCode: [],
    provinceSelIndex3: '',
    showMessage: false,
    openid: null,
    provinceDefIndex: 123,
    weightDefIndex:49,
    cultureDefIndex:3
  },

  // 选择父亲
  changeFheight: function (e) {

    var d = e.detail.value;
    var g = 'undefine';
    this.setAreaData('fheight', d,g)
    console.log(d)
  },
  // 选择母亲
  changeMheight: function (e) {

    var g = e.detail.value
    var d = 'undefine';
    this.setAreaData('mheight',d,g)
  },
  //体重
  changeWeight: function (e) {

    var w = e.detail.value
    var d = 'undefine';
    var g = 'undefine';
    this.setAreaData('weight', d, g, w)
  },
  //文化水平
  changeCulture: function (e) {

    var c = e.detail.value
    var w = 'undefine';
    var d = 'undefine';
    var g = 'undefine';
    this.setAreaData('culture', d, g, w, c)
  },

  setAreaData: function (t, d,g,w,c) {
    // console.log(d)
    // console.log(g)
    switch (t) {
      case 'culture':
        this.setData({
          cultureSelIndex: c
        })
        break;
      case 'weight':
        this.setData({
          weightSelIndex: w
        })
        break;
      case 'fheight':
        this.setData({
          provinceSelIndex2: d
        })
        break;
      case 'mheight':
        this.setData({
          provinceSelIndex3: g
        })
    }
    var c = c || 0;
    var w = w || 0;
    var d = d || 0; // fheightSelindex
    var g = g || 0; // mheightSelindex
    // 设置f数据
    var fheight = util.area['100001']
    var fheightName = [];
    var fheightCode = [];
    for (var item in fheight) {
      fheightName.push(fheight[item])
      fheightCode.push(item)
    }
    this.setData({
      fheightName: fheightName,
      fheightCode: fheightCode
    })
    // 设置m数据
    var mheight = util.area['100001']
    var mheightName = [];
    var mheightCode = [];
    for (var item in mheight) {
      mheightName.push(mheight[item])
      mheightCode.push(item)
    }
    this.setData({
      mheightName: mheightName,
      mheightCode: mheightCode
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


  // 设置c数据
  var culture = util.culture;
  var cultureName = [];
  var cultureCode = [];
  for(var item in culture) {
  cultureName.push(culture[item])
  cultureCode.push(item)
}
this.setData({
  cultureName: cultureName,
  cultureCode: cultureCode
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


  savePersonInfo: function (e) {
    
    
    console.log(e.detail.value)
    var data = e.detail.value
    var telRule = /^1[3|4|5|7|8]\d{9}$/, nameRule = /^[\u4e00-\u9fa5]{2,4}$/i
    // var age = this.jsGetAge(data.brithday);
    if (data.username==''){
      this.showMessage('请输入家长姓名')
    } else if (!nameRule.test(data.username)) {
      this.showMessage('请输入中文名2-4位')
      }else{

      var that = this;
      var formData = e.detail.value;
      var openid = that.data.openid;
      var userid = that.data.userInfo.userid;
      // formData.append('userid',userid);
      // console.log(openid);
      wx.showToast({
        title: '请稍后',
        icon: 'loading',
        duration: 4000
      })
      wx.request({
        url: API_URL + 'surveyadd?openid=' + openid + '&userid=' + userid,
        data: formData,
              
        header: {
          'Content-Type': 'application/json'
        },
        method: 'GET',
        success: function (res) {
          // console.log(res)
          if(res.data.status==500){
            wx.showToast({
              title: '网络请求失败',
              icon: 'loading',
              duration: 2000
            })
          }else{
            wx.redirectTo({
              url: '../childsurvey/childsurvey?svid=' + res.data,
            })
          }
        }
      })
      }
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
  },

  othershow: function(event){
    var that = this;
    that.setData({
      showView: (!that.data.showView)
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
    var that = this;
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    app.getUserInfo(function (personInfo) {
      that.setData({
        userInfo: personInfo,
        openid: openid,
        
      })
    })
    
    this.setAreaData();


    var url = API_URL + 'getFMheight';
    var keys = {
      openid: openid
    };
    util.getAj(url, keys, 'POST', function (data) {
        if(data.status !== 500){
          that.setData({
            fmhieght: data
          })
        }
        
    })
    
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
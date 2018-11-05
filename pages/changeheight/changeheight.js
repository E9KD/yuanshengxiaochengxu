var area = require('../../utils/util.js');
const API_URL = 'https://wx.biergao.vip/api/biaob/';
var app = getApp();
var p = 0, c = 0
Page({
  data: {
    userInfo: {},
    loading: false,
    disabled: false,
    loadingHide: true,
    brithday: '',
    provinceName: [],
    provinceCode: [],
    provinceSelIndex: '',
    nowheightName: [],
    nowheightCode: [],
    provinceSelIndex1: '',
    showMessage: false,
    messageContent: '',
    openid: null,
    provinceDefIndex: 123
  },
  // 选择期望
  changeProvince: function (e) {
    var p = e.detail.value;
    this.setAreaData('province', p)
    // console.log(p)
  },
  // 当前身高
  changeNowheight: function (e) {
    var c = e.detail.value
    this.setAreaData('nowheight', p, c)
  },
  setAreaData: function (t, p, c) {
    switch (t) {
      case 'province':
        this.setData({
          provinceSelIndex: p
        })
        break;
      case 'nowheight':
        this.setData({
          provinceSelIndex1: c
        })
    }

    var p = p || 0 // qiwangselindex
    var c = c || 0 // nowheightSelindex
    // 设置期望数据
    var province = area.area['100000']
    var provinceName = [];
    var provinceCode = [];
    for (var item in province) {
      provinceName.push(province[item])
      provinceCode.push(item)
    }
    this.setData({
      provinceName: provinceName,
      provinceCode: provinceCode
    })
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
  // 重置数据
  resetAreaData: function (type) {
    this.setData({
      districtName: [],
      districtCode: [],
      districtSelIndex: '',
      districtEnabled: false
    })
    if (type == 'province') {
      this.setData({
        cityName: [],
        cityCode: [],
        citySelIndex: ''
      })
    }
  },
  /*根据出生日期算出年龄*/
  jsGetAge: function (strBirthday) {
    var returnAge;
    var strBirthdayArr = strBirthday.split("-");
    var birthYear = strBirthdayArr[0];
    var birthMonth = strBirthdayArr[1];
    var birthDay = strBirthdayArr[2];

    var d = new Date();
    var nowYear = d.getFullYear();
    var nowMonth = d.getMonth() + 1;
    var nowDay = d.getDate();

    if (nowYear == birthYear) {
      returnAge = 0;//同年 则为0岁  
    }
    else {
      var ageDiff = nowYear - birthYear; //年之差  
      if (ageDiff > 0) {
        if (nowMonth == birthMonth) {
          var dayDiff = nowDay - birthDay;//日之差  
          if (dayDiff < 0) {
            returnAge = ageDiff - 1;
          }
          else {
            returnAge = ageDiff;
          }
        }
        else {
          var monthDiff = nowMonth - birthMonth;//月之差  
          if (monthDiff < 0) {
            returnAge = ageDiff - 1;
          }
          else {
            returnAge = ageDiff;
          }
        }
      }
      else {
        returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天  
      }
    }

    return returnAge;//返回周岁年龄  

  },
  savePersonInfo: function (e) {
    var formData = e.detail.value
    var age = this.jsGetAge(formData.brithday);
    var telRule = /^1[3|4|5|7|8]\d{9}$/, nameRule = /^[\u4e00-\u9fa5]{2,4}$/i
    if (formData.sex == '') {
      this.showMessage('请选择性别')
    } else if (formData.username == '') {
      this.showMessage('请输入姓名')
    } else if (!nameRule.test(formData.username)) {
      this.showMessage('请输入中文名2-4位')
    } else if (formData.brithday == '') {
      this.showMessage('请选择生日')
    } else if (age > 20) {
      this.showMessage('您孩子已经大于20岁！')
    } else if (age < 0) {
      this.showMessage('您孩子不能小于0岁！')
    } else if (formData.qiwangheight == '') {
      this.showMessage('请选择期望身高')
    } else if (formData.nowheight == '') {
      this.showMessage('请选择目前身高')
    } else {
      var that = this;
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
          if (res.data == 'em') {
            that.showMessage('添加失败已存在');
            that.setData({
              loading: true,
              disabled: true
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '../ces/add?id=no&cid=' + res.data.id + '&m=' + res.data.m + '&y=' + res.data.y,
              })
            }, 2000)
          } else {
            that.showMessage('添加成功已保存');
            that.setData({
              loading: true,
              disabled: true
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '../ces/add?id=no&cid=' + res.data.id + '&m=' + res.data.m + '&y=' + res.data.y,
              })
            }, 2000)
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
    }, 1000)
  },
  // 生日
  bindBrithdayChange: function (e) {
    this.setData({
      brithday: e.detail.value
    })
  },
  chickChild: function (openid) {
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    // console.log(this.data)
    wx.request({
      url: API_URL + 'seachUser/openid/' + openid,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data != true) {
          wx.redirectTo({
            url: '../mobile/mobile',
          })
        }
      }
    })
  },
  onLoad: function (options) {
    // console.log('app', app.globalData.openid)
    var that = this;
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    if (openid) {
      that.setData({
        openid: openid
      })
    }
  },
  getInviteCode: function (options) {
    // console.log(options)
    if (options.uid != undefined) {
      wx.showToast({
        title: '来自用户:' + options.uid + '的分享',
        icon: 'success',
        duration: 2000
      })
    }
  },
  onShow: function () {
    if (wx.getStorageSync('fails') == 0) {
      app.applyNotice();
      return false;
    } else {
      this.setAreaData();
      this.onLoad();
    }
  },
  onShareAppMessage: function () {
    return {
      title: "比尔高身高管理",
      desc: "曾经和你一样高的人更懂你",
      path: `pages/index/index`
    }
  },

})
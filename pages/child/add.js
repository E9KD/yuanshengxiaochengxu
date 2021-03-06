var app = getApp();
var area = require('../../utils/util.js');
const API_URL = 'https://wx.biergao.vip/api/biaob/';
var p = 0, c = 0, d = 0, g = 0
Page({
  data: {
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
    fheightName: [],
    fheightCode: [],
    provinceSelIndex2: '',
    mheightName: [],
    mheightCode: [],
    provinceSelIndex3: '',
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
  // 选择父亲
  changeFheight: function (e) {

    var d = e.detail.value
    this.setAreaData('fheight', p, c, d)
    console.log(d)
  },
  // 选择母亲
  changeMheight: function (e) {

    var g = e.detail.value
    this.setAreaData('mheight', p, c, d, g)
  },
  setAreaData: function (t, p, c, d, g) {
    console.log(c)
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

    var p = p || 0 // qiwangselindex
    var c = c || 0 // nowheightSelindex
    var d = d || 0 // fheightSelindex
    var g = g || 0 // mheightSelindex
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
    // 设置f数据
    var fheight = area.area['100001']
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
    var mheight = area.area['100001']
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
    console.log(e)
    var data = e.detail.value
    var telRule = /^1[3|4|5|7|8]\d{9}$/, nameRule = /^[\u4e00-\u9fa5]{2,4}$/i
    var age = this.jsGetAge(data.brithday);
    if (data.sex == '') {
      this.showMessage('请选择性别')
    } else if (data.username == '') {
      this.showMessage('请输入姓名')
    } else if (!nameRule.test(data.username)) {
      this.showMessage('请输入中文名2-4位')
    } else if (data.brithday == '') {
      this.showMessage('请选择生日')
    } else if (age > 20) {
      this.showMessage('您孩子已经大于20岁！')
    } else if (age < 0) {
      this.showMessage('您孩子不能小于0岁！')
    } else if (data.qiwangheight == '') {
      this.showMessage('请选择期望身高')
    } else if (data.nowheight == '') {
      this.showMessage('请选择目前身高')
    } else if (data.fatherheight == '') {
      this.showMessage('请选择父亲身高')
    } else if (data.motherheight == '') {
      this.showMessage('请选择母亲身高')
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
          var fm = [{ "fheight": formData.fatherheight, "mheight": formData.motherheight }];
          wx.setStorageSync('fm', fm)
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
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    this.setData({
      openid: openid
    })
  },
  onShow: function () {
    // console.log(area.area);
      this.setAreaData();
      // this.onLoad();
  },
  getInviteCode: function (options) {
    if (options != undefined) {
      wx.showToast({
        title: '来自用户:' + options + '的分享',
        icon: 'success',
        duration: 2000
      })
    }
  },
  onShareAppMessage: function () {
    return {
      title: "比尔高身高管理",
      desc: "曾经和你一样高的人更懂你",
      path: `pages/child/add`
    }
  },

})
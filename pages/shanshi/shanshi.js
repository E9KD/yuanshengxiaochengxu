var app = getApp();
var util = require('../../utils/util.js');
let API_URL = 'https://wx.biergao.vip/api/survey/',
  local = 'https://wx.biergao.vip/api/';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionIndex: 1,
    totalscore: 0,
    totalquestion: false,
    score: [],
    assess1: 0,
    assess2: 0,
    assess3: 0,
    assess4: 0,
    assess5: 0,
    assess6: 0,
    assess7: 0,
    assess8: 0,
    btname: '下一题',
    tnum: 0,
    questiontype: false
  },


  assesscount: function() {
    var that = this;
    // var assess1 = parseInt(that.data.score[1 - 1][1]) + that.data.assess1;

    // var assess2 = that.data.assess2 +
    //   parseInt(that.data.score[1 - 1][1]) +
    //   parseInt(that.data.score[2 - 1][1]) +
    //   parseInt(that.data.score[3 - 1][1]) +
    //   parseInt(that.data.score[5 - 1][1]) +
    //   parseInt(that.data.score[6 - 1][1]) +
    //   parseInt(that.data.score[7 - 1][1]) +
    //   parseInt(that.data.score[11 - 1][1]) +
    //   parseInt(that.data.score[12 - 1][1]) +
    //   parseInt(that.data.score[13 - 1][1]) +
    //   parseInt(that.data.score[15 - 1][1]) +
    //   parseInt(that.data.score[16 - 1][1]) +
    //   parseInt(that.data.score[17 - 1][1]) +
    //   parseInt(that.data.score[18 - 1][1]) +
    //   parseInt(that.data.score[19 - 1][1]) +
    //   parseInt(that.data.score[20 - 1][1]);


    // var assess3 = that.data.assess3 +
    //   parseInt(that.data.score[3 - 1][1]) +
    //   parseInt(that.data.score[5 - 1][1]) +
    //   parseInt(that.data.score[6 - 1][1]) +
    //   parseInt(that.data.score[7 - 1][1]) +
    //   parseInt(that.data.score[10 - 1][1]) +
    //   parseInt(that.data.score[18 - 1][1]);

    // var assess4 = that.data.assess4 +
    //   parseInt(that.data.score[3 - 1][1]) +
    //   parseInt(that.data.score[4 - 1][1]) +
    //   parseInt(that.data.score[18 - 1][1]);

    // var assess5 = that.data.assess5 +
    //   parseInt(that.data.score[3 - 1][1]) +
    //   parseInt(that.data.score[4 - 1][1]) +
    //   parseInt(that.data.score[5 - 1][1]) +
    //   parseInt(that.data.score[6 - 1][1]) +
    //   parseInt(that.data.score[7 - 1][1]) +
    //   parseInt(that.data.score[13 - 1][1]) +
    //   parseInt(that.data.score[14 - 1][1]) +
    //   parseInt(that.data.score[15 - 1][1]);

    // var assess6 = that.data.assess6 +
    //   parseInt(that.data.score[7 - 1][1]) +
    //   parseInt(that.data.score[8 - 1][1]) +
    //   parseInt(that.data.score[9 - 1][1]) +
    //   parseInt(that.data.score[10 - 1][1]);

    // var assess7 = that.data.assess7 +
    //   parseInt(that.data.score[5 - 1][1]) +
    //   parseInt(that.data.score[12 - 1][1]);

    // var assess8 = that.data.assess8 +
    //   parseInt(that.data.score[3 - 1][1]) +
    //   parseInt(that.data.score[5 - 1][1]);

    var assess1 = that.data.assess1
    var assess2 = that.data.assess2
    var assess3 = that.data.assess3
    var assess4 = that.data.assess4
    var assess5 = that.data.assess5
    var assess6 = that.data.assess6
    var assess7 = that.data.assess7
    var assess8 = that.data.assess8
    var assess1list = [1]
    var assess2list = [1, 2, 3, 5, 6, 7, 11, 12, 13, 15, 16, 17, 18, 19, 20]
    var assess3list = [3, 5, 6, 7, 10, 18]
    var assess4list = [3, 4, 18]
    var assess5list = [3, 4, 5, 6, 7, 13, 14, 15]
    var assess6list = [7, 8, 9, 10]
    var assess7list = [5, 12]
    var assess8list = [3, 5]
    var assess1count = 0
    var assess2count = 0
    var assess3count = 0
    var assess4count = 0
    var assess5count = 0
    var assess6count = 0
    var assess7count = 0
    var assess8count = 0
    for (var i = 1; i < that.data.totalquestion; i++) {
      if (i == assess1list[assess1count]) {
        console.log(assess1);
        assess1count++
        assess1 += parseInt(that.data.score[i - 1][1])
        console.log(assess1);
      }
      if (i == assess2list[assess2count]) {
        assess2count++
        assess2 += parseInt(that.data.score[i - 1][1])
      }
      if (i == assess3list[assess3count]) {
        assess3count++
        assess3 += parseInt(that.data.score[i - 1][1])
      }
      if (i == assess4list[assess4count]) {
        assess4count++
        assess4 += parseInt(that.data.score[i - 1][1])
      }
      if (i == assess5list[assess5count]) {
        assess5count++
        assess5 += parseInt(that.data.score[i - 1][1])
      }
      if (i == assess6list[assess6count]) {
        assess6count++
        assess6 += parseInt(that.data.score[i - 1][1])
      }
      if (i == assess7list[assess7count]) {
        assess7count++
        assess7 += parseInt(that.data.score[i - 1][1])
      }
      if (i == assess8list[assess8count]) {
        assess8count++
        assess8 += parseInt(that.data.score[i - 1][1])
      }
    }
    that.setData({
      assess1: assess1,
      assess2: assess2,
      assess3: assess3,
      assess4: assess4,
      assess5: assess5,
      assess6: assess6,
      assess7: assess7,
      assess8: assess8,
    })
  },

  nextquestion: function(e) {
    var that = this;
    if (e.detail.value.anwser == '') {
      wx.showToast({
        title: '请选择',
        icon: 'loading',
        image: '',
        duration: 2000,
        mask: true,

      })
    } else {


      var totalquestion = that.data.totalquestion
      if (that.data.questionIndex < (totalquestion + 1)) {
        that.setData({
          totalscore: that.data.totalscore + parseInt(e.detail.value.anwser)
        })
      }
      if (that.data.questionIndex == totalquestion) {
        that.setData({
          btname: '点击提交'
        })
      }

      if (that.data.questionIndex == totalquestion + 1) {
        that.assesscount();
        var keys = {
          userid: that.data.userInfo.userid,
          openid: that.data.userInfo.openId,
          unionid: that.data.userInfo.unionId,
          assess1: that.data.assess1,
          assess2: that.data.assess2,
          assess3: that.data.assess3,
          assess4: that.data.assess4,
          assess5: that.data.assess5,
          assess6: that.data.assess6,
          assess7: that.data.assess7,
          assess8: that.data.assess8,
          total: that.data.totalscore,
          pid: that.data.questiontype
        }
        var yingyangpenfen = local + 'Yypfjl/add2';
        util.getAj(yingyangpenfen, keys, 'GET', function(data) {
          console.log(data)
          if (data.status == 500) {
            wx.showToast({
              title: '提交失败，请重试！',
              icon: 'loading',
              image: '',
              duration: 2000,
              mask: true,
            })
          } else {
            var arr = JSON.stringify(keys);
            wx.redirectTo({
              url: '../nutriTarget/nutriTarget?arr=' + arr + '&questiontype=' + that.data.questiontype
            })
          }
        })
      }

      if (that.data.questionIndex < totalquestion + 1) {
        that.setData({
          questionIndex: that.data.questionIndex + 1
        })



        console.log(e);

        that.data.score.push([that.data.questionid, e.detail.value.anwser])
        // console.log(score);



        if (that.data.questionIndex < totalquestion + 1) {
          wx.request({
            url: API_URL + 'getquestion2',
            data: {
              'questionid': that.data.questionIndex,
              'pid': that.data.questiontype
            },
            method: 'get',
            success: function(res) {
              console.log(res.data)

              that.setData({
                question: res.data.questiondata[0].question,
                questionid: res.data.questiondata[0].questionid,
                anwserdata: res.data.anwserdata
              })
            }
          })
        }
      }
    }
    if (e.detail.value.anwser !== '' && (that.data.questionIndex < totalquestion + 1)) {
      that.setData({
        anwserdata: ''
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var questiontype = options.typeid;
    var that = this;
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    var keys = {
      openid: openid
    }
    if (openid == null || openid == 'undefined' || !openid) {
      wx.redirectTo({
        url: '../logs/index',
      })
      return false;
    } else {
      app.getUserInfo(function(personInfo) {
        that.setData({
          userInfo: personInfo,
        })
      })
    }
    that.setData({
      questiontype: questiontype
    })
    switch (questiontype) {
      case "1":
        wx.setNavigationBarTitle({
          title: '情绪调查表(问答)',
        })
        break;
      case "2":
        wx.setNavigationBarTitle({
          title: '内分泌调查表',
        })
        break;
      case "3":
        wx.setNavigationBarTitle({
          title: '运动调查表',
        })
        break;
      case "4":
        wx.setNavigationBarTitle({
          title: '睡眠调查表',
        })
        break;
      default:
        wx.setNavigationBarTitle({
          title: '营养调查表(频率)',
        })
        break;
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    wx.showToast({
      icon: 'loading',
      image: '',
      duration: 5000,
      mask: true,

    })
    var url = API_URL + 'firstgetquestion2';
    setTimeout(function() {
      var kid = {
        id: that.data.questiontype
      };
      util.getAj(url, kid, 'GET', function(data) {
        console.log(data);
        if (data.status == 500) {
          wx.showToast({
            title: '网络连接失败！',
            icon: 'loading',
            image: '',
            duration: 2000,
          })
        } else {
          that.setData({
            question: data.questiondata[0].question,
            questionid: data.questiondata[0].questionid,
            anwserdata: data.anwserdata,
            totalquestion: data.count
          })
          wx.hideToast();
        }
      })
    }, 3000);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
})
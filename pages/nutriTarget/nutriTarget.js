var app = getApp();
var radarChart = null;
var wxCharts = require('../../utils/wxcharts.js');
var R_htmlToWxml = require('../../utils/htmlToWxml.js'); //引入公共方法
var util = require('../../utils/util.js');
let API_URL = 'https://wx.biergao.vip/api/survey/',
  local = 'https://wx.biergao.vip/api/';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    push: '../../image/push.png',
    pull: '../../image/pull.png',
    isshow: 0,
    data1: 0,
    data2: 0,
    data3: 0,
    data4: 0,
    data5: 0,
    data6: 0,
    data6: 0,
    data8: 0,
    allassess: '',
    questiontype: false,
    jielun: false
  },




  showlong: function(e) {
    var that = this;
    var id = e.currentTarget.id;
    switch (id) {
      case "1":
        if (id != that.data.isshow) {
          that.setData({
            isshow: id
          })
        } else {
          that.setData({
            isshow: 0
          })
        }
        break;
      case "2":
        if (id != that.data.isshow) {
          that.setData({
            isshow: id
          })
        } else {
          that.setData({
            isshow: 0
          })
        }
        break;
      case "3":
        if (id != that.data.isshow) {
          that.setData({
            isshow: id
          })
        } else {
          that.setData({
            isshow: 0
          })
        }
        break;
      case "4":
        if (id != that.data.isshow) {
          that.setData({
            isshow: id
          })
        } else {
          that.setData({
            isshow: 0
          })
        }
        break;
      case "5":
        if (id != that.data.isshow) {
          that.setData({
            isshow: id
          })
        } else {
          that.setData({
            isshow: 0
          })
        }
        break;
      case "6":
        if (id != that.data.isshow) {
          that.setData({
            isshow: id
          })
        } else {
          that.setData({
            isshow: 0
          })
        }
        break;
      case "7":
        if (id != that.data.isshow) {
          that.setData({
            isshow: id
          })
        } else {
          that.setData({
            isshow: 0
          })
        }
        break;
      case "8":
        if (id != that.data.isshow) {
          that.setData({
            isshow: id
          })
        } else {
          that.setData({
            isshow: 0
          })
        }
        break;
      default:
        that.setData({
          isshow: 0
        })
        break;
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var arr = JSON.parse(options.arr);
    if (options.questiontype == undefined) {
      var questiontype = arr.pid;
    } else {
      var questiontype = Number(options.questiontype);
    }
    // console.log(options);
    console.log(questiontype);
    console.log(arr);
    switch (questiontype) {
      case 1:
        wx.setNavigationBarTitle({
          title: '情绪调查评分',
        })
        wx.showToast({
          icon: 'loading',
          duration: 1000000,
        })
        that.setData({
          questiontype: questiontype,
          total: arr.total,
        })
        var url = API_URL + 'getassess2';
        var kid = {
          pid: questiontype,
          total: arr.total,
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
              detail9: data.title,
              jielun: R_htmlToWxml.html2json(data.jielun)
            })
            wx.hideToast();
          }
        })
        break;
      case 2:
        wx.setNavigationBarTitle({
          title: '内分泌调查评分',
        })
        wx.showToast({
          icon: 'loading',
          duration: 1000000,
        })
        that.setData({
          questiontype: questiontype,
          total: arr.total,
        })
        var url = API_URL + 'getassess2';
        var kid = {
          pid: questiontype,
          total: arr.total,
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
              detail9: data.title,
              jielun: R_htmlToWxml.html2json(data.jielun)
            })
            wx.hideToast();
          }
        })
        break;
      case 3:
        wx.setNavigationBarTitle({
          title: '运动调查评分',
        })
        wx.showToast({
          icon: 'loading',
          duration: 1000000,
        })
        that.setData({
          questiontype: questiontype,
          total: arr.total,
        })
        var url = API_URL + 'getassess2';
        var kid = {
          pid: questiontype,
          total: arr.total,
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
              detail9: data.title,
              jielun: R_htmlToWxml.html2json(data.jielun)
            })
            wx.hideToast();
          }
        })
        break;
      case 4:
        wx.setNavigationBarTitle({
          title: '睡眠调查评分',
        })
        that.setData({
          questiontype: questiontype,
          total: arr.total,
        })
        var url = API_URL + 'getassess2';
        var kid = {
          pid: questiontype,
          total: arr.total, 
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
              detail9: data.title,
              jielun: R_htmlToWxml.html2json(data.jielun)
            })
            wx.hideToast();
          }
        })
        break;
      default:
        wx.setNavigationBarTitle({
          title: '营养调查评分',
        })
        that.setData({
          total: arr.total,
          assess1: arr.assess1,
          assess2: arr.assess2,
          assess3: arr.assess3,
          assess4: arr.assess4,
          assess5: arr.assess5,
          assess6: arr.assess6,
          assess7: arr.assess7,
          assess8: arr.assess8,
          data1: parseInt(arr.assess1) / 6,
          data2: parseInt(arr.assess2) / 78,
          data3: parseInt(arr.assess3) / 33,
          data4: parseInt(arr.assess4) / 15,
          data5: parseInt(arr.assess5) / 44,
          data6: parseInt(arr.assess6) / 20,
          data7: parseInt(arr.assess7) / 10,
          data8: parseInt(arr.assess8) / 12,
        })

        wx.request({
          url: API_URL + 'getassess',
          method: 'GET',
          success: function(res) {
            // console.log(res.data[0].minscore);
            var min1 = res.data[1 - 1].minscore;
            var max1 = res.data[1 - 1].maxscore;
            var assess1 = that.data.assess1;

            var min2 = res.data[2 - 1].minscore;
            var max2 = res.data[2 - 1].maxscore;
            var assess2 = that.data.assess2;

            var min3 = res.data[3 - 1].minscore;
            var max3 = res.data[3 - 1].maxscore;
            var assess3 = that.data.assess3;

            var min4 = res.data[4 - 1].minscore;
            var max4 = res.data[4 - 1].maxscore;
            var assess4 = that.data.assess4;

            var min5 = res.data[5 - 1].minscore;
            var max5 = res.data[5 - 1].maxscore;
            var assess5 = that.data.assess5;

            var min6 = res.data[6 - 1].minscore;
            var max6 = res.data[6 - 1].maxscore;
            var assess6 = that.data.assess6;

            var min7 = res.data[7 - 1].minscore;
            var max7 = res.data[7 - 1].maxscore;
            var assess7 = that.data.assess7;

            var min8 = res.data[8 - 1].minscore;
            var max8 = res.data[8 - 1].maxscore;
            var assess8 = that.data.assess8;

            var min9 = res.data[9 - 1].minscore;
            var max9 = res.data[9 - 1].maxscore;
            var total = that.data.total;


            that.setData({
              allassess: res.data,
            })
            console.log(res.data[1 - 1].pingfenzhibiao);
            if (assess1 >= 6) {
              that.setData({
                detail1: res.data[1 - 1].assess_a,
                ty1: res.data[1 - 1].type1,
                p1: R_htmlToWxml.html2json(res.data[1 - 1].pingfenzhibiao.assess_a)
              })
            } else if (assess1 < 6 && assess1 > 0) {
              that.setData({
                detail1: res.data[1 - 1].assess_b,
                ty1: res.data[1 - 1].type2,
                p1: R_htmlToWxml.html2json(res.data[1 - 1].pingfenzhibiao.assess_b)
              })
            } else {
              that.setData({
                detail1: res.data[1 - 1].assess_c,
                ty1: res.data[1 - 1].type3,
                p1: R_htmlToWxml.html2json(res.data[1 - 1].pingfenzhibiao.assess_c)
              })
            }

            if (assess2 >= 70) {
              that.setData({
                detail2: res.data[2 - 1].assess_a,
                ty2: res.data[1 - 1].type1,
                p2: R_htmlToWxml.html2json(res.data[2 - 1].pingfenzhibiao.assess_a)
              })
            } else if (assess2 > 15 && assess2 < 70) {
              that.setData({
                detail2: res.data[2 - 1].assess_b,
                ty2: res.data[1 - 1].type2,
                p2: R_htmlToWxml.html2json(res.data[2 - 1].pingfenzhibiao.assess_b)
              })
            } else {
              that.setData({
                detail2: res.data[2 - 1].assess_c,
                ty2: res.data[1 - 1].type3,
                p2: R_htmlToWxml.html2json(res.data[2 - 1].pingfenzhibiao.assess_c)
              })
            }


            if (assess3 >= 28) {
              that.setData({
                detail3: res.data[3 - 1].assess_a,
                ty3: res.data[1 - 1].type1,
                p3: R_htmlToWxml.html2json(res.data[3 - 1].pingfenzhibiao.assess_a)
              })
            } else if (assess3 < 28 && assess3 > 7) {
              that.setData({
                detail3: res.data[3 - 1].assess_b,
                ty3: res.data[1 - 1].type2,
                p3: R_htmlToWxml.html2json(res.data[3 - 1].pingfenzhibiao.assess_b)
              })
            } else {
              that.setData({
                detail3: res.data[3 - 1].assess_c,
                ty3: res.data[1 - 1].type3,
                p3: R_htmlToWxml.html2json(res.data[3 - 1].pingfenzhibiao.assess_c)
              })
            }


            if (assess4 >= 13) {
              that.setData({
                detail4: res.data[4 - 1].assess_a,
                ty4: res.data[1 - 1].type1,
                p4: R_htmlToWxml.html2json(res.data[4 - 1].pingfenzhibiao.assess_a)
              })
            } else if (assess4 < 13 && assess4 > 3) {
              that.setData({
                detail4: res.data[4 - 1].assess_b,
                ty4: res.data[1 - 1].type2,
                p4: R_htmlToWxml.html2json(res.data[4 - 1].pingfenzhibiao.assess_b)
              })
            } else {
              that.setData({
                detail4: res.data[4 - 1].assess_c,
                ty4: res.data[1 - 1].type3,
                p4: R_htmlToWxml.html2json(res.data[4 - 1].pingfenzhibiao.assess_c)
              })
            }


            if (assess5 >= 38) {
              that.setData({
                detail5: res.data[5 - 1].assess_a,
                ty5: res.data[1 - 1].type1,
                p5: R_htmlToWxml.html2json(res.data[5 - 1].pingfenzhibiao.assess_a)
              })
            } else if (assess5 < 38 && assess5 > 11) {
              that.setData({
                detail5: res.data[5 - 1].assess_b,
                ty5: res.data[1 - 1].type2,
                p5: R_htmlToWxml.html2json(res.data[5 - 1].pingfenzhibiao.assess_b)
              })
            } else {
              that.setData({
                detail5: res.data[5 - 1].assess_c,
                ty5: res.data[1 - 1].type3,
                p5: R_htmlToWxml.html2json(res.data[5 - 1].pingfenzhibiao.assess_c)
              })
            }

            if (assess6 >= 17) {
              that.setData({
                detail6: res.data[6 - 1].assess_a,
                ty6: res.data[1 - 1].type1,
                p6: R_htmlToWxml.html2json(res.data[6 - 1].pingfenzhibiao.assess_a)
              })
            } else if (assess6 < 17 && assess6 > 6) {
              that.setData({
                detail6: res.data[6 - 1].assess_b,
                ty6: res.data[1 - 1].type2,
                p6: R_htmlToWxml.html2json(res.data[6 - 1].pingfenzhibiao.assess_b)
              })
            } else {

              that.setData({
                detail6: res.data[6 - 1].assess_c,
                ty6: res.data[1 - 1].type3,
                p6: R_htmlToWxml.html2json(res.data[6 - 1].pingfenzhibiao.assess_c)
              })
            }

            if (assess7 >= 8) {
              that.setData({
                detail7: res.data[7 - 1].assess_a,
                ty7: res.data[1 - 1].type1,
                p7: R_htmlToWxml.html2json(res.data[7 - 1].pingfenzhibiao.assess_a)
              })
            } else if (assess7 < 8 && assess7 > 3) {
              that.setData({
                detail7: res.data[7 - 1].assess_b,
                ty7: res.data[1 - 1].type2,
                p7: R_htmlToWxml.html2json(res.data[7 - 1].pingfenzhibiao.assess_b)
              })
            } else {
              that.setData({
                detail7: res.data[7 - 1].assess_c,
                ty7: res.data[1 - 1].type3,
                p7: R_htmlToWxml.html2json(res.data[7 - 1].pingfenzhibiao.assess_c)
              })
            }

            if (assess8 >= 10) {
              that.setData({
                detail8: res.data[8 - 1].assess_a,
                ty8: res.data[1 - 1].type1,
                p8: R_htmlToWxml.html2json(res.data[8 - 1].pingfenzhibiao.assess_a)
              })
            } else if (assess8 < 10 && assess8 > 4) {
              that.setData({
                detail8: res.data[8 - 1].assess_b,
                ty8: res.data[1 - 1].type2,
                p8: R_htmlToWxml.html2json(res.data[8 - 1].pingfenzhibiao.assess_b)
              })
            } else {
              that.setData({
                detail8: res.data[8 - 1].assess_c,
                ty8: res.data[1 - 1].type3,
                p8: R_htmlToWxml.html2json(res.data[8 - 1].pingfenzhibiao.assess_c)
              })
            }

            if (total >= 80) {
              that.setData({
                detail9: res.data[9 - 1].assess_a,
              })
            } else if (total < 80 && total >= 60) {
              that.setData({
                detail9: res.data[9 - 1].assess_b,
              })
            } else {
              that.setData({
                detail9: res.data[9 - 1].assess_c,
              })
            }
          }
        })
        break;
    }



  },


  touchHandler: function(e) {
    console.log(radarChart.getCurrentDataIndex(e));
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(e) {

    var windowWidth = 320;
    var res = wx.getSystemInfoSync();
    windowWidth = res.windowWidth;
    var that = this;
    var data1 = that.data.data1;
    var data2 = that.data.data2;
    var data3 = that.data.data3;
    var data4 = that.data.data4;
    var data5 = that.data.data5;
    var data6 = that.data.data6;
    var data7 = that.data.data7;
    var data8 = that.data.data8;
    if (that.data.questiontype == 0) {
      radarChart = new wxCharts({
        canvasId: 'radarCanvas',
        type: 'radar',
        categories: ['食物种类', '膳食结构', '蛋白', '脂肪酸', '维生素A、D', '钙', '铁', '锌'],
        series: [{
          name: '',
          color: '#FF8C00',
          data: [data1 * 150, data2 * 150, data3 * 150, data4 * 150, data5 * 150, data6 * 150, data7 * 150, data8 * 150]
        }],
        width: windowWidth,
        height: 225,
        extra: {
          radar: {
            max: 150,
            labelColor: '#ffffff'
          }
        }
      });
    }


    // that.selectassess();

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
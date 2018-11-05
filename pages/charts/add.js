var wxCharts = require('../../utils/wxcharts.js');
var util = require('../../utils/util.js');
var app = getApp();
const API_URL = 'https://wx.biergao.vip/api/biaob/';
const API_CHILD = 'https://wx.biergao.vip/api/Child/';
var lineChart = null;
var startPos = null;
Page({
  data: {
    pic_array: '',
    hx_index: 0,
    openid: '',
    loadingText: "数据加载失败",
    loading: false,
    disabled: false,
    loadingHide: true,
    nowheight: '',
    dateheight: '',
    status: '',
    logs: []
  },
  powerDrawer: function (e) {
    var that = this;
    var uid = that.data.uid;
    var uname = that.data.uname;
    var openid = that.data.openid;
    wx.navigateTo({
      url: '../insert/add?uid=' + uid + '&openid=' + openid + '&uname=' + uname,
    })

  },
  bindPickerChange_hx: function (e) {
    console.log("picker发送选择改变，携带值为", e.detail.value);
    this.setData({
      hx_index: e.detail.value,
    })
    var i = e.detail.value;
    this.userChild(this.data.pic_array[i]);
  },
  userChild: function (e) {
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    console.log('数据', e)
    var resoue = e;
    var fmheight = [{ "fheight": resoue.fheight, "mheight": resoue.mheight }];
    var sex = resoue.sex, age = resoue.age, beginmoth = resoue.create_moth, qiwangheight = resoue.qiwangheight;
    var url = API_CHILD + 'clist/';
    var keys = {
      cid: resoue.id
    };
    util.getAj(url, keys, 'POST', function (data) {
      console.log('data', data)
      var now = new Date();
      var getyear = "" + now.getFullYear() + "";
      var getmonth = "" + now.getMonth() + "";
      getmonth++;
      var num = data.length;
      var nowheight = [];
      for (var i = 0; i < num; i++) {
        if (data[i].nowheight == '' || data[i].nowheight == null) {
          nowheight.push(null);
        } else {
          nowheight.push(Number(data[i].nowheight));
          if (data[i].m == getmonth) {
            var k = i;
            if (i == 0) {
              var status = 5;
            } else {
              if (data[k--].nowheight != '' || data[k--].nowheight != null) {
                console.log('getmonth', data[k].nowheight)
                if (data[k].nowheight < data[i].nowheight) {
                  var chazhi = data[i].nowheight - data[k].nowheight;
                  var pj = (chazhi / 30).toFixed(3);
                  console.log(pj)
                  if (data[k].nowheight == data[i].nowheight) {
                    var status = 0;
                  } else if (pj < 0.02) {
                    var status = 0;
                  } else if (pj < 0.05 && pj > 0.02) {
                    var status = 1;
                  } else {
                    var status = 2;
                  }
                } else {
                  var status = 4;
                }
              }
            }
          }
        }
      }
      //平均增长速率
      console.log(data)

      // beginmoth
      console.log('getmonth', getmonth)
      that.setData({
        nowheight: nowheight,
        qiwangheight: qiwangheight,
        uid: resoue.id,
        uname: resoue.name,
        status: status
      })
    })
    setTimeout(function () {
      that.tuBiao(sex, age, beginmoth, fmheight, qiwangheight);
      wx.hideToast();
    }, 1200)
  },
  tuBiao: function (sex, age, beginmoth, fmheight, qiwangheight) {
    var that = this;
    var res = wx.getSystemInfoSync().screenWidth;
    var simulationData = this.createSimulationData(sex, age, beginmoth, fmheight, qiwangheight);
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      series: [{
        name: '正常身高',
        data: simulationData.arr,
      }, {
        name: '完美身高',
        data: simulationData.garr,

      }, {
        name: '矮小身高',
        data: simulationData.darr,
      }, {
        name: '你的身高',
        data: that.data.nowheight,
      }
      ],
      xAxis: {
        disableGrid: false
      },
      yAxis: {},
      width: res,
      height: 200,
      dataLabel: true,
      dataPointShape: true,
      enableScroll: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },

  touchHandler: function (e) {
    // console.log('now')
    // console.log(e)
    lineChart.scrollStart(e);
  },
  moveHandler: function (e) {
    lineChart.scroll(e);
  },
  touchEndHandler: function (e) {
    console.log(e)
    lineChart.scrollEnd(e);
    lineChart.showToolTip(e, {
      format: function (item) {
        return item.name + ':' + item.data
      }
    });
  },
  createSimulationData: function (sex, age, beginmoth, dateh, fmheight, qiwangheight) {

    var sex, age, beginmoth, dateh, fmheight, qiwangheight;
    var that = this;
    var resp = [];
    (sex == 1) ? resp = util.man : resp = util.woman;
    var nage = age + 1;
    var nage2 = age + 2;
    //正常
    var gage = resp[1]['b' + age];
    var fage = resp[0]['a' + age];
    var dage = resp[2]['c' + age];
    //高
    var ngage = resp[1]['b' + nage];
    var nfage = resp[0]['a' + nage];
    var ndage = resp[2]['c' + nage];
    console.log(ngage)
    console.log(nfage)
    console.log(ndage)
    //低
    var ngage2 = resp[1]['b' + nage2];
    var nfage2 = resp[0]['a' + nage2];
    var ndage2 = resp[2]['c' + nage2];
    console.log(ngage2)
    console.log(nfage2)
    console.log(ndage2)

    var month = 12;
    //当开始月份等于1月份时 启用这个算法
    if (beginmoth == 1) {
      var z_fage = Number(fage);
      var arr = [z_fage];
      var co = Number(nfage) - z_fage;
      var d = (co / month).toFixed(1);
      console.log('d', d)
      var eb = Number(d);

      var y_fage = Number(gage);
      var garr = [y_fage];
      var cp = Number(ngage) - y_fage;
      var f = (cp / month).toFixed(1);
      console.log('f', f)
      var ec = Number(f);

      var x_fage = Number(dage);
      var darr = [x_fage];
      var cq = Number(ndage) - x_fage;

      var g = (cq / month).toFixed(1);

      console.log('g', g)
      var ed = Number(g);
    } else {
      var smonth = 12 - Number(beginmoth);
      var zg = ((Number(ngage2) + Number(ngage)) / 2).toFixed(1);
      var zz = ((Number(nfage2) + Number(nfage)) / 2).toFixed(1);
      var zd = ((Number(ndage2) + Number(ndage)) / 2).toFixed(1);
      console.log(zg)
      console.log(zz)
      console.log(zd)
      var beginmoth = Number(beginmoth);
      var smonth = 12 - beginmoth; //7
      var z_fage = Number(fage);
      var arr = [z_fage];
      var co = zz - z_fage;
      var d = (co / month).toFixed(1);
      console.log('d', d)
      var eb = Number(d);

      var y_fage = Number(gage);
      var garr = [y_fage];
      var cp = zg - y_fage;
      var f = (cp / month).toFixed(1);
      console.log('f', f)
      var ec = Number(f);

      var x_fage = Number(dage);
      var darr = [x_fage];
      var cq = zd - x_fage;

      var g = (cq / month).toFixed(1);

      console.log('g', g)
      var ed = Number(g);

      console.log('eb', eb)
    }


    for (var i = 0; i < 10; i++) {
      var cona = z_fage += eb;
      var l1 = cona.toFixed(1);
      var l2 = Number(l1);
      var conb = y_fage += ec;
      var l3 = conb.toFixed(1);
      var l4 = Number(l3);
      var conc = x_fage += ed;
      var l5 = conc.toFixed(1);
      var l6 = Number(l5);
      arr.push(l2);
      garr.push(l4);
      darr.push(l6);
    }
    if (beginmoth == 1) {
      arr.push(Number(nfage));
      garr.push(Number(ngage));
      darr.push(Number(ndage));
    } else {
      arr.push(Number(zz));
      garr.push(Number(zg));
      darr.push(Number(zd));
    }

    var categories = [];
    var j = beginmoth;
    var k = 1;
    var l = 1;
    var b = 12 - Number(j);
    var now = new Date();
    var now1 = "" + now.getFullYear() + "";
    var znow = now1.substring(2);
    var ctime = znow++;
    for (var i = 0; i < 12; i++) {
      if (i <= b) {
        categories.push(ctime + '/' + (beginmoth + i) + '月');
        l++;
      } else {
        categories.push(znow + '/' + k + '月');
        k++;
      }
    }

    return {
      categories: categories,
      arr: arr,
      garr: garr,
      darr: darr
    }
  },
  onLoad: function (e) {
    var that = this;
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    if (!openid) {
      that.setData({
        loadingHide: true
      });
      wx.redirectTo({
        url: '../user/user',
      })
    } else {
      var url = API_CHILD + 'childlist/';
      var keys = {
        openid: openid
      };
      util.getAj(url, keys, 'POST', function (data) {
        if (data != 0) {
          that.setData({
            openid: openid,
            disabled: false,
            loading: false,
            pic_array: data
          })
          that.userChild(that.data.pic_array[0]);
        }
      })
    }
  }
});
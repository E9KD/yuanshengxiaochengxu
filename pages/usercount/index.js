var app = getApp();
var util = require('../../utils/util.js');
var wxCharts = require('../../utils/wxcharts.js');
//let local = 'http://www.a.com/api/dakaup/';
let API_URL = 'https://wx.biergao.vip/api/biaob/',
  API_CHILD = 'https://wx.biergao.vip/api/Child/';
let local = 'https://wx.biergao.vip/api/dakaup/';
var lineChart = null;
var startPos = null;
Page({
  data: {
    uid: null,
    openid: null,
    msg: '',
    height: '',
    fm: '',
    showMessage: false,
    messageContent: '',
    openid: '',
    nowheight: '',
    dateheight: '',
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
  },
  userChild: function(e) {
    var that = this;
    console.log('数据', e)
    var resoue = e;
    let fmheight = [{
        "fheight": resoue.fheight,
        "mheight": resoue.mheight
      }],
      sex = resoue.sex,
      age = resoue.age,
      beginmoth = resoue.create_moth,
      qiwangheight = resoue.qiwangheight,
      url = API_CHILD + 'clist/';
    var keys = {
      cid: resoue.id
    };
    util.getAj(url, keys, 'POST', function(data) {
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
        }
      }

      // beginmoth
      console.log('getmonth', getmonth)
      that.setData({
        nowheight: nowheight,
        qiwangheight: qiwangheight,
        uid: resoue.id,
        uname: resoue.name
      })
    })
    setTimeout(function() {
      that.tuBiao(sex, age, beginmoth, fmheight, qiwangheight);
    }, 1000)
  },
  tuBiao: function(sex, age, beginmoth, fmheight, qiwangheight) {
    var that = this;
    var width = wx.getSystemInfoSync().screenWidth;
    var width_90 = width - width / 10;
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
      }],
      xAxis: {
        disableGrid: false
      },
      yAxis: {},
      width: width_90,
      height: 200,
      dataLabel: true,
      dataPointShape: true,
      enableScroll: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },

  touchHandler: function(e) {
    // console.log('now')
    // console.log(e)
    lineChart.scrollStart(e);
  },
  moveHandler: function(e) {
    lineChart.scroll(e);
  },
  touchEndHandler: function(e) {
    console.log(e)
    lineChart.scrollEnd(e);
    lineChart.showToolTip(e, {
      format: function(item) {
        return item.name + ':' + item.data
      }
    });
  },
  createSimulationData: function(sex, age, beginmoth, dateh, fmheight, qiwangheight) {
    var sex, age, beginmoth, dateh, fmheight, qiwangheight;
    var that = this;
    var resp = [];
    (sex == 1) ? resp = util.man: resp = util.woman;
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
    // console.log(ngage)
    // console.log(nfage)
    // console.log(ndage)
    //低
    var ngage2 = resp[1]['b' + nage2];
    var nfage2 = resp[0]['a' + nage2];
    var ndage2 = resp[2]['c' + nage2];
    // console.log(ngage2)
    // console.log(nfage2)
    // console.log(ndage2)
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
      // console.log(zg)
      // console.log(zz)
      // console.log(zd)
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
  onReady: function(options) {},
  onShow: function(options) {
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    setTimeout(function() {
      // 高度
      var url = local + 'clientgetdakalist/';
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let openid = that.data.openid;
      let childid = that.data.uid;
      let setYear = false;
      let setMonth = false;
      var keys = {
        openid: that.data.openid,
        childid: childid
      };
       util.getAj(url, keys, 'GET', function(data) {
         if (data != 0) {
          that.setData({
            year: year,
            month: month,
            date_time: year + '-' + month,
            isToday: '' + year + month + now.getDate(),
          })
          that.dateInit(setYear, setMonth, data);
         } else {
           that.showMessage('出现错误');
         }
       })
      wx.hideToast();
    }, 2000)
  },
  onLoad: function(options) {
    var that = this;
    var arr = JSON.parse(options.arr);
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    wx.getSystemInfo({
      success: function(res) {
        var kuan = res.windowWidth / 1.6 + 13;
        that.setData({
          kuan: kuan,
          childinfo: arr,
          openid: openid,
          userInfo: app.globalData.userInfo,
        })
      }
    });
    that.userChild(arr);
    that.yujiheight(arr, openid);
  },
  // 去打卡
  dakaqu: function(e) {
    var openid = this.data.openid;
    wx.navigateTo({
      url: '../wenjuan/wenjuan?uid=' + 1,
    })
  },
  // 去看打卡记录
  lookdaka: function(e) {
    var arr = JSON.stringify(e.currentTarget.dataset.arr);
    wx.navigateTo({
      url: '/pages/wenjuan/wenjuan?arr=' + arr,
    })
  },
  // tishi
  tishi: function() {
    this.showMessage('今天打卡完成再说行吗？');
  },
  yujiheight: function(e, openid) {
    var sex = e.sex;
    var age = e.age;
    var nowheight = e.infos.nowheight;
    var qiwangheight = e.qiwangheight;
    var fheight = e.fheight;
    var mheight = e.mheight;

    var resp = [];
    (sex == 1) ? resp = util.man: resp = util.woman;
    console.log(resp)
    var nage = age;
    var pingjunageheight = Number(resp[0]['a' + nage]);
    var fage = Number(resp[0]['a' + nage]);
    var gage = Number(resp[1]['b' + nage]);
    var dage = Number(resp[2]['c' + nage]);

    // 与期望身高差
    var nowh = nowheight;

    var cha = (nowh - qiwangheight).toFixed(1);
    // 全国平均身高
    var chap = (nowh - pingjunageheight).toFixed(1);
    var gmanheight = Number(e.fm.f);
    var dmanheight = Number(e.fm.m);
    var pingjun = ((gmanheight + dmanheight) / 2).toFixed(0);

    if (nowh > gage) {
      var height = [{
        "title": "预测遗传身高值：",
        "msg": "超高"
      }];
    } else if (fage < nowh && gage > nowh) {
      var height = [{
        "title": "预测遗传身高值：",
        "msg": "正常"
      }];
    } else if (nowh > dage && nowh < fage) {
      var height = [{
        "title": "预测遗传身高值：",
        "msg": "偏矮"
      }];
    } else {
      var height = [{
        "title": "预测遗传身高值：",
        "msg": "矮小"
      }];
    }
    var msg = [{
      gmanheight: gmanheight, //"您正在处于发育期，是增高的最佳激活时期"
      dmanheight: dmanheight,
      cha: cha,
      chap: chap
    }];
    this.setData({
      height: height,
      msg: msg,
      uid: e.id,
      openid: openid,
      fm: pingjun
    })
  },
  dateInit: function(setYear, setMonth, arr) {
    //全部时间的月份都是按0~11基准，显示月份才+1  
    let dateArr = []; //需要遍历的日历数组数据  
    let arrLen = 0; //dateArr的数组长度  
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth(); //没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let startWeek = new Date(year, month ,1).getDay(); //目标月1号对应的星期  
    let dayNums = new Date(year, nextMonth, 0).getDate(); //获取目标月有多少天  
    let obj = {};
    let num = 0;
    let nowday = new Date().getDate();
    let ask = arr;
    // console.log(ask[2018615])
    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    // 当前时间
    let qnow = Number(this.data.isToday);
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;

        let ri = '' + year + (month + 1) + num;
        let ri2 = Number(ri);
        console.log(ri2);
        let nodaka = ri2 < qnow ? false : true;
        let bmax = ri2 > qnow ? false : true;
        if (ask[ri] == undefined) {
          obj = {
            isToday: '' + year + (month + 1) + num,
            dateNum: num,
            datainfo: false,
            nodaka: nodaka,
            bmax: bmax
          }
        } else {
          obj = {
            isToday: '' + year + (month + 1) + num,
            dateNum: num,
            datainfo: ask[ri],
            nodaka: nodaka,
            bmax: bmax
          }
         }
      } else {

        obj = {};
      }
      dateArr[i] = obj;
    }
    this.setData({
      dateArr: dateArr
    })

    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1;
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;

    if (nowYear == getYear && nowMonth == getMonth) {
      this.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
  },
  lastMonth: function() {
    var that = this;
    //全部时间的月份都是按0~11基准，显示月份才+1  
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    // 高度
    var url = local + 'clientgetdakalist/';
    var keys = {
      openid: that.data.openid,
      childid: that.data.uid,
    };
    util.getAj(url, keys, 'GET', function(data) {
      if (data != 0) {
        that.setData({
          year: year,
          month: (month + 1),
        })
        that.dateInit(year, month, data);
      } else {
        that.showMessage('出现错误');
      }
    })
  },
  nextMonth: function() {
    var that = this;
    //全部时间的月份都是按0~11基准，显示月份才+1  
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    // 高度
    var url = local + 'clientgetdakalist/';
    var keys = {
      openid: that.data.openid,
      childid: that.data.uid,
    };
    util.getAj(url, keys, 'GET', function(data) {
      if (data != 0) {
        that.setData({
          year: year,
          month: (month + 1),
        })
        that.dateInit(year, month, data);
      } else {
        that.showMessage('出现错误');
      }
    })
  },
  showMessage: function(text) {
    var that = this
    that.setData({
      showMessage: true,
      messageContent: text
    })
    setTimeout(function() {
      that.setData({
        showMessage: false,
        messageContent: ''
      })
    }, 1000)
  }
})
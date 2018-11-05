var app = getApp();
var util = require('../../utils/util.js');
let url = 'https://wx.biergao.vip/api/Fuwu/getfuwu';
Page({
  data: {
    movies: [],
    searchSongList: [], //放置返回数据的数组  
    isFromSearch: true, // 用于判断searchSongList数组是不是空数组，默认true，空的数组  
    searchPageNum: 1, // 设置加载的第几次，默认是第一次  
    callbackcount: 15, //返回数据的个数  
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏
    openfenxiao:false
  },
  //去查询服务
  buy: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/buy/buy?id=' + id,
    })
  },
  sharepic: function (e) {
    wx.redirectTo({
      url: '../fcanvas/canvas?id=putong',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.keywordSearch();
  },
  onShow: function() {
    
    var self = this;
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    var keys = {
      openid: openid
    };
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
    var fenxiao = app.globalData.fenxiao;
    if(fenxiao==1){
      var openfenxiao = true;
    }else{
      var openfenxiao = false;
    }
    util.getarrimg(function (data) {
      self.setData({
        movies: data['banner'],
        openfenxiao: openfenxiao
      });
    })
    }
    self.keywordSearch();
  },
  //搜索，访问网络  
  fetchSearchList: function() {
    let that = this;
    let searchKeyword = 'enen', //输入框字符串作为参数  
      searchPageNum = that.data.searchPageNum, //把第几次加载次数作为参数  
      callbackcount = that.data.callbackcount; //返回数据的个数  
    //访问网络  
    util.getRequset(url, searchKeyword, searchPageNum, callbackcount,1, function(data) {
      console.log(data)
      //判断是否有数据，有则取数据  
      if (data.pageall != 0) {
        let searchList = [];
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        that.data.isFromSearch ? searchList = data.orderlist : searchList = that.data.searchSongList.concat(data.orderlist)
        if (data.pageall == searchPageNum) {
          that.setData({
            searchSongList: searchList, //获取数据数组
            searchLoadingComplete: true, //把“没有数据”设为true，显示 
            searchLoading: false
          });
        } else {
          that.setData({
            searchSongList: searchList, //获取数据数组
          });
        }
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
      } else {
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示  
          searchLoading: false //把"上拉加载"的变量设为false，隐藏  
        });
      }
    })
  },
  //点击搜索按钮，触发事件  
  keywordSearch: function(e) {
    this.setData({
      searchPageNum: 1, //第一次加载，设置1  
      searchSongList: [], //放置返回数据的数组,设为空  
      isFromSearch: true, //第一次加载，设置true  
      searchLoading: true, //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false //把“没有数据”设为false，隐藏  
    })
    this.fetchSearchList();
  },
  //滚动到底部触发事件  
  searchScrollLower: function() {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1, //每次触发上拉事件，把searchPageNum+1  
        isFromSearch: false //触发到上拉事件，把isFromSearch设为为false  
      });
      that.fetchSearchList();
    }
  },
  imgHeight: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
    var winHei = wx.getSystemInfoSync().windowHeight;
    var imgh = e.detail.height;//图片高度
    var imgw = e.detail.width;//图片宽度
    var swiperH = winWid * imgh / imgw;
    var contenth = winHei - swiperH;
    var hx = winHei,
      www = winWid,
      s_4 = (hx - 38) / 3,
      wwwnei = www - 30,
      hh = hx - (220 - 111),
      imgh = (hh - 20) / 2,
      h2 = (hh - 7.5) / 2,
      h3 = www,
      fx = winWid,
      fw = fx / 4;
    this.setData({
      Height: swiperH + "px",//设置高度
      contenth: contenth + "px",
      fx: fx,
      hh: hh,
      h2: h2,
      fw: fw,
      www: www,
      wwwnei: wwwnei,
      s_4: s_4
    })
  },
})
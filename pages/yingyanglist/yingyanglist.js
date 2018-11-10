var app = getApp();
var util = require('../../utils/util.js');
let url = 'https://wx.biergao.vip/api/Yypfjl/getfuwu2';
let url2 = 'https://wx.biergao.vip/api/Yybg/getyydkpfjl';
Page({
  data: {
    searchSongList: [], //放置返回数据的数组  
    isFromSearch: true, // 用于判断searchSongList数组是不是空数组，默认true，空的数组  
    searchPageNum: 1, // 设置加载的第几次，默认是第一次  
    callbackcount: 15, //返回数据的个数  
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏
    userInfo:false,
    showtype:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    var showtype = options.type;
    var typename = options.typename;
    that.setData({
      showtype: showtype,
      typename: typename
    })
    console.log(options)
    switch (showtype) {
      case "1":
        wx.setNavigationBarTitle({
          title: '情绪调查表',
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
          title: '营养调查表',
        })
        break;
    }  
  },
  onShow: function () {
    var that = this;
    wx.showToast({
      title: '请稍后',
      icon: 'loading',
      duration: 8000
    })
    if (that.data.userInfo == false){
      app.getUserInfo(function (personInfo) {
        that.setData({
          userInfo: personInfo,
        })
      })
      setTimeout(function () {
        that.keywordSearch();
        wx.hideToast();
      }, 3000)
    }else{
      setTimeout(function () {
        that.keywordSearch();
        wx.hideToast();
      }, 2000)
    }
  },
  //yydkpfjlList
  //搜索，访问网络  
  yydkpfjlList: function () {
    let that = this;
    let searchKeyword = that.data.userInfo.userid, //输入框字符串作为参数  
      searchPageNum = that.data.searchPageNum, //把第几次加载次数作为参数  
      callbackcount = that.data.callbackcount, //返回数据的个数
      showtype = that.data.showtype;  
    //访问网络  
    util.getRequset(url2, searchKeyword, searchPageNum, callbackcount, showtype, function (data) {
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
  //搜索，访问网络  
  fetchSearchList: function () {
    console.log(123);
    let that = this;
    let searchKeyword = that.data.userInfo.userid, //输入框字符串作为参数  
      searchPageNum = that.data.searchPageNum, //把第几次加载次数作为参数  
      callbackcount = that.data.callbackcount, //返回数据的个数
      showtype = that.data.showtype;    
    //访问网络  
    util.getRequset(url, searchKeyword, searchPageNum, callbackcount, showtype, function (data) {
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
  keywordSearch: function (e) {
    this.setData({
      searchPageNum: 1, //第一次加载，设置1  
      searchSongList: [], //放置返回数据的数组,设为空  
      isFromSearch: true, //第一次加载，设置true  
      searchLoading: true, //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false //把“没有数据”设为false，隐藏  
    })
    if (this.data.typename >= 5) {
      this.yydkpfjlList();
    } else {
      this.fetchSearchList();
    }
  },
  //滚动到底部触发事件  
  searchScrollLower: function () {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1, //每次触发上拉事件，把searchPageNum+1  
        isFromSearch: false //触发到上拉事件，把isFromSearch设为为false  
      });
      if (that.data.typename >= 5) {
        that.yydkpfjlList();
      } else {
        that.fetchSearchList();
      }
    }
  },
  pingfen:function(e){
    console.log(e);
    var arr = JSON.stringify(e.currentTarget.dataset.arr);
    wx.navigateTo({
      url: '../nutriTarget/nutriTarget?arr='+arr,
    })
  },
  yszbg:function(e){
    var arr = JSON.stringify(e.currentTarget.dataset.arr);
    console.log(arr);
    wx.navigateTo({
      url: '../yszbg/yszbg?arr=' + arr,
    })
  }
})

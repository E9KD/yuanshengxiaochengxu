var app = getApp();
var util = require('../../utils/util.js');
var url = 'https://wx.biergao.vip/api/order/getdingdan';
Page({
  data: {
    searchKeyword: '',  //需要搜索的字符  
    searchSongList: [], //放置返回数据的数组  
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组  
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false , //“没有数据”的变量，默认false，隐藏 
    currentTab: 3,
    userid:null,
    unionId:null,
  },
  onReady: function () {
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        var hh = res.windowHeight;
        var hw = res.windowWidth - 30;
        var hw20 = hw - 20;
        var hw20_3 = hw20 / 3;
        var hw20_hw20_3 = hw20 - hw20_3 - 25;
        var hw20_3_20 = hw20_3 - 20;
        console.log(hw);
        self.setData({
          hw: hw,
          hh: hh,
          hw20: hw20,
          hw20_3: hw20_3,
          hw20_hw20_3: hw20_hw20_3,
          hw20_3_20: hw20_3_20
        })
      },
    });
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (x) {
    // var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    // this.keywordSearch();
    this.setData({
      userid:x.userid,
      unionId:x.unionId
    });
  },
  onShow:function(){
    this.keywordSearch();
  },
  
  //输入框事件，每输入一个字符，就会触发一次  
  bindKeywordInput: function (e) {
    console.log("输入框事件")
    this.setData({
      searchKeyword: e.detail.value
    })
  },
  //搜索，访问网络  
  fetchSearchList: function () {
    let that = this;
    let searchKeyword = that.data.searchKeyword,//输入框字符串作为参数  
      searchPageNum = that.data.searchPageNum,//把第几次加载次数作为参数  
      callbackcount = that.data.callbackcount, //返回数据的个数
      openid = app.globalData.openid;
    //访问网络  
    util.getSearchMusic(url,searchKeyword, openid,searchPageNum, callbackcount, function (data) {
      console.log(data)
      //判断是否有数据，有则取数据  
      if (data.pageall != 0) {
        let searchList = [];
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        that.data.isFromSearch ? searchList = data.orderlist : searchList = that.data.searchSongList.concat(data.orderlist)
        if (data.pageall == searchPageNum){
          that.setData({
            searchSongList: searchList, //获取数据数组
            searchLoadingComplete: true, //把“没有数据”设为true，显示 
            searchLoading:false
          });
        }else{
          that.setData({
            searchSongList: searchList, //获取数据数组
          });
        }
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
      } else {
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示  
          searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
        });
      }
    })
  },
  //点击切换
  clickTab: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  //点击搜索按钮，触发事件  
  keywordSearch: function (e) {
    this.setData({
      searchPageNum: 1,   //第一次加载，设置1  
      searchSongList: [],  //放置返回数据的数组,设为空  
      isFromSearch: true,  //第一次加载，设置true  
      searchLoading: true,  //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false //把“没有数据”设为false，隐藏  
    })
    this.fetchSearchList();
  },
  //滚动到底部触发事件  
  searchScrollLower: function () {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1  
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false  
      });
      that.fetchSearchList();
    }
  },
  studyService: function (){
    wx.navigateTo({
      url: '',
    })
  }
})

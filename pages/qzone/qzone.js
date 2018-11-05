var app = getApp();
var util = require('../../utils/util.js');
// var qzone = 'https://wx.biergao.vip/api/qzone/';
var qzone = 'https://wx.biergao.vip/api/qzone/';
Page({
  data: {
    userInfo: {}, // 存放用户信息
    searchSongList: [], //放置返回数据的数组  
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组  
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 0,      //返回数据的页数
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏 
    picHeight: '',
    currentTab: 3
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.getStorageSync('fails')) {
      wx.redirectTo({
        url: '../logs/index',
      })
      return false;
    }
  },
  onShow: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    var that = this;
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    setTimeout(function () {
      if (app.globalData.userInfo) {
        that.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true,
          openid: openid
        })
      } else {
        wx.switchTab({
          url: '../index/index',
        })
        return false;
      }
      that.keywordSearch(openid, 1);
      wx.hideToast();
    }, 3000)
  },
  onPullDownRefresh() {
    if (this.data.openid) {
      var self = this;
      setTimeout(() => {
        // 模拟请求数据，并渲染
        var openid = self.data.openid;
        // 数据成功后，停止下拉刷新
        this.fetchSearchList(this.data.openid, this.data.currentTab);
        wx.stopPullDownRefresh();
      }, 1000);
    }else{
      wx.showToast({
        title: '参数错误啦！',
        image: '../../image/noData.png',
      })
    }
  },
  //搜索，访问网络  
  fetchSearchList: function (openid, num) {
    let that = this;
    let searchPageNum = that.data.searchPageNum,//把第几次加载次数作为参数  
      callbackcount = that.data.callbackcount, //返回数据的页数
      searchKeyword = openid ? that.data.openid : app.globalData.openid;
    //访问网络
    if (num == 3) {
      var url = qzone + 'getlist'
    } else {
      var url = qzone + 'getGuanbo'
    }
    var keys = {
      uid: searchKeyword,
      page: searchPageNum,
      pageall: callbackcount
    };
    util.getAj(url, keys, 'POST', function (data) {
      // console.log(data)
      //判断是否有数据，有则取数据  
      if (data.pageall != 0) {
        let searchList = [];
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        that.data.isFromSearch ? searchList = data.orderlist : searchList = that.data.searchSongList.concat(data.orderlist)
        if (data.pageall == searchPageNum) {
          that.setData({
            searchSongList: searchList, //获取数据数组
            searchLoadingComplete: true, //把“没有数据”设为true，显示 
            searchLoading: false,
            callbackcount: data.pageall
          });
        } else {
          that.setData({
            searchSongList: searchList, //获取数据数组
            callbackcount: data.pageall
          });
        }
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
      } else {
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示  
          searchLoading: false,  //把"上拉加载"的变量设为false，隐藏
          callbackcount: data.pageall
        });
      }
    })
  },
  //点击搜索按钮，触发事件  
  keywordSearch: function (openid, num) {
    this.setData({
      searchPageNum: 1,   //第一次加载，设置1  
      searchSongList: [],  //放置返回数据的数组,设为空  
      isFromSearch: true,  //第一次加载，设置true  
      searchLoading: true,  //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false //把“没有数据”设为false，隐藏  
    })

    this.fetchSearchList(openid, this.data.currentTab);
  },
  //滚动到底部触发事件  
  searchScrollLower: function () {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1  
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false  
      });
      this.fetchSearchList(this.data.openid, this.data.currentTab);
    }
  },
  previewImage: function (e) { // 展示图片
  console.log(e)
  var current = 'https://wx.biergao.vip/uploads/qzone' + e.target.dataset.src
    var count = e.target.dataset.count.split(",")
    wx.previewImage({
      current:current,
      urls: count
    })
  },
  previewImg: function (e) {
    console.log(e);
    // var index = e.currentTarget.dataset.index;
    // var list = this.data.searchSongList[index].imgstr;
    // wx.previewImage({
    //   current: list[index],     //当前图片地址
    //   urls: list,               //所有要预览的图片的地址集合 数组形式
    // })
  },
  
  imageLoad: function (e) {
    var width = e.detail.width;
    var height = e.detail.height;
    console.log(e.detail);
    var windowWidth = wx.getSystemInfoSync().windowWidth;
    var picHeight = (height / width) * windowWidth;
    this.setData({
      picHeight: picHeight
    });
  },
  //点击切换
  clickTab: function (e) {

    var that = this;
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 10000
      })
      if (e.target.dataset.current == 3) {
        setTimeout(function () {
          that.keywordSearch(openid, e.target.dataset.current);
          wx.hideToast();
        }, 1000)
      } else {
        setTimeout(function () {
          that.keywordSearch(openid, e.target.dataset.current);
          wx.hideToast();
        }, 1000)
      }

    }
  },
  //添加博文
  addqzone: function () {
    wx.navigateTo({
      url: '../addComment/addComment',
    })
  },
  // 点赞
  bindDianZan: function (e) // 处理点赞
  {
    var that = this
    var userId = that.data.openid
    var dz_id = e.currentTarget.dataset.id
    if(!userId){
      wx.showToast({
        title: '参数错误啦！',
        image: '../../image/noData.png',
      })
      wx.switchTab({
        url: '../index/index',
      })
      return false;
    }
    var url = qzone + 'setdianzan';
    var keys = {
      userId: userId,
      id: dz_id,
      nickname: that.data.userInfo.nickName
    };
    util.getAj(url, keys, 'GET', function (res) {
      // console.log(res)
      // 循环当前节点找到点赞ID对应的节点
      for (var ii = 0; ii < that.data.searchSongList.length; ii++) {
        if (that.data.searchSongList[ii].id == dz_id) {
          // 如果当前数组下dianzanlist为null证明还没有人点赞则直接添加 否则添加当前人昵称+之前人的点赞
          if (that.data.searchSongList[ii]['dianzanlist'] == false) {
            that.data.searchSongList[ii]['dianzanlist'] = that.data.userInfo.nickName;
            that.data.searchSongList[ii]['dianzan'] = true;
          }
          else {
            that.data.searchSongList[ii]['dianzanlist'] = that.data.userInfo.nickName + "," + that.data.resultData[ii]['dianzanlist']
            that.data.searchSongList[ii]['dianzan'] = true;
          }
          break
        }
      }

      // 重置数据
      that.setData({
        searchSongList: that.data.searchSongList
      })
    })
  },
  onShareAppMessage: function () {
    return {
      title: "比尔高身高管理",
      desc: "曾经和你一样高的人更懂你",
      path: `pages/qzone/qzone`
    }
  }
})  
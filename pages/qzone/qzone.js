var app = getApp();
var util = require('../../utils/util.js');
var qzone = 'https://wx.biergao.vip/api/qzone/';
Page({
  data: {
    searchSongList: [], //放置返回数据的数组  
    isFromSearch: true, // 用于判断btmList1数组是不是空数组，默认true，空的数组  
    searchPageNum: 1, // 设置加载的第几次，默认是第一次  
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏
    show: false,
    dingseepic: false,
    isshow:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    var that = this;
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : false;
    var userid = wx.getStorageSync('userid') ? wx.getStorageSync('userid') : false;
    that.setData({
      hasUserInfo: true,
      openid: openid,
      userid: userid
    })
    that.keywordSearch(userid);
    wx.hideToast();
  },
  onShow: function() {
    if (this.data.show == true && this.data.dingseepic == false) {
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 10000
      })
      var that = this;
      var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : false;
      var userid = wx.getStorageSync('userid') ? wx.getStorageSync('userid') : false;
      that.setData({
        hasUserInfo: true,
        openid: openid,
        userid: userid,
        show: false,
        dingseepic: false
      })
      that.keywordSearch(userid);
      wx.hideToast();
    }
  },
  onPullDownRefresh: function() {
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 10000
      })
      var that = this;
      var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : false;
      var userid = wx.getStorageSync('userid') ? wx.getStorageSync('userid') : false;
      that.setData({
        hasUserInfo: true,
        openid: openid,
        userid: userid,
        show: false,
        dingseepic: false
      })
      that.keywordSearch(userid);
      wx.hideToast();
  },
  onReachBottom: function() {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1, //每次触发上拉事件，把searchPageNum+1  
        isFromSearch: false //触发到上拉事件，把isFromSearch设为为false  
      });
      that.fetchSearchList(this.data.userid);
    }
  },

  //搜索，访问网络  
  fetchSearchList: function(userid) {
    let that = this;
    let searchPageNum = that.data.searchPageNum, //把第几次加载次数作为参数  
      uid = userid;
    var url = qzone + 'getlist'

    var keys = {
      uid: uid,
      page: searchPageNum
    };
    util.getAj(url, keys, 'get', function(data) {
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
            isshow: data.pageall
          });
        } else {
          that.setData({
            searchSongList: searchList, //获取数据数组,
            isshow: data.pageall
          });
        }
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
      } else {
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示  
          searchLoading: false, //把"上拉加载"的变量设为false，隐藏
          isshow: data.pageall
        });
      }
    })
  },
  //点击搜索按钮，触发事件  
  keywordSearch: function(userid) {
    this.setData({
      searchPageNum: 1, //第一次加载，设置1  
      searchSongList: [], //放置返回数据的数组,设为空  
      isFromSearch: true, //第一次加载，设置true  
      searchLoading: true, //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false //把“没有数据”设为false，隐藏  
    })

    this.fetchSearchList(userid);
  },
  previewImage: function(e) { // 展示图片
    console.log(e)
    this.setData({
      dingseepic: true
    })
    var current = 'https://wx.biergao.vip/uploads/qzone' + e.target.dataset.src;
    if (e.target.dataset.count.length == 1) {
      var count = e.target.dataset.count
    } else {
      var count = e.target.dataset.count.split(",")
    }
    console.log(count);
    wx.previewImage({
      current: current,
      urls: count
    })
  },

  imageLoad: function(e) {
    var width = e.detail.width;
    var height = e.detail.height;
    console.log(e.detail);
    var windowWidth = wx.getSystemInfoSync().windowWidth;
    var picHeight = (height / width) * windowWidth;
    this.setData({
      picHeight: picHeight
    });
  },
  //添加博文
  addqzone: function() {
    if (!wx.getStorageSync('openid') && !wx.getStorageSync('userid')) {
      wx.showToast({
        title: '请先同意授权',
        icon: 'none'
      })
    } else {
      var that = this;
      this.setData({
        show: true,
        dingseepic: false
      })
      wx.navigateTo({
        url: '../addComment/addComment?&uid=' + wx.getStorageSync('uid')
      })
    }
  },
  // 点赞
  bindDianZan: function(e) // 处理点赞
  {
    console.log(e);
    if (!wx.getStorageSync('openid') && !wx.getStorageSync('userid')) {
      wx.showToast({
        title: '请先同意授权',
        icon: 'none'
      })
      return false;
    }
    var that = this
    let nickname = wx.getStorageSync('nickname');
    let userId = wx.getStorageSync('userid');
    let dz_id = e.currentTarget.dataset.id;
    let url = qzone + 'setdianzan';
    var keys = {
      userId: userId,
      id: dz_id,
      nickname: nickname
    };
    console.log(that.data.searchSongList[7]['dianzanlist']);
    util.getAj(url, keys, 'GET', function(res) {
      // console.log(res)
      // 循环当前节点找到点赞ID对应的节点
      for (var ii = 0; ii < that.data.searchSongList.length; ii++) {

        if (that.data.searchSongList['' + ii + ''].id == dz_id) {
          // 如果当前数组下dianzanlist为null证明还没有人点赞则直接添加 否则添加当前人昵称+之前人的点赞
          if (that.data.searchSongList['' + ii + '']['dianzanlist'] == false) {
            that.data.searchSongList['' + ii + '']['dianzanlist'] = nickname;
            that.data.searchSongList['' + ii + '']['dianzan'] = true;
          } else {
            that.data.searchSongList['' + ii + '']['dianzanlist'] = nickname + "," + that.data.searchSongList['' + ii + '']['dianzanlist']
            that.data.searchSongList['' + ii + '']['dianzan'] = true;
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
  onShareAppMessage: function() {
    return {
      title: "比尔高身高管理",
      desc: "曾经和你一样高的人更懂你",
      path: `pages/qzone/qzone`
    }
  }
})
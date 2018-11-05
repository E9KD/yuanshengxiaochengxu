// pages/vip/setvip.js
const API_KECENG = 'https://wx.biergao.vip/api/';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    that.setData({
      openid: openid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },


  /**
   * 用户兑换vip提交 
   */
  setVipToUser: function (e) {
    var number = e.detail.value.number;
    if (number == false){
      wx.showToast({
        title: '请先输入兑换码',
        icon: 'none'
      });
      return false;
    }
    
    var str = 'abcdefghigklmnopqrstuvwxyz';

    var token = Math.floor(Math.random() * 1000) + str[Math.floor(Math.random() * 25)] + this.data.openid + number + str[Math.floor(Math.random()*25)];

    wx.request({
      url: API_KECENG + 'vip/getvip',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        'token': token
      },
      success: function (res) {
        console.log(res);
        if(res.data.res == 'success'){
          wx.showToast({
            title: res.data.message,
            icon: 'success'
          });
          setTimeout(function () {
            wx.navigateTo({
              url: 'vip',
            })
          }, 2000);
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          });
        }
        
      },
      error: function (){
        wx.showToast({
          title: '兑换失败',
          icon: 'error'
        });
      }
    });
  }
  
})
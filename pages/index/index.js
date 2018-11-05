var app = getApp();
var util = require('../../utils/util.js');
let API_INDEX = 'https://wx.biergao.vip/api/index/',
  local = 'https://wx.biergao.vip/api/';
Page({
  data: {
    movies: 0,
    sid: false,
    menuList: {}, //菜单集合
    radar: 5,
    radarpingjia: false,
    radardaka: false,
    radarpingjiatype: false,
    redardakatype: false,
    isLoad: true,
    cfBg: false,
    showMessage: false,
    messageContent: '',
    userInfo: false,
    isyingyang: false,
    openbuka: 200,
    yydkpfjl: false
  },
  inputValue: '',
  // 曲线
  heightguanli: function() {
    var that = this;
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    var guanli = local + 'child/isChild';
    var keys = {
      openid: openid
    };
    var sid = that.data.sid;

    if (openid == null || openid == 'undefined' || !openid) {
      if (sid != false || sid != 0) {
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
      util.getAj(guanli, keys, 'POST', function(data) {
        if (data.result == 'error') {
          if (sid != false || sid != 0) {
            wx.redirectTo({
              url: '../logs/index?sid=' + sid,
            })
          } else {
            wx.redirectTo({
              url: '../logs/index',
            })
          }
          return false;
        } else if (data.info == 'false' || data.info == false) {
          if (sid != false || sid != 0) {
            wx.redirectTo({
              url: '/pages/login/login?sid=' + sid,
            })
          } else {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          }
        } else if (data.result == 'true') {
          wx.navigateTo({
            url: '/pages/charts/add',
          })
        } else {
          wx.navigateTo({
            url: '/pages/child/add',
          })
        }
      })
    }
  },
  // 身高预测
  heightguanli2: function() {
    var that = this;
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    var guanli2 = local + 'child/issetChild';
    var keys = {
      openid: openid
    };
    var sid = that.data.sid;
    if (openid == null || openid == 'undefined' || !openid) {
      if (sid != false || sid != 0) {
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
      util.getAj(guanli2, keys, 'GET', function(data) {
        if (data.result == 'error') {
          if (sid != false || sid != 0) {
            wx.redirectTo({
              url: '../logs/index?sid=' + sid,
            })
          } else {
            wx.redirectTo({
              url: '../logs/index',
            })
          }
          return false;
        } else if (data.info == 'false' || data.info == false) {
          if (sid != false || sid != 0) {
            wx.redirectTo({
              url: '/pages/login/login?sid=' + sid,
            })
          } else {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          }
        } else if (data.id) {
          var time = new Date(data.createtime * 1000);
          var y = time.getFullYear(); //年
          var m = time.getMonth() + 1; //月
          wx.navigateTo({
            url: '../ces/add?id=no&cid=' + data.id + '&m=' + m + '&y=' + y,
          })
        } else {
          wx.navigateTo({
            url: '/pages/child/add',
          })
        }
      })
    }
  },
  // 打卡问卷
  wenjuan: function() {
    var that = this;
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    var wenjuan = local + 'child/isChild';
    var keys = {
      openid: openid
    };
    var sid = that.data.sid;
    var uid = openid;
    if (openid == null || openid == 'undefined' || !openid) {
      if (sid != false || sid != 0) {
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
      util.getAj(wenjuan, keys, 'POST', function(data) {
        if (data.result == 'error') {
          if (sid != false || sid != 0) {
            wx.redirectTo({
              url: '/pages/login/login?sid=' + sid,
            })
          } else {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          }
          return false;
        } else if (data.info == 'false' || data.info == false) {
          if (sid != false || sid != 0) {
            wx.redirectTo({
              url: '/pages/login/login?sid=' + sid,
            })
          } else {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          }
        } else if (data.result == 'true') {
          wx.navigateTo({
            url: '/pages/wenjuan/wenjuan?uid=' + uid,
          })
        } else {
          wx.navigateTo({
            url: '/pages/child/add',
          })
        }
      })
    }
  },
  // 一对一
  team: function() {
    var that = this;
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    var wenjuan = local + 'child/isChild';
    var keys = {
      openid: openid
    };
    var sid = that.data.sid;
    var uid = openid;
    if (openid == null || openid == 'undefined' || !openid) {
      if (sid != false || sid != 0) {
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
      var sid = that.data.sid;
      if (sid != false || sid != 0) {
        wx.switchTab({
          url: '/pages/team/team?sid=' + sid,
        })
      } else {
        wx.switchTab({
          url: '/pages/team/team?sid=' + sid,
        })
      }
    }
  },
  onLoad: function(options) {
    // 扫描二维码获取的数据
    var that = this;
    //var sc = { "scene": "page%3D01%26sid%3D8" };
    if (options.scene !== undefined) {
      var scene = decodeURIComponent(options.scene);
      var arrPara = scene.split("&");
      var arr = [];
      var testData = {};
      for (var i in arrPara) {
        arr = arrPara[i].split("=");
        if (i == 0) {
          testData.page = arr[1];
        } else {
          testData.sid = arr[1]
        }
      }
      that.setData({
        sid: testData.sid
      })
    } else {
      that.setData({
        sid: 0
      })
    }
  },
  // nutrition
  nutrition: function() {
    wx.navigateTo({
      url: '../nutrition/nutrition',
    })
  },
  anniu: function(e) {
    var that = this;
    var id = e.currentTarget.id;
    if (id == that.data.radar) {
      that.setData({
        radar: 5
      })
    } else {
      switch (id) {
        case '0':
          that.setData({
            radar: 0,
            radarpingjia: 0,
            radardaka: 0,
          })
          break;
        case '1':
          that.setData({
            radar: 1,
            radarpingjia: 1,
            radardaka: 1,
          })
          break;
        case '2':
          that.setData({
            radar: 2,
            radarpingjia: 2,
            radardaka: 2,
          })
          break;
        case '3':
          that.setData({
            radar: 3,
            radarpingjia: 3,
            radardaka: 3,
          })
          break;
        case '4':
          that.setData({
            radar: 4,
            radarpingjia: 4,
            radardaka: 4,
          })
          break;
        default:
          that.setData({
            radar: 5,
            radarpingjia: false,
            radardaka: false,
          })
      }
    }
  },
  onReady: function(e) {

  },
  //评价
  pingjia: function(e) {
    var that = this;
    var id = e.currentTarget.id; //radarpingjia type
    console.log(id);
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    var sid = that.data.sid;
    var userInfo = that.data.userInfo;
    var uid = openid;
    that.setData({
      radarpingjiatype: true,
      redardakatype: false,
    })
    var url = 'https://wx.biergao.vip/api/Yypfjl/getlist';
    if (openid == null || openid == 'undefined' || !openid) {
      if (sid != false || sid != 0) {
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
      if (userInfo == false) {
        app.getUserInfo(function(personInfo) {
          var keys = {
            userid: personInfo.userid,
            pid: id
          };
          //qingqiu
          util.getAj(url, keys, 'GET', function(data) {

            if (data.status == 500) {
              that.setData({
                isyingyang: false,
                isLoad: false,
                cfBg: !that.data.cfBg,
                radarpingjia: id,
                userInfo: personInfo
              })
            } else {
              that.setData({
                isyingyang: true,
                isLoad: false,
                cfBg: !that.data.cfBg,
                radarpingjia: id,
                userInfo: personInfo
              })
            }

          })
        })
      } else {
        if (that.data.userInfo.userid == false || that.data.userInfo.userid == 'false') {
          if (sid != false || sid != 0) {
            wx.redirectTo({
              url: '/pages/login/login?sid=' + sid,
            })
          } else {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          }
          return false;
        } else {
          var keys = {
            userid: that.data.userInfo.userid,
            pid: id
          };
          util.getAj(url, keys, 'GET', function(data) {

            if (data.status == 500) {
              that.setData({
                isyingyang: false,
                isLoad: false,
                cfBg: !that.data.cfBg,
                radarpingjia: id,
              })
            } else {
              that.setData({
                isyingyang: true,
                isLoad: false,
                cfBg: !that.data.cfBg,
                radarpingjia: id,
              })
            }

          })
        }

      }
    }

  },
  // 打卡
  daka: function(e) {
    var that = this;
    var id = e.currentTarget.id;
    if (id != 0) {
      that.showMessage('暂未开启,敬请期待');
      return;
    }
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    var sid = that.data.sid;
    var userInfo = that.data.userInfo;
    var uid = openid;
    that.setData({
      radarpingjiatype: false,
      redardakatype: true,
    })
    if (openid == null || openid == 'undefined' || !openid) {
      if (sid != false || sid != 0) {
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
      if (userInfo == false) {
        app.getUserInfo(function(personInfo) {
          var url = 'https://wx.biergao.vip/api/Yybg/getisbuka';
          var keys = {
            uid: personInfo.userid
          };
          util.getAj(url, keys, 'POST', function(data) {
            console.log(data)
            if (data.status == 201) {
              that.setData({

                isLoad: false,
                cfBg: !that.data.cfBg,
                radardaka: id,
                sday: data.sday,
                yydkpfjl: data.yydkpfjl,
                openbuka: 201,
              })
            } else if (data.status == 202) {
              that.setData({

                isLoad: false,
                cfBg: !that.data.cfBg,
                radardaka: id,
                sday: data.sday,
                yydkpfjl: data.yydkpfjl,
                openbuka: 202,
              })
            } else {
              that.setData({

                isLoad: false,
                cfBg: !that.data.cfBg,
                radardaka: id,
                sday: data.sday,
                yydkpfjl: data.yydkpfjl,
                openbuka: 200,
              })
            }

          })
        })
      } else {
        var url = 'https://wx.biergao.vip/api/Yybg/getisbuka';
        if (that.data.userInfo.userid == false || that.data.userInfo.userid == 'false') {
          if (sid != false || sid != 0) {
            wx.redirectTo({
              url: '/pages/login/login?sid=' + sid,
            })
          } else {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          }
          return false;
        } else {
          var keys = {
            uid: that.data.userInfo.userid
          };
          util.getAj(url, keys, 'POST', function(data) {
            console.log(data)
            if (data.status == 201) {
              that.setData({

                isLoad: false,
                cfBg: !that.data.cfBg,
                radardaka: id,
                sday: data.sday,
                yydkpfjl: data.yydkpfjl,
                openbuka: 201,
              })
            } else if (data.status == 202) {
              that.setData({

                isLoad: false,
                cfBg: !that.data.cfBg,
                radardaka: id,
                sday: data.sday,
                yydkpfjl: data.yydkpfjl,
                openbuka: 202,
              })
            } else {
              that.setData({

                isLoad: false,
                cfBg: !that.data.cfBg,
                radardaka: id,
                sday: data.sday,
                yydkpfjl: data.yydkpfjl,
                openbuka: 200,
              })
            }

          })
        }

      }
    }

  },
  openNext: function() {
    var that = this;
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    var wenjuan = local + 'child/isChild';
    var sur = local + 'Survey/getSurvey';
    var keys = {
      openid: openid
    };
    var sid = that.data.sid;
    var uid = openid;
    if (openid == null || openid == 'undefined' || !openid) {
      if (sid != false || sid != 0) {
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
      util.getAj(wenjuan, keys, 'POST', function(data) {
        if (data.result == 'error') {
          if (sid != false || sid != 0) {
            wx.redirectTo({
              url: '/pages/login/login?sid=' + sid,
            })
          } else {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          }
          return false;
        } else if (data.info == 'false' || data.info == false) {
          if (sid != false || sid != 0) {
            wx.redirectTo({
              url: '/pages/login/login?sid=' + sid,
            })
          } else {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          }
        } else if (data.result == 'true') {
          var res = {
            uid: that.data.userInfo.userid
          }
          util.getAj(sur, res, 'POST', function(data) {
            if (data.status == 500) {
              wx.navigateTo({
                url: '/pages/survey/survey',
              })
            } else {
              wx.redirectTo({
                url: '../childsurvey/childsurvey?svid=' + data.id,
              })
            }
          });
          wx.navigateTo({
            url: '/pages/survey/survey',
          })
        } else {
          wx.navigateTo({
            url: '/pages/child/add',
          })
        }

      })
    }
  },
  cemojiCfBg: function() {
    this.setData({
      cfBg: false,
      radarpingjiatype: false,
      redardakatype: false,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.cemojiCfBg();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.cemojiCfBg();
  },
  onShow: function(options) {

    var self = this;
    var openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : app.globalData.openid;
    var sid = self.data.sid;
    var uid = openid;
    if (openid == null || openid == 'undefined' || !openid) {
      if (sid != false || sid != 0) {
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
      app.menuConfig = {
        menu: [{
            'index': 0,
            'menu': '营养',
            'src': '../../image/icon16.png'
          },
          {
            'index': 1,
            'menu': '情绪',
            'src': '../../image/icon19.png'
          },
          {
            'index': 2,
            'menu': '内分泌',
            'src': '../../image/icon20.png'
          },
          {
            'index': 3,
            'menu': '睡眠',
            'src': '../../image/icon17.png'
          },
          {
            'index': 4,
            'menu': '运动',
            'src': '../../image/icon18.png'
          }
        ]
      }
      // 绘制转盘
      var menuConfig = app.menuConfig.menu,
        len = menuConfig.length,
        menuList = [],
        degNum = 360 / len // 文字旋转 turn 值
      for (var i = 0; i < len; i++) {
        menuList.push({
          deg: i * degNum,
          menu: menuConfig[i].menu,
          src: menuConfig[i].src,
          index: menuConfig[i].index
        });
        // console.log("menu:" + menuConfig[i].menu)
      }
      util.getarrimg(function(data) {
        self.setData({
          movies: data['banner'],
          menuList: menuList
        })
      })
      app.getUserInfo(function(personInfo) {
        self.setData({
          userInfo: personInfo,
          openid: openid,
        })
      })
    }
  },
  //开始答题跳转按钮
  ystar: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.typeid;
    wx.navigateTo({
      url: '../shanshi/shanshi?typeid=' + id,
    })
  },
  // 去打卡
  godaka: function(e) {
    var that = this;
    var goid = this.data.openbuka;//e.currentTarget.dataset.typeid;
    console.log(e);
    var id = that.data.radardaka;
    var sday = that.data.sday;
    if (id == 0) {
      if (goid == 200) {
        wx.navigateTo({
          url: '../ydaka/ydaka?id=0&sday=' + sday,
        })
      } else {
        wx.navigateTo({
          url: '../ydaka/ydaka?id=1&sday=' + sday,
        })
      }
    } else {
      that.showMessage('暂未开启,敬请期待');
    }
  },
  // godaka: function(e) {
  //   var that = this;
  //   var goid = e.currentTarget.dataset.typeid;
  //   console.log(e);
  //   var id = that.data.radardaka;
  //   var sday = that.data.sday;
  //   if (id == 0) {
  //     if (goid == 0) {
  //       wx.navigateTo({
  //         url: '../ydaka/ydaka?id=0&sday=' + sday,
  //       })
  //     } else {
  //       wx.navigateTo({
  //         url: '../ydaka/ydaka?id=1&sday=' + sday,
  //       })
  //     }
  //   } else {
  //     that.showMessage('暂未开启,敬请期待');
  //   }
  // },
  yingyanglist: function(e) {
    var that = this;
    var id = that.data.userInfo.userid;
    var typeid = that.data.radarpingjia;
    switch (typeid) {
      case '0':
        wx.navigateTo({
          url: '../yingyanglist/yingyanglist?type=0&id=' + id + '&typename=0',
        })
        break;
      case '1':
        wx.navigateTo({
          url: '../yingyanglist/yingyanglist?type=1&id=' + id + '&typename=1',
        })
        break;
      case '2':
        wx.navigateTo({
          url: '../yingyanglist/yingyanglist?type=2&id=' + id + '&typename=2',
        })
        break;
      case '3':
        wx.navigateTo({
          url: '../yingyanglist/yingyanglist?type=3&id=' + id + '&typename=3',
        })
        break;
      default:
        wx.navigateTo({
          url: '../yingyanglist/yingyanglist?type=4&id=' + id + '&typename=4',
        })
        break;
    }
  },
  yydkpfjllist: function(e) {
    var that = this;
    var id = that.data.userInfo.userid;
    var typeid = that.data.radardaka;
    switch (typeid) {
      case '0':
        wx.navigateTo({
          url: '../yingyanglist/yingyanglist?type=0&id=' + id + '&typename=5',
        })
        break;
      case '1':
        wx.navigateTo({
          url: '../yingyanglist/yingyanglist?type=1&id=' + id + '&typename=6',
        })
        break;
      case '2':
        wx.navigateTo({
          url: '../yingyanglist/yingyanglist?type=2&id=' + id + '&typename=7',
        })
        break;
      case '3':
        wx.navigateTo({
          url: '../yingyanglist/yingyanglist?type=3&id=' + id + '&typename=8',
        })
        break;
      default:
        wx.navigateTo({
          url: '../yingyanglist/yingyanglist?type=4&id=' + id + '&typename=9',
        })
        break;
    }
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
  },
  onShareAppMessage: function() {
    return {
      title: "比尔高身高管理",
      desc: "曾经和你一样高的人更懂你",
      path: `pages/index/index`
    }
  }
})
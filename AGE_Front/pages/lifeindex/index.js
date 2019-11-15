var app = getApp();
Page({
  data: {},
  onLoad: function (options) {//程序启动时执行 onLoad 
  wx.setNavigationBarTitle({//设置标题
    title: '生活指数'
    })
let lifeindex = wx.getStorageSync('life');
this.setData({//渲染到 wxml
  lifeindex: lifeindex
})
},
/**
* 用户点击右上角分享 */
onShareAppMessage: function () { }
})
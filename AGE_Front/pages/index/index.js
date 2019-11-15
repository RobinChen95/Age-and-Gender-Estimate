//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    tempFilePaths:""
  },
  //onload函数
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '性别与年龄识别',
    })
    var that = this
    that.getLocation();
  },
  selectPhoto:function(){
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#39C5BB",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function (type) {
    var that = this;
    var id = '001';
    var url = "https://www.robinchen95.com/upload";
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        that.setData({
          tempFilePaths:res.tempFilePaths,
          age: "请稍候（>﹏<）",
          gender: "正在提交服务器判断",

        }) 
        //-----上传图片-----
        wx.uploadFile({
          url: url,
          filePath: res.tempFilePaths[0],
          name: 'file',
          success: function (res) {
            //打印
            console.log(res.data);
            if (res.data=="-1"){
              that.setData({
                age:  " 请提交人脸图片！",
                gender:  "请不要恶作剧！（╯‵□′）╯︵┴─┴",
              })
            } 
            else{
              that.setData({
                age: "经AI推测，您的年龄是：" + res.data.split(':')[1].split(',')[0],
                gender: "经AI推测，您的性别是：" + res.data.split('"')[5], 
              })
            }
          }
        })
        //-----上传图片-----
      var imgPath = res.tempFilePaths[0];
      that.setData({
        pic3:imgPath,
      })
      }
      
      //-----以上为上传图片成功-----
    })
  },
  getLocation: function() {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.getCity(latitude,longitude);
      }
    })
  },
  getCity: function(latitude,longitude){
    var that = this
    var url = "https://api.map.baidu.com/geocoder/v2/"
    var params = {
      ak: "quZ5tcnmtRlt8o7p4ADSvKSrUE24XNDF",
      output: "json",
      location:latitude+","+longitude
    }
    wx.request({
      url: url,
      data:params,
      success: function(res){
        var city = res.data.result.addressComponent.city;
        var district = res.data.result.addressComponent.district;
        that.setData({
          city:city,
          district:district,
        })
        var desCity = city.substring(0,city.length-1);
        that.getWeather(desCity);
      },
      fail:function(res){},
      complete:function(res){},
    })
  },
  getWeather:function(city){
    var that = this
    var url = "https://api.map.baidu.com/telematics/v3/weather"
    var params = {
      location:city,
      output:"json",
      ak: "quZ5tcnmtRlt8o7p4ADSvKSrUE24XNDF"
    }
    wx.request({
      url: url,
      data:params,
      success:function(res){
        console.log(res);
        var weather = res.data.results[0].weather_data[0].weather;//天气情况
        var date = res.data.date;//当天日期
        var curdata = res.data.results[0].weather_data[0].date;//实时日期温度
        var curdate = curdata.substring(0, curdata.indexOf('('));//从实时日期温度取出日期
        var curtmp = curdata.substring(curdata.indexOf(': ') + 1, curdata.length - 1)//取出温度
        var pic1 = res.data.results[0].weather_data[0].dayPictureUrl;
        var pic2 = res.data.results[0].weather_data[0].nightPictureUrl;
        var cast = res.data.results[0].weather_data;//近几天天气预报
        var forecast = cast.slice(1, cast.length);//近几天天气预报过滤掉今
        that.setData({//渲染到 wxml 页面 
          date: date,
          weather: weather,
          curdata: curdata,
          curtmp: curtmp,
          curdate: curdate,
          pic1: pic1,//变量 pic 内存储的是图片 url 
          pic2: pic2,
          forecast: forecast
        })
        //将变量存到临时数据存储器中
        wx.setStorage({
          key: 'life',//标签名 
        })
      },
      fail:function(res){},
      complete:function(res){},
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
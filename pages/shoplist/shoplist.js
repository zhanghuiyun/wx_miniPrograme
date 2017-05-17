//index.js
//editor:zhanghy
////////////////////////////////////////////////////////////////

//获取应用实例
var app = getApp();

Page({
    data: {
        imgUrls: [  //轮播
          'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
          'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
        ],
        indicatorDots: true,
        autoplay: true,
        interval: 2000,
        duration: 1000,
        school_id : 6636
    },

    onLoad : function(options){
        var _self = this;
        
        _self.data.school_id = 6666;

        // wx.request({
        //     url: 'https://sandboxv2.pynoo.cn/api/schoolMarket/shops', 
        //     data: {
        //         school_id : _self.data.school_id
        //     },
        //     method : 'GET',
        //     dataType : 'json',
        //     success: function(res) {
        //         console.log(res)
        //     }
        // })
    }
})
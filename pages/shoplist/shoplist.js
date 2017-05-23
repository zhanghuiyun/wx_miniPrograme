//index.js
//editor:zhanghy
////////////////////////////////////////////////////////////////

//获取应用实例
var app = getApp();

Page({
    data: {
        swiper : {                  //轮播参数
            imgUrls: [
                'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
                'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
                'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
            ],            //轮播
            indicatorDots: true,    //是否显示点
            autoplay: true,         //自动播放
            interval: 2000,      
            duration: 1000,
        },
        school_id : 6636
    },

    selectSchool : function(event){    //选择学校
        
    },

    onLoad : function(options){
        var _self = this;

        var options = _self.data,         //data_option
            swiper = options.swiper,      //轮播参数
            imgUrls = swiper.imgUrls;     //轮播数组

        // wx.request({
        //     url: '', 
        //     data: {
        //         school_id : _self.data.school_id
        //     },
        //     method : 'GET',
        //     dataType : 'json',
        //     success: function(res) {
        //         var data = res.data;
                
        //     }
        // })
    }
})
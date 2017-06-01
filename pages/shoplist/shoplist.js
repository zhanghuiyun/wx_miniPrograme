//index.js
//editor:zhanghy
////////////////////////////////////////////////////////////////

//获取应用实例
var app = getApp();
var imageUtil = require('../../utils/util.js'); 

Page({
    data: { 
        heights : "0px",                    //屏幕的高度
        swiper : {                          //轮播参数
            ads: [
                // 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
                // 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
                // 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
            ],                              //轮播
            indicatorDots: true,            //是否显示点
            autoplay: true,                 //自动播放
            interval: 2000,      
            duration: 1000,
            swiperHeight : 0                //轮播高度
        },
        has_ads : true,                     //是否含有广告
        school_id : 0,                      //学校id
        shops : [],                         //请求回来的店铺信息
        is_noData : true,                   //是否有店铺
        school_name : "",                   //学校名称
        schoolSelect : "bottom",            //选择学校显示的位置,top代表没有轮播的时候显示在顶部，bottom代表有轮播的时候显示在轮播上面
        error : {
            is_error : false,               //是否报错
            errorContent : "ddd"            //错误提示内容
        },
        uu_Sever : app.sever.uu_Sever
    },

    selectSchool : function(event){        //选择学校
        var _school_id = this.data.school_id;
        wx.redirectTo({
            url: '../selectProv/selectProv?school_id='+_school_id+''
        });
    },

    goShop : function(event){                //跳转至校内购店铺首页
        var target = event.currentTarget.dataset,   //获取当前点击事件中的data属性上的值
            shop_id = target.shopid;

        // 循环缓存项
        let res = wx.getStorageInfoSync(),
            keys = res.keys;

        for(let k = 0 , m = keys.length ; k < m ; k++){
            if (keys[k].indexOf('-') > 0) {
                wx.removeStorageSync(keys[k]);
            }
        }

        // 将school_id 存在缓存中
        wx.setStorage({
            key : "LocationSchool",
            data : {"school_id" : this.data.school_id}
        })

        wx.redirectTo({
            url: '../market/market?school_id='+this.data.school_id+'&shop_id='+shop_id+''
        });
    },

    onLoad : function(option){
        var _self = this,
            storeSchool = "0";

        // 页面基础高度设置
        wx.getSystemInfo({
            success: function(res) {
                var swiper = _self.data.swiper;
                swiper.swiperHeight = res.windowWidth * (3/8);

                _self.setData({
                    heights : ""+res.windowHeight - 45+"px",
                    swiper : swiper
                })
            }
        })

        // 判断链接上是否含有参数school_id
        if (option.school_id) {

            _self.data.school_id = option.school_id;

            _self.getShop(_self.data.school_id);
            
        }else{
            // 缓存中是否含有学校id
            // 获取当前存在缓存中的school_id
            wx.getStorage({
                key: 'LocationSchool',
                success: function(res) {
                    storeSchool = res.data.school_id;
                    if (storeSchool) {
                        _self.data.school_id = storeSchool;
                        _self.getShop(storeSchool);
                    }
                } 
            })
        }
    },

    getShop : function(school_id){           //获取店铺列表的请求
        var _self = this;
        // 将school_id 存在缓存中
        wx.setStorage({
            key : "LocationSchool",
            data : {"school_id" : school_id}
        })
        var options = _self.data,          //data_option
            swiper = options.swiper,       //轮播参数
            ads = swiper.ads;              //轮播数组

        //请求该学校下的店铺列表
        wx.request({
            url: ''+_self.data.uu_Sever+'/api/schoolMarket/shops', 
            data: {
                school_id : school_id
            },
            method : 'GET',
            dataType : 'json',
            success: function(res) {
                var res = res.data;

                if (res.error === false) {

                    var data = res.data;

                    // 轮播对象参数中，广告数量
                    var swiper = _self.data.swiper;

                    // 是否有广告
                    if (data.ads) {
                        swiper.ads = data.ads;
                        _self.setData({
                            has_ads : false,
                            schoolSelect : 'bottom'
                        })
                    }else{
                        _self.setData({
                            has_ads : true,
                            schoolSelect : 'top'
                        })
                    }
                        
                    // 初始化店铺列表
                    _self.setData({  
                        swiper : swiper,
                        shops : data.shops ? data.shops : [],
                        school_name : data.school_name
                    })

                    if (!data.ads && !data.shops) {
                        _self.setData({  
                            is_noData : false
                        })
                    }

                }else{

                    //错误提示
                    var error = _self.data.error;

                        error.is_error = true;
                        error.errorContent = data.detail;
                    _self.setData({
                        error : error
                    });

                    //1.5s以后关闭提示框
                    setTimeout(function(){
                        error.is_error = false;
                        error.errorContent = "";
                        _self.setData({
                            error : error
                        });
                    },1500)

                }
            }
            
        })
    }
})
var app = getApp();
Page({
    data: {
       initStyle : {                             //初始化样式设置参数
    		leftHeight : "0px"                   //内容块左侧的高度，y轴超出滚动，x轴超出掩藏
    	},
        error : {
            is_error : false,                    //是否报错
            errorContent : ""                    //错误提示内容
        },  
        uu_Sever : app.sever.uu_Sever,           //服务器域名
        citys : [],                              //城市列表
        schools : [],                            //学校列表
        is_noSchool : true,                      //该省份下是否含有学校
        currentItem : '',                        //左侧城市当前活动状态样式
        no_data : true                           //是否有学校
    },

    getSchool : function(event){                        //城市点击，选择该城市下面的学校

        var target = event.currentTarget.dataset,       //获取当前点击事件中的data属性上的值,获取城市id
            city_id = target.cityid,
            _self = this;

        _self.tapBind(city_id);
    },

    tapBind :  function(city_id){                           //城市点击，产生的效果
        var _self = this;

        // 设置左侧侧边栏样式
        _self.setData({
            currentItem : city_id
        })

        // 请求学校
        wx.request({
            url: ''+_self.data.uu_Sever+'/api/common/getSchoolsByCityID',
            method : 'GET',
            dataType : 'json',
            data : {'city_id' : city_id},
            success: function(res) {
                var res = res.data;

                if (res.error === false) {

                    // 每次清缓存，存储的上一次的学校列表
                    _self.setData({
                        schools : [],
                        no_data : true
                    })

                    var data = res.data;

                    if (data) { 

                        // 获取当前城市下的学校列表，暂无数据为无
                        _self.setData({
                            schools : data.schools,
                            no_data : true
                        })

                    }else{
                        
                        // 暂无数据
                        _self.setData({
                            no_data : false
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

                    // 1.5s以后关闭提示框
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
    },

    goShopList : function(event){                       //学校点击，跳转至相应的店铺列表
        var target = event.currentTarget.dataset,       //获取当前点击事件中的data属性上的值,获取学校id
            school_id = target.schoolid,
            _self = this;

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
            data : {"school_id" : school_id}
        })

        // 跳转至店铺列表
        wx.redirectTo({
            url: '../shoplist/shoplist?school_id='+school_id+'',
            fail : function(){
                
            },
            success : function(){
                
            }
        });
    },

    onLoad : function(options){
        var _self = this,
      	    province_id = options.province_id;    //省份id

      	// 页面基础高度设置
      	wx.getSystemInfo({
		  	success: function(res) {
			  	var initStyles = _self.data.initStyle;
			  	initStyles.leftHeight = ''+res.windowHeight+'px';

			  	_self.setData({
		  			initStyle : initStyles
		  		})
		  	}
		})

        // 请求学校
        wx.request({
            url: ''+_self.data.uu_Sever+'/api/common/getCityByID',
            method : 'GET',
            dataType : 'json',
            data : {'province_id' : province_id},
            success: function(res) {
                var res = res.data;
                if (res.error === false) {
                    var data = res.data;

                    if (data) { 

                        _self.setData({
                            citys : data.cities
                        })

                        // 默认第一项点击
                        _self.tapBind(data.cities[0].region_id);
                    }
                    
                }else{

                    //错误提示
                    var error = _self.data.error;
                        error.is_error = true;
                        error.errorContent = data.detail;

                    _self.setData({
                        error : error
                    });

                    // 1.5s以后关闭提示框
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
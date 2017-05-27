var app = getApp();
Page({
    data: {
    	initStyle : {                  //初始化样式设置参数
    		leftHeight : "opx",        //内容块左侧的高度，y轴超出滚动，x轴超出掩藏
        	isShowHeader : false,      //公告是否显示
        	headPadding : "0px"        //公告显示掩藏时候，内容块的padding
    	},
    	shop_id : 54,				   //店铺id
    	school_id : 6636,			   //学校id
    	searchVal : {				   //搜索参数
    		val : "",					//搜索框的val值
    		is_hide : false,			//是否显示搜索提示
    		focus : false				//是否聚焦
    	},
    	error : {
            is_error : false,                   //是否报错
            errorContent : ""                   //错误提示内容
        },	
        uu_Sever : app.sever.uu_Sever,			//服务器域名
        marketInfo : {						//店铺信息
        	notice : '',					//公告
        	is_resting : false,				//是否休息中
        	base_price : 0.00,				//起送价
        	total_price : 0.00,			    //购物车总价
        	cart_num : 0,					//购物车商品总数
        	buy_tip : '选好了'    
        },		
        catetories : [],              //商品分类
        goods : [],						//商品
        is_date : false,				//是否含有商品
        currentItem_cate : '',    			//侧边栏当前点击项
        is_see_notice : true,
        price_sort_dir : 0 ,   //按价格排序，展示的默认还是由高到底还是由低到高
        current_volumen : '0',   //当前排序分类
        goodsDetail : {			//商品详情
        	goods: [
                'http://hyimage.uulian.com/uuhui/20160908/2cec198cc4498ed4442acba08fcb2f63.jpg'
            ],                              //轮播
            indicatorDots: true,            //是否显示点
            autoplay: true,                 //自动播放
            interval: 2000,      
            duration: 1000,
            swiperHeight : 300                //轮播高度
        }
    },

    search : function(event){			//搜索点击
    	var _self = this,
    		searchVal = _self.data.searchVal;

    	searchVal.focus = true;
    	searchVal.is_hide = true;

    	_self.setData({
    		searchVal : searchVal
    	})
    },

    searchBlur : function(){			//搜索失去焦点的时候

    	var _self = this,
    		searchVal = _self.data.searchVal;

    	searchVal.focus = false;

    	if (searchVal.val === "") {
    		searchVal.is_hide = false;
    	}else{
    		searchVal.is_hide = true;
    	}

    	_self.setData({
    		searchVal : searchVal
    	})
    },

    getSearchVal : function(event){          //关联搜索获取的值

    	var _self = this,
    		searchVal = _self.data.searchVal;

    	searchVal.val = event.detail.value;

    	_self.setData({
    		searchVal : searchVal
    	})
    },

    onLoad : function(options){
        var _self = this;

        // 请求店铺信息
		_self.marketInfo();

		_self.getCate();
    },
 
    marketInfo : function(){     //获取店铺信息
    	var _self = this;  

    	wx.request({
		  	url: ''+_self.data.uu_Sever+'api/schoolMarket?school_id='+_self.data.school_id+'&shop_id='+_self.data.shop_id+'',
			method : 'GET',
            dataType : 'json',
		  	success: function(res) {
		  		var res = res.data;
		  		if (res) {
		  			if (res.error === false) {
		  				var data = res.data;

			    		var marketInfo = _self.data.marketInfo,
			    			initStyle = _self.data.initStyle;

			    		marketInfo.notice = data.notice;
			    		marketInfo.is_resting = data.is_resting;
			    		marketInfo.base_price = data.base_price;

			    		// 是否有公告，是否显示公告
			    		initStyle.isShowHeader = (data.notice) ? false : true;

			    		_self.setData({
			    			marketInfo : marketInfo,
			    			initStyle : initStyle
			    		})

			    		// 设置相应的高度
			    		_self.systemInfo();

			    		// 设置页脚显示样式
			    		_self.computeBase();

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
		  	}
		})
    },
 	
    systemInfo : function(){    //根据窗口的大小，设置相应的宽高
    	var _self = this;
    	// 页面基础高度设置
      	wx.getSystemInfo({
		  	success: function(res) {
			  	var initStyles = _self.data.initStyle;

			  	// 有公告时候内容块显示高度
			  	if (_self.data.initStyle.isShowHeader === false) {
			  		initStyles.leftHeight = ''+(res.windowHeight - 40 - 48 - 28)+'px';
			  		initStyles.headPadding = "0px";
			  	}else{   //没公告时候内容块显示高度
			  		initStyles.leftHeight = ''+(res.windowHeight - 40 - 48)+'px';
			  		initStyles.headPadding = "40px";
			  	}
			  	_self.setData({
		  			initStyle : initStyles
		  		})
		  	}
		})
    },

    getCate : function(){       //获取分类
    	var _self = this;
    	wx.request({
		  	url: ''+_self.data.uu_Sever+'api/schoolMarket/catetories?school_id='+_self.data.school_id+'&shop_id='+_self.data.shop_id+'',
			method : 'GET',
            dataType : 'json',
		  	success: function(res) {
		  		var res = res.data;
		  		if (res) {
		  			if (res.error === false) {
		  				var data = res.data,
		  					catetories = data.categories;

		  				for(var i = 0 , j = catetories.length ; i <j ; i++){
		  					catetories[i].num = 0;
		  				}	

		  				// 分类
		  				_self.setData({
		  					catetories : catetories
		  				})

		  				// 默认第一项点击
		  				var param = {
				        	category_id : catetories[0].category_id,
				        	keyword : "",
				        	page_index : 0,
				        	page_size : 300
				        }

				        _self.getGoodsRequest(param);


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
		  	}
		})
    },

    getGoods : function(event){    //获取分类下的商品
    	var target = event.currentTarget.dataset,   //获取当前点击事件中的data属性上的值
            category_id = target.cateid,
            _self = this;

        // 获取分类下商品，请求获得商品数组
        var param = {
        	category_id : category_id,
        	keyword : "",
        	page_index : 0,
        	page_size : 300
        }

        _self.getGoodsRequest(param);
    },

    getGoodsRequest : function(param){
    	var _self = this;

    	_self.setData({
    		currentItem_cate : param.category_id
    	})

    	wx.request({
		  	url: ''+_self.data.uu_Sever+'api/schoolMarket/goodsList?school_id='+_self.data.school_id+'&shop_id='+_self.data.shop_id+'',
			method : 'GET',
            dataType : 'json',
            data : param,
		  	success: function(res) {
		  		var res = res.data;
		  		if (res) {
		  			if (res.error === false) {
		  				// 重置数组
		  				_self.setData({
		  					goods : []
		  				})

		  				var data = res.data;
		  				if (data) {
		  					var goods = data.goods;

		  					_self.setData({
			  					goods : goods,
			  					is_date : false
			  				})
		  				}else{   //无数据显示外星人
		  					_self.setData({
		  						is_date : true
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
		  	}
		})
    },

    computeBase : function(){			//计算还差多少钱起送
    	var _self = this,
    		marketInfo = _self.data.marketInfo;

    	var base_price = marketInfo.base_price,
    		total_price = marketInfo.total_price;

    	if (total_price < base_price) {
    		var spread = parseFloat(base_price - total_price).toFixed(2);
    		marketInfo.buy_tip = "还差"+spread+"元起送";
    	}else{
    		marketInfo.buy_tip = '选好了';
    	}

    	_self.setData({
    		marketInfo : marketInfo
    	})
    },

    seeNotice : function(){			//公告查看
    	var _self = this,
    		is_see_notice = _self.data.is_see_notice;

    	_self.setData({
    		is_see_notice : false
    	})
    },

    closeNotice : function(){	//关闭公告
    	var _self = this,
    		is_see_notice = _self.data.is_see_notice;

    	_self.setData({
    		is_see_notice : true
    	})
    },

    sort : function(event){			//分类
    	var target = event.currentTarget.dataset,       //获取当前点击事件中的data属性上的值
            volumen = target.volumen,
            category_id = target.cateid,
            type = target.type,
            _self = this,
            param = {};

        _self.setData({
        	current_volumen : volumen
        })

        // 获取分类下商品，请求获得商品数组
        switch(volumen){
        	case "0" :
        		param = {
		        	category_id : category_id,
		        	keyword : "",
		        	page_index : 0,
		        	page_size : 300
		        }
		        _self.setData({
    				price_sort_dir : 0
    			})
        	break;
        	case "1" :
        		param = {
		        	category_id : category_id,
		        	keyword : "",
		        	page_index : 0,
		        	page_size : 300,
		        	sort_type : 1
		        }
		        _self.setData({
    				price_sort_dir : 0
    			})
        	break;
        	case "2":

        		var current_order;

        		if (type === 0 || type === 1) {
        			current_order = 2;
        		}else if(type === 2){
        			current_order = 1;
        		}

        		_self.setData({
    				price_sort_dir : current_order
    			})

        		param = {
		        	category_id : category_id,
		        	keyword : "",
		        	page_index : 0,
		        	page_size : 300,
		        	sort_type : 2,
		        	order_type : current_order
		        }
        	break;
        }
        

        _self.getGoodsRequest(param);
    }
});



















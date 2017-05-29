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
            is_show : true,			//是否显示商品详情
            indicatorDots: true,            //是否显示点
            autoplay: true,                 //自动播放
            interval: 2000,      
            duration: 1000,
            swiperHeight : 0,                //轮播高度
            title : "",
            description : "",
            buycount : 0,
            sell : "",
            buy : 0,
            index : 0,
            price : 0,
            oringprice : 0,
            cate : "",
            store : 0,
            goods_id : ""
        },
 		buy_num : [],       //已经加入购物车的商品数量
        allGoods : []       //该店铺所有商品
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
        var _self = this,
            school_id = options.school_id,
            shop_id = options.shop_id;

        // _self.setData({
        //     school_id : school_id,
        //     shop_id : shop_id
        // })

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
    	var _self = this,
            goodsDetail = _self.data.goodsDetail;

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

                goodsDetail.swiperHeight = res.windowWidth * 0.8;

			  	_self.setData({
		  			initStyle : initStyles,
                    goodsDetail : goodsDetail
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

                        _self.getAllGood();

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
    		currentItem_cate : param.category_id,
            buy_num : []
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

                        // 更新购物车
                        _self.updateCart();

                        _self.setCateNum();

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
    },

    closeDetail : function(){       //关闭详情
        var _self = this,
            data = _self.data,
            goodsDetail = data.goodsDetail;

        goodsDetail.is_show = true;

        _self.setData({
            goodsDetail : goodsDetail
        })

    },

    getDetil : function(event){    //查看商品详情
        var target = event.currentTarget.dataset,
            sell = target.sell,
            buycount = target.buycount,   
            cate = target.cate,
            goodid = target.goodid,
            stock = target.stock,
            price = target.price,
            oringPrice = target.oringprice,
            description = target.description,
            name = target.name,
            pics = target.pics,
            buy = target.buy,
            index = target.index,
            _self = this,
            data = _self.data,
            goodsDetail = data.goodsDetail;

        // 显示出商品详情蒙版
        goodsDetail.is_show = false;
        goodsDetail.goods = pics;
        goodsDetail.sell = sell;
        goodsDetail.buycount = buycount;
        goodsDetail.description = description;
        goodsDetail.title = name;
        goodsDetail.price = price;
        goodsDetail.oringprice = oringPrice;
        goodsDetail.index = index;
        goodsDetail.cate = cate;
        goodsDetail.store = stock;
        goodsDetail.goods_id = goodid;
        goodsDetail.buy = buy;

        // 只有一张图片的情况下不显示点
        if (pics.length === 0) {
            goodsDetail.indicatorDots = false;
        }

        // 计算轮播的高度
        _self.systemInfo();

        _self.setData({
            goodsDetail : goodsDetail
        })




    },

    decrease : function(event){     //添加购物车数量减少
        var target = event.currentTarget.dataset,
            buy = target.buy,           //购物车中已经存在数量
            buycount = target.buycount,     //限购数量
            cate = target.cate,   //分类id
            good_id = target.goodid,     
            index = target.index,       //商品的索引
            name = target.name,         
            price = target.price,
            stock = target.stock,
            _self = this,
            buy_num = _self.data.buy_num;

        if (buy <= 0) {
            buy = 0;
            buy_num[index] = buy;

            _self.setData({
                buy_num : buy_num
            })

            return;
        }else{
            buy -= 1;
            buy_num[index] = buy;

            _self.setData({
                buy_num : buy_num
            })

            var param = {
                buy : buy,
                buycount : buycount,
                cate : cate,
                good_id : good_id,
                index : index,
                name : name,
                price : price,
                stock : stock
            }
            // 将商品存在本地缓存中
            _self.setStoreage(param);

            // 更新商品数量
            _self.updateCart();

            // 更新分类，商品总数，总价，是否可以进行购买
            _self.setCateNum();
        }
    },

    increase : function(event){		//添加购物车减少
        var target = event.currentTarget.dataset,
            buy = target.buy,           //购物车中已经存在数量
            buycount = target.buycount,     //限购数量
            cate = target.cate,   //分类id
            good_id = target.goodid,     
            index = target.index,       //商品的索引
            name = target.name,         
            price = target.price,
            stock = target.stock,
            _self = this,
            buy_num = _self.data.buy_num;
        if (buy >= buycount) {
            _self.tip('每人最多只能购买'+buycount+'件');
            return;
        }else{

            if (buy >= stock) {
                _self.tip('库存不足');
                return;
            }else{
                buy += 1;
                buy_num[index] = buy;

                _self.setData({
                    buy_num : buy_num
                })

                var param = {
                    buy : buy,
                    buycount : buycount,
                    cate : cate,
                    good_id : good_id,
                    index : index,
                    name : name,
                    price : price,
                    stock : stock
                }
                // 将商品存在本地缓存中
                _self.setStoreage(param);

                // 更新商品数量
                _self.updateCart();

                // 更新分类，商品总数，总价，是否可以进行购买
                _self.setCateNum();
            }

        }     
    },

    setStoreage : function(param){          //添加至购物车，进行存储

        // 没有购买数量
        if (param.buy == 0) {
            wx.removeStorageSync(''+param.cate+'-'+param.good_id+'');
        }else{
            // 将school_id 存在缓存中
            wx.setStorageSync(''+param.cate+'-'+param.good_id+'',param);
        }
    },

    updateCart : function(type){            //更新购物车
        var _self = this,
            data = _self.data,
            goods = data.goods,         //分类下的所有商品
            buy_num = data.buy_num,         //购物车中的商品
            catetories = data.catetories;   //分类

        for(let k = 0 , m = catetories.length ; k < m ; k++){

            // 获取当前存在本地中的商品
            for(let i = 0 , j = goods.length ; i < j ; i++){
                let value = wx.getStorageSync(''+goods[i].category_id+'-'+goods[i].goods_id+'');
                
                if (value) {
                    // 商品数量
                    buy_num[i] = value.buy;

                }else{

                    buy_num[i] = 0;

                }

                _self.setData({
                    buy_num : buy_num
                })
                   
            }
        }
    },

    setCateNum : function(){        //设置分类下商品总数
        var _self = this,
            data = _self.data,
            marketInfo = data.marketInfo,        //店铺信息
            goods = data.allGoods,
            catetories = data.catetories;   //分类

        let cart_num = 0,
            price = 0;

        for(let k = 0 , m = catetories.length ; k < m ; k++){

            let length = 0;

            // 获取当前存在本地中的商品
            for(let i = 0 , j = goods.length ; i < j ; i++){

                // 获取已经加入购物车的商品
                let value = wx.getStorageSync(''+catetories[k].category_id+'-'+goods[i].goods_id+'');

                if (value) {
                    // 判断商品所属分类
                    if (catetories[k].category_id === goods[i].category_id) {
                        length += parseInt(value.buy);

                    }

                    price += parseFloat(parseInt(value.buy)*parseFloat(value.price));

                }
            }


            // 分类下购物车数量
            catetories[k].num = length;

            // 购物车总数
            cart_num += length;

            _self.setData({
                catetories : catetories
            });   

            // 购物车总数赋值
            if ((k + 1) === catetories.length) {
                marketInfo.cart_num = cart_num;
                marketInfo.total_price = price.toFixed(2);
                _self.setData({
                    catetories : catetories,
                    marketInfo : marketInfo
                }) 

                _self.computeBase();
            }   
            
        }
    },

    tip : function(content){    //提示信息
        var _self = this,
            error = _self.data.error;

        error.is_error = true;
        error.errorContent = content;
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
    },

    getAllGood : function(){
        var _self = this,
            data = _self.data,
            allGoods = data.allGoods,
            catetories = data.catetories;   //分类
        let all = [];
        for(let k = 0 , m = catetories.length ; k < m ; k++){
            wx.request({
                url: ''+_self.data.uu_Sever+'api/schoolMarket/goodsList?school_id='+_self.data.school_id+'&shop_id='+_self.data.shop_id+'',
                method : 'GET',
                dataType : 'json',
                data : {
                    category_id : catetories[k].category_id,
                    keyword : "",
                    page_index : 0,
                    page_size : 300
                },
                success: function(res) {
                    var res = res.data;
                    if (res) {
                        if (res.error === false) {
                            let data = res.data;
                            if (data) {

                                let goods = data.goods;
                                all = all.concat(goods);
                                if ((k + 1) == catetories.length){
                                    _self.setData({
                                        allGoods : all
                                    })
                                }
                            }

                        }
                    }
                }
            })
        }        
    }

});



















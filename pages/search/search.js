var app = getApp();
Page({
    data: {
        _height : 0,    //商品列表的高度
        shop_id : 54,
        goods_total : 0,      //商品总数
        page : 0,   //当前的页数
        page_size : 20,   //单页请求商品数
        school_id : 6636,
        keyword : '',       //关键字
        searchVal : {				   //搜索参数
    		val : "",					//搜索框的val值
    		is_hide : false,			//是否显示搜索提示
    		focus : false				//是否聚焦
    	},
    	error : {
            is_error : false,                   //是否报错
            errorContent : ""                   //错误提示内容
        },	
        is_date : false,     //是否有商品
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
        buy_num : {},       //已经加入购物车的商品数量
        allGoods : [],       //该店铺所有商品
        cart : {     //templete中使用的购物车参数
            list : [],
            is_hide : true,
            buy_num : {}
        }   //购物车中的商品项
    },

    return : function(){    //返回上一级
        wx.redirectTo({
            url: '../market/market?shop_id='+this.data.shop_id+'&school_id='+this.data.school_id+'&type=search'
        }) 
    },

    onLoad : function(options){
        var _self = this,
        	data = _self.data,
        	keyword = data.keyword,
        	searchVal = data.searchVal,
            _height = data._height;

       	// _self.setData({
        //     school_id : school_id,
        //     shop_id : shop_id
        // })
        // 

       	// 从链接上获取keyword
       	searchVal.val = options.keyword;
       	searchVal.is_hide = (options.keyword) ? true : false;
       	_self.setData({
       		keyword : options.keyword,
       		searchVal : searchVal
       	})

        // 页面基础高度设置
        wx.getSystemInfo({
            success: function(res) {
                _self.setData({
                    _height : res.windowHeight - 48 - 48
                })
            }
        })

        // 请求店铺信息
		_self.marketInfo();

		_self.getCate();   
    },

    getGoodList : function(param){
    	var _self = this,
            _data = _self.data,
            goodArr = _data.goods;

    	// _self.setData({
        //    buy_num : {}
    	// })
        
    	wx.request({
		  	url: ''+_self.data.uu_Sever+'api/schoolMarket/goodsList?school_id='+_self.data.school_id+'&shop_id='+_self.data.shop_id+'',
			method : 'GET',
            dataType : 'json',
            data : param,
		  	success: function(res) {
		  		var res = res.data;
		  		if (res) {
		  			if (res.error === false) {

		  				var data = res.data;
		  				if (data) {

		  					var goods = data.goods,
                                page = _data.page,
                                total = parseInt(data.total_count);
                            goodArr = goodArr.concat(goods);

		  					_self.setData({
			  					goods : goodArr,
                                page : page+1,
                                goods_total : total + 1
			  				})

		  				}

                        // 没有数据
                        //无数据显示外星人
                        if (goodArr.length === 0) {
                            _self.setData({
                                is_date : false
                            })
                        }else{
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
		  	},
            complete : function(){
                
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

                        _self.getAllGood();

                        let param = {
							keyword : _self.data.keyword,
							page_index : 0,
							page_size : _self.data.page_size,
							order_type : 2,
							sort_type : 1
						}
						
						_self.getGoodList(param);


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

			    		var marketInfo = _self.data.marketInfo;

			    		marketInfo.notice = data.notice;
			    		marketInfo.is_resting = data.is_resting;
			    		marketInfo.base_price = data.base_price;

			    		_self.setData({
			    			marketInfo : marketInfo
			    		})

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

    search : function(event){			//搜索点击
    	var _self = this,
    		searchVal = _self.data.searchVal;

    	searchVal.focus = true;
    	searchVal.is_hide = true;

    	_self.setData({
    		searchVal : searchVal
    	})
    },

    searchNav : function(event){
        let _self = this,
            data = _self.data,
            shop_id = data.shop_id,
            school_id = data.school_id,
            searchVal = data.searchVal,
            search_val = searchVal.val;

        wx.navigateTo({
            url: '../search/search?keyword='+search_val+'&shop_id='+shop_id+'&school_id='+school_id+''
        })  
    },

    searchBlur : function(){			//搜索失去焦点的时候

    	var _self = this,
    		searchVal = _self.data.searchVal;

    	searchVal.focus = false;
    
    	if (searchVal.val) {
    		searchVal.is_hide = true;
    	}else{
    		searchVal.is_hide = false;
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

    searchFocus : function(){   //搜索获取焦点的时候
        var _self = this,
            searchVal = _self.data.searchVal;

        searchVal.focus = true;
        searchVal.is_hide = true;

        _self.setData({
            searchVal : searchVal
        })    
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

    decrease : function(event){     //添加购物车数量减少
        var target = event.currentTarget.dataset,
            buy = target.buy,           //购物车中已经存在数量
            buycount = target.buycount,     //限购数量
            cate = target.cate,   //分类id
            good_id = target.goodid,     
            name = target.name,         
            price = target.price,
            stock = target.stock,
            type = target.from,   //是哪里的加减
            _self = this,
            buy_num = _self.data.buy_num;

        if (buy <= 0) {
            buy = 0;
            buy_num.good_id = buy;

            _self.setData({
                buy_num : buy_num
            })

            return;
        }else{
            buy -= 1;
            buy_num[good_id] = buy;

            _self.setData({
                buy_num : buy_num
            })

            var param = {
                buy : buy,
                buycount : buycount,
                cate : cate,
                good_id : good_id,
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

            if (type === "cart") {
                // 更新购物车数量
                _self.getCartList();
            }
        }
    },

    lower : function(event){
        let _self = this,
            data = _self.data,
            page = data.page,
            page_index = page  * data.page_size;

        let param = {
            keyword : data.keyword,
            page_index : page_index,
            page_size : data.page_size,
            order_type : 2,
            sort_type : 1
        }
        
        _self.getGoodList(param);

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
            type = target.from,   //是哪里的加减
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
                buy_num[good_id] = buy;

                _self.setData({
                    buy_num : buy_num
                })

                var param = {
                    buy : buy,
                    buycount : buycount,
                    cate : cate,
                    good_id : good_id,
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

                if (type === "cart") {
                    // 更新购物车数量
                    _self.getCartList();
                }
                
            }

        }     
    },

    showCart : function(event){    //查看购物车
        var _self = this,
            data = _self.data;

        _self.getCartList();   //获取购物车商品列表

        let cart = data.cart,
            list = cart.list;

        // //购物车是否有商品
        // if (list.length === 0) {
        //     cart.is_hide = true;
        //     _self.tip("购物车还没有商品哦");
        // }else{
        //     cart.is_hide = false;
        // }

        _self.setData({
            cart : cart
        })
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

    getAllGood : function(){
        var _self = this,
            data = _self.data,
            allGoods = data.allGoods,
            catetories = data.catetories;   //分类

        var all = wx.getStorageSync('allGoods');

        _self.setData({
            allGoods : all
        })
    },

    getCartList : function(){   //获取购物车商品列表
        var _self = this,
            data = _self.data,
            goods = data.allGoods,
            cart = data.cart,   
            buy_num = data.buy_num,
            catetories = data.catetories;   //分类

        let _cart = [];  //临时存放购物车中的数组

        for(let k = 0 , m = catetories.length ; k < m ; k++){

            let length = 0;

            // 获取当前存在本地中的商品
            for(let i = 0 , j = goods.length ; i < j ; i++){

                // 获取已经加入购物车的商品
                let value = wx.getStorageSync(''+catetories[k].category_id+'-'+goods[i].goods_id+'');

                if (value) {
                    _cart.push(value);
                }
            }

            // 购物车总数赋值
            if ((k + 1) === catetories.length) {
                cart.list = _cart;
                cart.buy_num = buy_num;

                // 判断购物车中是否还有商品
                if (_cart.length === 0) {
                    _self.tip("购物车中没有商品");
                    cart.is_hide = true;
                }else{
                    cart.is_hide = false;
                }

                _self.setData({
                    cart : cart
                }) 
            }   
            
        }
    },

    updateCart : function(type){            //更新购物车
        var _self = this,
            data = _self.data,
            goods = data.allGoods,         //分类下的所有商品
            buy_num = data.buy_num,         //购物车中的商品
            catetories = data.catetories;   //分类

        for(let k = 0 , m = catetories.length ; k < m ; k++){

            // 获取当前存在本地中的商品
            for(let i = 0 , j = goods.length ; i < j ; i++){
                let value = wx.getStorageSync(''+goods[i].category_id+'-'+goods[i].goods_id+'');
                
                var key = goods[i].goods_id;

                if (value) {
                    // 商品数量
                    buy_num[key] = value.buy;

                }else{

                    buy_num[key] = 0;

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

    clearCart : function(event){   //清楚购物车缓存

        var _self = this,
            data = _self.data,
            goods = data.allGoods,
            cart = data.cart,   
            buy_num = data.buy_num,
            catetories = data.catetories;   //分类

        let _cart = [];  //临时存放购物车中的数组

        wx.showModal({
            title: '清除购物车',
            content: '确定要清除购物车？',
            success: function(res) {
                if (res.confirm) {
                    for(let k = 0 , m = catetories.length ; k < m ; k++){

                        let length = 0;

                        // 获取当前存在本地中的商品
                        for(let i = 0 , j = goods.length ; i < j ; i++){

                            // 获取已经加入购物车的商品
                            let value = wx.getStorageSync(''+catetories[k].category_id+'-'+goods[i].goods_id+'');

                            if (value) {
                                wx.removeStorageSync(''+catetories[k].category_id+'-'+goods[i].goods_id+'');
                            }
                        }

                        // 购物车总数赋值
                        if ((k + 1) === catetories.length) {
                            // 更新商品数量
                            _self.updateCart();

                            // 更新分类，商品总数，总价，是否可以进行购买
                            _self.setCateNum();

                            // 更新购物车数量
                            _self.getCartList();
                        }   
                        
                    }

                } else if (res.cancel) {
                    
                }
            }
        })
    },

    closeMask : function(event){         //关闭购物车外的蒙版
        var _self = this,
            cart = _self.data.cart;

        cart.is_hide = true;

        _self.setData({
            cart : cart
        })
    }

})
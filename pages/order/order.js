var app = getApp(),
    accessToken = require('../../utils/accessToken.js');  

Page({
    data: {
        padding_top : '0px' ,  //textarea样式高度
        padding_left : '0px',
    	selectTime : {   //选择期望时间
    		array: ['选择时间'],
		    index: 0,
		    timeColor : 'rgba(0,0,0,0.38)'
    	},
        total_pay : 0,
    	address : {    //收货地址
    		school_name : '',
    		mobile : '',
    		name : '',
    		addrss : ''
    	},
        goods : [],             //购买的商品
        money_item : [],   //金额项
    	message : '',   //留言
    	shop_id : 54,    //店铺id
    	school_id : 6636,      //学校id
    	payType : {   //支付方式
    		way : 1,    //1表示在线支付，2表示
    		is_show : false,   //是否显示在线支付
            is_overPay : false     //是否显示货到付款
    	},
    	error : {
            is_error : false,                   //是否报错
            errorContent : ""                   //错误提示内容
        },	
        uu_Sever : app.sever.uu_Sever,			//服务器域名
        login : {   //登录信息
            user_id : 1588,
            source : 2,
            username : "18850524539"
        }

    },

    createOrder : function(event){   //提交订单
        let _self = this,
            _data = _self.data,
            payType = _data.payType,
            selectTime = _data.selectTime,
            address = _data.address,
            uu_Sever = _data.uu_Sever,
            message = _data.message,
            param = {},
            goods = _data.goods,
            school_id = _data.school_id,
            shop_id = _data.shop_id,
            login = _data.login;

        if (address.mobile && address.name && address.addrss) {
            var reg = /^1\d{10}$/;

            if (!(reg.test(address.mobile))){
                _self.tip('请输入格式正确的手机号');
            }else{
                param.buyer_info = {
                    address : address.addrss,
                    mobile : address.mobile,
                    name : address.name
                }
                param.goods = goods;

                param.pay_type = payType.way;

                let hope_time = selectTime.array[selectTime.index],
                    hope_time_timestamp = 0;

                if (hope_time === "选择时间") {
                    hope_time_timestamp = 0;
                }else{
                    var myDate = new Date();
                    var year = myDate.getFullYear();
                    var month = myDate.getMonth() + 1;
                    var day = myDate.getDate();
        
                    if (month < 10) month = "0" + month;
                    if (date < 10) date = "0" + date;

                    var date = ""+year+"-"+month+"-"+day+" "+hope_time+":00",
                        _timestamp = Date.parse(new Date(date));

                    hope_time_timestamp = _timestamp / 1000;
                }

                param.hope_time = hope_time_timestamp;

                param.remark = message;

                param.school_id = school_id;

                param.shop_id = shop_id;

                // 时间撮
                let timestamp = parseInt(new Date().getTime()/1000);

                // 授权
                accessToken.getAccessToken(uu_Sever,'api/order/schoolMarket',login.user_id,'POST',param,_self.orderPay,timestamp,login.username,login.source);
            }
        }else{
            _self.tip('请输入完整的收货信息');
        }
    },

    orderPay : function(res){
        var _self = this;
        if (res.error === false) {

        }else{
            _self.tip(res.detail);
        }
    },

    bindPickerChange: function(e) {    //选择期望时间
    	
    	var selectTime = this.data.selectTime;

    	if (e.detail.value === 0) {
    		selectTime.timeColor = "rgba(0,0,0,0.38)";
    	}else{
    		selectTime.timeColor = "rgba(0,0,0,0.87)";
    	}
    	selectTime.index = e.detail.value;

	    this.setData({
	      	selectTime : selectTime
	    })
	},

    getShopInfo : function(){   //支付方式
        let _self = this,
            _data = _self.data,
            payType = _data.payType,
            school_id = _data.school_id,
            shop_id = _data.shop_id;

        wx.request({
            url: ''+_data.uu_Sever+'api/schoolMarket?school_id='+school_id+'&shop_id='+shop_id+'',
            method : 'GET',
            dataType : 'json',
            success: function(res) {
                res = res.data;
                if (res) {
                    if (res.error === false) {
                        let data = res.data,
                            pay_type = data.paytype,
                            overpay = data.overpay;

                         // 是否可以在线支付
                        payType.is_show = (pay_type == '0') ? true : false;
                        // 是否可以货到付款
                        payType.is_overPay = (overpay == '0') ? true : false;

                        _self.setData({
                            payType : payType
                        })

                    }else{
                        _self.tip(res.detail);
                    }
                }
            }
        })
    },

    onLoad : function(options){    
        let _self = this,
        	data = _self.data,
        	shop_id = options.shop_id,
        	school_id = options.school_id,
        	address = data.address,
            _address = wx.getStorageSync('address');   // 判断之前是否已经有下过单，是否有对收货地址进行存储过
      	
        // 是否之前就有对收货地址进行存储过
      	if (_address) {
      		address.mobile = _address.mobile;
      		address.name = _address.name;
      		address.addrss = _address.addrss;
      	}

      	_self.setData({
      		address : address
      	})

        _self.getShopInfo();  //支付方式

        _self.setPadding();   //ios与安卓textarea兼容性处理

        _self.getOrderPre();   //获取订单预览信息

        _self.selectTime();    //选择期望时间
    },

    setPadding : function(){   //ios与安卓textarea兼容性处理
        let _self = this,
            padding_top = _self.data.padding_top,
            res = wx.getSystemInfoSync();

        if (res.system.indexOf('iOS') > -1) {
            _self.setData({
                padding_top : '3px',
                padding_left : '0px'
            })
        }else{
            _self.setData({
                padding_top : '12px',
                padding_left : '3px'
            })
        }
    },

    selectTime : function(){
        let _self = this,
            _data = _self.data,
            selectTime = _data.selectTime,
            array = selectTime.array,
            myDate = new Date(),
            minutes = myDate.getMinutes(),
            hour = myDate.getHours(),
            formatTime = minutes,
            hours = hour;

        formatTime = (Math.round(formatTime/10))*10;

        for (let i = 0; i < 20; i++) {

            formatTime = parseInt(formatTime) + 20;

            if (formatTime >=60) {
                hours = hours + 1;
                formatTime = formatTime - 60;
            }

            if(parseInt(formatTime) < 10){
                formatTime = "0" + formatTime;
            }

            array.push(''+hours+':'+formatTime+'');
        }

        selectTime.array = array;
        _self.setData({
            selectTime : selectTime
        })
    },

    getOrderPre : function(){			//获取订单详情，授权
        let _self = this,
            _data = _self.data,
            school_id = _data.school_id,
            shop_id = _data.shop_id,        
            login = _data.login,            //登录信息
            payType = _data.payType,   //支付方式
            uu_Sever = _data.uu_Sever,          //服务器域名
            selectTime = _data.selectTime,    //期望时间
            message = _data.message,   //留言
            goodArr = [],
            param = {}, 
            res = wx.getStorageInfoSync();   //缓存信息

        param.school_id = school_id;
        param.shop_id = shop_id;
        param.pay_type = payType.way;  

        // 获取当前店铺购物车中的所有商品
        if (res) {
            let keys = res.keys;
            for(let k = 0 , m = keys.length ; k < m ; k++){
                if (keys[k].indexOf('-') > 0) {
                    let goodObj = {},
                        value = wx.getStorageSync(keys[k]);

                    goodObj.goods_id = value.good_id;
                    goodObj.num = value.buy;

                    goodArr.push(goodObj);
                }

            }
        }

        param.goods = goodArr;

        // 时间撮
        let timestamp = parseInt(new Date().getTime()/1000);

        // 授权
        accessToken.getAccessToken(uu_Sever,'api/order/schoolMarket/preview',login.user_id,'POST',param,_self.preview,timestamp,login.username,login.source);
    },

    preview : function(res){   //预览
        let _self = this,
            _data = _self.data,
            money_item = _data.money_item,      //金额支付项列表
            goods = _data.goods,
            address = _data.address,
            total_pay = _data.total_pay;   //实付款

        if (res.error === false) {
            let data = res.data;    

            address.school_name = data.school_name;

            _self.setData({
                total_pay : data.order_amount,
                address : address,
                money_items : data.money_items,
                goods : data.goods
            })

        }else{
            _self.tip(res.detail);

            // 要是报登录错误，跳转回详情页面
            setTimeout(function(){
                // 登录失效
                if (res.code === "1016") {
                    let storage = wx.getStorageInfoSync(),
                        keys = storage.keys;
                    
                    if (storage) {
                        for(let k = 0 , m = keys.length ; k < m ; k++){
                            // 将access_token清空
                            if (keys[k].indexOf("access_token") > -1) {
                                wx.removeStorageSync(keys[k]);
                            }
                        }
                    }

                    wx.redirectTo({
                        url: '../market/market?shop_id='+_data.shop_id+'&school_id='+_data.school_id+'&type=return'
                    }) 
                }

                // 订单中商品信息没了
                if (res.code === "1051") {
                    wx.redirectTo({
                        url: '../market/market?shop_id='+_data.shop_id+'&school_id='+_data.school_id+'&type=return'
                    }) 
                }
                
            },1500)
            
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

    radioChange : function(event){   //支付方式
        var _self = this,
            payType = _self.data.payType;
        payType.way = event.detail.value;

        _self.setData({
            payType : payType
        })
    },

    message : function(event){    //留言
        var _self = this,
            address = _self.data.address,
            message = _self.data.message;

        message = event.detail.value;

        _self.setData({
            message : message
        })
    },

    addrsss : function(event){   //地址
        var _self = this,
            address = _self.data.address;

        address.addrss = event.detail.value;

        _self.setData({
            address : address
        })
    },

    name : function(){   //名字
        var _self = this,
            address = _self.data.address;

        address.name = event.detail.value;

        _self.setData({
            address : address
        })
    },

    mobile : function(){   //电话
        var _self = this,
            address = _self.data.address;

        address.mobile = event.detail.value;

        _self.setData({
            address : address
        })
    }

})








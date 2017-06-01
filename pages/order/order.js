var app = getApp(),
    accessToken = require('../../utils/accessToken.js');  

Page({
    data: {
    	selectTime : {   //选择期望时间
    		array: ['选择时间', '13:00', '14:00', '15:00'],
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
    		is_show : true   //是否显示货到付款
    	},
    	error : {
            is_error : false,                   //是否报错
            errorContent : ""                   //错误提示内容
        },	
        uu_Sever : app.sever.uu_Sever,			//服务器域名
    	config : {     //请求域名
            preview : "api/order/schoolMarket/preview",   
            create : "api/order/schoolMarket"
		},
        login : {   //登录信息
            user_id : 1588,
            source : 2,
            username : "18850524539"
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

        _self.getOrderPre();   //获取订单预览信息

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
    }
})








var app = getApp();
Page({
    data: {
    	selectTime : {
    		array: ['选择时间', '13:00', '14:00', '15:00'],
		    index: 0,
		    timeColor : 'rgba(0,0,0,0.38)'
    	},
    	address : {    //收货地址
    		school_name : '',
    		mobile : '',
    		name : '',
    		addrss : ''
    	},
    	message : '',   //留言
    	shop_id : 54,
    	school_id : 6636,
    	payType : {   //支付方式
    		way : 1,
    		is_show : true   //是否显示货到付款
    	},
    	error : {
            is_error : false,                   //是否报错
            errorContent : ""                   //错误提示内容
        },	
        uu_Sever : app.sever.uu_Sever,			//服务器域名
    	config : {
            preview : "/order/schoolMarket/preview",
            create : "/order/schoolMarket"
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
        var _self = this,
        	data = _self.data,
        	shop_id = options.shop_id,
        	school_id = options.school_id,
        	address = data.address;
      	
      	// 判断之前是否已经有下过单，是否有对收货地址进行存储过
      	let _address = wx.getStorageSync('address');
      	if (_address) {
      		address.mobile = _address.mobile;
      		address.name = _address.name;
      		address.addrss = _address.addrss;
      	}

      	_self.setData({
      		address : address
      	})

    },

    getOrderPre : function(){			//获取订单详情

    }
})
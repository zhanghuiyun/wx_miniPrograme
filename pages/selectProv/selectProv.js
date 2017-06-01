var app = getApp();

Page({
    data: {
        provList : [],      					//省份列表数组
        error : {
            is_error : false,                   //是否报错
            errorContent : ""                   //错误提示内容
        },	
        uu_Sever : app.sever.uu_Sever			//服务器域名
    },

    goSchool : function(event){              //跳转至选择相应的学校
    	var target = event.currentTarget.dataset,   //获取当前点击事件中的data属性上的值
            proviceId = target.prov;
        
        wx.redirectTo({
            url: '../selectSchool/selectSchool?province_id='+proviceId+''
        });
    },

    onLoad : function(options){
        var _self = this;

		wx.request({
		  	url: ''+_self.data.uu_Sever+'api/common/getProvList',
			method : 'GET',
            dataType : 'json',
		  	success: function(res) {
                var res = res.data;
		    	if (res.error === false) {
		    		var data = res.data,
                	    provinces = data.provinces;

                	_self.setData({
                		provList : provinces
                	})

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
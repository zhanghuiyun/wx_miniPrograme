var app = getApp();
Page({
    data: {
       initStyle : {                  //初始化样式设置参数
    		leftHeight : "0px"        //内容块左侧的高度，y轴超出滚动，x轴超出掩藏
    	}
    },

    onLoad : function(options){
        var _self = this;
      	
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
    }
})
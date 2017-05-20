var app = getApp();
Page({
    data: {
    	initStyle : {                  //初始化样式设置参数
    		leftHeight : "opx",        //内容块左侧的高度，y轴超出滚动，x轴超出掩藏
        	isShowHeader : false,      //公告是否显示
        	headPadding : "0px"        //公告显示掩藏时候，内容块的padding
    	}
    },

    onLoad : function(options){
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




    }
});


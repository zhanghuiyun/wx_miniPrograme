var app = getApp();
Page({
    data: {
    	selectTime : {
    		array: ['选择时间', '13:00', '14:00', '15:00'],
		    objectArray: [
		      {
		        id: 0,
		        name: '美国'
		      },
		      {
		        id: 1,
		        name: '中国'
		      },
		      {
		        id: 2,
		        name: '巴西'
		      },
		      {
		        id: 3,
		        name: '日本'
		      }
		    ],
		    index: 0,
		    timeColor : 'rgba(0,0,0,0.38)'
    	}
    },

    bindPickerChange: function(e) {
    	
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
        var _self = this;
      
    }
})
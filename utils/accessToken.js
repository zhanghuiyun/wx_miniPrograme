var utilMd5 = require('../md5.js');  

function getAccessToken(apiUrl,url,user_id,method,param,run,time,username,source){

	var access_token = wx.getStorageSync(user_id+'_access_token');

	if(access_token){
		getInfo(access_token);
	}else{
		getToken(getInfo);
	}
	
	function getToken(call_back){

		wx.request({
			method : "GET",
		  	url: apiUrl+"/api/common/getWebToken",
		  	data: {"user_id" :user_id},
		  	dataType : "json",
		  	success: function(res) {
		    	res = res.data;

		    	if (res) {
		    		if (res.error == false) {
        				let token = res.data.token,
        					access_token = token.access_token,
        					expires_in = token.expires_in,
	    					user_id = token.user_id;
	    				//存储cookie
	    				wx.setStorageSync(user_id+'_access_token',access_token);
	    				call_back(access_token);
        			}else{
        				return false;
        			}
		    	}
		  	}
		});
	} 

	function getInfo(access_token){

		param.access_token = access_token;
		param.user_id = user_id;
		
		method = method.toUpperCase();

		if(method != 'GET'){
			param = JSON.stringify(param);
		}

		let header = {};

		if (time ==="" && username ==="" && source==="") {
			header = {
				"UUHUIAUTHUSERID" : user_id,
				"UUHUIACCESSTOKEN" : access_token
			}
		}else{
			var md5 = utilMd5.hexMD5(user_id+username+time);

			header = {
				"UUHUIAUTHUSERID" : user_id,
				"UUHUIACCESSTOKEN" : access_token,
				"UUHUIAUTHTIMESTAMP" : time,
				"UUHUIAUTHTOKEN" : md5,
				"UUHUIAUTHSOURCE" : source
			}
		}

		wx.request({
			method : method,
		  	url: apiUrl+url,
		  	dataType : "json",
		  	data: param,
		  	header: header,
		  	success: function(res) {
		    	run(res.data);
		  	}
		});
	} 
}

module.exports = {
    getAccessToken : getAccessToken
}

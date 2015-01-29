        
		
		var user = require('../model/user.js');
		var http = require('http');
		function  getUserList(res,params){
		     
			/*
			 *
			  所有用户的更新
			*/
		    user.query(function(data){
				
				var result = [];
			    data.forEach(function(e){
				   result.push({id:e._id,name:e.name});
				});
				
				var cb = params.callback?params.callback:'';
			    res.end(cb+"("+JSON.stringify({state:1,userList:result,size:data.length})+")");
	        });
	    }
		
		exports.getUserList = getUserList;
		
	
		
		 

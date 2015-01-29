        
		
		var user = require('../model/user.js');
		var http = require('http');
		function  setMsg(res,params){
		    
            var cb = params.callback?params.callback:'';
			if(!(params.type && params.value && params.username)){
			
			   res.end(cb+'({state:0,msg:\'参数错误\'})');
			
			}else{
			
			    
			
			   var type = params.type.trim();
			   
			   var value = params.value.trim();
			   
			   var username = params.username.trim();
			   
			   
			    
			   
			   user.findByName(username,function(data){
			   
			       
				    if(!data.error){
					 
					   res.end(cb+'({state:0,msg:\'用户不存在\'})');
					
					}else{
					
					   
					   var data = data.obj;
                       
                       var _tempObj = {};					   
					   
                       if(type == 'pwp'){
					   
					      _tempObj = {pwp:value}
					   }else if(type == 'mis'){
					   
					      _tempObj = {mis:value}
					   }if(type == 'ework'){
					   
					      _tempObj = {ework:value}
					   }					   
                       user.upadte({name:data[0].name},_tempObj,function(da){
					      
						    if(!da.error){
							
							   res.end(cb+'({state:0,msg:\''+da.msg+'\'})');  
							}else{
							
							   res.end(cb+'({state:1})');  
							}
					    });  					  
					
					}
				   
			   
			   })
			
			}
		}
		
	
		 
       
       exports.setMsg = setMsg;	   

 

            
			var user = require('../model/user.js');
            var depObj = require('../util/getDep.js');
			var message = require('../model/messages.js');
             			
			function getAllNotice(res,params){
			         
                    var cb = params.callback?params.callback:'';					
					
					if(!params.username || !params.keywords || !params.time){
					
				       res.end(cb+'({state:0,message:\'参数为空或有误！\'})');
					   return;	
					     
					} 
					
					 
					params.username = params.username.trim(); 
					params.keywords = params.keywords.trim();
					params.time = params.time.trim();
					
					user.findByName(params.username,function(data){
						
						
						if(!data.error){
						   res.end(cb+'({state:0,message:\'查询出错\'})');
						   return;
						}
						
						data = data.obj; 					
						if(!data[0].messages){
						   res.end(cb+'({state:0,message:\'该用户没有消息\'})');
						   return;
						}
						
						 
						var depId = data[0].departmentId;
						var deparr = [];
						depObj.getGroup({
							 depId:depId,
							 arr:deparr,
							 callback:getNoticeList
						});

						
					});
					
					function  getNoticeList(arr){
					       
					 message.findNoticeList(arr,params.time,params.keywords,function(data){
								 
						var arr = [];
						data.forEach(function(e){
							arr.push({id:e._id,title:e.title,content:e.content,sendtime:e.sendTime,type:e.type,senderName:e.senderName}); 
					    });
						 		
						var cb = params.callback?params.callback:'';							
						res.end(cb+"("+JSON.stringify({state:'success',message:arr})+")");
								 
					 });
			        };
				
			}
				
		    
			 

            exports.getAllNotice = getAllNotice; 			

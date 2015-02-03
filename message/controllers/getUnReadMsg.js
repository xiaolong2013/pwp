 
/**
   主要获取用户的未读消息
   date:2014-09-10
   author:yangxiaolong   
**/
var message = require('../model/messages.js');

var user = require('../model/user.js');


    function  findUnReadMsg(params,res){
		                            
		    console.log('misName===='+params.misName);

            var cb = params.callback?params.callback:'';
            if(!params.misName){
			
			   res.end(cb+'({state:0,msg:\'misName 为空或有误!\'})');
			   return;
			}
			
		    //socket.join(misName);
		    //用户进来的时候 先把用户所在的部门 加入到房间   
		    
            var misName = params.misName.trim(); 			
			user.findByName(misName,function(data){
		        
				if(!data.error){
				   //出错
				   res.end(cb+'({state:0})');
				   return;
				}else{
			       data = data.obj;
				   
				   //现在查找用户未读消息为先查用户表 找到未读消息 然后通过消息表查询出来 发送出去  最后更新 
				   var messageObj = data[0].messages;
			       var tempArr = [];
				   for(var i in messageObj){
				   
						//如果消息类型为0的时候
						if(messageObj[i] == 0){
						  tempArr.push(i);  					 
						}
				   }
                   
				   if(tempArr.length == 0){
				      
					  res.end(cb+'({state:0})');
				      return;
				   }
				   
               	   console.log("未读消息===="+tempArr.length);		
				   //从消息表中查询 未读的消息
				   joinMsg({
				      tempArr:tempArr,
				      res:res,
				      cb:cb,
                      misName:misName 					  
				   });
				    				   
				}	  
			}); 			
	} 
		
		
	function joinMsg(option){
		
		    //从消息表中查询 未读的消息
			var BSON = require('mongodb').BSONPure;
			var result = [];
			option.tempArr.forEach(function(e){
			     var msgId = BSON.ObjectID.createFromHexString(e);
			     message.findById(msgId,function(data){
					data[0].content = data[0].content.replace(/\r\n/gi,"");
				    //查找发送者的misName 和 ffId
				    if(!data[0].senderName){
					   option.res.end(option.cb+'({state:0})');
					   return;
					}
					console.log('***********'+data[0].senderName);
					
					if(data[0].senderName == 'ework'){
					  
					    result.push({id:data[0]._id,title:data[0].title,content:data[0].content,sendtime:data[0].sendTime,nickName:'ework',type:data[0].type,senderName:'ework',sys:data[0].sys}); 
					
                        if(result.length == option.tempArr.length){
						   
					       
						         
						   option.res.end(option.cb+'({state:1,message:'+JSON.stringify(result)+'})');   
						       
					    }
					
					}else{
						user.findByName(data[0].senderName,function(_da){
						  
							if(!_da.error){
							  option.res.end(option.cb+'({state:0})');
							  return;
							}
							_da = _da.obj;
							
							
							result.push({id:data[0]._id,title:data[0].title,content:data[0].content,sendtime:data[0].sendTime,nickName:_da[0].nickName,type:data[0].type,senderName:_da[0].name,sys:data[0].sys}); 
						
							if(result.length == option.tempArr.length){
							   /*
							   var obj = {
						         message:result,
								 username:option.misName
						       }*/
						       option.res.end(option.cb+'({state:1,message:'+JSON.stringify(result)+'})');   
							}
						});
					}
				 });
            });
	} 		
		
	exports.findUnReadMsg = findUnReadMsg;	

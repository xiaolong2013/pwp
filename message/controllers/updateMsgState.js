 


        //这个方法主要用于更新用户消息的状态    			 
	    //logInfo.info("接到请求==="+req.url+"==开始时间=="+startTime+"===="+new Date().getMinutes()+":"+new Date().getSeconds()+":"+new Date().getMilliseconds()); 
		var user = require('../model/user.js');
        var log4js = require('log4js');
        log4js.configure("./config/log4js.json");
        var logInfo = log4js.getLogger('logInfo');
        
		function updateMsg(params,res,time){
		    
            logInfo.info("开始更新"+params.username+"的未读消息列表===="+new Date().getMinutes()+":"+new Date().getSeconds()+":"+new Date().getMilliseconds());
            var cb = params.callback?params.callback:'';
            if(!params.username || !params.messageIds){
			  
			   res.end(cb+'({state:0,msg:\'参数为空或有误！\'})');
			   return; 
			}  
			
			var username = params.username.trim();
		    
			var mIds = params.messageIds.trim();
		    var mIdsArr = [];
			if(mIds && mIds.indexOf(";")!=-1){
			   mIdsArr = mIds.split(";");
			}else if(mIds && mIds.indexOf(";") == -1){
			   mIdsArr[0] = mIds;
			}
			
			findByUserName(params,res,time,mIdsArr)  
		 }	
		 
		 
		 function findByUserName(params,res,time,mIdsArr){
		 
		    var cb = params.callback?params.callback:'';
		    user.findByName(params.username,function(data){
			     //
				 if(!data.error){
				    res.end(cb+'({state:0,msg:\'该用户不存在\'})');  
			        return;
				 }
				 data = data.obj;
				 var messageObj = data[0].messages;
			     var index = 0;
				 var flag = false;
				 for(var i=0;i<mIdsArr.length;i++){
				    
					 for(var j in messageObj){
					    
						if(j == mIdsArr[i] && messageObj[j] != 1){
					       //如果找到的话 就更新一下
						   messageObj[j] = 1;
						   flag = true;
				        }
					 }
					 //搜索了一遍发现没找到  那么就证明数据库那边还没有插入进去
					 if(!flag){
					    //那么把id 加入到对象里 并准备更新 
					    messageObj[mIdsArr[i]] = 1;  
					 }
			    }
				logInfo.info("查找完毕"+params.username+"的未读消息列表===="+new Date().getMinutes()+":"+new Date().getSeconds()+":"+new Date().getMilliseconds());  
	            //更新用户列表
				user.findAndUpdate({misName:params.username},{messages:messageObj},function(_d3,_d4){
				       
					   var end = new Date().getTime();
					   var tatol = (end - time)/1000;
					   logInfo.info("更新完毕"+params.username+"的未读消息列表总共花费"+tatol+"秒");
					   var cb = params.callback?params.callback:'';
					   res.end(cb+'({state:1})');
				});
			
			}); 
		}
		 
		
        exports.updateMsg = updateMsg;		

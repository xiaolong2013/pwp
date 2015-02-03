 
var log4js = require('log4js');
log4js.configure("./config/log4js.json");
var logInfo = log4js.getLogger('logInfo');
var routerObj = require('../routes/router.js');
var user = require('../model/user.js');
var pushMsgObj = require('../util/pushMsgToSocket.js');
function  decodeParams(option){
    
	 
	try{
        if(option.params.type == 'debug'){
		        logInfo.info('debug 内容==='+option.params.info+"时间=="+new Date().getMinutes()+":"+new Date().getSeconds()+":"+new Date().getMilliseconds());
				//两种情况 1.特定的个人  2.所有人
				var cb = option.params.callback?option.params.callback:'';
				if(option.params.recevier == 'all'){
				
				　user.query(function(data){
		　　　　　
				　　data.forEach(function(u){
						　
						if(u.misName){
						   //var messageObj = {message:decodeURIComponent(option.params.info)};
						   //io.sockets.in(u.misName).emit("debug",{message:option.params.info});
						   pushMsgObj.pushMsgToSocket(u.misName,decodeURIComponent(option.params.info),'debug',option.startTime);
						   option.res.end(cb+'({state:1})');
						}
					}); 
	 　　　　　　  });　
				}else{
				   
				   console.log(option.params.info);
				 　user.findByName(option.params.recevier,function(data){
		        
						if(!data.error){
						   option.res.end(cb+'({state:0})');
						   //出错
						   return;
						}else{
						   data = data.obj;
						   logInfo.info(data[0].misName+'debug 内容==='+option.params.info+"时间=="+new Date().getMinutes()+":"+new Date().getSeconds()+":"+new Date().getMilliseconds());
						   //var messageObj = {message:decodeURIComponent(option.params.info)};
						   //io.sockets.in(u.misName).emit("debug",{message:option.params.info});
						   pushMsgObj.pushMsgToSocket(data[0].misName,decodeURIComponent(option.params.info),'debug',option.startTime);
						   option.res.end(cb+'({state:1})');
						   return;
						}
                    });					
				}
				　
		}else{
		 
		 
		   
		  for(var i in option.params){
			 var temp = decodeURIComponent(i);
			 if(temp == "info"){
			   option.params[temp] = eval(option.params[temp]);
			   var count = 0;
			   option.params[temp].forEach(function(e){
			      logInfo.info('原始字符串内容===='+e.ict+"标题==="+e.ititle);
				  logInfo.info('原始字符串解码内容===='+decodeURIComponent(e.ict)+"标题==="+decodeURIComponent(e.ititle));
				  option.params[temp][count].ict = decodeURIComponent(e.ict); 
				  option.params[temp][count].ititle = decodeURIComponent(e.ititle);
				  count++;
			   });
			 }else{
			   option.params[temp] = decodeURIComponent(option.params[i]);  
			 }
		     logInfo.info("参数===="+temp+"==="+option.params[temp]);
		  }
		  routerObj.router(option.params,option.pathname,option.res,option.startTime);
          
		}	
	
	}catch(e){
       
	   var cb = option.params.callback?option.params.callback:'';   
	   if(cb){
		 option.res.end(cb+"("+JSON.stringify({state:0,errMsg:'参数有误'+e.message})+")");
	   }else{
		 option.res.end(JSON.stringify({state:0,errMsg:'参数有误'+e.message}));
	   }	
	} 
}

exports.decodeParams = decodeParams;

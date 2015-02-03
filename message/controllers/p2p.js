 
var department = require('../model/department.js');
var user = require('../model/user.js');
var log4js = require('log4js');
log4js.configure("./config/log4js.json");
var logInfo = log4js.getLogger('logInfo');
logInfo.info("测试日志信息");

var pushMsgObj = require('../util/pushMsgToSocket.js');
var http = require('http');
/**
  @param
    depId number
**/

exports.p2pMsg = function(option){
     logInfo.info("查找接收者"+option.recevier+"==="+new Date().getMinutes()+":"+new Date().getSeconds()+":"+new Date().getMilliseconds());
     user.findByName(option.recevier,function(data){
			 
			 if(!data.error){
			     return;
			 }
             data = data.obj;			 
			 var mgsArr = data[0].messages;
			 
			 option.msgObj.forEach(function(e){
				mgsArr[e._id] = 0;
			 });
			 
			 var msgConf = {
			    
				 pwp:data[0].pwp,
			     mis:data[0].mis,
			     ework:data[0].ework
			 
			 };
			 
			 logInfo.info("查找接收者"+option.recevier+"的消息列表==="+new Date().getMinutes()+":"+new Date().getSeconds()+":"+new Date().getMilliseconds());
			 user.findAndUpdate({_id:data[0]._id},{messages:mgsArr},function(data0,data1){
						    //logInfo.info("更新后"+option.recevier+"的消息列表==="+JSON.stringify(data0[0].messages));
							//监听连接
							//when the socket connection  emit message
							//把消息
							logInfo.info("更新完毕接收者"+option.recevier+"的消息列表==="+new Date().getMinutes()+":"+new Date().getSeconds()+":"+new Date().getMilliseconds());
							//如果接收者不存在的话 就不往下走
							if(!data[0].misName){
							  return;
							} 
							logInfo.info("组织并发送消息给"+data[0].misName+"==="+new Date().getMinutes()+":"+new Date().getSeconds()+":"+new Date().getMilliseconds()); 
	                                               						
							joinMsgAndSend(option.sender,data[0].misName,option.msgObj,option.time,msgConf);
							
							//current socket control the message
			});
	});  
}										



function joinMsgAndSend(sender,recevier,msgObj,time,option){
     
	if(sender == 'ework'){
	
	   //这时接受者必须为misName 如果为ffId 则发不出去
	       var infoids = "";
		   var messageObj = [];
		   var _sys = '';
		   msgObj.forEach(function(e){
		       _sys = e.sys;
			   infoids += e._id+"||";
			   messageObj.push({id:e._id,title:e.title,nickName:'ework',senderName:'ework',content:e.content,sendtime:e.sendTime,type:e.type,job:'',sys:e.sys});
		   });
		   
		   var end = new Date().getTime();	   
		   var total = (end - time)/1000;
		   console.log("======准备给"+recevier+"发送消息");
		   logInfo.info("准备给"+recevier+"发送消息");
		   console.log('option.ework==='+option.ework);
		   //io.sockets.in(recevier).emit("message",{message:JSON.stringify(messageObj)},function(arg){
		   //if(option.ework){
		      pushMsgObj.pushMsgToSocket(recevier,JSON.stringify(messageObj),infoids,time,_sys);
		   //}
		   
		   
	
	}else{
		user.findByName(sender,function(data){
			if(!data.error){
			  return;
			}
			data = data.obj;
			var nickName = data[0].nickName;
			var job      = data[0].title;
			var name     = data[0].name;
			var misName  = data[0].misName; 
		    //这时接受者必须为misName 如果为ffId 则发不出去
		    
			var sendName = misName?misName:nickName?nickName:name;
			var infoids = "";
		    var messageObj = [];
			var _sys = '';
		    msgObj.forEach(function(e){
			   _sys = e.sys;
			   infoids += e._id+"||";
	           messageObj.push({id:e._id,senderName:name,nickName:sendName,content:e.content,sendtime:e.sendTime,type:e.type,job:job,sys:e.sys});
		    });
		   
		   
		   
		   var end = new Date().getTime();	   
		   var total = (end - time)/1000;
		   
		   //把rooms 中的客户端输出
		   /*
		   var roomObj = io.sockets.manager.rooms;
		   console.info(roomObj); 	
		   
		   var count = 0;
		   for(var i in roomObj){
		       count++;
			   logInfo.info(i+'===='+roomObj[i]);
		   }
		   logInfo.info('房间数为'+count);
		    */
			//获取某个房间的的socket 实例
		   //if(option[_type]){
		       pushMsgObj.pushMsgToSocket(recevier,JSON.stringify(messageObj),infoids,time,_sys);
		   //} 
		});
	}
}


 

 




 


										

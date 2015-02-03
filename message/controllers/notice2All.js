 
var department = require('../model/department.js');
var user = require('../model/user.js');
var log4js = require('log4js');
log4js.configure("./config/log4js.json");
var logInfo = log4js.getLogger('logInfo');
logInfo.info("测试日志信息");

var pushMsgObj = require('../util/pushMsgToSocket.js');
/**
  @param
    depId number
**/

exports.noticeAll = function(msgObj,time){
     
     logInfo.info("组装发送消息"+new Date().getMinutes()+":"+new Date().getSeconds());
	 var msgArr = [];
	 var _sys = '';
	 msgObj.forEach(function(e){
	     _sys = e.sys;
		 msgArr.push({id:e._id,nickName:'通知公告',senderName:e.senderName,title:e.title,content:e.content,sendtime:e.sendTime,type:e.type,job:'',sys:e.sys});
	 });
	 
	 logInfo.info("组装发送消息"+new Date().getMinutes()+":"+new Date().getSeconds()+"=="+msgArr);
	 user.query(function(data){
		logInfo.info("更新所有用户消息列表"+new Date().getMinutes()+":"+new Date().getSeconds());		
		data.forEach(function(u){
		    var mgsArr = u.messages;
			var infoids='';
			msgObj.forEach(function(e){
				mgsArr[e._id] = 0;
		        infoids += e._id+"||";
			});
		    if(u.misName){
		       
			   logInfo.info("发送消息"+u.misName+"==="+infoids+"===="+new Date().getMinutes()+":"+new Date().getSeconds());
		       var endTime = new Date().getTime();
	           var total = (endTime - time)/1000;
			   pushMsgObj.pushMsgToSocket(u.misName,JSON.stringify(msgArr),infoids,time,_sys);
			   //io.sockets.in(u.misName).emit("message",{message:JSON.stringify(msgArr)});
			   //logInfo.info("消息"+"	"+infoids+"	"+"通过socket向客户端发送总共花费==="+"	"+total+"秒");
		    }
		}); 
	 });  
}										



 


										

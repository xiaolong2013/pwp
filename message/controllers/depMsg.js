
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

exports.depMsgFn = function(depId,msgObj,res,time){
            
            logInfo.info("开始查找部门"+depId+""+new Date().getMinutes()+":"+new Date().getSeconds());
            department.findBydepartmentId(depId,function(dep){
				 
				console.log(depId+""+dep.error+""+dep.obj); 
                if(!dep.error){
				   return;
				}
				dep = dep.obj;				 
				logInfo.info("准备发送消息"+depId+""+new Date().getMinutes()+":"+new Date().getSeconds());						 
			    joinMsgAndSend(msgObj,depId,dep[0].depName,time);
				  
				var  depArr = dep[0].departments;
				 
				if(!depArr){
				   return;
				} 
				logInfo.info("开始查找子部门和用户"+new Date().getMinutes()+":"+new Date().getSeconds());  
				findSubDepAndUser(depArr,msgObj,res);
				logInfo.info("开始查找用户"+new Date().getMinutes()+":"+new Date().getSeconds()); 
				findUser(dep[0].members[0].name,msgObj,res);
				logInfo.info("结束"+depId+""+new Date().getMinutes()+":"+new Date().getSeconds());									 
	        });
}										



//找到该部门的领导并更新状态
//接收两个参数 部门管理者的名称和消息对象 
function findUser(name,msgObj,res){
      
    user.findByUserName(name,function(data){
	      var temp =  data[0].messages;
		  //更新messages 列表
		  msgObj.forEach(function(e){
		     
            if(!temp[e._id]){
			   temp[e._id] = 0;
		    }			 
		  });
		   
		  //更新用户的列表
		  user.findAndUpdate({_id:data[0]._id},{messages:temp},function(data0,data1){
			 console.log('update success');
			 //res.end('success'); can not call method end   	 
		  });
		  //消息完毕
   });
}

//遍历当前部门下的子部门并找到用户

function findSubDepAndUser(depArr,msgObj,res){

    depArr.forEach(function(dep){
        
		department.findBydepartmentId(parseInt(dep.depId),function(data){
			    //此时 用户可以去更新自己的列表了
			    // 1. 先把该用户找到
                data = data.obj; 				
				var mebArr = data[0].members;
				mebArr.forEach(function(m){
				    findUser(m.name,msgObj,res);
				});
		});
    });
}

//组装消息 并且发送
function joinMsgAndSend(msgObj,depId,depName,time){
      
	 logInfo.info("组装发送消息"+new Date().getMinutes()+":"+new Date().getSeconds());
     var messageObj = [];	 
	 var infoids = "";
	 var _sys = "";
	 msgObj.forEach(function(e){
	    _sys = e.sys;
		e.content = e.content.replace(/\r\n/gi,"");
		messageObj.push({id:e._id,nickName:depName,senderName:depName,title:e.title,content:e.content,sendtime:e.sendTime,type:e.type,job:'',sys:e.sys});
	    infoids += e._id+"||";  
	 }); 
      
	 logInfo.info("消息"+new Date().getMinutes()+":"+new Date().getSeconds()+"=="+messageObj);
	 //给所有的socket 发完消息以后
	 var endTime = new Date().getTime();
	 
	 var total = (endTime - time)/1000;
	 console.log("开始发送信息");
	 pushMsgObj.pushMsgToSocket(depId,JSON.stringify(messageObj),infoids,time,_sys);
	 //io.sockets.in(depId+"").emit("message",{message:JSON.stringify(messageObj)});
	 //logInfo.info("消息"+"	"+infoids+"	"+"通过socket向客户端发送总共花费=="+"	"+total+"秒");
}



										

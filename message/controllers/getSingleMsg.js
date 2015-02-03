


//根据 Id  查找消息的详细信息
			 //普通的字符串id  不能查询出结果  需要特殊处理一下
			  
			var message = require('../model/messages.js');
			var user = require('../model/user.js'); 
			function getSingleMsg(params,res){
			
			   var BSON = require('mongodb').BSONPure;
               var id = BSON.ObjectID.createFromHexString(params.id);
			   message.findById(id,function(data){
			     var cb = params.callback;
				 res.end(cb+"({messageState:'"+data[0].messageState+"',senderName:'"+data[0].senderName+"',senderId:'"+data[0].senderId+"',recevierName:'"+data[0].recevierName+"',recevierId:'"+data[0].recevierId+"',title:'"+data[0].title+"',content:'"+data[0].content+"',senderTime:'"+data[0].sendTime+"',type:'"+data[0].type+"'})");
			   });
		    } 
			 
			exports.getSingleMsg = getSingleMsg; 

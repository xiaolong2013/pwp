 

/**
  
  主要功能
  
  根据mis帐号来获取FFID 和 真实姓名  

**/
var message = require('../model/messages.js');
 
var user = require('../model/user.js');

        function getFFIdAndMisName(params,res){
		    
			
			//参数验证
			var cb = params.callback?params.callback:'';
			
			
			if(!params.misName){
			    res.end(cb+'({state:0,msg:\'misName参数有误！\'})');
				return;
			}
			
			
			var misName = params.misName.trim();
			
			
			
			user.findByMisname(misName,function(data){
		        
				if(data[0] && data[0].misName){
				    //socket.emit("ffId",{username:data[0].misName,ffId:data[0].name,socketId:socket.id});       
			        var obj = {
					     username:data[0].misName,
						 ffId:data[0].name,
						 pwpSwitch:data[0].pwp?data[0].pwp:'',
						 misSwitch:data[0].mis?data[0].mis:'',
						 eworkSwitch:data[0].ework?data[0].ework:''
					} 
					res.end(cb+'({state:1,data:'+JSON.stringify(obj)+'})');
			    }else{
				   
				    getFromMis(misName,res,cb,{
					    pwpSwitch:data[0].pwp?data[0].pwp:'',
						misSwitch:data[0].mis?data[0].mis:'',
						eworkSwitch:data[0].ework?data[0].ework:''
					});
			    }
			});       
		} 
			
			
			
	    function getFromMis(misName,res,cb,option){
	
	            var soap = require('soap');
		        var url = 'http://ehr.inc.hc360.com/services/EhrHc360WS?wsdl';
		        var args = {userId: misName};
		        soap.createClient(url, function(err, client) {
					client.getUserInfoByUserId(args, function(err, result) {
						   var  info = result.out;
						   var misName = info.substring(info.indexOf("<name>")+"<name>".length,info.indexOf("</name>"));
						   var ffId = info.substring(info.indexOf("<im>")+"<im>".length,info.indexOf("</im>"));
						   //这个地方需要验证一下 
						   if(misName.indexOf('<')!=-1 && ffId.indexOf('<')!=-1){
		                      //socket.emit("ffId",{tag:"0"});
		                      res.end(cb+'({state:0,msg:\'webservice 服务异常\'})');
							  return;
		                   }else{
						      //socket.emit("ffId",{username:misName,ffId:ffId,socketId:socket.id});
						      var obj = {
									 username:misName,
									 ffId:ffId,
									 pwpSwitch:option.pwpSwitch,
						             misSwitch:option.misSwitch,
						             eworkSwitch:option.eworkSwitch
							  }
							  res.end(cb+'({state:1,data:'+JSON.stringify(obj)+'})');
							  updateUser(ffId,misName);
						   }
				    });
				});	
		}

        
		function updateUser(ffId,misName){
		
		    user.findAndUpdate({name:ffId},{misName:misName},function(){
				//findUserAndJoin(misName,socket); 
		    });
		}


      	exports.getFFIdAndMisName = getFFIdAndMisName; 

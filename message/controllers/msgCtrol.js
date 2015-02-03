             
		var message = require('../model/messages.js');			
		var p2pObj = require('../controllers/p2p.js');
		var depMsg = require('../controllers/depMsg.js');
		var noticeObj = require('../controllers/notice2All.js');
		var log4js = require('log4js');
        log4js.configure("./config/log4js.json");
        var logInfo = log4js.getLogger('logInfo');
        //接收一个参数对象 		
	    function model(params,recevier){
	        var opt = params.opt;
			var sender = params.sender;
		    var recevier = recevier?recevier:params.recevier;
		    var info = eval(params.info);
			var type = params.type;
            var sys = params.sys;
			var tempArr = [];
			info.forEach(function(e){
					logInfo.info('进入数据库之前的标题==='+e.ititle+"内容==="+e.ict);
					var messageObj = {
						 tag:1,
						 senderName:sender,
						 recevierName:recevier,
						 title:e.ititle,
						 content:e.ict,
						 sys:sys,
						 sendTime:(function(){
							var year =  new Date().getFullYear(); 
							var month = (new Date().getMonth()+1<10)?"0"+(new Date().getMonth()+1):new Date().getMonth()+1;
							var date =  new Date().getDate()<10?"0"+new Date().getDate():new Date().getDate();
							var hour =  new Date().getHours()<10?"0"+new Date().getHours():new Date().getHours();var minutes = new Date().getMinutes()<10?"0"+new Date().getMinutes():new Date().getMinutes();   			
							var seconds = new Date().getSeconds()<10?"0"+new Date().getSeconds():new Date().getSeconds();
							return year+"-"+month+"-"+date+" "+hour+":"+minutes+":"+seconds;
						 })(),
						 type:type
					} 
					tempArr.push(messageObj);
			});	
			return tempArr;
	    }					
	
   
       function  msgDao(option){
	        logInfo.info("进入控制器==="+option.params+"==="+new Date().getMinutes()+":"+new Date().getSeconds()+":"+new Date().getMilliseconds()); 
	        option = option || {};
			//1.先接收参数  然后验证
            //遍历消息数组
			var tempArr = model(option.params,option.recevier);						
		    //批量添加
			
			message.add(tempArr,function(data){
				
				//给用户关联数据
			    var obj = data.obj;
			    logInfo.info("消息已经进入数据库==="+option.params+"==="+new Date().getMinutes()+":"+new Date().getSeconds()+":"+new Date().getMilliseconds());
				//根据不同的类型来处理
				optType({
			        type:option.params.type,
					obj:obj, 
				    io:option.io,
					recevier:option.recevier?option.recevier:option.params.recevier,
					sender:option.params.sender,
					res:option.res,
					params:option.params,
					time:option.time
				});			  	
			});
	    }
         
		//操作不同的类型 
        function optType(option){
	
            switch(parseInt(option.type)){
			
				case 1: //代表个人
					 
					joinData(option.obj,option.params,option.res,option.time);		
					
					p2pObj.p2pMsg({
						 recevier:option.recevier,
						 sender:option.sender,
						 msgObj:option.obj,
						 io:option.io,
						 res:option.res,
						 time:option.time
					});
				break;
				
				case 2: //代表群组 
					
					//暂未开发 
				break;
				
				case 3: //代表组织结构 
					//recevier为部门的部门Id	
					//web前端开发部 5405742
					//先找出已经存入数据库的消息Id
					joinData(option.obj,option.params,option.res,option.time);
					depMsg.depMsgFn(parseInt(option.recevier),option.obj,option.io,option.res,option.time);
				break;
				
				case 4: //代表公告 
					joinData(option.obj,option.params,option.res,option.time);
					noticeObj.noticeAll(option.obj,option.io,option.time);									
				break;
			}
	    }
		
		
		//组织数据
		function joinData(mgsObj,params,res,time){
		    var arr = [];
			var infoids = "";
			mgsObj.forEach(function(e){
			    //arr.push(JSON.stringify({iid:e._id}));
				arr.push({iid:e._id});
				infoids += e._id+"||";
			});
			var td =new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()+" "+new Date().getHours() +":"+new Date().getMinutes()+":"+new Date().getSeconds();
			var tempCallback = params.callback?params.callback:'';
			if(tempCallback){
			   res.end(tempCallback+'('+JSON.stringify({state:1,infoid:arr,time:td})+')'); 
			}else{
			   res.end(JSON.stringify({state:1,infoid:arr,time:td})); 
			}
			var endTime = new Date().getTime();
			var total = (endTime - time)/1000;
			logInfo.info(td+" 消息"+"	"+infoids+"返回相应总共花费时间为=="+"	"+total+"秒");
		}
		
		exports.msgObj = msgDao;
	

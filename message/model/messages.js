//该文件为连接mongoDB的文件
//users 为数据库

var conn = require("../config/connection.js");
var log4js = require('log4js');
log4js.configure("./config/log4js.json");
var logInfo = log4js.getLogger('logInfo');
var dbOperation = {};
 
dbOperation.query = function(callBack){
    conn(function(databaseConnection) {
		databaseConnection.collection('message', function(error, collection) {
			collection.find().toArray(function(error, results) {
			    if(error){
				   callBack({error:0});
				}else{
				   callBack({error:1,obj:results});  
				}
				    
			});
		});
	});
} 

//添加 
dbOperation.add = function(json,callBack){
  
   
  
  conn(function(databaseConnection) {
		databaseConnection.collection('message',{safe:true},function(error, collection) {
			collection.insert(json,function(error,result){
			     
				 if(error){
				    callBack({"error":1});
				    return;
				 }else{
				    //把刚添加的数据返回
				    callBack({"error":0,obj:result});
				 }
				  
				 
			});
		});
  });
} 
 
 
 






//删除
dbOperation.del = function(json){
  conn(function(databaseConnection) {
		databaseConnection.collection('message', function(error, collection) {
			collection.remove(json,function(){});
		});
  });
} 

//更新
dbOperation.upadte = function(json1,json2,callBack){
  conn(function(databaseConnection) {
		databaseConnection.collection('message', function(error, collection) {
			collection.update(json1,{$set:json2},function(error,result){
			    
				console.info(result);
				 
			});  
		});
  });
}

//根据用户名查询
dbOperation.findById = function(id,callBack){
     
     
	conn(function(databaseConnection) {
		databaseConnection.collection('message', function(error, collection) {
			 collection.find({_id:id}).toArray(function(error, results) {
			      if(error){
				    console.log(error);
				  }
                   			  
				  callBack(results);
			});
		});
	});   
}



//根据接收者
dbOperation.findByRecevierId = function(id,callBack){
     
     
	conn(function(databaseConnection) {
		databaseConnection.collection('message', function(error, collection) {
			 collection.find({recevierId:id}).toArray(function(error, results) {
			      if(error){
				    console.log(error);
				  }
                   				  
				  callBack(results);
			});
		});
	});   
}


//根据用户名查找未接收到的消息
dbOperation.findUnRecevie = function(name,callback){
    conn(function(databaseConnection) {
		databaseConnection.collection('message', function(error, collection) {
			 
			collection.find({recevierName:name,messageState:0}).toArray(function(error, results) {
			      if(error){
				    console.log(error);
				  }
                  console.info(results); 				  
				  callback(results);
			});
		});
	});   
}





dbOperation.findNoticeList = function(arr,time,keywords,callBack){
    
    conn(function(databaseConnection) {
		databaseConnection.collection('message', function(error, collection) {
			collection.find({'recevierName':{$in:arr},'sendTime':{$gt:time},$or:[{'title':new RegExp(keywords)},{'content':new RegExp(keywords)}]}).toArray(function(error, results){
                callBack(results);  
			});			
		});
	});
}

//查找消息的历史记录
dbOperation.findRecordHistory = function(option,callBack){
     
	logInfo.info("option==="+JSON.stringify(option)); 
    var Obj = {};
	var arr = [];
	//开始组装开始日期和结束日期
	Obj.sendTime = {$gt:option.startDate?option.startDate:'',$lt:option.endDate?option.endDate:''};
	logInfo.info("Obj.sendTime==="+JSON.stringify(Obj.sendTime));
	//把类型装数组里面
	var temp = [];
	if(option.typeArr instanceof Array){
	    option.typeArr.forEach(function(e){
	       temp.push(option.apaterMsgType[parseInt(e)-1]);
	    });
        Obj.sys = {$in:temp};		
	}else{
	     
		Obj.sys = option.apaterMsgType[parseInt(option.typeArr)-1];
	}
	 
	logInfo.info("Obj.sys==="+JSON.stringify(Obj.sys));
	//关键字已经组装完毕
	//arr.push({'senderName':{$in:option.keyWordsArr}});
	//arr.push({'title':{$in:option.keyWordsArr}});
	//arr.push({'content':{$in:option.keyWordsArr}});
	//arr.push({'sys':{$in:temp}});
	//option.keyWordsArr = ['宋俊刚'];
	arr.push({'senderName':new RegExp(option.keyWordsArr.toString().replace(/,/g,'|'))});
	arr.push({'title':new RegExp(option.keyWordsArr.toString().replace(/,/g,'|'))});
	arr.push({'content':new RegExp(option.keyWordsArr.toString().replace(/,/g,'|'))});
	Obj.$or = arr;
	logInfo.info("Obj.$or==="+JSON.stringify(arr)); 
	var isAsc   = option.isAsc;
	logInfo.info("isAsc==="+isAsc); 
	var sortObj = {}; 
	console.log("temp==="+temp);
	logInfo.info(temp);
	logInfo.info("option.sortBy==="+option.sortBy);
	switch(option.sortBy){
	
	      case  'senderName':
	      
		  sortObj.senderName = option.isAsc; 	
	      break; 
	     
		  case  'recevierName':
		   sortObj.recevierName = option.isAsc; 	
	      
		  break; 
		  case  'type':
		   sortObj.type = option.isAsc; 	
	      
		  break;
		  case  'title':
		   sortObj.title = option.isAsc; 	
	      
		  break;
		  case  'content':
		   sortObj.content = option.isAsc; 	
	      
		  break;
		  case  'sendTime':
		   sortObj.sendTime = option.isAsc; 	
	      
		  break;
		  default:
		    sortObj.sendTime = option.isAsc;     
	
	}
	logInfo.info("sortObj==="+JSON.stringify(sortObj));  
	conn(function(databaseConnection) {
	    
		databaseConnection.collection('message', function(error, collection) {
			collection.find(Obj).toArray(function(error, _results){
			    logInfo.info('符合条件的总数====='+_results.length);
				logInfo.info('开始====='+option.start+'=====长度===='+option.templen);
				if(error){
				   callBack({error:0});
				}else{
				   collection.find(Obj).sort(sortObj).skip(option.start).limit(option.templen).toArray(function(error, results){
						 if(error){
						    callBack({error:0});
						 }else{
						    callBack({error:1,obj:results,total:_results.length});
						 }
				   });
				}
		    });
        });
	});
     	
}






module.exports = dbOperation;



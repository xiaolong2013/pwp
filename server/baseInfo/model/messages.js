//该文件为连接mongoDB的文件
//users 为数据库

var conn = require("../config/connection.js");

var dbOperation = {};
 
dbOperation.query = function(callBack){
    conn(function(databaseConnection) {
		databaseConnection.collection('message', function(error, collection) {
			collection.find().toArray(function(error, results) {
			    callBack(results);   
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



module.exports = dbOperation;



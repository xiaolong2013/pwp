//该文件为连接mongoDB的文件
//departments 为数据库

var conn = require("../config/connection.js");

var dbOperation = {};
 
dbOperation.query = function(callBack){
    conn(function(databaseConnection) {
		databaseConnection.collection('department', function(error, collection) {
			collection.find().toArray(function(error, results) {
			    callBack(results);   
			});
		});
	});
} 

//添加 
dbOperation.add = function(json,callBack){
  conn(function(databaseConnection) {
		databaseConnection.collection('department', function(error, collection) {
			collection.insert(json,function(){
			    collection.find().toArray(function(error, results) {
			       callBack(results);   
			    });
			});
		});
  });
} 

//删除
dbOperation.del = function(json){
  conn(function(databaseConnection) {
		databaseConnection.collection('department', function(error, collection) {
			collection.remove(json,function(){});
		});
  });
} 

//更新
dbOperation.upadte = function(json1,json2){
  conn(function(databaseConnection) {
		databaseConnection.collection('department', function(error, collection) {
			collection.update(json1,{$set:json2});  
		});
  });
}

//根据用户名查询
dbOperation.findBydepartmentId = function(depId,callBack){
     
	conn(function(databaseConnection) {
		databaseConnection.collection('department', function(error, collection) {
			collection.find({'depId':depId}).toArray(function(error, results) {
                if(error || !results.length){
				   
				  callBack({error:0});
				 
				}else{
				 
				  callBack({error:1,obj:results});  
				}			      
			});
		});
	});   
}

 

module.exports = dbOperation;



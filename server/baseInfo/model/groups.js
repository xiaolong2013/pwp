//该文件为连接mongoDB的文件
//users 为数据库

var conn = require("./connection.js");

var dbOperation = {};
 
dbOperation.query = function(callBack){
    conn(function(databaseConnection) {
		databaseConnection.collection('groups', function(error, collection) {
			collection.find().toArray(function(error, results) {
			    callBack(results);   
			});
		});
	});
} 

//添加 
dbOperation.add = function(json,callBack){
  conn(function(databaseConnection) {
		databaseConnection.collection('groups', function(error, collection) {
			collection.insert(json,{safe:true},function(error,result){
			    
				//当在插入的时候 增加 {safe:true} 的时候  就可以返回刚刚插入的数据
			    if(error){
				   callBack({error:1});
				   return false;
				}else{
			       callBack({error:0,obj:result}); 
				}
			    /*
				collection.find().toArray(function(error, results) {
			       callBack(results);   
			    });
				*/
			});
		});
  });
} 

//删除
dbOperation.del = function(json){
  conn(function(databaseConnection) {
		databaseConnection.collection('groups', function(error, collection) {
			collection.remove(json,function(){});
		});
  });
} 

//更新
dbOperation.upadte = function(json1,json2){
  conn(function(databaseConnection) {
		databaseConnection.collection('groups', function(error, collection) {
			collection.update(json1,{$set:json2});  
		});
  });
}
 

//根据ID 查询
dbOperation.findByGroupId = function(id,callBack){
  conn(function(databaseConnection) {
		databaseConnection.collection('groups', function(error, collection) {
			 collection.find({_id:id}).toArray(function(error, results){
			       callBack(results);                              
			 });  
		});
  });
} 
 
 

//根据用户名查询
dbOperation.findByUsernameAndPassword = function(username,password,callBack){
    
	conn(function(databaseConnection) {
		databaseConnection.collection('person', function(error, collection) {
			 collection.find({"username":username}).toArray(function(error, results) {
			    if(results.length == 0){
				    callBack({"error":0,"desc":"用户名不存在"})
				}else{
				    collection.find({"username":username,"password":password}).toArray(function(error, results) {
                      if(results.length == 0){
					     callBack({"error":0,"desc":"用户名或密码错误"}); 
					  }else{
					     callBack({"error":1,"desc":"登录成功!"});    
					  } 
                   }); 				   
				}  
			});
		});
	});   
}


module.exports = dbOperation;



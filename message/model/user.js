//该文件为连接mongoDB的文件
//users 为数据库

var conn = require("../config/connection.js");



var dbOperation = {};
 
dbOperation.query = function(callBack){
    conn(function(databaseConnection) {
		databaseConnection.collection('user', function(error, collection) {
			collection.find().toArray(function(error, results) {
			    callBack(results);   
			});
		});
	});
} 

//添加 
dbOperation.add = function(json,callBack){
  conn(function(databaseConnection) {
		databaseConnection.collection('user', function(error, collection) {
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
		databaseConnection.collection('user', function(error, collection) {
			collection.remove(json,function(){});
		});
  });
} 

//更新
dbOperation.upadte = function(json1,json2,callBack){
  conn(function(databaseConnection) {
		databaseConnection.collection('user', function(error, collection) {
			collection.update(json1,{$set:json2},function(error,result){
			    
                //console.info(result);
                
			});  
		});
  });
};


//更新
dbOperation.findAndUpdate = function(json1,json2,callBack){
  conn(function(databaseConnection) {
		databaseConnection.collection('user', function(error, collection) {
			collection.findAndModify (json1, {name:1}, {$set:json2}, {new:true}, function(obj1,obj2,obj3){
			        //更新成功以后返回的值
			        //此时消息已经更新成功 往客户端发送 
                    callBack(obj2,obj3);    
		    });
		});
  });
};


 




//根据用户名查询
dbOperation.findByUsername = function(username,callBack){
    
	conn(function(databaseConnection) {
		databaseConnection.collection('user', function(error, collection) {
			 collection.find({"name":username}).toArray(function(error, results) {
			    callBack(results);    
			 });
		});
	});   
}


//根据用户名查询
dbOperation.findByMisname = function(username,callBack){
    
	conn(function(databaseConnection) {
		databaseConnection.collection('user', function(error, collection) {
			 collection.find({"misName":username}).toArray(function(error, results) {
			    callBack(results);    
			 });
		});
	});   
}



dbOperation.findByName = function(name,callBack){
    
	  if(!name){
	    
		return;
	  }  
	  conn(function(databaseConnection) {
		 databaseConnection.collection('user', function(error, collection) {
			 collection.find({$or:[{name:name},{misName:name}]}).toArray(function(error, results) {
			      //if user not exists return error
				  if(!results.length || error){
           		　　　callBack && callBack({error:0});  
				  }else{
				   　 callBack && callBack({error:1,obj:results}); 
				  }
			 });
		 });
	  });
}



//根据用户名ID查询
dbOperation.findByUserId = function(id,callBack){
    
	conn(function(databaseConnection) {
		databaseConnection.collection('user', function(error, collection) {
			 collection.find({_id:id}).toArray(function(error, results) {
			       callBack(results);
			 });
		});
	});   
}


//根据用户名ID查询
dbOperation.findByUserName = function(name,callBack){
    
	conn(function(databaseConnection) {
		databaseConnection.collection('user', function(error, collection) {
			 collection.find({name:name}).toArray(function(error, results) {
			       
				   callBack(results);
			 });
		});
	});   
}





/*
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
*/ 

dbOperation.loginByUsername = function(name,callBack){
    
	conn(function(databaseConnection) {
		databaseConnection.collection('user', function(error, collection) {
			 collection.find({name:name}).toArray(function(error, results) {
			       if(results.length == 0){
				      callBack({"error":0,"desc":"用户名不存在"}) 
				   }else{
				      callBack({"error":1,"desc":"登录成功"});
				   }	
			 });
		});
	});   
}


module.exports = dbOperation;



/**
   应用程序入口处
**/
 
var http  = require('http');
var qs = require('querystring');
var url = require('url');
var ffAndRealObj = require('./controllers/getFFAndRealName.js');
var imObj = require('./controllers/getDataFromIM.js');
var updateObj = require('./controllers/updateAllUser.js');
var depListObj = require('./controllers/getDepList.js');
var singleUser = require('./controllers/getSingleUserInfo.js');
var userObj = require('./controllers/getUserList.js');
var depOrg = require('./controllers/getDepOrg.js');
var searchUserObj = require('./controllers/searchUser.js');
var msgConf = require('./controllers/setMsgConf.js');


module.exports = function(port){
 
     
        var server  =  http.createServer(function(req,res){
		// console.log('worker'+cluster.worker.id);
		//获取请求的路径
		var pathname = url.parse(req.url,true).pathname;
		var params =  url.parse(req.url,true).query;
		var path = req.url; 
		//路由控制开始
		console.log('开始接收参数'+pathname.trim());
		//主要解开接收者和发送者和标题和内容
		//这个方法是从IM 那边获取用户和部门数据
		
		pathname = pathname.replace(/%20/g,'');
		
		switch(pathname){
		  
		    case '/getOrgAndUser':
		
		      imObj.getIMData({
			     index:10000,
                 res2:res,
                 tempdepPId:10000,
                 depName:'慧聪网'  				
			  });
		   
		    break;
		    
            case '/updateAllUser':
		
		      updateObj.updateAllUser(res,params);
		   
		    break;

            case '/getFFIdAndMisName':
		
		      ffAndRealObj.getFFIdAndMisName(params,res); 
		   
		    break; 			
		    
			case '/getDepList':
		
		      depListObj.get_Dep_List(res,params);
		   
		    break;
			
			case '/getUserInfo':
		
		      singleUser.getSingleUserInfo(params,res);
		   
		    break;
			
			case '/getUserList':
		
		      userObj.getUserList(res,params);
		   
		    break;
			
			case '/getDepOrg':
			
			   depOrg.get_Dep_List(res,params);
			   
			break;
             
			// 搜索联系人接口
			case '/searchUserInfo':
                searchUserObj.searchUser(res,params);
            
			
			break;
			
			//设置消息的开关
			case '/setMsgConf':
                msgConf.setMsg(res,params);
            
			
			break;
			
			
            default :
                res.end('404');   			
		}
		
		
		 
		
		//路由控制结束
    }).listen(port);
}

 
   
   var fs = require('fs');
   var validateParams = require('../util/validateParams.js');
   
   var singleMsg = require('../controllers/getSingleMsg.js');
   var updateMsgObj = require('../controllers/updateMsgState.js');
   var noticeAllObj = require('../controllers/getNoticeList.js');
   var ffAndRealObj = require('../controllers/getFFAndRealName.js');
   var unReadMsg = require('../controllers/getUnReadMsg.js');
   var user = require('../model/user.js');
   var page = require('../model/page.js');
   
   var fs = require('fs');
   function  router(params,pathname,res,startTime){
   
      console.log("pathname==="+pathname);
	  pathname = pathname.replace(/%20/g,'');
      switch(pathname){
	      
		 case "/publicMessage" :
		     
            /*          http://localhost:8080/publicMessage?opt=send&sys=mis&sender=%E9%9F%A9%E5%88%9A&type=1&recevier=%E6%9D%A8%E5%B0%8F%E9%BE%99&info=[{ititle:%27123%27,ict:%27hello%27}]
			*/ 
			//1.先接收参数  然后验证
			console.log(params.info);
            validateParams.valiObj(params,res,startTime); 
				 
	     break;
		  
		  
		 case "/getNoticeList" :
               
               //对外提供一个访问通知的接口 
			   //查找某个人的通知 
               //需要的参数是  接受者的名称  日期  关键字			   
               noticeAllObj.getAllNotice(res,params);
			   
		 break;
          
		 
		 
	    case "/getMessageInfo" :
         
		      
			 singleMsg.getSingleMsg(params,res);
		     break;
		 
		case "/updateMessageState" :
             
             
		    updateMsgObj.updateMsg(params,res,startTime);
			break;
        //2014-09-10 增加新的接口 获取FFId 和 misName 			
        case "/getFFIdAndMisName" :
             
            ffAndRealObj.getFFIdAndMisName(params,res); 
		    
			break;    		
        //2014-09-10 增加新的接口 获取用户的未读消息 			
        case "/getUnReadMsg" :
             
             
		    unReadMsg.findUnReadMsg(params,res);
			break;
		
		case "/getMessageByName" : 			
			    
                user.findByName(params.name,function(data){
				      
				      if(!data.error){
					     res.end('error');
					  }else{
					     res.end(JSON.stringify(data.obj[0].messages));  
					  }
				});
			    break;
		
        case "/findRecordHistory" : 			
			   console.log('查询数据库');    
			   page.getRecordsByPage(params,res);
			   console.log('查询数据库');
			break;		
		default : 			
			res.end("404!");	   
			break;
	    }
    }
	
	exports.router = router;
	

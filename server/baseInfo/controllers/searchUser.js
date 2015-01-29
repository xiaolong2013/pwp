           
		  


            var user = require('../model/user.js'); 
			function searchUser(res,params){
			    
				//1.先验证参数的完整性
				//2.判断参数是数字还是其他
				var cb = params.callback?params.callback:'';
				if(!params.key){
				
				   res.end(cb+'({state:0,msg:\'缺查询参数\'})'); 
				   return;
				}else{
				   params.key = params.key.trim();
				   var reg = /^\d{4}|d{8}|d{11}$/;
                   if(reg.test(parseInt(params.key))){
				     
					   //如果数字的话 就查找 电话或手机
					   user.searchUser(0,parseInt(params.key),function(data){
					       console.info(data);
					       if(!data.error){
						     
							 res.end(cb+'({state:0,msg:"'+data.msg+'",members:'+JSON.stringify([])+'})');
							 
						   }else{
						     
							 var arr = data.msg;
							 var flag = 0;
							 
							 var results = [];
							 arr.forEach(function(e){
							    /*
							    if((params.key.length ==4 || params.key.length ==8) && e.phone.indexOf(params.key) != -1){
								     joinData(e,results,e.phone);
									 flag = 1;
								}else if(params.key.length == 11 && e.cellphone.indexOf(params.key) != -1){
								     joinData(e,results,e.cellphone);
									 flag = 1;
								}else if(params.key.length == 11  && e.phone.indexOf(params.key) != -1){
								     joinData(e,results,e.phone);
								     flag = 1;
							    }else if( (params.key.length == 4 || params.key.length == 8) && e.cellphone.indexOf(params.key) != -1){
								     joinData(e,results,e.cellphone);
									 flag = 1;
								}*/
                                if(e.phone.indexOf(params.key) != -1 && e.cellphone.indexOf(params.key) != -1){
								     joinData(e,results,e.phone,e.cellphone);
									 flag = 1;
								}else if(e.cellphone.indexOf(params.key) != -1){
								     joinData(e,results,'',e.cellphone);
									 flag = 1;
								}else if(e.phone.indexOf(params.key) != -1){
								     joinData(e,results,e.phone,'');
								     flag = 1;
							    } 								
							 });
							 
							 if(!flag){
							    
							    res.end(cb+'({state:0,msg:\'未查到该用户的信息\',members:'+JSON.stringify([])+'})');
							 }else{
							 
							    res.end(cb+'({state:1,members:'+JSON.stringify(results)+'})'); 
							 }
							  
						   }
					  
					   }); 
				   
				   }else{
				   
				   
				       user.searchUser(1,params.key,function(data){
					       
						   if(!data.error){
						     
							  res.end(cb+'({state:0,msg:"'+data.msg+'",members:'+JSON.stringify([])+'})');
							 
						   }else{
						   
                             var arr  = data.msg;						     
							 
							 var temp = [];
							 arr.forEach(function(e){
							 
							    var userName = e.misName?e.misName:e.nickName?e.nickName:e.name;
							    var obj = {
							       ffId:e.name,
								   userName:userName,
							       title:e.title
							    }   
							    temp.push(obj);  
							 
							 });
							  
							 res.end(cb+'({state:1,members:'+JSON.stringify(temp)+'})'); 
						   }
					    }); 
				    } 
                }
				
				
				function  joinData(e,results,phone,cellphone){
				
				    var userName = e.misName?e.misName:e.nickName?e.nickName:e.name;
					 userName += '('+phone+' '+cellphone+')';
					 var obj = {
						ffId:e.name,
						userName:userName,
						title:e.title
					 }
					 results.push(obj);
			    } 
			} 
			 
			exports.searchUser = searchUser; 

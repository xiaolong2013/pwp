          
		  


            var user = require('../model/user.js'); 
			function getSingleUser(params,res){
			    
				//先验证参数的存在
				
				var cb = params.callback?params.callback:'';
				 
                if(!params.name){
				   res.end(cb+'({state:0,msg:\'name 参数为空或有误！\'})'); 
				   return;
				}
				
				params.name = params.name.trim();
				
				user.findByName(params.name,function(data){
				   
				    if(!data.error){
					  
					    res.end(cb+'({state:0,msg:'+params.name+'is not exist})');
					}else{
					
					    data = data.obj;
                        var cellPhone = data[0].cellphone || data[0].cellphone;
                        cellPhone = cellPhone?cellPhone:''; 						
                        
						var obj = {
						        misName:data[0].misName?data[0].misName:'',
                                cellPhone:cellPhone,
                                email:data[0].email,
                                sex:data[0].sex,
                                birthday:data[0].birthday,								
                                signature:data[0].signature,
								phone:data[0].phone,
                                ffId:data[0].name?data[0].name:'',
                                nickName:data[0].nickName?data[0].nickName:'' 								
						}

                        var cb = params.callback?params.callback:'';
                         						
  						res.end(cb+'({state:1,info:'+JSON.stringify(obj)+'})');
					}
				
				});
			} 
			 
			exports.getSingleUserInfo = getSingleUser; 

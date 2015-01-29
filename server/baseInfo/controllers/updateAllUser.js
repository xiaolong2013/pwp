        
		
		var user = require('../model/user.js');
		var http = require('http');
		function  getUserList(res,params){
		     
			/*
			 *
			  所有用户的更新
			*/
		    user.query(function(data){
				
				var result = [];
			    data.forEach(function(e){
				   //result.push({id:e._id,name:e.name});
				   getUserInfo(res,e.name);
				});
				
				/*
				  var cb = params.callback?params.callback:'';
			      res.end(cb+"("+JSON.stringify({state:'success',userList:result,size:data.length})+")");
	            */
			});
	    }
		
	
		
		
		var count = 0;
		function  getUserInfo(res,name){
		    console.log('name==='+name+"count=="+count++);
		    res.end('success');
			var options = {
				  host: 'www.im.hc360.com',
				  port: 80,
				  path: '/iws/vcard/staff.json?to='+name,
				  method: 'GET'
			};
                         
			var req = http.request(options, function(res) {
			  
			  var data="";
			  res.on('data', function (chunk) {
				 data += chunk;
			  });
			  
			  res.on('end',function(){
			    
                var obj = JSON.parse(data);
             	if(!obj.list.length){
				    return;
				}
				var obj2 = {
				      cellphone:obj.list[0].mobile,
				      phone:obj.list[0].phone,
                      email:obj.list[0].email,
                      nickName:obj.list[0].nickname,					  
					  sex:obj.list[0].sex,
					  birthday:obj.list[0].birthday,
					  signature:obj.list[0].signature
				}
                user.upadte({name:name},obj2);
			  });
			});

			req.on('error', function(e) {
			  console.log('problem with request: ' + e.message);
			});
            req.end();
	   }
       
       exports.updateAllUser = getUserList;	   

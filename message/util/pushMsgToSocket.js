
var http = require('http');
function  pushMsgToSocket(recevier,msgObj,infoids,time,sys){
             	
            
			var params = {recevier:recevier,msgObj:msgObj,infoids:infoids,time:time,sys:sys};
			console.log('recevier==='+recevier+'msgObj==='+msgObj);
			var options = {
			    host: 'localhost',
			    port: 7000,
			    //path: '/?recevier='+recevier+'&msgObj='+msgObj, 报错 socket hang up 
				path: '/',
			    method: 'POST',
		    };
                         
			var req = http.request(options, function(res) {
			   
			   
			  var data="";
			  res.on('data', function (chunk) {
				 data += chunk;
			  });
			  
			  res.on('end',function(){
			    
                 var obj = JSON.parse(data);
             	  
				 console.log(obj.state);
			  });
			});

			req.on('error', function(e) {
			   console.log('problem with request: ' + e.message);
			});
			
			//通过以下的方式 解决掉了  socket hang up 的问题
			console.log(require('querystring').stringify(params));
			req.write(require('querystring').stringify(params));
            req.end();
}


exports.pushMsgToSocket = pushMsgToSocket;

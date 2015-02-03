 
var http = require('http');
var qs = require('querystring');
var url = require('url');

var log4js = require('log4js');
log4js.configure("./config/log4js.json");
var logInfo = log4js.getLogger('logInfo');

var io = require('socket.io');


var depObj = require('./util/getDep.js');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
console.log('numCPUs===='+numCPUs);
var user = require('./model/user.js');
var fs = require('fs');
//定义一个 对象 用来存储  用户名  和 socket
//用来存放用户名 和 socket
/* 
io.configure('development', function(){
     
     

    io.set('log level', 1); // reduce logging
    io.set('transports', [
        'websocket'
       , 'flashsocket'
       , 'htmlfile'
       , 'jsonp-polling'
    ]);
	
	/*
	var RedisStore = require('socket.io/lib/stores/redis')
  , redis  = require('socket.io/node_modules/redis')
  , pub    = redis.createClient()
  , sub    = redis.createClient()
  , client = redis.createClient();

io.set('store', new RedisStore({
  redisPub : pub
, redisSub : sub
, redisClient : client
}));

});*/


/*
io.set('log level', 1)
 var RedisStore = require('socket.io/lib/stores/redis')
  , redis  = require('socket.io/node_modules/redis')
  , pub    = redis.createClient()
  , sub    = redis.createClient()
  , client = redis.createClient();

io.set('store', new RedisStore({
  redisPub : pub
, redisSub : sub
, redisClient : client
}));
*/

/* 
var redis = require('socket.io-redis');
io.adapter(redis({ host: 'localhost', port: 6379 }));
*/ 

 
   
// Somehow pass this information to the workers
var onLineCount = 0; 
module.exports = function(port){ 
    /*
	if (cluster.isMaster) {
		console.log('[master] ' + "start master...");

		for (var i = 0; i < numCPUs; i++) {
			 cluster.fork();
		}

		cluster.on('listening', function (worker, address) {
			console.log('[master] ' + 'listening: worker' + worker.id + ',pid:' + worker.process.pid + ', Address:' + address.address + ":" + address.port);
		});
		
		cluster.on('exit', function(worker, code, signal) {
			console.log('worker %d died (%s). restarting...',
			worker.process.pid, signal || code);
			cluster.fork();
		});
	
	
    } else if (cluster.isWorker) {
		console.log('[worker] ' + "start worker ..." + cluster.worker.id);*/   
		var server = http.createServer(function(req,res){
		
			 var pathname = url.parse(req.url,true).pathname;
			 var params =  url.parse(req.url,true).query;
			 var path = req.url;    
			 
             
			 console.log("pathname==="+pathname);
			 
			 if(pathname == '/favicon.ico'){
			   
			    return;
			 }
			 
             if(pathname == '/socket'){
			    
				var data2 = fs.readFileSync('socket_client.html', 'utf-8');
			    res.end(data2);
			     
			 }else{ 
			 
				 var data = "";
				 
				 req.on('data',function(chunk){
					
					 data += chunk;
				 
				 });
				  
				 req.on('end',function(){
				    console.log("接收到的消息=="+data)
					data = decodeURIComponent(data);
					 
					var sys  =     data.split('&')[4] && data.split('&')[4].split('=')[1];
					var time =     data.split('&')[3] && data.split('&')[3].split('=')[1];
					var infoids =  data.split('&')[2] && data.split('&')[2].split('=')[1];
					
					var recevier = data.split('&')[0] && data.split('&')[0].split('=')[1]; 
					
					if(infoids == 'debug'){
					   var msgObj =   data.split('&')[1] && data.split('&')[1].split('=')[1]+'='+data.split('&')[1].split('=')[2];
					   pushMsg(recevier,msgObj,infoids,time);
					}else{
					   
					   var msgObj =   data.split('&')[1] && data.split('&')[1].split('=')[1]; 			
					   msgObj = JSON.parse(msgObj);
					   pushMsg(recevier,msgObj,infoids,time,sys);
					}
					res.end(JSON.stringify({state:'1'}));
				 });
             } 			 
		}).listen(port); 
	
		var io = require('socket.io').listen(server);
		io.set('log level', 4);
		 
         
         
		io.set('transports', [ 'websocket','flashsocket','htmlfile','xhr-polling','jsonp-polling']);
		/*
		 io.configure('development', function () {
		   //io.set('transports', ['websocket', 'xhr-polling']);
		   io.set('transports', ['websocket', 'xhr-polling']);
		   io.enable('debug');
		 });
        */		
		io.sockets.on('connection', function(socket){
        onLineCount++;
		
		console.log('已经连接上==='+onLineCount);
	    logInfo.info("Connection " + socket.id + " accepted.");
	    //当用户连接上时，第一件事就是给用户推送未读的消息  
	     
		socket.emit("version",{version:'123123'},function(arg){
			 console.log('arg==='+arg); 
		});
		
		
	    socket.on('state',function(){
	        socket.emit('heartBeat',{state:1,onlineCount:onLineCount});  
	    });
	  
	    socket.on("username",function(data){
	        logInfo.info("==用户==="+data.username+"===的socketId==="+ socket.id + " accepted.");
	        //此时的用户名 只是为了 建立通道
		    findUserAndJoin(data.username,socket);
	    }); 
      	  
	    socket.on('disconnect', function(){
	        onLineCount--;
	        logInfo.info("Connection " + socket.id + " terminated.");
		    //socket = null;
        });
	  
	    /*
	    socket.on('close',function(){
	        socket = null;  
	    });
		*/
    });
   //}
  
  
	function  pushMsg(recevier,messageObj,infoids,time,sys){
            

           console.log('准备推送消息======');			
		   var socketObj =  io.sockets.clients(recevier);
		   var t = 0;
		   for(var i=0;i<socketObj.length;i++){
				 t++;
				 logInfo.info(recevier+'房间里的socket实例'+socketObj[i].id);  
		   }
		   logInfo.info(recevier+'房间里的socket实例数为'+t); 		   
		   logInfo.info("准备给"+recevier+"发送消息");
		   //io.sockets.in(recevier).emit("message",{message:JSON.stringify(messageObj)},function(arg){
		   
		   var socketObj =  io.sockets.clients(recevier);
           var t = 0;
		   console.log("socketObj==="+socketObj.length);
           for(var i=0;i<socketObj.length;i++){
			     t++;
				 logInfo.info(recevier+'房间里的socket实例'+socketObj[i].id);  
		         if(infoids == 'debug'){
				   
				    socketObj[i]&&socketObj[i].emit("debug",{message:messageObj},function(arg){
                 		   
					   var end = new Date().getTime();	   
					   var total = (end - time)/1000;
					   logInfo.info(recevier+"socketId===="+io.sockets.clients(recevier)[0].id+"消息"+"	"+infoids+"	"+"从客户端返回回执总共花费=="+"	"+total+"秒");
				    });
				 
				 }else{
					 
					//socketObj[i]&&socketObj[i]&&socketObj[i].emit("message",{message:JSON.stringify(messageObj)},function(arg){		   
					socketObj[i] &&(socketObj[i][sys]=='' || socketObj[i][sys] == 1) &&socketObj[i].emit("message",{message:JSON.stringify(messageObj)},function(arg){    		   
					   var end = new Date().getTime();	   
					   var total = (end - time)/1000;
					   logInfo.info(recevier+"socketId===="+io.sockets.clients(recevier)[0].id+"消息"+"	"+infoids+"	"+"从客户端返回回执总共花费=="+"	"+total+"秒");
		            });
				 } 
		   }
		   logInfo.info(recevier+'房间里的socket实例数为'+t); 		   
		   logInfo.info("准备给"+recevier+"发送消息");
		   /*
		   var socket = io.sockets.clients(recevier)[0];
		   socket && socket.emit("message",{message:JSON.stringify(messageObj)},function(arg){   
			   console.log('arg==='+arg);
			   var end = new Date().getTime();	   
			   var total = (end - time)/1000;
			   logInfo.info(recevier+"socketId===="+io.sockets.clients(recevier)[0].id+"消息"+"	"+infoids+"	"+"从客户端返回回执总共花费=="+"	"+total+"秒");
		   });*/
	}


    function  findUserAndJoin(misName,socket){
		
		    console.log('misName===='+misName); 
		    
			//用户进来的时候 先把用户所在的部门 加入到房间   
		    user.findByName(misName,function(data){
		        if(!data.error){
				    //出错
				    return;
				}else{
				   
				   socket.join(misName);
			       data = data.obj;
				   //2014-09-30 把pwp mis ewrok消息开关设置加到socket上
				   socket.pwp   = data[0].pwp?data[0].pwp:'';
				   socket.mis   = data[0].mis?data[0].mis:'';
				   socket.ework = data[0].ework?data[0].ework:'';
				   //建立该用户的相关socket 通道
				   var depId = data[0].departmentId;
				   //查找用户所属的部门
				   depObj.getGroup({
				      depId:depId,
                      socket:socket
                   }); 
				}	  
			}); 			
	}
}　
 


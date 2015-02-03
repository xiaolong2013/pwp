/**
   应用程序入口处
**/
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
module.exports = function(port){
  
    if (cluster.isMaster) {
		 console.log('[master] ' + "start master...");
		 
		  /* 
		  for (var i = 0; i < numCPUs; i++) {
			 cluster.fork();
		  }*/
		
		 //2014-10-13 修改接口为独立的子进程,不是以前的集群
		 
		 cluster.fork('./controllers/updateMsgState.js');
		 cluster.fork('./controllers/getSingleMsg.js');
		 cluster.fork('./controllers/getNoticeList.js');
		 cluster.fork('./controllers/getFFAndRealName.js');
		 cluster.fork('./controllers/getUnReadMsg.js');
		 cluster.fork('./controllers/page.js');
		 cluster.fork('./util/validateParams.js');
	     
         cluster.on('listening', function (worker, address) {
			console.log('[master] ' + 'listening: worker' + worker.id + ',pid:' + worker.process.pid + ', Address:' + address.address + ":" + address.port);
		 });
		
		 cluster.on('exit', function(worker, code, signal) {
			console.log('worker %d died (%s). restarting...',
			worker.process.pid, signal || code);
			cluster.fork();
		 });
	
	
	} else if (cluster.isWorker) {
		 
	    require('./worker')(port);
	}

}

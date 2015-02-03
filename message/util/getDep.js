
/*
   本文件主要功能是 获取组织结构
   并把相应的部门Id 加入到socket中
   @Param
    depId
    socket
    arr
    callback
*/
var department = require('../model/department.js');

function  getDep(option){
     
    department.findBydepartmentId(option.depId,function(data){
	       
		   console.log(12312313+""+option.depId);
		   data = data.obj;
		   var depId = data[0].depId;
	       option.socket && option.socket.join(option.depId);
		   option.arr && option.arr.push(""+depId);
		   if(depId == 10000){
		      option.callback && option.callback(option.arr); 
	          return;
	       } 
		   getDep({
		       depId:data[0].depParentId,
		       socket:option.socket,
		       arr:option.arr,
			   callback:option.callback
		   });
	});
}



exports.getGroup = getDep;

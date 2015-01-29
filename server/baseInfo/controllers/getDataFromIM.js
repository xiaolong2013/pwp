//var bigObj = "";

//用于获取部门的组织结构

var mongo = require('../model/db.js');
var http  = require('http');
/**
   params:需要接收的参数
   index:部门ID
   res:响应对象
   tempdepPId:部门Id
   tempdepName:部门名称
   
**/ 
 
function getData(option){
         
		 var optionsget = {
		    host:"immana.b2b.hc360.com",
			port:80, 
		    path:"/IMManager/getDepInfoForIM.htm?id="+option.index,
			method:"POST"
		 }
		 option.res2.end("success");  
		 var reqGet = http.request(optionsget,function(res){
		     var  da = "";
		     res.on('data',function(data){
			     //显示在页面上                    
			     //process.stdout.write(d);
			     da += data;
		     });
		     
			 res.on('end',function(){
			    //console.log(typeof da);
				//把字符串转化成json 对象
				var data = eval("("+da+")");
			    var departArr = data.departments;
				var members = data.members;
				var _depPId;
                //当到人员时  就没有departments了
				if(departArr.length){
                  //如果有部门的话 	就用现有的			  
				  _depPId  = (departArr[0].depParentId == 0)?10000:departArr[0].depParentId;  
				}else{
				  //如果没有部门的话 就用上次调用的参数
				  _depPId = option.tempdepPId; 
				}
				
                				
				//存储结构修正为 跟FF 接口同样的存储结构 
				//eg:{departmentId:id, department:[{}],members:[{}]}
				//添加人
				addMember(members);
				//添加部门
				addDepartment({
				   depArr:departArr,
				   memArr:members,
				   index:option.index,
				   depName:option.depName,
				   tempdepPId:_depPId,
				   tDPId:option.tempdepPId,
				   res2:option.res2
				}); 
				 
			});
		});
		reqGet.end();
		reqGet.on('error',function(e){
			console.error(e);
		});
};
	

	//添加人
	function  addMember(members){
	
	        members.forEach(function(e){
			   
			     var user = {
					//{"UIn":528043041,"companyId":10000,"departMentId":5405742,"departMentName":"","level":"","nickName":"web前端开发部副经理宋俊刚","onlineId":0,"onlineState":"","strId":"hcsongjungang","typeflag":0,"zhiwu":"web前端开发部副经理"}
					name: e.strId,
					nickName: e.nickName,
					departmentId:e.departMentId,
					title:e.zhiwu,
					onlineState: e.onlineState,
					groups: [],
					phone: 136,
					cellphone: 145,
					icon: "t1.jpg",
					signature: "快乐",
					devId: 1344,
					messages: {}  
				}
			    
				mongo.addUser(user,function(data){
					  if(data.length>0){
						    //添加用户成功
							console.log('user 1');
					  }
				});
			
			
			}); 
	}; 		
	 	 
	//添加部门
    function  addDepartment(option){
	   
	    
	     //把当前部门下的各个部门的ID 存数组里面  便于以后遍历其他部门
				//res.write("<ul>");
				var tempDepIdArr = [];
				var tempDepArr = [];
				var tempDepNameArr = [];
				var tempMembArr = []; 
				option.depArr.forEach(function(e){
				    
					if(e){
					    var department = {
						     
							 depId:e.departmentId,
						     depName:e.departmentName,
						     depParentId:e.depParentId
					    }
						//把部门对象存放在临时的数组里
						tempDepArr.push(department);
						//把部门ID 存放在 一个临时的数组里
						tempDepIdArr.push(e.departmentId);
					    tempDepNameArr.push(e.departmentName);
					}
				});
				
			     
				 
				 
				
				option.memArr.forEach(function(e){
				
				    var user = {      //{"UIn":528043041,"companyId":10000,"departMentId":5405742,"departMentName":"","level":"","nickName":"web前端开发部副经理宋俊刚","onlineId":0,"onlineState":"","strId":"hcsongjungang","typeflag":0,"zhiwu":"web前端开发部副经理"}
							name: e.strId,
							nickName: e.nickName,
							departmentId:e.departMentId,
							title:e.zhiwu
					}
					//把用户添加进临时数组
					tempMembArr.push(user); 
			    });
				
				
				
				//如果有用户的话  就把用户加入该部门
				//现在想修改成的结构是如下 部门ID departments:[]  members:[]
                var model = {
				     depId : option.index,
					 departments : tempDepArr,
					 members: tempMembArr,
			         depParentId:option.tDPId,
					 depName:option.depName
				}
			    
				mongo.add(model,function(data){
				    console.log("department 1");
				});
				
				var count = 0;
				tempDepIdArr.forEach(function(e){
				    getData({
					   index:e,
					   res2:option.res2,
                       tempdepPId:option.tempdepPId,
                       depName:tempDepNameArr[count]    					   
	                });
					count++;
				});
				 
	}
    exports.getIMData = getData;
	

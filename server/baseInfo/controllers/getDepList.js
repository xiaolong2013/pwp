        
		
		var department = require('../model/department.js');
		 
		var user = require('../model/user.js');
		
		function getDepList(res,params){
		       var cb = params.callback?params.callback:'';
		        
			   if(!params.id){
			       res.end(cb+'({state:0,msg:\'id 参数为空或有误!\'}');  
			       return;
			   }
			   
			   params.id = params.id.trim();
		       
			   department.findBydepartmentId(parseInt(params.id),function(data){
				     
					 if(!data.error){
					    res.end(cb+'({state:0,msg:\'the department is not exsit!\'}'); 
					    return;
					 }
					 
					 data = data.obj;
					 
				     var depArr = [];
					 var tempDepArr = data[0].departments;
					 
					 tempDepArr.forEach(function(e){
					 
					    depArr.push({id:e.depId,name:e.depName,parentId:e.depParentId});
					 });
					 
					 var tempMemArr = data[0].members;
					 
				     var memArr = [];
					 
					 if(tempMemArr.length == 0){
					 
					   
					     var cb = params.callback?params.callback:'';
					
				         res.end(cb+"("+JSON.stringify({state:'1',id:data[0].id,depId:data[0].depId,depParentId:data[0].depParentId,departments:depArr,members:memArr})+")");
					     
						 return;
					 }
					 
					 var count = 0;
					 tempMemArr.forEach(function(e){
					    
						
						user.findByName(e.name,function(_data){
						     
							     
                             if(!_data.error){
							    return;
							 }else{
							   
                               _data = _data.obj;
							    
							   _data[0].misName = _data[0].misName?_data[0].misName:'';
                               memArr.push({name:e.name?e.name:'',
							                nickName:_data[0].nickName?_data[0].nickName:'',
										    misName:_data[0].misName?_data[0].misName:'',
										    title:_data[0].title?_data[0].title:'',
										    depId:e.departmentId});
							   
							   if(count == tempMemArr.length-1){
							      var cb = params.callback?params.callback:'';
					              res.end(cb+"("+JSON.stringify({state:1,id:data[0].id,depId:data[0].depId,depParentId:data[0].depParentId,departments:depArr,members:memArr})+")");  
							   } 
							}  							   
						    count++;
						});
					    
					 
					 });
					 
					  
	           });
		
		}
		
		exports.get_Dep_List = getDepList;

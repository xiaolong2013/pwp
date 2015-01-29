        
		
		var department = require('../model/department.js');
		 
		var user = require('../model/user.js');
		
		var fs = require('fs');
		function getDepList(res,params){
		
		       
		    department.query(function(data){
			     
				 var depOrg = {};
				 depOrg.departments = [];
				 depOrg.members = [];
				 
				 //遍历部门
				 for(var i=0;i<data.length;i++){
				    var obj = {
					    id:data[i].depId,
					    name:data[i].depName,
						parentId:data[i].depParentId
					}
				    depOrg.departments.push(obj);
				 }
				 
				 //查找用户并且遍历 
				 user.query(function(du){
				   
				       
					for(var i=0;i<du.length;i++){
					   
					   var du_obj = {
					        name:du[i].name,
                            misName:du[i].misName,
                            title:du[i].title,							
					        depId:du[i].departmentId
					   }
					   depOrg.members.push(du_obj);
					}
				    
					fs.writeFile('/assets/pwp/depList.js', 'var departmentList='+JSON.stringify(depOrg), function (err) {
					   if (err) throw err;
					   console.log('It\'s saved!');
					   var cb = params.callback?params.callback:'';
					   res.end(cb+'({state:1})');
					});    
				 });  
			}); 
		
		}
		
		exports.get_Dep_List = getDepList;

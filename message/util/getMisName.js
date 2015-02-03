

 


    var user = require('../model/user');
    function  getMisName(misName,callback){
	
	                    
	        
	        getFromMis(misName,callback)
	
	
	}



    function getFromMis(misName,callback){
	
	            var soap = require('soap');
		        var url = 'http://ehr.inc.hc360.com/services/EhrHc360WS?wsdl';
		        var args = {userId: misName};
		        soap.createClient(url, function(err, client) {
					client.getUserInfoByUserId(args, function(err, result) {
						   var  info = result.out;
						   var misName = info.substring(info.indexOf("<name>")+"<name>".length,info.indexOf("</name>"));
						   var ffId = info.substring(info.indexOf("<im>")+"<im>".length,info.indexOf("</im>"));
						   
						   
						   if(misName.indexOf('<')!=-1 && ffId.indexOf('<')!=-1){
		  
		                      callback && callback(0);
		                   }else{
						      updateUser(ffId,misName,callback);
						   }
					});
				});	
	}
	
	
	function updateUser(ffId,misName,callback){
		
		    user.findAndUpdate({name:ffId},{misName:misName},function(){
				   
				callback && callback(1);
			     
		    });
	}
	
	
	
	exports.getMisName = getMisName;

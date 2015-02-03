    var log4js = require('log4js');
    log4js.configure("./config/log4js.json");
    var logInfo = log4js.getLogger('logInfo');         
	var msgCtrol = require('../controllers/msgCtrol.js');		
	var user = require('../model/user.js');
    var department = require('../model/department.js');
    var misObj = require('./getMisName.js');	
	function  validate(params,res,time){		
			logInfo.info("开始验证参数==="+params+"==="+new Date().getMinutes()+":"+new Date().getSeconds()+":"+new Date().getMilliseconds());
			if(params.opt == undefined || params.opt == '' || params.opt != 'send'){
			     errTip(0,params,res,'opt');
				 return;
			} 
			 
			//验证sys
			if(params.sys == undefined || params.sys == ''){
			    errTip(0,params,res,'sys');
                return;				
			}
			
		    if(params.sys && (params.sys != 'pwp' && params.sys != 'mis' && params.sys != 'ework')){
			   errTip(0,params,res,'sys');
			   return;
			}
			
			
			//验证 type
			if(!params.type || parseInt(params.type)< 1 || parseInt(params.type) > 4){
			   
			    errTip(0,params,res,'type');
				return;
			}
			
             
			
			//验证 type opt
			if(params.type == 2 || params.opt == 'search'){
		        errTip(1,params,res,'opt');
				return;
			}
			
		    //接下来验证info
		    if(params.info == undefined || params.info == ''){
			    
			    errTip(0,params,res,'info');
				return;
			}
			
			//如果info不为空的话 并且不是数组的话  或者数组的值为空 也返回
			
			try{
			    eval(params.info);
			}catch(e){
			    errTip(0,params,res,'info');
			    console.log(e.message);
				return;
			}
            var _tempObj = eval(params.info);			
			if(!(_tempObj instanceof Array) || _tempObj.length == 0){
			    errTip(0,params,res,'info');
				return;
			}
			//主要验证info 里面的参数不为空
            var count=0;
            var flag = false;			
		    _tempObj.forEach(function(e){
			    
                 
                 if((params.type == 1 || params.type == 2) && (!e.ict || e.ict == '' || typeof(e.ict)!= 'string')){
				       errTip(0,params,res,'ict');
					   flag = true;
					   return;
				 }else if((params.type == 3 || params.type == 4) && (( !e.ititle || typeof(e.ititle) != 'string') || (!e.ict || typeof(e.ict)!= 'string'))){
				       errTip(0,params,res,'ict,ititle');
					   flag = true;
                       return;					   
				 }
				 
				 //编码
				 if(params.type == 3 || params.type == 4 || (params.type == 1 && params.sys == 'ework')){
				     logInfo.info('没有编码的标题==='+e.ititle);
					 logInfo.info('编码以后的标题==='+encodeURIComponent(e.ititle));
					 _tempObj[count].ititle = encodeURIComponent(e.ititle);
			     }
				 logInfo.info('没有编码的内容==='+e.ict);
			     logInfo.info('编码以后的内容==='+encodeURIComponent(e.ict));
				 _tempObj[count].ict = encodeURIComponent(e.ict);
			     count++;
				  
			 });
             
			 if(flag){
			    return;
			 }
			 //先验证一下 recevier 和 sender
			 if(params.recevier == undefined || (params.recevier == '' && params.type != 4) || !params.sender){
			           errTip(0,params,res,'recevier');
                       return;
			 }			 
			
			 //验证一下 type == 4
   			 if(params.type == 4 && params.recevier != ''){
			    
				       errTip(0,params,res,'type');
                       return;
			 }
			 
			 //验证一下 ework
			 if(params.sys == 'ework'){
			    
				try{
			       eval(params.recevier);
				   eval(params.copier);
			    }catch(e){
				   errTip(0,params,res,'recevier or copier is not a array instance');
			       return;
			    }
                
				var _reObj = eval(params.recevier);
                var _cpObj = eval(params.copier);
			    if((!_reObj instanceof Array) || _reObj.length == 0 || (!_cpObj instanceof Array)){
			       errTip(0,params,res,'recevier or copier is not a array instance');
				   return;
			    }
			 }
			 
			 if(params.sys == 'ework'){
				 var _reObj = eval(params.recevier);
				 
				 if(!(_reObj instanceof Array && _reObj.length != 0 && params.type == 1 && params.sys == 'ework' && params.sender == 'ework')){
				    errTip(0,params,res,'ework');
					return; 
				 }
			 }
			 
			 if(params.sender == undefined || params.sender == '' && params.type != 4 ){
			      
			    errTip(0,params,res,'sender');
                return;
			 }
			 
			  
             //剩下 验证 recevier 和 sneder 的合法性了		重点验证 null 和 sys 设置范围 如 pwp mis ff 这些值	
		     if(params.sys == 'ework'){
			   
              //直接验收接收者 接收者为数组  
			  var reObj = eval(params.recevier);
			  //2014-8-22  暂时先将抄送者的数据直接拷贝到接收者
			  var cpObj = eval(params.copier);
			  
			  reObj = reObj.concat(cpObj);
			   
              reObj.forEach(function(e){
			     
				user.findByName(e,function(data){
			     
			      if(!data.error){
				      logInfo.info(e+"用户在本系统不存在");
					  //如果用户不存在的话,先去mis那边找一次,如果没有找到该用户,就返回错误
				    misObj.getMisName(e,function(tag){
				      if(!tag){
						   logInfo.info(e+"用户在mis系统不存在");
						   //就算该用户不存在的话 也不返回只是不给当前这个人发送
						   errTip(0,params,res,'sender or copier'+e);
                           //return; 						   
					  }else{
						   //执行不同的分类
						    msgCtrol.msgObj({
								   params:params,
								   res:res,
								   time:time,
								   recevier:e
							});
					  }
				    });
				  }else{
				    msgCtrol.msgObj({
							params:params,
							res:res,
							time:time,
							recevier:e
					});
			     }
			    });          
			         
			  
			  });
			}else{
			  user.findByName(params.sender,function(data){
			     
			    if(!data.error){
				    
					//如果用户不存在的话,先去mis那边找一次,如果没有找到该用户,就返回错误
				    misObj.getMisName(params.sender,function(tag){
				        if(!tag){
						   errTip(0,params,res,'sender'+params.sender); 
						   return;
						}else{
						   //执行不同的分类
						   dType(params,res,time);
					    }
				    });
				}else{
				
				    dType(params,res,time);
				
				}
			  });
		   }	 
	}		
	

     

	
    
	function  errTip(tag,params,res,obj){
	      
		  if(!tag){
		     var errStr = obj+'参数为空或有误';
		  }else{
		     var errStr = obj+'该功能暂未开放';
		  }
		  
		  var cb = params.callback?params.callback:'';   
	      if(cb){
		    res.end(cb+"("+JSON.stringify({state:0,errMsg:errStr})+")");
		  }else{
		    res.end(JSON.stringify({state:0,errMsg:errStr}));
		  }
    }			
	

    function dType(params,res,time){
	     
	    if(params.type == 1){
					      
			user.findByName(params.recevier,function(data){ 
			
				if(!data.error){
					
					misObj.getMisName(params.recevier,function(tag){
						  
							if(!tag){
							   
							   errTip(0,params,res,'recevier'+params.recevier); 
							
							}else{
							   //执行不同的分类
							    
							   msgCtrol.msgObj({
								   params:params,
								   res:res,
								   time:time
							   });    
							
							}
					});
				}else{
				  
				    msgCtrol.msgObj({
						params:params,
						res:res,
						time:time
					});
			    }
			});
					   
		}else if(params.type == 2){
		 
		   //验证群是否存在
		 
		}else if(params.type == 3){
		   //验证部门是否存在   
			
			department.findBydepartmentId(parseInt(params.recevier),function(data){
			   
			   if(!data.error){
				 errTip(0,params,res,'recevier'+params.recevier);
				 return;						
			   }
			   
			   msgCtrol.msgObj({
				   params:params,
				   res:res,
				   time:time
			   });
			});
		
		}else if(params.type == 4){
		 
			msgCtrol.msgObj({
			   params:params,
			   res:res,
			   time:time
			});                         
		}
	}

	
	exports.valiObj = validate;	
			

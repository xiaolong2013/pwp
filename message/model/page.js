 
 
 /**
 
   主要用于计算分页
 
 **/ 
  
 var msgObj = require('./messages.js'); 
  
 //定义分页对象 
 var PageModel = {
     
	 pageSize:20, //每页显示的条数
 
     startPage:0, //起始页
 
     tatolPage:0, //总页数
 
     totalRecords:0, //总共的记录
	 
	 calTatolPage:function(){
	    if(countRecords == 0){
		   return 0; 
		}else{
	       return  (countRecords % pageSize == 0) ? countRecords / pageSize:countRecords / pageSize + 1;
	    }
	 },
	 
	 calStartCusor:function(startPage,pageSize){
	     
         if(startPage == 0){
		   startPage = 1;
		 }
		 
		 return ((startPage - 1) * pageSize + 1)<=0 ? 0:(startPage - 1) * pageSize + 1;
		  
	 },
	 
	 calEndCusor:function(start,pageSize){
	 
	     return (start + pageSize - 1)<=0 ? 0:start + pageSize - 1; 
	 }
 } 
 
 
 function getRecordsByPage(params,res){
      
     /*  
	   params.iDisplayStart   //开始页
	   params.iDisplayLenght  //每页包含条数 
       params.sSearch         //搜索关键字（匹配消息的发送者、标题、内容，也可以多个关键字匹配，以空格分隔多个关键字）
       params.sDate           //起始日期
       params.eDate           //结束日期 	 
       params.msgType         //消息类型(值为1：pwp；2：mis；3：ework;可以多选,例如：'1,2,3'以逗号分隔)
	   params.iSortCol_0      //排序字段（值为1：发送者；2：接受者；3：消息类型；4：消息标题；5：消息内容；6：发送日期）
       params.sSortDir_0      //asc、desc（升序和降序）  
     */
	 //http://192.168.44.244:8884/findRecordHistory?iDisplayStart=2&iDisplayLenght=10&sSearch=66666 77777&sDate=2014-09-10&eDate=2014-09-30&msgType=1,2&iSortCol_0=senderName&sSortDir_0=asc
     //搜素关键字
	 params.sSearch  = params.sSearch?params.sSearch.trim():'';
	 
	 var keyWordsArr = (params.sSearch.indexOf(" ")!=-1)?params.sSearch.split(' '):(params.sSearch?params.sSearch:'');
	 //消息类型
	 var typeArr     = (params.msgType.indexOf(',')!=-1)?params.msgType.split(','):(params.msgType?params.msgType:'');
     //消息类型
	 var apaterMsgType  = ['pwp','mis','ework'];
	 //排序字段
	 var apateriSortCol_0 = ['senderName','recevierName','type','title','content','sendTime'];
	 //开始位置
	 //var start = PageModel.calStartCusor(parseInt(params.iDisplayStart),parseInt(params.iDisplayLength));
	 var start = parseInt(params.iDisplayStart);
	 //结束位置
	 var end = PageModel.calEndCusor(start,parseInt(params.iDisplayLength));
	 var cb = params.callback?params.callback:'';	 
	 var obj =  {
					keyWordsArr:keyWordsArr,
					typeArr:typeArr,
					apaterMsgType:apaterMsgType,
					sortBy:apateriSortCol_0[parseInt(params.iSortCol_0)-1],
					isAsc:(params.sSortDir_0 == 'asc')?1:-1,
					start:start,
					templen:parseInt(params.iDisplayLength),
					startDate:(function(){
					   
					     var sd = params.sDate?params.sDate.replace(/\//g,'-'):'';
						 
						 var yyyy = sd.split('-').length>0?sd.split('-')[0]:'';
						 var mm =   sd.split('-').length>1?sd.split('-')[1]:'';
                         var dd =   sd.split('-').length>2?sd.split('-')[2]:'';
    				     
                         mm = mm<10?'0'+mm:mm;
                         dd = dd<10?'0'+dd:dd;  						 
				         
                         return yyyy+'-'+mm+'-'+dd; 						 
					})(),
					endDate:(function(){
					   
					   var sd = params.eDate?params.eDate.replace(/\//g,'-'):'';
						 
					   var yyyy = sd.split('-').length>0?sd.split('-')[0]:'';
					   var mm =   sd.split('-').length>1?sd.split('-')[1]:'';
                       var dd =   sd.split('-').length>2?sd.split('-')[2]:'';
    				     
                       mm = mm<10?'0'+mm:mm;
                       dd = dd<10?'0'+dd:dd;  						 
				       return yyyy+'-'+mm+'-'+dd;
					})()
				}
	  
	 msgObj.findRecordHistory(obj,function(data){
				 		 
	         if(!data.error){
			    
				res.end(cb+'({state:0})');
			 }else{
			    
				//组装数据
                
                /*			    
				{
					aaData:[
						[消息id，发送者，接受者，消息类型，消息标题，消息内容，发送日期]，
						.........
					],
					iTotalDisplayRecords:消息的总条数,
					iTotalRecords:消息的总条数,
					sEcho:自增的变量（测试发现，每请求一次此值自增加1）
				};
				*/
				var obj = data.obj;
				var _data = {};
				_data.aaData = [];
				_data.sEcho = params.sEcho?params.sEcho:0;
				
				/*
				msgObj.query(function(result){
				
				     if(!result.error){
					     
					    res.end(cb+'({state:0})');
					 }else{
					     
					 */ 	 
						 
					    _data.iTotalDisplayRecords = data.total;
					    _data.iTotalRecords =   data.total;
					   
				        obj.forEach(function(e){
				            
							e.title   = decodeURIComponent(e.title);
							e.content = decodeURIComponent(e.content);
				            if(e.title.length > 20){
							  
							    e.title = '<span class="show">'+e.title.substring(0,20)+'...</span><span class="hide">'+e.title+'</span>';
							} 
                            
                            if(e.content.length > 40){
							
							    e.content = '<span class="show">'+e.content.substring(0,40)+'...</span><span class="hide">'+e.content+'</span>';
							}							
							 
				            _data.aaData.push([e._id,e.senderName,e.recevierName,e.sys,e.title,e.content,e.sendTime]);   
				            
				        });	   
					    
					    res.end(cb+'({state:1,msg:'+JSON.stringify(_data)+'})');
					 //}
				//});
			}					 
						 
	 }); 
 }
  
 exports.getRecordsByPage = getRecordsByPage;
 
 
   
 
 
 
 
 
 


//数据选择数组模式

//客户
var account_field_arr=new Array('account_id','hd_account_id');
var account_value_arr=new Array('account_name','id');
//联系人
var contact_field_arr=new Array('contact_id','hd_contact_id');
var contact_value_arr=new Array('contact_name','id');
//机会
var opportunity_field_arr=new Array('opportunity_id','hd_opportunity_id');
var opportunity_value_arr=new Array('opportunity_name','id');
//订单
var order_field_arr=new Array('order_id','hd_order_id');
var order_value_arr=new Array('order_name','id');
//报价单
var quotation_field_arr=new Array('quotation_id','hd_quotation_id');
var quotation_value_arr=new Array('quotation_title','id');
//供应商
var supplier_field_arr=new Array('supplier_id','hd_supplier_id');
var supplier_value_arr=new Array('supplier_name','id');
//供应商联系人
var suppliers_contact_field_arr=new Array('suppliers_contact_id','hd_suppliers_contact_id');
var suppliers_contact_value_arr=new Array('supplier_contact_name','id');
//仓库
var depository_field_arr=new Array('depository_id','hd_depository_id');
var depository_value_arr=new Array('depository_name','id');
//产品类别
var product_type_field_arr=new Array("hd_product_type_id","product_type_id");
var product_type_value_arr=new Array("id","product_type_name");
//采购订单
var purchase_order_field_arr=new Array("hd_purchase_order_id","purchase_order_id");
var purchase_order_value_arr=new Array("id","purchase_name");
function SelectData(entity,field_arr,value_arr,where_arr)//选择外部关联数据
{
	if(entity=='null' || field_arr==null || value_arr==null){
		alert(td_lang.crm.inc.msg_28);
		return false;	
	}
	var data_cnt=field_arr.length;
  var theURL="/module/crm2010/select/?entity="+entity;
  entity_obj=document.getElementById("entity");
  if(entity_obj){
	entity_obj.value=entity;
  }
  for(i=0;i<data_cnt;i++){
	theURL+="&ctrl_field"+i+"="+field_arr[i]+"&ctrl_value"+i+"="+value_arr[i]+"&selected_field"+i+"="+value_arr[i]+"&selected_value"+i+"="+document.getElementById(field_arr[i]).value;
  }
  var where_cnt=0;
  if(where_arr!=null && where_arr!=undefined){
		for(var key in where_arr){
			field=key;
			var value_obj=document.getElementById(where_arr[key]);
			if(key=="not_null" || key=="not_null1" ){
				if(value_obj.value==""){
					if(key=="not_null1"){
						alert(td_lang.crm.inc.msg_29);
						return false;
					}
					alert(td_lang.crm.inc.msg_30);
					return false;
				}
				continue;
			}
			if(value_obj){
				value=value_obj.value;
				if(value==""){
					continue;
				}
			}else{
				continue;
			}
			theURL+="&where_field"+where_cnt+"="+field+"&where_value"+where_cnt+"="+value;
			where_cnt++;
		}
  }
  theURL+="&data_cnt="+data_cnt+"&where_cnt="+where_cnt;
  //alert(theURL);
 // return false;
 var openWidth = 900;
	var openHeight = 450;
	var loc_x = (screen.availWidth - openWidth) / 2;
	var loc_y = (screen.availHeight - openHeight) / 2;
  window.open(encodeURI(theURL),"select_data","height=500,width=720,status=1,toolbar=no,menubar=no,location=no,scrollbars=yes,top=120,left="+ loc_x +",resizable=no");
}

function SelectDeptSingleByFormName(MODULE_ID,TO_ID, TO_NAME, PRIV_OP, FORM_NAME)	//支持form名称参数
{
  URL="/module/dept_select_single/?MODULE_ID="+MODULE_ID+"&TO_ID="+TO_ID+"&TO_NAME="+TO_NAME+"&PRIV_OP="+PRIV_OP+"&FORM_NAME="+FORM_NAME;
  loc_y=loc_x=200;
  if(is_ie)
  {
     loc_x=document.body.scrollLeft+event.clientX-100;
     loc_y=document.body.scrollTop+event.clientY+170;
  }
  LoadDialogWindow(URL,self,loc_x, loc_y, 200, 350);
}

function ClearData(field_arr){//清除外关联字段
	if(field_arr.constructor==Array){
		var len=field_arr.length;
		for(var i=0; i<len; i++){
			document.getElementById(field_arr[i]).value="";
		}
	}

}

function getRealDate(kind,start,end){
	var start_value="";
	var end_value="";
	switch(kind){
		case "1":
			start_value=getPrevYearStart();
			end_value=getPrevYearEnd();
			break;
		case "2":
			start_value=getCurYearStart();
			end_value=getCurYearEnd();
			break;
		case "3":
			start_value=getNextYearStart();
			end_value=getNextYearEnd();
			break;
		case "4":
			start_value=getPrevQuarterStartDate();
			end_value=getPrevQuarterEndDate();
			break;
		case "5":
			start_value=getCurQuarterStartDate();
			end_value=getCurQuarterEndDate();
			break;
		case "6":
			start_value=getNextQuarterStartDate();
			end_value=getNextQuarterEndDate();
			break;
		case "7":
			start_value=getPrevMonthStartDate();
			end_value=getPrevMonthEndDate();
			break;
		case "8":
			start_value=getCurMonthStartDate();
			end_value=getCurMonthEndDate();
			break;
		case "9":
			start_value=getNextMonthStartDate();
			end_value=getNextMonthEndDate();
			break;
		case "10":
			start_value=getPrevWeekStartDate();
			end_value=getPrevWeekEndDate();
			break;
		case "11":
			start_value=getCurWeekStartDate();
			end_value=getCurWeekEndDate();
			break;
		case "12":
			start_value=getNextWeekStartDate();
			end_value=getNextWeekEndDate();
			break;
		case "13":
			start_value=getPrevDay();
			end_value=getPrevDay();
			break;
		case "14":
			start_value=getCurDay();
			end_value=getCurDay();
			break;
		case "15":
			start_value=getNextDay();
			end_value=getNextDay();
			break;
	}
	var start_obj=document.getElementById(start);
	var end_obj=document.getElementById(end);
	if(start_obj){
		start_obj.value=start_value;
	}
	if(start_obj){
		end_obj.value=end_value;
	}
}

function getOpportunityReltProduct(entity,opportunity_obj,hd_account_obj,show_account_obj,hd_contact_obj,show_contact_obj){//商机
	var opportunity_id=opportunity_obj.value;
	var data="entity="+entity+"&id="+opportunity_id;
	var url="/module/crm2010/select/getData.php";
	if($.ajax==undefined){//如果未定义则退出
		return;
	}
	$.ajax({
		type:'post',
		data: data,
		url: url,
		success: function(responseText){
			eval(responseText);
		}
	});
	if(opportunity_id==""){
		return;
	}
	getReltFieldValue(entity,opportunity_obj,hd_account_obj,show_account_obj,hd_contact_obj,show_contact_obj,null,null);
	
}
function getReltFieldValue(entity,obj,hd_account_obj,show_account_obj,hd_contact_obj,show_contact_obj,hd_opportunity_obj,show_opportunity_obj,order_amount){
	//alert("上次为:"+lastEntity);
	var obj_id=obj.value;
	if(obj_id==""){
		lastEntity=entity;
		return;
	}
	var data="entity="+entity+"&id="+obj_id;
	var url="/module/crm2010/select/getValue.php";
	$.ajax({
		type:'post',
		data: data,
		url: url,
		success: function(responseText){
			var str_arr=responseText.split("|");
			var flag=str_arr[0];
			if(flag=="ok"){	
				var account_id=str_arr[1];
				var account_name=str_arr[2];
				var contact_id=str_arr[3];
				var contact_name=str_arr[4];
				var opportunity_id=str_arr[5];
				var opportunity_name=str_arr[6];
				if(document.getElementById(hd_account_obj).value!=account_id){
					document.getElementById(hd_account_obj).value=account_id;
				}
				if(document.getElementById(show_account_obj).value!=account_name){
					document.getElementById(show_account_obj).value=account_name;
				}
				if(entity=="order_select"){
					order_amount_value = str_arr[3];
					if(document.getElementById(order_amount).value!=order_amount_value){
						document.getElementById(order_amount).value=order_amount_value;
					}
					return false;
				}
				if(hd_contact_obj!="null" && document.getElementById(hd_contact_obj)){
					if(document.getElementById(hd_contact_obj).value!=contact_id){
						entity_obj=document.getElementById("entity");
						if(entity_obj){
							if(entity_obj.value=="quotation_select" && lastEntity=="opportunity_select"){
						
							}else{
								document.getElementById(hd_contact_obj).value=contact_id;
							}
						}else{
							document.getElementById(hd_contact_obj).value=contact_id;
						}
						
					}
				}
				if(document.getElementById(show_contact_obj) && show_contact_obj!="null"){
					if(document.getElementById(show_contact_obj).value!=contact_name){
						entity_obj=document.getElementById("entity");
						if(entity_obj){
							if(entity_obj.value=="quotation_select" && lastEntity=="opportunity_select"){
							
							}else{
								document.getElementById(show_contact_obj).value=contact_name;
							}
						}else{
							document.getElementById(show_contact_obj).value=contact_name;
						}
					}
				}
				
				if(entity=="quotation_select" || entity=="purchase_order_select"){
					if(document.getElementById(hd_opportunity_obj).value!=opportunity_id){
						if(document.getElementById('flag')){
							if(opportunity_id==""){
								document.getElementById('flag').value='empty';
							}else{
								document.getElementById('flag').value='full';
							}
						}
						document.getElementById(hd_opportunity_obj).value=opportunity_id;
					}
					if(show_opportunity_obj!=null){
						if(document.getElementById(show_opportunity_obj).value!=opportunity_name){
							document.getElementById(show_opportunity_obj).value=opportunity_name;
						}
					}
				}
			}
		}
	});
	lastEntity=entity;
}


function AttachEvent(target, eventName, handler, argsObject){ 
	var eventHandler = handler; 
	if(argsObject){ 
		eventHandler = function(e){ 
		handler.apply(e, argsObject); 
		} 
	}else{ 
		eventHandler = handler; 
	} 
	if(window.attachEvent){ 
		target.attachEvent("on" + eventName, eventHandler ); 
	}else{ 
		target.addEventListener(eventName, eventHandler, false); 
	} 
}

function clearRealContact(clearArr){//清除关联字段信息
	for(var key in clearArr){
		var obj=document.getElementById(clearArr[key]);
		if(obj){
			obj.value="";
		}
	}
}
function jumpProtal(protal_id, protal_title, protal_url){
	if(window.parent.openURL ){
		var parent_str = window.parent.location.toString();
		var parent_flag = parent_str.indexOf("nav.php");
		if(parent_flag < 0){
			window.parent.openURL(protal_id, protal_title, protal_url);
		}else{
			window.location.href = protal_url;
		}
	}else if(window.parent.parent.openURL){
		var parents_str = window.parent.parent.location.toString();
		var parents_flag = parents_str.indexOf("nav.php");
		if(parents_flag < 0){
			window.parent.parent.openURL(protal_id, protal_title, protal_url);
		}else{
			window.parent.location.href = protal_url;
		}		
	}else{
		window.location.href = protal_url;
	}
}

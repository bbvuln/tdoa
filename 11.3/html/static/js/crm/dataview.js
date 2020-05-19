function getSearchUrl(fields, ctrls, ops){
    var url = "";
    if(typeof fields == undefined || fields == null){ 
        return "&cnt=0";
    }
    
	var cnt = 0;
    for(var i = 0; i < fields.length; i++){
	
        var ctrlObj = document.getElementById(ctrls[i]);

		if(ctrlObj!=null && ctrlObj.value!=''){
			url += "&field"     + cnt + "=" + fields[i];
			url += "&value"     + cnt + "=" + ((ctrlObj == null) ? "" : ctrlObj.value);
	        url += "&op"        + cnt + "=" + ops[i];
			cnt++;
		}

    }
    url += "&cnt=" + cnt;
	
    return url;
}

function getCurSearchUrl(){
	var url = "";
    var cnt  = getQueryString("cnt");
	if(cnt != null){
		for(var i = 0; i < cnt; i++){
			url += keepQueryString("field" + i, "&");
			url += keepQueryString("value" + i, "&");
			url += keepQueryString("op" + i, "&");
		}
		url += keepQueryString("cnt", "&");
	}else{
		url += setQueryString("cnt", "0", "&");
	}
	url += getCurReturnDataUrl();
	return url;
}

function gotoViewPageByOrder(orderByField){
    var url = window.location.pathname;
    var CUR_PAGE  = getQueryString("CUR_PAGE");
    if(CUR_PAGE == null){
        url += setQueryString("CUR_PAGE", "1", "?");
    }else{
        url += setQueryString("CUR_PAGE", CUR_PAGE, "?");
    }

    url += getCurSearchUrl();

    
    var ORDERTYPE  = getQueryString("ORDERTYPE");
    if(ORDERTYPE == null || ORDERTYPE == "" || ORDERTYPE == "ASC"){
        url += setQueryString("ORDERFIELD", orderByField, "&");
        url += setQueryString("ORDERTYPE", "DESC", "&");
    }else if(ORDERTYPE == "DESC"){
        url += setQueryString("ORDERFIELD", orderByField, "&");
        url += setQueryString("ORDERTYPE", "ASC", "&");
    }

    this.document.location.href = url;
}
function gotoViewPageByProdct(orderByField){
    var url = window.location.pathname;
    var CUR_PAGE  = getQueryString("CUR_PAGE");
    if(CUR_PAGE == null){
        url += setQueryString("CUR_PAGE", "1", "?");
    }else{
        url += setQueryString("CUR_PAGE", CUR_PAGE, "?");
    }

    url += getCurSearchUrl();

    
    var ORDERTYPE  = getQueryString("ORDERTYPE");
    if(ORDERTYPE == null || ORDERTYPE == "" || ORDERTYPE == "ASC"){
        url += setQueryString("ORDERFIELD", orderByField, "&");
        url += setQueryString("ORDERTYPE", "DESC", "&");
    }else if(ORDERTYPE == "DESC"){
        url += setQueryString("ORDERFIELD", orderByField, "&");
        url += setQueryString("ORDERTYPE", "ASC", "&");
    }
	var PROD_TYPE = document.getElementById('PROD_TYPE').value;
	url += '&PROD_TYPE=' + PROD_TYPE;
    this.document.location.href = url;
}
function gotoViewPage(page){
    var url = window.location.pathname;

	url += setQueryString("CUR_PAGE", page, "?");
	
    url += getCurSearchUrl();

	url += keepQueryString("entity", "&");	
	url += keepQueryString("ORDERFIELD", "&");	
	url += keepQueryString("ORDERTYPE", "&");
	if(document.getElementById('searchType')){
		url += '&searchType=' + document.getElementById('searchType').value;
	}
	if(document.getElementById('PROD_TYPE')){
		url += '&PROD_TYPE=' + document.getElementById('PROD_TYPE').value;
	}
    this.document.location.href = url;
}

function getCurReturnDataUrl(){
	var url="";
	var data_cnt = getQueryString("data_cnt");
	if(data_cnt != null){
		for(var i = 0; i < data_cnt; i++){
			url += keepQueryString("ctrl_field" + i, "&");
			url += keepQueryString("ctrl_value" + i, "&");
			url += keepQueryString("selected_field" + i, "&");
			url += keepQueryString("selected_value" + i, "&");
		}
		url += keepQueryString("data_cnt", "&");
	}else{
		url += setQueryString("data_cnt", "0", "&");
	}
	return url;
}
function gotoViewPageBySearch(fields, ctrls, ops){
	var url = window.location.pathname;
	url += setQueryString("CUR_PAGE", "1", "?");
    //url += getCurSearchUrl();
	url += getCurReturnDataUrl();
	url += keepQueryString("entity", "&");
	url +=getSearchUrl(fields, ctrls, ops);
	url += keepQueryString("ORDERFIELD", "&");	
	url += keepQueryString("ORDERTYPE", "&");
	if(document.getElementById('searchType')){
		url += '&searchType=' + document.getElementById('searchType').value;
	}
	if(document.getElementById('PROD_TYPE')){
		url += '&PROD_TYPE=' + document.getElementById('PROD_TYPE').value;
	}
    this.document.location.href = url;
}

/*
 *  选择所有的行
 */
function select_all(state){ 
	var objs = document.getElementsByTagName("input");
	for(var i=0; i<objs.length; i++){
		if(objs[i].type.toLowerCase() == "checkbox" 
				&& objs[i].name.toLowerCase() == "selected_id"){
			objs[i].checked = state;
		}
	}
}

/*
 *  判定所有行是否已经全部选择
 */
function is_all_select() {  //判定是否全选
	var objs = document.getElementsByTagName("input");
	for(var i=0; i<objs.length; i++) {
		if(objs[i].type.toLowerCase() == "checkbox" 
			&& objs[i].name.toLowerCase() == "selected_id"
			&& objs[i].checked == false){
			return false;
		}
	}
	return true;
}

function check_object(obj){
	if(obj.checked){
		if(is_all_select()){
			document.all.selectall.checked = true;
		}
	}else{
		document.all.selectall.checked = false;
	}
}

function get_select_id(){
	var objs = document.getElementsByTagName("input");
	var selectIdsObj = document.getElementById("selectIds");
	selectIdsObj.value = "";
	
	var count = 0;
	for(var i=0; i<objs.length; i++) {
		if(objs[i].type.toLowerCase() == "checkbox" 
			&& objs[i].name.toLowerCase() == "selected_id"
			&& objs[i].checked == true){
			count++;
			selectIdsObj.value += objs[i].value + ",";
		}
	}
	return count;
}

function jumpPage(obj,event,totalPage){//分页跳转
	if(event.keyCode == 13){
		var objValue=obj.value;
		var re=/^[0-9]+$/;
		if(!(re.test(objValue))){
			alert(td_lang.crm.inc.msg_26);
			obj.value="";
			return false;
		}
		if(objValue<=0 || objValue>totalPage){
			alert(sprintf(td_lang.crm.inc.msg_27, totalPage));
			obj.value="";
			return false;
		}
		gotoViewPage(objValue);
	}
}

function MoveRightLayer() {//控制按钮
	if(document.all.div_control){
		var div_height=document.body.scrollTop+document.body.clientHeight-35;
		document.all.div_control.style.posTop=div_height;
	}
}
window.onscroll=MoveRightLayer;  
window.onresize=MoveRightLayer;

function share(MODULE){
	var count = get_select_id();
	if(count == 0){
		alert(td_lang.crm.inc.msg_7);
		return;
	}
	var ids = $("#selectIds").val();
	openWindow("/module/crm2010/share/?MODULE="+MODULE+"&ids="+ids, 600, 400, "", 'theParam');
}

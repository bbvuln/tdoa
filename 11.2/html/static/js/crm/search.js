var typeofdata = new Array();
typeofdata['E']  = ['cts','is','isn','bwt','ewt','dcts'];		
typeofdata['V']  = ['cts','is','isn','bwt','ewt','dcts'];	 //文本
typeofdata['F']  = ['cts','is','isn','bwt','ewt','dcts'];	 //外键
typeofdata['N']  = ['is','isn','lst','grt','lsteq','grteq']; //数字
typeofdata['M']  = ['is','isn','lst','grt','lsteq','grteq']; //数字
typeofdata['NN'] = ['is','isn','lst','grt','lsteq','grteq'];
typeofdata['T']  = ['is','isn','lst','grt','lsteq','grteq'];  //时间
typeofdata['I']  = ['is','isn','lst','grt','lsteq','grteq'];
typeofdata['C']  = ['is','isn'];
typeofdata['CB'] = ['is'];				//checkbox
typeofdata['DT'] = ['is','isn','lst','grt','lsteq','grteq'];
typeofdata['D']  = ['is','isn','lst','grt','lsteq','grteq']; //日期
typeofdata['DP'] = ['is','isn']; //部门
typeofdata['UR'] = ['is','isn']; //用户
typeofdata['U']  = ['cts','is','isn','bwt','ewt','dcts'];    //链接
typeofdata['FU']  = ['cts','is','isn','bwt','ewt','dcts'];    //链接

var q_fielddatatype = new Array();
q_fielddatatype['V'] 	= 'V~M~LE';
q_fielddatatype['DP'] = 'V~M~LE';
q_fielddatatype['UR'] = 'V~M~LE';
q_fielddatatype['F'] 	= 'V~M~LE';
q_fielddatatype['U']  = 'V~M~LE';
q_fielddatatype['FU'] = 'V~M~LE';
q_fielddatatype['CB'] = 'V~O~LE';

q_fielddatatype['N'] = 'N~M';
q_fielddatatype['M'] = 'N~M';

q_fielddatatype['D'] = 'D~M';
q_fielddatatype['DT'] = 'D~M';
q_fielddatatype['T'] = 'D~M';


var fLabels = new Array();
fLabels['is'] = td_lang.crm.inc.msg_37;
fLabels['isn'] = td_lang.crm.inc.msg_38;
fLabels['bwt'] = td_lang.crm.inc.msg_39;
fLabels['ewt'] = td_lang.crm.inc.msg_40;
fLabels['cts'] = td_lang.crm.inc.msg_41;
fLabels['dcts'] = td_lang.crm.inc.msg_42;
fLabels['lst'] = td_lang.crm.inc.msg_43;
fLabels['grt'] = td_lang.crm.inc.msg_44;
fLabels['lsteq'] = td_lang.crm.inc.msg_45;
fLabels['grteq'] = td_lang.crm.inc.msg_46;

function setTab(name,cursel,n){
	for(i=1;i<=n;i++){
	var menu=document.getElementById(name+i);
	var con=document.getElementById("con_"+name+"_"+i);
	menu.className=i==cursel?"hover":"";
	con.style.display=i==cursel?"block":"none";
	}
	if(document.getElementById('searchType')){
		document.getElementById('searchType').value = cursel;
	}
}

function setSearchType(name,cursel,n){
	if(cursel == ""){
		if(document.getElementById('searchType').value == ""){
			document.getElementById('hd_search_img').src = CRM_CONTEXT_IMG_PATH + "/up.png";
			cursel = 1;
		}else {
			document.getElementById('hd_search_img').src = CRM_CONTEXT_IMG_PATH + "/up.png";
		}
	}else{
			document.getElementById('hd_search_img').src = CRM_CONTEXT_IMG_PATH + "/down.png";
	}


	for(i=1;i<=n;i++){
		var menu=document.getElementById(name+i);
		var con=document.getElementById("con_"+name+"_"+i);
		menu.className = (i==cursel) ? "hover" : "";
		con.style.display   =  (i==cursel) ? "block" : "none";
	}
	if(document.getElementById('searchType')){
		document.getElementById('searchType').value = cursel;
	}
}


function fnAddSrch(){

	var tableName = document.getElementById('adSrc');
    var prev = tableName.rows.length;
    var count = prev - 1;
    var row = tableName.insertRow(prev);
    
    var colone = row.insertCell(0);
    var coltwo = row.insertCell(1);
    var colthree = row.insertCell(2);

	var option_values = document.getElementById("Fields_templete_").innerHTML;
	var criteria_values = document.getElementById("Condition_templete_").innerHTML;

    colone.innerHTML="<select id='Fields"+count+"' name='Fields"+count+"' onchange=\"updatefOptions(this, 'Condition"+count+"', 'Srch_value" + count + "')\" class='efViewTextBox efCtrlWidth90'>"+option_values+"</select>";
    coltwo.innerHTML="<select id='Condition"+count+"' name='Condition"+count+"' class='efViewTextBox efCtrlWidth90'>"+criteria_values+"</select> ";
    colthree.innerHTML ="<input type='text' class='efViewTextBox efCtrlWidth90' id='Srch_value"+count+"' name='Srch_value"+count+"' class='efViewTextBox efCtrlWidth90'>"
    				   + "<select name='checkbox_Srch_value" + count + "' id='checkbox_Srch_value" +count + "' style='display:none' >"
    				   + "<option value='0'>"+ td_lang.global.no +"</option>"
    				   + "<option value='1'>"+ td_lang.global.yes +"</option>"
    				   + "</select>";
}

function delRow(){
    var tableName = document.getElementById('adSrc');
    var prev = tableName.rows.length;
    if(prev > 2){//第一行是templete，第二行是显示的第一行
	    document.getElementById('adSrc').deleteRow(prev-1);
	}
}

function updatefOptions(sel, opSelName, search_value_field) {
    var selObj = document.getElementById(opSelName);			
    var fieldtype = null ;
    var currOption = selObj.options[selObj.selectedIndex];
    var currField = sel.options[sel.selectedIndex];
    
    if(currField.value != null && currField.value.length != 0){
     	var fld = currField.value.split(":");
    	var fieldtype = fld[5];
    	fieldtype = fieldtype.replace(/\\'/g,'');
		ops = typeofdata[fieldtype];
		
		var off = 0;
		if(ops != null){
			var nMaxVal = selObj.length;
			for(nLoop = 0; nLoop < nMaxVal; nLoop++){
				selObj.remove(0);
			}
			for (var i = 0; i < ops.length; i++){
				var label = fLabels[ops[i]];
				if (label == null) continue;
				var option = new Option (fLabels[ops[i]], ops[i]);
				selObj.options[i] = option;
				if (currOption != null && currOption.value == option.value){
					option.selected = true;
				}
			}
		}
	  	var textObj = document.getElementById(search_value_field);
	  	var cbObj 	= document.getElementById("checkbox_" + search_value_field);
	    if(fieldtype == 'CB'){
			if(cbObj != undefined){
				cbObj.style.display = 'block';
			}
			if(textObj != undefined){
				textObj.style.display = 'none';
			}
		}else{
			if(cbObj != undefined){
				cbObj.style.display = 'none';
			}
			if(textObj != undefined){
				textObj.style.display = 'block';
			}
		}
    }else{
		var nMaxVal = selObj.length;
		for(nLoop = 0; nLoop < nMaxVal; nLoop++){
			selObj.remove(0);
		}
		selObj.options[0] = new Option ('--'+ td_lang.general.msg_5 +'--', '');
		if (currField.value == '') {
			selObj.options[0].selected = true;
		}
    }

}
function condition_init(fld, cnd, search_value_field){
	var basFieldObj = document.getElementById(fld);
	var basCondObj  = document.getElementById(cnd);
	var initField = basFieldObj.options[0];
	var fld = initField.value.split(":");
    var fieldtype = fld[5];
    var ops = typeofdata[fieldtype];
    for (var i = 0; i < ops.length; i++){
    	var label = fLabels[ops[i]];
		if (label == null) continue;
		var option = new Option (fLabels[ops[i]], ops[i]);
		basCondObj.options[i] = option;
    }
  	
  	var textObj = document.getElementById(search_value_field);
  	var cbObj 	= document.getElementById("checkbox_" + search_value_field);
    if(fieldtype == 'CB'){
		if(cbObj != undefined){
			cbObj.style.display = 'block';
		}
		if(textObj != undefined){
			textObj.style.display = 'none';
		}
	}else{
		if(cbObj != undefined){
			cbObj.style.display = 'none';
		}
		if(textObj != undefined){
			textObj.style.display = 'block';
		}
	}
    
}

function totalnoofrows(){
	var tableName = document.getElementById('adSrc');
	getObj("search_cnt").value = tableName.rows.length-1;
}


function callAdvSearch(){//高级查找处暂时没有加验证
	var url = window.location.pathname;
	url += setQueryString("CUR_PAGE", "1", "?");
	url += keepQueryString("entity", "&");
	url +=getAdvSearchUrl();
	url += keepQueryString("ORDERFIELD", "&");	
	url += keepQueryString("ORDERTYPE", "&");
	if(document.getElementById('searchType')){
		url += '&searchType=2';
	}
   this.document.location.href = url;
}

function getAdvSearchUrl(){
	     var no_rows = getObj("search_cnt").value;
		 var urlstring = "&"
        for(j = 0 ; j < no_rows; j++){
       		var sfld_name = getObj("Fields"+j);
            var scndn_name= getObj("Condition"+j);
            var srchvalue_name = getObj("Srch_value"+j);
			
            var fld = sfld_name.value.split(":");
			var fieldtype = fld[5];
            var fieldInfo = sfld_name[sfld_name.selectedIndex].value.split(":");
			var field = fieldInfo[0] + "." + fieldInfo[1];
			urlstring = urlstring+'field'+j+'='  + field + '&';
            urlstring = urlstring+'op'+j+'='+scndn_name[scndn_name.selectedIndex].value+'&';
			urlstring = urlstring+'value'+j+'=';
			
			//urlstring += encodeURIComponent((srchvalue_name.value.replace(/\\/,"\\\\")).replace(/\'/,"\\'"))+'&';
			urlstring += (srchvalue_name.value.replace(/\\/,"\\\\")).replace(/\'/,"\\'")+'&';
        }
		var matchtypeObj = document.all["matchtype"];
        for (i=0;i<matchtypeObj.length;i++){
            if (matchtypeObj[i].checked==true){
                 urlstring += 'matchtype='+matchtypeObj[i].value+'&';
            }
        }

		urlstring += 'cnt=' + no_rows + "&"
		return urlstring;
}

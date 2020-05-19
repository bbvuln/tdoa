//新建页面提交验证
function CheckForm()
{	
	var src_tp=jQuery("input[name='src_type']:checked").val();
	if(jQuery('#condition_in tr').length==1&&src_tp==1){
		alert(td_lang.general.workflow.msg_194);
		return false;
	}
	var regex = /[^A-Za-z0-9]/i; 
    var nmarking=jQuery("input[id=nmarking_]").val();
	var ndesc=jQuery("input[id=ndesc_").val();
   	if(jQuery.trim(document.form1.d_name.value)=="")
	{
		alert(td_lang.general.workflow.msg_125);
		jQuery("#nmarking").focus();
		return (false);
	}
	if(document.form1.d_name.value.length > 40){
		alert(td_lang.general.workflow.msg_275);
		jQuery('#nmarking').focus();
		return (false);
	}
	if(jQuery.trim(document.form1.d_desc.value)=="")
	{
		alert(td_lang.general.workflow.msg_126);
		jQuery("#ndesc").focus();
		return (false);
	}
   	if(/.*[\u4e00-\u9fa5]+.*$/.test(document.form1.d_name.value))
   	{
   		alert(td_lang.general.workflow.msg_127);
		jQuery("#d_name").focus();
   	  	return (false);
   	}
	if(regex.test(jQuery.trim(document.form1.d_name.value)))
	{ 
		alert(td_lang.general.workflow.msg_191);
		jQuery('#d_name').focus();
		return (false);
	}
    if(jQuery("li[name=import_file]").attr('class')!='active')
    {
    	if(jQuery.trim(nmarking)=="")
    	{
    		alert(td_lang.general.workflow.msg_142);
    		jQuery("#nmarking").focus();
    		  return (false);
    	} 
        if(nmarking.length > 40){
            alert(td_lang.general.workflow.msg_276);
            jQuery("#nmarking").focus();
            return (false);
        }
        if(jQuery.trim(ndesc)=="")
    	{
    		alert(td_lang.general.workflow.msg_143);
    		jQuery("#ndesc").focus();
    		  return (false);
    	} 
      }  
   	if(jQuery("input[name='src_type']:checked").val() == "0")
   	{	
   		if(document.form1.EXCEL_FILE.value=="")
   		{
   			alert(td_lang.general.workflow.msg_121);
   		  	return (false);
   		}
   		   
			  var str=document.getElementById("EXCEL_FILE").value;
			  var pos = str.lastIndexOf(".");
			  var lastname = str.substring(pos,str.length) 
			 if (!(lastname.toLowerCase()==".xls" || lastname.toLowerCase()==".xlsx"))
			  {
				  alert(td_lang.general.workflow.msg_122+lastname+td_lang.general.workflow.msg_123);
				  return false;
			  }
			   return true;
   	}
	document.form1.count.value=count1;
   	return (true);

}
//关闭按钮
function window_close(id){
	if(window.close()=="undefined"){
		window.close();
	}else if(id!=''){
		window.close();
	}else{
		opener.location.reload();
		window.close();
	}
}
//判断数据源是否存在
function check_datasrc()
{
   var flag=true;
     jQuery.ajax
	({		   
		url:"datasource_exists.php?d_name="+jQuery.trim(document.form1.d_name.value),
		async: true,
		success: function(data){
			if(jQuery.trim(data)!=''){
			    flag=false;
				alert(data);
                jQuery("input[name=d_name]").focus();
				return false;
			}
			
		},
		error: function(data){		
			alert(data.responseText);
		}
	});
    if(!flag){            
        return false;
    }  
    
}
//删除数据源
function delete_table(d_id)
{	
	var msg=td_lang.general.workflow.msg_150;
	if(window.confirm(msg))
	{ 	
	   jQuery.ajax
        ({		   
            url:"delete.php?d_id="+d_id,
            async: true,
            success: function(data){
               jQuery("#gridTable").trigger("reloadGrid");
            },
            error: function(data){		
                alert(data.responseText);
            }
        });   			 
	} 
}
//清空数据源
function empty_table(d_id)
{		
    var	msg=td_lang.general.workflow.msg_151;
	if(window.confirm(msg))
	{	
		 jQuery.ajax
        ({		   
            url:"empty.php?d_id="+d_id,
            async: true,
            success: function(data){
                jQuery("#gridTable").trigger("reloadGrid");
            },
            error: function(data){		
                alert(data.responseText);
            }
        }); 
	}
}
//获取查询数据
function getSearchStr(){
	var searchStr = "d_name="+jQuery.trim(jQuery('#d_name_').val());
	searchStr += "&d_desc="+jQuery.trim(jQuery('#d_desc_').val());
	return 	searchStr;
}
//判断是否为数字和字母
function isN(){
	var regular_run_id = "^[0-9a-zA-Z]+$";
	var reg_run_id = new RegExp(regular_run_id);
	var confirm_run_id = jQuery.trim(jQuery('#d_name').val());
	if(confirm_run_id == "")
	{
		return true;
	}
	if(confirm_run_id.search(reg_run_id) != -1)
	{
		return true;
	}else
	{
		return false;
	}
}

function ShowDialog(id,vTopOffset)
{
   var $ = function(id) {return document.getElementById(id);};
   
   if(typeof arguments[1] == "undefined")
     vTopOffset = 90;
     
   var bb=(document.compatMode && document.compatMode!="BackCompat") ? document.documentElement : document.body;
   $("overlay").style.width = Math.max(parseInt(bb.scrollWidth),parseInt(bb.offsetWidth))+"px";
   $("overlay").style.height = Math.max(parseInt(bb.scrollHeight),parseInt(bb.offsetHeight))+"px";
   $("overlay").style.display = 'block';
   $(id).style.display = 'block';

   $(id).style.left = ((bb.offsetWidth - $(id).offsetWidth)/2)+"px";
   $(id).style.top  = (vTopOffset + bb.scrollTop)+"px";
}
function ShowDialog_edit(id,vTopOffset)
{
   var $ = function(id) {return document.getElementById(id);}; 
   if(typeof arguments[1] == "undefined")
     vTopOffset = 90;   
   var bb=(document.compatMode && document.compatMode!="BackCompat") ? document.documentElement : document.body;
   $("overlay").style.width =780+"px";
   $("overlay").style.height = Math.max(parseInt(bb.scrollHeight),parseInt(bb.offsetHeight))+"px";
   $("overlay").style.display = 'block';
   $(id).style.display = 'block';
   $(id).style.left = 220+"px";
   $(id).style.top  = (vTopOffset + bb.scrollTop)+25+"px";
}
function HideDialog(id)
{
	var $ = function(id) {return document.getElementById(id);};
   $("overlay").style.display = 'none';
   $(id).style.display = 'none';
}
function save_data()
{
    jQuery("#save").click();
}
function Hide(id)
{
	 var $ = function(id) {return document.getElementById(id);};
   $("olay").style.display = 'none';
   $(id).style.display = 'none';
}
//操作导入验证
function CheckForm3()
{
   if(document.form3.EXCEL_FILE.value=="")
   {
	  alert(td_lang.general.workflow.msg_152);
	  return (false);
   }			   
	var str=document.getElementById("EXCEL_FILE").value;
	var pos = str.lastIndexOf(".");
	var lastname = str.substring(pos,str.length) 
	if (!(lastname.toLowerCase()==".xls" || lastname.toLowerCase()==".xlsx"))
	{
		 alert(td_lang.general.workflow.msg_153+lastname+td_lang.general.workflow.msg_154);
		 return false;
	}
		document.form3.submit();
}
//导入Dialog
function import_data(d_name,modal_id)
{	 
	open_bootcss_modal(modal_id);
	jQuery('#import_data').load('index_import.php?d_name='+d_name,function(){});
}
//导出Dialog
function export_data(d_name)
{
    jQuery('#d_name').val(d_name);
    document.export_form.submit();
}
//新建验证导入文件
function check_file(){
    var str=document.getElementById("EXCEL_FILE").value;
	var pos = str.lastIndexOf(".");
	var lastname = str.substring(pos,str.length) 
	if (!(lastname.toLowerCase()==".xls" || lastname.toLowerCase()==".xlsx"))
	{
		 alert(td_lang.general.workflow.msg_153+lastname+td_lang.general.workflow.msg_154);
		 return false;
	}
}
//设置管理员
function set_manager(d_id,modal_id)
{	
	open_bootcss_modal(modal_id);
	jQuery('#set_manager_data').load('set_manager.php?d_id='+d_id,function(){});
}
function commit_set_manager()
{
    jQuery('#commit_form2').click();
}
//打开新建数据源页
function add_item(d_id)
{
   	URL="edit.php?d_id="+d_id;
    mywidth=1000;
	myleft=(screen.availWidth-mywidth)/2;
	mytop=100;
	myheight=500;

	window.open(URL,"add_item","height="+myheight+",width="+mywidth+",toolbar=no,menubar=no,location=no,scrollbars=no,top="+mytop+",left="+myleft+",status=no","resizable=no");

}
//打开浏览页
function browse_data(d_id,d_name)
{
	URL="browse.php?d_id="+d_id+"&d_name="+d_name;
    mywidth=1000;
	myleft=(screen.availWidth-mywidth)/2;
	mytop=100;
	myheight=500;
	window.open(URL,"browse_data","height="+myheight+",width="+mywidth+",status=1,toolbar=no,menubar=no,location=no,scrollbars=yes,top="+mytop+",left="+myleft+",resizable=no");
 
}
//打开编辑页
function update_data(d_id)
{
    URL="edit.php?d_id="+d_id;	
    mywidth=1000;
	myleft=(screen.availWidth-mywidth)/2;
	mytop=100;
	myheight=500;
	window.open(URL,"update_data","height="+myheight+",width="+mywidth+",resizable=no,toolbar=no,menubar=no,location=no,scrollbars=no,top="+mytop+",left="+myleft+",status=no","resizable=no"); 
}
//编辑页删除
function delete_(val,name,d_name)
{ 
	if(jQuery("#condition_in tr").length==2){
		alert(td_lang.general.workflow.msg_199);
		return false;
	}
	jQuery.ajax
	({
		url: "delete.php?name="+name+"&d_name="+d_name,  
		async: true,
		error: function()
		{  
			alert("error");  
		},  
		success: function(data)
		{//如果调用php成功
			jQuery("tr[id=td_"+val+"]").remove();
		}
	});
	
}
function check_type(val)
{
	if(val=='0')
	{
        jQuery('#nunique').hide();
        jQuery('.field_div_nunique').hide()
        jQuery('#nunique').attr('checked',false);
		jQuery('#query_field').attr('checked',false);
        jQuery('#ntype').val(0);
	}
	else
	{
        jQuery('#nunique').show();
        jQuery('.field_div_nunique').show()
	}   
}
function select_type(val)
{
	if(val==0)
	{
		jQuery("#right").hide();
		jQuery('#left').show();
		jQuery('#defi_field').attr('name','prev');
		jQuery("#form1").attr("action","import.php");
		jQuery("#form1").attr("target","iframe_data_new");
		jQuery('#right').find('a').removeClass('data_radius_a');
		jQuery('#left').find('a').addClass('data_radius_a');
	}
	if(val==1)
	{
		jQuery('#check_field').attr('name','next');
		jQuery('#basic_attr').attr('name','next');
		jQuery('#defi_field').attr('name','next');
		jQuery('#import_file').attr('name','next');
		jQuery("#left").hide();
		jQuery('#right').show();
		jQuery("#form1").attr("action","fadd.php");
		jQuery("#form1").removeAttr("target","iframe_data_new");
		jQuery('#left').find('a').removeClass('data_radius_a');
		jQuery('#right').find('a').addClass('data_radius_a');
	}
}
//编辑页代开编辑Dialog框
function edit_one(num,obj)
{ 	
	var ntype_name='';
	jQuery("#tr_id").val(num);
	var tr=jQuery(obj).parent().parent();
	document.form3.nmarking.value=tr.children("td").eq(0).html();
	document.form3.nmarking_check.value=tr.children("td").eq(0).html();
	document.form3.ndesc.value = tr.children("td").eq(1).html();
	var ntype=tr.find("#ntype_n").val();
	var nunique=tr.find("#nunique_n").val();
	var queryVal = jQuery('[name="query'+num+'"]').val();
	if(ntype=='0')
	{
		ntype_name="文本";
		jQuery('#nunique_edit').attr("disabled",true);
		jQuery('#nunique_div').hide();
	}
	else
	{
		ntype_name="数字";
		jQuery('#nunique_edit').attr("disabled",false);
		jQuery('#nunique_div').show();
	}
	jQuery("#ntype_edit").val(ntype_name);
	if(nunique=="1")
	{
		jQuery('#nunique_edit').prop("checked",true);
	}
	else
	{
		jQuery('#nunique_edit').prop("checked",false);
	}
	
	if(queryVal == 1)
	{
		jQuery('#query_edit').prop("checked",true);
	}
	else
	{
		jQuery('#query_edit').prop("checked",false);
	}
    Dialog('kyd');
}
//编辑Dialog验证
function edit_field(){
	var ntype_name='';
	var nunique_name='';
	var flag_return=true;
	var nmarking=document.form3.nmarking.value;
	var ndesc=document.form3.ndesc.value;
	var ntype=document.form3.ntype.value;
	if(jQuery("#nmarking_check").val()!=nmarking){
		jQuery("#condition_in tr:gt(0)").each(function(){
			if(jQuery(this).find("#nmarking_").val()==nmarking){						
				alert(td_lang.general.workflow.msg_156);
				jQuery(".check_filed_item").focus();
				flag_return=false;
				return (false);
			}        
		});
		if(flag_return==false){
			return flag_return;
		}
	}
	
	var regex_nmking = /[^A-Za-z0-9_]/i;	
	var regex_new= /[^0-9]/i;
	
	if(jQuery.trim(nmarking)=="")
	{
		alert(td_lang.general.workflow.msg_142);
		jQuery("#nmarking_check").parent().find("#nmarking").focus();
		return (false);
	} 
	if(nmarking.length > 40){
		alert(td_lang.general.workflow.msg_276);
		jQuery("#nmarking_check").parent().find("#nmarking").focus();
		return (false);
	}
	if(!regex_new.test(jQuery.trim(nmarking))&&jQuery.trim(nmarking)!=''){
		alert(td_lang.general.workflow.msg_200);
		jQuery("#nmarking_check").parent().find("#nmarking").focus();
		return false;	
	}
	if(regex_nmking.test(jQuery.trim(nmarking))&&jQuery.trim(nmarking)!=''){
		alert(td_lang.general.workflow.msg_193);
		jQuery("#nmarking_check").parent().find("#nmarking").focus();
		return false;	
	}
	if(/.*[\u4e00-\u9fa5]+.*$/.test(jQuery.trim(nmarking)))
   	{
   		alert(td_lang.general.workflow.msg_196);
		jQuery("#nmarking").focus();
   	  	return (false);
   	}
	if(jQuery.trim(ndesc)=="")
	{
		alert(td_lang.general.workflow.msg_143);
		jQuery("#ndesc_check").parent().find("#ndesc").focus();
		return (false);
	} 
	if(ntype=='0')
	{
    	 ntype_name=td_lang.general.workflow.msg_145;
	}
    if(ntype=='1')
	{
    	 ntype_name=td_lang.general.workflow.msg_146;
	}
	if(jQuery("input:checkbox[id='query_edit']:checked").val())
	{
		var query=1;
		var query_name=td_lang.general.workflow.msg_144;

	}
	else
	{
		var query=0;
		var query_name=td_lang.general.workflow.msg_198;
	}
	if(jQuery("input:checkbox[id='nunique_edit']:checked").val())
	{
		nunique=1; 
		nunique_name=td_lang.general.workflow.msg_144;
		
	}
	else
	{
		nunique=0;
		nunique_name=td_lang.general.workflow.msg_198;
	}
	var id=jQuery("#tr_id").val();
	jQuery("#td_"+id+" td").eq(0).html('');
	jQuery("#td_"+id+" td").eq(0).html(nmarking);
	jQuery("#td_"+id+" td").eq(1).html('');
	jQuery("#td_"+id+" td").eq(1).html(ndesc);
	jQuery("#td_"+id+" td").eq(3).html('');
	jQuery("#td_"+id+" td").eq(3).html(query_name);
	jQuery("#td_"+id+" td").eq(4).html('');
	jQuery("#td_"+id+" td").eq(4).html(nunique_name);
	jQuery("#td_"+id).find("#nmarking_").val(nmarking);
	jQuery("#td_"+id).find("#ndesc_").val(ndesc);
	jQuery("#td_"+id).find("input[id=query_n]").val(query);
	jQuery("#td_"+id).find("input[id=nunique_n]").val(nunique);
	Hide('kyd');
}
 
function check_type_edit(val)
{	
	if(val=='0')
	{
		document.getElementById('nunique_edit').disabled=true;
		document.getElementById('nunique_edit').checked=false;
	}
	else
	{
		document.getElementById('nunique_edit').disabled=false;
	}
}
function check_unique(val)
{
	if(val.checked&&document.form2.ntype.value=='0')
	{
		val.checked=false;
		alert(td_lang.general.workflow.msg_162);
	}
}


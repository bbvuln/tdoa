jQuery(document).ready(function()
{
    jQuery.getJSON("/general/workflow/get_flow_list.inc.php",{"action":0,"root":true},function(jsonData){
    jQuery("#FLOW_ID").html("");
    jQuery.each(jsonData,function(i,t){
        jQuery("#FLOW_ID").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+' level="'+t.level+'">'+t.txt+'</option>');
    });
        jQuery("#FLOW_ID").combobox();
        jQuery('#FLOW_ID').find('option[value='+init_flow_id+']').attr('selected',true);
		var flow_name = jQuery('#FLOW_ID').find('option[value='+init_flow_id+']').text();
		jQuery('#flow_name').val(flow_name);
        jQuery('#FLOW_ID').find('option[value="all"]').remove();
        if(init_flow_id!=='')
        {
        	jQuery('#flow_name').attr('disabled',true);
        	jQuery("#flow_name").css('background-color','#eeeeee');
        	jQuery('.dropdown-toggle').attr('disabled',true);
        }
	jQuery('#flow_name').css('width',165);
    });
	var init_flow_id = jQuery("#flow_id").val();
	var form_name=jQuery("#form_name").val();
	var getname = jQuery("#r_name").val();
	jQuery('#nav_left').find('a').click(function(event){
        event.preventDefault();
		jQuery(this).attr('data-toggle','');
	});
	jQuery("#next_step").click(function(){
		try{		
			if(typeof(eval(checkEssentialInfo))=='function')					
			{
				var href_id = jQuery('.active').parent().find("li[class$='active']").find("a").attr("href");
				var  checked=checkEssentialInfo(href_id);	
			}
		}catch(e)
			{
			}
			if(checked==false){
				return checked;
			}
		
	});
	jQuery(".flow_name").html(getname);
	jQuery("#r_name").blur(function(){
		getname = jQuery("#r_name").val();
		jQuery(".flow_name").html("");
		jQuery(".flow_name").html(getname);
	});


	initCheck();
	jQuery("#calc_sum").bind("click",function(){
		setCalc(jQuery(this).val())
	});
	
	jQuery("#calc_avg_weight").bind("click",function(){
		setCalc(jQuery(this).val())
	});
	
	jQuery("#calc_avg").bind("click",function(){
		setCalc(jQuery(this).val())
	});
	
	jQuery("#calc_def").bind("click",function(){
		setCalc(jQuery(this).val())
	});
	
//---------------表单id的处理-------
	jQuery("#FLOW_ID").change(function(){
		var flow_id=jQuery(this).val();
		jQuery.post('/general/system/workflow/flow_report/getformId.php',{'FLOW_ID':flow_id},function(data){
			jQuery('#form_id').val(data);
		})
	});
	
//-------照熙添加，保证操作宽度---------
	ishidedivornot();
//-------照熙添加，算高保证窗口高度自适应---------
	jQuery(window).resize(function(){
		jQuery('#nav-right-container').css('height',getMainDivHeight());
	});
	jQuery(window).trigger('resize');
	
	setFiledCount();
	setQueryFiledCount();
	IsTheLastOne();
});
//------页面关闭按钮的处理----------
function close_flow()
{
	window.close();
	
}
//-----判断类型是不是整形--------------
function isInt(str)
{
	var reg = /^(-|\+)?\d+$/;
	return reg.test(str);
}
function setCalc(val)
{
  if(val=="1")
  {
     jQuery("#weight_div").show();
     jQuery("#formula_div").hide();
  }
  else if(val=="3")
  {
     jQuery("#formula_div").show();
     jQuery("#weight_div").hide();
  }
  else
  {
     jQuery("#formula_div").hide();
     jQuery("#weight_div").hide();
  }	
}
function calc_type_change()
{
	var select_flag=jQuery("#calc_type").val();
	if(select_flag=="1")
	{
		jQuery("#weight_div").show();
     	jQuery("#formula_div").hide();
	}
	else if(select_flag=="3")
	{
		jQuery("#formula_div").show();
     	jQuery("#weight_div").hide();
	}
	else
	{
		jQuery("#formula_div").hide();
     	jQuery("#weight_div").hide();
	}
	
}

function addField()
{
	var select_diable=jQuery('input[name="group_type"]:checked').val();
	var flow_id=jQuery("#FLOW_ID").val();
	var is_new=jQuery("#flow_id").val();
	jQuery.ajax({
	    type:"post",
	    url:"/general/system/workflow/flow_report/new_report/newfield.php",
	    data:{"select_diable":select_diable,'flow_id':flow_id},
	    success:function(html){
	        jQuery("#addarea").append(html);
	        initCheck();
	        ishidedivornot();
	        jQuery('[name="gotfieldselectval"]').each(function(){
	        	jQuery(this).val(jQuery(this).prev().find("option:selected").text());
	        });
	        if(is_new==''){
	        	jQuery('#model_html').empty();
	        	jQuery('#model_html').append(html);
	        }
			IsTheLastOne(); 
			setFiledCount();
	    },
	});
}
function loadField()
{
	var html=jQuery('#model_html').html();
	jQuery("#addarea").append(html);
	setFiledCount();
	IsTheLastOne();
}

//照熙添加，用于判断操作宽度
function ishidedivornot()
{
	var ishide = 0;
	jQuery('[name="calc_type"]').each(function(){
		if(jQuery(this).val()==1||jQuery(this).val()==3)
		{
			ishide=1;
		}
	});
	if(ishide)
	{
		jQuery("#span_title_opration").css({"float":"left","margin-left":"350px","background":"none"});
		jQuery('[name="btn_updowndel"]').each(function(){
			jQuery(this).css({"margin-left":"740px","background":"none"});
		});
	}
	else
	{
		jQuery("#span_title_opration").css({"float":"left","margin-left":"110px","background":"none"});
		jQuery('[name="btn_updowndel"]').each(function(){
			jQuery(this).css({"margin-left":"0px","background":"none"});
		});
	}
}
function addQueryField()
{
	var flow_id=jQuery("#FLOW_ID").val();
	var is_new=jQuery("#flow_id").val();
	jQuery.ajax({
	    type:"post",
	    url:"/general/system/workflow/flow_report/new_report/newqueryfield.php",
	    data:{"flow_id":flow_id},
	    success:function(html){
	        jQuery("#add_query_area").append(html);
	        jQuery('[name="gotselectval"]').each(function(){
	        	jQuery(this).val(jQuery(this).prev().find("option:selected").text());	
	        });
	        if(is_new==''){
	        	jQuery('#search_model').empty();
	        	jQuery('#search_model').append(html);
	        }
			IsTheLastOne(); 
			setQueryFiledCount();
	    },
	});
}
function loadQueryField(){
	var html=jQuery('#search_model').html();
	 jQuery("#add_query_area").append(html);
	 setQueryFiledCount();
	 IsTheLastOne();
}
function deletefield(fieldDiv){
	jQuery(fieldDiv).parent().parent().remove();
	IsTheLastOne();
	setFiledCount();
	setQueryFiledCount();
}
//控制隐藏域显隐的select的change事件
function getAlgorithm(algorithmType)
{
	var select_type = jQuery(algorithmType).val();
	jQuery(algorithmType).parent().next().find("#calc_formula").val('');
	jQuery(algorithmType).parent().next().next().find("#calc_weight").val('');
	if(select_type==1)
	{
		jQuery(algorithmType).parent().next().next().show();
		jQuery(algorithmType).parent().next().hide();
	}
	else if(select_type==3)
	{
		jQuery(algorithmType).parent().next().next().hide();
		jQuery(algorithmType).parent().next().show();
	}
	else
	{
		jQuery(algorithmType).parent().next().next().hide();
		jQuery(algorithmType).parent().next().hide();
	}
	ishidedivornot();
}
//field do end

function change_dept(obj)
{
    var dept_name = obj;
    if(dept_name == "OTHER")
    {
        jQuery("#dept_title").css("display", "block");
        jQuery("#dept_content").css("display", "block");
    }else
    {
        jQuery("#dept_title").css("display", "none");
        jQuery("#dept_content").css("display", "none");
    }
}
function edit_change_dept(obj)
{
    var edit_dept_name = obj;
    if(edit_dept_name == "EDIT_OTHER")
    {
        jQuery("#edit_dept_title").css("display", "block");
        jQuery("#edit_dept_content").css("display", "block");
    }else
    {
        jQuery("#edit_dept_title").css("display", "none");
        jQuery("#edit_dept_content").css("display", "none");
    }
}
function edit_authority()
{
    open_bootcss_modal("div_edit_authority","600","1");
    jQuery("#div_edit_authority").load();
}
function changeRow(obj,type)
{
	var that= jQuery(obj).parent();//按钮组DIV
	var parent=that.parent();//行级元素
	var nextObj=that.parent().next();//下一行元素
	var prevObj=that.parent().prev();//上一行元素
	var prevAllLength=that.parent().prevAll().length+1;
	if(type=='down')
	{
		if(nextObj.length==1){
			nextObj.after(parent);
			setFiledCount();
		}else{
			jQuery('[name="field_content_child"]').first().before(parent);
			setFiledCount();
		}
	}
	else if(type=='up')
	{
		if(prevAllLength!=1){
			prevObj.before(parent);
			setFiledCount();
		}else if(prevAllLength==1){
			jQuery('#addarea').find('[name="field_content_child"]').last().after(parent);
			setFiledCount();
		}
	}	
}
function changeQueryRow(obj,type)
{
	var that= jQuery(obj).parent();
	var parent=that.parent();
	var nextObj=that.parent().next();
	var prevObj=that.parent().prev();
	var prevAllLength=that.parent().prevAll().length+1;
	if(type=='down')
	{
		if(nextObj.length==1){
			nextObj.after(parent);
			 setQueryFiledCount();
		}else{
			jQuery('[name="field_content_querychild"]').first().before(parent);
			 setQueryFiledCount();
		}
	}else if(type=='up')
	{
		if(prevAllLength!=1){
			prevObj.before(parent);
			 setQueryFiledCount();
		}else if(prevAllLength==1){
			jQuery('#add_query_area').find('[name="field_content_querychild"]').last().after(parent);
			 setQueryFiledCount();
		}
	}
	setQueryFiledCount();
}

function checkeIsDisabled(val)
{
	if(val=='1'){
		jQuery('[name="calc_type"]').attr('disabled',true);
		jQuery('[name="calc_type"]').each(function(){
			jQuery(this).find("option[value='']").attr("selected",true);
			jQuery(this).parent().next().next().find("select").find('option:selected').attr("selected",false);
			jQuery(this).parent().next().find("input").val('');
			getAlgorithm(this);
		});
	}else if(val=='0'){
		jQuery('[name="calc_type"]').attr('disabled',false);
	}
	ishidedivornot();
}

function initCheck()
{
	var val=jQuery('[name="group_type"]:checked').val();
	if(val=='1'){
		jQuery('[name="calc_type"]').attr('disabled',true);
	}
	else
	{
		jQuery('[name="calc_type"]').each(function(){
			var select_calc_type = jQuery(this).find('option:selected').val();
			if(select_calc_type == 1)
			{
				jQuery(this).parent().next().next().show();
				jQuery(this).parent().next().hide();
			}
			else if(select_calc_type == 3)
			{
				jQuery(this).parent().next().next().hide();
				jQuery(this).parent().next().show();
			}
			else
			{
				jQuery(this).parent().next().next().hide();
				jQuery(this).parent().next().hide();
			}
		});
	}
}

function subform()
{
	var fieldArray = new Array();
	var report_name=jQuery('#r_name').val();
	if(report_name==''){
		alert('报表名称不能为空');
		jQuery('#r_name').focus();
		return false;
	}
	var reporr_page=jQuery('#addarea').find('[name="field_content_child"]').length;
	if(reporr_page>0){
		var checkReturn=true;
		var type=0;
		var zxflag=1;
		jQuery('#addarea').find('[name="field_content_child"]').each(function(i,element){
			var font_show_name=jQuery(element).find('#disp_name').val();
			var font_field_name=jQuery(element).find('#field_name').val();
			var font_calc_type=jQuery(element).find('#calc_type').val();
			var font_calc_formula=jQuery.trim(jQuery(element).find('#calc_formula').val());
			var font_calc_weight=jQuery(element).find('#calc_weight').val();
			var arrayObj = font_field_name+font_calc_type+font_calc_formula+font_calc_weight;
			var fieldArraylength = fieldArray.length;
			var index=(i+1);
			if(fieldArraylength==0)
			{
				fieldArray[i] = arrayObj;
			}
			else
			{
				if(in_array(arrayObj,fieldArray))
				{
					alert("统计方式中序号为"+index+"的字段与计算方式设置重复");
					checkReturn=false;
					return false;
				}
				else
				{
					fieldArray[i] = arrayObj;
				}
				
			}
			
			if(font_field_name=='0')
			{
				alert(numTip+index+formTip);
				checkReturn=false;
				jQuery(element).find('#field_name').focus();
				return false;
			}
			if(font_show_name=='')
			{
				jQuery(element).find('#disp_name').focus();
				checkReturn=false;
				return false;
			}
			var stats=jQuery('[name="group_type"]:checked').val();
			/*if(stats!=1)
			{
				var calculate_way=jQuery(element).find('#calc_type').val();
				if( calculate_way==''){
					alert(numTip+index+staticsticalWayTip);
					checkReturn=false;
					return false;
				}
			}*/
		});
		if(checkReturn==false)
		{
			return;
		}
	}
//-----  报表字段处理开始-----
	var list_item=new Array();
	var objs=jQuery('#addarea').find('[name="field_content_child"]');
	var length=jQuery('#addarea').find('[name="field_content_child"]').length;
	for(var i=0;i<length;i++){
		var field_name=jQuery(objs[i]).find('#field_name').val();//报表字段中表单的字段的值
		var disp_name=jQuery(objs[i]).find('#disp_name').val()//报表字段中字段的显示名称
		var calc_type=jQuery(objs[i]).find('#calc_type').val()//计算方式
		var calc_formula=jQuery(objs[i]).find('#calc_formula').val();//公式
		var calc_weight=jQuery(objs[i]).find('#calc_weight').val()//权重
		var arr=[field_name,disp_name,calc_type,calc_formula,calc_weight];
		var str=arr.join('`');
		list_item.push(str);
		var list_item_str=list_item.join(',');
	}
	jQuery('#list_item').val(list_item_str);
//-----查询字段-----
	var search_item=new Array();
	var searchobjs=jQuery('#add_query_area').find('[name="field_content_querychild"]');
	var searchLength=jQuery('#add_query_area').find('[name="field_content_querychild"]').length;
	for(var j=0;j<searchLength;j++){
		var field_name_search=jQuery(searchobjs[j]).find('#field_name').val();
		var disp_name_search=jQuery(searchobjs[j]).find('#disp_name').val();
		var brr=[field_name_search,disp_name_search];
		var str_search=brr.join('`');
		search_item.push(str_search);
		var search_item_str=search_item.join(',');
	}
	jQuery('#query_item').val(search_item_str);
    jQuery('#report_form').submit();

}

function getSearchStr()
{
	var searchStrflow = jQuery.trim(jQuery('#FLOW_ID').val());
	if(searchStrflow =="all")
	{
		searchStrflow = "";
	}
	var searchStr = "flow_id="+searchStrflow;
	searchStr += "&r_name="+jQuery.trim(jQuery('#r_name').val());
	return 	searchStr;
}
function deletetodo(i_rid)
{
	var rid=i_rid;
	msg = td_lang.general.workflow.msg_128;
	if(window.confirm(msg)){
		jQuery.ajax({
		    type:"post",
		    url:"/general/system/workflow/flow_report/data/dodelete.php",
		    data:{"rid":rid},
		    success:function(){
		    	jQuery("#gridTable").trigger("reloadGrid");
		    },
		});
	}
}
//照熙添加，用于获取分组字段下拉框中内容,flow_id控件的onchange事件
function getFieldSelectList()
{
	var flow_id_zx = jQuery("#FLOW_ID").val();
	var old_flow_id=jQuery('#flow_id').val();
	
	if(old_flow_id!=flow_id_zx){
		jQuery("#addarea").empty();
		jQuery("#add_query_area").empty();
		addField();
		addQueryField();
	}
	jQuery.ajax({
	    type:"post",
	    url:"/general/system/workflow/flow_report/getFieldSelectList.php",
	    data:{"FLOW_ID":flow_id_zx},
	    success:function(html){
	    	jQuery("#group_field").html("");
	    	jQuery("#group_field").append(html);
	    },
	});
}
//照熙添加，用于字段名称和下拉框值的匹配
function fieldSelectChange(objofthis)
{
	var lastselect = jQuery(objofthis).next().val();//上次选中的值
	var txtval=jQuery(objofthis).next().next().val();//现在输入框的值
	var selectval = jQuery(objofthis).find("option:selected").text();//现在选中的值
	if(txtval==null||txtval==lastselect||txtval==""){
		jQuery(objofthis).next().next().val(selectval);
	}
	jQuery(objofthis).next().val(jQuery(objofthis).find("option:selected").text());
}

function getMainDivHeight()
{
	var windowsHeight=jQuery(window).outerHeight(true);
	var bottomHeight=jQuery('.work_bottom').outerHeight(true);
	var MainDivHeight=windowsHeight-(25+bottomHeight+20);
	return MainDivHeight;
}
//-----必需字段的检查判断------
function checkEssentialInfo(id)
{
	//----第一步的校验判断--------
	var flow_name= jQuery('#flow_name').val();
	if(flow_name==''||flow_name=="all"||flow_name=="全部流程")
	{
		alert(td_lang.system.workflow.msg_34);
		jQuery('#flow_name').focus();
		return false;
	}
	var r_name= jQuery('#r_name').val();
	if(r_name==''||r_name==null)
	{
		alert(td_lang.system.workflow.msg_35);
		jQuery('#r_name').focus();
		return false;
	}
	//------第一步的校验判断结束--------
	//-----第二步的校验判断开始---------
	if(jQuery("#check_Stat_zx").attr("class") == "active")
	{
		var reporr_page=jQuery('#addarea').find('[name="field_content_child"]').length;
		if(reporr_page>0)
		{
			var checkReturn=true;
			jQuery('#addarea').find('[name="field_content_child"]').each(function(i,element){
				var font_show_name=jQuery(element).find('#disp_name').val();
				var font_field_name=jQuery(element).find('#field_name').val();
				var font_calc_type=jQuery(element).find('#calc_type').val();
				var font_calc_formula=jQuery.trim(jQuery(element).find('#calc_formula').val());
				var font_calc_weight=jQuery(element).find('#calc_weight').val();
				var index=(i+1);
				if(font_field_name=='0')
				{
					alert(numTip+index+formTip);
					checkReturn=false;
					jQuery(element).find('#field_name').focus();
					return false;
				}
				if(font_show_name=='')
				{
					alert(numTip+index+dispNameTip);
					checkReturn=false;
					jQuery(element).find('#disp_name').focus();
					return false;
				}
				if(checkReturn!=false){
					var stats=jQuery('[name="group_type"]:checked').val();
					/*if(stats!=1)
					{
						var calculate_way=jQuery(element).find('#calc_type').val();
						if( calculate_way==''){
							alert(numTip+index+staticsticalWayTip);
							checkReturn=false;
							jQuery(element).find('#calc_type').focus();
							return false;
						}
					}*/
				}
			});
			if(checkReturn==false){
				return false;
			}
		}
	}
	//---------	
}
	//--------第二步的校验判断结束--------
//是否在数组中
function in_array(needle, haystack) 
{
	if(typeof needle == 'string' || typeof needle == 'number') {
		for(var i in haystack) {
			if(haystack[i] == needle) {
				return true;
			}
		}
	}
	return false;
}
//当字段数为1时不可操作,
function IsTheLastOne()
{
	var searchLength = jQuery('[name="field_content_child"]').length;
	if(searchLength ==2)
	{
		jQuery('[name="btn_updowndel"]').css('display','none');
	}
	else
	{
		jQuery('[name="field_content_child"]').each(function()
		{
			jQuery(this).find('#btn_updowndel').css('display','');
		});
	}
	var fieldLength = jQuery('[name="field_content_querychild"]').length;
	if(fieldLength ==2)
	{
		jQuery('[name="queryfield_btn_updowndel"]').css('display','none');
	}
	else
	{
		jQuery('[name="field_content_querychild"]').each(function()
		{
			jQuery(this).find('#queryfield_btn_updowndel').css('display','');
		});
	}
}

function setFiledCount()
{
	jQuery('[name="field_content_child"]').each(function(i,childobj)
	{
		jQuery(childobj).find('#field_child_count').html("");
		jQuery(childobj).find('#field_child_count').append(i+1);
	});
}
function setQueryFiledCount()
{
	jQuery('[name="field_content_querychild"]').each(function(count,querychildobj)
	{
		jQuery(querychildobj).find('#queryfield_child_count').html("");
		jQuery(querychildobj).find('#queryfield_child_count').append(count+1);
	});
}
function showbtn()
{
	var objitem = jQuery('#nav_left').find('.active').attr('item');
	if(objitem=='first'){
		jQuery('[name="btn_prev"]').find('button').attr('disabled','true');
		jQuery('[name="btn_prev"]').find('button').removeClass('btn-primary');
	}else{
		jQuery('[name="btn_prev"]').find('button').removeAttr("disabled");
		jQuery('[name="btn_prev"]').find('button').addClass('btn-primary');
	}
	if(objitem=='last'){
	  
		jQuery('[name="btn_next"]').find('button').attr('disabled','true');
		jQuery('[name="btn_next"]').find('button').removeClass('btn-primary');
	}else{
		jQuery('[name="btn_next"]').find('button').removeAttr("disabled");
		jQuery('[name="btn_next"]').find('button').addClass('btn-primary');
	}	
}

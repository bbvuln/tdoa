jQuery(document).ready(function()
{
	jQuery('.mappings').hide();
	prcs_type();
	jQuery("a[data-toggle='tab']").parent().click(function(){
		var href_id = jQuery('.active').parent().find("li[class$='active']").find("a").attr("href");
		return checkEssentialInfo(href_id);
	});
	getStepName('new','PRCS_NAME','flow_name','hidId');
	jQuery(window).resize(function(){
		jQuery('#nav-right-container').css('height',getMainDivHeight());
	});
	jQuery.getJSON('/general/workflow/get_flow_list.inc.php', {root:true,action:3}, function(jsonData){
		//jQuery("#child_flow_id").html("");
		jQuery("#child_flow_id").append('<option value=""></option>');
		jQuery.each(jsonData,function(i,t){
			jQuery("#child_flow_id").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+' level="'+t.level+'">'+t.txt+'</option>');
		});
	jQuery('#child_flow_id').find('option[value="all"]').remove();
		//上半部分为为页面的SELECT动态加载OPTIONS内容
		jQuery("#child_flow_id").combobox();//此页面表示将SELECT控件进行标准处理
		var href_id = jQuery('.active').parent().find("li[class$='active']").find("a").attr("href");
		if(typeof(href_id) != "#list")
		{
			//setTimeout('myload()',1000); 
			myload();
		}
	});
	jQuery(window).trigger('resize');
	jQuery('.dropdown-toggle').dropdown();
	jQuery('.bs-docs-tooltip-examples').popover('options');
	//按钮下拉动作、显隐判断
	jQuery(document).on("click", ".dropdown>.dropdown-menu>li", function()
	{
		var checkedParent = jQuery(this).parent().parent().find("button[class$='dropdown-toggle']");
		var currentHtml = jQuery(checkedParent).html();
		var currentText =currentHtml.replace('<span class="caret" id="caret"></span>','');
		var checkedText = jQuery(this).find("a").html();
		var checkedObj = jQuery(this).clone(true);
		var checkedHtml = jQuery(checkedObj).html();
		var newOptionHtml = checkedHtml.replace(checkedText, currentText);
		var newCheckedHtml = currentHtml.replace(currentText, checkedText);
		jQuery(checkedParent).html(newCheckedHtml);
		jQuery(this).parent().append("<li>"+newOptionHtml+"</li>");
		jQuery(this).parent().find('li').css('font-size','14px');
		jQuery(this).remove();
		
	});	
	jQuery(document).resize();
	
	jQuery('#context-menu').find('li').find('a').css('line-height', '25px');
	jQuery('.dropdown-menu').find('li').css('font-size','14px');	
	jQuery('.dropdown-menu').css('min-width','100px');
	jQuery('#context-menu>ul').find('a:last').css('border', '0px');
	jQuery('#context-menu>ul').find('a:last').css('color', 'red');
	jQuery('.form_content').contextmenu
	({
		target:'#context-menu',
		onItem: function(e, item){
			var fun = "form_"+jQuery(item).attr("tabindex");
			var form_id = jQuery('.form_content_hover').attr("form_id");
			if(typeof window[fun]){
				window[fun](form_id);
			}
		}
	});
	
	jQuery(document).on("click", ".form_content", function()
	{
		jQuery(".form_main").removeClass('form_folder_hover');
		jQuery(".form_main").removeClass('form_content_hover');
		var currentNameStr = jQuery(this).attr('class');
		
		var tmpNameStr = currentNameStr.replace('form_main ', '');
		jQuery(this).addClass(tmpNameStr+'_hover');
	})
	jQuery(".form_content,.form_folder").mousedown(function(e)
	{
		if(3 == e.which){
			jQuery(this).click();
		}
	});
	jQuery(".button_area>button").click(function()
	{
		var fun = "form_"+jQuery(this).attr("action");
		var form_id = jQuery('.form_content_hover').attr("form_id");
		if(typeof window[fun]){
			window[fun](form_id);
		}
	});		
	var objli=jQuery('#nav_left').find('li');
	jQuery(document).on("click", objli, function(){
		showPic();
		showbtn();
	});
		
//----------基本设置页面的插件的js 向上向下的开始	-----
	jQuery('#change_up').click(function(){
		var that=jQuery('#next_step_tab').find('tr');
		var cloneTrlength=that.length;
		var first=that.eq(0);
		var last=that.last();
		var sepcial=first.hasClass('ui-selected');
		var selectedTrLength=jQuery('#next_step_tab').find('.ui-selected').length;		
		if(that.hasClass('ui-selected')){
			if(sepcial==false){
				for(var i=0;i<cloneTrlength;i++){
					if(that.eq(i).hasClass('ui-selected')==true){
						var selectedTr=that.eq(i);
						var prevslibings=that.eq(i).prev();
						var cloneTr=that.eq(i);//.removeClass('select');
						if(selectedTrLength==1){
							prevslibings.before(cloneTr);
						}else{
							alert(step_tip);
							return false;
						}	
					}
				}
			}else{
				 if(selectedTrLength==1){
					cloneTr=first;//.removeClass('select');
					last.after(cloneTr);
				 }else{
					 for(i=0;i<cloneTrlength;i++){
						if(that.eq(i).hasClass('ui-selected')==true){
							 selectedTr=that.eq(i);
							 cloneTr=that.eq(i);//.removeClass('select');
							if(selectedTrLength==1){
								first.before(cloneTr);
							}else{
								alert(step_tip);
								return false;
							}	
						}
					}
				 }					
			}			
		}else{
			return false;
		}
	});
	jQuery('.change_down').click(function(){
		var that=jQuery('#next_step_tab').find('tr');
		var cloneTrlength=that.length;
		var first=that.eq(0);
		var last=that.last();
		var sepcial=last.hasClass('ui-selected');
		var selectedTrLength=jQuery('#next_step_tab').find('.ui-selected').length;		
		if(that.hasClass('ui-selected')){
			if(sepcial==false){
				for(var i=0;i<cloneTrlength;i++){
					if(that.eq(i).hasClass('ui-selected')==true){
						var selectedTr=that.eq(i);
						var nextslibings=that.eq(i).next();
						var cloneTr=that.eq(i);//.removeClass('select');
						if(selectedTrLength==1){
							nextslibings.after(cloneTr);
						}else{
							alert(step_tip);
							return false;
						}	
					}
				}
			}else{
				 if(selectedTrLength==1){
					cloneTr=last;//.removeClass('select');
					first.before(cloneTr);
				 }else{
					 for(i=0;i<cloneTrlength;i++){
						if(that.eq(i).hasClass('ui-selected')==true){
							 selectedTr=that.eq(i);
							 cloneTr=that.eq(i);//.removeClass('select');
							if(selectedTrLength==1){
								last.after(cloneTr);
							}else{
								alert(step_tip);
								return false;
							}	
						}
					}
				 }					
			}			
		}else{
			return false;
		}
	});
//----------基本设置页面的插件的js 向上向下的结束-----	
	if(typeof(alternative_array1)!="undefined" && (alternative_array1 !=""))
	{
		alternative_array_next();
	}
	if(typeof(alternative_array2)!="undefined" && (alternative_array2!=""))
	{
		
		alternative_array_go();
	}	
	//转入列表
	if(typeof(condition_in_array)!="undefined" && (condition_in_array!="")){
		condition_in();
	}
	//转出列表
	if(typeof(condition_out_array)!="undefined" && (condition_out_array!=""))
	{
		condition_out();
	}	
    $('#entrust2').click(function(){
        $('.entrust_tip2').toggleClass('active');
    });
	clickDefault();
});
window.onload = function()
{	
	var secu = jQuery("#secu").val();
	var workflow_setuser = jQuery("#workflow_setuser").val();
	var workflow_normal = jQuery("#workflow_normal").val();
	if(secu == 1 && workflow_setuser != 1 && workflow_normal == 1){ 
        change_condition();
    }
};
jQuery(window).resize(function()
{
	jQuery(".main_area").height(jQuery(".form_container").height() - jQuery(".main-head").height() 
	 - 20);	
});	
function auto_set()
{
	var auto_type = document.getElementById("AUTO_TYPE").value;
	
	if(auto_type =="")
    {
		jQuery("#circulation_no_user").css('display', 'block');
		jQuery("#circulation_intelligent_user").css('display', 'none');
	}
    else
    {
        jQuery("#circulation_intelligent_user").css('display', 'block');
        jQuery("#circulation_no_user").css('display', 'none');
    }
	if(auto_type=="3")
	{
		jQuery("#intelligent_auto_user_set").css('display', 'block');
	}else{
		jQuery("#intelligent_auto_user_set").css('display', 'none');
	}
    if(auto_type=="16")
    {
        jQuery("#intelligent_auto_prive_set").css('display', 'block');
    }else
    {
        jQuery("#intelligent_auto_prive_set").css('display', 'none');
    }
	if(auto_type=="12" || auto_type=="13" || auto_type=="14" || auto_type=="15")
	{
		jQuery("#intelligent_auto_dept_set").css('display', 'block');
	}else{
		jQuery("#intelligent_auto_dept_set").css('display', 'none');
	}
	if(auto_type=="2" || auto_type=="4" || auto_type=="5" || auto_type=="6" || auto_type=="9" || auto_type=="10" || auto_type=="11")
	{
		jQuery("#intelligent_base_user").css('display', 'block');
	}else{
		jQuery("#intelligent_base_user").css('display', 'none');
	}	   

	if(auto_type==8)
	{
		jQuery("#intelligent_prcs_user").css('display', 'block');
	}else{
		jQuery("#intelligent_prcs_user").css('display', 'none');
	}
	if(auto_type==7)
	{
		jQuery("#intelligent_item_id_hide").css('display', 'block');
	}else{
		jQuery("#intelligent_item_id_hide").css('display', 'none');
	}
}
function filter_auto_set()
{
	var user_filter = document.getElementById("USER_FILTER").value;
	if(user_filter==6)
	{
		jQuery("#filter_dept").css('display', 'block');
		jQuery("#filter_priv").css('display', 'none');
		jQuery("#filter_assist_dept").css('display', 'none');
		jQuery("#filter_assist_priv").css('display', 'none');
	}
	else if(user_filter==7)
	{
		jQuery("#filter_priv").css('display', 'block');
		jQuery("#filter_dept").css('display', 'none');
		jQuery("#filter_assist_dept").css('display', 'none');
		jQuery("#filter_assist_priv").css('display', 'none');
	}
	else if(user_filter==9)
	{
		jQuery("#filter_assist_dept").css('display', 'block');
		jQuery("#filter_dept").css('display', 'none');
		jQuery("#filter_priv").css('display', 'none');
		jQuery("#filter_assist_priv").css('display', 'none');
	}
	else if(user_filter==11)
	{
		jQuery("#filter_assist_priv").css('display', 'block');
		jQuery("#filter_dept").css('display', 'none');
		jQuery("#filter_priv").css('display', 'none');
		jQuery("#filter_assist_dept").css('display', 'none');
	}
	else{
		jQuery("#filter_dept").css('display', 'none');
		jQuery("#filter_priv").css('display', 'none');
		jQuery("#filter_assist_dept").css('display', 'none');
		jQuery("#filter_assist_priv").css('display', 'none');
	}
}
//条件设置判断显隐
function change_condition()
{
		var condition_id = jQuery("#CONDITION").val();
		var check_type = document.getElementById("CHECK_TYPE").checked;
		
		if((condition_id == "=") || (condition_id == "<>"))
		{
			if(check_type == true)
			{
				jQuery("#div_type").css('display', 'inline');
				jQuery("#div_value").css('display', 'none');
			}else{
				jQuery("#div_type").css('display', 'none');
				jQuery("#div_value").css('display', 'inline');
			}
			jQuery("#div_check_estimate").css('display', 'inline');
		}else{
			jQuery("#div_check_estimate").css('display', 'none');
			jQuery("#div_type").css('display', 'none');
			jQuery("#div_value").css('display', 'inline');
		}
};
//--------------条件设置页面的js
function add_condition(flag)
{
	var tab;
	var check_type = document.getElementById("CHECK_TYPE").checked;
	var creat_value = jQuery("#CONDITION").val();
	//var item_name = jQuery("#ITEM_NAME option:selected").text();
	var item_name = jQuery("#CONDITION_ITEM_NAME").val();
	var item_type = jQuery('#ITEM_TYPE option:selected').text();
	var item_value = jQuery('#condition_item_value').val();
	
	var vitem_value = "";
	if(item_value.indexOf("'")>=0)
	{
		alert(td_lang.system.workflow.msg_28);
		return;
	}
	var prcs_nub = 0;
	if(flag==1)
	{
		
		//var row_id_out = jQuery('#prcs_out_tab').find('tr').last().attr('prcs_out_id');
		jQuery('#condition_out').find('tr').each(function(){
			prcs_nub++;
		});
		var row_id_out = prcs_nub;
		var row_id_in = jQuery('#prcs_out_tab').find('tr').last().find("td:first").attr('prcs_nub');
		if(typeof(row_id_out)=="undefined"){
			row_id_out = 1;
		}else{
			row_id_out = eval(row_id_out) + 1;
		}
	}
	else
	{
		jQuery('#condition_in').find('tr').each(function(){
			prcs_nub++;
		});
		var row_id_in = prcs_nub;
		if(typeof(row_id_in)=="undefined"){
			row_id_in = 1;
		}else{
			row_id_in = eval(row_id_in) + 1;
		}
	}
			
	if((jQuery('#CONDITION').val() == "=" || jQuery('#CONDITION').val() == "<>" ) && document.getElementById("CHECK_TYPE").checked)
	{
		vitem_value = item_type;
	}else{
		vitem_value = item_value;
	}
	if(check_type == true && (creat_value == "="))
	{
		var str="'"+item_name+"'"+"=="+"'"+vitem_value+"'";
	}else if(check_type == true && (creat_value == "<>")){
		var str="'"+item_name+"'"+"!=="+"'"+vitem_value+"'";
	}else{
		var str="'"+item_name+"'"+creat_value+"'"+vitem_value+"'";
	}
	
	if(flag == 1){
		for(var i=1;i<row_id_out;i++)
		{	
			var out_id = outs + i;
		   if(jQuery('#prcs_out_tab').find('tr[prcs_out_id="'+i+'"]').find('td[row_td="2"]').text() == str)
		   {
			   alert(td_lang.system.workflow.msg_27);
			   return;
		   }
		}
		jQuery('#prcs_out_tab').append('<tr prcs_out_id="'+row_id_out+'"><td>['+row_id_out+']</td><td row_td="2">'+str+'</td><td><div class="condition_edit"><a href="javascript:void(0)" onclick="edit_condition(this)">编辑</a></div><div class="condition_delete"><a href="javascript:dalete_condition('+row_id_out+',1);" >删除</a></div></td></tr>');
	}else{
		for(var i=1;i<row_id_in;i++)
		{	
			var in_id = ins + i;
		   if(jQuery('#prcs_in_tab').find('tr[prcs_in_id="'+i+'"]').find('td[row_td="2"]').text() == str)
		   {
			   alert(td_lang.system.workflow.msg_27);
			   return;
		   }
		}
		jQuery('#prcs_in_tab').append('<tr prcs_in_id="'+row_id_in+'"><td>['+row_id_in+']</td><td row_td="2">'+str+'</td><td><div class="condition_edit"><a href="javascript:void(0)" onclick="edit_condition(this)">编辑</a></div><div class="condition_delete"><a href="javascript:dalete_condition('+row_id_in+',0);" >删除</a></div></td></tr>');
	}
}

function dalete_condition(row_id,flag)
{
	var I = 0;
	if(flag == 1){
		jQuery('#prcs_out_tab').find('tr[prcs_out_id="'+row_id+'"]').remove();
		
		jQuery('#condition_out').find('tr').each(function(){
		I++;
		 jQuery(this).find("td:first").html();
		 jQuery(this).find("td:first").html('['+I+']');
	});
	}else{
		jQuery('#prcs_in_tab').find('tr[prcs_in_id="'+row_id+'"]').remove();
		
		jQuery('#condition_in').find('tr').each(function(){
		I++;
		 jQuery(this).find("td:first").html();
		 jQuery(this).find("td:first").html('['+I+']');
	});
	}
	
		

}
function change_type()
{
	if((document.getElementById("CHECK_TYPE").checked))
	{
		jQuery("#div_type").css('display', 'block');
		jQuery("#div_value").css('display', 'none');
	}
	else
	{
		jQuery("#div_type").css('display', 'none');
		jQuery("#div_value").css('display', 'block');
	}
}
function getMainDivHeight()
{
	var windowsHeight=jQuery(window).outerHeight(true);
	var bottomHeight=jQuery('.work_bottom').outerHeight(true);
	var MainDivHeight=windowsHeight-(25+bottomHeight+20);
	return MainDivHeight;
}
//-----------灯泡弹出div提示开始-----------------
function showIntro(obj,objIntro,topHeight,leftHeight)
{
	var offset=obj.offset();
	var left=offset.left;
	var top=offset.top;
	objIntro.css('position','absolute').css('top',top+topHeight).css('left',left+leftHeight).css('border','1px solid #a5a28a');	
}
function showTitle(tipId,introId,topHeight,leftHeight)
{
	var obj=jQuery('#'+tipId);
	var objIntro=jQuery('#'+introId);
	showIntro(obj,objIntro,topHeight,leftHeight);
	objIntro.toggle();
}
//----------灯泡弹出div提示结束
function closeTip(tipId)
{
	var obj=jQuery('#'+tipId);
	obj.hide();
}

function prcs_type()
{
	prcs_guide();
	var typeVal=jQuery('#PRCS_TYPE').val();
	var prcs_to= jQuery("#PRCS_TO_FLAG").val();
	if(typeVal=='1')
    {
		if(prcs_to)
        {
			jQuery('#main_and_exp_1').show();
			jQuery('#back_step').show();
		}
        else
        {
			jQuery('#main_and_exp_1').hide();
			jQuery('#back_step').hide();
		}
		jQuery('#step_name').hide();
		jQuery('#titlesoftintelligent').hide();
		jQuery('#next_flow_step_div').hide();
		jQuery('#main_and_exp').hide();
		jQuery('#body1').show();
		jQuery('#add_attach').show();
		jQuery('#set_form_size').show();
		jQuery('#over_act').show();
		jQuery('#basis_next').hide();
		jQuery('.mappings').show();
        jQuery('#out_condition').hide();    //父子流程不支持转出条件，此处隐藏掉
        jQuery('#out_flow_top_type').hide();    
        jQuery('#out_circulation_sponsor').hide();
        if(jQuery("#act0").prop("checked") == true)
        {
            jQuery('#main_and_exp_1').hide();
			jQuery('#back_step').hide();
			jQuery('#RELATION_OUT').parent().hide();
        }
        else if(jQuery("#act").prop("checked") == true)
        {
            jQuery('#main_and_exp_1').show();
			jQuery('#back_step').show();
			jQuery('#RELATION_OUT').parent().show();
        }
	}else if(typeVal=='2'){
		jQuery('#main_and_exp_1').hide();
		jQuery('#back_step').hide();
		jQuery('#step_name').show();
		jQuery('#main_and_exp').show();
		jQuery('#next_flow_step_div').hide();		
		jQuery('#body1').hide();
		jQuery('#add_attach').hide();
		jQuery('#set_form_size').hide();
		jQuery('#over_act').hide();
		jQuery('#basis_next').hide();
		jQuery('.mappings').hide();
        jQuery('#out_condition').show();
        jQuery('#out_flow_top_type').show();    
        jQuery('#out_circulation_sponsor').show();
	}
    else if(typeVal=='3')
    {
		//柔性节点流转设置显控
        jQuery('#main_and_exp_1').hide();
		jQuery('#back_step').hide();
		jQuery('#next_flow_step_div').show();
		jQuery('#step_name').show();
		jQuery('#body1').hide();
		jQuery('#add_attach').hide();
		jQuery('#set_form_size').hide();
		jQuery('#over_act').hide()
		jQuery('#main_and_exp').hide();
		jQuery('#basis_next').show();
		jQuery('.mappings').hide();
        jQuery('#operatorBy').hide(); //主办人隐藏
        jQuery('#modify').hide(); //允许修改主办人隐藏
        jQuery('#bingfa').show(); //并发隐藏
        jQuery('#merge').hide(); //并发合并隐藏
        //jQuery('#softTips').show(); //提示显示
        //jQuery('#passAttach').hide(); //转交插件隐藏
        jQuery('#titlesoftcirculation').show();
        jQuery('#titlesoftintelligent').show();
        jQuery('#titlecirculation').hide();
        jQuery('#titleintelligent').hide();
        jQuery('#titlesoftoperator').show();
        jQuery('#titleoperator').hide();
        jQuery('#turnplugin').hide(); 
    }
    else 
    {
        jQuery('#main_and_exp_1').hide();
        jQuery('#back_step').hide();
        jQuery('#next_flow_step_div').show();
        jQuery('#step_name').show();
        jQuery('#body1').hide();
        jQuery('#add_attach').hide();
        jQuery('#set_form_size').hide();
        jQuery('#over_act').hide()
        jQuery('#main_and_exp').hide();
        jQuery('#basis_next').show();
        jQuery('.mappings').hide();
        jQuery('#out_condition').show();
        jQuery('#out_flow_top_type').show();    
        jQuery('#out_circulation_sponsor').show();
        jQuery('#operatorBy').show(); //主办人隐藏
        jQuery('#modify').show(); //允许修改主办人隐藏
        jQuery('#bingfa').show(); //并发隐藏
        jQuery('#merge').show(); //并发合并隐藏
        //jQuery('#softTips').hide(); //提示显示
        jQuery('#titleintelligent').show();
        jQuery('#titlesoftintelligent').hide();
        jQuery('#titlecirculation').show();
        jQuery('#titlesoftcirculation').hide();
        //jQuery('#passAttach').show();
        jQuery('#titlesoftoperator').hide();
        jQuery('#titleoperator').show();
        jQuery('#turnplugin').show();
        
    }   
}

function sub_form(flow_id)
{
	var prcs_type_flag = jQuery("#PRCS_TYPE").val();
	var child_flow_hidden_id = jQuery("#child_flow_hidden_id").val();
	if(prcs_type_flag == 1)
	{
		if(flow_id>=0)
		{
	        jQuery("#field_sub").load("get_field.php?FLOW_ID="+flow_id);
	        jQuery('.mappings').show();
	    }
	    else
	    {
	    	jQuery('.mappings').hide();
	       // alert("<?=_("请选择一个流程")?>");
	    }
	}else{
		jQuery('.mappings').hide();
	}
	
//如果更换子流程类型，删除父子映射关系和子父映射关系
	if(child_flow_hidden_id != flow_id)
	{
		jQuery("#RELATION_IN").empty();
		jQuery("#RELATION_OUT").empty();
		jQuery("#MAP_IN").val("");
		jQuery("#MAP_OUT").val("");
	}
	
	//除页面加载进来时第一次不删除父子映射关系和子父映射关系
	jQuery("#child_flow_hidden_id").val("");
	
	setTimeout(hideSontoFather,300); 
}

function hideSontoFather()
{
	var typeVal=jQuery('#PRCS_TYPE').val();
	
	if(jQuery("#act0").prop("checked") == true && typeVal == 1)
	{
		jQuery("#RELATION_OUT").parent().hide();
		jQuery('#sontofather').hide();
	}
	else if(jQuery("#act").prop("checked") == true && typeVal == 1)
	{
		jQuery("#RELATION_OUT").parent().show();
		jQuery('#sontofather').show();
	}
}

//添加父子、子父字段映射
function map_relation(direction){
	var option1,option2;
	var oFLD_PARENT = document.getElementById("FLD_PARENT");
	var oFLD_SUB = document.getElementById("FLD_SUB");
	if(oFLD_PARENT.selectedIndex!=-1&&oFLD_SUB.selectedIndex!=-1) {
		option1=oFLD_PARENT.options[oFLD_PARENT.selectedIndex].value;
		option2=oFLD_SUB.options[oFLD_SUB.selectedIndex].value;
		
		var data;
		if(direction=="IN"){
			data = option1+"=>"+option2+",";
		}else{
			data = option2+"=>"+option1+",";
		}

		var oMap = jQuery("#MAP_"+direction).val();
		if(oMap.indexOf(data) > -1){
			alert(sprintf(td_lang.system.workflow.msg_41,data.substring(0,data.length-1)));
		}else {
			map_add(data,direction);
		}
	}else {
		var child_flow_id = jQuery("#child_flow_id").val();
		if(child_flow_id == "" || child_flow_id == "all" || child_flow_id == null)
		{
			alert(td_lang.system.workflow.msg_52);
		}else{
			alert(td_lang.system.workflow.msg_53);
		}
		
	}
}

function myload()
{
	map_add('',"IN");
	map_add('',"OUT");
	var secu = jQuery("#secu").val();
	var workflow_setuser = jQuery("#workflow_setuser").val();
	var workflow_normal = jQuery("#workflow_normal").val();
	var child_flow_id = jQuery("#CHILD_FLOW").val();
	if(child_flow_id)
	{
		sub_form(child_flow_id);
		jQuery("#child_flow_id").val(child_flow_id);		
		var child_flow_name = jQuery("#CHILD_FLOW_NAME").val();
		jQuery("#flow_name").val(child_flow_name);
	}
	var prcs_type_flag = jQuery("#PRCS_TYPE").val();
	if(prcs_type_flag == 1)
	{
		sel_back();
	}	
	if(secu == 1 && workflow_setuser != 1 && workflow_normal == 1){
		auto_set();
		filter_auto_set();
		document.getElementById("remind_fld").disabled= document.getElementById("REMIND_ORNOT").checked? false : true;
	}
}
  
//添加映射关系
function map_add(data,direction,flag){
	var addhtml;
	var oldValue = jQuery("#MAP_"+direction).val();
	if(arguments.length>0) {
		oldValue+=data;
	}
	jQuery("#MAP_"+direction).val(oldValue);
	rel_array=oldValue.split(",");

	jQuery("#RELATION_"+direction).html("");

	for(i=0;i<rel_array.length-1;i++) {
		addhtml="<span>"+rel_array[i]+"<a href=\"javascript:\" onclick=\"map_del(this,'"+i+"','"+direction+"')\">"+
		"<img src=\"/static/images/remove.png\" title=\""+td_lang.system.workflow.msg_54+"\" border=\"0\" align=\"absmiddle\"></a>,</span>";
		jQuery("#RELATION_"+direction).append(addhtml);
	}
}
//删除映射关系
function map_del(a,index,direction)
{
    var span = a.parentNode;
    span.parentNode.removeChild(span)
	var new_value="";
	var oMap = jQuery("#MAP_"+direction).val();
	rel_array=oMap.split(",");
	rel_array[index]="";
	//print_r(rel_array);
	for(i=0;i<rel_array.length;i++)
	{ 
		if(rel_array[i]!="") {
		    new_value+=rel_array[i]+",";
		}
	}
	jQuery("#MAP_"+direction).val(new_value);
}

function sel_back(type)
{
	var prcs_to= jQuery("#PRCS_TO_FLAG").val();
	if(type)
	{
		if(type ==1){
			jQuery('#sontofather').show();
			jQuery('#RELATION_OUT').parent().show();
			jQuery('#main_and_exp_1').show();
			jQuery('#back_step').show();
		}else{
			jQuery('#sontofather').hide();
			jQuery('#RELATION_OUT').parent().hide();
			jQuery('#main_and_exp_1').hide();
			jQuery('#back_step').hide();
		}
	}else{
		if(prcs_to){
			jQuery('#main_and_exp_1').show();
			jQuery('#back_step').show();
		}else{
			jQuery('#main_and_exp_1').hide();
			jQuery('#back_step').hide();
		}
	}
	
}

function getStepName(type,id,contentId,hidId)
{
	if(type=='new'){
		jQuery('#'+id).blur(function(){
			var hidVal=jQuery('#'+hidId).val();
			var inputVal=jQuery(this).val();
			if( inputVal!==''){
				var newContent=inputVal;
			}else{
				newContent='';
			}			
			jQuery('.'+contentId).html(newContent);
		});
	}	
}

//流转设置会签意见显示控制
function signChange(obj)
{
	if(obj != 1)
		jQuery("#signlook").css('display', 'inline');
	else
		jQuery("#signlook").css('display', 'none');
}
//流转设置退回是否重新走流程显示控制
function backChange(obj)
{
	if(obj != 0)
		jQuery("#backflow").css('display', 'inline');
	else
		jQuery("#backflow").css('display', 'none');
}
//转入列表
function condition_in()
{
	//var jsonData = jQuery.parseJSON(condition_in_array);
	var jsonData = condition_in_array;
	var Data = {"runData":jsonData}
	var template = jQuery.templates("#condition_inTmpl");
	var htmlOutput = template.render(Data);
	jQuery("#condition_in").html(htmlOutput);
}
//转出列表
function condition_out()
{
	//var jsonData = jQuery.parseJSON(condition_out_array);
	var jsonData = condition_out_array;
	var Data = {"runData":jsonData}
	var template = jQuery.templates("#condition_outTmpl");
	var htmlOutput = template.render(Data);
	jQuery("#condition_out").html(htmlOutput);
}

//可写字段数据处理
function check_write()
{
	//--------------- 附件、图片控件和列表控件的隐藏域的处理   ----------
	var docControls=jQuery('[itemtype="FILEUPLOAD"]');
	var docControlsArr=new Array();
	var length=docControls.length;
	for (i = 0; i < length; i++)
	{
		option = jQuery(docControls[i]).attr('itemid');
		docControlsArr.push(option);
	}
	docControlsArr=docControlsArr.join(',')+',';//附件控件的隐藏域结束
	jQuery('#docControls').val(docControlsArr);//隐藏域赋值提交
    var imgControls=jQuery('[itemtype="IMGUPLOAD"]');
    var imgControlsArr=new Array();
    var length=imgControls.length;
    for (i = 0; i < length; i++)
    {
        option = jQuery(imgControls[i]).attr('itemid');
        imgControlsArr.push(option);
    }
    imgControlsArr=imgControlsArr.join(',')+',';//图片上传控件的隐藏域结束
    jQuery('#imgControls').val(imgControlsArr);//隐藏域赋值提交
	var listControls=jQuery('[itemtype="LIST_VIEW"]');
	var listControlsArr=new Array();
	var listLength=listControls.length;
	for (i = 0; i < listLength; i++)
	{
		option = jQuery(listControls[i]).attr('itemid');
		
		listControlsArr.push(option);
	}
	listControlsArr=listControlsArr.join(',')+',';//列表控件的隐藏域结束
	jQuery('#listControls').val(listControlsArr);//隐藏域赋值提交
	//------------------附件、图片控件和列表控件的隐藏域的处理结束---------------------------------
	var td=jQuery('#write_next_step_tab').find('td');
	if(typeof(td)!=='undefined')
	{
		var tdLength=td.length;
		var LIST_FLDS_STR= new Array();//列表扩展字段串查询页面仅查询该流程时生效
		for (i = 0; i < tdLength; i++)
		{
			option = jQuery(td[i]).text();
			if(option==flow_doc)
			{
				option='[A@]';
			}else if(option==work_name){
				option='[B@]';
			}
				
			LIST_FLDS_STR.push(option);
		}
		LIST_FLDS_STR=LIST_FLDS_STR.join(',')+',';
		jQuery('#LIST_FLDS_STR').val(LIST_FLDS_STR);//隐藏域赋值提交
	 }
	//列表控件 每一列单独设置隐藏域赋值提交
    jQuery('input[list_column_id][mode_type=readOnly]').each(function(index,element){
        var list_column_id = jQuery(element).attr('list_column_id');
        var hidden_obj = jQuery('input[list_column_id='+list_column_id+'][mode_type=hidden]');
        var readOnly = 0;
        var hidden = 0;
        if(element.checked)
        {
            readOnly = element.value;
        }
        else if(element.type == 'hidden')
        {
            readOnly = element.value;
        }
        if(hidden_obj[0].checked)
        {
            hidden = hidden_obj[0].value;
        }

        jQuery('#'+list_column_id).val(readOnly | hidden);
    });
	return true;
}
//新建、保存步骤信息
function prcs_checkForm()
{
	check_write();//可写字段数据处理
	//保密字段数据处理
	var td=jQuery('#h_next_step_tab').find('td');
	if(typeof(td)!=='undefined')
	{
		var tdLength=td.length;
		var LIST_FLDS_STR= new Array();
		for (i = 0; i < tdLength; i++)
		{
			option = jQuery(td[i]).text();
			LIST_FLDS_STR.push(option);
		}
		LIST_FLDS_STR=LIST_FLDS_STR.join(',')+',';
		jQuery('#H_LIST_FLDS_STR').val(LIST_FLDS_STR);//隐藏域赋值提交
	}	
	//可写字段数据处理
	var r_td=jQuery('#r_next_step_tab').find('td');
	if(typeof(r_td)!=='undefined')
	{
		var tdLength=r_td.length;
		var R_LIST_FLDS_STR= new Array();
		for (i = 0; i < tdLength; i++)
		{
			option = jQuery(r_td[i]).text();
			R_LIST_FLDS_STR.push(option);
		}
		R_LIST_FLDS_STR=R_LIST_FLDS_STR.join(',')+',';
		jQuery('#R_LIST_FLDS_STR').val(R_LIST_FLDS_STR);//隐藏域赋值提交
	}
	var prcs_to = "";
	jQuery('#alternative_next').find('tr').each(function(){
		var val=jQuery(this).attr('alternative_id');
		prcs_to+=val + ",";	
	});	
	jQuery("input[name='PRCS_TO']").val(prcs_to);
	var item_id = "";
	jQuery('#intelligent_next_step_tab').find('tr').each(function(){
		var val=jQuery(this).attr('itemid');
        item_id+=val + ",";
	});
	jQuery("input[name='ITEM_ID']").val(item_id);

	var user_filter = jQuery("#dropdown_filter").find("span").attr("creat_filter");
	jQuery("input[name='USER_FILTER']").val(user_filter);
	
	var auto_type = jQuery("#operator_auto_type").find("span").attr("value_id");
	jQuery("input[name='AUTO_TYPE']").val(auto_type);
	
	var auto_base_user = jQuery("#operator_base_user").find("span").attr("value_id");
	jQuery("input[name='AUTO_BASE_USER']").val(auto_base_user);
	
	var auto_prcs_user = jQuery("#operator_prcs_user").find("span").attr("value_id");
	jQuery("input[name='AUTO_PRCS_USER']").val(auto_base_user);
	
	//转入条件列表
	var condition_in= "";
	jQuery('#condition_in').find('tr').each(function(){
		var val_in=jQuery(this).find('td').eq(1).text();
		condition_in+=val_in + "\n";	
	});
	jQuery("#PRCS_INS").val(condition_in);
	//转出条件列表
	var condition_out= "";
	jQuery('#condition_out').find('tr').each(function(){
		var val_our=jQuery(this).find('td').eq(1).text();
		condition_out+=val_our + "\n";	
	});	
	jQuery("#PRCS_OUTS").val(condition_out);
		
	var prcs_id= jQuery('#F_PRCS_ID').val();
	if( prcs_id=='')
	{
		alert(td_lang.system.workflow.msg_prcs_1);
		jQuery('#F_PRCS_ID').focus();
		return false;
	}
	
	var prcs_id= jQuery('#F_PRCS_ID').val();
	if(jQuery("#PRCS_ERPEAT_PROMPT").length > 0)
	{
		alert(sprintf(td_lang.system.workflow.msg_prcs_4,prcs_id));
		return false;
	}
	var prcs_name= jQuery('#PRCS_NAME').val();
	var prcs_type=jQuery('#PRCS_TYPE').val();
	var child_flow_id =jQuery('#child_flow_id').val();
	if( prcs_name=='' && prcs_type!=1)
	{
		alert(td_lang.system.workflow.msg_prcs_2);
		jQuery('#PRCS_NAME').focus();
		return false;
	}
	
	if(prcs_type ==1 && (child_flow_id=="all" || child_flow_id == "" || child_flow_id == null))
	{
		alert(td_lang.system.workflow.msg_prcs_5);
		//jQuery('#child_flow_id').focus();
		return false;
	}
	
	var OVER_ACT = jQuery("input[name='OVER_ACT']:checked").val(); 
	var PRCS_BACK = jQuery("#PRCS_BACK").val(); 
	if(OVER_ACT == 1 && prcs_type == 1 && !PRCS_BACK)
	{
		alert(td_lang.system.workflow.msg_prcs_6);
		return false;
	}

    //插件列表，使用ajax提交
    var flow_id = jQuery("#FLOW_ID").val();
    var prcs_id= jQuery('#F_PRCS_ID').val();
    var triggers_info_json = {};
    jQuery('#condition_in_plugin').find('tr').each(function(index,element){
        var td_objs = jQuery(element).find('td');
        var trugger_info = {};

        trugger_info.PLUGIN_TYPE = td_objs.eq(0).attr('plugin_type');
        trugger_info.SORT_ID = td_objs.eq(1).html();
        trugger_info.unitcsName = td_objs.eq(2).html();
        trugger_info.PLUGIN = td_objs.eq(3).attr('real_plugin');
        trugger_info.PLUGIN_WAY = td_objs.eq(4).attr('plugin_way');
        trugger_info.DESCRIPTION = td_objs.eq(5).html();
        trugger_info.ACTIVED = td_objs.eq(6).find('input:checked').length;
        trugger_info.TRIGGER_ID = jQuery(element).attr('trigger_id');

        triggers_info_json[index]=trugger_info;
    });
    jQuery.post('update_trigger.php',{"triggersinfo":triggers_info_json,"flow_id":flow_id,"flow_prcs":prcs_id,"del_trigger_ids":window.del_trigger_ids},function(data){
        if(data != 'ok')
        {
            alert(td_lang.system.workflow.msg_prcs_7);
            return false;
        }
        else
        {
            document.getElementById("flow_step_define").action = "update.php";
            document.getElementById("flow_step_define").submit();
        }
    });

}

function prcs_verification_erpeat(prcs_id,flow_id)
{	
	var prcs_id= jQuery('#F_PRCS_ID').val();
	var flow_id= jQuery('#FLOW_ID').val();
	//var prcs_id_erpeat = jQuery('#F_PRCS_ID_ERPEAT').val();
	var prcs_key_id = jQuery('#prcs_key_id').val();
	jQuery.ajax({
		type: "POST",
		url: "prcs_verification_erpeat.php",
		cache: false,
		async: false,
		data: {"prcs_id":prcs_id,"flow_id":flow_id,"prcs_key_id":prcs_key_id},
		error: function(msg){
			alert(msg);
		},
		success: function(data){
			if(data == 2)
			{
				//alert(td_lang.system.workflow.msg_prcs_4);	
				jQuery("#PRCS_ERPEAT").html("");		
				jQuery("#PRCS_ERPEAT").append('<div class="f_field_explain_label" id="PRCS_ERPEAT_PROMPT"><span class="f_field_explain_title_red">'+sprintf(td_lang.system.workflow.msg_prcs_4,prcs_id)+'</span></div>');
				jQuery('#F_PRCS_ID').focus();
				
			}else{
				jQuery("#PRCS_ERPEAT").html("");
				//jQuery("#PRCS_ERPEAT").append('<div class="f_field_explain_label"><span class="f_field_explain_title_red">'+td_lang.system.workflow.msg_prcs_6+'</span></div>');
			}
		}
	});

}

function alternative_array_go()
{
	
	var jsonData = jQuery.parseJSON(alternative_array2);
	if(!jsonData || jsonData == null)
	{
		return false;
	}
	var Data = {"runData":jsonData}
	var template = jQuery.templates("#alternative_trTmpl");
	var htmlOutput = template.render(Data);
	jQuery("#alternative_tr").html(htmlOutput);
}
function alternative_array_next()
{
	var jsonData = jQuery.parseJSON(alternative_array1);
	var Data = {"runData":jsonData}	
	var template = jQuery.templates("#alternative_nextTmpl");
	var htmlOutput = template.render(Data);
	jQuery("#alternative_next").html(htmlOutput);
}
function clickDefault()
{
	var condition=jQuery('#hrefs').val();
	if((condition!=='') && typeof(condition) != 'undefined')
	{
		condition=condition.replace(/\\'/g,'');//过滤 接受到的字符串的特殊字符	
		var liId=condition+'_li';
		var hrefid = jQuery('.active').parent().find("li[class$='active']").find("a").attr("href");		
		hrefid = hrefid.substr(1);
		jQuery('.active').parent().find("li[class$='active']").siblings('#'+liId).addClass("active");		
		jQuery('.active').parent().find("div[class$='active']").siblings('#'+condition).addClass("active");
		jQuery('.active').parent().find("li[class$='active']").find("a[href='#"+hrefid+"']").parent().removeClass("active");
		jQuery('.active').parent().find("div[id='"+hrefid+"']").removeClass("active");
		showPic();
		showbtn();
	}
}
function check_back()
{
	if(jQuery('#GRAPH').val() == 1){
		window.close();
		return false;
	}
	window.close();
	//var actionType=jQuery('#actionType').val();
	//var FLOW_ID=jQuery('#FLOW_ID').val();
	//var src=serviceSrc+'/general/system/workflow/flow_guide/flow_type/flow_design/index.php?FLOW_ID='+FLOW_ID+'&TYPE='+actionType;
	//window.location.href=src;
	
}
//-----必需字段的检查判断------
function checkEssentialInfo(id)
{
	var prcs_type=jQuery('#PRCS_TYPE').val();
	var child_flow_id =jQuery('#child_flow_id').val();
	var prcs_id= jQuery('#F_PRCS_ID').val();
	if( prcs_id=='')
	{
		alert(td_lang.system.workflow.msg_prcs_1);
		jQuery('#F_PRCS_ID').focus();
		return false;
	}
	
	if(jQuery("#PRCS_ERPEAT_PROMPT").length > 0)
	{
		alert(sprintf(td_lang.system.workflow.msg_prcs_4,prcs_id));
		return false;
	}
	
	var prcs_name= jQuery('#PRCS_NAME').val();
	
	if( prcs_name=='' && prcs_type != 1)
	{
		alert(td_lang.system.workflow.msg_prcs_2);
		jQuery('#PRCS_NAME').focus();
		return false;
	}
	if(prcs_type ==1 && (child_flow_id=="all" || child_flow_id == "" ||  child_flow_id == null))
	{
		alert(td_lang.system.workflow.msg_prcs_5);
		//jQuery('#child_flow_id').focus();
		return false;
	}
	
//	if(id=="#operator")
//	{
//		var copy_to_id= jQuery('#F_COPY_TO_ID').val();
//		var operator_to_id= jQuery('#F_OPERATOR_TO_ID').val();
//		var priv_id= jQuery('#F_PRIV_ID').val();
//		if( copy_to_id=='' && operator_to_id=="" && priv_id=="")
//		{
//			alert(td_lang.system.workflow.msg_prcs_3);
//			jQuery('#F_COPY_TO_ID').focus();
//			return false;
//		}
//	}
}
function edit_condition(obj)
{

	var that=jQuery(obj).parent().parent().prev();
	if(that.find('input').length <= 0)
	{
    	var value=that.text();
    	that.html('');
    	that.html('<input type="text" value="'+value+'" onblur="show_span(this)" id="focus" />');
    	jQuery('#focus').focus();
    }
}

//添加经办人主办人
function LoadWindowBasis()
{
    var URL="user_select/?ID="+jQuery("#prcs_key_id").val();  
    var prcs_type = jQuery("#PRCS_TYPE").val();
    var flow_id = jQuery("#FLOW_ID").val();
    var prcs_back_id = jQuery("#PRCS_BACK").val();
    
    if(prcs_type==1 || prcs_type==2)
    {
        if(prcs_type==1) {
    	      URL="user_select/?FLOW_ID="+flow_id+"&ID="+prcs_back_id+"&TO_ID_OP=CHILD_AUTO_USER_OP&TO_NAME_OP=CHILD_AUTO_USER_OP_NAME&TO_ID=CHILD_AUTO_USER&TO_NAME=CHILD_AUTO_USER_NAME";
  	    } else {
  	        //外部流程
    	     // URL="user_select/?FLOW_ID=<?=$FLOW_ID?>&ID="+prcs_id+"&TO_ID_OP=EXT_BACK_USER_OP&TO_NAME_OP=EXT_BACK_USER_OP_NAME&TO_ID=EXT_BACK_USER&TO_NAME=EXT_BACK_USER_NAME";
  	    } 	    
  	    if(prcs_back_id=="")
  	    {
  		    return;  		 
  	    }
    }
    loc_y=loc_x=200;
    if(is_ie)
    {
        loc_x=document.body.scrollLeft+event.clientX-event.offsetX;
        loc_y=document.body.scrollTop+event.clientY-event.offsetY;
    }
     window.open(URL,"user_select","height=400,width=400,status=0,toolbar=no,menubar=no,location=no,scrollbars=no,top="+200+",left="+800+",resizable=yes");
}
function prcs_guide()
{
	var prcs_guide = "";
	var prcs_type = jQuery("#PRCS_TYPE").val();
	var secu = jQuery("#secu").val();
	var workflow_setuser = jQuery("#workflow_setuser").val();
	var workflow_normal = jQuery("#workflow_normal").val();
	var workflow_sethidden = jQuery("#workflow_sethidden").val();
	if(secu == 1 && workflow_normal != 1 &&(workflow_setuser == 1 && workflow_sethidden != 1 ||  workflow_setuser != 1 && workflow_sethidden == 1))
	{
		return;
	}else if(secu == 1 && workflow_normal != 1 && workflow_setuser == 1 && workflow_sethidden == 1)
	{
		prcs_guide +='<ul class="nav nav-list bs-docs-sidenav" id="address">';
		prcs_guide +='<li class="'+operator_flag+'" index="1" id="operator_li">';
			prcs_guide +='<a href="#operator" data-toggle="tab">';
				prcs_guide +='<i class="icon-chevron-right" style="margin-top:8px;"></i>';
				prcs_guide +='<span class="icon20-operator">'+td_lang.system.workflow.msg_operator+'</span></a>';
		prcs_guide +='</li>';
		prcs_guide +='<li class="'+hidden_flag+'" index="6" id="hidden_li">';
			prcs_guide +='<a href="#hidden" data-toggle="tab">';
				prcs_guide +='<i class="icon-chevron-right" style="margin-top:8px;"></i>';
				prcs_guide +='<span class="icon20-hidden">'+td_lang.system.workflow.msg_hidden+'</span></a>';
		prcs_guide +='</li>';
		prcs_guide +='</ul>';
		
	}else
	{
		if(prcs_type == 1)
		{
			prcs_guide +='<ul class="nav nav-list bs-docs-sidenav" id="address">';
				prcs_guide +='<li class="active" item="first" index="1" id="basis_li">';
					prcs_guide +='<a href="#basis" data-toggle="tab">';
						prcs_guide +='<i class="icon-chevron-right" style="margin-top:8px;"></i>';
						prcs_guide +='<span class="icon20-basis_hover">'+td_lang.system.workflow.msg_basis+'</span></a>';
				prcs_guide +='</li>';
				prcs_guide +='<li class="" index="3" id="intelligent_li">';
					prcs_guide +='<a href="#intelligent" data-toggle="tab">';
						prcs_guide +='<i class="icon-chevron-right" style="margin-top:8px;"></i>';
						prcs_guide +='<span class="icon20-intelligent">'+td_lang.system.workflow.msg_intelligent+'</span></a>';
				prcs_guide +='</li>';
				prcs_guide +='<li class="" index="6" id="hidden_li">';
					prcs_guide +='<a href="#hidden" data-toggle="tab">';
						prcs_guide +='<i class="icon-chevron-right" style="margin-top:8px;"></i>';
						prcs_guide +='<span class="icon20-hidden">'+td_lang.system.workflow.msg_hidden+'</span></a>';
				prcs_guide +='</li>';
				prcs_guide +='<li class="" item="last" index="2" id="condition_li">';
					prcs_guide +='<a href="#condition" data-toggle="tab">';
						prcs_guide +='<i class="icon-chevron-right" style="margin-top:8px;"></i>';
						prcs_guide +='<span class="icon20-condition">'+td_lang.system.workflow.msg_condition+'</span></a>';
				prcs_guide +='</li>';
			prcs_guide +='</ul>';
		}else{
			prcs_guide +='<ul class="nav nav-list bs-docs-sidenav" id="address">';
				prcs_guide +='<li class="active" item="first" index="1" id="basis_li">';
					prcs_guide +='<a href="#basis" data-toggle="tab">';
						prcs_guide +='<i class="icon-chevron-right" style="margin-top:8px;"></i>';
						prcs_guide +='<span class="icon20-basis_hover">'+td_lang.system.workflow.msg_basis+'</span></a>';
				prcs_guide +='</li>';
				prcs_guide +='<li class="" index="2" id="operator_li">';
					prcs_guide +='<a href="#operator" data-toggle="tab">';
						prcs_guide +='<i class="icon-chevron-right" style="margin-top:8px;"></i>';
						prcs_guide +='<span class="icon20-operator">'+td_lang.system.workflow.msg_operator+'</span></a>';
				prcs_guide +='</li>';
				prcs_guide +='<li class="" index="3" id="intelligent_li">';
					prcs_guide +='<a href="#intelligent" data-toggle="tab">';
						prcs_guide +='<i class="icon-chevron-right" style="margin-top:8px;"></i>';
						prcs_guide +='<span class="icon20-intelligent">'+td_lang.system.workflow.msg_intelligent+'</span></a>';
				prcs_guide +='</li>';
				prcs_guide +='<li class="" index="4" id="circulation_li">';
					prcs_guide +='<a href="#circulation" data-toggle="tab">';
						prcs_guide +='<i class="icon-chevron-right" style="margin-top:8px;"></i>';
						prcs_guide +='<span class="icon20-circulation">'+td_lang.system.workflow.msg_circulation+'</span></a>';
				prcs_guide +='</li>';
				prcs_guide +='<li class="" index="5" id="writable_li">';
					prcs_guide +='<a href="#writable" data-toggle="tab">';
						prcs_guide +='<i class="icon-chevron-right" style="margin-top:8px;"></i>';
						prcs_guide +='<span class="icon20-writable">'+td_lang.system.workflow.msg_writable+'</span></a>';
				prcs_guide +='</li>';
				prcs_guide +='<li class="" index="6" id="hidden_li">';
					prcs_guide +='<a href="#hidden" data-toggle="tab">';
						prcs_guide +='<i class="icon-chevron-right" style="margin-top:8px;"></i>';
						prcs_guide +='<span class="icon20-hidden">'+td_lang.system.workflow.msg_hidden+'</span></a>';
				prcs_guide +='</li>';
				prcs_guide +='<li class="" index="12" id="required_li">';
					prcs_guide +='<a href="#required" data-toggle="tab">';
						prcs_guide +='<i class="icon-chevron-right" style="margin-top:8px;"></i>';
						prcs_guide +='<span class="icon20-required">'+td_lang.system.workflow.msg_required+'</span></a>';
				prcs_guide +='</li>';
				prcs_guide +='<li class="" index="7" id="condition_li">';
					prcs_guide +='<a href="#condition" data-toggle="tab">';
						prcs_guide +='<i class="icon-chevron-right" style="margin-top:8px;"></i>';
						prcs_guide +='<span class="icon20-condition">'+td_lang.system.workflow.msg_condition+'</span></a>';
				prcs_guide +='</li>';
				prcs_guide +='<li class="" index="8" id="limit_li">';
					prcs_guide +='<a href="#limit" data-toggle="tab">';
						prcs_guide +='<i class="icon-chevron-right" style="margin-top:8px;"></i>';
						prcs_guide +='<span class="icon20-limit">'+td_lang.system.workflow.msg_limit+'</span></a>';
				prcs_guide +='</li>';
				prcs_guide +='<li class="" index="9" id="unit_li">';
					prcs_guide +='<a href="#unit" data-toggle="tab">';
						prcs_guide +='<i class="icon-chevron-right" style="margin-top:8px;"></i>';
						prcs_guide +='<span class="icon20-unit">'+td_lang.system.workflow.msg_unit+'</span></a>';
				prcs_guide +='</li>';
				prcs_guide +='<li class="" index="10" id="remind_li">';
					prcs_guide +='<a href="#remind" data-toggle="tab">';
						prcs_guide +='<i class="icon-chevron-right" style="margin-top:8px;"></i>';
						prcs_guide +='<span class="icon20-remind">'+td_lang.system.workflow.msg_remind+'</span></a>';
				prcs_guide +='</li>';
				prcs_guide +='<li class="" item="last" index="11" id="aip_li">';
					prcs_guide +='<a href="#aip" data-toggle="tab">';
						prcs_guide +='<i class="icon-chevron-right" style="margin-top:8px;"></i>';
						prcs_guide +='<span class="icon20-aip">'+td_lang.system.workflow.msg_aip+'</span></a>';
				prcs_guide +='</li>';
			prcs_guide +='</ul>';
		}
	}
	jQuery("#nav_left").html("");
	jQuery("#nav_left").append(prcs_guide);
}
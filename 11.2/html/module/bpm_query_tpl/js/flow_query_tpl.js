jQuery(document).ready(function()
{
    jQuery("a[data-toggle='tab']").parent().click(function(){
        return checkEssentialInfo();
    });
    if(jQuery('#FLOW_STATUS').val()=='1')
    {
        jQuery('#endTimeArea').show();
    }
    jQuery(window).resize(function(){
        jQuery('#nav-right-container').css('height',getMainDivHeight());
    });
    jQuery(window).trigger('resize');
    var objli=jQuery('#nav_left').find('li');
    jQuery(document).on("click", objli, function(){
        showPic();
        showbtn();
    });
});
function getMainDivHeight()
{
    var windowsHeight=jQuery(window).outerHeight(true);
    var bottomHeight=jQuery('.work_bottom').outerHeight(true);
    var MainDivHeight=windowsHeight-(25+bottomHeight);
    return MainDivHeight;
}
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
//--------编辑时候选中默认的下拉框-----
function checkIsChecked(id,value,type)
{
    if(type=='select')//代表处理select的选中
    {
        var obj=jQuery('#'+id+' option[value='+value+']');
        obj.attr('selected',true);
    }else if(type=='radio')
    {
        obj=jQuery('[name='+id+'][value='+value+']');
        obj.attr('checked','checked');
    }
}

//-----------------日期的 清空方法
function empty_date()
{
    document.form1.PRCS_DATE1.value="";
    document.form1.PRCS_DATE2.value="";
}

function empty_end_date()
{
    document.form1.PRCS_DATE3.value="";
    document.form1.PRCS_DATE4.value="";
}
//-----------------表单的提交方法----------
function my_submit2(OP)
{
    var tdselect=jQuery('#next_step_tab').find('td');
    var tdselectLength=jQuery('#next_step_tab').find('td').length;
    var td=jQuery('#alternative_tab').find('td');
    var tdLength=td.length;
    var SUM_FLD="";
    var DISP_FLD="";
    var USER_ID = jQuery("input[name='USER_ID']").val();
    if(jQuery("#PRCS_ERPEAT_PROMPT").length > 0)
    {
        alert(td_lang.system.workflow.msg_36);
        return false;
    }
    jQuery('#next_step_tab').find('tr').each(function(){
        var val_in=jQuery(this).find('td').attr('name');
        SUM_FLD+=val_in + ",";
    });
    jQuery("input[name='SUM_FLD']").val(SUM_FLD);
    jQuery('#alternative_tab').find('tr').each(function(){
        var val_to=jQuery(this).find('td').attr('name');
        DISP_FLD+=val_to + ",";
    });
    jQuery("input[name='DISP_FLD']").val(DISP_FLD);


    var qtpl_condition= "";
    jQuery('#condition_in').find('tr').each(function(){
        var qtpl_val=jQuery(this).find('td').eq(1).attr('fields');
        qtpl_condition += qtpl_val + "\n";
    });
    jQuery("#QTPL_PRCS_SET").val(qtpl_condition);

    if(document.form1.TPL_NAME.value.replace(/(^\s+)|(\s+$)/g,"") == ""){
        alert(td_lang.system.workflow.msg_26);
        return false;
    }
    document.form1.action="add.php?USER_ID="+USER_ID+"&FLOW_ID="+FLOW_ID+"&SUM_FLD="+SUM_FLD+"&DISP_FLD="+DISP_FLD+"";
    document.form1.target="_self";
    document.form1.submit();
    //根据地址栏的传过来的参数判断是否刷新页面
    var str=window.location.search;
    if(str.indexOf("QUERY")!=-1){
        window.opener.location.reload();
    }
    //window.opener.location.reload();
}

function add_condition()
{
    var creat_value = jQuery("#CONDITION").val();
    var item_name = jQuery("#ITEM_NAME").val();
    var item_value = jQuery('#condition_item_value').val();
    var fields = jQuery('#ITEM_NAME').find('option[value="'+item_name+'"]').attr('fields');
    var row_id_in = fields.split('_').pop();
    if(item_value.indexOf("'")>=0)
    {
        alert(td_lang.system.workflow.msg_28);
        return;
    }
    if(row_id_in.indexOf('m') > -1)
    {
        row_id_in = row_id_in.split('m').pop();
    }
    if(jQuery('#prcs_in_tab').find('tr[prcs_in_id="'+row_id_in+'"]').size() > 0){
        alert(td_lang.system.workflow.msg_57);
        return;
    }
    var str="'"+item_name+"'"+creat_value+"'"+item_value+"'";
    jQuery('#prcs_in_tab').append('<tr prcs_in_id="'+row_id_in+'"><td>['+row_id_in+']</td><td fields="\''+fields+'\''+creat_value+'\''+item_value+'\'" row_td="2">'+str+'</td><td><div class="condition_delete"><a href="javascript:dalete_condition('+row_id_in+',0);" >删除</a></div></td></tr>');

}
function dalete_condition(row_id,flag)
{
    jQuery('#prcs_in_tab').find('tr[prcs_in_id="'+row_id+'"]').remove();
}
function show_span(obj){
    var value=jQuery(obj).val();
    var parent=jQuery(obj).parent();
    parent.html('');
    parent.html(value);
}
//-----必需字段的检查判断------
function checkEssentialInfo()
{
    var flow_name= jQuery('#step_val').val();
    if( flow_name=='')
    {
        alert(td_lang.system.workflow.msg_26);
        jQuery('#step_val').focus();
        return false;
    }
    if(jQuery("#PRCS_ERPEAT_PROMPT").length > 0)
    {
        alert(td_lang.system.workflow.msg_36);
        return false;
    }
}
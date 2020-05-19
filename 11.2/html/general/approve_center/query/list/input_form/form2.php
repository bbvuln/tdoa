<iframe name="get_attach" style="display: none;"></iframe>
<table class="TableBlock" align="center" width="100%" id="attach_table">
<?
include_once("inc/auth.inc.php");
if($ATTACHMENT_ID=="")
{
   echo "<tr style='line-height:30px;'><td><div style='background:#fdfaf3;' align=center>"._("无附件")."</div></td></tr>";
}
else
{
    $play_btn = '<tr class="TableLine1" style="line-height:30px;"><td style="padding-left: 40px;" colspan="4">
            <input type="checkbox" id="check_all_attachment" style="margin-right: 10px;" onclick="javascript: changeDownURL(this);" /><label for="check_all_attachment">全选&nbsp;&nbsp;&nbsp;</label>
            <select id="attach_method" style="border-radius:5px; height:25px; width:74px;padding:0px;" onchange="change_disableBtn(this);">
            <option id="attach_down" down_url="" value="down">批量下载</option>';
    // $ATTACH_DEL_PRIV=0;
    // if(($OP_FLAG || $USER_ATTACH_EDIT_PRIV) && ( find_id($PRCS_ITEM,"[A@]") || ($FLOW_TYPE==2 && ($FREE_ITEM=="" || find_id($FREE_ITEM,"[A@]")))))
    // {
        // if(find_id($ATTACH_PRIV,3) && $OP_FLAG)
            // $ATTACH_DEL_PRIV = 1;
        // if($FLOW_TYPE==2) $ATTACH_DEL_PRIV=1;
        // if($ATTACH_DEL_PRIV)
        // {
            $play_btn .= '<option id="attach_del" down_url="" value="del">批量删除</option>';
        // }
    // }
    $play_btn .= '</select><input type="button" style="border-radius:5px; width:63px; height:25px; background-color: #ffffee; padding: 0px; margin-left: 7px;" onclick="execute()" value="执行操作"/></td></tr>';
    echo $play_btn;

    $have_atta_arr = array();
    $att_query = "SELECT distinct flow_prcs
				FROM bpm_run_attach
				WHERE run_id = '$RUN_ID'
				ORDER BY flow_prcs";
	$att_cursor = exequery(TD::conn(), $att_query);
	while($att_row = mysql_fetch_array($att_cursor, MYSQL_ASSOC)){
		$UPLOAD_FLOW_PRCS = $att_row["flow_prcs"];
		$query1 = "SELECT PRCS_NAME from bpm_process WHERE FLOW_ID='$FLOW_ID' AND PRCS_ID='$UPLOAD_FLOW_PRCS'";
		$cursor1= exequery(TD::conn(),$query1);
		if($ROW1 = mysql_fetch_array($cursor1))
		{
			$UPLOAD_PRCS_NAME = $ROW1['PRCS_NAME'];
		}
		?>
		<tr class="TableLine1" style="line-height:30px;">
			<td style="padding-left:40px;background:#fdfaf3;" colspan='4'>
			 <?=sprintf(_("第%s步 %s"),$UPLOAD_FLOW_PRCS, $UPLOAD_PRCS_NAME);?>
			</td>
		</tr>
			<?php
				$detail_count = 0;

                $r_query = "SELECT BEGIN_DEPT FROM bpm_run WHERE RUN_ID='$RUN_ID' AND FLOW_ID='$FLOW_ID'";
                $r_cursor = exequery(TD::conn(), $r_query);

                while($r_row = mysql_fetch_array($r_cursor, MYSQL_ASSOC)){
                    $BEGIN_DEPT = $r_row['BEGIN_DEPT'];
                }
				$d_query = "SELECT upload_user, flow_prcs, attachment_id, attachment_name, upload_time 
							FROM bpm_run_attach
							INNER JOIN attachment ON attachment.AID=LEFT(bpm_run_attach.ATTACHMENT_ID,LOCATE('@',bpm_run_attach.ATTACHMENT_ID)-1) AND attachment.DEL_FLAG=0
						WHERE run_id = '$RUN_ID' AND flow_prcs = '$UPLOAD_FLOW_PRCS' ORDER BY upload_time ASC";
				$d_cursor = exequery(TD::conn(), $d_query);
				
				while($d_row = mysql_fetch_array($d_cursor, MYSQL_ASSOC)){
					$detail_count++;
					$UPLOAD_USER = $d_row['upload_user'];
					$UPLOAD_USER_NAME_WORK = rtrim(GetUserNameById($UPLOAD_USER), ",");
					$UPLOAD_TIME = $d_row['upload_time'];
					$d_attachment_id = $d_row["attachment_id"];
					$have_atta_arr[] = $d_attachment_id;
					$d_attachment_name = $d_row["attachment_name"];
					$UPLOAD_FILE_SIZE = sprintf("%u", attach_size($d_attachment_id, $d_attachment_name));
					if(floor($UPLOAD_FILE_SIZE/1024/1024)>0)
						$FILE_SIZE=round($UPLOAD_FILE_SIZE/1024/1024,1)."M";
					else if(floor($UPLOAD_FILE_SIZE/1024)>0)
						$FILE_SIZE=round($UPLOAD_FILE_SIZE/1024,1)."K";
					else
						$FILE_SIZE=round($UPLOAD_FILE_SIZE)."B";

					if($detail_count%2==1)
						$TableLine="TableLine1";
					else
						$TableLine="TableLine2";
					?>
						<tr class="TableData" style="line-height:30px;">
						<td style="padding-left:35px;">
					<?
							  // $DOWN_PRIV_OFFICE="00";
							  //自由流程不限制
							  // if($FLOW_TYPE=="2")
								 $DOWN_PRIV_OFFICE="11";
							  // else
							  // {
								// if(find_id($ATTACH_PRIV,4))
								   // $DOWN_PRIV_OFFICE='11';
								// elseif(find_id($ATTACH_PRIV,5))
								   // $DOWN_PRIV_OFFICE='01';
								// else
								   // $DOWN_PRIV_OFFICE='00';  
							  // }      
							  // $ATTACH_EDIT_PRIV=$ATTACH_DEL_PRIV=0;
                              // $FlowPriv = getFlowRunPrivOfManage($FLOW_ID, $BEGIN_DEPT, $_SESSION["LOGIN_USER_ID"], $_SESSION["LOGIN_DEPT_ID"], $_SESSION["LOGIN_USER_PRIV"], $_SESSION["LOGIN_DEPT_ID_OTHER"], $_SESSION["LOGIN_USER_PRIV_OTHER"]);
                              // if(find_id($FlowPriv,4)){
                                  $ATTACH_EDIT_PRIV=$ATTACH_DEL_PRIV=1;
                              // }
                              echo attach_link($d_attachment_id,$d_attachment_name,0,1,$DOWN_PRIV_OFFICE,$ATTACH_EDIT_PRIV,$ATTACH_DEL_PRIV,1,1,0,"input_form",false,0,1);
					?>
							</td>
							<td align='center'><?=$FILE_SIZE?></td>
							<td align='center'><?=$UPLOAD_USER_NAME_WORK?></td>
							<td align='center'><?=$UPLOAD_TIME?></td>
						</tr>
				<?php
				}
	}
	$parent_attachment_name_arr = array();
	// if($PARENT_RUN != ""){
		// $parent_att_query = "SELECT attachment_name FROM bpm_run WHERE run_id = '$PARENT_RUN'";
		// $parent_att_cursor = exequery(TD::conn(), $parent_att_query);
		// if($parent_att_row = mysql_fetch_assoc($parent_att_cursor)){
			// $parent_attachment_name = $parent_att_row["attachment_name"];
			// $parent_attachment_name_arr = explode("*",$parent_attachment_name);
		// }
	// }
	$ATTACHMENT_ID_ARRAY=explode(",",rtrim($ATTACHMENT_ID,","));
	$ATTACHMENT_NAME_ARRAY=explode("*",rtrim($ATTACHMENT_NAME,"*"));
	
	$ARRAY_COUNT=sizeof($ATTACHMENT_ID_ARRAY);

	for($I=0;$I<$ARRAY_COUNT;$I++){  
		if($ATTACHMENT_ID_ARRAY[$I]=="" || in_array($ATTACHMENT_ID_ARRAY[$I],$have_atta_arr)){
			continue;
		}
		$FROM_NAME = _('其他');
		if(in_array($ATTACHMENT_NAME_ARRAY[$I],$parent_attachment_name_arr)){
			$FROM_NAME = _('父流程');
		}
		$demand_collection_count++;
		if($demand_collection_count == 1){
			?>
            <tr class="TableLine1" style="line-height:30px;">
                <td style="padding-left:40px;background:#fdfaf3;" colspan='4'>
                    <?=_("附件来源:")?><font style="font-weight:bold;font-style:italic;"><?=_($FROM_NAME)?></font>
                </td>
            </tr>
			<?
		}
		$UPLOAD_FILE_SIZE = sprintf("%u", attach_size($ATTACHMENT_ID_ARRAY[$I], $ATTACHMENT_NAME_ARRAY[$I]));
		if(floor($UPLOAD_FILE_SIZE/1024/1024)>0)
			$FILE_SIZE=round($UPLOAD_FILE_SIZE/1024/1024,1)."M";
		else if(floor($UPLOAD_FILE_SIZE/1024)>0)
			$FILE_SIZE=round($UPLOAD_FILE_SIZE/1024,1)."K";
		else
			$FILE_SIZE=round($UPLOAD_FILE_SIZE)."B";

		if($I%2==1)
			$TableLine="TableLine1";
		else
			$TableLine="TableLine2";
		?>
			<tr class="TableData">
				<td style="padding-left:35px;">
		<?php

		  //自由流程不限制

		$DOWN_PRIV_OFFICE="11";
		     
		$ATTACH_EDIT_PRIV=$ATTACH_DEL_PRIV=0;

		  //默认为空则具有所有权限
		  
			 echo attach_link($ATTACHMENT_ID_ARRAY[$I],$ATTACHMENT_NAME_ARRAY[$I],0,1,$DOWN_PRIV_OFFICE,1,1,1,1,0,"input_form",false,0,1);
        $other_query = "SELECT * from bpm_run_attach where ATTACHMENT_ID='$ATTACHMENT_ID_ARRAY[$I]'";
        $other_cursor = exequery(TD::conn(), $other_query);

        if($other_row = mysql_fetch_array($other_cursor))
        {
            $other_upload_user = $other_row["UPLOAD_USER"];
            $other_upload_user = rtrim(GetUserNameById($other_upload_user), ",");
            $other_upload_time = $other_row["UPLOAD_TIME"];
        }
			 ?>
				</td>
					<td align="center"><?=$FILE_SIZE?></td>
					<td align="center"><?=$other_upload_user?></td>
					<td align="center"><?=$other_upload_time?></td>
				</tr>
			<?php				 
	}
}
?>
</table>
<table class="TableBlock no-top-border" align="center" width="100%">
<?
//------------- 上传 ---------------
    $ATTACH_ROLE = 1;       //上传权限
?>
    <tr height="25">
	  <td nowrap class="TableContent" width="70" align="center">
		<?=_("上传附件：")?>
      </td>
      <td class="TableData">
        <script>ShowAddFile();</script>
        <a class="add_swfupload" href="javascript:void(0)"><?=_("批量上传")?><span id="spanButtonUpload" title="<?=_("批量上传附件")?>"></span></a>
        <div id="fsUploadArea" class="flash" style="width:300px;text-align:left;">
          <div id="fsUploadProgress">&nbsp;</div>
          <div id="totalStatics"></div>
          <div>
            <input type="button" id="btnStart" class="SmallButton" value="<?=_("开始上传")?>" onClick="swfupload.startUpload();" disabled="disabled">&nbsp;&nbsp;
            <input type="button" id="btnCancel" class="SmallButton" value="<?=_("全部取消")?>" onClick="swfupload.cancelQueue();" disabled="disabled">&nbsp;&nbsp;
            <input type="button" class="SmallButton" value="<?=_("刷新页面")?>" onClick="window.location.reload();">
          </div>
        </div>
        <input type="hidden" name="ATTACH_PRIV" value="1">
        <input type="hidden" name="ATTACHMENT_ID_OLD" value="<?=$ATTACHMENT_ID?>">
        <input type="hidden" name="ATTACHMENT_NAME_OLD" value="<?=$ATTACHMENT_NAME?>">
      </td>
      <td nowrap class="TableContent" width="90" align="center">
    	 <?=_("在线创建文档：")?>
      </td>
      <td class="TableData">
         <div style="line-height:25px;">
         <input type="radio" onclick="document.all('NEW_TYPE').value='doc'" name="DOC_TYPE" id="NEW_TYPE1"><label for="NEW_TYPE1">Word<?=_("文档")?></label>
         <input type="radio" onclick="document.all('NEW_TYPE').value='xls'" name="DOC_TYPE" id="NEW_TYPE2"><label for="NEW_TYPE2">Excel<?=_("文档")?></label>
         <input type="radio" onclick="document.all('NEW_TYPE').value='ppt'" name="DOC_TYPE" id="NEW_TYPE3"><label for="NEW_TYPE3">PPT<?=_("文档")?></label>
         </div>
		 <b><?=_("附件名：")?></b><input type="text" style="width:100px;" name="NEW_NAME" size="20" class="SmallInput" value="<?=_("新建文档")?>">
         <input type="button" class="btn btn-small" value="<?=_("在线创建附件")?>" onclick="new_attach();">
         <input type="hidden" value="" name="NEW_TYPE">
<?
if($ATTACHMENT_ID_OFFICE!="" && $ATTACHMENT_NAME_OFFICE!="")
{
   $OFFICE_EDIT_CODE = urlencode(td_authcode("4", "ENCODE", md5($ATTACHMENT_NAME_OFFICE)));
?>

<script>window.open("/module/OC/?MODULE=<?=$MODULE?>&YM=<?=$YM?>&ATTACHMENT_ID=<?=$ATTACHMENT_ID_OFFICE?>&ATTACHMENT_NAME=<?=urlencode($ATTACHMENT_NAME_OFFICE)?>&OP_CODE=<?=$OFFICE_EDIT_CODE?>",'CONTENT_<?=$CONTENT_ID?>','menubar=0,toolbar=0,status=1,scrollbars=1,resizable=1');</script>
<?
}
?>
	  </td>
     </tr>
</table>
<a id="download_attach_file" href="javascript: void(0);"></a>
<script type="text/javascript">
    jQuery(function(){
        var attach_obj = jQuery('#attach_table tr[class=TableData]').find('td:first input[enabled=enabled]');
        if ( attach_obj.length==0 ) {
            jQuery('#check_all_attachment').attr('disabled','disabled');
        }
    });
    function changeDownURL(obj){
        if(obj){
            jQuery('#attach_table tr[class=TableData]').find('td:first input[enabled=enabled]').each(function(index,element){
                element.checked = obj.checked;
            });
        }
        var down_url = '';
        var del_url = 'delete_public_attach.php?actionType=<?=$actionType?>&MENU_FLAG=<?=$MENU_FLAG?>&EDIT_MODE=<?=$EDIT_MODE?>&RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>&PRCS_KEY_ID=<?=$PRCS_KEY_ID?>';
        var aid = '';
        var module = '';
        var ym = '';
        var attachment_id = '';
        var attachment_name = '';
        var del_attachment_id = '';
        var del_attachment_name = '';

        var attach_checked_obj = jQuery('#attach_table tr[class=TableData]').find('td:first input[enabled=enabled]:checked');
        var attach_obj = jQuery('#attach_table tr[class=TableData]').find('td:first input[enabled=enabled]');

        var attach_method = jQuery('#attach_method').val();

        /*if(attach_method == 'down')
        {
            if(attach_checked_obj.length > 0){
                attach_checked_obj.each(function(index,element){
                    aid += jQuery(element).attr('aid')+'||';
                    module += jQuery(element).attr('module')+'||';
                    ym += jQuery(element).attr('ym')+'||';
                    attachment_id += jQuery(element).attr('attachment_id')+'||';
                    attachment_name += jQuery(element).attr('attachment_name')+'||';
                });

                down_url = '/inc/attach.php?AID='+aid+'&MODULE='+module+'&YM='+ym+'&ATTACHMENT_ID='+attachment_id+'&ATTACHMENT_NAME='+attachment_name+'&IS_ATTACHE_ALL=1&RUN_NAME='+(parent.jQuery('#run_name_old').val());
                jQuery('#attach_down').attr('down_url',down_url);
            }
            else{
                jQuery('#attach_down').attr('down_url','');
            }
        }
        else if(attach_method == 'del')
        {
            if(attach_checked_obj.length > 0){
                attach_checked_obj.each(function(index,element){
                    del_attachment_id += jQuery(element).attr('DEL_ATTACHMENT_ID')+'||';
                    del_attachment_name += jQuery(element).attr('DEL_ATTACHMENT_NAME')+'||';
                });

                del_url += '&ATTACHMENT_ID='+del_attachment_id+'&ATTACHMENT_NAME='+URLSpecialChars(del_attachment_name);
                jQuery('#attach_del').attr('del_url',del_url);
            }
            else{
                jQuery('#attach_del').attr('del_url','');
            }
        }

        if((attach_obj.length-attach_checked_obj.length)>0){
            jQuery('#check_all_attachment')[0].checked = false;
        }
        else if((attach_obj.length-attach_checked_obj.length)==0){
            jQuery('#check_all_attachment')[0].checked = true;
        }*/
        if(attach_checked_obj.length > 0){
            attach_checked_obj.each(function(index,element){
                aid += jQuery(element).attr('aid')+'||';
                module += jQuery(element).attr('module')+'||';
                ym += jQuery(element).attr('ym')+'||';
                attachment_id += jQuery(element).attr('attachment_id')+'||';
                attachment_name += jQuery(element).attr('attachment_name')+'||';
                del_attachment_id += jQuery(element).attr('DEL_ATTACHMENT_ID')+'||';
                del_attachment_name += jQuery(element).attr('DEL_ATTACHMENT_NAME')+'||';
            });

            //down_url = '/inc/attach.php?AID='+aid+'&MODULE='+module+'&YM='+ym+'&ATTACHMENT_ID='+attachment_id+'&ATTACHMENT_NAME='+attachment_name+'&IS_ATTACHE_ALL=1&RUN_NAME='+(parent.jQuery('#run_name_old').val());
            down_url = '{"AID":"'+aid+'","MODULE":"'+module+'","YM":"'+ym+'","ATTACHMENT_ID":"'+attachment_id+'","ATTACHMENT_NAME":"'+attachment_name+'","IS_ATTACHE_ALL":"1","RUN_NAME":"'+(parent.jQuery('#run_name_old').val())+'"}';
            jQuery('#attach_down').attr('down_url',down_url);
            del_url += '&ATTACHMENT_ID='+del_attachment_id+'&ATTACHMENT_NAME='+URLSpecialChars(del_attachment_name);
            jQuery('#attach_del').attr('del_url',del_url);
        }
        else{
            jQuery('#attach_down').attr('down_url','');
            jQuery('#attach_del').attr('del_url','');
        }

        if(attach_obj.length>0)
        {
            jQuery('#check_all_attachment')[0].removeAttribute('disabled');
            jQuery('#check_all_attachment').attr('enabled','enabled');
            if((attach_obj.length-attach_checked_obj.length)>0){
                jQuery('#check_all_attachment')[0].checked = false;
            }
            else if((attach_obj.length-attach_checked_obj.length)==0){
                jQuery('#check_all_attachment')[0].checked = true;
            }
        } else {
            jQuery('#check_all_attachment')[0].checked = false;
            jQuery('#check_all_attachment').attr('disabled','disabled');
        }


    }

    function execute()
    {
        var attach_method = jQuery('#attach_method').val();
        if (attach_method == 'down')
            download_attach();
        else if (attach_method == 'del')
            delete_attachs();
    }

    function download_attach(){
        var down_url = jQuery('#attach_down').attr('down_url');
        var count_size = 0;
        jQuery('#attach_table tr[class=TableData]').find('td:first input[enabled=enabled]:checked').each(function(index,element){
            count_size += parseFloat(jQuery(element).attr('real_size'));
        });
        if(!down_url)
        {
            window.alert("请选择要下载的附件");
            return false;
        }
        if(count_size > 125)
        {
            alert("请选择小于 128M 大小的附件");
            return false;
        }
        if(window.confirm("一次下载多个文件需要在服务器上做压缩处理，会占用较多服务器CPU资源，确定继续下载吗？\n该操作请不要下载超过128MB的大文件\n已选择【"+count_size.toFixed(2)+"M】的数据")){
            // 取消关闭提示
            /*window.onbeforeunload = function(){};
            window.location.href = down_url;
            // 恢复页面关闭提示
            setTimeout(myload,300);*/
            var form=jQuery("<form>");//定义一个form表单
            form.attr("style","display:none");
            form.attr("target","get_attach");
            form.attr("method","post");
            form.attr("action","/inc/attach.php");

            jQuery("body").append(form);//将表单放置在web中
            var attach_infos = jQuery.parseJSON(down_url)
            jQuery.each(attach_infos,
                function(index,element){
                    var input1=jQuery("<input>");
                    input1.attr("type","hidden");
                    input1.attr("name",index);
                    input1.attr("value",element);

                    form.append(input1);
                }
            );

            form.submit();//表单提交
            form.remove();
        }
    }

    function delete_attachs(){
        var del_url = jQuery('#attach_del').attr('del_url');
        if(!del_url)
        {
            window.alert("请选择要删除的附件");
            return false;
        }
        if(window.confirm("确定要删除选中的附件吗？此操作不可恢复\n               建议请先保存表单！"))
        {
            // 取消关闭提示
            // window.onbeforeunload = function(){};
            // window.location.href = del_url;
            // 恢复页面关闭提示
            // setTimeout(myload,300);
			window.location.href = del_url;
        }

    }


    function change_disableBtn(obj){
        if(obj.value == 'down')
        {
            jQuery('#attach_table tr[class=TableData]').find('td:first input').each(function(index,element){
                if(jQuery(element).attr('ATTACHMENT_ID'))
                {
                    element.removeAttribute('disabled');
                    jQuery(element).attr('enabled','enabled');
                }
                else
                {
                    element.checked = false;
                    jQuery(element).attr('disabled','disabled');
                    element.removeAttribute('enabled');

                }

            });
        }
        else if(obj.value == 'del')
        {
            jQuery('#attach_table tr[class=TableData]').find('td:first input').each(function(index,element){
                if(jQuery(element).attr('DEL_ATTACHMENT_ID'))
                {
                    element.removeAttribute('disabled');
                    jQuery(element).attr('enabled','enabled');
                }
                else
                {
                    element.checked = false;
                    jQuery(element).attr('disabled','disabled');
                    element.removeAttribute('enabled');
                }

            });
        }
        var attach_checked_obj = jQuery('#attach_table tr[class=TableData]').find('td:first input[enabled=enabled]:checked');
        var attach_obj = jQuery('#attach_table tr[class=TableData]').find('td:first input[enabled=enabled]');
        if(attach_obj.length>0) {
            jQuery('#check_all_attachment')[0].removeAttribute('disabled');
            jQuery('#check_all_attachment').attr('enabled','enabled');
            if ((attach_obj.length - attach_checked_obj.length) > 0) {
                jQuery('#check_all_attachment')[0].checked = false;
            }
            else if ((attach_obj.length - attach_checked_obj.length) == 0) {
                jQuery('#check_all_attachment')[0].checked = true;
            }
        } else {
            jQuery('#check_all_attachment')[0].checked = false;
            jQuery('#check_all_attachment').attr('disabled','disabled');
        }
    }
</script>
<?
include_once("inc/auth.inc.php");
include_once("form.inc.php");
//$query = "SELECT PRCS_ID,FLOW_PRCS from FLOW_RUN_PRCS WHERE RUN_ID='$RUN_ID'";
//$cursor= exequery(TD::conn(),$query);
//while($ROW=mysql_fetch_array($cursor))
$rows = $obj_run_dao->initWorkRunNodeDAO()->select(array("PRCS_ID","FLOW_PRCS"),array("RUN_ID"=>$RUN_ID));

foreach($rows as $ROW)
{
    $PRCS_ID1=$ROW["PRCS_ID"];
    $FLOW_PRCS1=$ROW["FLOW_PRCS"];
    
//    $query = "SELECT PRCS_NAME from FLOW_PROCESS WHERE FLOW_ID='$FLOW_ID' AND PRCS_ID='$FLOW_PRCS1'";
//    $cursor1= exequery(TD::conn(),$query);
//    if($ROW=mysql_fetch_array($cursor1))
    $rows2 = $obj_run_dao->initWorkFlowNodeDAO()->select(array("PRCS_NAME"), array("AND"=>array("FLOW_ID"=>$FLOW_ID, "PRCS_ID"=>$FLOW_PRCS1)));
    foreach($rows2 as $ROW)
       $PRCS_NAME=$ROW["PRCS_NAME"];
    
    $FLOW_PRCS_ARRAY[$FLOW_PRCS1] = $PRCS_NAME;  //按设计步骤存放步骤名称的数组 add by lx 20100222
    
    if($PRCS_ID_ARRAY[$PRCS_ID1]=="")
       $PRCS_ID_ARRAY[$PRCS_ID1]=$PRCS_NAME;
    elseif(!find_id($PRCS_ID_ARRAY[$PRCS_ID1],$PRCS_NAME)) //并发
       $PRCS_ID_ARRAY[$PRCS_ID1].=",".$PRCS_NAME;
}
$loginUid = $_SESSION['LOGIN_UID'];
$nowTime = time();
//固定流程检查会签意可见性
$SIGNLOOK_ARR=array();
if($FLOW_TYPE==1)
{
//    $query1 = "select PRCS_ID,SIGNLOOK FROM FLOW_PROCESS WHERE FLOW_ID='$FLOW_ID'";
//    $cursor1= exequery(TD::conn(),$query1);
//    while($ROW=mysql_fetch_array($cursor1))
    $rows2 = $obj_run_dao->initWorkFlowNodeDAO()->select(array("PRCS_ID", "SIGNLOOK"), array("FLOW_ID"=>$FLOW_ID));
    if(is_array($rows2) && !empty($rows2))
    {     
        foreach($rows2 as $ROW)
            $SIGNLOOK_ARR[$ROW["PRCS_ID"]] = $ROW["SIGNLOOK"];   
    }
}

if($FEEDBACK!=1 && false)
{
    
}
?>

<ul class="remake-list" style="padding-left:40px">
    <?
        $RUN_ID = intval($RUN_ID);
//        $query = "SELECT * from FLOW_RUN_FEEDBACK where RUN_ID='$RUN_ID' order by FEED_ID,PRCS_ID,EDIT_TIME";
//        $cursor= exequery(TD::conn(),$query);
//        $FEEDBACK_COUNT=0;
//        while($ROW=mysql_fetch_array($cursor))
        $rows = $obj_run_dao->initWorkRunFeedbackDAO()->select(
                "*",
                array(
                        "AND"=>array("RUN_ID"=>$RUN_ID,'REPLY_ID'=>0),
                        "ORDER"=>array("FEED_ID", "PRCS_ID", "EDIT_TIME")
                    )
         );
        foreach($rows as $ROW)
        {
            $FEEDBACK_COUNT++;
            
            $FEED_ID=$ROW["FEED_ID"];
            $PRCS_ID1=$ROW["PRCS_ID"];
            $FLOW_PRCS1=$ROW["FLOW_PRCS"];
            $USER_ID=$ROW["USER_ID"];
            $CONTENT=$ROW["CONTENT"];
            $ATTACHMENT_ID=$ROW["ATTACHMENT_ID"];
            $ATTACHMENT_NAME1=$ROW["ATTACHMENT_NAME"];
            $EDIT_TIME=$ROW["EDIT_TIME"];
            $FEED_SIGN_DATA=$ROW["SIGN_DATA"];
			$FEED_FLAG = $ROW["FEED_FLAG"];
            //固定流程检查会签意可见性
            if($FLOW_TYPE==1)
            {
                $SIGNLOOK1 = $SIGNLOOK_ARR["$FLOW_PRCS1"];
                //无权查看会签意见
                if(($SIGNLOOK1==2 && $FLOW_PRCS1!=$FLOW_PRCS) || ($SIGNLOOK1==1 && $FLOW_PRCS1==$FLOW_PRCS && $USER_ID!=$_SESSION["LOGIN_USER_ID"] && $OP_FLAG != 1))
                    continue;
                /*
                 if(($SIGNLOOK1==2 && $PRCS_ID1!=$PRCS_ID && $USER_ID!=$_SESSION["LOGIN_USER_ID"] && $OP_FLAG != 1) || ($SIGNLOOK1==1 && $FLOW_PRCS1==$FLOW_PRCS && $USER_ID!=$_SESSION["LOGIN_USER_ID"] && $OP_FLAG != 1))
                    continue;
                */
            }
            
            //兼容2013版及之前版使用UBB编辑器保存的会签意见
            $CONTENT_VIEW = convert_feedback_format($CONTENT);
            
            $query1 = "SELECT USER_NAME,DEPT_ID from USER where USER_ID='$USER_ID'";
            $cursor1= exequery(TD::conn(),$query1);
            if($ROW=mysql_fetch_array($cursor1))
            {
                $USER_NAME=$ROW["USER_NAME"];
                $DEPT_ID=$ROW["DEPT_ID"];
                $DEPT_NAME=dept_long_name($DEPT_ID);
            }
            else
                $USER_NAME=$USER_ID;
				
			// 判断意见类型		JD 14/8/8
			if($FEED_FLAG == 1)
			{
				$FEED_NAME = "<font color=green>"._("点评")."</font>";
			}elseif($FEED_FLAG == 2){
				$FEED_NAME = "<font color=red>"._("退回")."</font>";
			}else{
				$FEED_NAME=_("会签");
			}
            
            ?>
             <li style='position: inherit;'>
			    
                <div class="remake-list-user" title="<?=_("部门：")?><?=$DEPT_NAME?>">
				<span class="arrow"><?=sprintf(_("第%s步"),$PRCS_ID1);?></span>
				<span class="arrow"><?=sprintf(_("【%s】"),$FEED_NAME);?></span>
				<?=$FLOW_PRCS1>0 ? $FLOW_PRCS_ARRAY[$FLOW_PRCS1] : $PRCS_ID_ARRAY[$PRCS_ID1]?> <font color="#666666" class="remake-list-user-name">
				<a target="_blank" href="/general/ipanel/user/user_info.php?USER_ID=<?=$USER_ID?>&WINDOW=1"><?=$USER_NAME?></a></font>
                </div>
                <div class="remake-list-title">
                    <div class='content'><?=$CONTENT_VIEW?></div>
					<div class="remake-list-time"><?=$EDIT_TIME?>
					    <?
                        if(($USER_ID==$_SESSION["LOGIN_USER_ID"] && $FLOW_PRCS==$FLOW_PRCS1) || $FEED_SIGN_DATA!="")
                        {
                       ?>
                            <? if($FEED_SIGN_DATA!="" ){?><img src="<?=MYOA_STATIC_SERVER?>/static/images/focus.gif" style="cursor:pointer" alt="<?=_("查看手写签章")?>" align="absmiddle" onClick="showSign('<?=$FEED_ID?>');">&nbsp;<?}?>
                            <?
                            if($USER_ID==$_SESSION["LOGIN_USER_ID"] && $FLOW_PRCS==$FLOW_PRCS1)
                            {
                            ?>
							<a href="javascript:void(0);" class="remake-list-time-edit" onclick="edit_sign('<?=$FEED_ID?>');"><?=_("编辑")?></a>&nbsp;
							<a href="javascript:void(0);" class="remake-list-time-del" onClick="delete_sign('<?=$FEED_ID?>');"><?=_("删除")?></a>&nbsp;
                          	<?
                            }
                            ?>
                       <?
                        }
                       ?>
					   <a href="javascript:void(0);" class="remake-list-time-rpl" onClick="reply_sign('<?=$FEED_ID?>');"><?=_("回复")?></a>
					</div>
                    <?=$obj_run_dao->initWorkRunFeedbackDAO()->replySign($RUN_ID,$FEED_ID);?>
                </div>               
                <?
                if($ATTACHMENT_ID!="")
                {
                   if($USER_ID==$_SESSION["LOGIN_USER_ID"] && $PRCS_ID==$PRCS_ID1)
                      $TMP=attach_link($ATTACHMENT_ID,$ATTACHMENT_NAME1,0,1,1,1,1,1,1,0,"approve_center");
                   else
                      $TMP=attach_link($ATTACHMENT_ID,$ATTACHMENT_NAME1,0,1,1,0,0,1,1,0,"approve_center");
                   $TMP=str_replace("delete_attach(","delete_attach_sign($FEED_ID,",$TMP);
                   $TMP=str_replace("ReNameFile(","ReNameFile('feedback', $FEED_ID,",$TMP);
                   echo "<div class='remark-list-attachs'>".$TMP."</div>";
                }
                ?>
            </li>
            <?
        }
     ?>
</ul>
<?
/*
if($FEEDBACK==1)
   Message(_("抱歉"),_("此步骤禁止会签!"));
*/
if($FEEDBACK!=1)
{
?>

<?
      if($FEEDBACK==2 ) {

          if (find_id($SIGNACTION, '2') && find_id($SIGNACTION, '1'))
          {

              ?>
              <div style="font-size:14px;background-color:#cccccc;"><font
                          class=big4><?= _("本步骤为强制会签，必须填写会签意见") ?></font></div>
              <?

          } elseif (find_id($SIGNACTION, '1'))
          {
              ?>
              <div style="font-size:14px;background-color:#cccccc;"><font
                          class=big4><?= _("本步骤为强制会签，非主办人必须填写会签意见") ?></font></div>

              <?
          }elseif (find_id($SIGNACTION, '2'))
          {
              ?>
              <div style="font-size:14px;background-color:#cccccc;"><font
                          class=big4><?= _("本步骤为强制会签，主办人必须填写会签意见") ?></font></div>

              <?
          }
      }
?>
<table class="TableBlock" width="100%" style="margin-bottom:10px">      	
    <tr class="TableData">
        <td id="SIGN_INFO_POS">
<?

$editor = new Editor('CONTENT') ;
$editor->ToolbarSet = 'Feedback';
$editor->Width = '100%' ;
$editor->Height = '200' ;
$editor->StartFocus = '0' ;
$editor->Value = '' ;
$editor->Create() ;
?>
        </td>
    </tr>
<?
if($FLOW_DOC==1)
{
?>
    <tr class="TableData">
        <td>
            <script>ShowAddFile('1');</script>
        </td>
    </tr>
<?
}
?>
    <tr class="TableData">
	    <td>
		    <div class="remark-check">
			    <input type="checkbox" id="flow_sign_flag" onclick="set_sign_cookie(1)" <?if($_COOKIE["flow_sign_flag"]==1) echo "checked";?>>
				<label for="flow_sign_flag" style="color:#446EB9"><?=_("启用会签手写签章功能")?></label>
				<?
				$display  = $_COOKIE["flow_sign_flag"] ? 'inline' : 'none';
				?>
                <span id="shouxieqianzhang" style="display: <?=$display;?>">
                        <input type="button" class="btn btn-small" value="<?=_("手写")?>" onclick="WebSign_HandWritePop();">&nbsp;
                         <input type="button" class="btn btn-small" value="<?=_("签章")?>" onclick="WebSign_AddSeal();"><input type="hidden" name="SIGN_DATA" id="SIGN_DATA">
                    </span>
                <?if($_COOKIE["flow_sign_flag"]==1){?>
                <script>
                var iframe_location = parent.location.href;
                if(window.external && typeof window.external.OA_SMS != 'undefined')
                {
                    window.external.OA_SMS("1",iframe_location,"IS_WEBKIT");
                }
                </script>
                <?}?>
				<input type="button" class="btn btn-small" style="float:right" value="<?=_("快捷输入")?>" onclick="SelectSign()">
			</div>
		</td>
	</tr>
</table>
<a name="end" id="end"> </a>
<?
} //else
?>
<script>
var loginUid = '<?=$loginUid?>';
var nowTime = '<?=$nowTime?>';
function showSign(feed_id)
{
	$("personal_sign_body").innerHTML='<iframe frameborder=0 width="100%" style="width:580px;height:300px;" id="fra_sign" src="sing_info.php?RUN_ID=<?=$RUN_ID?>&FEED_ID='+feed_id+'"></iframe>';
	ShowDialog("personal_sign",30);
}
function WebSign_AddSeal(item,seal_id)
{
    var auth_websign = window.auth_websign;
    if(auth_websign == false)
    {
        alert('<?=_("签章授权失败，请联系OA厂商进行咨询。")?>');
    }
    try {
        var DWebSignSeal=document.getElementById("DWebSignSeal") || '';
		var auth_websign_code = window.auth_websign_code;
		if(auth_websign_code != '' && DWebSignSeal != '' &&  typeof(DWebSignSeal.SetSealComment) != 'undefined')
		{
			DWebSignSeal.SetSealComment("SET_ABOUT_TIPS", 0, 0, auth_websign_code);
		}
        DWebSignSeal.SetCurrUser("<?=$_SESSION["LOGIN_USER_ID"]?>[<?=$_SESSION["LOGIN_USER_NAME"]?>]");
        DWebSignSeal.SetSignData("-");
        DWebSignSeal.SetSignData("+DATA:<?=_("中国兵器工业信息中心")?>");
        DWebSignSeal.SetPosition(10,10,"SIGN_INFO_POS");
<?
if($SEAL_FROM["SEAL_FROM"]==1)
{
	$uniqueId = 'SIGN_INFO'.$loginUid.'-'.$nowTime;
    echo 'DWebSignSeal.addSeal("", "'.$uniqueId.'");';
}
else
{
?>
        if(typeof seal_id=="undefined")
            show_seal(item,"WebSign_AddSeal");
        else
        {
            var URL = "<?=(isset($_SERVER['HTTPS'])&&$_SERVER['HTTPS']=='on')?'https':'http'?>://<?=$_SERVER['HTTP_HOST']?>/module/sel_seal/get.php?ID="+seal_id;
            var obj_name = DWebSignSeal.AddSeal(URL, "SIGN_INFO"+loginUid+'-'+nowTime);
        }
<?
}
?>
	    DWebSignSeal.SetMenuItem(obj_name,5);
	    //DWebSignSeal.LockSealPosition(obj_name);
    }catch(e){}
}

function WebSign_HandWritePop()
{
    var auth_websign = window.auth_websign;
    if(auth_websign == false)
    {
        alert('<?=_("签章授权失败，请联系OA厂商进行咨询。")?>');
    }
    try {
        var DWebSignSeal=document.getElementById("DWebSignSeal") || '';
		var auth_websign_code = window.auth_websign_code;
		if(auth_websign_code != '' && DWebSignSeal != '' && typeof(DWebSignSeal.SetSealComment) != 'undefined')
		{
			DWebSignSeal.SetSealComment("SET_ABOUT_TIPS", 0, 0, auth_websign_code);
		}
        DWebSignSeal.SetCurrUser("<?=$_SESSION["LOGIN_USER_ID"]?>[<?=$_SESSION["LOGIN_USER_NAME"]?>]");
        DWebSignSeal.SetSignData("-");
        DWebSignSeal.SetSignData("+DATA:<?=_("中国兵器工业信息中心")?>");
        DWebSignSeal.SetPosition(10,10,"SIGN_INFO_POS");
	    var obj_name=DWebSignSeal.HandWritePop(0,255,0,0,0,"SIGN_INFO"+loginUid+'-'+nowTime);
	    DWebSignSeal.SetMenuItem(obj_name,5);
	    //DWebSignSeal.LockSealPosition(obj_name);
	}catch(e){}
}
function sign_submit()
{
    try {
        var DWebSignSeal=document.getElementById("DWebSignSeal");
        var sing_info_str="";
        var strObjectName = DWebSignSeal.FindSeal("",0);
	    while(strObjectName!="")
	    {
	    	//判断是属于会签意见签章 并且会签名称不能是宏标记里调用显示的，即新添加的手写或签章
	    	if(strObjectName.indexOf("SIGN_INFO")>=0 && sign_info_object.indexOf(strObjectName+",")<0)
            sing_info_str += strObjectName+";";
	    	strObjectName = DWebSignSeal.FindSeal(strObjectName,0);
	    }
	    if(sing_info_str!="")
	        document.form1.SIGN_DATA.value=DWebSignSeal.GetStoreDataEx(sing_info_str);
	    else
	        document.form1.SIGN_DATA.value="";
	 }catch(e){}
}
function set_sign_cookie(sign_check_flag)
{
    if(window.external && typeof window.external.OA_SMS != 'undefined')
    {
        var flow_sign_flag_new = jQuery("#flow_sign_flag").attr("checked");
        var iframe_location = parent.location.href;
        if(flow_sign_flag_new)
        {
            window.external.OA_SMS("1",iframe_location,"IS_WEBKIT");
        }
    }
    
	if (sign_check_flag) {
		window.sign_check_flag = sign_check_flag;
	}
    if($('shouxieqianzhang').style.display == 'none'){
       $('shouxieqianzhang').style.display='inline';
    }else{
        $('shouxieqianzhang').style.display='none';
    }
	var exp = new Date();
	if("<?=$_COOKIE["flow_sign_flag"]?>"=="1")
	  var flow_sign_flag=0;
	else
		var flow_sign_flag=1;
    exp.setTime(exp.getTime() + 24*60*60*1000);
    document.cookie = "flow_sign_flag="+ flow_sign_flag + ";expires=" + exp.toGMTString()+";path=/";
    
    //判断页面中是否加载object
    var DWebSignSealObject = document.getElementById("DWebSignSeal");
    var flowSignFlagChecked = document.getElementById("flow_sign_flag").checked;
    if(DWebSignSealObject == null && flowSignFlagChecked == true)
    {
        document.getElementById("sign_object").value = 1;
    }
    CheckForm(1);
}
</script>
<?
if($_COOKIE["flow_sign_flag"]==1){
	include_once("module/websign/ver_trial.php");
	echo $websign_object_html;
}
?>

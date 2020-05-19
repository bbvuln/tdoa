<?

include_once("inc/utility_html.php");
include_once("inc/utility_file.php");
include_once("inc/editor.php");
include_once("inc/mobile_seal/seal_data.php");

function parse_form($PRINT_MODEL, $DEBUG_MODE = false, $CONFIG_PARSE_FORM = array())
{
    //修改global全局变量
    // global $FORM_ID,$FLOW_ID,$RUN_ID,$PRCS_ID,$FLOW_PRCS,$OP_FLAG,$FLOW_TYPE,$FREE_ITEM,$PRCS_ITEM,$FORM_NAME,$RUN_NAME,$PRCS_DATE,$BEGIN_TIME,$AUTO_NUM,$CUR_DATE,$CUR_TIME,$CUR_TIME1,$SIGN_OBJECT,$SIGN_CHECK_STR,$READ_ONLY_STR,$HIDDEN_ITEM,$PRCS_ITEM_AUTO,$HIDDEN_STR,$JS_ONLOAD,$EDIT_MODE;
    $CUR_TIME1 = date("H:i:s",time());
    $CUR_DATE = date("Y-m-d");
    $CUR_TIME = $CUR_DATE." ".$CUR_TIME1;
    $FORM_ID =  $GLOBALS["FORM_ID"];
    $FLOW_ID = $GLOBALS["FLOW_ID"];
    $RUN_ID = $GLOBALS["RUN_ID"];
    $PRCS_ID = $GLOBALS["PRCS_ID"];
    $FLOW_PRCS = $GLOBALS["FLOW_PRCS"];
    $OP_FLAG = $GLOBALS["OP_FLAG"];
    $FLOW_TYPE = $GLOBALS["FLOW_TYPE"];
    $FREE_ITEM = $GLOBALS["FREE_ITEM"];
    $PRCS_ITEM = $GLOBALS["PRCS_ITEM"];
    $FORM_NAME = $GLOBALS["FORM_NAME"];
    $RUN_NAME = $GLOBALS["RUN_NAME"];
    $PRCS_DATE = $GLOBALS["PRCS_DATE"];
    $BEGIN_TIME = $GLOBALS["BEGIN_TIME"];
    $AUTO_NUM = $GLOBALS["AUTO_NUM"];
    $SIGN_OBJECT = $GLOBALS["SIGN_OBJECT"];
    $SIGN_CHECK_STR = $GLOBALS["SIGN_CHECK_STR"];
    $READ_ONLY_STR = $GLOBALS["READ_ONLY_STR"];
    $HIDDEN_ITEM = $GLOBALS["HIDDEN_ITEM"];
    $PRCS_ITEM_AUTO = $GLOBALS["PRCS_ITEM_AUTO"];
    $HIDDEN_STR = $GLOBALS["HIDDEN_STR"];
    $JS_ONLOAD = $GLOBALS["JS_ONLOAD"];
    $EDIT_MODE = $GLOBALS["EDIT_MODE"];
    $AUTO_NEW = $GLOBALS["AUTO_NEW"];
    //-------------------------------------- Html 智能分析 --------------------------------
    //include_once("inc/workflow_cache/form/".$FORM_ID.".php");
    $WORKFLOW_ELEMENT_ARRAY = TD::get_cache('workflow/form/ELEMENT_ARRAY_'.$FORM_ID);
    $ELEMENT_QUERY = $WORKFLOW_ELEMENT_ARRAY; //用户日期 人员等控件的遍历查询用
    if($FLOW_ID)
    {
        update_table($FLOW_ID,$WORKFLOW_ELEMENT_ARRAY);
        $table_name = 'flow_data_'.$FLOW_ID;
        $query = " select * from $table_name where run_id='$RUN_ID' limit 1";
        $cursor = exequery(TD::conn(),$query);
        if($ROW=mysql_fetch_assoc($cursor))
        {
            foreach($ROW as $key => $value)
            {

                if(strtolower(substr($key,0,5)) == 'data_')
                {
                    $STR = strtoupper($key);
                    $$STR = $value;
                }
            }
        }
    }
    if(!$WORKFLOW_ELEMENT_ARRAY)
    {
        Message("",_("表单内容为空！"));
        return;
    }
    $CHECK_ELEMENT_ARR = $WORKFLOW_ELEMENT_ARRAY;
    foreach($WORKFLOW_ELEMENT_ARRAY as $ENAME => $ELEMENT_ARR)
    {
        $ETAG = $ELEMENT_ARR["TAG"];
        $ELEMENT = $ELEMENT_ARR["CONTENT"];
        $EVALUE = $ELEMENT_ARR["VALUE"];
        $ETITLE = $ELEMENT_ARR["TITLE"];
        $ECLASS = $ELEMENT_ARR["CLASS"];
        $ETYPE = $ELEMENT_ARR["TYPE"];
        $ITEM_ID = $ELEMENT_ARR["ITEM_ID"];
        $ELEMENT_OUT = $ELEMENT;
        $DATAFLD = $ELEMENT_ARR["DATAFLD"];
        $SIGN_TYPE = $ELEMENT_ARR["SIGN_TYPE"];
        $RICH_WIDTH = $ELEMENT_ARR["RICH_WIDTH"];
        $RICH_HEIGHT = $ELEMENT_ARR["RICH_HEIGHT"];

//        if(!$DEBUG_MODE && !$EDIT_MODE)
//        {
//            //------判断是否为保密字段----------
//            if(find_id($HIDDEN_ITEM,$ETITLE) || (($ECLASS=="DATE" || $ECLASS=="USER") && find_id($HIDDEN_ITEM,$EVALUE)))
//            {
//                $ELEMENT_OUT="";
//                //-- 替换为空 --
//                $PRINT_MODEL = str_replace('{'.$ENAME.'}',"",$PRINT_MODEL);
//                $HIDDEN_STR.=$ITEM_ID.",";
//                continue;
//            }
//
//            //-------判断不可写字段------------
//                $READ_ONLY=0;
//        }
        //--- 对于输入型控件，加入控件名称 ---

        //--- 获取数据库中该项目的数据 ----
        $STR="DATA_".$ITEM_ID;
        if($FLOW_ID)
            $ITEM_VALUE=$ITEM_VALUE_ORIG=$$STR;
        else
            $ITEM_VALUE=$ITEM_VALUE_ORIG=$EVALUE;
        //$ITEM_VALUE=$ITEM_VALUE_ORIG=$$STR;
        //$ITEM_VALUE=td_htmlspecialchars($ITEM_VALUE,ENT_COMPAT);
        $ITEM_VALUE = str_replace(array('"','<','>'),array("&quot;","&lt;","&gt;"),$ITEM_VALUE);
        //echo $ENAME."-".$ECLASS."-".$ETITLE."-".$EVALUE."-".$STR."<br>_(";

        //--------------------------------------- 输入型控件可以直接赋值 ----------------------------------
        if($ITEM_VALUE=="{MACRO}")
            $ITEM_VALUE="";

        if($ETAG=="input")
        {
            //复选框
            if($ETYPE == "checkbox")
            {
                //去掉value属性
                $ELEMENT_OUT=str_replace(' value="on"',"",$ELEMENT_OUT);
                $ELEMENT_OUT=str_replace(' value=""',"",$ELEMENT_OUT);
                if(!$DEBUG_MODE && !$EDIT_MODE)
                {
                    $ELEMENT_OUT=str_replace(" checked","",$ELEMENT_OUT);
                }
                $ELEMENT_OUT=str_replace(' checked="checked"',"",$ELEMENT_OUT);

                if($ITEM_VALUE=="on")
                {
                    $ELEMENT_OUT=str_replace("<$ETAG","<$ETAG checked",$ELEMENT_OUT);
                }
            }
            else
            {
                //隐藏属性
                $HIDDEN = $ELEMENT_ARR["HIDDEN"];
                $HIDDEN_PROP = "";
                if($HIDDEN=="1")
                    $HIDDEN_PROP = "type=\"hidden\"";
                $ELEMENT_OUT=str_replace("value=$EVALUE","",$ELEMENT_OUT);
                $ELEMENT_OUT=str_replace("value=\"$EVALUE\"","",$ELEMENT_OUT);
                $ELEMENT_OUT=str_replace("<$ETAG","<$ETAG value=\"$ITEM_VALUE\" $HIDDEN_PROP",$ELEMENT_OUT);
            }
        }
        else if($ETAG=="textarea")
        {
            $RICH = $ELEMENT_ARR["RICH"];
            if($RICH=="1")
            {
                if($READ_ONLY){
                    $ELEMENT_OUT=$ITEM_VALUE_ORIG;
                }else {
                    $ITEM_VALUE = stripslashes($ITEM_VALUE);
                    if($RICH_WIDTH == "")
                    {
                        $RICH_WIDTH='100%';
                    }
                    if($RICH_HEIGHT == "")
                    {
                        $RICH_HEIGHT='300';
                    }
                    $editor = new Editor($ENAME) ;
                    $editor->ToolbarSet = 'Basic';
                    $editor->Config = array('model_type' => '01');
                    $editor->Width =  $RICH_WIDTH;
                    $editor->Height = $RICH_HEIGHT ;
                    $editor->Value = $ITEM_VALUE_ORIG ;
                    $ELEMENT_OUT = $editor->CreateHtml() ;
                }
            }
            else
                $ELEMENT_OUT=str_replace(">$EVALUE<",">$ITEM_VALUE<",$ELEMENT_OUT);

        }
        else if($ETAG=="select" && $ECLASS!="AUTO")
        {
            if($ITEM_VALUE!="")
            {
                $ELEMENT_OUT=str_replace(' selected="selected"',"",$ELEMENT_OUT);
                $ELEMENT_OUT=str_replace('selected',"",$ELEMENT_OUT);
                $ELEMENT_OUT=str_replace("<option value=$ITEM_VALUE>","<option selected value=\"$ITEM_VALUE\">",$ELEMENT_OUT);
                $ELEMENT_OUT=str_replace("<option value=\"$ITEM_VALUE\">","<option selected value=\"$ITEM_VALUE\">",$ELEMENT_OUT);
                $ITEM_VALUE=td_htmlspecialchars($ITEM_VALUE);
                $ELEMENT_OUT=str_replace("<option value=\"$ITEM_VALUE\">","<option selected value=\"$ITEM_VALUE\">",$ELEMENT_OUT);
            }
        }

        if($ECLASS=="RADIO" && $ETAG=="img") //textfield
        {
            $RADIO_FIELD=$ELEMENT_ARR["RADIO_FIELD"];
            $RADIO_CHECK=$ELEMENT_ARR["RADIO_CHECK"];
            $RADIO_ARRAY = explode("`",rtrim($RADIO_FIELD,"`"));

            $ELEMENT_OUT = "";
            if($ITEM_VALUE!="")
                $RADIO_CHECK = $ITEM_VALUE;

            $DISABLED = ($READ_ONLY == 1) ? "disabled" : "";
            foreach($RADIO_ARRAY as $RADIO)
            {
                $CHECKED = "";
                if($RADIO == $RADIO_CHECK)
                    $CHECKED = "checked";
                $ELEMENT_OUT .= '<input type="radio" title="'.$ETITLE.'" name="'.$ENAME.'" value="'.$RADIO.'" '.$CHECKED.' '.$DISABLED .'><label>'.$RADIO.'</label>&nbsp;';
            }
        }
        //进度条
        if($ECLASS=="PROGRESSBAR")
        {
            if($ITEM_VALUE == "" || $ITEM_VALUE < 0)
            {
                $ITEM_VALUE = 0;
            }
            if($ITEM_VALUE > 100)
            {
                $ITEM_VALUE = 100;
            }
            //进度条宽度位置
            $progress_style = round(145 - 145 * $ITEM_VALUE/100);
            if($progress_style == "" || $progress_style < 0)
            {
                $progress_style = 0;
            }
            if($progress_style > 145)
            {
                $progress_style = 145;
            }
            $DISABLED = ($READ_ONLY == 1) ? "disabled" : "";
            $ELEMENT_OUT = "<div style=\"height:16px;line-height:16px;\">\n";
            $ELEMENT_OUT .= "<span title=\"".$ETITLE."\" id=\"bar_".$ITEM_ID."\" style=\"border:0px solid #FFF;background:url(".MYOA_STATIC_SERVER."/static/images/progressbar.gif) no-repeat;width:145px;height:15px;background-position:-".$progress_style."px 0px;\"></span>\n";
            $ELEMENT_OUT .= "<b id=\"numpro_".$ITEM_ID."\" style=\"width:28px;\">$ITEM_VALUE"."%</b>\n";
            $ELEMENT_OUT .= "&nbsp;<img $DISABLED title=\""._("增加进度")."\" style=\"cursor:pointer;vertical-align:middle;\" onclick=\"add_progress(".$ITEM_ID.", ".$SIGN_TYPE.");\" src=\"".MYOA_STATIC_SERVER."/static/images/green_plus.gif\" border=\"0\">\n";
            $ELEMENT_OUT .= "&nbsp;<img $DISABLED title=\""._("减少进度")."\" style=\"cursor:pointer;vertical-align:middle;\" onclick=\"less_progress(".$ITEM_ID.", ".$SIGN_TYPE.");\" src=\"".MYOA_STATIC_SERVER."/static/images/green_minus.gif\" border=\"0\">\n";
            $ELEMENT_OUT .= "<input type=\"hidden\" id=\"".$ENAME."\" name=\"".$ENAME."\" value=\"".$ITEM_VALUE."\"/>\n";
            $ELEMENT_OUT .= "</div>";
        }
        if($ECLASS=="IMGUPLOAD")
        {
            $IMG_WIDTH = $ELEMENT_ARR['IMG_WIDTH'];
            $IMG_HEIGHT = $ELEMENT_ARR['IMG_HEIGHT'];
            if($ITEM_VALUE != "" && $ITEM_VALUE != ":")
            {
                $MODULE=attach_sub_dir();
                $ITEM_VALUE_TMP = explode(":", $ITEM_VALUE);
                $IMG_ID = rtrim($ITEM_VALUE_TMP[0], ",");
                $IMG_NAME = rtrim($ITEM_VALUE_TMP[1], "*");
                $YM=substr($IMG_ID,0,stripos($IMG_ID,"_"));
                if($YM)
                {
                    $IMG_ID1 = $IMG_ID;
                    $IMG_ID1=substr($IMG_ID1,stripos($IMG_ID,"_")+1);
                }
                $IMG_ID1=attach_id_encode($IMG_ID1,$IMG_NAME);
                $IMG_SRC = "/inc/attach.php?MODULE=$MODULE&YM=$YM&ATTACHMENT_ID=$IMG_ID1&ATTACHMENT_NAME=".urlencode($IMG_NAME);
            }
            else
            {
                $IMG_SRC = $ELEMENT_ARR['SRC'];
                $IMG_ID = "";
                $IMG_NAME = "";
            }


            $ELEMENT_OUT = "<div class=\"imgUpload\" style=\"width:".$IMG_WIDTH.";height:".$IMG_HEIGHT.";\">";

            if($READ_ONLY)
            {
                $ELEMENT_OUT .= "<img src=\"".$IMG_SRC."\" style=\"width:".$IMG_WIDTH.";height:".$IMG_HEIGHT.";\"/>";
            }
            else
            {
                $ELEMENT_OUT .= "<img onmousemove=\"setImgUploadPosition(this,'DATA_".$ITEM_ID."');\" src=\"".$IMG_SRC."\" style=\"width:".$IMG_WIDTH.";height:".$IMG_HEIGHT.";\" title=\"".$ETITLE.":"._("点击上传图片")."\">";
                $ELEMENT_OUT .= "<input type=\"file\" style=\"position:absolute;filter:alpha(opacity=0);opacity:0;width:100%;height:".$IMG_HEIGHT.";left:0px;top:0px;\" size=\"1\"  hideFocus=\"\" name=\"DATA_".$ITEM_ID."\" id=\"DATA_".$ITEM_ID."\"/>";
            }
            $ELEMENT_OUT .= "<input type=\"hidden\" name=\"IMGID_".$ITEM_ID."\" value=\"".$IMG_ID."\"/>";
            $ELEMENT_OUT .= "<input type=\"hidden\" name=\"IMGNAME_".$ITEM_ID."\" value=\"".$IMG_NAME."\"/>";
            $ELEMENT_OUT .= "</div>";
        }
        if($ECLASS=="FILEUPLOAD")
        {
            if(empty($FILEUPLOAD_PRIV)){
                $query = "SELECT FILEUPLOAD_PRIV FROM FLOW_PROCESS WHERE FLOW_ID = '".$FLOW_ID."' AND PRCS_ID = '".$FLOW_PRCS."'";
                $cursor = exequery(TD::conn(),$query);
                if($row = mysql_fetch_array($cursor)){
                    $FILEUPLOAD_PRIV = $row['FILEUPLOAD_PRIV'];
                }
                $FLIE_PRIV_ARR = empty($FILEUPLOAD_PRIV) ? array() : unserialize($FILEUPLOAD_PRIV);
            }
            $FILE_PRIV_ATTR = $FLIE_PRIV_ARR['FILE_PRIV_'.$ENAME];
            $keyField = $ENAME.'_KEY';
            $ATTACHMENT_ID = $$keyField;
            $ATTACHMENT_NAME = $ITEM_VALUE;
						if($FILE_PRIV_ATTR){
	            $EDIT_PRIV = in_array(2, $FILE_PRIV_ATTR) ? 1 : 0;
	            $DELETE_PRIV = in_array(3, $FILE_PRIV_ATTR) ? 1 : 0;
	            
	            $DOWNLOAD_PRIV_OFFICE .= in_array(4, $FILE_PRIV_ATTR) ? 1 : 0;
	            $DOWNLOAD_PRIV_OFFICE .= in_array(5, $FILE_PRIV_ATTR) ? 1 : 0;
	            $DOWNLOAD_PRIV = (in_array(2, $FILE_PRIV_ATTR) || in_array(3, $FILE_PRIV_ATTR) || in_array(4, $FILE_PRIV_ATTR) || $DOWNLOAD_PRIV_OFFICE != '00') ? 1 : 0;
	          }
	
	            $ELEMENT_OUT = attach_link($ATTACHMENT_ID,$ATTACHMENT_NAME,1,$DOWNLOAD_PRIV,$DOWNLOAD_PRIV_OFFICE,$EDIT_PRIV,$DELETE_PRIV,0,0);
	            $ELEMENT_OUT = str_replace("delete_attach(","delete_attach_data('".$ENAME."',",$ELEMENT_OUT);
	          if($FILE_PRIV_ATTR){
	            if((in_array(1, $FILE_PRIV_ATTR) && !$READ_ONLY) || $DEBUG_MODE == true){
	                $ELEMENT_OUT .= '<script>ShowAddFile("'.$ENAME.'");</script>';
	            }
	            
	          }else if($DEBUG_MODE == true){
	          	$ELEMENT_OUT .= '<script>ShowAddFile("'.$ENAME.'");</script>';
	          }
            $ELEMENT_OUT .= "<input type=\"hidden\" name=\"ATTACHMENT_ID_OLD_".$ENAME."\" value=\"".$ATTACHMENT_ID."\"/>";
            $ELEMENT_OUT .= "<input type=\"hidden\" name=\"ATTACHMENT_NAME_OLD_".$ENAME."\" value=\"".$ATTACHMENT_NAME."\"/>";
        }
        if($ECLASS=="QRCODE")
        {
            $QR_SRC = "/general/approve_center/list/input_form/get_qr.php?flow_id=$FLOW_ID&run_id=$RUN_ID&field=DATA_$ITEM_ID";

            if($FLOW_ID)
            {
                $query = "select `DATA_$ITEM_ID` from `flow_data_$FLOW_ID` where run_id = '$RUN_ID'";
                $cursor= exequery(TD::conn(),$query);
                if($ROW=mysql_fetch_array($cursor))
                    $data=$ROW["DATA_$ITEM_ID"];
            }

            if($data == $ITEM_VALUE)
            {
                $ELEMENT_OUT = "<div>";
                if($READ_ONLY)
                {
                    $ELEMENT_OUT .= "<img src=\"".$QR_SRC."\"/>";
                }
                else
                {
                    $ELEMENT_OUT .= "<img src=\"".$QR_SRC."\"/>";
                    $ELEMENT_OUT .= "<input type=\"hidden\" id=\"QRCODE_".$ITEM_ID."\" name=\"QRCODE_".$ITEM_ID."\" value=\"".$DATAFLD."\">\n";
                }
                $ELEMENT_OUT .= "</div>\n";
            }
            else
            {
                $ELEMENT_OUT = "";
                $ELEMENT_OUT .= "<input type=\"hidden\" id=\"QRCODE_".$ITEM_ID."\" name=\"QRCODE_".$ITEM_ID."\" value=\"".$DATAFLD."\">\n";
            }
        }
        //------------------------------------ 特殊控件：日期、计算、宏、列表控件 -----------------------------
        if($ECLASS=="DATE")  //日历控件
        {
            foreach($ELEMENT_QUERY as $ENAME1 => $ELEMENT_QUERY_ARR)
            {
                $ETITLE1=$ELEMENT_QUERY_ARR["TITLE"];
                $ECLASS1=$ELEMENT_QUERY_ARR["CLASS"];
                $ITEM_ID1=$ELEMENT_QUERY_ARR["ITEM_ID"];

                if(date_or_user_or_more($ELEMENT_QUERY_ARR))
                    continue;

                if($ETITLE1==$EVALUE)
                {
                    $ITEM_STR="DATA_".$ITEM_ID1;
                    break;
                }
            }

            if((find_id($PRCS_ITEM,$EVALUE)||($FLOW_TYPE=="2" && ($FREE_ITEM=="" || find_id($FREE_ITEM,$EVALUE)))) && $OP_FLAG || $DEBUG_MODE || $EDIT_MODE)
                $ELEMENT_OUT= str_replace("<$ETAG","<$ETAG des=\"$ITEM_STR\"",$ELEMENT_OUT);
            else
                $ELEMENT_OUT="";
        }
        if($ECLASS=="USER")  //部门人员控件
        {
            $SELECT_TYPE=$ELEMENT_ARR["TYPE"];
            foreach($ELEMENT_QUERY as $ENAME1 => $ELEMENT_QUERY_ARR)
            {
                $ETITLE1=$ELEMENT_QUERY_ARR["TITLE"];
                $ECLASS1=$ELEMENT_QUERY_ARR["CLASS"];
                $ITEM_ID1=$ELEMENT_QUERY_ARR["ITEM_ID"];
                //echo "<xmp>";var_dump($ELEMENT_QUERY_ARR);echo "</xmp><br>";

                if(date_or_user_or_more($ELEMENT_QUERY_ARR))
                    continue;

                if($ETITLE1==$EVALUE)
                {
                    $ITEM_STR="DATA_".$ITEM_ID1;
                    break;
                }
            }

            if((find_id($PRCS_ITEM,$EVALUE)||($FLOW_TYPE=="2" && ($FREE_ITEM=="" || find_id($FREE_ITEM,$EVALUE)))) && $OP_FLAG || $DEBUG_MODE || $EDIT_MODE)
            {
                if($SELECT_TYPE==0 || $SELECT_TYPE=="" )
                {
                    $USER_NAME_STR=$$ITEM_STR;
                    $query1 = "select USER_ID FROM USER WHERE FIND_IN_SET(USER_NAME,'$USER_NAME_STR')";
                    $cursor1 = exequery(TD::conn(),$query1);
                    while($ROW=mysql_fetch_array($cursor1))
                        $USER_ID_STR .= $ROW["USER_ID"].',';

                    //var_dump( $ITEM_ID1);echo ";";
                    $ELEMENT_OUT="<input type=\"hidden\" name=\"USER_$ITEM_ID1\" value=\"$USER_ID_STR\"><img class=\"USER\" align=\"absmiddle\" title=\""._("部门人员控件：").$EVALUE."\" style=\"cursor:pointer;\" src=\"".MYOA_STATIC_SERVER."/static/images/form/user.gif\" border=\"0\" onclick=\"SelectUser('5','','USER_$ITEM_ID1','$ITEM_STR');\">";
                }
                elseif($SELECT_TYPE==1)
                {
                    $DEPT_NAME_STR=$$ITEM_STR;
                    $query1 = "select DEPT_ID FROM DEPARTMENT WHERE FIND_IN_SET(DEPT_NAME,'$DEPT_NAME_STR')";
                    $cursor1 = exequery(TD::conn(),$query1);
                    while($ROW=mysql_fetch_array($cursor1))
                        $DEPT_ID_STR .= $ROW["DEPT_ID"].',';

                    $ELEMENT_OUT="<input type=\"hidden\" name=\"DEPT_$ITEM_ID1\" value=\"$DEPT_ID_STR\"><img class=\"USER\" align=\"absmiddle\" title=\""._("部门人员控件：").$EVALUE."\" style=\"cursor:pointer;\" src=\"".MYOA_STATIC_SERVER."/static/images/form/user.gif\" border=\"0\" onclick=\"SelectDept('','DEPT_$ITEM_ID1','$ITEM_STR');\">";
                }
            }
            else
                $ELEMENT_OUT=_("<img class=\"USER\" align=\"absmiddle\" title=\""._("部门人员控件：").$EVALUE."\" style=\"cursor:pointer;\" src=\"".MYOA_STATIC_SERVER."/static/images/form/user.gif\" border=\"0\">");
        }
        elseif($ECLASS=="CALC")  //计算控件
        {
            $ECALC1 = calculate($EVALUE,$ELEMENT_QUERY,$HIDDEN_ITEM);
            if($ECALC1 != ""){
                $ELEMENT_OUT.="\n
                <script>
                function calc_$ENAME(){
                    var myvalue=eval(\"$ECALC1\");
                    var prec=document.form1.DATA_$ITEM_ID.getAttribute('prec');
                    var vPrec;
                    if(!prec){
                        vPrec=10000;
                    }else{
                        vPrec=Math.pow(10,prec);
                    }
                    if(!isNaN(myvalue) && myvalue != Infinity) {
                        var result = new Number(parseFloat(Math.round(myvalue*vPrec)/vPrec));
                        document.form1.DATA_$ITEM_ID.value=result.toFixed(prec);
                    }else if(is_ths(myvalue)){
                        var result = new Number(parseFloat(Math.round(calc_ths_rev(myvalue)*vPrec)/vPrec));
                        document.form1.DATA_$ITEM_ID.value=calc_ths(result.toFixed(prec));
                    }else{
                        var vzieo = (isNaN(myvalue) && typeof myvalue == \"string\") ? myvalue : 0;
                        if(vzieo == 0){
                            vzieo = vzieo.toFixed(prec);
                        }
                        document.form1.DATA_$ITEM_ID.value=vzieo;
                    }
                    setTimeout(calc_$ENAME,500);
                }
                setTimeout(calc_$ENAME,500);
                </script>";
            }else {
                $ELEMENT_OUT.="\n
                <script>
                function calc_$ENAME(){
                    return false;
                }
                </script>";
            }
        }
        elseif($ECLASS=="AUTO")  // 宏控件
        {
            $EDATAFLD=$ELEMENT_ARR["DATAFLD"];
            $AUTO_VALUE="";
            if($ETAG=="input") // 宏控件单行输入框
            {
                switch($EDATAFLD)
                {
                    case "SYS_DATE":
                        $AUTO_VALUE=$CUR_DATE;
                        break;
                    case "SYS_DATE_CN":
                        $AUTO_VALUE=format_date($CUR_DATE);
                        break;
                    case "SYS_DATE_CN_SHORT1":
                        $AUTO_VALUE=format_date_short1($CUR_DATE);
                        break;
                    case "SYS_DATE_CN_SHORT2":
                        $AUTO_VALUE=format_date_short2($CUR_DATE);
                        break;
                    case "SYS_DATE_CN_SHORT3":
                        $AUTO_VALUE=format_date_short3($CUR_DATE);
                        break;
                    case "SYS_DATE_CN_SHORT4":
                        $AUTO_VALUE=date("Y",time());
                        break;
                    case "SYS_TIME":
                        $AUTO_VALUE=$CUR_TIME1;
                        break;
                    case "SYS_DATETIME":
                        $AUTO_VALUE=$CUR_TIME;
                        break;
                    case "SYS_WEEK":
                        $AUTO_VALUE=get_week($CUR_TIME);
                        break;
                    case "SYS_USERID":
                        $AUTO_VALUE=$_SESSION["LOGIN_USER_ID"];
                        break;
                    case "SYS_USERNAME":
                        $AUTO_VALUE=$_SESSION["LOGIN_USER_NAME"];
                        break;
                    case "SYS_USERPRIV":
                        $query_auto="SELECT PRIV_NAME from USER_PRIV where USER_PRIV='".$_SESSION["LOGIN_USER_PRIV"]."'";
                        $cursor_auto = exequery(TD::conn(),$query_auto);
                        if($ROW=mysql_fetch_array($cursor_auto))
                           $AUTO_VALUE=$ROW["PRIV_NAME"];
                        break;
                    case "SYS_USERPRIVOTHER":
                        //从辅助角色中去除主角色

                        $USER_PRIV_OTHER_TMP = str_replace( ",".$_SESSION["LOGIN_USER_PRIV"].",","",$USER_PRIV_OTHER.",");
                        $query_auto="SELECT PRIV_NAME from USER_PRIV where find_in_set(USER_PRIV,'$USER_PRIV_OTHER_TMP')";
                        $cursor_auto = exequery(TD::conn(),$query_auto);
                        while($ROW=mysql_fetch_array($cursor_auto))
                        {
                           $AUTO_VALUE.=$ROW["PRIV_NAME"] . ",";
                        }
                        $AUTO_VALUE = td_trim($AUTO_VALUE);
                        break;
                    case "SYS_USERNAME_DATE":
                        $AUTO_VALUE=$_SESSION["LOGIN_USER_NAME"]." ".$CUR_DATE;
                        break;
                    case "SYS_USERNAME_DATETIME":
                        $AUTO_VALUE=$_SESSION["LOGIN_USER_NAME"]." ".$CUR_TIME;
                        break;
                    case "SYS_DEPTNAME":
                        $AUTO_VALUE=dept_long_name($_SESSION["LOGIN_DEPT_ID"]);
                        break;
                    case "SYS_DEPTNAME_SHORT":
                        $query_auto="SELECT DEPT_NAME from DEPARTMENT where DEPT_ID='".$_SESSION["LOGIN_DEPT_ID"]."'";
                        $cursor_auto = exequery(TD::conn(),$query_auto);
                        if($ROW=mysql_fetch_array($cursor_auto))
                           $AUTO_VALUE=$ROW["DEPT_NAME"];
                        break;
                    case "SYS_FORMNAME":
                        $AUTO_VALUE=$FORM_NAME;
                        break;
                    case "SYS_RUNNAME":
                        $AUTO_VALUE=$RUN_NAME;
                        break;
                    case "SYS_RUNDATE":
                        $AUTO_VALUE=$PRCS_DATE;
                        break;
                    case "SYS_RUNDATETIME":
                        $AUTO_VALUE=$BEGIN_TIME;
                        break;
                    case "SYS_RUNID":
                        $AUTO_VALUE=$RUN_ID;
                        break;
                    case "SYS_AUTONUM":
                        $AUTO_VALUE=$AUTO_NUM;
                        break;
                    case "SYS_IP":
                        $AUTO_VALUE=get_client_ip();
                        break;
                    case "SYS_SQL":
                        $SQL = $ELEMENT_ARR["DATASRC"];
                        $AUTO_VALUE = list_sql($SQL, false, $RUN_ID);
                        break;
                    case "SYS_MANAGER1":
                        $MANAGER_ARRAY = get_dept_manager($_SESSION["LOGIN_DEPT_ID"]);
                        $AUTO_VALUE = current($MANAGER_ARRAY);
                        break;
                    case "SYS_MANAGER2":
                        $PARENT_DEPT_ID=get_dept_parent($_SESSION["LOGIN_DEPT_ID"]);
                        $MANAGER_ARRAY = get_dept_manager($PARENT_DEPT_ID);
                        $AUTO_VALUE = current($MANAGER_ARRAY);
                        break;
                    case "SYS_MANAGER3":
                        $TOP_DEPT_ID=get_dept_parent($_SESSION["LOGIN_DEPT_ID"],1);
                        $MANAGER_ARRAY = get_dept_manager($TOP_DEPT_ID);
                        $AUTO_VALUE = current($MANAGER_ARRAY);
                        break;
                }
                //--- 宏控件单行输入框的自动赋值，数据库为空值且为可写字段时将自动取值，或者是设定为允许在非可写状态下赋值的宏控件(不管是否为空，都自动赋值) ---
                if(($ITEM_VALUE=="" && !$READ_ONLY)||($READ_ONLY && find_id($PRCS_ITEM_AUTO,$ETITLE) && $OP_FLAG))
                {
                    $ELEMENT_OUT = preg_replace("/value\s?=\s?\"?$EVALUE\"?/i","",$ELEMENT_OUT);
                    $ELEMENT_OUT=str_replace("<$ETAG","<$ETAG value=\"$AUTO_VALUE\"",$ELEMENT_OUT);
//                    $ELEMENT_OUT=str_replace("value=$EVALUE","",$ELEMENT_OUT);
//                    $ELEMENT_OUT=str_replace("value='$EVALUE'","",$ELEMENT_OUT);
//                    $ELEMENT_OUT=str_replace("value=''","",$ELEMENT_OUT);
//                    $ELEMENT_OUT=str_replace("<$ETAG","<$ETAG value='$AUTO_VALUE'",$ELEMENT_OUT);
                }

                //宏控件隐藏属性
                $HIDDEN = $ELEMENT_ARR["HIDDEN"];
                if($HIDDEN=="1")
                    $ELEMENT_OUT=str_replace("<$ETAG","<$ETAG type=\"hidden\"",$ELEMENT_OUT);
            }
            elseif($ETAG=="select") // 宏控件下拉菜单
            {
                $AUTO_VALUE="<option value=\"\"";
                if($ITEM_VALUE=="")
                    $AUTO_VALUE.=" selected";
                $AUTO_VALUE.="></option>\n";
                $POS=stripos($ELEMENT_OUT,">")+1;
                $POS1=stripos($ELEMENT_OUT,"</SELECT>",$POS);
                $EVALUE=substr($ELEMENT_OUT,$POS,$POS1-$POS);
                $ITEM_VALUE_TEXT="";
                switch($EDATAFLD)
                {
                    case "SYS_LIST_DEPT":
                        $AUTO_VALUE.=workflow_my_dept_tree(0,$ITEM_VALUE,0);
                        if($ITEM_VALUE!="" && is_numeric($ITEM_VALUE))
                        {
                            $query_auto="SELECT DEPT_NAME from DEPARTMENT where DEPT_ID='$ITEM_VALUE'";
                            $cursor_auto = exequery(TD::conn(),$query_auto);
                            if($ROW=mysql_fetch_array($cursor_auto))
                            {
                                $ITEM_VALUE_TEXT=$ROW["DEPT_NAME"];
                            }
                        }
                        else
                        {
                            $ITEM_VALUE_TEXT=$ITEM_VALUE;
                        }
                        break;
                    case "SYS_LIST_USER":
                        $query_auto="SELECT USER_ID,USER_NAME from USER,USER_PRIV where USER.USER_PRIV=USER_PRIV.USER_PRIV and USER.DEPT_ID != 0 order by PRIV_NO,USER_NO,USER_NAME";
                        $cursor_auto = exequery(TD::conn(),$query_auto);
                        while($ROW=mysql_fetch_array($cursor_auto))
                        {
                            $USER_ID=$ROW["USER_ID"];
                            $USER_NAME=$ROW["USER_NAME"];
                            $AUTO_VALUE.="<option value=\"$USER_NAME\"";
                            if($ITEM_VALUE==$USER_NAME)
                            {
                                $AUTO_VALUE.=" selected";
                                $ITEM_VALUE_TEXT=$USER_NAME;
                            }
                            $AUTO_VALUE.=">$USER_NAME</option>\n";
                        }
                        break;
                 case "SYS_LIST_PRIV":
                        $query_auto="SELECT USER_PRIV,PRIV_NAME from USER_PRIV order by PRIV_NO";
                        $cursor_auto = exequery(TD::conn(),$query_auto);
                        while($ROW=mysql_fetch_array($cursor_auto))
                        {
                           $USER_PRIV=$ROW["USER_PRIV"];
                           $PRIV_NAME=$ROW["PRIV_NAME"];
                           $AUTO_VALUE.="<option value=\"$PRIV_NAME\"";
                           if($ITEM_VALUE==$PRIV_NAME)
                           {
                              $AUTO_VALUE.=" selected";
                              $ITEM_VALUE_TEXT=$PRIV_NAME;
                           }
                           $AUTO_VALUE.=">$PRIV_NAME</option>\n";
                        }
                        break;
                 case "SYS_LIST_PRIV_ONLY":
                        $query_auto="SELECT USER_PRIV,PRIV_NAME from USER_PRIV order by PRIV_NO";
                        $cursor_auto = exequery(TD::conn(),$query_auto);
                        while($ROW=mysql_fetch_array($cursor_auto))
                        {
                           $USER_PRIV=$ROW["USER_PRIV"];
                           $PRIV_NAME=$ROW["PRIV_NAME"];

                           $USER_COUNT = 0;
                           $query1 = "SELECT count(*) from USER where USER_PRIV='$USER_PRIV'";
                           $cursor1= exequery(TD::conn(),$query1);
                           if($ROW1=mysql_fetch_array($cursor1))
                            $USER_COUNT=$ROW1[0];
                           if($USER_COUNT == 0)
                            continue;

                           $AUTO_VALUE.="<option value=\"$PRIV_NAME\"";
                           if($ITEM_VALUE==$PRIV_NAME)
                           {
                              $AUTO_VALUE.=" selected";
                              $ITEM_VALUE_TEXT=$PRIV_NAME;
                           }
                           $AUTO_VALUE.=">$PRIV_NAME</option>\n";
                        }
                        break;
                 case "SYS_LIST_PRIV_OTHER":
                        $query_auto="SELECT USER_PRIV,PRIV_NAME from USER_PRIV order by PRIV_NO";
                        $cursor_auto = exequery(TD::conn(),$query_auto);
                        while($ROW=mysql_fetch_array($cursor_auto))
                        {
                           $USER_PRIV=$ROW["USER_PRIV"];
                           $PRIV_NAME=$ROW["PRIV_NAME"];
                           $query1 = "SELECT count(*) from USER where FIND_IN_SET('$USER_PRIV',USER_PRIV_OTHER)";
                           $cursor1= exequery(TD::conn(),$query1);
                           if($ROW1=mysql_fetch_array($cursor1))
                            $USER_COUNT=$ROW1[0];
                           if($USER_COUNT == 0)
                            continue;
                           $AUTO_VALUE.="<option value=\"$PRIV_NAME\"";
                           if($ITEM_VALUE==$PRIV_NAME)
                           {
                              $AUTO_VALUE.=" selected";
                              $ITEM_VALUE_TEXT=$PRIV_NAME;
                           }
                           $AUTO_VALUE.=">$PRIV_NAME</option>\n";
                        }
                        break;
                 case "SYS_LIST_PRCSUSER1":
                        $query_auto = "select PRCS_USER,PRCS_DEPT,PRCS_PRIV from FLOW_PROCESS where FLOW_ID='$FLOW_ID' order by PRCS_ID";
                        $cursor_auto=exequery(TD::conn(),$query_auto);
                        $PRCS_USER="";
                        $PRCS_DEPT="";
                        $PRCS_PRIV="";
                        $PRCS_DEPT_ALL="";
                        while($ROW=mysql_fetch_array($cursor_auto))
                        {
                            if($ROW["PRCS_USER"]!="")
                                $PRCS_USER.=$ROW["PRCS_USER"];
                            if($ROW["PRCS_DEPT"]!="" && $ROW["PRCS_DEPT"]!="ALL_DEPT")
                                $PRCS_DEPT.=$ROW["PRCS_DEPT"];
                            elseif($ROW["PRCS_DEPT"]=="ALL_DEPT")
                                $PRCS_DEPT_ALL="ALL_DEPT";
                            if($ROW["PRCS_PRIV"]!="")
                                $PRCS_PRIV.=$ROW["PRCS_PRIV"];
                        }

                        $query_auto = "SELECT USER_ID,USER_NAME from USER,USER_PRIV where USER.USER_PRIV=USER_PRIV.USER_PRIV AND (USER.NOT_LOGIN='0' or USER.NOT_MOBILE_LOGIN='0') AND (";
                        if($PRCS_DEPT && $PRCS_DEPT_ALL!="ALL_DEPT")
                            $query_auto .= "FIND_IN_SET(USER.DEPT_ID,'$PRCS_DEPT')";
                        elseif($PRCS_DEPT_ALL=="ALL_DEPT")
                            $query_auto .= "1=1";
                        else
                            $query_auto .= "1=0";
                        if($PRCS_USER)
                            $query_auto .= " or FIND_IN_SET(USER.USER_ID,'$PRCS_USER')";
                        if($PRCS_PRIV)
                            $query_auto .= " or FIND_IN_SET(USER.USER_PRIV,'$PRCS_PRIV')".flow_other_sql($PRCS_PRIV);

                        $query_auto .= ") order by PRIV_NO,USER_NO,USER_NAME";
                        $cursor_auto=exequery(TD::conn(),$query_auto);
                        while($ROW=mysql_fetch_array($cursor_auto))
                        {
                            $USER_ID=$ROW["USER_ID"];
                            $USER_NAME=$ROW["USER_NAME"];
                            $AUTO_VALUE.="<option value=\"$USER_NAME\"";
                            if($ITEM_VALUE==$USER_NAME)
                            {
                               $AUTO_VALUE.=" selected";
                               $ITEM_VALUE_TEXT=$USER_NAME;
                            }
                            $AUTO_VALUE.=">$USER_NAME</option>\n";
                        }
                        break;
                 case "SYS_LIST_PRCSUSER2":
                        if(!$EDIT_MODE)
                        {
                            $query_auto = "select PRCS_USER,PRCS_DEPT,PRCS_PRIV from FLOW_PROCESS where FLOW_ID='$FLOW_ID' and PRCS_ID='$FLOW_PRCS'";
                            $cursor_auto=exequery(TD::conn(),$query_auto);
                            $PRCS_USER="";
                            $PRCS_DEPT="";
                            $PRCS_PRIV="";
                            if($ROW=mysql_fetch_array($cursor_auto))
                            {
                                if($ROW["PRCS_USER"]!="")
                                    $PRCS_USER=$ROW["PRCS_USER"];

                                if($ROW["PRCS_DEPT"]!="" && $ROW["PRCS_DEPT"]!="ALL_DEPT")
                                    $PRCS_DEPT=$ROW["PRCS_DEPT"];
                                elseif($ROW["PRCS_DEPT"]=="ALL_DEPT")
                                    $PRCS_DEPT="ALL_DEPT";

                                if($ROW["PRCS_PRIV"]!="")
                                    $PRCS_PRIV=$ROW["PRCS_PRIV"];
                            }

                            if($ITEM_VALUE!="")
                                $PRCS_USER.=$ITEM_VALUE;

                            $query_auto = "SELECT USER_ID,USER_NAME from USER,USER_PRIV where USER.USER_PRIV=USER_PRIV.USER_PRIV AND (USER.NOT_LOGIN='0' or USER.NOT_MOBILE_LOGIN='0') AND (";
                            if($PRCS_DEPT && $PRCS_DEPT!="ALL_DEPT")
                                $query_auto .= "FIND_IN_SET(USER.DEPT_ID,'$PRCS_DEPT')";
                            elseif($PRCS_DEPT=="ALL_DEPT")
                                $query_auto .= "1=1";
                            else
                                $query_auto .= "1=0";
                            if($PRCS_USER)
                                  $query_auto .= " or FIND_IN_SET(USER.USER_ID,'$PRCS_USER')";
                            if($PRCS_PRIV)
                                  $query_auto .= " or FIND_IN_SET(USER.USER_PRIV,'$PRCS_PRIV')".flow_other_sql($PRCS_PRIV);

                            $query_auto .= ") order by PRIV_NO,USER_NO,USER_NAME";
                            $cursor_auto=exequery(TD::conn(),$query_auto);
                            while($ROW=mysql_fetch_array($cursor_auto))
                            {
                                $USER_ID=$ROW["USER_ID"];
                                $USER_NAME=$ROW["USER_NAME"];
                                $AUTO_VALUE.="<option value=\"$USER_NAME\"";
                                if($ITEM_VALUE==$USER_NAME)
                                {
                                    $AUTO_VALUE.=" selected";
                                    $ITEM_VALUE_TEXT=$USER_NAME;
                                }
                                $AUTO_VALUE.=">$USER_NAME</option>\n";
                            }
                        }
                        break;
                 case "SYS_LIST_SQL":
                        $SQL = $ELEMENT_ARR["DATASRC"];
                        $ELEMENT_OUT=str_replace($SQL,"",$ELEMENT_OUT);

                        $AUTO_VALUE_ARRAY = list_sql($SQL,true,$RUN_ID);
                        $ITEM_VALUE_TEXT = $AUTO_VALUE_ARRAY[0];
                        $AUTO_VALUE .= array2list($AUTO_VALUE_ARRAY,$ITEM_VALUE);
                        break;
                  case "SYS_LIST_MANAGER1":
                        if($ITEM_VALUE!="")
                        {
                            $query_auto="SELECT USER_NAME from USER where USER_ID='$ITEM_VALUE'";
                            $cursor_auto = exequery(TD::conn(),$query_auto);
                            if($ROW=mysql_fetch_array($cursor_auto))
                                $ITEM_VALUE_TEXT=$ROW["USER_NAME"];
                        }
                        $MANAGER_ARRAY = get_dept_manager($_SESSION["LOGIN_DEPT_ID"]);
                        $AUTO_VALUE .= array2list($MANAGER_ARRAY, $ITEM_VALUE_TEXT);
                        break;
                  case "SYS_LIST_MANAGER2":
                        if($ITEM_VALUE!="")
                        {
                            $query_auto="SELECT USER_NAME from USER where USER_ID='$ITEM_VALUE'";
                            $cursor_auto = exequery(TD::conn(),$query_auto);
                            if($ROW=mysql_fetch_array($cursor_auto))
                                $ITEM_VALUE_TEXT=$ROW["USER_NAME"];
                        }
                        $PARENT_DEPT_ID = get_dept_parent($_SESSION["LOGIN_DEPT_ID"]);
                        $MANAGER_ARRAY = get_dept_manager($PARENT_DEPT_ID);
                        $AUTO_VALUE .= array2list($MANAGER_ARRAY, $ITEM_VALUE_TEXT);
                        break;
                  case "SYS_LIST_MANAGER3":
                        if($ITEM_VALUE!="")
                        {
                            $query_auto="SELECT USER_NAME from USER where USER_ID='$ITEM_VALUE'";
                            $cursor_auto = exequery(TD::conn(),$query_auto);
                            if($ROW=mysql_fetch_array($cursor_auto))
                                $ITEM_VALUE_TEXT=$ROW["USER_NAME"];
                        }
                        $TOP_DEPT_ID=get_dept_parent($_SESSION["LOGIN_DEPT_ID"],1);
                        $MANAGER_ARRAY = get_dept_manager($TOP_DEPT_ID);
                        $AUTO_VALUE .= array2list($MANAGER_ARRAY, $ITEM_VALUE_TEXT);
                        break;
              }
              $ELEMENT_OUT=substr($ELEMENT_OUT,0,stripos($ELEMENT_OUT,">")+1).$AUTO_VALUE."</SELECT>";
           }
        }
        elseif($ECLASS=="LIST_VIEW")  //列表控件
        {
            $LV_TB_ID="LV_".$ITEM_ID;
            $LV_TITLE=$ELEMENT_ARR["LV_TITLE"];
            $LV_SIZE=$ELEMENT_ARR["LV_SIZE"];
            $LV_SUM =$ELEMENT_ARR["LV_SUM"];
            $LV_CAL=$ELEMENT_ARR["LV_CAL"];
            $LV_COLTYPE=$ELEMENT_ARR["LV_COLTYPE"];
            $LV_COLVALUE=$ELEMENT_ARR["LV_COLVALUE"];
            $DATA_TABLE = $ELEMENT_ARR["DATA_TABLE"];
            $DATA_FIELD = $ELEMENT_ARR["DATA_FIELD"];
            $DATA_FLD_NAME = $ELEMENT_ARR["DATA_FLD_NAME"];
            $DATA_QUERY = $ELEMENT_ARR["DATA_QUERY"];
            $ELEMENT_OUT="<table id=\"$LV_TB_ID\" lv_sum=\"".$LV_SUM."\" read_only=\"".$READ_ONLY."\" lv_cal=\"".$LV_CAL."\" lv_coltype=\"".$LV_COLTYPE."\" lv_colvalue=\"".$LV_COLVALUE."\" data_table=\"".$DATA_TABLE."\" data_field=\"".$DATA_FIELD."\" data_query=\"".$DATA_QUERY."\" data_fld_name=\"".$DATA_FLD_NAME."\" class=\"LIST_VIEW\" style=\"border-collapse:collapse;\" border=\"1\" cellspacing=\"0\" cellpadding=\"2\" FormData=\"$LV_SIZE\">\n";
            $ELEMENT_OUT.="<tr style=\"font-weight:bold;font-size:14px;\" class=\"LIST_VIEW_HEADER\">\n";
            $ELEMENT_OUT.="<td nowrap>"._("序号")."</td>\n";
            $MY_ARRAY=explode("`",$LV_TITLE);
            $ARRAY_COUNT=sizeof($MY_ARRAY);
            $LV_SIZE_count = explode("`",$LV_SIZE);
            if($MY_ARRAY[$ARRAY_COUNT-1]=="")$ARRAY_COUNT--;
            for($I=0;$I<$ARRAY_COUNT;$I++){
                $ELEMENT_OUT.="<td nowrap style=\"width:".($LV_SIZE_count[$I] * 7.2)."px;\">".$MY_ARRAY[$I]."</td>\n";
            }
            //查处步骤模式
            $query_list = "select CONTROL_MODE from FLOW_PROCESS where FLOW_ID = '$FLOW_ID' and PRCS_ID = '$FLOW_PRCS'";
            $cursor_list = exequery(TD::conn(), $query_list);
            if($ROW_LIST = mysql_fetch_array($cursor_list))
            {
                $CONTROL_MODE = $ROW_LIST['CONTROL_MODE'];
            }
            //拼接步骤数组
            if($CONTROL_MODE != "")
            {
                $CONTROL_MODE_ARR = explode("|",$CONTROL_MODE);
                //控件ID
                $CONTROL_MODE_KEY = $CONTROL_MODE_ARR[0];
                $KEY_ARR = explode(",",$CONTROL_MODE_KEY);
                //控件值
                $CONTROL_MODE_VAL = $CONTROL_MODE_ARR[1];
                $VAL_ARR = explode(",",$CONTROL_MODE_VAL);
                $LIST_ARR = array();
                for($i = 0; $i < count($KEY_ARR); $i++)
                {
                    $LIST_ARR[$KEY_ARR[$i]] = $VAL_ARR[$i];
                }
                //编辑
                $EDIT = strstr($LIST_ARR["DATA_" . $ITEM_ID], "1`");
                //增加
                $ADD = strstr($LIST_ARR["DATA_" . $ITEM_ID], "2`");
                //删除
                $DEL = strstr($LIST_ARR["DATA_" . $ITEM_ID], "3`");
            }else if($FLOW_TYPE == 2 && $PRCS_ID != 1){
            	$query = "SELECT 1 FROM flow_run_prcs WHERE run_id = '$RUN_ID' AND prcs_id = '$PRCS_ID' AND FIND_IN_SET('".$ELEMENT_ARR["TITLE"]."', free_item)";
            	$cursor = exequery(TD::conn(), $query);
            	if($row = mysql_fetch_array($cursor, MYSQL_ASSOC)){
            		$EDIT = "1`";
	                $ADD = "2`";
	                $DEL = "3`";
            	}
            }
            //处理表单的预览情况
            if(strpos($_SERVER["SCRIPT_NAME"], "form_view") || ($FLOW_TYPE == 2 && $PRCS_ID == 1)){
                $EDIT = "1`";
                $ADD = "2`";
                $DEL = "3`";
            }

            $ELEMENT_OUT.="<td>"._("操作")."</td></tr></table>\n";
            if(!$READ_ONLY)
            {
                if($ADD)
                {
                    $ELEMENT_OUT.="<span style=\"font-size:14px;font-weight: normal;white-space:nowrap;\"><input type=\"button\" value=\""._("新增")."\" onclick=\"td_addnew_multiple('$LV_TB_ID','0','','1');\">";
                    $ELEMENT_OUT.="<input type=\"input\" id=\"add_btn_num_".$ITEM_ID ."\" style=\"margin-left:5px;\" maxlength=\"2\" size=\"2\" value=\"1\" >"._("行")."</span>\n";
                    $ELEMENT_OUT.="<input type=\"button\" value=\""._("计算")."\" onclick=\"tb_cal('$LV_TB_ID','$LV_CAL');\">\n";
                }
            }

            $ELEMENT_OUT.="<input type=\"hidden\" class=\"LIST_VIEW\" name=\"".$ENAME."\">\n";
            //添加数据行
            $MY_ARRAY=explode("\r\n",$ITEM_VALUE);
            $ARRAY_COUNT=sizeof($MY_ARRAY);
            if($MY_ARRAY[$ARRAY_COUNT-1]=="")$ARRAY_COUNT--;
            for($I=0;$I<$ARRAY_COUNT;$I++)
            {
                if(!$EDIT || $READ_ONLY)
                {
                    $READ_LINE = "1";
                }
                else
                {
                    $READ_LINE = "0";
                }
                //$JS_ONLOAD.="tb_addnew('$LV_TB_ID',".$READ_LINE.",'".addslashes($MY_ARRAY[$I])."','$LV_SUM','$DEL');\r\n";
                $JS_ONLOAD.="tb_addnew('$LV_TB_ID',".$READ_LINE.",'".addslashes($MY_ARRAY[$I])."','$DEL');\r\n";
            }
       //     $JS_ONLOAD.="setInterval(tb_cal,1000,'$LV_TB_ID','$LV_CAL');\r\n";
            $JS_ONLOAD.="setInterval(function(){tb_cal('$LV_TB_ID','$LV_CAL');},1000);\r\n";
        }
        elseif($ECLASS=="SIGN")  //签章控件
        {
            $SIGN_ID="DATA_".$ITEM_ID;

            $SIGN_CHECK=$ELEMENT_ARR["DATAFLD"];  //印章锁定字段
            $SIGN_COLOR=$ELEMENT_ARR["SIGN_COLOR"];
            $ITEM_CHECK="";
            foreach($ELEMENT_QUERY as $ENAME1 => $ELEMENT_QUERY_ARR)
            {
                $ETITLE1=$ELEMENT_QUERY_ARR["TITLE"];
                $ECLASS1=$ELEMENT_QUERY_ARR["CLASS"];
                $ITEM_ID1=$ELEMENT_QUERY_ARR["ITEM_ID"];

                if(date_or_user_or_more($ELEMENT_QUERY_ARR))
                   continue;

                if(find_id($SIGN_CHECK,$ETITLE1))
                  $ITEM_CHECK.="DATA_".$ITEM_ID1.",";
            }

            if(substr($ITEM_CHECK,-1,1)==",")
                $ITEM_CHECK=substr($ITEM_CHECK,0,-1);
            $SIGN_CHECK_STR.='"'.$SIGN_ID.'":"'.$ITEM_CHECK.'",';
            $SIGN_OBJECT.=$SIGN_ID.","; //印章ID串
            $GLOBALS["SIGN_OBJECT"].=$SIGN_ID.",";

            $ELEMENT_OUT="";
            $ELEMENT_OUT.="<div class=\"websign\" id=\"SIGN_POS_$SIGN_ID\">&nbsp;";
            if(!$READ_ONLY)
            {
                $TYPE_ARR = explode(",", $SIGN_TYPE);
                if($TYPE_ARR[0] == 1)
                    $ELEMENT_OUT.="<input type=\"button\" value=\""._("盖章")."\" onclick=\"addSeal('$SIGN_ID');\">\n";
                if($TYPE_ARR[1] == 1)
                    $ELEMENT_OUT.="<input type=\"button\" value=\""._("手写")."\" onclick=\"handWrite('$SIGN_ID','$SIGN_COLOR');\">\n";
                if($TYPE_ARR[0] != 1 && $TYPE_ARR[1] != 1)
                {
                    $ELEMENT_OUT.="<input type=\"button\" value="._("盖章")." onclick=\"addSeal('$SIGN_ID');\">\n";
                    $ELEMENT_OUT.="<input type=\"button\" value="._("手写")." onclick=\"handWrite('$SIGN_ID','$SIGN_COLOR');\">\n";
                }
            }
            //判断签章控件是否可写，生成签章时以此为依据，加载签章菜单
            if($READ_ONLY)
                $SIGN_READONLY = "readOnly";
            else
                $SIGN_READONLY = "";
            $ELEMENT_OUT.="<input type=\"hidden\" name=\"".$SIGN_ID."\" $SIGN_READONLY value=\"$ITEM_VALUE\">\n";
            $ELEMENT_OUT.="</div>";
        }
        elseif($ECLASS=="MOBILE_SEAL")
        {
            $EDATAFLD=$ELEMENT_ARR["DATAFLD"];
            foreach($CHECK_ELEMENT_ARR as $ENAME1 => $CHECK_ELEMENT)
            {
                $ETITLE1=$CHECK_ELEMENT["TITLE"];
                $ECLASS1=$CHECK_ELEMENT["CLASS"];
                $ITEM_ID1=$CHECK_ELEMENT["ITEM_ID"];

                if(date_or_user_or_more($CHECK_ELEMENT))
                    continue;
                if(find_id($EDATAFLD,$ETITLE1))
                    $ITEM_CHECK.="DATA_".$ITEM_ID1.",";
            }
            $SEAL_SRC = "/general/approve_center/list/input_form/get_mobile_seal.php?FLOW_ID=$FLOW_ID&RUN_ID=$RUN_ID&FIELD=DATA_$ITEM_ID&CHECK_FIELD=$ITEM_CHECK&archive_time=$archive_time&PHPSESSID=".session_id();
            if($FLOW_ID)
            {
                $query = "select `DATA_$ITEM_ID` from `flow_data_$FLOW_ID` where run_id = '$RUN_ID'";
                $cursor= exequery(TD::conn(),$query);
                if($ROW=mysql_fetch_array($cursor))
                    $data=$ROW["DATA_$ITEM_ID"];
            }

            if($data == $ITEM_VALUE && $data != "")
            {            	
            	$FLOW_ID = intval($FLOW_ID);
							$tbl_name = "flow_data_".$FLOW_ID;							
							$FIELD_STR = "DATA_".$ITEM_ID;
							$CHECK_FIELD = trim($ITEM_CHECK, ",");
							if($CHECK_FIELD)
								$FIELD_STR .= "," . $CHECK_FIELD;
							$query = "select $FIELD_STR from $tbl_name WHERE RUN_ID='$RUN_ID'";
							$cursor= exequery(TD::conn(),$query);
							if($ROW=mysql_fetch_array($cursor))
							{
							   	 $SEAL_DATA=$ROW[0];						   
								 if($SEAL_DATA)
								 { 		
							    $SEAL_DATA = base64_decode($SEAL_DATA);
									$sd = new TDSealData($SEAL_DATA);
									$sealPic = $sd->get_pic();
								 }
							}
							//组织验证字段数组
							$check_array = array();
							$CHECK_FIELD = trim($CHECK_FIELD,",");
							if($CHECK_FIELD != "")
							{
								$TMP_CHECK_ARR = explode(",", $CHECK_FIELD);
								foreach ($TMP_CHECK_ARR as $key=>$val) {
								 	 $check_array[$val] = $ROW[$val];
								}
							}
							$valid = $sd->check_data($check_array);							
							$flush_pic_imsize = $sd->flush_pic_imsize($valid);

							$widths = $flush_pic_imsize[0];
							$heights = $flush_pic_imsize[1];
							if($widths > 200){
								$widths = 200;
							}
							if($heights > 200){
								$heights = 200;
							}
                $ELEMENT_OUT = "<div style=''>";
                $ELEMENT_OUT .= "<img style='width:".$widths."px;height:".$heights."px;' src='".$SEAL_SRC."' />";
                $ELEMENT_OUT .= "<input type=\"text\" name='".$ENAME."' value='".$ITEM_VALUE."' style='display:none' />";
                $ELEMENT_OUT .= "</div>\n";
            }
            else {
                $ELEMENT_OUT = "";
            }
        }
        elseif($ECLASS=="DATA")  //数据选择控件
        {
            $DATA_TYPE=$ELEMENT_ARR["DATA_TYPE"];
            if(!$READ_ONLY)//可写字段
            {
                $DATA_CONTROL=$ELEMENT_ARR["DATA_CONTROL"];
                $DATA_QUERY=$ELEMENT_ARR["DATA_QUERY"];
                $DATA_FIELD=$ELEMENT_ARR["DATA_FIELD"];
                $QUERY_ARRAY = explode("`",$DATA_QUERY);
                $FIELD_ARRAY = explode("`",$DATA_FIELD);

                $MY_ARRAY=explode("`",$DATA_CONTROL);
                $ARRAY_COUNT=sizeof($MY_ARRAY);
                if($MY_ARRAY[$ARRAY_COUNT-1]=="")$ARRAY_COUNT--;

                $ITEM_STR="";
                $ITEM_OBJ="";
                $KEY_ITEM_STR = "";
                for($J=0;$J< $ARRAY_COUNT;$J++)
                {
                  $ITEM_ID1=0;
                  $FIND_FLAG=0;
                  foreach($ELEMENT_QUERY as $ENAME1 => $ELEMENT_QUERY_ARR)
                  {
                    $ETITLE1=$ELEMENT_QUERY_ARR["TITLE"];
                    $ECLASS1=$ELEMENT_QUERY_ARR["CLASS"];
                    $ITEM_ID1=$ELEMENT_QUERY_ARR["ITEM_ID"];

                    if(date_or_user_or_more($ELEMENT_QUERY_ARR))
                      continue;

                    if($ETITLE1==$MY_ARRAY[$J])
                    {
                       $FIND_FLAG=1;
                       $ITEM_STR.="DATA_".$ITEM_ID1.",";
                       $ITEM_OBJ.='{"DATA_'.$ITEM_ID1.'":"'.$FIELD_ARRAY[$J].'"},';

                       //作为主键
                       if($DATA_TYPE=="1" && $QUERY_ARRAY[$J] == "1")
                          $KEY_ITEM_STR.='{"DATA_'.$ITEM_ID1.'":"'.$FIELD_ARRAY[$J].'"},';
                       break;
                    }
                  }
                  if($FIND_FLAG==0)
                     $ITEM_STR.=",";
                }
                if($ITEM_OBJ!="")
                    $ITEM_OBJ = "[".rtrim($ITEM_OBJ,",")."]";

                if($KEY_ITEM_STR!="")
                    $KEY_ITEM_STR = "[".rtrim($KEY_ITEM_STR,",")."]";

                if($DATA_TYPE=="1")
                {
                    $ELEMENT_OUT=str_replace("<$ETAG","<$ETAG style=\"display:none;\"",$ELEMENT_OUT);
                    $ELEMENT_OUT.="<script>jQuery(function($){initAutoComplete($,\"$ENAME\",$KEY_ITEM_STR,$ITEM_OBJ);});</script>";
                }
                else
                    $ELEMENT_OUT=str_replace("<$ETAG","<$ETAG onclick=\"data_picker(this,'".$ITEM_STR."');return false;\"",$ELEMENT_OUT);
          }else{
                if($DATA_TYPE=="1")
                {
                    $ELEMENT_OUT=str_replace("<$ETAG","<$ETAG style=\"display:none;\"",$ELEMENT_OUT);
                    $ELEMENT_OUT.="<script>jQuery(function($){initAutoComplete($,\"$ENAME\",$KEY_ITEM_STR,$ITEM_OBJ);});</script>";
                }
          }
        }
        elseif($ECLASS=="DATA_EXT")  //外部数据选择控件
        {
            if(!$READ_ONLY)//可写字段
            {
                $DATA_TYPE=$ELEMENT_ARR["DATA_TYPE"];
                $DATA_CONTROL=$ELEMENT_ARR["DATA_CONTROL"];
                $DATA_QUERY=$ELEMENT_ARR["DATA_QUERY"];
                $DATA_FIELD=$ELEMENT_ARR["DATA_FIELD"];
                $QUERY_ARRAY = explode("`",$DATA_QUERY);
                $FIELD_ARRAY = explode("`",$DATA_FIELD);

                $MY_ARRAY=explode("`",$DATA_CONTROL);
                $ARRAY_COUNT=sizeof($MY_ARRAY);
                if($MY_ARRAY[$ARRAY_COUNT-1]=="")$ARRAY_COUNT--;

                $ITEM_STR="";
                $ITEM_OBJ="";
                $KEY_ITEM_STR = "";
                for($J=0;$J< $ARRAY_COUNT;$J++)
                {
                  $ITEM_ID1=0;
                  $FIND_FLAG=0;
                  foreach($ELEMENT_QUERY as $ENAME1 => $ELEMENT_QUERY_ARR)
                  {
                    $ETITLE1=$ELEMENT_QUERY_ARR["TITLE"];
                    $ECLASS1=$ELEMENT_QUERY_ARR["CLASS"];
                    $ITEM_ID1=$ELEMENT_QUERY_ARR["ITEM_ID"];

                    if(date_or_user_or_more($ELEMENT_QUERY_ARR))
                      continue;

                    if($ETITLE1==$MY_ARRAY[$J])
                    {
                       $FIND_FLAG=1;
                       $ITEM_STR.="DATA_".$ITEM_ID1.",";
                       $ITEM_OBJ.='{"DATA_'.$ITEM_ID1.'":"'.$FIELD_ARRAY[$J].'"},';

                       //作为主键
                       if($DATA_TYPE=="1" && $QUERY_ARRAY[$J] == "1")
                          $KEY_ITEM_STR.='{"DATA_'.$ITEM_ID1.'":"'.$FIELD_ARRAY[$J].'"},';
                       break;
                    }
                  }
                  if($FIND_FLAG==0)
                     $ITEM_STR.=",";
                }
                if($ITEM_OBJ!="")
                    $ITEM_OBJ = "[".rtrim($ITEM_OBJ,",")."]";

                if($KEY_ITEM_STR!="")
                    $KEY_ITEM_STR = "[".rtrim($KEY_ITEM_STR,",")."]";
                $ELEMENT_OUT=str_ireplace("<$ETAG","<img src='".MYOA_STATIC_SERVER."/static/images/green_plus.gif' onclick='data_picker(this,\"$ITEM_STR\",\"ext_data\");return false;'",$ELEMENT_OUT);
                $ELEMENT_OUT=str_ireplace("$ETITLE</button>","</img>",$ELEMENT_OUT);
                $KEY_NAME = "DATA_" . $ITEM_ID . "_KEY";
                $ELEMENT_OUT .= "<input type=\"hidden\" name=\"$KEY_NAME\" value=\"".$$KEY_NAME."\">";
           }
           else {
                //$ELEMENT_OUT=str_ireplace("<$ETAG","<img src='".MYOA_STATIC_SERVER."/static/images/green_plus.gif' ",$ELEMENT_OUT);
                //$ELEMENT_OUT=str_ireplace("$ETITLE</button>","</img>",$ELEMENT_OUT);
                $ELEMENT_OUT = "";
           }
        }
        elseif($ECLASS=="FETCH")  //数据获取控件
        {
            if(!$READ_ONLY)//可写字段
            {
                $DATA_CONTROL=$ELEMENT_ARR["DATA_CONTROL"];

                $MY_ARRAY=explode("`",$DATA_CONTROL);
                $ARRAY_COUNT=sizeof($MY_ARRAY);
                if($MY_ARRAY[$ARRAY_COUNT-1]=="")
                    $ARRAY_COUNT--;

                $ITEM_STR="";
                for($J=0;$J< $ARRAY_COUNT;$J++)
                {
                    $FIND_FLAG=0;
                    foreach($ELEMENT_QUERY as $ENAME1 => $ELEMENT_QUERY_ARR)
                    {
                        $ETITLE1=$ELEMENT_QUERY_ARR["TITLE"];
                        $ECLASS1=$ELEMENT_QUERY_ARR["CLASS"];
                        $ITEM_ID1=$ELEMENT_QUERY_ARR["ITEM_ID"];

                        if(date_or_user_or_more($ELEMENT_QUERY_ARR))
                           continue;

                        if($ETITLE1==$MY_ARRAY[$J])
                        {
                             $FIND_FLAG=1;
                           $ITEM_STR.="DATA_".$ITEM_ID1.",";
                           break;
                        }
                    }

                    if($FIND_FLAG==0)
                        $ITEM_STR.=",";
                }

                $ELEMENT_OUT=str_replace("<$ETAG","<input type=\"text\" size=\"10\" id=\"$ENAME\" value=\""._("输入流水号...")."\" onclick=\"javascript:this.value='';\"><$ETAG type=\"button\" onclick=\"data_fetch(this,$('".$ENAME."').value,'".$ITEM_STR."');\"",$ELEMENT_OUT);
            }
        }
        elseif($ECLASS=="MOBILE_SEAL")
        {
            $ELEMENT_OUT = "";
        }
        //------------------------------------ 设置只读字段属性 ---------------------------------
        if($READ_ONLY)
        {
            //3.3之前版本所有签章存在同一个字段,故均可保存
            //if(!find_id($PRCS_ITEM_AUTO,$ETITLE)&&$ECLASS!="CALC"&&$ECLASS!="SIGN")
            //修改签章控件不可写的不保存 modify by lx 20090416
            if(!find_id($PRCS_ITEM_AUTO,$ETITLE) && $ECLASS!="CALC")
            {
                $READ_ONLY_STR.=$ITEM_ID.",";
            }

            //改变颜色和设置只读标记
            if($ETYPE == "checkbox"){
                if(strstr($ELEMENT_OUT," checked"))
                   $ELEMENT_OUT=str_replace("<$ETAG","<$ETAG readonly onclick=\"this.checked=1;\" class=\"BigStatic1\"",$ELEMENT_OUT);
                else
                   $ELEMENT_OUT=str_replace("<$ETAG","<$ETAG readonly onclick=\"this.checked=0;\" class=\"BigStatic1\"",$ELEMENT_OUT);
            }else if($ECLASS!="LIST_VIEW"&&$ECLASS!="SIGN"){
                $ELEMENT_OUT=str_replace("<$ETAG","<$ETAG readonly class=\"BigStatic1\" ",$ELEMENT_OUT);
            }

            //设置下拉菜单的数据为只读
            if($ETAG=="select")
            {
                if($ECLASS!="AUTO") //非宏控件
                {
                    $ELEMENT_OUT=substr($ELEMENT_OUT,0,stripos($ELEMENT_OUT,">")+1)."<option value=\"$ITEM_VALUE\">$ITEM_VALUE</option></select>";
                    if($CHILD)
                      $ELEMENT_OUT .= $ELEMENT_OUT_JS;
                }
                else //宏控件如为空时，项目也显示为空
                {
                    //单独要显示的
                    if($DATAFLD == "SYS_LIST_SQL")
                    {
                        $ELEMENT_OUT=substr($ELEMENT_OUT,0,stripos($ELEMENT_OUT,">")+1)."<option value=\"$ITEM_VALUE\">$ITEM_VALUE</option></select>";
                    }
                    elseif($DATAFLD == "SYS_LIST_PRIV")
                    {
                        if(is_numeric($ITEM_VALUE))
                        {
                            $query_priv = "select PRIV_NAME from USER_PRIV where USER_PRIV='$ITEM_VALUE'";
                            $cursor_priv = exequery(TD::conn(), $query_priv);
                            if($ROW_PRIV = mysql_fetch_array($cursor_priv))
                            {
                                if($ROW_PRIV['PRIV_NAME'])
                                {
                                    $ITEM_VALUE_TEXT = $ROW_PRIV['PRIV_NAME'];
                                    $ELEMENT_OUT=substr($ELEMENT_OUT,0,stripos($ELEMENT_OUT,">")+1)."<option value=\"$ITEM_VALUE\">$ITEM_VALUE_TEXT</option></select>";
                                    $ITEM_VALUE_TEXT = "";
                                }
                            }
                        }
                    }
                    else
                    {
                        if($ITEM_VALUE_TEXT)
                        {
                            $ITEM_VALUE_TEMP = $ITEM_VALUE_TEXT;
                        }
                        else
                        {
                            $ITEM_VALUE_TEMP = $ITEM_VALUE;
                        }
                        $ELEMENT_OUT=substr($ELEMENT_OUT,0,stripos($ELEMENT_OUT,">")+1)."<option value=\"$ITEM_VALUE\">$ITEM_VALUE_TEMP</option></select>";
                    }
                    $ITEM_VALUE_TEXT = "";
                }
            }
        }
        else //可输入项，突出输入颜色
        {
            if(($ETAG=="select"||$ETAG=="input"||($ETAG=="textarea" && !$RICH))&&$ECLASS!="AUTO" && $ECLASS!="FETCH" && !$DEBUG_MODE)
            {
                if($EDIT_MODE)
                {
                    $DBL_FUNC = "version_load";
                }
                else
                {
                    $DBL_FUNC = "quick_load";
                }
                $ELEMENT_OUT="<$ETAG class=\"".($ECLASS ? " ".$ECLASS : "")."\" ondblclick=\"".$DBL_FUNC."(this,'".$RUN_ID."','".$FLOW_ID."');\" onkeypress=\"check_send(this);\" ".str_replace("<$ETAG","",$ELEMENT_OUT);
            }
        }

		
        //------------------------------------ 整理输出 ---------------------------------

        //--- 宏控件单行输入框，允许刷新进行重新赋值
        if($ECLASS=="AUTO" && $ETAG=="input" && !$READ_ONLY)
        {
            $ELEMENT_OUT=str_replace("<$ETAG","<$ETAG onclick=\"auto_btn('ref_".$ITEM_ID."');\"",$ELEMENT_OUT);
            //$ELEMENT_OUT.="<input type=\"button\" id=\"ref_$ITEM_ID\" style=\"display:none;\" title=\""._("重新获取系统当前值")."\" value=\""._("刷新")."\" border=\"0\" onclick=\"document.form1.DATA_$ITEM_ID.value='$AUTO_VALUE';\">";
                $ELEMENT_OUT.="<input type=\"button\" id=\"ref_$ITEM_ID\" style=\"display:none;\" title=\""._("重新获取系统当前值")."\" value=\""._("刷新")."\" border=\"0\" onclick=\"refurbish('".$ITEM_ID."','".$AUTO_VALUE."','".$_SESSION["LOGIN_USER_NAME"]."');\">";
        }
        //-- 找到代换位置进行控件代换 --
        $PRINT_MODEL = str_replace('{'.$ENAME.'}',$ELEMENT_OUT,$PRINT_MODEL);
  }
  return $PRINT_MODEL;
}

//取得关联菜单向下的所有控件(递归)
function getSelectChild($ELEMENT_QUERY, $CHILD)
{
    foreach($ELEMENT_QUERY as $ENAME1 => $ELEMENT_QUERY_ARR)
    {
        $ETITLE1=$ELEMENT_QUERY_ARR["TITLE"];
        $ECLASS1=$ELEMENT_QUERY_ARR["CLASS"];
        $ITEM_ID1=$ELEMENT_QUERY_ARR["ITEM_ID"];
        $ETAG1=strtoupper($ELEMENT_QUERY_ARR["TAG"]);

        if(date_or_user_or_more($ELEMENT_QUERY_ARR))
            continue;

        if(find_id($CHILD,$ETITLE1) && $ETAG1=="SELECT")
        {
            $ITEM_STR .= "DATA_".$ITEM_ID1.",";echo $ITEM_STR . "<br />";
            if($ELEMENT_QUERY_ARR['CHILD'] != '')
            {
                getSelectChild($ELEMENT_QUERY, $ELEMENT_QUERY_ARR['CHILD']);
            }
        }

    }
    return $ITEM_STR;
}

//获取会签意见回复
function reply_sign($feed_id, $num="", $print="")
{
    $num = $num=="" ? 0 : $num;
    $num = $num + 20;
    $query = "SELECT * from FLOW_RUN_FEEDBACK where REPLY_ID='$feed_id'";
    $cursor= exequery(TD::conn(),$query);
    while($ROW = mysql_fetch_array($cursor))
    {
        $FEED_ID1=$ROW["FEED_ID"];
        $USER_ID=$ROW["USER_ID"];
        $CONTENT=$ROW["CONTENT"];
        $EDIT_TIME=$ROW["EDIT_TIME"];

        $USER_NAME = rtrim(GetUserNameById($USER_ID), ",");
        echo "<div style='padding-left:".$num."px'>";
        echo "<b>".$USER_NAME." " . $EDIT_TIME . _(" 回复：")."</b>";
        if($print == "")
        {
            if($USER_ID==$_SESSION["LOGIN_USER_ID"] && $PRCS_ID==$PRCS_ID1)
            {
                echo "<img src=\"".MYOA_STATIC_SERVER."/static/images/edit.gif\" style=\"cursor:pointer\" align=\"absmiddle\" alt=\""._("编辑意见")."\" onClick=\"edit_sign('".$FEED_ID1."');\">&nbsp;";
                echo "<img src=\"".MYOA_STATIC_SERVER."/static/images/delete.gif\" style=\"cursor:pointer\" align=\"absmiddle\" alt=\""._("删除意见")."\" onClick=\"delete_sign('".$FEED_ID1."');\">&nbsp;";
            }
            echo "<img src=\"".MYOA_STATIC_SERVER."/static/images/edit.gif\" style=\"cursor:pointer\" align=\"absmiddle\" alt=\""._("回复意见")."\" onClick=\"reply_sign('".$FEED_ID1."');\">";
        }
        echo "<br /><div class='content'>".convert_feedback_format($CONTENT)."</div>";
        echo "</div>";

        reply_sign($FEED_ID1, $num, $print);
    }
}
?>
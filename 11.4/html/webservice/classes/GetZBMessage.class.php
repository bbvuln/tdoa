<?php
include_once("inc/conn.php");
include_once("inc/utility.php");
include_once("inc/utility_cache.php");
define("HANDLER_CLASSPATH", MYOA_ROOT_PATH."inc/ESB/handlers/");

class GetZBMessage {
    
    /**
     * Format return string
     *
     * @param int $retCode
     * @return string
     */
    private function __retMsg($retCode) {
        switch($retCode) {
            case 0:
                $retDesc = _("成功");
                break;
            case -1:
                $retDesc = _("参数错误");
                break;
            case -2:
                $retDesc = _("成员单位不存在");
                break;
            case -3:
                $retDesc = _("GUID不存在");
                break;
            case -4:
                $retDesc = _("写入数据库失败");
                break;
        }
        
        $retMsg = '{"retCode":'.$retCode.',"retMsg":"'.$retDesc.'"}';
        return td_iconv($retMsg, MYOA_CHARSET, 'utf-8');
    }
    
    /**
     * 接收消息数组
     *
     *
     * @param string $UNIT_NAME
     * @return array
     */
    public function recvSms($UNIT_NAME) {
        
        if(empty($UNIT_NAME))
        {
            return $this->__retMsg(-1);
        }
        $UNIT_NAME=td_iconv($UNIT_NAME, 'utf-8', MYOA_CHARSET);
        $query="select MEMBER_ID from CONNECT_CONFIG where MEMBER_NAME='$UNIT_NAME'";
        
        $cursor= exequery(TD::conn(),$query);
        if($ROW=mysql_fetch_array($cursor))
        {
            $MEMBER_ID=$ROW["MEMBER_ID"];
        }
        if(empty($MEMBER_ID))
        {
            return $this->__retMsg(-2);
        }
        
        
        $TO_ID_STR="";
        $SMS_ARRAY = array();
        $SMS_INDEX=0;
        $query="SELECT SMS_ID,FROM_ID,TO_ID,SMS_TYPE,CONTENT,SEND_TIME,REMIND_URL from SMS,SMS_BODY where SMS.BODY_ID=SMS_BODY.BODY_ID and FROM_ID!='' and REMIND_FLAG='1' and DELETE_FLAG!='1' and TO_ID like '_$MEMBER_ID%' group by TO_ID";
        $cursor= exequery(TD::conn(),$query);
        while($ROW = mysql_fetch_array($cursor))
        {
            $SMS_ID=$ROW['SMS_ID'];
            $FROM_ID=$ROW['FROM_ID'];
            $FROM_NAME=GetUserInfoByUID(UserId2Uid($FROM_ID),"USER_NAME");
            $SMS_TYPE=$ROW['SMS_TYPE'];
            $CONTENT=$ROW['CONTENT'];
            $SEND_TIME=$ROW['SEND_TIME'];
            $REMIND_URL=$ROW['REMIND_URL'];
            $TO_ID_STR .= $ROW['TO_ID'].",";
            
            if(strstr($ROW['TO_ID'],"$MEMBER_ID"))
            {
                $pos=strlen('_'.$MEMBER_ID.'_');
                $FZ_USER=substr($ROW['TO_ID'],$pos);
                //$FZ_USER_STR.=$FZ_USER.",";
            }
            $SMS_ARRAY[$SMS_INDEX]["SMS_ID"]=$SMS_ID;
            $SMS_ARRAY[$SMS_INDEX]["FROM_NAME"]=td_iconv($FROM_NAME, MYOA_CHARSET, 'utf-8');
            $SMS_ARRAY[$SMS_INDEX]["SMS_TYPE"]=$SMS_TYPE;
            $SMS_ARRAY[$SMS_INDEX]["CONTENT"]=td_iconv($CONTENT, MYOA_CHARSET, 'utf-8');
            $SMS_ARRAY[$SMS_INDEX]["SEND_TIME"]=$SEND_TIME;
            $SMS_ARRAY[$SMS_INDEX]["REMIND_URL"]=$REMIND_URL;
            $SMS_ARRAY[$SMS_INDEX]["TO_ID"]=td_iconv($FZ_USER, MYOA_CHARSET, 'utf-8');
            
            $SMS_INDEX++;
        }
        
        return $SMS_ARRAY;
    }
    
    /**
     * 接收微讯数组
     *
     *
     * @param string $UNIT_NAME
     * @return array
     */
    public function recvMsg($UNIT_NAME) {
        
        if(empty($UNIT_NAME))
        {
            return $this->__retMsg(-1);
        }
        $UNIT_NAME=td_iconv($UNIT_NAME, 'utf-8', MYOA_CHARSET);
        $query="select MEMBER_ID from CONNECT_CONFIG where MEMBER_NAME='$UNIT_NAME'";
        
        $cursor= exequery(TD::conn(),$query);
        if($ROW=mysql_fetch_array($cursor))
        {
            $MEMBER_ID=$ROW["MEMBER_ID"];
        }
        if(empty($MEMBER_ID))
        {
            return $this->__retMsg(-2);
        }
        
        $TO_ID_STR="";
        $SMS_ARRAY = array();
        $SMS_INDEX=0;
        
        $CUR_TIME=time();
        
        $query="SELECT USER_ID from USER where USER_ID like '_$MEMBER_ID%'";
        $cursor= exequery(TD::conn(),$query);
        while($ROW = mysql_fetch_array($cursor))
        {
            $CUR_USER_ID=$ROW["USER_ID"];
            $CUR_UID=UserId2Uid($CUR_USER_ID);
            
            $query = "SELECT MSG_ID,FROM_UID,TO_UID,FROM_UNIXTIME(SEND_TIME) as SEND_TIME,MSG_TYPE,CONTENT from MESSAGE where TO_UID='$CUR_UID' and DELETE_FLAG!='1' and REMIND_FLAG!='0' and SEND_TIME<='$CUR_TIME' order by SEND_TIME desc ";
            $cursor= exequery(TD::conn(),$query);
            while($ROW = mysql_fetch_array($cursor))
            {
                $MSG_ID=$ROW['MSG_ID'];
                $FROM_UID =$ROW['FROM_UID'];
                $FROM_NAME=GetUserInfoByUID($FROM_UID,"USER_NAME");
                $SMS_TYPE=$ROW['SMS_TYPE'];
                $CONTENT=$ROW['CONTENT'];
                $SEND_TIME=$ROW['SEND_TIME'];
                $TO_ID_STR .= $CUR_USER_ID.",";
                
                if(strstr($CUR_USER_ID,"$MEMBER_ID"))
                {
                    $pos=strlen('_'.$MEMBER_ID.'_');
                    $FZ_USER=substr($CUR_USER_ID,$pos);
                    //$FZ_USER_STR.=$FZ_USER.",";
                }
                $SMS_ARRAY[$SMS_INDEX]["SMS_ID"]=$MSG_ID;
                $SMS_ARRAY[$SMS_INDEX]["FROM_NAME"]=td_iconv($FROM_NAME, MYOA_CHARSET, 'utf-8');
                $SMS_ARRAY[$SMS_INDEX]["SMS_TYPE"]=$SMS_TYPE;
                $SMS_ARRAY[$SMS_INDEX]["CONTENT"]=td_iconv($CONTENT, MYOA_CHARSET, 'utf-8');
                $SMS_ARRAY[$SMS_INDEX]["SEND_TIME"]=$SEND_TIME;
                $SMS_ARRAY[$SMS_INDEX]["REMIND_URL"]=$REMIND_URL;
                $SMS_ARRAY[$SMS_INDEX]["TO_ID"]=td_iconv($FZ_USER, MYOA_CHARSET, 'utf-8');
                
                $SMS_INDEX++;
            }//1用户
        }//全部
        return $SMS_ARRAY;
    }
    /**
     *
     * 修改提醒状态
     *
     * @param int $SMS_ID
     * @return string
     */
    public function updateSmsState($SMS_ID) {
        if(empty($SMS_ID))
        {
            return $this->__retMsg(-1);
        }
        
        $sql = "update SMS set REMIND_FLAG='0' where SMS_ID='$SMS_ID'";
        return exequery(TD::conn(), $sql);
        //return $this->__retMsg(0);
    }
    /**
     *
     * 修改微讯状态
     *]
     * @param int $MSG_ID
     * @return string
     */
    public function updateMsgState($MSG_ID) {
        if(empty($SMS_ID))
        {
            return $this->__retMsg(-1);
        }
        
        $sql = "update MESSAGE set REMIND_FLAG='0' where MSG_ID='$MSG_ID'";
        exequery(TD::conn(), $sql);
        //return $this->__retMsg(0);
    }
    
}

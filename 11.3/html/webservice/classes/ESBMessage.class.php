<?php
include_once("inc/conn.php");
include_once("inc/utility_all.php");
define("HANDLER_CLASSPATH", MYOA_ROOT_PATH."inc/ESB/handlers/");

class ESBMessage {
    
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
                $retDesc = _("数据包不存在");
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
     * receive a new Message
     *
     *
     * @param string $filePath
     * @param string $guid
     * @param string $fromId
     * @return string
     */
    public function recvMessage($filePath, $guid, $fromId ) {
        
        if(empty($fromId) || empty($guid) || empty($filePath))
        {
            return $this->__retMsg(-1);
        }
        
        if(!file_exists($filePath))
        {
            return $this->__retMsg(-2);
        }
        
        //get package summary info
        $zip = zip_open($filePath);
        if ($zip)
        {
            while ($zip_entry = zip_read($zip)) {
                $fileName = basename(zip_entry_name($zip_entry));
                if(strcasecmp($fileName, "data.xml") == 0)
                {
                    if(zip_entry_open($zip, $zip_entry, "r"))
                    {
                        $xml = zip_entry_read($zip_entry, zip_entry_filesize($zip_entry));
                        zip_entry_close($zip_entry);
                        
                        $dom = new DOMDocument();
                        $dom->loadXML($xml);
                        $module = $dom->getElementsByTagName("MODULE")->item(0)->nodeValue;
                        $title = $dom->getElementsByTagName("TITLE")->item(0)->nodeValue;
                        $title = td_iconv($title, 'utf-8', MYOA_CHARSET);
                        $summary = serialize(array("module" => $module, "title" => $title));
                        $recv_time = time();
                        //save recv data
                        $filePath = addslashes($filePath);
                        $sql = "insert into `ESB_MSG_RECV` (GUID,FROM_DEPT,PATH,RECV_TIME,SUMMARY) values ('$guid', '$fromId', '$filePath', '$recv_time', '$summary')";
                        exequery(TD::conn(), $sql);
                        if(!mysql_affected_rows())
                        {
                            return $this->__retMsg(-4);
                        }
                        break;
                    }
                }
            }
            zip_close($zip);
        }
        
        
        //call handler
        if(isset($module))
        {
            $moduleHandlerName = ucfirst($module)."Handler";
            if(file_exists(HANDLER_CLASSPATH.$moduleHandlerName.".php"))
            {
                include(HANDLER_CLASSPATH.$moduleHandlerName.".php");
                $handler = new ReflectionClass($moduleHandlerName);
                if ($handler->isInstantiable())
                {
                    $handlerInstance = $handler->newInstance($filePath, $fromId, $guid);
                    $handlerInstance->run();
                }
            }
        }
        
        return $this->__retMsg(0);
    }
    
    /**
     *
     * Update message state
     *
     * @param string $guid
     * @param int $state
     * @param string $to
     * @return string
     */
    public function updateState($guid, $state, $to="") {
        if(empty($guid) || !is_numeric($state))
        {
            return $this->__retMsg(-1);
        }
        
        if($to != "")
        {
            $sql = "select TO_DEPT,STATE from `ESB_MSG_SEND` where GUID = '$guid'";
            $cursur = exequery(TD::conn(), $sql);
            if($row = mysql_fetch_array($cursor))
            {
                $state_array = array();
                $to_dept = $row["TO_DEPT"];
                $state = $row["STATE"];
                
                if($state != "")
                {
                    $state_array = unserialize($state);
                }
                
                $state_array["$to"] = $state;
                if(!find_id($to_dept,$to)) {
                    $to_dept .= $to.",";
                }
                $state = serialize($state_array);
                
            }
        }
        
        $sql = "update `ESB_MSG_SEND` set STATE = '$state'";
        if($to_dept!="") {
            $sql .= ", TO_DEPT ='$to_dept'";
        }
        $sql .= " where GUID = '$guid'";
        exequery(TD::conn(), $sql);
        return $this->__retMsg(0);
    }
    
}

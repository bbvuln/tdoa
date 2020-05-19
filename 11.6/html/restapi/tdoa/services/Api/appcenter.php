<?
namespace tdoa\services\Api;
use \tdoa\services\Api;
use \Luracast\Restler\RestException;

//include_once ("inc/flow_engine/engine/TFlowEngine.php");
include_once("inc/conn.php");
include_once("inc/utility_all.php");
include_once("inc/utility_cache.php");
include_once("inc/utility_org.php");
include_once("inc/utility_file.php");
include_once("inc/utility_user.php");
include_once("inc/interface/td_function.php");
include_once("inc/td_core.php");
include_once("inc/check_type.php");
include_once("inc/utility_sms1.php");
include_once("inc/td_config.php");
include_once("inc/utility_file.php");
include_once('inc/package/DataTransfer.php');

class appcenter extends Api{
    
    /**
     * @url get /loginid 判断是否启用BPM引擎
     * @param $code 地址
     * @return string
     * @throws RestException
     */
    protected function getLoginID($code)
    {
        
        try{  
              $code_id = \TD::get_cache($code);
              \TD::delete_cache($code);
             return iconv('GB2312', 'UTF-8', $code_id);  
        }catch(\Exception $e) {
            throw new RestException(40, $e->getMessage());
        }
    }
    
    /**
     * @url get/sendmessage 插入消息
     * @param $exsId  第三方系统ID
     * @param $recipient  收件人
     * @param $content  消息标题 
     * @param $url  消息标题 
     * @return string
     * @throws RestException
     */
    protected function getSendMessage($exsId, $recipient, $content, $url)
    {
        
        try{ 
            $sendTime = time();
            $url = $this->get_url($url);
            $recipientUserId = $this->get_userId($exsId, $recipient);
            $remindUrl = "1:system/oauth_register/ask/link.php?url=$url&type=1&id=$exsId";
            send_sms($sendTime,"admin",$recipientUserId,'10_1',$content,$remindUrl,'');
        }catch(\Exception $e) {
            throw new RestException(40, $e->getMessage());
        }
    }
    
    /**
     * @url get/affairprocessing 事务办理
     * @param $exsId 第三方系统id
     * @param $status 事务状态 (1代办 2已办)
     * @param $sender 发送人 (第三方系统用户名)
     * @param $recipient 收件人 (第三方系统登录账号)
     * @param $content 办理内容标题 (第三方系统登录账号)
     * @param $url 处理事务地址 
     * @return string
     * @throws RestException
     */
    protected function getAffairProcessing($exsId, $status, $sender, $recipient, $content, $url)
    {  
        
        try{      
             //$url = $this->get_url($url);
              $remindUrl = "1:system/oauth_register/ask/link.php?url=$url&type=1&id=$exsId";
              $senderUserId = $this->get_userId($exsId, $sender);
              $sendTime = time();
              $content = json_decode(stripslashes($content),true);
              $content = iconv("UTF-8", "GB2312//IGNORE", $content);
              $MY_ARRAY=explode(",",rtrim($recipient,','));
              foreach($MY_ARRAY as $k=>$v){
                  $recipientUserId = $this->get_userId($exsId, $v);
                  if(!empty($recipientUserId))
                  {   
                      //添加对url的过滤
                       $urls = base64_decode($url);
                        //按照OA内部规则修改url
                        if(substr($urls,0,2)=="1:")
                        {
                            $urls=substr($urls,2);
                            $OPEN_WINDOW=1;
                        }
                            
                        if($urls=="")
                        {
                            $urls=sms_type_url($SMS_TYPE,$CONTENT); 
                        }
                        else
                        {
                            if(substr($urls,2) == "t:")
                                $urls="/t9apps/".substr($urls,2);
                            else
                                 $urls="/general/".$urls;
                        }
                      
                      $urls = substr($urls,0,strrpos($urls, "/"));
                      $query = "select * from oauth_clients where pid ='$exsId'";
                      $cursor1 = exequery(\TD::conn(), $query);
                      while($ROW=mysql_fetch_array($cursor1))
                      { 
                            $client_uri = $ROW['client_uri'];//应用
                            $client_uri = substr($client_uri,0,strrpos($client_uri, "/"));
                            if(strstr($urls,$client_uri)){ //判断该应用是否创建
                                 $query = "insert into oauth_message(message,user_id,open_user_id,open_send_user_id ,url,state ,oauth_clients_id,add_time) values('$content','$recipientUserId','$recipient','$sender','$remindUrl','$status','$exsId','$sendTime')";
                                 if(\TD::DB()->prepareExec($query,[]))
                                 {
                                     send_sms($sendTime,$senderUserId,$recipientUserId,'10_2',$content,$remindUrl,'');
                                 }
                            }       
                      }
                     
                  }
              }      
        }catch(\Exception $e) {
            throw new RestException(40, $e->getMessage());
        }
    }
	
	/**
     * @url post/accepteddata 接受数据
	 * @param $data
	 * @return string
     * @throws RestException
     */
	protected function postAcceptedData($data)
    {
        try
        {   
		    $id = $data['id'];
			$order_id = $data['order_id'];
			$send = $data['send'];
			$receive = $data['receive'];
      		$title = $data['title'];
			$modular = $data['modular'];
			$organizeData = $data['organizeData'];
			$state = '1';
		   // $sql = "insert into file_transfer_receive(id,order_id,send_system_id,receive_system_id,title,data,state) VALUES ('$id','$order_id','$send','$receive','$title','$organizeData','$state')";  
		    if(!isset($data['flag'])){
				$sql = "insert into file_transfer_receive(id,order_id,send_system_id,receive_system_id,title,data,state) VALUES ('".$id."','".$order_id."','".$send."','".$receive."','".$title."','".$organizeData."','".$state."')";  
			 
				\TD::DB()->prepareExec($sql,[]);
		    }
		   
		     //进行B系统的数据处理
			$handleData =array(
				'id'=>$id,
				'order_id'=>$order_id,
				'send'=>$receive,
				'receive'=>$send,
				'modular'=>$modular
			);
			
			include_once('inc/package/order.php');
			
			$order = new \Order();
			$order ->acceptOrder($handleData);   
  
        }catch (\Exception $e) {
            throw new RestException(56, $e->getMessage());
        }
    }
	
    /**
     * @url post/backdata 返回数据
	 * @param $data 
	 * @return string
     * @throws RestException
     */
	protected function postBackData($backData)
    {  
		
		try
        {
			$dataAnalysis = json_decode(stripslashes($backData['dataAnalysis']),true);            
            if($dataAnalysis['flag']){
                 $query = "update file_transfer_order SET state = '1' ,dataInfo = '成功' where id = ".$backData['id'];
             }else{
                  $dataInfo = iconv('UTF-8', 'GBK', $dataAnalysis['dataInfo']);
                  $query = "update file_transfer_order SET state = '0' ,dataInfo = '".$dataInfo."' where id = ".$backData['id'];
            
             }
             \TD::DB()->prepareExec($query,[]);
			 $modular = $backData['modular'];
			 
			include_once('inc/package/order.php');
			$order = new \Order();
			$order ->postBackData($modular,$backData);   
	        // include_once("inc/package/business/".$modular."BusinessProcessing.php");
			// $BusinessProcess = $modular."BusinessProcessing";
			// $BusinessProcessing = new \$BusinessProcess();
			// $organizeData  = $BusinessProcessing->backDataAnalysis($data['dataAnalysis']);

        }catch (\Exception $e) {
            throw new RestException(56, $e->getMessage());
        }
    }

    /**
     * @url get/UpdateStatus 更新状态
	 * @param $id 
	 * @param $status
	 * @return string
     * @throws RestException
     */
	protected function getUpdateStatus($id,$status)
    {  
		
		try
        {
			 $query = "update file_transfer_order SET state = '".$status."'where id = $id";
             \TD::DB()->prepareExec($query,[]);
			
        }catch (\Exception $e) {
            throw new RestException(56, $e->getMessage());
        }
    }
	
	
     /**
     * @url post /uploadattachment 附件上传
     * @param $foo 
     * @param $upload 上传文件参数
     * @param $exsId 
     * @return array  
     * @throws RestException
     */
    protected function postUploadAttachment($foo, $upload, $exsId)
    {
        try
        {   
            $new_name = isset($_FILES["upload"]) ? "upload" : "file";
            $uploadAll = upload($new_name,'enterprise_platform',true); 
            $uploadAll['NAME'] = iconv('GB2312', 'UTF-8', $uploadAll['NAME']);
            return  $uploadAll;
        }catch (\Exception $e) {
            throw new RestException(56, $e->getMessage());
        }
    }
    
	/**
     * @url get/down 下载附件
	 * @param $ATTACH_ID
	 * @param $ATTACHMENT_NAME
	 * @return string
     * @throws RestException
     */
	protected function getDownAttachments($ATTACHMENT_ID,$ATTACHMENT_NAME)
    {   
	
        try
        {   
		    $ARRAY = attach_id_explode($ATTACHMENT_ID);
		    $ATTACH_ID  = $ARRAY['ATTACHMENT_ID'];
			
			$arrs = \TD::DB()->prepareQuery("select * from ATTACHMENT where ATTACH_ID='$ATTACH_ID'");
			//\TD::log($arrs,'spz');
            if($arrs)
            {
                $AID  = $arrs[0]["AID"];
                $YM   = $arrs[0]["YM"];
				$MODULE = $arrs[0]["MODULE"];
              
            }
			$ATTACH_PARA_ARRAY = \TD::get_cache('SYS_ATTACH_PARA');
            $ATTACH_MODULE_ARRAY = $ATTACH_PARA_ARRAY['SYS_ATTACH_MODULE'];
			$MODULE = array_search($MODULE, (array)$ATTACH_MODULE_ARRAY);
		
		    
		
    if($portal_id > 0)
    {
        $MODULE = 'portal';
    }

    $AID = intval($AID);
    $ATTACHMENT_NAME_SHOW = is_default_charset($ATTACHMENT_NAME) ? $ATTACHMENT_NAME : iconv('utf-8', MYOA_CHARSET, $ATTACHMENT_NAME);

    //指向影子文件
    if(isset($SAFE_DOC) && $SAFE_DOC =='1')
    {
        $EXT_NAME = strtolower(substr($ATTACHMENT_NAME_SHOW,strrpos($ATTACHMENT_NAME_SHOW,".")));
        $ATTACHMENT_NAME_SHOW = str_replace($EXT_NAME,".aip",$ATTACHMENT_NAME_SHOW);
    }

    if(stristr($MODULE,"/") || stristr($MODULE,"\\") || stristr($YM,"/") || stristr($YM,"\\")
        || stristr($ATTACHMENT_ID,"/") || stristr($ATTACHMENT_ID,"\\") || stristr($ATTACHMENT_NAME,"/") || stristr($ATTACHMENT_NAME,"\\"))
    {
        Message(_("错误"),_("参数含有非法字符。"));
        exit;
    }

    
    $ATTACHMENT_ID_LONG = attach_id_implode($AID, $YM, $ATTACH_ID);
    $FILE_PATH = attach_real_path($ATTACHMENT_ID_LONG, $ATTACHMENT_NAME, $MODULE);
    $file_show = "*".$ATTACHMENT_ID_LONG.".".$ATTACHMENT_NAME;

    //指向影子文件
    if(isset($SAFE_DOC) && $SAFE_DOC =='1')
    {
        $EXT_NAME  = strtolower(substr($FILE_PATH,strrpos($FILE_PATH,".")));
        $FILE_PATH = str_replace($EXT_NAME,".aip",$FILE_PATH);
    }

    if($THUMB == "1")
    {
        $FILE_PATH = substr($FILE_PATH, 0, strlen($FILE_PATH)-strlen($ATTACHMENT_NAME))."thumb_".$ATTACHMENT_NAME;
        if(!file_exists($FILE_PATH))
        {
           $TIPS = _("缩略图文件[%s]不存在");
           $TIPS = sprintf($TIPS, td_htmlspecialchars($ATTACHMENT_NAME_SHOW));
           Message(_("错误"), $TIPS);
           exit;
        }
    }
    else if($FILE_PATH === FALSE)
    {
       $TIPS = _("文件[%s]不存在");
       $TIPS = sprintf($TIPS, td_htmlspecialchars($ATTACHMENT_NAME_SHOW));
       Message(_("错误"), $TIPS);
       exit;
    }

    if(is_ntko_office($ATTACHMENT_NAME))
        oc_log($ATTACHMENT_ID_LONG, $ATTACHMENT_NAME, 3);

    $FILE_EXT=strtolower(substr($ATTACHMENT_NAME,strrpos($ATTACHMENT_NAME,".")));
    
    //指向影子文件
    if(isset($SAFE_DOC) && $SAFE_DOC =='1')
    {
        $FILE_EXT = "aip";
    }

    //如果是被Office 2003编辑过的Office 2007文档，下载时后缀名改回2003类型
    if($FILE_EXT == ".docx" || $FILE_EXT == ".xlsx" || $FILE_EXT == ".pptx" || $FILE_EXT == ".ppsx")
    {
        $handle = td_fopen($FILE_PATH, "rb");
        if(!$handle)
        {
            echo _("打开文件错误");
            Button_Back();
            exit;
        }

        $FILE_HEAD = bin2hex(fread($handle, 8));
        fclose($handle);

        if($FILE_HEAD == "d0cf11e0a1b11ae1")
        {
            $FILE_EXT = substr($FILE_EXT, 0, -1);
            $ATTACHMENT_NAME = substr($ATTACHMENT_NAME, 0, -1);
        }
    }

    if($DIRECT_VIEW)
    {
        switch($FILE_EXT)
        {
            case ".jpg":
            case ".jpeg":
                $COTENT_TYPE=0;
                $COTENT_TYPE_DESC="image/jpeg";
                $img_info = td_getimagesize($FILE_PATH);
                if( $img_info["channels"] == 4 &&
                    (stripos($_SERVER['HTTP_USER_AGENT'],"MSIE 6.0") > 0
                        || stripos($_SERVER['HTTP_USER_AGENT'],"MSIE 7.0") > 0
                        || stripos($_SERVER['HTTP_USER_AGENT'],"MSIE 8.0") > 0
                    )
                )
                {
                    Message(_("错误"), _("此图片为CMYK色彩模式，您当前浏览器不支持此格式图片显示，请转换为RGB模式。"));
                    Button_Back();
                    exit;
                }
                break;
            case ".bmp":
                $COTENT_TYPE=0;
                $COTENT_TYPE_DESC="image/bmp";
                break;
            case ".gif":
                $COTENT_TYPE=0;
                $COTENT_TYPE_DESC="image/gif";
                break;
            case ".png":
                $COTENT_TYPE=0;
                $COTENT_TYPE_DESC="image/png";
                break;
            case ".html":
            case ".htm":
                $COTENT_TYPE=0;
                $COTENT_TYPE_DESC="text/html";
                break;
            case ".pdf":
                $COTENT_TYPE=0;
                $COTENT_TYPE_DESC="application/pdf";
                break;
            case ".swf":
                $COTENT_TYPE=0;
                $COTENT_TYPE_DESC="application/x-shockwave-flash";
                break;
            case ".aip":
                $COTENT_TYPE=0;
                $COTENT_TYPE_DESC="application/octet-stream";
                break;
            case ".mp4":
            case ".mp4v":
            case ".mpg4":
                $COTENT_TYPE=0;
                $COTENT_TYPE_DESC="video/mp4";
                break;
            case ".flv":
                $COTENT_TYPE=0;
                $COTENT_TYPE_DESC="video/x-flv";
                break;
            case ".mpg":
            case ".mpeg":
            case ".mpe":
                $COTENT_TYPE=0;
                $COTENT_TYPE_DESC="video/mpeg";
                break;
            case ".avi":
                $COTENT_TYPE=0;
                $COTENT_TYPE_DESC="video/x-msvideo";
                break;
            case ".asf":
            case ".asx":
                $COTENT_TYPE=0;
                $COTENT_TYPE_DESC="video/x-ms-asf";
                break;
            case ".mov":
            case ".qt":
                $COTENT_TYPE=0;
                $COTENT_TYPE_DESC="video/quicktime";
                break;
            case ".rm":
            case ".rmvb":
                $COTENT_TYPE=0;
                $COTENT_TYPE_DESC="application/vnd.rn-realmedia";
                break;
            case ".wmv":
                $COTENT_TYPE=0;
                $COTENT_TYPE_DESC="video/x-ms-wmv";
                break;
            case ".wav":
            case ".mid":
            case ".mht":
                $COTENT_TYPE=0;
                $COTENT_TYPE_DESC="application/octet-stream";
                break;
            default:
                if(is_text($FILE_EXT))
                {
                    $COTENT_TYPE=0;
                    $COTENT_TYPE_DESC="text/plain";
                }
                else
                {
                    $COTENT_TYPE=1;
                    $COTENT_TYPE_DESC="application/octet-stream";
                    break;
                }
        }
    }
    else
    {
        switch($FILE_EXT)
        {
            case ".doc":
            case ".dot":
                $COTENT_TYPE=MYOA_ATTACH_OFFICE_OPEN_IN_IE ? 0 : 1;
                $COTENT_TYPE_DESC=MYOA_ATTACH_OFFICE_OPEN_IN_IE ? "application/msword" : "application/octet-stream";
                break;
            case ".xls":
            case ".xlc":
            case ".xll":
            case ".xlm":
            case ".xlw":
            case ".csv":
                $COTENT_TYPE=MYOA_ATTACH_OFFICE_OPEN_IN_IE ? 0 : 1;
                $COTENT_TYPE_DESC=MYOA_ATTACH_OFFICE_OPEN_IN_IE ? "application/msexcel" : "application/octet-stream";
                break;
            case ".ppt":
            case ".pot":
            case ".pps":
            case ".ppz":
                $COTENT_TYPE=MYOA_ATTACH_OFFICE_OPEN_IN_IE ? 0 : 1;
                $COTENT_TYPE_DESC=MYOA_ATTACH_OFFICE_OPEN_IN_IE ? "application/mspowerpoint" : "application/octet-stream";
                break;
            case ".docx":
            case ".dotx":
            case ".xlsx":
            case ".xltx":
            case ".pptx":
            case ".potx":
            case ".ppsx":
                $COTENT_TYPE=MYOA_ATTACH_OFFICE_OPEN_IN_IE ? 0 : 1;
                $COTENT_TYPE_DESC=MYOA_ATTACH_OFFICE_OPEN_IN_IE ? "application/vnd.openxmlformats" : "application/octet-stream";
                break;
            default:
                $COTENT_TYPE=1;
                $COTENT_TYPE_DESC="application/octet-stream";
                break;
        }
    }
    $ATTACHMENT_NAME_SHOWS = (mb_detect_encoding($ATTACHMENT_NAME_SHOW,"UTF-8, gbk")==MYOA_CHARSET || (mb_detect_encoding($ATTACHMENT_NAME_SHOW,"UTF-8,gbk")!="UTF-8" && MYOA_CHARSET=="gbk")) ? $ATTACHMENT_NAME_SHOW : iconv('utf-8', MYOA_CHARSET, $ATTACHMENT_NAME_SHOW);

    if($ATTACHMENT_NAME_SHOWS=="")
    {
        $ATTACHMENT_NAME_SHOWS = $ATTACHMENT_NAME_SHOW;
    }

    ob_end_clean();
    td_download($FILE_PATH, $ATTACHMENT_NAME_SHOWS, $COTENT_TYPE, $COTENT_TYPE_DESC); 
		   
		
		 /*  file_put_contents('D:/22aa.txt', dirname(__FILE__));
            ob_end_clean();   //下载的代码
            include_once ('inc/utility_file.php');
     
			$FILE_PATH = 'D:/spz.txt';
			$ATTACHMENT_NAME_SHOWS = 'shi123.txt';
			$COTENT_TYPE = '1';
			$COTENT_TYPE_DESC = 'application/octet-stream';

			td_download($FILE_PATH,$ATTACHMENT_NAME_SHOWS, $COTENT_TYPE, $COTENT_TYPE_DESC);  */
			
			return true;

        }catch (\Exception $e) {
            throw new RestException(56, $e->getMessage());
        }
    }
	


	

	/**
     * @url get/del 删除数据包
	 * @param $filePath 
	 * @return string
     * @throws RestException
     */
	protected function getDel($filePath)
    {  
		
		try
        {   
            file_put_contents('D:/2.txt','12312321');
             return unlink($filePath);
        }catch (\Exception $e) {
            throw new RestException(56, $e->getMessage());
        }
    }
	
    protected function get_url($url)
    {
        $url = base64_encode($url);
        return $url;
    }
    
    protected function get_userId($exsId, $recipient)
    {
        $arrs = \TD::DB()->prepareQuery("select user_id from oauth_user_line where open_user_id = '$recipient' AND oauth_clients_new_id = '$exsId'");
        if($arrs)
        {
            return $arrs[0]['user_id'];
            exit;
        }
    }
    
}
?>
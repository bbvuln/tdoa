<?
include_once ("tdoauth.class.php");                             //引入tdoauth.class.php

$exsId = '1';                                                //第三方系统ID
$recipient = 'admin';                                        //接收人ID
$content = '企业平台管理标题测试';                           //消息标题
$url='http://192.168.0.1/general/news/manage/index1.php';    //消息跳转路径
$tdOauth->sendMessage($exsId, $recipient, $content, $url);   //发送事务提醒接口
echo ok;
exit;

// $exsId = '1';                                                //第三方系统ID
// $status = '1';                                               //状态 1代办事务 2已办事务
// $sender = 'lijia';                                           //发送人ID
// $recipient = 'admin';                                        //接收人ID
// $content = '请假申请';                                       //事务标题
// $url='http://192.168.0.1/general/news/manage/index1.php';    //事务跳转路径
// $tdOauth->affairProcessing($exsId, $status, $sender, $recipient, $content, $url);    //统一工作代码接口
// echo ok;
// exit;

// $exsId = '1';                                                      //第三方系统ID
// $filePath = 'C:\Users\aas31\Desktop\2016版产品使用手册.docx';      //上传附件的绝对路径
// $A = $tdOauth->upload($exsId, $filePath);                          //上传附件接口 
// print_r($A);                                                       //返回附件ID和NAME

//移动端单点登陆：在系统管理->菜单设置，中找到已配置成功的单点登陆菜单。点击编辑按钮进入编辑页面，将【子菜单模块路径】下的路径复制出来加上【http://域名/general/】
?>
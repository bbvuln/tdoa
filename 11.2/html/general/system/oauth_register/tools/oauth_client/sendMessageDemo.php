<?
include_once ("tdoauth.class.php");                             //����tdoauth.class.php

$exsId = '1';                                                //������ϵͳID
$recipient = 'admin';                                        //������ID
$content = '��ҵƽ̨����������';                           //��Ϣ����
$url='http://192.168.0.1/general/news/manage/index1.php';    //��Ϣ��ת·��
$tdOauth->sendMessage($exsId, $recipient, $content, $url);   //�����������ѽӿ�
echo ok;
exit;

// $exsId = '1';                                                //������ϵͳID
// $status = '1';                                               //״̬ 1�������� 2�Ѱ�����
// $sender = 'lijia';                                           //������ID
// $recipient = 'admin';                                        //������ID
// $content = '�������';                                       //�������
// $url='http://192.168.0.1/general/news/manage/index1.php';    //������ת·��
// $tdOauth->affairProcessing($exsId, $status, $sender, $recipient, $content, $url);    //ͳһ��������ӿ�
// echo ok;
// exit;

// $exsId = '1';                                                      //������ϵͳID
// $filePath = 'C:\Users\aas31\Desktop\2016���Ʒʹ���ֲ�.docx';      //�ϴ������ľ���·��
// $A = $tdOauth->upload($exsId, $filePath);                          //�ϴ������ӿ� 
// print_r($A);                                                       //���ظ���ID��NAME

//�ƶ��˵����½����ϵͳ����->�˵����ã����ҵ������óɹ��ĵ����½�˵�������༭��ť����༭ҳ�棬�����Ӳ˵�ģ��·�����µ�·�����Ƴ������ϡ�http://����/general/��
?>
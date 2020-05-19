<?php
set_time_limit(0);
/**
*
*@desc  ����zipѹ���ļ��ĺ���
*������Ϊ yukon12345��д�����°汾���http://hi.baidu.com/yukon_kanzaki/blog/item/d230b98ffd246af4f11f361d.html
*@param $dirs         array ͼƬԴ·������
*@param $file_path     string word�ĵ�������·������Ҫ����׺��
*@param $doc_content  string word�ĵ�����
�������������һ�� ����Ϊ this is my file �� info.ini  ������������ array(array('info.ini','this is my file'));
*/
class Ydoc {
	//������ͼƬԴ��ַ��word�ļ�����word�ĵ�����
	var $tmp_name;
	var $filename;
	var $filename_gbk;
	var $tmp_path;
	private $_outputType = 'word';
	private $_charset;
	function __construct(){
		$this->_charset = MYOA_CHARSET; 
	}
	public function create_doc($file_path, $doc_content, $dirs="") {
		//doc�ĵ����
		$this->filename=basename($file_path);
		$this->filename_gbk=$this->is_utf8($this->filename) ? td_iconv($this->filename,"utf-8", MYOA_CHARSET) : $this->filename;
		$doc_code =<<<o
<?
include_once("inc/auth.inc.php");
include_once("inc/header.inc.php");
?>

<body>
$doc_content
</body>
</html>
o;
		$this->filename = str_replace('\\', '/', $this->filename);
		if(!empty($dirs) && is_array($dirs)){
			$this->_outputType = 'zip';
			//��string��ʽ������ļ�
			$addfromString = array (
				array (
					$this->filename_gbk . ".doc",
					$doc_code
				)
			);
			//�ӷ�����������ļ���·������
			$files = array ();
			foreach ($dirs as $dir) {
				if (!is_dir($dir)) {
					if (file_exists($dir)) {
						$files[] = $dir;
						continue;
					}else if(file_exists( $_SERVER['DOCUMENT_ROOT'] . $dir)){
						$dir = str_replace('\\', '/', $_SERVER['DOCUMENT_ROOT']) . $dir;
						$files[] = $dir;
						continue;
					} else {
						continue;
					}
				}
	
				$dir = str_replace('\\', '/', $dir);

				$this->getfiles($this->dir, $files);
				if (empty ($files)) {
					continue;
				}
			}
	
			$zip = new ZipArchive;
			$tmp_name=md5($this->filename.mktime().microtime()).".zip";
			$this->tmp_path=dirname($file_path)."/".$tmp_name;
			$res = $zip->open( $this->tmp_path, ZipArchive::CREATE|ZIPARCHIVE::OVERWRITE);
			if ($res === TRUE) {
				foreach ($files as $v) {
					//addFile ��ʵ·���ʹ������
					$zip->addFile($v, $this->filename_gbk . ".files/" . basename($v));
	
				}
				if (!empty ($addfromString)) {
					foreach ($addfromString as $v) {
						$zip->addFromString($v[0], $v[1]);
					}
				}
				$zip->close();
			} else {
				echo 'failed';
			}
		}else {
			$tmp_name=md5($this->filename.mktime().microtime()).".doc";
			$this->tmp_path=dirname($file_path)."/".$tmp_name;
			
			include_once("inc/utility_file.php");
			$fp=td_fopen($this->tmp_path,"wb");
			fwrite($fp,$doc_code);
			fclose($fp);
		}
	}

	public function getfiles($dir, & $files = array ()) {
		//�ж�·��
		if (!file_exists($dir) || !is_dir($dir)) {
			return;
		}
		//ȥ�����һ��/
		if (substr($dir, -1) == '/') {
			$dir = substr($dir, 0, strlen($dir) - 1);
		}
		$_files = scandir($dir);
		foreach ($_files as $v) {
			if ($v != '.' && $v != '..') {
				if (is_dir($dir . '/' . $v)) {
					$this->getfiles($dir . '/' . $v, $files);
				} else {
					$files[] = $dir . '/' . $v;
				}
			}
		}
		return $files;
	}
	
	function download(){
		header("Cache-control: private");
		header("Accept-Ranges: bytes");
		header("Accept-Length: ".sprintf("%u", filesize($this->tmp_path)));
		if($this->_outputType == 'word'){
			header("Content-type: application/msword");
			header("Content-Disposition: attachment; ".get_attachment_filename($this->filename.".doc"));
		}else if($this->_outputType == 'zip'){
			header("Content-type: application/x-zip");
			header( 'Content-Disposition: attachment; '.get_attachment_filename($this->filename.".zip"));
		}
			
		readfile($this->tmp_path);
		unlink($this->tmp_path);
	}
	
	static function is_utf8($str){
		if($str == mb_detect_encoding(mb_detect_encoding($str,'GBK','UTF-8'),'UTF-8','GBK')){
			return true;
		}
	}
} //doc

?>
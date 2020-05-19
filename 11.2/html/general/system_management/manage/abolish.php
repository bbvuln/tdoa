<?
include_once("inc/auth.inc.php");
include_once("inc/conn.php");
//批量删除数据
	if($type==delall){
		$departarr=$_POST[departarr];
		foreach($departarr as $id=>$val){
		 $sql3="delete from system_management where id=$val";
		 $query3=exequery(TD::conn(),$sql3);
	    }
	    if($query3){
			echo "success";
		}else{
			echo "error";
	    }			
	}
//批量废止
if($type==abolish){
		$departarr=$_POST[departarr];
		$time_now=date('Y-m-d H:i:s');
		foreach($departarr as $id=>$val){
		 $sql4="update system_management set status=0,cancel_time='$time_now' where id=$val";
		 $query4=exequery(TD::conn(),$sql4);
	    }
	    if($query4){
			echo "success";
		}else{
			echo "error";
	    }			
	}
?>
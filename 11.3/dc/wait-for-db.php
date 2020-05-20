<?php
header('Content-Type: text/html; charset=utf-8');
// 检查数据库载入
$dbs = chkdb();
if($dbs === true){
    ok();
}else{
    chk_timeout();
    $html = "Loading data（载入数据中）...<br>\n";
    foreach($dbs as $name => $status){
        if($status)
            $html .= "{$name}: done<br/>\n";
        else
            $html .= "{$name}: pending...<br/>\n";
    }
    output($html);
}
function chkdb(){
    $host = 'tdmysql';
    $user = 'root';
    $pwd = 'toor';
    $dbs = array('td_oa'=>0, 'td_app'=>0, 'bus'=>0);             
    $link = mysql_connect($host, $user, $pwd);
    if (!$link) {
        output('Waiting for db (数据库启动中)...');
    }
    $res = mysql_query("show databases", $link);
    while($row = mysql_fetch_row($res)) {
        $db = strtolower(trim($row[0]));
        if(isset($dbs[$db])){
            $dbs[$db] = 1;
        }
    }
    mysql_close($link);
    return (implode('',$dbs)=='111')?true:$dbs;
}

function output($html){
    echo '<html><head><meta http-equiv="refresh" content="20"><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><title>Loading Data...</title></head><body>'.$html.'</body></html>';
    exit;
}

// 载入完成，替换为原来的 index.php
function ok(){
    $replace = 'index.php.bak';
    if(!file_exists($replace)){
        die("Error: {$replace} not found");
    }
    unlink('index.php');
    rename($replace, 'index.php');
    header('location: ./');
    exit;
}

// 判断数据库载入是否超时
function chk_timeout(){
    $timeout = 120; 
    $init_file = '/tmp/init_time.log';
    if(!file_exists($init_file)){
        file_put_contents($init_file, time());
    }
    $init_time = file_get_contents($init_file);
    if(time() - $init_time > $timeout){
        die('Error: Load data timeout.');
    }
}   

<?
//-- 附件路径配置(手动设置) --
//$ATTACH_PATH="/myoa/attachment/";
//$ATTACH_PATH2="/myoa/attach/";

//-- 附件备份路径 --
$ATTACH_BACKUP_PATH = $ATTACH_PATH2."bak/";

//-- 系统缓存目录 --
$MYOA_CACHE_PATH = $ATTACH_PATH2."cache/";

//-- 系统回收站目录 --
$MYOA_RECYCLE_PATH = $ATTACH_PATH2."recycle/";

//-- 短信刷新时间，单位秒 --
$SMS_REF_SEC=30;

//-- 在线状态刷新时间，单位秒 --
$ONLINE_REF_SEC=120;

//-- 在线编辑Office文档锁定间隔时间，单位秒 --
$ATTACH_LOCK_REF_SEC=180;

//-- 空闲强制自动离线时间，单位分钟，0为不限制 --
$OFFLINE_TIME_MIN=0;

//-- 状态栏自动刷新时间，单位秒 --
$STATUS_REF_SEC=3600;

//-- 短信最多声音提醒次数，0为不限制 --
$SMS_REF_MAX=3;

//-- 短信声音提醒间隔，单位分钟 --
$SMS_CALLSOUND_INTERVAL=3;

//-- 工作流催办监控周期,可能会产生大量内部提醒短信，0表示关闭此功能。单位分钟--
$FLOW_REMIND_TIME=0;

//-- 上传附件类型限制 --
$UPLOAD_LIMIT = 1;        //0 不限制；1 不允许上传下边定义的后缀名的附件；2 只允许上传下边定义的后缀名的附件
$UPLOAD_LIMIT_TYPE="php,php3,php4,php5,";

//-- 网络硬盘不允许编辑的文本文件类型 --
$EDIT_LIMIT_TYPE="php,php3,php4,php5,phpt,inc,jsp,asp,aspx,js,cgi,pl,";

//-- 第1-2套界面主题是否使用按钮的样式效果 --
$CORRECT_BUTTON = 1;//参数1改为0表示使用普通效果

//-- 是否允许多人用同一帐号同时登录 --
$ONE_USER_MUL_LOGIN = 1;       //1 允许; 0 禁止;

//-- 是否附件名采用UTF-8编码 --
$ATTACH_UTF8=0;

//-- 设置为 1，Office文档下载时点“打开”按钮时，在浏览器中打开，关闭时会提示保存。
//-- 设置为 0，则调用本地Office打开，关闭时可能不会提示保存 --
$ATTACH_OFFICE_OPEN_IN_IE=0;

//-- 短信延时提醒间隔条数，每60条短信延时60秒提醒
$SMS_DELAY_PER_ROWS = 60;
//-- 短信延时提醒间隔时间，单位秒
$SMS_DELAY_SECONDS = 60;

//-- 允许登录系统的时间段 -- 多个时间段用英文逗号隔开，一个时间段的两个时间点用波浪号(~)隔开
$MYOA_LOGIN_TIME_RANGE = "00:00:00 ~ 23:59:59";

//-- 允许玩附件程序下的游戏的时间段 -- 多个时间段用英文逗号隔开，一个时间段的两个时间点用波浪号(~)隔开
$MYOA_GAME_TIME_RANGE = "00:00:00 ~ 23:59:59";

//-- 是否启用公共文件柜和网络硬盘附件删除的回收站功能，1为启用，0为不启用；
//-- 启用后，公共文件柜和网络硬盘中被删除的附件将在attach\recycle中留存
$MYOA_IS_RECYCLE = 1;

//-- 是否是演示版，1 是，0 不是。如果设置为演示版，则一部分功能不能使用，如修改密码
$MYOA_IS_DEMO = 0;

//-- 内部短信即时提醒的人数，0为不启用即时提醒
$MYOA_IM_REMIND_ROWS = 60;

//-- 使用OA精灵时打开OA菜单是否使用操作系统默认浏览器，0 OA精灵浏览器，1 操作系统默认浏览器
$MYOA_USE_OS_BROWSER = 0;

//-- 是否启用js、css压缩支持
$MYOA_SUPPORT_GZIP = 0;

//redis server的IP和端口
$MYOA_REDIS_SERVERS = array(
   array('host' => '172.17.0.7', 'port' => 6379)
);
//redis server的密码，在MYOA\bin\redis.windows.conf中，由requirepass参数设定
$MYOA_REDIS_PASS="123456";
//redis server使用的数据库ID，整数，可以为0~15，默认为0
$MYOA_REDIS_DB_ID = 0;

//-- session处理机制，支持 redis,files,user,memcache 四种方式
$MYOA_SESS_SAVE_HANDLER = 'files';

//-- 数据缓存方式，默认为memcache
$MYOA_CACHE_DRIVER = 'redis';
$MYOA_CACHE_CONFIG = array(
   'prefix' => '',
   'cache_path' => $MYOA_CACHE_PATH,
);

//-- MYOA数据库配置 --
$MYSQL_SERVER="172.17.0.8";
$MYSQL_USER="root";
$MYSQL_DB="TD_OA";
$MYSQL_DB_APP="TD_APP";
$MYSQL_PASS="toor";
?>

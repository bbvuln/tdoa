<?
//-- ����·������(�ֶ�����) --
//$ATTACH_PATH="/myoa/attachment/";
//$ATTACH_PATH2="/myoa/attach/";

//-- ��������·�� --
$ATTACH_BACKUP_PATH = $ATTACH_PATH2."bak/";

//-- ϵͳ����Ŀ¼ --
$MYOA_CACHE_PATH = $ATTACH_PATH2."cache/";

//-- ϵͳ����վĿ¼ --
$MYOA_RECYCLE_PATH = $ATTACH_PATH2."recycle/";

//-- ����ˢ��ʱ�䣬��λ�� --
$SMS_REF_SEC=30;

//-- ����״̬ˢ��ʱ�䣬��λ�� --
$ONLINE_REF_SEC=120;

//-- ���߱༭Office�ĵ��������ʱ�䣬��λ�� --
$ATTACH_LOCK_REF_SEC=180;

//-- ����ǿ���Զ�����ʱ�䣬��λ���ӣ�0Ϊ������ --
$OFFLINE_TIME_MIN=0;

//-- ״̬���Զ�ˢ��ʱ�䣬��λ�� --
$STATUS_REF_SEC=3600;

//-- ��������������Ѵ�����0Ϊ������ --
$SMS_REF_MAX=3;

//-- �����������Ѽ������λ���� --
$SMS_CALLSOUND_INTERVAL=3;

//-- �������߰�������,���ܻ���������ڲ����Ѷ��ţ�0��ʾ�رմ˹��ܡ���λ����--
$FLOW_REMIND_TIME=0;

//-- �ϴ������������� --
$UPLOAD_LIMIT = 1;        //0 �����ƣ�1 �������ϴ��±߶���ĺ�׺���ĸ�����2 ֻ�����ϴ��±߶���ĺ�׺���ĸ���
$UPLOAD_LIMIT_TYPE="php,php3,php4,php5,";

//-- ����Ӳ�̲�����༭���ı��ļ����� --
$EDIT_LIMIT_TYPE="php,php3,php4,php5,phpt,inc,jsp,asp,aspx,js,cgi,pl,";

//-- ��1-2�׽��������Ƿ�ʹ�ð�ť����ʽЧ�� --
$CORRECT_BUTTON = 1;//����1��Ϊ0��ʾʹ����ͨЧ��

//-- �Ƿ����������ͬһ�ʺ�ͬʱ��¼ --
$ONE_USER_MUL_LOGIN = 1;       //1 ����; 0 ��ֹ;

//-- �Ƿ񸽼�������UTF-8���� --
$ATTACH_UTF8=0;

//-- ����Ϊ 1��Office�ĵ�����ʱ�㡰�򿪡���ťʱ����������д򿪣��ر�ʱ����ʾ���档
//-- ����Ϊ 0������ñ���Office�򿪣��ر�ʱ���ܲ�����ʾ���� --
$ATTACH_OFFICE_OPEN_IN_IE=0;

//-- ������ʱ���Ѽ��������ÿ60��������ʱ60������
$SMS_DELAY_PER_ROWS = 60;
//-- ������ʱ���Ѽ��ʱ�䣬��λ��
$SMS_DELAY_SECONDS = 60;

//-- �����¼ϵͳ��ʱ��� -- ���ʱ�����Ӣ�Ķ��Ÿ�����һ��ʱ��ε�����ʱ����ò��˺�(~)����
$MYOA_LOGIN_TIME_RANGE = "00:00:00 ~ 23:59:59";

//-- �����渽�������µ���Ϸ��ʱ��� -- ���ʱ�����Ӣ�Ķ��Ÿ�����һ��ʱ��ε�����ʱ����ò��˺�(~)����
$MYOA_GAME_TIME_RANGE = "00:00:00 ~ 23:59:59";

//-- �Ƿ����ù����ļ��������Ӳ�̸���ɾ���Ļ���վ���ܣ�1Ϊ���ã�0Ϊ�����ã�
//-- ���ú󣬹����ļ��������Ӳ���б�ɾ���ĸ�������attach\recycle������
$MYOA_IS_RECYCLE = 1;

//-- �Ƿ�����ʾ�棬1 �ǣ�0 ���ǡ��������Ϊ��ʾ�棬��һ���ֹ��ܲ���ʹ�ã����޸�����
$MYOA_IS_DEMO = 0;

//-- �ڲ����ż�ʱ���ѵ�������0Ϊ�����ü�ʱ����
$MYOA_IM_REMIND_ROWS = 60;

//-- ʹ��OA����ʱ��OA�˵��Ƿ�ʹ�ò���ϵͳĬ���������0 OA�����������1 ����ϵͳĬ�������
$MYOA_USE_OS_BROWSER = 0;

//-- �Ƿ�����js��cssѹ��֧��
$MYOA_SUPPORT_GZIP = 0;

//redis server��IP�Ͷ˿�
$MYOA_REDIS_SERVERS = array(
   array('host' => '172.17.0.7', 'port' => 6379)
);
//redis server�����룬��MYOA\bin\redis.windows.conf�У���requirepass�����趨
$MYOA_REDIS_PASS="123456";
//redis serverʹ�õ����ݿ�ID������������Ϊ0~15��Ĭ��Ϊ0
$MYOA_REDIS_DB_ID = 0;

//-- session������ƣ�֧�� redis,files,user,memcache ���ַ�ʽ
$MYOA_SESS_SAVE_HANDLER = 'files';

//-- ���ݻ��淽ʽ��Ĭ��Ϊmemcache
$MYOA_CACHE_DRIVER = 'redis';
$MYOA_CACHE_CONFIG = array(
   'prefix' => '',
   'cache_path' => $MYOA_CACHE_PATH,
);

//-- MYOA���ݿ����� --
$MYSQL_SERVER="172.17.0.8";
$MYSQL_USER="root";
$MYSQL_DB="TD_OA";
$MYSQL_DB_APP="TD_APP";
$MYSQL_PASS="toor";
?>

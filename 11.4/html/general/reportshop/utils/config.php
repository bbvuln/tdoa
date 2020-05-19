<?
//启用压缩标识
if (!defined("CRS_GZ"))
{
    define("CRS_GZ", false);
}
if (!defined("CRS_FORCE_CACHE"))
{
    define("CRS_FORCE_CACHE", false);
}
if (!defined("CRS_STATIS"))
{
    define("CRS_STATIS", false);
}
if (!defined("MIN_POSTFIX"))
{
    define("MIN_POSTFIX", "-min");//-min
}
if (!defined("USE_PACK"))
{
    define("USE_PACK", 1);//1
}
if (!defined("USE_GZ"))
{
    define("USE_GZ", ".gz");//.gz
}
//控制签章前是否进行USBKEY身份验证
if(!defined("TO_CHECK_KEY_BEFORE_SEAL"))
{
    define("TO_CHECK_KEY_BEFORE_SEAL", false);//true
}
//控制是否实时计算Excel公式
if(!defined("CALCULATE_IN_TIME"))
{
    define("CALCULATE_IN_TIME", false);//true
}
//控制表间计算时是否同步计算结果以便进行再次计算
if(!defined("SYNC_QUERY_DATA"))
{
    define("SYNC_QUERY_DATA", true);//true
}
if(!defined("USE_PDA"))
{
    define("USE_PDA", true);
}
if(!defined("SMS_FUNC_TYPE"))
{
    define("SMS_FUNC_TYPE", true);
}
if(!defined("TD_JXC_VERSION")){
    define("TD_JXC_VERSION", 2);//0 or 2
}
?>
<?
include_once ('inc/auth.inc.php');
include_once("inc/td.class.php");
include_once("inc/conn.php");
include_once("general/system/t-erplinker/inc/func.erp.php");
$DATA_CONTROL = intval($_POST['DATA_77_DATA_CONTROL']);
$DATASRC = $_POST['DATA_77_DATASRC'];
$tERPConfig = getTErpConfig(TD::conn(),$DATA_CONTROL);
$pdoType=$tERPConfig["pdoType"];
$tERPConfig["pdo_dbname"] = $DATASRC;
$pdoInstance = PDOFactory::getPDOInstance($pdoType,$tERPConfig,$DATA_CONTROL);
if($pdoInstance)
{
	insertData($pdoInstance);
}
function insertData($pdo_dbms)
{
	$FDate = $_POST['kdaccountDATE_77'];//ƾ֤����
	$FGroupID = $_POST['kdAccount_pzz_77_hidden'];//ƾ֤������
	$FAttachments = $_POST['kdaccountFJS_77'];//������
	$DATA_ARR = $_POST['DATA_77'];//��¼����
	$Entry_arr = explode("#rDKAn#",rtrim($DATA_ARR,"#rDKAn#"));
	$FDebitTotal  = 0 ;//�跽���ϼ�
	$FEntryCount  = 0 ;//��¼��
	$FCreditTotal = 0 ; //�������ϼ�
	foreach ($Entry_arr as $key => $val){
		if($key != 0){
			$filed_type = 0;
			$FEntryCount++;
			$DATAEntry=explode("#KDA;#",$val);
			$filed["kdAccount_zy_".$FEntryCount] = $DATAEntry[0];
			$kdAccount_km=explode(",",$DATAEntry[1]);
			$filed["kdAccount_km_hidden_".$FEntryCount] = $kdAccount_km[0];
			$filed["kdAccount_km_show_".$FEntryCount] = $kdAccount_km[1];
			$filed["kdAccount_jd_".$FEntryCount] = $DATAEntry[2];
			$filed["kdAccount_je_".$FEntryCount] = $DATAEntry[3];
			if($DATAEntry[2] == 0)
			{
				$FCreditTotal += $DATAEntry[3];
			}
			else if($DATAEntry[2] == 1)
			{
				$FDebitTotal += $DATAEntry[3];
			}
				
		}
	}
	$FSerialNum = $_POST['kdaccountXH_77'];//���
	if($FSerialNum == "")
	{
		$FSerialNum = "(Select ISNULL(MAX(t_Voucher.FSerialNum)+1,1) FROM t_Voucher where FGroupID ='$FGroupID')";
	}
	$FTransDate = $_POST['kdaccountYWDATE_77'];//ҵ������
	$query = "INSERT INTO t_Voucher(FDate,FYear,FPeriod,FGroupID,FNumber,FReference,FExplanation,
 	                FAttachments,FEntryCount,FDebitTotal,FCreditTotal,FPreparerID,FHandler,FOwnerGroupID,FSerialNum,FTransDate,UUID)
 	                VALUES('$FDate',".date("Y").",".date('m',strtotime('-1 month')).",'$FGroupID',(Select ISNULL(MAX(t_Voucher.FNumber)+1,1) FROM t_Voucher where FGroupID ='$FGroupID'),'".td_iconv('OA����ƾ֤', MYOA_CHARSET, 'utf-8')."','',
	 	                '$FAttachments','$FEntryCount',$FDebitTotal,$FCreditTotal,16394,'".td_iconv($_SESSION['LOGIN_USER_NAME'], MYOA_CHARSET, 'utf-8')."',1,$FSerialNum,'$FTransDate',newid())";
	$pdo_dbms->query($query);
	
	$rs = $pdo_dbms->query("Select MAX(FVoucherID) AS FVoucherID FROM t_Voucher");
	//$rs = $pdo_dbms->query("SELECT IDENT_CURRENT('t_Voucher') as Id");
	if($rs){
		$rs->setFetchMode(PDO::FETCH_ASSOC);
		$result_arr = $rs->fetchAll();
		$FVoucherID = $result_arr[0]['FVoucherID'];
	}
	for($i=1;$i<=$FEntryCount;$i++)
	{
		$FExplanation = $filed['kdAccount_zy_'.$i];//ժҪ
		$FAccountID = $filed['kdAccount_km_hidden_'.$i];//��Ŀ����
		$FDC = $filed['kdAccount_jd_'.$i];//����(����)
		$FAmountFor = $filed['kdAccount_je_'.$i];//ԭ�ҽ��
		if($i%2 == 0)
		{
			$FSideEntryID = $i-2;//��ӦEntryID
		}
		else
		{
			$FSideEntryID = $i;//��ӦEntryID
		}
		$FAccountID1 = $FSideEntryID+1;
		$FAccountID2 = $filed['kdAccount_km_hidden_'.$FAccountID1];//��Ӧ��Ŀ
		$subQuery = "INSERT INTO t_VoucherEntry(FVoucherID,FEntryID,FExplanation,FAccountID,FCurrencyID,FExchangeRate,
		FDC,FAmountFor,FAmount,FAccountID2,FSideEntryID)
		VALUES($FVoucherID,$i-1,'".td_iconv($FExplanation, MYOA_CHARSET, 'utf-8')."','$FAccountID',1,1,'$FDC','$FAmountFor','$FAmountFor','$FAccountID2','$FSideEntryID')";
		$pdo_dbms->query($subQuery);
	}
}
?>
<?
include_once ('inc/auth.inc.php');
include_once("general/system/t-erplinker/inc/func.erp.php");
$DATA_CONTROL = intval($_POST['DATA_72_DATA_CONTROL']);
$DATASRC = $_POST['DATA_72_DATASRC'];
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
	$CTEXT1 = td_iconv($_POST['ctext1'], MYOA_CHARSET, 'utf-8');//��ͷ1
	$CTEXT2 = td_iconv($_POST['ctext2'], MYOA_CHARSET, 'utf-8');//��ͷ2
	$ISIGNSEQ = $_POST['yyaccount_sign_72'];//ƾ֤��������
	$CSIGN  = td_iconv($_POST['yyaccountID_72'], MYOA_CHARSET, 'utf-8');//ƾ֤��
	$DBILL_DATE = $_POST['yyaccountDATE_72'];//�Ƶ�����
	$DAUDIT_DATE = $_POST['yyaccountDATE2_72'];//�������
	$DATA_ARR = $_POST['DATA_72'];//��¼����
	$Entry_arr = explode("#rDKAn#",rtrim($DATA_ARR,"#rDKAn#"));
	$FDebitTotal  = 0 ;//�跽���ϼ�
	$FEntryCount  = 0 ;//��¼��
	$FCreditTotal = 0 ; //�������ϼ�
	foreach ($Entry_arr as $key => $val){
		if($key != 0){
			$filed_type = 0;
			$FEntryCount++;
			$DATAEntry=explode("#YYA;#",$val);
			$filed["yyAccount_zy_".$FEntryCount] = $DATAEntry[0];
			$yyAccount_km=explode(",",$DATAEntry[1]);
			$filed["yyAccount_km_hidden_".$FEntryCount] = $yyAccount_km[0];
			$filed["yyAccount_km_show_".$FEntryCount] = $yyAccount_km[1];
			$filed["yyAccount_jd_".$FEntryCount] = $DATAEntry[2];
			$filed["yyAccount_je_".$FEntryCount] = $DATAEntry[3];
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
	$rs = $pdo_dbms->query("Select ISNULL(MAX(GL_accvouch.INO_ID)+1,1) as maxid FROM GL_accvouch where CSIGN ='$CSIGN'");
	if($rs){
		$rs->setFetchMode(PDO::FETCH_ASSOC);
		$result_arr = $rs->fetchAll();
		$MAXID = $result_arr[0]['maxid'];
	}
	for($i=1;$i<=$FEntryCount;$i++)
	{
		
		$CDIGEST = $filed['yyAccount_zy_'.$i];//ժҪ
		$CCODE = $filed['yyAccount_km_hidden_'.$i];//��Ŀ����
		$FDC = $filed['yyAccount_jd_'.$i];//����(����)
		if($FDC == 0)
		{
			$MC = $filed['yyAccount_je_'.$i];//��Ľ��
			$MD = 0;
		}
		else 
		{
			$MD = $filed['yyAccount_je_'.$i];//���Ľ��
			$MC = 0;
		}
		if($i%2 == 0)
		{
			$FSideEntryID = $i-2;//��ӦEntryID
		}
		else
		{
			$FSideEntryID = $i;//��ӦEntryID
		}
		$len = strlen($ISIGNSEQ);
		$COUTNO_ID = "GL";
		for($j=1;$j<=13-$len;$j++){
			$COUTNO_ID.="0";
		}
		$COUTNO_ID.=$ISIGNSEQ;
		$CCODE_EQUALID = $FSideEntryID+1;
		$CCODE_EQUAL = $filed['kdAccount_km_hidden_'.$CCODE_EQUALID];//��Ӧ��Ŀ
		$query = "INSERT INTO GL_accvouch(IPERIOD,CSIGN,ISIGNSEQ,INO_ID,INID,DBILL_DATE,IDOC,
				    CBILL,CCHECK,CBOOK,CCASHIER,CTEXT1,CTEXT2,CDIGEST,CCODE,MD,MC,CCODE_EQUAL,
				    DOUTBILLDATE,COUTNO_ID,BVOUCHEDIT,BVALUEEDIT,BCODEEDIT,IYEAR,IYPERIOD)
	 	                VALUES(1,'$CSIGN','$ISIGNSEQ','$MAXID',$i,'$DBILL_DATE','',
					'".td_iconv($_SESSION['LOGIN_USER_NAME'], MYOA_CHARSET, 'utf-8')."','".td_iconv($_SESSION['LOGIN_USER_NAME'], MYOA_CHARSET, 'utf-8')."','".td_iconv($_SESSION['LOGIN_USER_NAME'], MYOA_CHARSET, 'utf-8')."','".td_iconv($_SESSION['LOGIN_USER_NAME'], MYOA_CHARSET, 'utf-8')."','$CTEXT1','$CTEXT2','".td_iconv($CDIGEST, MYOA_CHARSET, 'utf-8')."','$CCODE','$MD','$MC','$CCODE_EQUAL',
					'$DBILL_DATE','$COUTNO_ID',1,1,1,".date("Y").",".date("Ym").")";
		$a = $pdo_dbms->query($query);
	}
	
	$query = "INSERT INTO GL_LTData1(IPERIOD,ISIGNSEQ,INO_ID,CMASTER,IYPERIOD,IYEAR)
	VALUES(1,'$ISIGNSEQ','$MAXID','".td_iconv($_SESSION['LOGIN_USER_NAME'], MYOA_CHARSET, 'utf-8')."',".date('m',strtotime('-1 month')).",".date("Y").")";
	$b = $pdo_dbms->query($query);
}
?>
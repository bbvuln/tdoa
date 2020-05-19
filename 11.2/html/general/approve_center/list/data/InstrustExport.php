<?php
use \dao\base\BaseDAO;
use \engine\TFlowEngine;
include_once ('inc/auth.inc.php');
include_once ('inc/ExcelWriter.php');
include_once ("inc/flow_engine2.0/inc/data/GetInstrustList.class.php");
include_once 'inc/flow_engine2.0/base/dao/BaseDAO.php';
include_once 'inc/flow_engine2.0/inc/engine/TFlowEngine.php';
class InstrustExport extends BaseDAO
{
    public $run_id;
    public $user_id;
    public $flow_id;
    public $run_name;
    public $search_para;
    public $datatime ;
    public $the_id_str;
    public $begin_time;
    public $end_time;



    public function DownExport()
    {
        $datatime = date('Y-m-d H-i-s',time());
        $filename = _("工作流委托工作")."(".$datatime.")";

        $EXCEL_OUT = array (
            _("流水号"),
            _("工作名称/文号"),
            _("步骤和流程图"),
            _("发起人"),
            _("发起部门"),
            _("办理人"),
            _("状态"),
        );

        $objExcel = new ExcelWriter();
        $objExcel->setFileName($filename);
        $objExcel->addHead($EXCEL_OUT);


        $work_instrust = new GetInstrustData();
        $work_instrust->_set("user_id",$this->user_id);
        $work_instrust->_set("flow_id",$this->flow_id);
        $work_instrust->_set("run_name",$this->run_name);
        $work_instrust->_set("run_id",$this->run_id);
        $work_instrust->_set("prcs_key_id_str",$this->the_id_str);
		$work_instrust->_set("begin_time", $this->begin_time);
		$work_instrust->_set("end_time", $this->end_time);
		$work_instrust->_set("search_begin_dept", $this->search_begin_dept);
        $work_instrust->_set("pages","");


        $work_list = $work_instrust->getList();
        $result = array();
        foreach ( $work_list  as $row)
        {
            $prcs_key_id      =  $row ["PRCS_KEY_ID"];
            $run_id	          =  $row ["RUN_ID"];
            $flow_id          =  $row ["FLOW_ID"];
            $run_name         =  $row ["RUN_NAME"];
            $flow_start_user  =  $row ["BEGIN_USER"];
            $flow_start_dept  =  $row ["BEGIN_DEPT"];
            $prcs_id          =  $row ["PRCS_ID"];
            $flow_prcs        =  $row ["FLOW_PRCS"];
            $user_id          =  $row ["USER_ID"];
            $op_flag          =  $row ["OP_FLAG"];
            $flowPrcsInfo = TFlowEngine::getFlowPrcsInfo($flow_id,$flow_prcs);
            $prcs_type       = $flowPrcsInfo['PRCS_TYPE'];
            $workRunPrcsInfo = TFlowEngine::getWorkRunPrcsInfoById($prcs_key_id,["RUN_PRCS_NAME"]);
            $run_prcs_name = $workRunPrcsInfo[0]['RUN_PRCS_NAME'];
            $user_info		 = GetUserInfoByUID(UserId2Uid($flow_start_user));
            $create_man	 	 = $user_info["USER_NAME"];
            $create_dept    = td_trim(GetDeptNameById($flow_start_dept));
            $current_user_info		 = GetUserInfoByUID(UserId2Uid($user_id));
            $current_user_name 	 = $current_user_info["USER_NAME"];
            $prcs_name_text = _("第").$prcs_id._("步：");
            if($prcs_type ==3)
            {
                if($run_prcs_name=='')
                {
                    $cache = TD::get_cache ( 'BPM_PROCESS_' . $flow_id );
                    $prcs_name_text .= $cache [$flow_prcs] ["PRCS_NAME"];

                }else
                {
                    $prcs_name_text .= $run_prcs_name;
                }
            }else
            {
                $cache = TD::get_cache ( 'BPM_PROCESS_' . $flow_id );

                $prcs_name_text .= $cache [$flow_prcs] ["PRCS_NAME"];

            }
            $prcs_name		 = $prcs_name_text;
            if($row['flow_end_time'] != ""){
                $flow_end_text = '已结束';
            }else
            {
                $flow_end_text ="进行中";
            }

            $instrustarr = array(
                $run_id,
                $run_name,
                $prcs_name,
                $create_man,
                $create_dept,
                $current_user_name,
                $flow_end_text,
            );

            $result[] = $instrustarr;

        }

        foreach($result as $key => $instrustarr)
        {
            $EXCEL_OUT='"'.$instrustarr[0].'","'.$instrustarr[1].'","'.str_replace('"','""',$instrustarr[2]).'","'.$instrustarr[3].'","'.$instrustarr[4].'","'.$instrustarr[5].'","'.$instrustarr[6].'"';
            $objExcel->addRow($EXCEL_OUT);
        }

        $objExcel->Save();
    }


}




?>
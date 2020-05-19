<?php
	function checkHandleStatusAndShowMessage($flow_id, $run_id, $prcs_key_id, $flow_id, $prcs_id, $flow_prcs, $login_user_id){
		$run_name = checkWorkRunIfDeleteAndExit($run_id, $from);
		$work_prcs_flag = getWorkRunPrcsFlag($run_id, $prcs_id, $flow_prcs, $login_user_id, $prcs_key_id);
		checkHandleAndShowMessage($work_prcs_flag, $flow_id, $run_id, $prcs_key_id, $flow_id, $prcs_id, $flow_prcs, $run_name);
	}
	function getFlowRunInfoByRunId($run_id, $fileds = 'RUN_NAME'){
	    $r_connection 		= TD::conn ();
	    $OBJ_SQL_SYNTAX 	= SQLSyntaxFactory::factory ( MYOA_DBMS );
	    $select_exprs 		= $OBJ_SQL_SYNTAX->getSelectExprs($fileds);
	    $table_references 	= $OBJ_SQL_SYNTAX->getTableReferences ("FLOW_RUN");
	    $where_definition 	= $OBJ_SQL_SYNTAX->getConditionExpr("RUN_ID", EXPR_OP_IS, $run_id, FIELD_TYPE_INT);
	    $sql 				= $OBJ_SQL_SYNTAX->getQuerySQL ( 0 , 0 , $select_exprs , $table_references , $where_definition );
	    $r_cursor 			= exequery ( $r_connection , $sql);
	    if($row = mysql_fetch_assoc($r_cursor)){
	        return $row;
	    }
	    
	    return array();
	    
	}
	function getParentRunByFlowIdRunId($flow_id, $run_id){
	    $r_connection 		= TD::conn ();
	    $OBJ_SQL_SYNTAX 	= SQLSyntaxFactory::factory ( MYOA_DBMS );
	    $select_exprs 		= $OBJ_SQL_SYNTAX->getSelectExprs("PARENT_RUN");
	    $table_references 	= $OBJ_SQL_SYNTAX->getTableReferences ("BPM_RUN");
	    $conditions 		= array();
	    array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("RUN_ID", EXPR_OP_IS, $run_id, FIELD_TYPE_INT));
	    array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("FLOW_ID", EXPR_OP_IS, $flow_id, FIELD_TYPE_INT));
	    $where_definition 	= $OBJ_SQL_SYNTAX->getWhereDefinition($conditions, CONDITION_LOGIC_OP_AND);
	    $sql 				= $OBJ_SQL_SYNTAX->getQuerySQL ( 0 , 0 , $select_exprs , $table_references , $where_definition );
	    $r_cursor 			= exequery ( $r_connection , $sql);
	    if($row = mysql_fetch_assoc($r_cursor)){
	        return $row["PARENT_RUN"];
	    }
	    return 0;
	}
	
	function getPrcsOtherInfo($run_id, $prcs_id, $flow_prcs, $login_user_id, $prcs_key_id=''){
	    $result = array();
	    $r_connection 		= TD::conn ();
	    $OBJ_SQL_SYNTAX 	= SQLSyntaxFactory::factory ( MYOA_DBMS );
	    $select_exprs 		= $OBJ_SQL_SYNTAX->getSelectExprs("ID,PRCS_FLAG,OP_FLAG,PARENT,PARENT_PRCS_ID,BACK_PRCS_ID,TOP_FLAG,BACK_PRCS_ID");
	    $table_references 	= $OBJ_SQL_SYNTAX->getTableReferences ("FLOW_RUN_PRCS");
	    $conditions 		= array();
        if($prcs_key_id) array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("ID", EXPR_OP_IS, $prcs_key_id, FIELD_TYPE_INT));
        array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("RUN_ID", EXPR_OP_IS, $run_id, FIELD_TYPE_INT));
        array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("PRCS_ID", EXPR_OP_IS, $prcs_id, FIELD_TYPE_INT));
        array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("FLOW_PRCS", EXPR_OP_IS, $flow_prcs, FIELD_TYPE_INT));
        array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("USER_ID", EXPR_OP_IS, $login_user_id, FIELD_TYPE_CHAR));
	    $where_definition 	= $OBJ_SQL_SYNTAX->getWhereDefinition($conditions, CONDITION_LOGIC_OP_AND);
	    $sql 				= $OBJ_SQL_SYNTAX->getQuerySQL ( 0 , 1 , $select_exprs , $table_references , $where_definition );
	    $r_cursor 			= exequery ( $r_connection , $sql);
	    if($row = mysql_fetch_assoc($r_cursor)){
	        return $row;
	    }
	    return $result;
	}
	
	
	function getWorkRunOpFlag($run_id, $prcs_id, $flow_prcs, $login_user_id){
	    $r_connection 		= TD::conn ();
	    $OBJ_SQL_SYNTAX 	= SQLSyntaxFactory::factory ( MYOA_DBMS );
	    $select_exprs 		= $OBJ_SQL_SYNTAX->getSelectExprs("OP_FLAG");
	    $table_references 	= $OBJ_SQL_SYNTAX->getTableReferences ("FLOW_RUN_PRCS");
	    $conditions 		= array();
	    array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("RUN_ID", EXPR_OP_IS, $run_id, FIELD_TYPE_INT));
		array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("PRCS_ID", EXPR_OP_IS, $prcs_id, FIELD_TYPE_INT));
		array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("FLOW_PRCS", EXPR_OP_IS, $flow_prcs, FIELD_TYPE_INT));
		array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("USER_ID", EXPR_OP_IS, $login_user_id, FIELD_TYPE_CHAR));
		$where_definition 	= $OBJ_SQL_SYNTAX->getWhereDefinition($conditions, CONDITION_LOGIC_OP_AND);
	    $sql 				= $OBJ_SQL_SYNTAX->getQuerySQL ( 0 , 1 , $select_exprs , $table_references , $where_definition );
	    $r_cursor 			= exequery ( $r_connection , $sql);
	    if($row = mysql_fetch_assoc($r_cursor)){
	        return $row["OP_FLAG"];
	    }
	    return 0;
	}
	
	function getWorkRunPrcsFlag($run_id, $prcs_id, $flow_prcs, $login_user_id, $prcs_key_id=''){
		$prcs_flag_arr = array();
		$r_connection 		= TD::conn ();
		$OBJ_SQL_SYNTAX 	= SQLSyntaxFactory::factory ( MYOA_DBMS );
	    $select_exprs 		= $OBJ_SQL_SYNTAX->getSelectExprs("PRCS_FLAG");
	    $table_references 	= $OBJ_SQL_SYNTAX->getTableReferences ("FLOW_RUN_PRCS");
	    $conditions 		= array();
        if($prcs_key_id) array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("ID", EXPR_OP_IS, $prcs_key_id, FIELD_TYPE_INT));
        array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("RUN_ID", EXPR_OP_IS, $run_id, FIELD_TYPE_INT));
        array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("PRCS_ID", EXPR_OP_IS, $prcs_id, FIELD_TYPE_INT));
        array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("FLOW_PRCS", EXPR_OP_IS, $flow_prcs, FIELD_TYPE_INT));
        array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("USER_ID", EXPR_OP_IS, $login_user_id, FIELD_TYPE_CHAR));
		$where_definition 	= $OBJ_SQL_SYNTAX->getWhereDefinition($conditions, CONDITION_LOGIC_OP_AND);
	    $sql 				= $OBJ_SQL_SYNTAX->getQuerySQL ( 0 , 0 , $select_exprs , $table_references , $where_definition );
	    $r_cursor 			= exequery ( $r_connection , $sql);
	    while($row = mysql_fetch_assoc($r_cursor)){
	    	$prcs_flag_arr[]= $row["PRCS_FLAG"];
	    }
	    if(!empty($prcs_flag_arr)){
	    	sort($prcs_flag_arr);
	    	return $prcs_flag_arr[0];
	    }
	    return 7;//如果没有结果时返回值，用于判断工作是否已经“收回” by yhs - 2013-11-27
	}
	
	/*
	 * 获取办理工作和会签工作情况下的表单信息
	 * 
	 */
	function getHandleWorkDataArr($run_id, $prcs_key_id, $flow_id, $prcs_id, $flow_prcs, $login_user_id){
		$a_handle_work_data = array();
		$a_work_run_data = getWorkRunDataByRunId($run_id);
		setHandleWorkDataByRunData($a_handle_work_data, $a_work_run_data);
		$a_ukey_data = getUserKeyDatas($login_user_id);
		setHandleWorkDataByUKeyData($a_handle_work_data, $a_ukey_data);
		$a_flow_data = getFlowDataByFlowId($flow_id);
		setHandleWorkDataByFlowData($a_handle_work_data, $a_flow_data);
		$a_flow_run_prcs_data = getFlowRunPrcsData($run_id, $prcs_id, $flow_prcs, $login_user_id);
		setHandleWorkDataByFlowRunPrcsData($a_handle_work_data, $a_flow_run_prcs_data);
		$a_handle_work_data['flow_form_element'] 	= TD::get_cache("workflow/form/ELEMENT_ARRAY_".$a_handle_work_data["form_id"]);
		$a_flow_form_data = getFlowFormDataByFromId($a_handle_work_data["form_id"]);
		setHandleWorkDataByFlowFlowFormData($a_handle_work_data, $a_flow_form_data);
		if($a_handle_work_data["flow_type"] == 1){
			$a_flow_prcs_data = getFlowPrcsData($flow_id, $prcs_id, $run_id, $flow_prcs, $a_handle_work_data['parent']);
			setHandleWorkDataByFlowPrcsData($a_handle_work_data, $a_flow_prcs_data);
		}
		$a_handle_work_data["time_out_desc"] = getWorkRunTimeOut($a_handle_work_data["prcs_flag"], $a_handle_work_data["time_out"], $a_handle_work_data["prcs_time"], $run_id, $prcs_id );
		return $a_handle_work_data;
	}
	
	
	
	function getWorkRunDeliverTimeByRunIdAndPrcsId($run_id, $prcs_id){
		$r_connection 		= TD::conn ();
		$OBJ_SQL_SYNTAX 	= SQLSyntaxFactory::factory ( MYOA_DBMS );
	    $select_exprs 		= $OBJ_SQL_SYNTAX->getSelectExprs("DELIVER_TIME");
	    $table_references 	= $OBJ_SQL_SYNTAX->getTableReferences ("FLOW_RUN_PRCS");
	    $conditions 		= Array();
		array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("RUN_ID", EXPR_OP_IS, $run_id, FIELD_TYPE_INT));
		array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("PRCS_ID", EXPR_OP_IS, $prcs_id, FIELD_TYPE_INT));
		$where_definition 	= $OBJ_SQL_SYNTAX->getWhereDefinition($conditions, CONDITION_LOGIC_OP_AND);
	    $sql 				= $OBJ_SQL_SYNTAX->getQuerySQL ( 0 , 0 , $select_exprs , $table_references , $where_definition );
	    $r_cursor 			= exequery ( $r_connection , $sql);
	    if($row = mysql_fetch_assoc($r_cursor)){
	    	return str_replace("0000-00-00 00:00:00", "", $row["DELIVER_TIME"]);
	    }
		return "";
	}
	
	function getWorkRunTimeOut($prcs_flag, $time_out, $prcs_time, $run_id, $prcs_id){
		if($prcs_flag == 1 && $time_out != ""){//固定流程超时情况
			if($prcs_flag == 1 && $prcs_id != 1){//主办且非第一步的情况 显示超时情况 主办超时开始时间取上一步骤的结束时间【DELIVER_TIME】
				$prev_prcs_id = intval($prcs_id) - 1;
				$s_prcs_begin_time = getWorkRunDeliverTimeByRunIdAndPrcsId($run_id, $prev_prcs_id);
			}else{//会签的情况超时开始时间取当前步骤的接收时间【PRCS_TIME】
				$s_prcs_begin_time = $prcs_time ? $prcs_time : date("Y-m-d H:i:s", time());
			}
			$time_out_str = format_date_to_king_str(strtotime($s_prcs_begin_time));
			return sprintf(_("您的工作已超时%s请马上办理！"),$time_out_str);
		}
		return "";
	}
	
	function setHandleWorkDataByFlowPrcsData(&$a_handle_work_data, $a_flow_prcs_data){
		$a_handle_work_data["prcs_name"] 			= $a_flow_prcs_data["prcs_name"];
		$a_handle_work_data["prcs_item"] 			= $a_flow_prcs_data["prcs_item"];
		$a_handle_work_data["prcs_item_auto"] 		= $a_flow_prcs_data["prcs_item_auto"];
		$a_handle_work_data["feedback"] 			= $a_flow_prcs_data["feedback"];
		$a_handle_work_data["signlook"] 			= $a_flow_prcs_data["signlook"];
		$a_handle_work_data["hidden_item"] 			= $a_flow_prcs_data["hidden_item"];
		$a_handle_work_data["time_out"] 			= $a_flow_prcs_data["time_out"];
		$a_handle_work_data["time_out_modify"] 		= $a_flow_prcs_data["time_out_modify"];
		$a_handle_work_data["attach_priv"] 			= $a_flow_prcs_data["attach_priv"];
		$a_handle_work_data["allow_back"] 			= $a_flow_prcs_data["allow_back"];
		$a_handle_work_data["disp_aip"] 			= $a_flow_prcs_data["disp_aip"];
		$a_handle_work_data["gather_node"] 			= $a_flow_prcs_data["gather_node"];
		$a_handle_work_data["attach_edit_priv"] 	= $a_flow_prcs_data["attach_edit_priv"];
		$a_handle_work_data["back_flag"] 			= $a_flow_prcs_data["back_flag"];
	}
	
	function getFlowPrcsData($flow_id, $prcs_id, $run_id, $flow_prcs, $parent){
		$a_flow_prcs_data = array();
		$flow_prcs_cache_data = getFlowPrcsInfo($flow_id, $flow_prcs);
		if(!empty($flow_prcs_cache_data)){
			$a_flow_prcs_data["prcs_name"] 			= $flow_prcs_cache_data["PRCS_NAME"];
			$a_flow_prcs_data["prcs_item"] 			= $flow_prcs_cache_data["PRCS_ITEM"];
			$a_flow_prcs_data["prcs_item_auto"] 	= $flow_prcs_cache_data["PRCS_ITEM_AUTO"];
			$a_flow_prcs_data["feedback"] 			= $flow_prcs_cache_data["FEEDBACK"];
			$a_flow_prcs_data["signlook"] 			= $flow_prcs_cache_data["SIGNLOOK"];
			$a_flow_prcs_data["hidden_item"] 		= $flow_prcs_cache_data["HIDDEN_ITEM"];
			$a_flow_prcs_data["time_out"] 			= $flow_prcs_cache_data["TIME_OUT"];
			$a_flow_prcs_data["time_out_modify"] 	= $flow_prcs_cache_data["TIME_OUT_MODIFY"];
			$a_flow_prcs_data["attach_priv"] 		= $flow_prcs_cache_data["ATTACH_PRIV"];
			$a_flow_prcs_data["allow_back"] 		= $flow_prcs_cache_data["ALLOW_BACK"];
			$a_flow_prcs_data["disp_aip"] 			= $flow_prcs_cache_data["DISP_AIP"];
			$a_flow_prcs_data["gather_node"] 		= $flow_prcs_cache_data["GATHER_NODE"];
			$a_flow_prcs_data["attach_edit_priv"] 	= $flow_prcs_cache_data["ATTACH_EDIT_PRIV"];
			if($flow_prcs_cache_data["ALLOW_BACK"]){
				$a_flow_prcs_data["back_flag"]  = getWorkRunBackFlag($run_id, $prcs_id, $flow_prcs, $parent);
			}
		}
		return $a_flow_prcs_data;
	}
	
	
	/*
	 * 允许退回的情况下检测是否为并发流程，如果不并发流程则不允许退回
	 * @param int $run_id
	 *            流水号
	 * @param int $prcs_id
	 *            流程实例步骤ID（实际步骤号）
	 * @param int $flow_prcs
	 *            流程步骤ID（设计流程步骤号）
	 * @param int $parent
	 *            flow_run_prcs表中字段  表示上一步骤ID（哪个步骤转交过来的）
	 *    
	 */
	function getWorkRunBackFlag($run_id, $prcs_id, $flow_prcs, $parent){
		$back_flag	=	1;
		$r_connection 		= TD::conn ();
		$OBJ_SQL_SYNTAX 	= SQLSyntaxFactory::factory ( MYOA_DBMS );
	    $select_exprs 		= $OBJ_SQL_SYNTAX->getSelectExprs("RUN_ID");
	    $table_references 	= $OBJ_SQL_SYNTAX->getTableReferences ("FLOW_RUN_PRCS");
	    $conditions 		= Array();
		array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("RUN_ID", EXPR_OP_IS, $run_id, FIELD_TYPE_INT));
		array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("PRCS_ID", EXPR_OP_IS, $prcs_id, FIELD_TYPE_INT));
		array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("OP_FLAG", EXPR_OP_IS, 1, FIELD_TYPE_INT));
		array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("FLOW_PRCS", EXPR_OP_ISN, $flow_prcs, FIELD_TYPE_INT));
		array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("PARENT", EXPR_OP_IS, $parent, FIELD_TYPE_INT));
		$where_definition 	= $OBJ_SQL_SYNTAX->getWhereDefinition($conditions, CONDITION_LOGIC_OP_AND);
	    $sql 				= $OBJ_SQL_SYNTAX->getQuerySQL ( 0 , 0 , $select_exprs , $table_references , $where_definition );
	    $r_cursor 			= exequery ( $r_connection , $sql);
	    if($row = mysql_fetch_assoc($r_cursor)){
	    	return 0;
	    }
	    return $back_flag;
	}
	
	function setHandleWorkDataByFlowFlowFormData(&$a_handle_work_data, $a_flow_form_data){
		$a_handle_work_data["form_name"] 				= $a_flow_form_data["form_name"];
		$a_handle_work_data["print_model_short"] 		= $a_flow_form_data["print_model_short"];
		$a_handle_work_data["script"] 				= $a_flow_form_data["script"];
		$a_handle_work_data["css"] 					= $a_flow_form_data["css"];
	}
	
	function getFlowFormDataByFromId($form_id){
		$a_flow_form_data = array();
		$r_connection 		= TD::conn ();
		$OBJ_SQL_SYNTAX 	= SQLSyntaxFactory::factory ( MYOA_DBMS );
	    $select_exprs 		= $OBJ_SQL_SYNTAX->getSelectExprs("FORM_NAME,PRINT_MODEL_SHORT,SCRIPT,CSS");
	    $table_references 	= $OBJ_SQL_SYNTAX->getTableReferences ("FLOW_FORM_TYPE");
	    $condition_exprs 	= $OBJ_SQL_SYNTAX->getConditionExpr ( "FORM_ID" , EXPR_OP_IS , $form_id , FIELD_TYPE_INT );
	    $sql 				= $OBJ_SQL_SYNTAX->getQuerySQL ( 0 , 0 , $select_exprs , $table_references , $condition_exprs );
	    $r_cursor 			= exequery ( $r_connection , $sql);
	    if($row = mysql_fetch_assoc($r_cursor)){
	    	$a_flow_form_data["form_name"] 			= $row["FORM_NAME"];
	    	$a_flow_form_data["print_model_short"] 	= $row["PRINT_MODEL_SHORT"];
	    	$a_flow_form_data["script"] 			= $row["SCRIPT"];
	    	$a_flow_form_data["css"] 				= $row["CSS"];
	    }
	    return $a_flow_form_data;
	} 
	
	function setHandleWorkDataByFlowRunPrcsData(&$a_handle_work_data, $a_flow_run_prcs_data){
		$a_handle_work_data["op_flag"] 			= $a_flow_run_prcs_data["op_flag"];
		$a_handle_work_data["prcs_flag"] 		= $a_flow_run_prcs_data["prcs_flag"];
		$a_handle_work_data["top_flag"] 		= $a_flow_run_prcs_data["top_flag"];
		$a_handle_work_data["parent"] 			= $a_flow_run_prcs_data["parent"];
		$a_handle_work_data["prcs_time"] 		= $a_flow_run_prcs_data["prcs_time"];
		$a_handle_work_data["free_item"] 		= $a_flow_run_prcs_data["free_item"];
	}
	
	function getFlowRunPrcsData($run_id, $prcs_id, $flow_prcs, $login_user_id){
		$a_flow_run_prcs_data = array();
		$r_connection 		= TD::conn ();
		$OBJ_SQL_SYNTAX 	= SQLSyntaxFactory::factory ( MYOA_DBMS );
	    $select_exprs 		= $OBJ_SQL_SYNTAX->getSelectExprs("OP_FLAG,PRCS_FLAG,TOP_FLAG,PARENT,PRCS_TIME,FREE_ITEM");
	    $table_references 	= $OBJ_SQL_SYNTAX->getTableReferences ("FLOW_RUN_PRCS");
	    $conditions 		= Array();
		array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("RUN_ID", EXPR_OP_IS, $run_id, FIELD_TYPE_INT));
		array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("PRCS_ID", EXPR_OP_IS, $prcs_id, FIELD_TYPE_INT));
		array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("FLOW_PRCS", EXPR_OP_IS, $flow_prcs, FIELD_TYPE_INT));
		array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("USER_ID", EXPR_OP_IS, $login_user_id, FIELD_TYPE_CHAR));
		$where_definition 	= $OBJ_SQL_SYNTAX->getWhereDefinition($conditions, CONDITION_LOGIC_OP_AND);
	    $sql 				= $OBJ_SQL_SYNTAX->getQuerySQL ( 0 , 0 , $select_exprs , $table_references , $where_definition );
	    $r_cursor 			= exequery ( $r_connection , $sql);
	    if($row = mysql_fetch_assoc($r_cursor)){
	    	$a_flow_run_prcs_data["op_flag"] 	= $row["OP_FLAG"];
	    	$a_flow_run_prcs_data["prcs_flag"] 	= $row["PRCS_FLAG"];
	    	$a_flow_run_prcs_data["top_flag"] 	= $row["TOP_FLAG"];
	    	$a_flow_run_prcs_data["parent"] 	= $row["PARENT"];
	    	$a_flow_run_prcs_data["prcs_time"] 	= $row["PRCS_TIME"];
	    	$a_flow_run_prcs_data["free_item"] 	= $row["FREE_ITEM"];
	    }
	    return $a_flow_run_prcs_data;
	}
	
	function getFlowDataByFlowId($flow_id){
		$a_flow_data 				= array();
		$flow_cache_data 			= TD::get_cache("W_FLOW_".$flow_id);
		$a_flow_data["flow_name"] 	= $flow_cache_data["FLOW_NAME"];
		$a_flow_data["form_id"] 	= $flow_cache_data["FORM_ID"];
		$a_flow_data["flow_type"] 	= $flow_cache_data["FLOW_TYPE"];
		$a_flow_data["flow_doc"] 	= $flow_cache_data["FLOW_DOC"];
		$a_flow_data["auto_len"] 	= $flow_cache_data["AUTO_LEN"];
		$a_flow_data["auto_num"] 	= str_pad($flow_cache_data["AUTO_NUM"], $flow_cache_data["AUTO_LEN"], "0", STR_PAD_LEFT);
		$a_flow_data["model_id"] 	= $flow_cache_data["MODEL_ID"];
		$a_flow_data["model_name"] 	= $flow_cache_data["MODEL_NAME"];
		if(field_exists($table_name, 'flow_auto_num')){
			$auto_num = getFlowDataTableAutoNumByFlowId($flow_id);//有错，应该是$RUN_ID
			if(!empty($auto_num)){
				$a_flow_data["AUTO_NUM"] = $auto_num;
			}
		}
		return $a_flow_data;
	}
	
	function getFlowDataTableAutoNumByFlowId($flow_id){
		$r_connection 		= TD::conn ();
		$auto_num 			= "";
		$OBJ_SQL_SYNTAX 	= SQLSyntaxFactory::factory ( MYOA_DBMS );
	    $select_exprs 		= $OBJ_SQL_SYNTAX->getSelectExprs( "FLOW_AUTO_NUM");
	    $table_references 	= $OBJ_SQL_SYNTAX->getTableReferences ( "FLOW_DATA_".$flow_id );
		$condition_exprs 	= $OBJ_SQL_SYNTAX->getConditionExpr ( "FLOW_ID" , EXPR_OP_IS , $flow_id , FIELD_TYPE_INT );
	    $sql 				= $OBJ_SQL_SYNTAX->getQuerySQL ( 0 , 0 , $select_exprs , $table_references , $condition_exprs );
	    $r_cursor 			= exequery ( $r_connection , $sql);
	    if($row = mysql_fetch_assoc($r_cursor)){
	    	$auto_num = $row["FLOW_AUTO_NUM"];
	    }
	    return $auto_num;
	}
	function setHandleWorkDataByFlowData(&$a_handle_work_data, $a_flow_data){
		$a_handle_work_data["flow_name"] 		= $a_flow_data["flow_name"];
		$a_handle_work_data["form_id"] 			= $a_flow_data["form_id"];
		$a_handle_work_data["flow_type"] 		= $a_flow_data["flow_type"];
		$a_handle_work_data["flow_doc"] 		= $a_flow_data["flow_doc"];
		$a_handle_work_data["auto_num"] 		= $a_flow_data["auto_num"];
		$a_handle_work_data["auto_len"] 		= $a_flow_data["auto_len"];
		$a_handle_work_data["model_id"] 		= $a_flow_data["model_id"];
		$a_handle_work_data["model_name"] 		= $a_flow_data["model_name"];
	}
	/*
	 * 将用户UKEY信息放到办理流程的需要的总数组中
	 * @param array $a_handle_work_data
	 *            办理所需要数据的总数组
	 * @param array $a_ukey_data
	 *            用户UKEY信息
	 * 
	 */
	function setHandleWorkDataByUKeyData(&$a_handle_work_data, $a_ukey_data){
		$a_handle_work_data["login_key"] 		= $a_ukey_data["login_key"];
		$a_handle_work_data["useing_key"] 		= $a_ukey_data["useing_key"];
		$a_handle_work_data["key_sn"] 			= $a_ukey_data["key_sn"];
	}
	/*
	 * 根据用户ID获取用户UKEY信息及UKEY开关
	 * @param int $login_user_id
	 *            流程流水ID
	 * @return array 用户UKEY信息键值表示： login_key 表示系统UKEY开关，useing_key是否使用使用USB KEY登录 ， key_sn 动态密码卡号
	 * 
	 */
	function getUserKeyDatas($login_user_id){
		$a_ukey_info_data = array();
		$sys_para_arr = get_sys_para("LOGIN_KEY");
		$a_ukey_info_data["login_key"] = $sys_para_arr["LOGIN_KEY"];
		if($login_key){
	 		$a_user_key_info = getUserKeyDataByUserId($login_user_id);
	 		if(!empty($a_user_key_info)){
	 			$a_ukey_info_data["useing_key"] = $a_user_key_info["useing_key"];
	 			$a_ukey_info_data["key_sn"] = $a_user_key_info["key_sn"];
	 		}
	 	}
	 	return $a_ukey_info_data;
	}
	
	function getUserKeyDataByUserId($login_user_id){
		$a_ukey_data = array();
		$r_connection 		= TD::conn ();
		$OBJ_SQL_SYNTAX 	= SQLSyntaxFactory::factory ( MYOA_DBMS );
	 	$select_expr 		= $OBJ_SQL_SYNTAX->getSelectExprs ( "USEING_KEY,KEY_SN" );
	    $table_references 	= $OBJ_SQL_SYNTAX->getTableReferences ( "USER" );
		$condition_exprs 	= $OBJ_SQL_SYNTAX->getConditionExpr ( "USER_ID" , EXPR_OP_IS , $login_user_id , FIELD_TYPE_INT );
	    $sql 				= $OBJ_SQL_SYNTAX->getQuerySQL ( 0 , 0 , $select_expr , $table_references , $condition_exprs );
	    $r_cursor 			= exequery ( $r_connection , $sql);
	    if($row = mysql_fetch_assoc($r_cursor)){
			$a_ukey_data["useing_key"] = $row["useing_key"];
			$a_ukey_data["key_sn"] = $row["key_sn"];
		}
		return $a_ukey_data;
	}
	function getWorkRunDataByRunId($run_id){
		$a_work_run_data = array();
		$r_connection		= TD::conn ();
		$OBJ_SQL_SYNTAX 	= SQLSyntaxFactory::factory ( MYOA_DBMS );
	 	$select_expr 		= $OBJ_SQL_SYNTAX->getSelectExprs ( "RUN_NAME,ATTACHMENT_ID,ATTACHMENT_NAME,FOCUS_USER,BEGIN_USER,PARENT_RUN,BEGIN_TIME,PARENT_RUN,AIP_FILES" );
	    $table_references 	= $OBJ_SQL_SYNTAX->getTableReferences ( "FLOW_RUN" );
		$condition_exprs 	= $OBJ_SQL_SYNTAX->getConditionExpr ( "RUN_ID" , EXPR_OP_IS , $run_id , FIELD_TYPE_INT );
	    $sql 				= $OBJ_SQL_SYNTAX->getQuerySQL ( 0 , 0 , $select_expr , $table_references , $condition_exprs );
	    $r_cursor 			= exequery ( $r_connection , $sql);
	    if($row = mysql_fetch_assoc($r_cursor)){
			$a_work_run_data["run_name"] 		= $row["RUN_NAME"];
			$a_work_run_data["attachment_id"] 	= $row["ATTACHMENT_ID"];
			$a_work_run_data["attachment_name"] = $row["ATTACHMENT_NAME"];
			$a_work_run_data["focus_user"] 		= $row["FOCUS_USER"];
			$a_work_run_data["begin_user"] 		= $row["BEGIN_USER"];
			$a_work_run_data["parent_run"] 		= $row["PARENT_RUN"];
			$a_work_run_data["begin_time"] 		= $row["BEGIN_TIME"];
			$a_work_run_data["parent_run"] 		= $row["PARENT_RUN"];
			$a_work_run_data["aip_files"] 		= $row["AIP_FILES"];
		}
		return $a_work_run_data;	
	}
	function setHandleWorkDataByRunData(&$a_handle_work_data, $a_work_run_data){
		$a_handle_work_data["run_name"] 		= $a_work_run_data["run_name"];
		$a_handle_work_data["attachment_id"] 	= $a_work_run_data["attachment_id"];
		$a_handle_work_data["attachment_name"] 	= $a_work_run_data["attachment_name"];
		$a_handle_work_data["focus_user"] 		= $a_work_run_data["focus_user"];
		$a_handle_work_data["begin_user"] 		= $a_work_run_data["begin_user"];
		$a_handle_work_data["parent_run"] 		= $a_work_run_data["parent_run"];
		$user_info		 						= GetUserInfoByUID(UserId2Uid($a_work_run_data["begin_user"]));
		$a_handle_work_data["begin_user_name"] 	= $user_info["user_name"];
		$a_handle_work_data["begin_time"] 		= $a_work_run_data["begin_time"];
		$a_handle_work_data["parent_run"] 		= $a_work_run_data["parent_run"];
		$a_handle_work_data["aip_files"] 		= $a_work_run_data["aip_files"];
		if($a_work_run_data["aip_files"] != ""){
				$aip_files_array = array();
				$my_array = explode("\n",$a_work_run_data["aip_files"]);
				foreach($my_array as $v){
					$tmp = explode(":",$v);
					$aip_files_array[$tmp[0]] = $tmp[1];
				}
				$a_handle_work_data["aip_files_arr"] 		= $aip_files_array;
		}
		if($a_work_run_data["parent_run"] != 0 ){
			$a_handle_work_data["parent_flow_id"] 	=  getParentFlowIdByRunId($a_work_run_data["parent_run"]);
		}
	}
	function getUserIfCounterSign($run_id, $prcs_id, $login_user_id ){
	    $i_parent_flow_id	= 0;
	    $r_connection		= TD::conn ();
	    $OBJ_SQL_SYNTAX 	= SQLSyntaxFactory::factory ( MYOA_DBMS );
	    $select_expr 		= $OBJ_SQL_SYNTAX->getSelectExprs ( "1" );
	    $table_references 	= $OBJ_SQL_SYNTAX->getTableReferences ( "FLOW_RUN_FEEDBACK" );
	    $conditions 		= Array();
	    array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("RUN_ID", EXPR_OP_IS, $run_id, FIELD_TYPE_INT));
	    array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("PRCS_ID", EXPR_OP_IS, $prcs_id, FIELD_TYPE_INT));
	    array_push($conditions, $OBJ_SQL_SYNTAX->getConditionExpr("USER_ID", EXPR_OP_IS, $login_user_id, FIELD_TYPE_CHAR));
	    $where_definition 	= $OBJ_SQL_SYNTAX->getWhereDefinition($conditions, CONDITION_LOGIC_OP_AND);
	    $sql 				= $OBJ_SQL_SYNTAX->getQuerySQL ( 0 , 0 , $select_expr , $table_references , $where_definition );
	    $r_cursor 			= exequery ( $r_connection , $sql);
	    if($row = mysql_fetch_assoc($r_cursor)){
	           return 1;
	    }
	    return  0;
	}
	function getParentFlowIdByRunId($run_id){
		$i_parent_flow_id	= 0;
		$r_connection		= TD::conn ();
		$OBJ_SQL_SYNTAX 	= SQLSyntaxFactory::factory ( MYOA_DBMS );
	 	$select_expr 		= $OBJ_SQL_SYNTAX->getSelectExprs ( "FLOW_ID" );
	    $table_references 	= $OBJ_SQL_SYNTAX->getTableReferences ( "FLOW_RUN" );
		$condition_exprs 	= $OBJ_SQL_SYNTAX->getConditionExpr ( "RUN_ID" , EXPR_OP_IS , $run_id , FIELD_TYPE_INT );
	    $sql 				= $OBJ_SQL_SYNTAX->getQuerySQL ( 0 , 0 , $select_expr , $table_references , $condition_exprs );
	    $r_cursor 			= exequery ( $r_connection , $sql);
	    if($row = mysql_fetch_assoc($r_cursor)){
			$i_parent_flow_id	= $row["FLOW_ID"];
		}
		return $i_parent_flow_id;	
	}
	/*
	 * 检测工作流程信息是否已经删除，如果删除掉则给出提示并退出
	 * @param int $run_id
	 *            流程流水ID
	 * @param int $page_from
	 *            来源，可能要处理精灵情况下的特殊情况，暂时没有处理 TODO 处理精灵情况下的返回操作
	 */
	function checkWorkRunIfDeleteAndExit($run_id, $from){
		$s_run_name  = checkWorkRunIfDelete($run_id);
		if( $s_run_name === true){
			showDeleteMessage($page_from);
		}
		return $s_run_name;
	}
	
	function checkWorkRunIfDelete($run_id){
		$r_connection 		= TD::conn ();
		$OBJ_SQL_SYNTAX 	= SQLSyntaxFactory::factory ( MYOA_DBMS );
	 	$select_expr 		= $OBJ_SQL_SYNTAX->getSelectExprs ( "DEL_FLAG,RUN_NAME" );
	    $table_references 	= $OBJ_SQL_SYNTAX->getTableReferences ( "FLOW_RUN" );
		$condition_exprs 	= $OBJ_SQL_SYNTAX->getConditionExpr ( "RUN_ID" , EXPR_OP_IS , $run_id , FIELD_TYPE_INT );
	    $sql 				= $OBJ_SQL_SYNTAX->getQuerySQL ( 0 , 0 , $select_expr , $table_references , $condition_exprs );
	    $r_cursor 			= exequery ( $r_connection , $sql);
	    if($row = mysql_fetch_assoc($r_cursor)){
	    	$del_flag = $row["DEL_FLAG"];
	    	if($del_flag == 1){
	    		return true;
	    	}
	    	return $row["RUN_NAME"];
	    }
	    return true;
	}
	
	function checkWorkRunIfEnd($run_id){
		$r_connection 		= TD::conn ();
		$OBJ_SQL_SYNTAX 	= SQLSyntaxFactory::factory ( MYOA_DBMS );
	 	$select_expr 		= $OBJ_SQL_SYNTAX->getSelectExprs ( "END_TIME" );
	    $table_references 	= $OBJ_SQL_SYNTAX->getTableReferences ( "FLOW_RUN" );
		$condition_exprs 	= $OBJ_SQL_SYNTAX->getConditionExpr ( "RUN_ID" , EXPR_OP_IS , $run_id , FIELD_TYPE_INT );
	    $sql 				= $OBJ_SQL_SYNTAX->getQuerySQL ( 0 , 0 , $select_expr , $table_references , $condition_exprs );
		$r_cursor			= exequery($r_connection, $sql);
		if($row = mysql_fetch_assoc($r_cursor)){
			return str_replace("0000-00-00 00:00:00", "", $row["END_TIME"]) == "" ? false : true;
		}
		return false;
	}
	
	function checkHandleAndShowMessage($work_prcs_flag, $flow_id, $run_id, $prcs_key_id, $flow_id, $prcs_id, $flow_prcs, $run_name){
		if($work_prcs_flag != "1" && $work_prcs_flag != "2"){ //非接收办理的情况下提示不能操作
			if(checkWorkRunIfEnd($run_id)){
				$msg_str = _("结束");
			}else if($work_prcs_flag == "3" || $work_prcs_flag == "4"){
				$msg_str = _("转交至下一步");	
			}elseif($work_prcs_flag == '6'){
				$msg_str = _("挂起");
			}else{
				$msg_str = _("收回");
			}
			showHandleMessage($flow_id, $run_id, $prcs_key_id, $flow_id, $prcs_id, $flow_prcs, $run_name, $msg_str);
		}
	}
	
	
	function showHandleMessage($flow_id, $run_id, $prcs_key_id, $flow_id, $prcs_id, $flow_prcs, $run_name, $msg_str){
        $description = $msg_str == '挂起' ? '请到我的工作->挂起工作中恢复！' : '';
		Message("", sprintf(_("流水号：%s 文号：%s 的工作已经%s，您不能办理！".$description), $run_id, $run_name, $msg_str));
        echo '<div align="center">
    		  <input type="button" value="'._("查看表单").'" class="btn" title="'._("查看表单").'" onclick="window.form_view1(\''.$run_id.'\', \''.$flow_id.'\' );//self.parent.frames[\'workflow-data-list\'].view_work(\'\', \''.$run_id.'\', \''.$prcs_key_id.'\', \''.$flow_id.'\', \''.$prcs_id.'\', \''.$flow_prcs.'\');">
    		  <input type="button" id="back_btn" class="btn" value='._("返回").' onclick="if(window.parent.hideForm){window.parent.hideForm();}else{window.location.href=\'/general/workflow/list/\'};">
    		  <input type="button" id="close_btn" class="btn" value='._("关闭").' onclick="TJF_window_close()"></div>
    		  <script>
    		  window.onload = function() {
    			  var close_btn = document.getElementById("close_btn");
    			  var back_btn = document.getElementById("back_btn");
    		          //var id = top.document.getElementById("tabs_container");
    		          var href = window.parent.location.href;
    		          var tt = href.indexOf("input_form");
    			  if(tt<0)
    			  {
    			     close_btn.style.display = "none";
                  }
    			  else
    			  {
    			     back_btn.style.display = "none";
                  }
              }
              workflowGoBackAction("turned");
              
    		  </script>
    		  ';
        exit;	
	}
	/*
	 * @author yuzhaoxi
	 * @time 2014-3-19
	 * @return boolean true  -- have the next prcs
	 *                 false -- there is no next prcs
	 * */
	function haveNextPrcs($run_id,$prcs_id)
	{
	    $free_last_prcs = '0';
	    $sql = "SELECT PRCS_ID FROM FLOW_RUN_PRCS WHERE RUN_ID = '$run_id' order by PRCS_ID desc limit 1 ";
	    $cursor= exequery(TD::conn(),$sql);
	    if($rows = mysql_fetch_array($cursor))
	    {
	        $free_last_prcs = $rows['PRCS_ID'];
	    }
	    if($prcs_id < $free_last_prcs)
	    {
	    	return true;
	    }
	    else
	    {
	    	return false;
	    }
	}
	/*
	 * 当流程被删除后，给出流程删除信息
	 * @param int $page_from
	 *            流程操作的办理入口
	 */
	function showDeleteMessage($page_from){
		Message("",_("此工作已经删除，您不能办理！"));
	    if($page_from=="TASKCENTER"){
	    	echo    '<div align="center">
						<input type="button" id="close_btn" class="btn" value='._("关闭").' onclick="TJF_window_close();">
                    </div>
                    <script>
                    workflowGoBackAction("turned");
                    </script>
                    ';
	    }else{
	    	echo    '<div align="center">
						<input type="button" id="close_btn" class="btn" value='._("关闭").' onclick="TJF_window_close();">
					</div>
					<script>
                    workflowGoBackAction("turned");
                    </script>
					';
	    }
	    exit;
	}
	
?>
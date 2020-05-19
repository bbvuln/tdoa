var s_check_cols = "6FFB0E02FC194508B145FD4B959E3119,3E900C5F3B484A30B663913770A22A74,12FA37C5DB8D4EFEBB369FFB721C627D,70F6DFD4B7DB44EAB8267843D5799CC2";
var s_check_cols2 = "6FFB0E02FC194508B145FD4B959E3119,3E900C5F3B484A30B663913770A22A74,12FA37C5DB8D4EFEBB369FFB721C627D";
function plugin_is_disable(_s_cid, _obj_datacache, _obj_datarow)
{
	if(s_check_cols.indexOf(_s_cid) != -1)
	{
		if(_obj_datacache != undefined && _obj_datarow != undefined)
		{
			var s_col = "col" + get_column_id_by_kid("8B088DC4271340BFBCAA7DB7554C93FA");
			var i_nth = _obj_datacache.get_nth_by_col_name(s_col);
			var s_val = _obj_datarow[i_nth];
			if(s_val == "移动加权平均")
			{
				if(s_check_cols2.indexOf(_s_cid) != -1)
				 	return false;
				else return true;
			}else
			{ 
				if(s_check_cols2.indexOf(_s_cid) != -1)
					return true;
				else return false;
			}
		}else return true;
	}else return false;
}

function plugin_cell_value_changed(_s_cid, _i_seq, _s_val)
{
	if(_s_cid == "8B088DC4271340BFBCAA7DB7554C93FA")
	{
		if(_s_val == "移动加权平均")
		{
			set_column_disable("6FFB0E02FC194508B145FD4B959E3119", _i_seq, false);
			set_column_disable("3E900C5F3B484A30B663913770A22A74", _i_seq, false);
			set_column_disable("12FA37C5DB8D4EFEBB369FFB721C627D", _i_seq, false);
			set_column_disable("70F6DFD4B7DB44EAB8267843D5799CC2", _i_seq, true);
		}else
		{
			set_column_disable("6FFB0E02FC194508B145FD4B959E3119", _i_seq, true);
			set_column_disable("3E900C5F3B484A30B663913770A22A74", _i_seq, true);
			set_column_disable("12FA37C5DB8D4EFEBB369FFB721C627D", _i_seq, true);
			set_column_disable("70F6DFD4B7DB44EAB8267843D5799CC2", _i_seq, false);								
		}
	}
}
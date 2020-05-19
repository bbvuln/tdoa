function GetCurCalender()
{
  var d, s = "", str;
  d = new Date();
  s += d.getYear() + "-";
  var val = d.getMonth() + 1;
  str = val.toString();
  if(str.length == 1) str = "0" + str;
  s += str + "-";
  val = d.getDate();
  str = val.toString();
  if(str.length == 1) str = "0" + str;
  s += str;
  s += " ";
  val = d.getHours();
  str = val.toString();
  if(str.length == 1) str = "0" + str;
  s += str + ":";
  val = d.getMinutes();
  str = val.toString();
  if(str.length == 1) str = "0" + str;
  s += str + ":";
  val = d.getSeconds();
  str = val.toString();
  if(str.length == 1) str = "0" + str;
  s += str;
  return (s);
}

function BatchImportFile()
{
	CellWeb2.ClearActiveSheet();
	CellWeb2.LoadFile();
	var str, res = "";
	var content_row_sz = CellWeb2.GetContentRowCount();
	var content_col_sz = CellWeb2.GetContentColCount();
	if(content_row_sz <= 2) return;

	var i = 0, j = 0, k = 0, tab_cz = 0;
	var arr_rect;
	var col_span, def_col_span, row_span, tab_name, tab_id, col_name, col_id;
	var obj_tab_def = {};
	while(i < content_col_sz - 1)
	{
		str = CellWeb2.CheckInMergeRange(i, 0);
		arr_rect = str.split(" ");
		col_span = parseInt(arr_rect[2]) - parseInt(arr_rect[0]) + 1;
		//if(i == 0)
		{
			tab_name = CellWeb2.DoGetCellData(i, 0, tab_name);
			def_col_span = col_span;
		}
        if(tab_name == "填报情况")
        {
            break;
        }
		i += col_span;
        obj_tab_def[tab_name] = [];
        for(var sz = 0; sz < col_span; sz++, j++)
        {
            col_name = CellWeb2.DoGetCellData(j, 1, col_name);
            obj_tab_def[tab_name].push(col_name);
        }
		tab_cz++;
	}
    i = 2;
    var arr_datas = [];
    for(; i < content_row_sz - 1; )
    {
        //检查记录跨度
        var i_row_span = 1;
        for(j = 0; j < content_col_sz - 1; j++)
        {
            str = CellWeb2.CheckInMergeRange(j, i);
            arr_rect = str.split(" ");
            k = parseInt(arr_rect[3]) - parseInt(arr_rect[1]) + 1;
            if(k > i_row_span)
            {
                i_row_span = k;
            }
        }
        j = 0;
        //var arr_data = [];
        var obj_tab_datas = {};
        for(tab_name in obj_tab_def)
        {
            obj_tab_datas[tab_name] = [];
            for(k = 0; k < i_row_span; k++)
            {
                var arr_row = [];
                var b_has_data = false;
                for(var sz = 0, len = obj_tab_def[tab_name].length; sz < len; sz++)
                {
                    str = CellWeb2.CheckInMergeRange(j + sz, i + k);
                    arr_rect = str.split(" ");
                    str = CellWeb2.DoGetCellData(j + sz, i + k, str);
                    if((j + sz) == arr_rect[0] && (i + k) == arr_rect[1])
                    {
                        arr_row.push(str);
                    }
                    if(str != "" && !b_has_data)
                    {
                        b_has_data = true;
                    }
                }
                //注意每个表都要有占位记录
                if(b_has_data || k == 0)
                {
                    obj_tab_datas[tab_name].push(arr_row);
                }
            }
//            if(obj_tab_datas[tab_name].length > 0)
//            {
//                arr_data.push(obj_tab_datas);
//            }
            j += obj_tab_def[tab_name].length;
        }
        if(obj_tab_datas)
        {
            arr_datas.push(obj_tab_datas);
        }

        i += i_row_span;
    }

    $.ajax({
        url: 'action.php',
        type: 'post',
        data: {action: "batch_import", repid: repid, tabs: obj_tab_def, datas: arr_datas},
        dataType: 'json',
        async: false
    });
//	if(tab_cz > 2)
//	{
//		alert("当前版本不支持多数据表批量导入！"); return;
//	}
//	var sep = ",", sep1 = ";";
//	res = tab_name;
//	for(i = 1; i < content_row_sz - 1; i++)
//	{
//		res += sep1;
//		for(j = 0; j < def_col_span; j++)
//		{
//			if(j > 0) res += sep;
//			str = CellWeb2.DoGetCellData(j, i, str);
//			str = str.replace(",", "#002C`");
//			str = str.replace(";", "#FE54`");
//			res += str;
//		}
//	}
//	if(res != "")
//	{
//		window.thisForm.action.value = "batch_import";
//		window.thisForm.item_para.value = res;
//		window.thisForm.submit();
//	}
}
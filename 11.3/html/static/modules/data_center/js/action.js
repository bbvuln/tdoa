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
	var str, res = "";;
	var content_row_sz = CellWeb2.GetContentRowCount();
	var content_col_sz = CellWeb2.GetContentColCount();
	if(content_row_sz <= 2) return;
	var i = 0, j, k, tab_cz = 0;
	var arr_rect;
	var col_span, def_col_span, row_span, tab_name, tab_id, col_name, col_id;
	i = 0;
	while(i < content_col_sz - 1)
	{
		str = CellWeb2.CheckInMergeRange(i, 0);
		arr_rect = str.split(" ");
		col_span = parseInt(arr_rect[2]) - parseInt(arr_rect[0]) + 1;
		if(i == 0)
		{
			tab_name = CellWeb2.DoGetCellData(i, 0, tab_name);
			def_col_span = col_span;
		}
		i += col_span;
		tab_cz++;
	}
	if(tab_cz > 2)
	{
		alert("当前版本不支持多数据表批量导入！"); return;
	}
	var sep = ",", sep1 = ";"; 
	res = tab_name;
	for(i = 1; i < content_row_sz - 1; i++)
	{
		res += sep1;
		for(j = 0; j < def_col_span; j++)
		{
			if(j > 0) res += sep;
			str = CellWeb2.DoGetCellData(j, i, str);
			str = str.replace(",", "#002C`");
			str = str.replace(";", "#FE54`");
			res += str;
		}
	}
	if(res != "")
	{
		window.thisForm.action.value = "batch_import";
		window.thisForm.item_para.value = res;
		window.thisForm.submit();
	}
}
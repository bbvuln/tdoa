var radio_count=0;
function tb_parse_cal_and_colvalue(attr_value, coltype){
    var lastIndex = attr_value.lastIndexOf('|');
    var result = {'attr_val':attr_value,'attr_other_val':''};
    if(lastIndex !== -1){
        var str1 = attr_value.substring(0, lastIndex);
        var str2 = attr_value.substring(lastIndex+1, attr_value.length);
        //计算公式，保留小数位数的解析
        if(coltype == 'cal'){
            result.attr_val = str1;
            result.attr_other_val = str2;
            return result;
        }
        var str1_arr = str1.split(',');
        var num = 0;
        for(var i=0;i<attr_value.length;i++){
            switch (coltype){
                //下拉列表、单选框内容解析
                case 'select':
                case 'radio':
                    if(str1_arr[i] === str2){
                        result.attr_val = str1;
                        result.attr_other_val = str2;
                        return result;
                    }
                    break;
                //筛选框内容解析
                case 'checkbox':
                    str2_arr = str2.split(',');
                    for(var j=0;j<str2.length;j++){
                        if(str1_arr[i] == str2_arr[j]){
                            num++;
                        }
                    }
                    if(num == str2_arr.length){
                        result.attr_val = str1;
                        result.attr_other_val = str2;
                        return result;
                    }
                    break;
            }
        }
    }
    return result;
}

function td_addnew_multiple(lv_tb_id,read_only,row_value,is_del,new_width)
{
    var tb_id = lv_tb_id.substr(3);
    var add_row_num = parseInt(document.getElementById('add_btn_num_'+tb_id).value);

    for(var i=0; i<add_row_num; i++)
    {
        tb_addnew(lv_tb_id,read_only,row_value,is_del,new_width);
    }
}

function tb_addnew(lv_tb_id,read_only,row_value,is_del,new_width)
{
    radio_count++;
    var mytable=document.getElementById(lv_tb_id);
    if(typeof mytable == "undefined" || mytable == null)
    {
        return;
    }

    var size_array=mytable.getAttribute("FormData").split("`");
    var sum = mytable.getAttribute("lv_sum");
    var cal = mytable.getAttribute("lv_cal");
    var coltype=mytable.getAttribute("lv_coltype");
    var colvalue=mytable.getAttribute("lv_colvalue");
    var readonly = mytable.getAttribute("readonly");
    var hidden_item = mytable.getAttribute("hidden_item");
    var add_priv = mytable.getAttribute("add_priv") || 0;
    row_value=row_value.replace(/&lt;BR&gt;/g, "\r\n");
    row_value=row_value.replace(/&lt;br&gt;/g, "\r\n");
    row_value=row_value.replace(/<br>/g, "\r\n");
    new_width = new_width==null ? false : new_width;
    var row_value_array=row_value.split("`");
    var readonly_array=readonly.split("`");
    if(mytable.getAttribute("data_table") != null)
    {
        var data_fld_name=mytable.getAttribute("data_fld_name");
        var data_table=mytable.getAttribute("data_table");
        var data_field=mytable.getAttribute("data_field");
        var dataQuery=mytable.getAttribute("data_query");
        var data_field_array = data_field.split("`");
    }
    var sum_flag=0;
    var cell_html="";
    if(sum!='')
    {
        var sum_array=sum.split("`");
        for(i=0;i<sum_array.length;i++)
        {
            if(sum_array[i]==1)
            {
                sum_flag=1;
                break;
            }
        }
    }
    if(cal!='')
        var cal_array=cal.split("`");

    if(data_field!="")
    {
        var data_field_array=data_field.split("`");
    }
    var coltype_array=mytable.getAttribute("lv_coltype").split("`");
    var colvalue_array=mytable.getAttribute("lv_colvalue").split("`");

    maxcell=mytable.rows[0].cells.length;
    if(mytable.rows.length==1 || sum_flag==0)
        mynewrow = mytable.insertRow(-1);
    else
        mynewrow = mytable.insertRow(mytable.rows.length-1);
    //标识行id
    var rowId = lv_tb_id+"_r"+mynewrow.rowIndex;
    mynewrow.setAttribute("id", rowId);
    //序号
    mynewcell=mynewrow.insertCell(-1);
    mynewcell.style.textAlign = "center";
    mynewcell.innerHTML = mynewrow.rowIndex;
    for(i=0;i<maxcell-2;i++)
    {
        mynewcell=mynewrow.insertCell(-1);

        //标识列id
        var cellId = rowId+"_c"+mynewcell.cellIndex
        mynewcell.setAttribute("id", cellId);
        if(data_field_array && data_field_array[i] != "")
        {
            mynewcell.setAttribute("field", data_field_array[i]);
        }

        //列表项空数据使用getRunData获取后是不进行处理的，在这里取到的是undefined
        if(row_value_array[i] == undefined)
        {
        	row_value_array[i] = "";
        }else{
            row_value_array[i] = row_value_array[i].replace(/\[0x60\]/g, '`');
            row_value_array[i] = row_value_array[i].replace(/"/g, '&quot;');
        }
        if(read_only == "1"){
			//办理中无修改权限单行与多行文本框yc
			if(coltype_array[i]=='textarea')
			{
				cell_html="<textarea ";
				cell_html+="rows=2";
                if(new_width == 'false' || new_width === false || typeof(new_width) == 'undefined')
                {
                    cell_html+=" cols="+ size_array[i];
                    var temp_width = "";
                }
                else
                {
                    var temp_width = "width: "+ (size_array[i]-1) +"px; height: 100%; padding: 0px; border: 0px; background:#f9fbd5;";
                }
				if(cal_array && cal_array[i]!='')
                {
                    cell_html+=" readonly class=BigStatic";
                    // var temp_bgcolor = "";
                }
				else
                {
                    cell_html+=" readonly class=ConcelBigInput";
                    // var temp_bgcolor = "background:#f9fbd5;";
                }
                cell_html+=" style=\"line-height:normal;background:#f9fbd5; "+ temp_width +"\"";
				cell_html += ">";
				if(row_value!="")
					cell_html+= row_value_array[i];
				cell_html+="</textarea>";
				mynewcell.innerHTML=cell_html;

			}
			else if(coltype_array[i]=='text')
			{
				cell_html="<input type=text ";
				// cell_html+=" size="+ size_array[i];
                if(new_width == 'false' || new_width === false || typeof(new_width) == 'undefined')
                {
                    cell_html+=" size="+ size_array[i];
                    var temp_width = "";
                }
                else
                {
                    var temp_width = "width: "+ (size_array[i]-1) +"px; height: 100%; padding: 0px; border: 0px;background:#f9fbd5;";
                }
				if(row_value!="")
					cell_html+=" value=\""+ row_value_array[i]+"\"";
				if(cal_array && cal_array[i]!='')
                {
                    cell_html+=" readonly class=BigStatic";
                    // var temp_bgcolor = "";
                }
				else
                {
                    cell_html+=" readonly class=ConcelBigInput";
                    // var temp_bgcolor = " background:#f9fbd5;";
                }
                cell_html+=" style=\"line-height:normal;background:#f9fbd5; "+ temp_width +"\"";
				cell_html+=">";
				mynewcell.innerHTML=cell_html;

			}
			else
			{
				mynewcell.innerHTML=row_value_array[i];
			}

        }
        else
        {
            switch(coltype_array[i])
            {
                case 'text':
                    cell_html="<input type=text ";
                    // new_width = false;
                    if(new_width == 'false' || new_width === false || typeof(new_width) == 'undefined')
                    {
                        cell_html+=" size="+ size_array[i];
                        var temp_width = "";
                    }
                    else
                    {
                        var temp_width = "width: "+ (size_array[i]-1) +"px; height: 100%; padding: 0px; border: 0px;";
                    }
                    if(row_value!="")
                       cell_html+=" value=\""+ row_value_array[i]+"\"";
                    if((cal_array && cal_array[i]!='') || readonly_array[i] == 1)
                    {
                        cell_html+=" readonly class=BigStatic";
                        var temp_bgcolor = "";
                    }
                    else
                    {
                        cell_html+=" class=ConcelBigInput";
                        var temp_bgcolor = " background:#f9fbd5;";
                    }
                    cell_html+=" style=\"line-height:normal; "+ temp_width + temp_bgcolor + "\"";
                    cell_html+=">";
                    mynewcell.innerHTML=cell_html;
                    break;
                case 'textarea':
                    cell_html="<textarea ";
                    cell_html+="rows=2";
                    if(new_width == 'false' || new_width === false || typeof(new_width) == 'undefined')
                    {
                        cell_html+=" cols="+ size_array[i];
                        var temp_width = "";
                    }
                    else
                    {
                        var temp_width = "width: "+ (size_array[i]-1) +"px; height: 100%; padding: 0px; border: 0px;";
                    }
                    if((cal_array && cal_array[i]!='') || readonly_array[i] == 1)
                    {
                        cell_html+=" readonly class=BigStatic";
                        var temp_bgcolor = "";
                    }
                    else
                    {
                        cell_html+=" class=ConcelBigInput";
                        var temp_bgcolor = "background:#f9fbd5;";
                    }
                    cell_html+=" style=\"line-height:normal; "+ temp_width + temp_bgcolor + "\"";
                    cell_html += ">";
                    if(row_value!="")
                        cell_html+= row_value_array[i];
                    cell_html+="</textarea>";
                    mynewcell.innerHTML=cell_html;
                    break;
                case 'select':
                    if(new_width == 'false' || new_width === false || typeof(new_width) == 'undefined')
                    {
                        // cell_html+=" cols="+ size_array[i];
                        var temp_width = "";
                    }
                    else
                    {
                        var temp_width = 'style="width: '+ (size_array[i]-1) +'px;"';
                    }
                    if(readonly_array[i] == 1)
                        cell_html='<select onfocus="this.defaultIndex=this.selectedIndex;" onchange="this.selectedIndex=this.defaultIndex;" '+ temp_width +'>';
                    else
                        cell_html='<select '+ temp_width +'>';
                    if(colvalue_array[i]!='')
                    {
                        var result = tb_parse_cal_and_colvalue(colvalue_array[i], 'select');
                        colvalue_array[i] = result.attr_val;
                        colvalue_inner_array=colvalue_array[i].split(",");
                        for(var j=0;j<colvalue_inner_array.length;j++)
                        {
                            if(row_value_array[i] == ''){
                                row_value_array[i] = result.attr_other_val;
                            }
                            if(row_value_array[i]==colvalue_inner_array[j])
                                cell_html+="<option value=\""+colvalue_inner_array[j]+"\" selected>"+colvalue_inner_array[j]+"</option>";
                            else
                                cell_html+="<option value=\""+colvalue_inner_array[j]+"\">"+colvalue_inner_array[j]+"</option>";
                        }
                    }
                    cell_html+="</select>";
                    mynewcell.innerHTML=cell_html;
                    break;
                case 'radio':
                    if(colvalue_array[i]!='')
                    {
                        var result = tb_parse_cal_and_colvalue(colvalue_array[i], 'radio');
                        colvalue_array[i] = result.attr_val;
                        colvalue_inner_array=colvalue_array[i].split(",");
                        for(var j=0;j<colvalue_inner_array.length;j++)
                        {
                            if(row_value_array[i] == ''){
                                row_value_array[i] = result.attr_other_val;
                            }
                            if(row_value_array[i]==colvalue_inner_array[j]){
                                if(readonly_array[i]){
                                    cell_html+="<input name='radio"+radio_count+'l'+i+"' onclick=\"return false;\" type=radio value=\""+colvalue_inner_array[j]+"\" checked>"+colvalue_inner_array[j];
                                }else{
                                    cell_html+="<input name='radio"+radio_count+'l'+i+"' type=radio value=\""+colvalue_inner_array[j]+"\" checked>"+colvalue_inner_array[j];
                                }
                            }else{
                                if(readonly_array[i] == 1) {
                                    cell_html += "<input name='radio" + radio_count +'l'+ i + "' onclick=\"return false;\" type=radio value=\"" + colvalue_inner_array[j] + "\">" + colvalue_inner_array[j];
                                }else{
                                    cell_html += "<input name='radio" + radio_count + 'l' +i + "' type=radio value=\"" + colvalue_inner_array[j] + "\">" + colvalue_inner_array[j];
                                }
                            }
                        }
                    }
                    mynewcell.innerHTML=cell_html;
                    break;
                case 'checkbox':
                    var result = tb_parse_cal_and_colvalue(colvalue_array[i], 'checkbox');
                    colvalue_array[i] = result.attr_val;
                    var flag=0;
                    if(row_value!=""){
                        value_array=row_value_array[i].split(',');
                    }else{
                        row_value_array[i] = result.attr_other_val;
                        value_array=row_value_array[i].split(',');
                    }
                    if(colvalue_array[i]!='')
                    {
                        colvalue_inner_array=colvalue_array[i].split(",");
                        for(var j=0;j<colvalue_inner_array.length;j++)
                        {
                            if(value_array.length > 0)
                            {
                                for(var k=0;k <value_array.length;k++)
                                {
                                    if(value_array[k]==colvalue_inner_array[j].replace(/(^\s*)|(\s*$)/g, ""))
                                    {
                                        if(readonly_array[i] == 1){
                                            cell_html+="<input type=checkbox onclick=\"return false;\" value=\""+colvalue_inner_array[j]+"\" checked>"+colvalue_inner_array[j];
                                        }else{
                                            cell_html+="<input type=checkbox value=\""+colvalue_inner_array[j]+"\" checked>"+colvalue_inner_array[j];
                                        }
                                        flag = 1;
                                    }
                                }
                            }
                            if(flag==0){
                                if(readonly_array[i] == 1){
                                    cell_html+="<input type=checkbox onclick=\"return false;\" value=\""+colvalue_inner_array[j]+"\">"+colvalue_inner_array[j];
                                }else{
                                    cell_html+="<input type=checkbox value=\""+colvalue_inner_array[j]+"\">"+colvalue_inner_array[j];
                                }
                            }
                            flag=0;
                        }
                    }
                    mynewcell.innerHTML=cell_html;
                    break;
                case 'datetime':
                    if((cal_array && cal_array[i]!='') || readonly_array[i] == 1)
                        cell_html="<input type=text";
                    else
                        cell_html="<input type=text onClick='WdatePicker()'";
                    // cell_html+=" size="+ size_array[i];
                    if(new_width == 'false' || new_width === false || typeof(new_width) == 'undefined')
                    {
                        cell_html+=" size="+ size_array[i];
                        var temp_width = "";
                    }
                    else
                    {
                        var temp_width = "width: "+ (size_array[i]-1) +"px; height: 100%; padding: 0px; border: 0px;";
                    }
                    if(row_value!="")
                       cell_html+=" value=\""+ row_value_array[i]+"\"";
                    if((cal_array && cal_array[i]!='') || readonly_array[i] == 1)
                    {
                        cell_html+=" readonly class=BigStatic";
                        var temp_bgcolor = "";
                    }
                    else
                    {
                        cell_html+=" class=ConcelBigInput";
                        var temp_bgcolor = "background:#f9fbd5;";
                    }
                    cell_html+=" style=\"line-height:normal; "+ temp_width + temp_bgcolor +"\"";
                    cell_html+=">";
                    mynewcell.innerHTML=cell_html;
                    break;
				case 'dateAndTime':
                    if((cal_array && cal_array[i]!='') || readonly_array[i] == 1)
                        cell_html="<input type=text";
                    else
                        cell_html="<input type=text onClick='WdatePicker({dateFmt:\"yyyy-MM-dd HH:mm:ss\"})'";
                    // cell_html+=" size="+ size_array[i];
                    if(new_width == 'false' || new_width === false || typeof(new_width) == 'undefined')
                    {
                        cell_html+=" size="+ size_array[i];
                        var temp_width = "";
                    }
                    else
                    {
                        var temp_width = "width: "+ (size_array[i]-1) +"px; height: 100%; padding: 0px; border: 0px;";
                    }
                    if(row_value!="")
                       cell_html+=" value=\""+ row_value_array[i]+"\"";
                    if((cal_array && cal_array[i]!='') || readonly_array[i] == 1)
                    {
                        cell_html+=" readonly class=BigStatic";
                        var temp_bgcolor = "";
                    }
                    else
                    {
                        cell_html+=" class=ConcelBigInput";
                        var temp_bgcolor = "background:#f9fbd5;";
                    }
                    cell_html+=" style=\"line-height:normal; "+ temp_width + temp_bgcolor +"\"";
                    cell_html+=">";
                    mynewcell.innerHTML=cell_html;
                    break;
                case 'raw':
                    cell_html="<input type=text ";
                    // cell_html+=" size="+ size_array[i];
                    if(new_width == 'false' || new_width === false || typeof(new_width) == 'undefined')
                    {
                        cell_html+=" size="+ size_array[i];
                        var temp_width = "";
                    }
                    else
                    {
                        var temp_width = "width: "+ (size_array[i]-1) +"px;";
                    }
                    if(row_value!="")
                        cell_html+=" value=\"\"";
                    cell_html+=" readonly class=BigStatic";
                    cell_html+=" style=\"line-height:normal;border-bottom-width:0px; border-left-width:0px; border-top-width:0px; border-right-width:0px;background-color:#fff; padding-left:0px; padding-right:0px; "+ temp_width +"\"";
                    cell_html+=">";
                    mynewcell.innerHTML=cell_html;
                    break;
                default:
                    cell_html="<input type=text ";
                    cell_html+=" size="+ size_array[i];
                    if(row_value!=""){
						cell_html+=" value=\""+ row_value_array[i]+"\"";
					}
                    if(read_only=="1" || (cal_array && cal_array[i]!='') || readonly_array[i] == 1){
						cell_html+=" readonly class=BigStatic";
					}else{
						cell_html+=" class=ConcelBigInput";
					}
                    cell_html+=" style=\"line-height:normal;\"";
                    cell_html+=">";
                    mynewcell.innerHTML=cell_html;
            }
            cell_html="";
        }
    }
    mynewcell=mynewrow.insertCell(-1);
	 mynewcell.style.textAlign = "center";
	 mynewcell.style.width = "70px";
	 //mynewcell.style.height = "100%";
    if(is_del != "")
	{
		mynewcell.innerHTML="<input style='background-color:#ee5a00 ;' type=button value=\""+td_lang.global.delete_1+"\" onclick=tb_delete('"+lv_tb_id+"',this)>";//删除
	}
	if(add_priv == 1)
	{
		
		mynewcell.innerHTML="<input type=button style='background-color:#3aabf9 ' ; value='插入' onclick=tb_insert('"+lv_tb_id+"',this)>"+ mynewcell.innerHTML;//新增
	}
    if(data_table && data_table != "" && read_only!="1")
    {
        mynewcell.innerHTML = "<input style='background-color:#3aabf9 ;' type=button value=\""+td_lang.global.select +"\" onclick=list_data_picker(this,'"+data_table+"','"+data_field+"','"+data_fld_name+"','"+dataQuery+"','"+readonly+"','"+hidden_item+"')>" + mynewcell.innerHTML;//选择
    }
 if(sum_flag==1 && mytable.rows.length==2)
        tb_add_sum(lv_tb_id,sum,sum_flag,cal,new_width);

}

function tb_add_sum(lv_tb_id,sum,sum_flag,cal,new_width)
{
    var mytable=document.getElementById(lv_tb_id);

    if(typeof mytable == "undefined" || mytable == null)
    {
        return;
    }

    var size_array=mytable.getAttribute("FormData").split("`");
    sum = "0`"+sum;
    cal = "`"+cal;
    var sum_array=sum.split("`");
    var maxcell=mytable.rows[0].cells.length;//table length
    //增加合计
    sumrow=mytable.insertRow(-1);
    sumrow.setAttribute('id',lv_tb_id+'_sum');
    for(i=0;i<maxcell-1;i++)
    {
        sumcell=sumrow.insertCell(-1);
        if(sum_array && sum_array[i]==1)
        {
            if(new_width == 'false' || new_width === false || typeof(new_width) == 'undefined')
            {
                var temp_width = "";
                var temp_size = "size="+size_array[i-1];
            }
            else
            {
                var temp_width = "width:"+((size_array[i-1])-11)+"px";
                var temp_size = "";
            }
            cell_html="<input type=text style='border:none;background:#ffffff;text-align:right;"+temp_width+"' "+temp_size+" readonly class=BigStatic>";
            sumcell.innerHTML=cell_html;
        }
    }
    sumcell=sumrow.insertCell(-1);
     sumcell.style.textAlign = "center";
    // sumcell.style.height = "24px";
    sumcell.innerHTML="<input type=button style='background-color:#3aabf9 ' value=\""+td_lang.global.total+"\" onclick=tb_sum('"+lv_tb_id+"','"+sum+"')>";//合计

    var func = function(){
        tb_sum(lv_tb_id, sum, cal);
        var func = arguments.callee;
        setTimeout(func, 2000);
    }
    func();
    //setInterval(tb_sum(lv_tb_id,sum),500);
}

function tb_delete(lv_tb_id,del_btn)
{
  var mytable=document.getElementById(lv_tb_id);
    if(typeof mytable == "undefined" || mytable == null)
    {
        return;
    }
    mytable.deleteRow(del_btn.parentNode.parentNode.rowIndex);
    if(mytable.rows.length==2 && document.all(lv_tb_id+"_sum"))
    mytable.deleteRow(1);
     //重新计算序号
    for(var i = 1; i < mytable.rows.length; i++)
    {
        var row_obj = mytable.rows[i];//获取每一行信息
        if(mytable.rows[i].id != lv_tb_id+"_sum")
        {
            for(j=1;j<row_obj.cells.length-1;j+=1)
            {
                row_obj.cells[j].id = lv_tb_id+"_r"+i+'_c'+j;
            }
            row_obj .id=lv_tb_id+"_r"+i;
            row_obj.cells[0].innerHTML = i;
        }
    }
}
function tb_insert(lv_tb_id,in_btn)
{
	var mytable=document.getElementById(lv_tb_id);
	if(typeof mytable == "undefined" || mytable == null)
    {
        return;
    }
	radio_count++;
	var coltype_array=mytable.getAttribute("lv_coltype").split("`");
	var cur_obj = in_btn.parentNode.parentNode;
	var clone_obj = cur_obj.cloneNode(true) || '';
	if(clone_obj == '')
	{
		return;
	}else
	{
		for(var i=1;i<clone_obj.cells.length-1;i++)
		{
			//下拉分析
			if(coltype_array[i-1] == 'select')
			{
			    jQuery(clone_obj.cells[i].childNodes[0]).find('option:selected').removeAttr('selected');
			}else if(coltype_array[i-1] == 'checkbox')
			{
				jQuery(clone_obj.cells[i]).find('input[type="checkbox"]:checked').removeAttr('checked');
			}else if(coltype_array[i-1] == 'radio')
			{
				jQuery(clone_obj.cells[i]).find('input[type="radio"]:checked').removeAttr('checked');
				var radio_obj = jQuery(clone_obj.cells[i]).find('input[type="radio"]') || '';
				if(radio_obj.length > 0)
				{
					for(var m=0;m<radio_obj.length;m++)
					{
						radio_obj.eq(m).attr('name',"radio"+radio_count+"l"+(i-1));
					}
				}
			}else
			{
				clone_obj.cells[i].childNodes[0].value = '';
			}
		}
	}
	var cur_index = cur_obj.rowIndex;
	var cur_node = mytable.childNodes[2].childNodes[cur_index];
	mytable.childNodes[2].insertBefore(clone_obj,cur_node);

     // 重新计算序号
    for(var i = 1; i < mytable.rows.length; i++)
    {
        var row_obj = mytable.rows[i];//获取每一行信息
        if(mytable.rows[i].id != lv_tb_id+"_sum")
        {
            for(j=1;j<row_obj.cells.length-1;j+=1)
            {
                row_obj.cells[j].id = lv_tb_id+"_r"+i+'_c'+j;
            }
            row_obj .id=lv_tb_id+"_r"+i;
            row_obj.cells[0].innerHTML = i;
        }
    }
}
function tb_output(lv_tb_id)
{
    var data_str="";
    var mytable=document.getElementById(lv_tb_id);

    if(typeof mytable == "undefined" || mytable == null )
    {
        return;
    }
    var row_length=mytable.rows.length;
    if(document.getElementById(lv_tb_id+'_sum'))
        row_length--;
    var coltype_array=mytable.getAttribute("lv_coltype").split("`");
    for (i=1; i < row_length; i++)
    {
        for (j=1; j < document.getElementById(lv_tb_id).rows[i].cells.length-1; j++)
        {
            var cell = document.getElementById(lv_tb_id).rows[i].cells[j];
            if(coltype_array[j-1]=="radio" || coltype_array[j-1]=="checkbox")
            {
                if(jQuery("input:radio:checked,input:checkbox:checked",cell).length>0)
                {
                    if(coltype_array[j-1]=="radio")
                       data_str+=jQuery("input:radio:checked",cell).get(0).value;
                    else
                    {
                       jQuery("input:checkbox:checked",cell).each(function(){
                            data_str+=this.value+",";
                       });
                       data_str=data_str.substring(0,data_str.length-1);
                    }
                }
                data_str += "`";
            }
            else if(coltype_array[j-1]=="textarea")
            {
                var the_value = textarea_html = "";
            	if(cell.firstChild == null || cell.firstChild.value == undefined)
            	{
                    the_value = cell.innerHTML;
                    the_value = the_value.replace(/`/g, '[0x60]');
            		textarea_html = the_value+"`";
            	}
            	else
            	{
                    the_value = cell.firstChild.value;
                    the_value = the_value.replace(/`/g, '[0x60]');
                    textarea_html = the_value+"`";
            	}

                textarea_html = textarea_html.replace(/\r\n/g, "&lt;br&gt;");
                textarea_html = textarea_html.replace(/\n/g, "&lt;br&gt;");
                data_str+=textarea_html;
            }
            else
            {
                var the_value = '';
            	if(cell.firstChild == null || cell.firstChild.value == undefined)
            	{
                    the_value = cell.innerHTML;
                     the_value = the_value.replace(/`/g, '[0x60]');
            		data_str+=the_value+"`";
            	}
            	else
            	{
                    the_value = cell.firstChild.value;
                    the_value = the_value.replace(/`/g, '[0x60]');
            		data_str+=the_value+"`";
            	}
            }
        }
        data_str = data_str.replace(/\r\n/g, "&lt;br&gt;");
        data_str+="\n";
    }
    lv_id="DATA_"+lv_tb_id.substr(3);
    eval("document.form1."+lv_id+".value=data_str");
}
function counterSign_submit(dataStr)
{
	var dataArr = dataStr.split(',');
	if(dataArr.length > 0)
	{
		for(var i=0;i<dataArr.length;i++)
		{
			if(dataArr[i] == '')
				continue;
			var defaultValue = '{' + '"countersign":{';
			jQuery('#'+dataArr[i]+' div[writable_flag="true"]').find("textarea,span").each(function(i,v) {
				var signValue = jQuery(v).attr('localName') == 'textarea' ? jQuery(v).val() : jQuery(v).text();
				
				
				var signName = jQuery(v).attr('name');
				if(jQuery(v).attr('localName') == 'textarea')
				{
					if(signValue)
					{
						signValue = signValue.replace(/\\/g, "\\\\");
                        signValue = signValue.replace(/\"/g, "\\\"");
					}
					defaultValue += '"signcontent":' + '"' + signValue + '",';
				}
                if (jQuery(v).attr('name') == 'signuser') {
                    defaultValue += '"signuser":' + '"' + signValue + '",';
                }
                if (jQuery(v).attr('name') == 'signorg') {
                    defaultValue += '"signorg":' + '"' + signValue + '",';
                }
                if (jQuery(v).attr('name') == 'signtime') {
                    defaultValue += '"signtime":' + '"' + signValue + '",';
                }
                if (jQuery(v).attr('name') == 'signrole') {
                    defaultValue += '"signrole":' + '"' + signValue + '",';
                }
				if (jQuery(v).attr('name') == 'websign') {
					var signPositionId = jQuery(v).attr('id') || '';
					if(signPositionId != '' && is_ie)
					{
						var signUid = signPositionId.split('SIGN_POS_')[1];
						var objName_hw = DWebSignSeal.FindSeal(signUid + "_hw", 2);
						var objName_seal = DWebSignSeal.FindSeal(signUid + "_seal", 2);
						if (objName_hw == "" && objName_seal == "")
							sign_val = "";
						else
							sign_val = DWebSignSeal.GetStoreDataEx(signUid+"_hw" + ";" + signUid+"_seal");
						defaultValue += '"websign":' + '"' + sign_val + '",';
						defaultValue += '"soleuid":' + '"' + signUid + '",';
					}
                }
            });
			defaultValue = defaultValue.substring(0, defaultValue.length - 1);
			defaultValue += '}}';
			if(typeof document.form1[dataArr[i]+"_counter"] != 'undefined')
			{
				eval("document.form1."+dataArr[i]+"_counter.value=defaultValue");
			}
		}
	}
}
function LV_Submit()
{
    var lv_tb_id="";
    var tables=document.getElementsByTagName("table");
    for (lv_i=0;lv_i<tables.length; lv_i++)
    {
        if(tables[lv_i].className=="LIST_VIEW")
        {
            lv_tb_id=tables[lv_i].id;
            var lv_num = lv_tb_id.substr(3);
            if(document.form1.READ_ONLY_STR.value.indexOf(','+lv_num+',')<0 && document.form1.READ_ONLY_STR.value.indexOf(lv_num+',') != 0)
            {
                 if(lv_tb_id != ""){
			            tb_output(lv_tb_id);
			           }
            }
        }
    }
}
function tb_sum(lv_tb_id,sum, cal)//合计
{

    var mytable=document.getElementById(lv_tb_id);

    if(typeof mytable == "undefined" || mytable == null)
    {
        return;
    }

    if(mytable.rows.length==1) return;
    var sumrow=mytable.rows[mytable.rows.length-1];
    var sum_array= sum.split("`");
    var cal_array= cal && cal.split("`");
	if(!cal){return};
    for(i=0;i<sum_array.length;i++)
    {
        var sum_value=0;
        var sum_valuek="";
        if(sum_array[i]==1)
        {
            var result = tb_parse_cal_and_colvalue(cal_array[i], 'cal');
            var decimal_digits = result.attr_other_val;

            for(j=1;j<mytable.rows.length-1;j++)
            {
                var child_ojb = mytable.rows[j].cells[i].firstChild
                if(child_ojb && child_ojb.tagName){
					if(mytable.rows[j].cells[i].firstChild.value.indexOf(" ")>=0){ //存在空格去掉空格
						mytable.rows[j].cells[i].firstChild.value=mytable.rows[j].cells[i].firstChild.value.replace(/\s+/g,"");
					}
                	if(isNaN(mytable.rows[j].cells[i].firstChild.value)){
                		var sss = mytable.rows[j].cells[i].firstChild.value.indexOf("%");//兼容列表控件合计中的“%”计算
                    	 	 if(sss > -1 && !isNaN(mytable.rows[j].cells[i].firstChild.value.replace("%",""))){
                    	 	 		sum_value += parseFloat(mytable.rows[j].cells[i].firstChild.value)/100;
                    	 	 }else{
                    	 	 		sum_valuek+="NaN";
                    	 	 }
                	} else {
                		sum_value+=parseFloat(mytable.rows[j].cells[i].firstChild.value.replace(/\s+/g,"")==''?0:mytable.rows[j].cells[i].firstChild.value);
                	}
                } else {

                	 if(isNaN(mytable.rows[j].cells[i].innerText)){
                	 		var sss = mytable.rows[j].cells[i].innerText.indexOf("%");//兼容列表控件合计中的“%”计算
                    	 	 if(sss > -1 && !isNaN(mytable.rows[j].cells[i].innerText.replace("%",""))){
                    	 	 		sum_value += parseFloat(mytable.rows[j].cells[i].innerText)/100;
                    	 	 }else{
                    	 	 		sum_valuek+="NaN";
                    	 	}
                	 } else {
                	 	 sum_value+=parseFloat(mytable.rows[j].cells[i].innerText==''?0:mytable.rows[j].cells[i].innerText);
                	 }
                }

            }
            if(sum_valuek != "" && sum_value ==0)
                sumrow.cells[i].firstChild.value="0";
            else
                sumrow.cells[i].firstChild.value=(Math.round(sum_value*10000)/10000);
        }
    }
}

function tb_cal(lv_tb_id,cal,list_priv)
{
    var cell_value;
    var mytable=document.getElementById(lv_tb_id);

    if(typeof mytable == "undefined" || mytable == null)
    {
        return;
    }
    if(!mytable){
    	  return;
    }
    var coltype_array=mytable.getAttribute("lv_coltype").split("`");
    var read_only=mytable.getAttribute("read_only");//获取可写字？

    if(mytable.rows.length==1)
    {
        return;
    }

    if(cal)
    {
        var cal_array=cal.split("`");
        for(i=1;i<mytable.rows.length;i++)
        {
        	if(mytable.rows[i].id == lv_tb_id+"_sum")
        	    continue;
            for(k=0;k<cal_array.length-1;k++)
            {
                var result = tb_parse_cal_and_colvalue(cal_array[k], 'cal');
                var cal_str=result.attr_val;
                var decimal_digits = result.attr_other_val;

                if(read_only == 1){
                    continue;
                }else{
                    if(cal_str=="" || !mytable.rows[i].cells[k].firstChild || (!(list_priv == "" || list_priv == null || typeof list_priv == "undefined" || typeof(list_priv[k]) == 'undefined' || typeof(list_priv[k]['priv']) =='undefined') && list_priv[k]['priv'] >= 2)){
                        continue;
                    }
                }

                for(j=1;j<mytable.rows[i].cells.length-1;j++)
                {
                    var re = new RegExp("\\["+j+"\\]","ig");
                    var cell = mytable.rows[i].cells[j];

                    if(coltype_array[j-1]=="radio" || coltype_array[j-1]=="checkbox")
                    {
                        if(jQuery("input:radio:checked,input:checkbox:checked",cell).length>0)
                        {
                            cell_value=parseFloat(jQuery("input:radio:checked,input:checkbox:checked",cell).get(0).value);

                        }
                        else
                            cell_value=0;
                    }
                    else
                    {
                        if(cell.firstChild == null || isNaN(cell.firstChild.value) || cell.firstChild.value=="" || typeof(cell.firstChild.value) =="undefined"){
                            if(cell.firstChild == null || typeof(cell.firstChild.value) =="undefined" || cell.firstChild.value==""){
                                cell_value= 0;
                            }else{
                                var sss = cell.firstChild.value.indexOf("%");
                                if(sss > -1 && !isNaN(cell.firstChild.value.replace("%",""))){
                                    cell_value = parseFloat(cell.firstChild.value)/100;
                                }else{
                                    cell_value= 0;
                                }
                            }

                        }else{
                            cell_value=parseFloat(cell.firstChild.value);
                        }
                    }

                    cal_str=cal_str.replace(re,"("+cell_value+")");
                }
                if(decimal_digits !== ''){
                    mytable.rows[i].cells[k+1].firstChild.value=isNaN(eval(cal_str))?0:(Math.round(parseFloat(eval(cal_str))*10000)/10000).toFixed(decimal_digits);
                }else{
                    mytable.rows[i].cells[k+1].firstChild.value=isNaN(eval(cal_str))?0:Math.round(parseFloat(eval(cal_str))*10000)/10000;
                }
            }
        }
    }
}

//---- 计算控件相关函数 ----
function calc_rmb(currencyDigits)
{
  // Constants:
  var MAXIMUM_NUMBER = 99999999999.99;
  // Predefine the radix characters and currency symbols for output:
  var CN_ZERO = td_lang.general.workflow.msg_16;//"零"
  var CN_ONE = td_lang.general.workflow.msg_17;//"壹"
  var CN_TWO = td_lang.general.workflow.msg_18;//"贰"
  var CN_THREE = td_lang.general.workflow.msg_19;//"叁"
  var CN_FOUR = td_lang.general.workflow.msg_31;//"肆"
  var CN_FIVE = td_lang.general.workflow.msg_32;//"伍"
  var CN_SIX = td_lang.general.workflow.msg_33;//"陆"
  var CN_SEVEN = td_lang.general.workflow.msg_34;//"柒"
  var CN_EIGHT = td_lang.general.workflow.msg_35;//"捌"
  var CN_NINE = td_lang.general.workflow.msg_36;//"玖"
  var CN_TEN = td_lang.general.workflow.msg_37;//"拾"
  var CN_HUNDRED = td_lang.general.workflow.msg_38;//"佰"
  var CN_THOUSAND = td_lang.general.workflow.msg_39;//"仟"
  var CN_TEN_THOUSAND = td_lang.general.workflow.msg_40;//"万"
  var CN_HUNDRED_MILLION = td_lang.general.workflow.msg_41;//"亿"
  var CN_DOLLAR = td_lang.general.workflow.msg_42;//"元"
  var CN_TEN_CENT = td_lang.general.workflow.msg_43;//"角"
  var CN_CENT = td_lang.general.workflow.msg_44;//"分"
  var CN_INTEGER = td_lang.general.workflow.msg_45;//"整"

  // Variables:
  var integral; // Represent integral part of digit number.
  var decimal; // Represent decimal part of digit number.
  var outputCharacters; // The output result.
  var parts;
  var digits, radices, bigRadices, decimals;
  var zeroCount;
  var i, p, d;
  var quotient, modulus;

  // Validate input string:
  currencyDigits = currencyDigits.toString();
  if (currencyDigits == "") {
     return "";
  }
  if (currencyDigits.match(/[^,-.\d]/) != null) {
     return "";
  }
  if ((currencyDigits).match(/^[+-]?((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
     return "";
  }

  // Normalize the format of input digits:
  currencyDigits = currencyDigits.replace(/,/g, ""); // Remove comma delimiters.
  currencyDigits = currencyDigits.replace(/^0+/, ""); // Trim zeros at the beginning.
  // Assert the number is not greater than the maximum number.
  if (Number(currencyDigits) > MAXIMUM_NUMBER) {
     return "";
  }

  // Process the coversion from currency digits to characters:
  // Separate integral and decimal parts before processing coversion:
  parts = currencyDigits.split(".");
  if (parts.length > 1) {
     integral = parts[0];
     decimal = parts[1];
     // Cut down redundant decimal digits that are after the second.
    if(decimal.length > 2)
	{
		var RoundingNum = decimal.substr(2,1);
		decimal = decimal.substr(0, 2);
		if(RoundingNum > 4)
		{
			decimal = parseInt(decimal) + 1;
			decimal = decimal.toString();
		}
	}else
	{
		decimal = decimal.substr(0, 2);
	}
  }
  else {
     integral = parts[0];
     decimal = "";
  }
  // Prepare the characters corresponding to the digits:
  digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE);
  radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
  bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
  decimals = new Array(CN_TEN_CENT, CN_CENT);
  // Start processing:
  outputCharacters = "";
  // Process integral part if it is larger than 0:
  if (Number(integral) > 0) {
     zeroCount = 0;
     for (i = 0; i < integral.length; i++) {
         p = integral.length - i - 1;
         d = integral.substr(i, 1);
         quotient = p / 4;
         modulus = p % 4;
         if (d == "0") {
            zeroCount++;
         }
         else
         {
            if (zeroCount > 0)
            {
               outputCharacters += digits[0];
            }
            zeroCount = 0;
            outputCharacters += digits[Number(d)] + radices[modulus];
         }
         if (modulus == 0 && zeroCount < 4) {
            outputCharacters += bigRadices[quotient];
         }
     }
     outputCharacters += CN_DOLLAR;
 }else if (Number(integral) < 0) {
     var _integral=integral.split('-');
     integral = _integral[1];
     zeroCount = 0;
     for (i = 0; i < integral.length; i++) {
         p = integral.length - i - 1;
         d = integral.substr(i, 1);
         quotient = p / 4;
         modulus = p % 4;
         if (d == "0") {
            zeroCount++;
         }
         else
         {
            if (zeroCount > 0)
            {
               outputCharacters += digits[0];
            }
            zeroCount = 0;
            outputCharacters += digits[Number(d)] + radices[modulus];
         }
         if (modulus == 0 && zeroCount < 4) {
            outputCharacters += bigRadices[quotient];
         }
     }
     outputCharacters += CN_DOLLAR;
     outputCharacters = '负'+ outputCharacters;
  }
	// Process decimal part if there is:
	if (decimal != "" && decimal.match(/^0{2}$/) == null) {
		 for (i = 0; i < decimal.length; i++) {
			  d = decimal.substr(i, 1);
			  d_next = decimal.substr(i+1,1);
			  // if (d != "0") {
			if (d != "0" && d != undefined) {
			//if (d_next != "0" && d_next != undefined) {
				if (d != "0") {
					outputCharacters += digits[Number(d)] + decimals[i];
				} else {
					outputCharacters += digits[Number(d)];
				}
			}
		 }
	}
  // Confirm and return the final output string:
  if (outputCharacters == "") {
      outputCharacters = CN_ZERO + CN_DOLLAR;
  }
  if (decimal == "") {
      outputCharacters += CN_INTEGER;
  }
  //outputCharacters = CN_SYMBOL + outputCharacters;
  return outputCharacters;
}

function calc_max()
{
	if(arguments.length==0)
	  return;
  var max_num=arguments[0];
	for(var i=0;i<arguments.length;i++)
	  max_num=Math.max(max_num,arguments[i]);
	return parseFloat(max_num);
}

function calc_min()
{
	if(arguments.length==0)
	  return;
  var min_num=arguments[0];
	for(var i=0;i<arguments.length;i++)
	  min_num=Math.min(min_num,arguments[i]);
	return parseFloat(min_num);
}

function calc_mod()
{
	if(arguments.length==0)
	  return;
  var first_num=arguments[0];
  var second_num=arguments[1];
  var result = first_num % second_num;
  result = isNaN(result)?"":parseFloat(result);
  return result;
}

function calc_abs(val)
{
  return Math.abs(parseFloat(val));
}

function calc_avg()
{
    if(arguments.length==0)
	    return;
	var sum = 0;
	for(var i = 0; i < arguments.length; i++)
	{
	    sum+=parseFloat(arguments[i]);
	}
	return parseFloat(sum/arguments.length);
}


function calc_day(val)
{
	return val==0?0:Math.floor(val/86400);
}

function calc_hour(val)
{
	return val==0?0:Math.floor(val/3600);
}

function calc_date(val)
{
    return (val>=0) ? Math.floor(val/86400)+td_lang.general.workflow.msg_46+Math.floor((val%86400)/3600)+td_lang.general.workflow.msg_47+Math.floor((val%3600)/60)+td_lang.general.workflow.msg_44+Math.floor(val%60)+td_lang.general.workflow.msg_48:td_lang.general.workflow.msg_49;//'日期格式无效'
}

function calc_getval(val)
{
    var obj = document.getElementsByName(val);

    if(obj.length==0)
        return 0;

    if(obj[0].className == 'LIST_VIEW')
    {
        return document.getElementById("LV_"+val.substring(5));
    }
	var tempObj = obj[0];
	var flag = false;
	if(obj[0].type == 'radio')
	{
		for(var i=0;i<obj.length;i++)
		{
			if(obj[i].checked == true)
			{
				tempObj = obj[i];
				flag = true;
			}
		}
	}
	var vVal = tempObj.type == 'radio' && flag==false ? '' : tempObj.value;
    if(jQuery.trim(vVal) != ''){
        var dateFormat = jQuery(tempObj).siblings("img[value='"+tempObj.title+"']").attr('date_format');
        var is_dateCtrl = jQuery(tempObj).siblings("is_dateCtrl[value='"+tempObj.title+"']")[0];
        if(typeof(dateFormat) != "undefined")
        {
            // 将时间格式化为统一格式 DJ 14/10/8
            vVal = F_Date_format(vVal, dateFormat);
        }
        else if(typeof(is_dateCtrl) != "undefined")
        {
            var dateFormat = jQuery(tempObj).siblings("is_dateCtrl[value='"+tempObj.title+"']").attr('date_format');
            // 将时间格式化为统一格式 DJ 14/10/8
            vVal = F_Date_format(vVal, dateFormat);
        }
    }
    //判断是否为时间
	if(vVal.indexOf("-")>0)
	{

	  //eval("date_flag_"+flag+"=1");
	  vVal=vVal.replace(/\-/g,"/");
	  var d=new Date(vVal);
	  return d.getTime()/1000;
	}else if(vVal.indexOf("%")>0){ //处理%
		 vVal = parseFloat(vVal)/100;
	}else if(vVal.indexOf(" ")>=0){
		tempObj.value = tempObj.value.replace(/\s+/g,"");
		vVal = tempObj.value;
	}else if(is_ths(vVal)){
		vVal = calc_ths_rev(vVal);
	}else if(vVal.indexOf("|")>0){
		vVal = vVal.split("|")[0];
	}else if(vVal=="" || isNaN(vVal)){
        vVal=0;
	}
    return parseFloat(vVal);
}

function F_Date_format(date, format)
{
	date = date.split(/\D/);
	format = format.split(/[^yMdhHms]+/);
	var real_format = 'y-M-d H:m:s';
	for(var k in format)
	{
		if((/([yMdhHms])+/).test(format[k]))
		{
			// 兼容两位年份的情况
			if(format[k]=='y' || format[k]=='yy')
			{
				if(78<=date[k] && 99>=date[k])
				{
					date[k] = '19' + date[k];
				}
				else
				{
					date[k] = '20' + date[k];
				}
			}
			real_format = real_format.replace(RegExp.$1, date[k]);
		}
	}

	var date_now = new Date();
	var o =
	{
		"M+" : date_now.getMonth()+1, //month
		"d+" : date_now.getDate(),    //day
		"h+" : '00',   //hour
		"H+" : '00',   //hour
		"m+" : '00', //minute
		"s+" : '00' //second
		// "q+" : Math.floor((date_now.getMonth()+3)/3),  //quarter
		// "S" : date_now.getMilliseconds() //millisecond
	};
	if(/(y+)/.test(real_format))
	{
		real_format = real_format.replace(RegExp.$1,(date_now.getFullYear().toString()));
	}

	for(var k in o)
	if(new RegExp("("+ k +")").test(real_format))
	real_format = real_format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
	return real_format;
}

function calc_list(olist,col)
{
    if(!olist)
      return 0;
    if(!col)
      return 0;

    //col--;
    var output = 0;
    var lv_tb_id = olist.getAttribute("id");
    var row_length = olist.rows.length;
    if(document.getElementById(lv_tb_id+'_sum'))
        row_length--;

    for(i=1;i < row_length;i++)
    {
        for (j=0; j < olist.rows[i].cells.length-1; j++)
        {
            if(j==col)
            {
                var child_ojb = olist.rows[i].cells[j].firstChild;
				// alert(firstChild);
                var olist_val = child_ojb ? child_ojb.value : "";
                olist_val = (typeof olist_val == "undefined" || olist_val == "" || olist_val.replace(/\s/g,'') == "")? 0 : olist_val;
                olist_val = (isNaN(olist_val))? NaN : olist_val;
                if(child_ojb && child_ojb.tagName)
                    output += parseFloat(olist_val);
//                if(child_ojb && child_ojb.tagName)
//                    output += parseFloat(olist.rows[i].cells[j].firstChild.value);
                else
                    output += parseFloat(olist.rows[i].cells[j].innerText);
            }
        }
    }
    return  parseFloat(output);
}

function SaveFile(ATTACHMENT_ID,ATTACHMENT_NAME)
{
    var URL="/module/save_file/?ATTACHMENT_ID="+ATTACHMENT_ID+"&ATTACHMENT_NAME="+ATTACHMENT_NAME+"&A=1";
    loc_x=screen.availWidth/2-200;
    loc_y=screen.availHeight/2-90;
    window.open(URL,null,"height=180,width=400,status=1,toolbar=no,menubar=no,location=no,scrollbars=yes,top="+loc_y+",left="+loc_x+",resizable=yes");
}

function SelectSign()
{
    var loc_x=(screen.availWidth-300)/2;
    var loc_y=(screen.availHeight-100)/2;
    window.open("../feedback/index.php","FEED_HISTORY","status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=500,height=400,left="+loc_x+",top="+loc_y);
}

function show_msg(module, msg, time)
{
    if(msg)
    {
	    jQuery("#"+module+"_msg").html(msg);
	}
	if(module=="focus")
	{
	    jQuery("#"+module+"_div").css("top",document.documentElement.scrollTop);
	}
	jQuery("#"+module+"_div").fadeIn("slow");
    window.setTimeout(function(){hide_msg(module);},time*1000,module);
}

function hide_msg(module)
{
    jQuery('#'+module+'_div').fadeOut('slow')
}

function auto_btn(id)
{
	if(typeof document.getElementById(id) != "undefined"){
		if(document.getElementById(id).style.display=="none")
	   document.getElementById(id).style.display="";
		else
		 document.getElementById(id).style.display="none";
	}
}

function clear_user()
{
    document.form1.TO_NAME.value="";
    document.form1.TO_ID.value="";
}


function sel_attach(div_id,dir_field,name_field,disk_id)
{
    var URL="/module/sel_file/?EXT_FILTER=&MULTI_SELECT=1&DIV_ID=" + div_id + "&DIR_FIELD=" + dir_field + "&NAME_FIELD=" + name_field + "&TYPE_FIELD=" + disk_id;
    window.open(URL,null,"height=300,width=500,status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,top=200,left=300,resizable=yes");
}

function focus_run(RUN_ID)
{
  var msg=td_lang.general.workflow.msg_50;//"确认要关注此工作么？"

  if(window.confirm(msg))
  {
    mouse_is_out = false;
    jQuery.get("../focus.php",{"RUN_ID":RUN_ID,"OP":1},function(data){
    	 jQuery.showTip(data);
     });
  }
}

//selectArr储存所有的下拉菜单
var selectArr = new Array();
//缓存顶级下拉菜单
var firstSelectArr = new Array();
var restoreFlag = false;
function createSelectArr()
{
    allSelect = jQuery("select");
    //首次循环，将下拉菜单值保存为全局变量多维数组
    allSelect.each(function(){
        var field_name = jQuery(this).attr("name");

        selectArr[field_name] = new Array();
        jQuery(this).children().each(function(i, e){
            selectArr[field_name][i] = e.value;
        });
    });
    //再次循环，所有的父菜单存到数组中，用于更新状态
    allSelect.each(function(i){
        //赋重写事件
        jQuery(this).change(function(){
            selectChange(jQuery(this).attr("name"));
        });
        //判断有子菜单的
        if(jQuery(this).attr("child") != undefined)
        {
            var temp = jQuery(this).attr("title");
            if(!jQuery("select[child='"+temp+"']")[0] )
            {
                firstSelectArr[i] = jQuery(this).attr("name");
            }
        }
    });
}
/*
处理关联菜单的子菜单选项
传入：关联菜单
*/
function selectChange(Select)
{
    var SelectObj = jQuery("select[name='"+Select+"']");
    var parent_str = "|"+jQuery(SelectObj).val();
    if(jQuery(SelectObj).attr("child") != undefined)
    {
        //子对象
        var childObj = jQuery("select[title='"+jQuery(SelectObj).attr("child")+"']");
        if(childObj.length == 0){return false;}
        //alert(jQuery(SelectObj).attr("child"));
        //记录原始数据，重写option后用此值恢复
        var childVal = jQuery(childObj).val();


        //先删除所有option
        childObj.children().remove();
        //循环添加option
        jQuery.each(selectArr[jQuery(childObj).attr("name")], function(i, n){
            if(restoreFlag){
                if(parent_str!='|' && n.indexOf(parent_str) != -1)
                {
                    var val_arr = n.split("|");
                    jQuery(childObj).append("<option value='"+n+"'>"+val_arr[0]+"</option>");
                }
            }else{
                var val_arr = n.split("|");
                jQuery(childObj).append("<option value='"+n+"'>"+val_arr[0]+"</option>");
            }
        });
        childObj.val(childVal);
        //jQuery(childObj).css("width","auto");
        selectChange(jQuery(childObj).attr("name"));
    }
    else
    {
        return;
    }
}


function initSelect()
{
    //return false;
    //缓存数组
    createSelectArr();

    //初始化下拉菜单
    jQuery.each(firstSelectArr, function(i, n){
        selectChange(n);
    });
}

//处理下拉菜单回填
function click_sign_select(ITEM, VAL)
{
    restoreFlag = true;
    //eval("document.form1."+ITEM).value=VAL;
    parentSelect = get_parent_select(ITEM);
    var valArr = VAL.split("|");
    var tmpStr = "";
    for(var i = valArr.length - 1; i >= 0; i--)
    {
        tmpStr = valArr[i] + "|" + tmpStr;
        tmpStr1 = tmpStr.substr(0, tmpStr.length - 1);
        jQuery("select[name='"+parentSelect+"']").val(tmpStr1);
        //更新节点
        selectChange(parentSelect);
        //取出子节点
        var childTitle = jQuery("select[name='"+parentSelect+"']").attr("child");
        //重置parentSelect
        parentSelect = jQuery("select[title='"+childTitle+"']").attr("name");

    }
}
//处理单选框回填
function click_sign_radio(ITEM, VAL)
{
    //eval("document.form1."+ITEM).value=VAL;
    parentSelect = get_parent_select(ITEM);

    var valArr = VAL.split("|");

    var tmpStr = "";
    for(var i = valArr.length - 1; i >= 0; i--)
    {
        tmpStr = valArr[i] + "|" + tmpStr;

        tmpStr1 = tmpStr.substr(0, tmpStr.length - 1);

       jQuery("input[name='"+parentSelect+"']").each(function(i){

       		    if(this.value==tmpStr1){

	       	       this.checked="checked";
	               return false;
	        	  }
        });
        //更新节点
        selectChange(parentSelect);
		    //取出子节点
        var childTitle = jQuery("select[name='"+parentSelect+"']").attr("child");
        //重置parentSelect
       parentSelect = jQuery("select[title='"+childTitle+"']").attr("name");

    }
}
//处理复选框回填
function click_sign_checkbox(ITEM, VAL)
{
    //eval("document.form1."+ITEM).value=VAL;
    parentSelect = get_parent_select(ITEM);

    var valArr = VAL.split(",");
    jQuery("input[name='"+parentSelect+"']").each(function(n,selectobj){
		   for(var j = 0; j < valArr.length; j++){
				if(selectobj.value === valArr[j]){
						selectobj.checked="checked";
				}
         }
    });
}

//根据子菜单找到顶级父菜单
function get_parent_select(ITEM)
{
    var parentSelect = ITEM;
    endTitle = eval("document.form1."+ITEM).title;
    if(jQuery("select[child='"+endTitle+"']") != undefined)
    {
        parentName = jQuery("select[child='"+endTitle+"']").attr("name");
        if(parentName != undefined)
        {
            parentSelect = get_parent_select(parentName);
        }
    }
    return parentSelect;
}

//二维码生成
function create_qr(item_id)
{
    var datafld = document.getElementById("QRCODE_"+item_id).value;
    var data_value = "";
    data_arr = datafld.split(",");
    jQuery(data_arr).each(function(i,v){
        data_value += getElementValueByTitle(v) + "<br />";
    });
    if(data_value != "")
    {
        var url = //"http://192.168.0.9/general/approve_center/list/input_form/create_qr.php?data_value="+data_value;
            "/general/approve_center/list/input_form/create_qr.php?data_value="+data_value;
        document.getElementById("qr_"+item_id).src=url;
        document.getElementById("DATA_"+item_id).value=url;
    }
}


function data_picker(obj,item_str,type)
{
    var dataSrc       = obj.getAttribute("DATA_TABLE");
    var dataField     = obj.getAttribute("DATA_FIELD");
    var dataFieldName = obj.getAttribute("DATA_FLD_NAME");
    var dataQuery     = obj.getAttribute("DATA_QUERY");
    var data_control  = obj.getAttribute("DATA_CONTROL");
    var dataSrcName   = obj.getAttribute("DATA_TABLE_NAME");
    var datadbid      = obj.getAttribute("DATA_DB_ID");

    var URL="/general/approve_center/list/input_form/data_picker.php?dataSrc="+dataSrc+"&dataField="+dataField+"&dataFieldName="+dataFieldName+"&item_str="+item_str+"&type="+type+"&objName="+obj.name+"&dataQuery="+dataQuery+"&data_control="+data_control+"&dataSrcName="+dataSrcName+"&datadbid="+datadbid;
    var openWidth = 800;
    var openHeight = 450;
    var loc_x = (screen.availWidth - openWidth) / 2;
    var loc_y = (screen.availHeight - openHeight) / 2;
    LoadDialogWindow(URL,self,loc_x, loc_y, openWidth, openHeight);
}

function list_data_picker(obj,table, field, fieldName, dataQuery,readonly,hidden_item)
{
    var tbl = obj.parentNode.parentNode.parentNode.parentNode;
    var row_id = obj.parentNode.parentNode.id;
	var dataSrc=table;
	var dataField=field;
	var all_id = obj.parentNode.parentNode.parentNode.childNodes;
    var all_id_arr = new Array();
    for(var i=1;i<all_id.length;i++)
    {
        all_id_arr[i] =  all_id[i].id;
    }
    var all_id_str = all_id_arr.join(',');
    all_id_str = all_id_str.substr(1);

	var URL="/general/approve_center/list/input_form/data_picker.php?dataSrc="+dataSrc+"&dataField="+field+"&dataFieldName="+fieldName+"&dataQuery="+dataQuery+"&row_id="+row_id+"&all_id="+all_id_str+"&LIST_VIEW=LIST_VIEW&readonly="+readonly+"&hidden_item="+hidden_item;
	var openWidth = 800;
    var openHeight = 450;
    var loc_x = (screen.availWidth - openWidth) / 2;
    var loc_y = (screen.availHeight - openHeight) / 2;
    LoadDialogWindow(URL,self,loc_x, loc_y, openWidth, openHeight);
}

function initAutoComplete($,obj,key_arr,item_arr)
{
	if(key_arr.length<=0)
		return;
	if(!obj)
    {
        return;
    }
	var item_src = $("button[name="+obj+"]");
	var tbl_name = item_src.attr("data_table");

	//获取所有字段
	var item_str= "";
	for(var j in item_arr)
	{
		for(var key in item_arr[j])
		{
			item_str += item_arr[j][key]+",";
		}
	}

	var item;
	for(var i in key_arr)
	{
		for(var key in key_arr[i])
		{
			item = jQuery("input[name="+key+"]");
			var vWidth = item.width();
			item.autocomplete({
	            source:"/general/approve_center/list/input_form/get_auto_data.php?key="+key_arr[i][key]+"&tbl="+tbl_name+"&item_str="+item_str+"&i="+i,
                select:function(event, ui){
                    var data_arr = ui.item.value_str.toString().split("`");
				    for(var m in item_arr)
				    {
				    	for(var k in item_arr[m])
				    	{
				    		if(key_arr[ui.item.i][$(this).attr("name")]!=item_arr[m][k])
				    		{
                                var value = data_arr[m].replace(/\[0x60\]/g, '`');
                                try{
                                    jQuery("input[name="+k+"]").val(value).attr("readOnly",true);
                                }catch(e){}
                                try{
                                    jQuery("textarea[name="+k+"]").val(value).attr("readOnly",true);
                                }catch(e){}
                                try{
                                    CKEDITOR.instances[k].setData(value);
                                    setTimeout(function(){CKEDITOR.instances[k].setReadOnly(true)}, 150);
                                }catch(e){}
                                try{
                                    CKEDITOR.instances["TD_HTML_EDITOR_"+k].setData(value);
                                    setTimeout(function(){CKEDITOR.instances["TD_HTML_EDITOR_"+k].setReadOnly(true)}, 150);
                                }catch(e){}
				    		}

				    	}
				    }
                }
            });
		}

	}
}

function customComplete(dataName, content){
    CKEDITOR.instances[dataName].setData(content);
    setTimeout(function(){CKEDITOR.instances[dataName].setReadOnly(true)}, 150);
}

function data_fetch(obj,run_id,item_str,flow_id,is_form)
{
    var dataSrc=obj.getAttribute("DATA_TABLE");
    var dataField=obj.getAttribute("DATA_FIELD");
    var data_fld_name=obj.getAttribute("data_fld_name");
    // var data_fld_class=obj.getAttribute("data_fld_class");
    // var data_fld_classname=obj.getAttribute("data_fld_classname");
    var URL="/general/approve_center/list/input_form/data_fetch.inc.php";
    var args="dataSrc="+dataSrc+"&run_id="+run_id+"&data_field="+dataField+"&item_str="+item_str+"&data_fld_name="+data_fld_name+"&flow_id="+flow_id;
    var msg = td_lang.system.workflow.msg_56;
    _get(URL,args,function(req){
    try
    {
        if(req.responseText!="")
        {
            //回填数据
            if(req.responseText.substring(0,6)=="error:"){
                alert(req.responseText.substring(6,req.responseText.length)); return;
            }

            eval("var value_array="+req.responseText);
            if(!value_array) return;

            var item_array=item_str.split(",");
            for(i=0;i<item_array.length-1;i++)
            {
              if(item_array[i]=="")
                 continue;

              var x=eval("document.form1."+item_array[i]);
              //var x=document.getElementById(item_array[i]);
			  if(x.length > 1 && typeof x.tagName == 'undefined')
			  {
				  for(var j=0;j<x.length;j++)
				  {
					  if(value_array[item_array[i]].indexOf(x[j].value) >=0)
					  {
						 x[j].checked=true;
					  }
				  }
			  }
              switch(x.tagName)
              {
                case "INPUT":
					if(x.className == "LIST_VIEW")//列表控件填值
					{
						var add_row = item_array[i].replace("DATA","LV");
						item_array[i] = item_array[i]+"_"+i;
						if(value_array[item_array[i]].indexOf("<br>") != -1)
							value_array[item_array[i]].replace("<br>","\r\n");
						var add_val = value_array[item_array[i]];
						if(add_val.indexOf("]") != -1)
						{
							var add_val_arr = add_val.split("]");
							for(var m=0;m<add_val_arr.length;m++)
							{
								if(add_val_arr[m] == "")
									continue;
								var add_val_s=add_val_arr[m].split("|")[1];
								td_addnew_multiple(add_row,"",add_val_s,1,is_form);
							}
						}else
						{

								td_addnew_multiple(add_row,"",add_val,1,is_form);

						}

					}
					else
					{
                        var item_data = typeof(value_array[item_array[i]]) != 'undefined' ? value_array[item_array[i]] : value_array[item_array[i]+'_'+i];
						if(x.type=="text")
						{
							x.value=item_data;
						}
						else if(x.type=="checkbox")
						{
							if(item_data=="on")
								x.checked=true;
							else
								x.checked=false;
						}
					}
					break;
                case "SELECT":
                    var item_data = typeof(value_array[item_array[i]]) != 'undefined' ? value_array[item_array[i]] : value_array[item_array[i]+'_'+i];
                  for(k=0;k<x.length;k++)
                    if(x.options[k].value==item_data) break;
                  if(k!=x.length)
                    x.selectedIndex=k;
                  break;
                case "TEXTAREA":
                    var item_data = typeof(value_array[item_array[i]]) != 'undefined' ? value_array[item_array[i]] : value_array[item_array[i]+'_'+i];
                    x.innerText=item_data.replace(/<br>/ig,"\r\n");
                    break;
                case "BUTTON":
                  break;
              }
            }//end for
        }
    }
    catch(e)
    {
        alert(msg);
    }
   });
}

var cursor = "";
function LoadSignDataSign(data,count,content,version)
{
    var vDWebSignSeal=document.getElementById("DWebSignSeal");
    if(!vDWebSignSeal || typeof(vDWebSignSeal)=='undefined' || !('SetStoreData' in vDWebSignSeal))
	   return;
    vDWebSignSeal.SetStoreData(data);
	var auth_websign_code = window.auth_websign_code;
	if(auth_websign_code != '')
	{
		vDWebSignSeal.SetSealComment("SET_ABOUT_TIPS", 0, 0, auth_websign_code);
	}
    var strObjectName, cursor;
    strObjectName = vDWebSignSeal.FindSeal(cursor,0);
	while(strObjectName  != "")
	{
		if(strObjectName.indexOf("SIGN_INFO")>=0)
		{
		   vDWebSignSeal.MoveSealPosition(strObjectName,0, -30, "personal_sign"+count);
		   strObjectName_sel = vDWebSignSeal.FindSeal(strObjectName,0);
		   if(strObjectName_sel.indexOf("SIGN_INFO")>=0)
		   {
			   vDWebSignSeal.MoveSealPosition(strObjectName_sel,0, -30, "personal_sign"+count);
		   }
		   break;
		}else
		{
			return;
		}

	}
	vDWebSignSeal.ShowWebSeals();
    if(version==0)
        vDWebSignSeal.SetSealSignData (strObjectName,td_lang.general.workflow.msg_55);//"中国兵器工业信息中心"
    else
        vDWebSignSeal.SetSealSignData (strObjectName,content);
    vDWebSignSeal.SetMenuItem(strObjectName,4);
    sign_info_object += strObjectName+",";
    strObjectName = vDWebSignSeal.FindSeal(strObjectName,0);
    if(strObjectName_sel.indexOf("SIGN_INFO")>=0){
    	if(version==0)
            vDWebSignSeal.SetSealSignData (strObjectName_sel,td_lang.general.workflow.msg_55);//"中国兵器工业信息中心"
        else
            vDWebSignSeal.SetSealSignData (strObjectName_sel,content);
    	vDWebSignSeal.SetMenuItem(strObjectName_sel,4);
    	sign_info_object += strObjectName_sel+",";
    }

}

//历史数据
function quick_load(e,RUN_ID,FLOW_ID)
{
  var loc_x=(screen.availWidth-600)/2;
  var loc_y=(screen.availHeight-400)/2;
  var QUREY_DATA = "";          //传值
  if(e.type == "select-one")
  {
    QUREY_DATA = "";
  }
  else
  {
    QUREY_DATA = e.value;
  }
  var formView = 'form';
  if (jQuery("div[id^='main_tab_']").length > 0)
  {
	  formView = 'auto';
  }
  var url = "/general/approve_center/list/input_form/quick_load.php?FLOW_ID="+FLOW_ID+"&RUN_ID="+RUN_ID+"&FLOW_PRCS="+window.G_FLOW_PRCS+"&QUREY_ITEM="+e.name+"&QUREY_DATA="+QUREY_DATA+"&QUREY_TYPE="+e.type+"&FORM_VIEW="+formView;

  LoadDialogWindow(url,self,loc_x,loc_y,600,400);
}

//历史版本恢复
function version_load(e,RUN_ID,FLOW_ID)
{
  var loc_x=(screen.availWidth-600)/2;
  var loc_y=(screen.availHeight-400)/2;
  var QUREY_DATA = "";          //传值
  if(e.type == "select-one")
  {
    QUREY_DATA = "";
  }
  else
  {
    QUREY_DATA = e.value;
  }
  var url = "/general/approve_center/list/input_form/version_load.php?FLOW_ID="+FLOW_ID+"&RUN_ID="+RUN_ID+"&QUREY_ITEM="+e.name+"&QUREY_DATA="+QUREY_DATA+"&QUREY_TYPE="+e.type;
  window.open(url,"","status=0,toolbar=no,menubar=no,600,400,location=no,scrollbars=yes,resizable=yes,left=0,top=0");
  //LoadDialogWindow(url,self,loc_x,loc_y,600,400);
}

function check_send(e)
{
  var key = window.event ? e.keyCode:e.which;   //浏览器兼容
  if(key==10)
     quick_load(e)
}

function save_form(auto_new)
{
	if(auto_new!="")
	   CheckForm(3);
	else
	   CheckForm(1);
}

function show_seal(item,callback,signx,signy)
{
	if(typeof signx == 'undefined')
	{
		signx = 0;
		signy = 0;
	}
	var URL="/module/sel_seal/?ITEM="+item+"&callback="+callback+"&signx="+signx+"&signy="+signy;
    loc_y=loc_x=200;
    if(is_ie)
    {
       loc_x=document.body.scrollLeft+event.clientX-100;
       loc_y=document.body.scrollTop+event.clientY+170;
    }
    LoadDialogWindow(URL,self,loc_x, loc_y, 300, 350);//这里设置了选人窗口的宽度和高度
}
function form_validate()
{
    var check_flag = true;
    jQuery("input[VALIDATION]:not([readOnly])").each(function(){
        //清除错误状态
        jQuery(this).removeClass("input-error").next(".input-error-msg").remove();
        var validation = jQuery(this).attr("VALIDATION");
        var value = jQuery(this).val();
        var err_msg = "";

        if(validation)
        {
			var type = "";
			var len = "";
			var point = "";
			var arr = new Array();
			var arr1 = new Array();
			arr = validation.split(";");
			for(i=0; i<arr.length; i++)
			{
				if(arr[i] != "")
				{
					arr1[i] = arr[i].split(":");
				}
			}

			for(j=0;j<arr1.length;j++)
			{
				if(arr1[j][0] == 'type')
				{
					 type= arr1[j][1];
				}else if(arr1[j][0] == 'len')
				{
					 len = arr1[j][1];
				}else if(arr1[j][0] == 'point')
				{
					 point = arr1[j][1];

				}
			}

            //判断数据类型
            switch(type)
            {
                case "email":
                    var emailExp = new RegExp("[a-zA-Z0-9._%-]+@[a-zA-Z0-9._%-]+\\.[a-zA-Z]{2,4}");
                    if(!value.match(emailExp) && value != "")
                    {
                        check_flag = false;
                        err_msg += td_lang.general.workflow.msg_51;//" 格式不符,形如example@126.com"
                    }
                    break;
                case "int":
                    var intExp = new RegExp("^[0-9]+$");
                    if(!value.match(intExp) && value != "")
                    {
                        check_flag = false;
                        err_msg += td_lang.general.workflow.msg_52;//" 格式不符,应为整数"
                    }
                    break;
                case "date":
                    var dateExp = new RegExp("^\\d{4}[\\/-]\\d{1,2}[\\/-]\\d{1,2}$");
                    if(!value.match(dateExp) && value != "")
                    {
                        check_flag = false;
                        err_msg += td_lang.general.workflow.msg_53;//" 格式不符,应为日期类型"
                    }
                    break;
                case "float":
                    var floatExp = new RegExp("^(-?\\d+)(\\.\\d+)?$");
                    if(!value.match(floatExp) && value != "")
                    {
                        check_flag = false;
                        err_msg += td_lang.general.workflow.msg_54;//" 格式不符,应为浮点数如123.45"
                    }
                    break;
				case "number":
					var numberInt = new RegExp("^[0-9]+$");
					var numberFloat = new RegExp("^(-?\\d+)(\\.\\d+)?$");
					if(value != "" && !value.match(numberInt) && !value.match(numberFloat))
					{
						check_flag = false;
						err_msg += td_lang.general.workflow.msg_318;//" 格式不符,应为数值"
					}
					break;
                default:
                    check_flag = true;
                    break;
            }

            //判断数据长度
            if(len!="")
            {
                if(value.length < len)
                {
                    check_flag = false;
                    var msg1 = sprintf(td_lang.inc.msg_125,len);
                    err_msg += msg1;
                }
            }
        }

        if(!check_flag)
        {
            jQuery(this).addClass("input-error").focus().after('<span class="input-error-msg">'+err_msg+'</span>');
            return false;
        }
    });
    return check_flag;
}
function CheckDoomIsList(title)
{
	var check_flag = false;
	var doom_obj = jQuery('table[title="'+title+'"]').eq(0) || '';
	if(doom_obj)
	{
		var doom_class = doom_obj.attr('class') || '';
		if(doom_class == 'LIST_VIEW')
		{
			check_flag = true;
		}
	}
	return check_flag;
}
function getElementValueByTitle(title)
{
    var rt;
    jQuery("form input[title='"+title+"'],select[title='"+title+"'],textarea[title='"+title+"']").each(
        function(){
            //复选框
            if(jQuery(this).attr("type") == "checkbox")
            {
                if(this.value == "on")
                    rt = td_lang.global.yes;//"是"
                else
                    rt = td_lang.global.no;//"否"
            }
            //单选框
            else if(jQuery(this).attr("type") == "radio")
            {
                if(jQuery(this).attr("checked") == true)
                {
                    rt = this.value;
                }
            }
            //下拉菜单
            else if(jQuery(this).attr("tagName") == "SELECT" && this.selectedIndex > -1)
            {
                rt = this.options[this.selectedIndex].innerText;
            }
            //普通input
            else
                rt = jQuery(this).val() || '';
        }
    );
    return rt;
}

//进度条增加
/*
*
*span 跨度
*/

function add_progress(id, span)
{
	if(span == "")
	{
		span = 1;
	}
	//取出进度并得出新的进度
	var pro_val = Math.round(document.getElementById("DATA_"+id).value);
	pro_val = pro_val + span;
	if(pro_val > 100)
	{
		pro_val = 100;
	}
	if(pro_val < 0)
	{
		pro_val = 0;
	}
	document.getElementById("DATA_"+id).value = pro_val;
	document.getElementById("numpro_"+id).innerHTML = pro_val + "%";

	var progress_style = Math.round(145 - 145 * pro_val/100);

	var pro_obj = document.getElementById("bar_"+id);
	pro_obj.style.backgroundPositionX = "-" + progress_style+'px';
}
//进度条减小
function less_progress(id, span)
{
	if(span == "")
	{
		span = 1;
	}
	//取出进度并得出新的进度
	var pro_val_old = document.getElementById("DATA_"+id).value;
	var pro_val = Math.round(document.getElementById("DATA_"+id).value);
	pro_val = pro_val - span;
	if(pro_val > 100)
	{
		pro_val = 100;
	}
	if(pro_val < 0)
	{
		pro_val = 0;
	}
	document.getElementById("DATA_"+id).value = pro_val;
	document.getElementById("numpro_"+id).innerHTML = pro_val + "%";

	var progress_style = Math.round(145 - 145 * pro_val/100);

	var pro_obj = document.getElementById("bar_"+id);
	pro_obj.style.backgroundPositionX = "-" + progress_style+'px';
}

function sign_reply(user_name)
{
    var sign_iframe = document.getElementById("CONTENT-iframe").contentWindow.docu;
    document.form1.CONTENT.value = td_lang.global.reply+user_name+"：";//"回复"
}

function setImgUploadPosition(obj,dataId){
	var evt = window.event || arguments.callee.caller.arguments[0]; // 获取event对象
	var dataObj = document.getElementById(dataId);
	var evtX = evt.offsetX || evt.layerX;
	var evtY = evt.offsetY || evt.layerY;
	dataObj.style.left=evtX-obj.width/2;
	dataObj.style.top=evtY-obj.height/2;
	dataObj.style.height=obj.height;
	dataObj.style.width=obj.width;
	dataObj.style.left=0;
	dataObj.style.top=0;
}

function GetPosition(obj){
	var left = 0;
	var top  = 0;
	while(obj != document.body){
		left += obj.offsetLeft;
		top  += obj.offsetTop;
		obj = obj.offsetParent;
	}
	return {x:left,y:top};
}

function refurbish(ITEM_ID,AUTO_VALUE,LOGIN_USER_NAME){//宏控件刷新

	var dataFld_id = jQuery("input[name='DATA_"+ITEM_ID+"']").attr("dataFld");
	var myDate = new Date();
    var Month = ("0" + (myDate.getMonth() + 1)).slice(-2);
    var shijian = myDate.getFullYear()+"-"+Month+"-"+("0" + myDate.getDate()).slice(-2)+" "+myDate.toLocaleTimeString("en-US", {hour12: false});

	if(dataFld_id == "SYS_USERNAME_DATETIME"){		// 当前用户名+日期+时间
		var zhi = LOGIN_USER_NAME+" "+shijian;
		//alert(zhi);
		jQuery("input[name='DATA_"+ITEM_ID+"']").attr("value",zhi);
	}else if(dataFld_id == "SYS_TIME"){ // 当前时间
		jQuery("input[name='DATA_"+ITEM_ID+"']").attr("value",myDate.toLocaleTimeString("en-US", {hour12: false}));
	}else if(dataFld_id == "SYS_DATETIME"){ //当前日期和时间
		jQuery("input[name='DATA_"+ITEM_ID+"']").attr("value",shijian);
	}else{
		jQuery("input[name='DATA_"+ITEM_ID+"']").attr("value",AUTO_VALUE);
	}

}

function calc_ths(val){
	if(isNaN(val)){return 0;}
	var re=/\d{1,3}(?=(\d{3})+$)/g;
	var n=val.toString().replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){
		return s1.replace(re,"$&,")+s2;
	});
	return n;
}

function calc_ths_rev(val){
	if(typeof val == "string"){
		return val.replace(/,/gi,'');
	}else{
		return false;
	}
}

function is_ths(val){
	if(isNaN(val) && !isNaN(calc_ths_rev(val))){
		return true;
	}
	return false;
}

function initListView(lv_table_id, default_cols, new_width){
    for(var j=0;j<default_cols;j++){
        tb_addnew(lv_table_id, '0', '', '1', new_width);
    }
}
function TaoHongListData(title)
{
    var data_str="";
	var result = new Array();
	result['row_max'] = new Array();//最大行
	result['col_max'] = new Array();//最大列
	result['data'] = new Array();
	var tableObj = jQuery('table[title="'+title+'"]').eq(0) || '';
	
	if(tableObj.length == 0)
	{
		return;
	}
	var lv_tb_id = tableObj.attr('id');
	var mytable=document.getElementById(lv_tb_id);
    if(typeof mytable == "undefined" || mytable == null)
    {
        return;
    }
    var row_length=mytable.rows.length;
    // if(document.getElementById(lv_tb_id+'_sum'))
        // row_length--;
    var coltype_array=mytable.getAttribute("lv_coltype").split("`");
	result['row_max'] = row_length;
	
    for (i=0; i < row_length; i++)
    {
		result['data'][i] = new Array();
		var n = 0;
        for (j=1; j < document.getElementById(lv_tb_id).rows[i].cells.length-1; j++)
        {
			n++;
			if(i == 0)//第一行显示title值
			{
				var cell = document.getElementById(lv_tb_id).rows[i].cells[j];
				data_str = cell.textContent;
			}else
			{
				var cell = document.getElementById(lv_tb_id).rows[i].cells[j];
				if(coltype_array[j-1]=="radio" || coltype_array[j-1]=="checkbox")
				{
					data_str = '';
					if(jQuery("input:radio:checked,input:checkbox:checked",cell).length>0)
					{
						if(coltype_array[j-1]=="radio")
						   data_str=jQuery("input:radio:checked",cell).get(0).value;
						else
						{
						   jQuery("input:checkbox:checked",cell).each(function(){
								data_str+=this.value+",";
						   });
						   data_str=data_str.substring(0,data_str.length-1);
						}
					}
					// data_str += "`";
				}
				else if(coltype_array[j-1]=="textarea")
				{
					var the_value = textarea_html = "";
					if(cell.firstChild == null || cell.firstChild.value == undefined)
					{
						the_value = cell.innerHTML;
						the_value = the_value.replace(/`/g, '[0x60]');
						textarea_html = the_value;
					}
					else
					{
						the_value = cell.firstChild.value;
						the_value = the_value.replace(/`/g, '[0x60]');
						textarea_html = the_value;
					}
					// textarea_html = textarea_html.replace(/\r\n/g, "&lt;br&gt;");
					// textarea_html = textarea_html.replace(/\n/g, "&lt;br&gt;");
					data_str=textarea_html;
				}
				else
				{
					var the_value = '';
					if(cell.firstChild == null || cell.firstChild.value == undefined)
					{
						the_value = cell.innerHTML;
						 the_value = the_value.replace(/`/g, '[0x60]');
						data_str=the_value;
					}
					else
					{
						the_value = cell.firstChild.value;
						the_value = the_value.replace(/`/g, '[0x60]');
						data_str=the_value;
					}
				}
			}
			// data_str = data_str.replace(/\r\n/g, "&lt;br&gt;");
			result['data'][i][j-1] = data_str;
        }
    }
	result['col_max'] = n;
	return result;
}
function CheckDoomIsEditor(title)
{
	var check_flag = false;
	var doom_obj = jQuery('textarea[title="'+title+'"]').eq(0) || '';
	if(doom_obj)
	{
		var doom_name = doom_obj.attr('name') || '';
		if(doom_name && doom_name.indexOf('TD_HTML_EDITOR_') > -1)
		{
			check_flag = true;
		}
	}
	return check_flag;
}
function getRichTextareaVal(title)//获取多行富文本纯文本数据
{
	var editorVal = '';
	var doom_obj = jQuery('textarea[title="'+title+'"]').eq(0) || '';
	if(doom_obj)
	{
		var doom_name = doom_obj.attr('name') || '';
		if(doom_name)
		{
			editorVal = UE.getEditor(doom_name).getContentTxt();
		}
	}
	return editorVal;
}
function checkResult(opts) {
    var $ = jQuery;
    var itemId = opts.itemId;
    var tmp = [];
    var arr = $('[ocrgroup="' + itemId + '"]');
    $.each(arr, function(i, item) {
        var id = $(item).attr("data-attach_id");
        var name = $(item).attr("data-attach_name");
        tmp.push({
            id: id,
            name: name
        });
    });
    var params = JSON.stringify(tmp);
    function openModal() {
        var mywidth = 1100;
        var myheight = 700;
        var myleft = (screen.availWidth - mywidth) / 2;
        var mytop = 100;
        window.open(
            "/general/invoice/invoiceModal/?imgs=" + encodeURIComponent(params),
            "",
            "height=" +
                myheight +
                ",width=" +
                mywidth +
                ",status=1,toolbar=no,menubar=no,location=no,scrollbars=yes,top=" +
                mytop +
                ",left=" +
                myleft +
                ",resizable=yes"
        );
    }
    openModal();
}
//ocr控件下增加图片
function addimages(file,itemId){
    var $ = jQuery;
    //不显示占位图
    $('.ocrPlaceHolder').hide();
    //显示查验结果按钮
    $('#check_'+itemId).show();
    //图片类型可多选
    var list = $("#filelist_"+itemId).eq(0);

    var name = file.name;
    var id = file.id;
    var url = file.url;
    name = name.replace('*','');
    id = id.replace(',','');
    list.append('<a href="javascript:void(0);" ocrGroup="'+itemId+'" data-attach_id="'+id+'" data-attach_name="'+name+'" class="pda_attach pda_attach_img" is_image="1" _href="'+url+'"><img src="'+url+'" /><!--<span class="fileupload-item icon-delete">×</span>--></a>');

    //查找ocr隐藏域attachId,attachName，用来post保存表单
    var idStr = '';
    var nameStr = '';
    var arr = list.find('a');//找到所有ocr控件下的图片
    $.each(arr,function (i,item) {
        var attachId = '';
        var attachName = '';
        attachId = $(item).attr('data-attach_id');
        attachName = $(item).attr('data-attach_name')
        attachId = attachId.replace(',','');
        attachName = attachName.replace('*','');
        idStr += attachId+',';
        nameStr += attachName+'*';
    })
    $("input[name='"+itemId+"']").val(nameStr);
    $("input[name='"+itemId+"_key']").val(idStr);
}





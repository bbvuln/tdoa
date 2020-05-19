//内部数据源
//数据来源变化时，根据URL加载映射关系的HTML代码
function getIntData(id, url, val)
{
    if(!val)
    {
        jQuery('#' + id).html('');
        return;
    }

    jQuery.ajax({
        type: 'GET',
        url: url + val,
        cache: false,
        success: function(data){
            jQuery('#' + id).html(data);
        },

        error: function(){
            alert('加载失败');

        }
    });
}

//添加映射关系
function addRow()
{
    //检查必填项
    var intDataField = jQuery('#intDataField').val();
    if(intDataField == '')
    {
        alert('请选择数据库字段');  //请选择数据库字段
        return;
    }
    var intItemTitle = jQuery('#intItemTitle').val();
    var intItemTitle = jQuery.trim(intItemTitle);
    if(intItemTitle == '')
    {
        alert('请填写映射控件名称');  //请填写映射控件名称
        jQuery('#intItemTitle').focus()
        return;
    }

    if(!valid_ctrl_name(intItemTitle))
    {
        jQuery('#intItemTitle').focus();
        return;
    }

    //检查映射关系的数据来源是否唯一
    var mapTable = jQuery('#intMapTable');
    if(mapTable.children().length > 0 && mapTable.attr('_intDataSrc') != jQuery('#intDataSrc').val())
    {
        if(window.confirm('数据来源只能选择一种，变更数据来源，您之前的映射项将被清除，是否继续？'))   //数据来源只能选择一种，变更数据来源，您之前的映射项将被清除，是否继续？
        {
            mapTable.children().remove();
            mapTable.attr('_intDataSrc', '');
            return;
        }
        else
        {
            return;
        }
    }

    //检查映射关系是否重复添加
    if(mapTable.find('tr[_intItemTitle="' + intItemTitle + '"]').length > 0)
    {
        alert('已映射控件名称'+intItemTitle);  //已映射控件名称%s
        return;
    }

    //检查字段是否重复添加
    if(mapTable.find('tr[_intDatafield="' + intDataField + '"]').length > 0)
    {
        alert('字段重复添加');
        return;
    }

    var intDataFieldName = jQuery('#intDataField').find("option:selected").text().replace('"', '');
    var intIsQuery = jQuery('#intIsQuery').length > 0 ? (jQuery('#intIsQuery:checked').length > 0 ? '1' : '0') : '';
    mapTable.append(buildRowHTML(intDataField, intDataFieldName, intItemTitle, intIsQuery));
    jQuery('#intIsQuery').attr('checked', false);
    jQuery('#intItemTitle').val('');
    jQuery('#intItemTitle').focus();

    //设置映射表的数据来源属性
    mapTable.attr('_intDataSrc', jQuery('#intDataSrc').val());
}

//生成映射关系表的行HTML代码
function buildRowHTML(dataField, dataFieldName, itemTitle, isQuery)
{
    var html = '';
    html += '<tr class="TableData" _intDataField="' + dataField + '" _intDataFieldName="' + dataFieldName + '" _intItemTitle="' + itemTitle + '"' + (isQuery != '' ? (' _intIsQuery="' + isQuery + '"') : '') + ' style="text-align:center;">';
    html += '    <td>' + dataField + '</td>';
    html += '    <td>' + dataFieldName + '</td>';
    html += '    <td>' + itemTitle + '</td>';

    if(typeof(isQuery) != 'undefined' && isQuery != '')
    {
        html += '    <td>' + (isQuery == '1' ? '是' : '否') + '</td>';
    }

    html += '   <td><a href="javascript:;" onclick="deleteRow(this);">' + "删除" + '</a></td>';
    html += '</tr>';

    return html;
}

//删除一个映射关系
function deleteRow(obj)
{
    jQuery(obj).parent().parent().remove();
}


//将映射关系表的内容形成格式化数据
function getIntdataInfo()
{
    var mapTable = {
        dataField: '',
        dataFieldName: '',
        itemTitle: '',
        isQuery: ''
    };

    jQuery('#intMapTable').children().each(function(){
        mapTable.dataField += (typeof(jQuery(this).attr('_intDataField')) != 'undefined' ? jQuery(this).attr('_intDataField') : '') + '`';
        mapTable.dataFieldName += (typeof(jQuery(this).attr('_intDataFieldName')) != 'undefined' ? jQuery(this).attr('_intDataFieldName') : '') + '`';
        mapTable.itemTitle += (typeof(jQuery(this).attr('_intItemTitle')) != 'undefined' ? jQuery(this).attr('_intItemTitle') : '') + '`';
        mapTable.isQuery += (typeof(jQuery(this).attr('_intIsQuery')) != 'undefined' ? jQuery(this).attr('_intIsQuery') : '') + '`';
    });

    return mapTable;
}


//检查控件的基本属性是否完整和有效
function checkIntCtrlProp()
{
    var message = "";

    if(jQuery('input[name="intDataType"]').length > 0 && jQuery('input[name="intDataType"]:checked').length <= 0)
    {
        message = '请选择数据选取方式';    //请选择数据选取方式！

    }

    if(jQuery('#intDataSrc').val() == '')
    {
        message = '请选择数据来源';    //请选择数据来源！

    }

    if(jQuery('#intMapTable').children().length <= 0)
    {
        message= '请添加映射关系';    //请添加映射关系！

    }

    if(jQuery('input[name="intDataType"]').length > 0 && jQuery('#intDataType1:checked').length > 0 && jQuery('#intMapTable tr[_intIsQuery="1"]').length <= 0)
    {
        message = '请设置查询主键';    //请设置查询主键！

    }

    return message;
}

function reIntHtml(dataField,dataFieldName,itemTitle,isQuery)
{
    var dataFieldArray = dataField.split('`');
    var dataFieldNameArray = dataFieldName.split('`');
    var itemTitleArray = itemTitle.split('`');
    var isQueryArray = isQuery.split('`');

    for(var i=0; i<dataFieldArray.length; i++)
    {
        if(!dataFieldArray[i] || !dataFieldNameArray[i] || !itemTitleArray[i])
        {
            continue;
        }

        jQuery('#intMapTable').append(buildRowHTML(dataFieldArray[i], dataFieldNameArray[i], itemTitleArray[i], isQueryArray[i]));
    }
}


function valid_charactar(str, chars)
{
    var re = new RegExp("[" + chars + "]+", "i");
    return str.search(re) < 0;
}

function valid_ctrl_name(val)
{
    var invalid_chars = "'\"\\\\<>&`";
    if(!valid_charactar(val, invalid_chars))
    {
        alert('不能包含特殊字符'); //不能包含%s等特殊字符
        return false;
    }

    return true;
}

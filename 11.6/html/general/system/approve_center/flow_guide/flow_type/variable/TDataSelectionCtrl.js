//�ڲ�����Դ
//������Դ�仯ʱ������URL����ӳ���ϵ��HTML����
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
            alert('����ʧ��');

        }
    });
}

//���ӳ���ϵ
function addRow()
{
    //��������
    var intDataField = jQuery('#intDataField').val();
    if(intDataField == '')
    {
        alert('��ѡ�����ݿ��ֶ�');  //��ѡ�����ݿ��ֶ�
        return;
    }
    var intItemTitle = jQuery('#intItemTitle').val();
    var intItemTitle = jQuery.trim(intItemTitle);
    if(intItemTitle == '')
    {
        alert('����дӳ��ؼ�����');  //����дӳ��ؼ�����
        jQuery('#intItemTitle').focus()
        return;
    }

    if(!valid_ctrl_name(intItemTitle))
    {
        jQuery('#intItemTitle').focus();
        return;
    }

    //���ӳ���ϵ��������Դ�Ƿ�Ψһ
    var mapTable = jQuery('#intMapTable');
    if(mapTable.children().length > 0 && mapTable.attr('_intDataSrc') != jQuery('#intDataSrc').val())
    {
        if(window.confirm('������Դֻ��ѡ��һ�֣����������Դ����֮ǰ��ӳ�����������Ƿ������'))   //������Դֻ��ѡ��һ�֣����������Դ����֮ǰ��ӳ�����������Ƿ������
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

    //���ӳ���ϵ�Ƿ��ظ����
    if(mapTable.find('tr[_intItemTitle="' + intItemTitle + '"]').length > 0)
    {
        alert('��ӳ��ؼ�����'+intItemTitle);  //��ӳ��ؼ�����%s
        return;
    }

    //����ֶ��Ƿ��ظ����
    if(mapTable.find('tr[_intDatafield="' + intDataField + '"]').length > 0)
    {
        alert('�ֶ��ظ����');
        return;
    }

    var intDataFieldName = jQuery('#intDataField').find("option:selected").text().replace('"', '');
    var intIsQuery = jQuery('#intIsQuery').length > 0 ? (jQuery('#intIsQuery:checked').length > 0 ? '1' : '0') : '';
    mapTable.append(buildRowHTML(intDataField, intDataFieldName, intItemTitle, intIsQuery));
    jQuery('#intIsQuery').attr('checked', false);
    jQuery('#intItemTitle').val('');
    jQuery('#intItemTitle').focus();

    //����ӳ����������Դ����
    mapTable.attr('_intDataSrc', jQuery('#intDataSrc').val());
}

//����ӳ���ϵ�����HTML����
function buildRowHTML(dataField, dataFieldName, itemTitle, isQuery)
{
    var html = '';
    html += '<tr class="TableData" _intDataField="' + dataField + '" _intDataFieldName="' + dataFieldName + '" _intItemTitle="' + itemTitle + '"' + (isQuery != '' ? (' _intIsQuery="' + isQuery + '"') : '') + ' style="text-align:center;">';
    html += '    <td>' + dataField + '</td>';
    html += '    <td>' + dataFieldName + '</td>';
    html += '    <td>' + itemTitle + '</td>';

    if(typeof(isQuery) != 'undefined' && isQuery != '')
    {
        html += '    <td>' + (isQuery == '1' ? '��' : '��') + '</td>';
    }

    html += '   <td><a href="javascript:;" onclick="deleteRow(this);">' + "ɾ��" + '</a></td>';
    html += '</tr>';

    return html;
}

//ɾ��һ��ӳ���ϵ
function deleteRow(obj)
{
    jQuery(obj).parent().parent().remove();
}


//��ӳ���ϵ��������γɸ�ʽ������
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


//���ؼ��Ļ��������Ƿ���������Ч
function checkIntCtrlProp()
{
    var message = "";

    if(jQuery('input[name="intDataType"]').length > 0 && jQuery('input[name="intDataType"]:checked').length <= 0)
    {
        message = '��ѡ������ѡȡ��ʽ';    //��ѡ������ѡȡ��ʽ��

    }

    if(jQuery('#intDataSrc').val() == '')
    {
        message = '��ѡ��������Դ';    //��ѡ��������Դ��

    }

    if(jQuery('#intMapTable').children().length <= 0)
    {
        message= '�����ӳ���ϵ';    //�����ӳ���ϵ��

    }

    if(jQuery('input[name="intDataType"]').length > 0 && jQuery('#intDataType1:checked').length > 0 && jQuery('#intMapTable tr[_intIsQuery="1"]').length <= 0)
    {
        message = '�����ò�ѯ����';    //�����ò�ѯ������

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
        alert('���ܰ��������ַ�'); //���ܰ���%s�������ַ�
        return false;
    }

    return true;
}

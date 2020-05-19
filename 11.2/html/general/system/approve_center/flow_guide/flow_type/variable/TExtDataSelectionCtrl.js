function SelectDateSrc(ID, NAME)
{
    var URL = "ext_tree?ID="+ID+"&NAME="+NAME;
    var width = 300;
    var height = 400;
    var loc_x = (jQuery(window.top).width() - width)/2;
    var loc_y = (jQuery(window.top).height() - height)/2;

    if(typeof(window.showModalDialog) != 'undefined')
        window.showModalDialog(URL,window,"edge:raised;scroll:1;status:0;help:0;resizable:1;dialogWidth:"+width+"px;dialogHeight:"+height+"px;dialogTop:"+loc_y+"px;dialogLeft:"+loc_x+"px",true);
    else
        window.open(URL, "SelectDateSrcExt", ("height="+height+",width="+width+",status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,top="+loc_y+",left="+loc_x+",resizable=yes,modal=yes,dependent=yes,dialog=yes,minimizable=no"), true);
}

function ClearDateSrc(ID, NAME)
{
    jQuery('#' + ID).val('');
    jQuery('#' + NAME).val('');
    jQuery('#mapTable').children().remove();
    jQuery('#mapTable').attr({_dataSrc: '', _dataField: '', _itemTitle: '', _isQuery: ''});
}

//��ȡѡ������ݱ����ֶ�
function getExtData(id, url, val,dataField,dataFieldName,itemTitle,isQuery)
{
    if(!val)
    {
        jQuery('#' + id).html('');
        return;
    }
    jQuery.ajax({
        type: 'GET',
        url: url + val,
        success: function(data){
            if(data == "nodata")
            {
                alert("δ�������ñ���ֶ���Ϣ");
                jQuery('#' + id).html("");
            }else{
                jQuery('#' + id).html(data);
            }

                extLoadInit(dataField,dataFieldName,itemTitle,isQuery);

        },
        error: function(){
            alert("����ʧ��");
            // alert("Error " + req.status + ": " + errMsg);
        }
    });
}

//��tr�е�td��ֵ����������
function CheckCtrlProp()
{
    //��ӳ��ؼ����ƺͲ�ѯ�ֶ����ñ��浽tr��������
    jQuery('#mapTable').children().each(function(){
        jQuery(this).attr('_dataFieldName', jQuery('input[type="text"]:first', this).val());
        jQuery(this).attr('_itemTitle', jQuery('input[type="text"]:eq(1)', this).val());
        jQuery(this).attr('_isQuery', (jQuery('input[type="checkbox"]:checked', this).length > 0 ? '1' : '0'));
    });

    return _checkCtrlProp();
}


function _checkCtrlProp()
{
    var message = "";

    if(jQuery('#dataSrc').val() == '' || jQuery('#dataSrc').val() == "undefined")
    {
        message = "��ѡ��������Դ";
        return message;

    }

    if(jQuery('#mapTable').children().length <= 0)
    {
        message = "�����ӳ���ϵ";
        return message;

    }
    return message;
}

//��ӳ���ϵ��������γɸ�ʽ������
function getMapTable()
{
    var mapTable = {
        dataField: '',
        dataFieldName: '',
        itemTitle: '',
        isQuery: ''
    };

    jQuery('#mapTable').children().each(function(){
        mapTable.dataField += (typeof(jQuery(this).attr('_dataField')) != 'undefined' ? jQuery(this).attr('_dataField') : '') + '`';
        mapTable.dataFieldName += (typeof(jQuery(this).attr('_dataFieldName')) != 'undefined' ? jQuery(this).attr('_dataFieldName') : '') + '`';
        mapTable.itemTitle += (typeof(jQuery(this).attr('_itemTitle')) != 'undefined' ? jQuery(this).attr('_itemTitle') : '') + '`';
        mapTable.isQuery += (typeof(jQuery(this).attr('_isQuery')) != 'undefined' ? jQuery(this).attr('_isQuery') : '') + '`';
    });

    return mapTable;
}

//�ⲿ����ѡ��ؼ��ڵ�һ�μ�����ɺ���Ҫ���ݿؼ������Ի��������͸�ѡ��ֻ��ҳ�������ɺ�ִ��һ��
function extLoadInit(dataField,dataFieldName,itemTitle,isQuery)
{

    var dataFieldArray = dataField.split('`');
    var dataFieldNameArray = dataFieldName.split('`');
    var itemTitleArray = itemTitle.split('`');
    var isQueryArray = isQuery.split('`');
    for(var i=0; i<dataFieldArray.length; i++)
    {
        if(!dataFieldArray[i])
        {
            continue;
        }

        var tr = jQuery('#mapTable tr[_dataField="' + dataFieldArray[i] + '"]:first');
        if(tr.length > 0)
        {

            var thisQuery = isQueryArray[i] == '1' ? 1 : 0;
            tr.attr('_itemTitle', itemTitleArray[i]);
            tr.attr('_isQuery', thisQuery);
            jQuery('input[type="text"]:first', tr).val(dataFieldNameArray[i]);
            jQuery('input[type="text"]:eq(1)', tr).val(itemTitleArray[i]);
            jQuery('input[type="checkbox"]:first', tr).attr('checked', (thisQuery == 1));
        }
    }
}

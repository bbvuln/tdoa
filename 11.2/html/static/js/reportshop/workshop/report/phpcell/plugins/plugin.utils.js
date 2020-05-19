/**
 * �ͻ��˱�̽ӿ�ʵ��
 */
/**
 * get_column_value: ��ȡָ���С�ָ���ֶε�ֵ
 * @param _s_cid:�ֶ�Ψһ��ʶ��
 * @param _i_seq:�к�
 * @return:�ֶεĴ洢ֵ
 */
function get_column_value(_s_cid, _i_seq, _b_raw)
{
    if (_b_raw == undefined)
        _b_raw = false;
    var obj_schema = crsReport.crsTableIndex.getAColSchema(_s_cid);
    if (obj_schema == undefined) {
        alert("�ֶβ�����");
        return "";
    }
    if (_b_raw) {
        var i_id = get_column_id_by_kid(_s_cid);
        return obj_schema.col.get_raw_value(i_id, _i_seq);
    } else {
        var s_res = "";
        if (!obj_schema.canread && !obj_schema.canwrite) {
            s_res = crsReport.crsTableIndex.get_hidden_cell_value(_s_cid, _i_seq);
        } else {
            var obj_p = obj_schema.get_cell_point(_i_seq);
            s_res = crsReport.crsCommon.get_cell_value(parseInt(crsReport.crsTableIndex.rows[obj_schema.row_idx].sheetindex) - 1, obj_p.x, obj_p.y); 
        }
        return s_res;
    }
}

function set_column_hidden(_s_cid)
{
    var obj_schema = crsReport.crsTableIndex.getAColSchema(_s_cid);
    if (obj_schema == undefined) {
        alert("�ֶβ�����");
        return "";
    }
    if (obj_schema.ishidden == "��")
        return;
    obj_schema.ishidden = "��";
    obj_schema.canread = false;
    obj_schema.canwrite = false;
    var obj_tab = crsReport.crsTableIndex.rows[obj_schema.row_idx];
    if (obj_tab.tabletype == "����") {
        if (obj_schema.col.arr_hidden_cols == null) {
            obj_schema.col.arr_hidden_cols = [];
        }
        obj_schema.col.arr_hidden_cols.push(obj_schema.col_idx);
        var i_idx = obj_schema.col.arr_output_cols.indexOf(obj_schema.col_idx);
        if (i_idx != -1) {
            obj_schema.col.arr_output_cols.splice(i_idx, 1);
        } else if (obj_schema.col.arr_picture_cols != null) {
            i_idx = obj_schema.col.arr_picture_cols.indexOf(obj_schema.col_idx);
            if (i_idx != -1)
                obj_schema.col.arr_picture_cols.splice(i_idx, 1);
        }
    }
    if (crsReport.crsTableIndex.arr_hidden_rows == null) {
        crsReport.crsTableIndex.arr_hidden_rows = {};
    }
    if (crsReport.crsTableIndex.arr_hidden_rows[obj_tab.id] == undefined) {
        crsReport.crsTableIndex.arr_hidden_rows[obj_tab.id] = {"col": [], "dat": []};
    }
    crsReport.crsTableIndex.arr_hidden_rows[obj_tab.id]["col"].push(obj_schema.kid);
}

/**
 * set_column_disable: ����ָ���С�ָ���ֶεı༭��ʧЧ����Ч
 * @param _s_cid:�ֶ�Ψһ��ʶ��
 * @param _i_seq:�к�
 * @param _b_disable:ʧЧ������Ч
 * @return:��
 */
function set_column_disable(_s_cid, _i_seq, _b_disable)
{
    crsReport.crsCommon.set_cell_disable(_s_cid, _i_seq, _b_disable);
}

function get_column_id_by_kid(_s_cid)
{
    var obj_schema = crsReport.crsTableIndex.getAColSchema(_s_cid);
    if (obj_schema == undefined) {
        alert("�ֶβ�����");
        return "";
    }
    return obj_schema.id;
}
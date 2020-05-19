/**
 * 客户端编程接口实现
 */
/**
 * get_column_value: 获取指定行、指定字段的值
 * @param _s_cid:字段唯一标识符
 * @param _i_seq:行号
 * @return:字段的存储值
 */
function get_column_value(_s_cid, _i_seq, _b_raw)
{
    if (_b_raw == undefined)
        _b_raw = false;
    var obj_schema = crsReport.crsTableIndex.getAColSchema(_s_cid);
    if (obj_schema == undefined) {
        alert("字段不存在");
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
        alert("字段不存在");
        return "";
    }
    if (obj_schema.ishidden == "是")
        return;
    obj_schema.ishidden = "是";
    obj_schema.canread = false;
    obj_schema.canwrite = false;
    var obj_tab = crsReport.crsTableIndex.rows[obj_schema.row_idx];
    if (obj_tab.tabletype == "主表") {
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
 * set_column_disable: 设置指定行、指定字段的编辑器失效或生效
 * @param _s_cid:字段唯一标识符
 * @param _i_seq:行号
 * @param _b_disable:失效或者生效
 * @return:无
 */
function set_column_disable(_s_cid, _i_seq, _b_disable)
{
    crsReport.crsCommon.set_cell_disable(_s_cid, _i_seq, _b_disable);
}

function get_column_id_by_kid(_s_cid)
{
    var obj_schema = crsReport.crsTableIndex.getAColSchema(_s_cid);
    if (obj_schema == undefined) {
        alert("字段不存在");
        return "";
    }
    return obj_schema.id;
}
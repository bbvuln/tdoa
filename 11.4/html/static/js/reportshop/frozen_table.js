/*
 * ������ͷ����
 *
 * ��������
 *   table - Ҫ�����ı��Ԫ�ػ��߱��ID
 *   freezeRowNum - Ҫ������ǰ��������������в�������������Ϊ0
 *   freezeColumnNum - Ҫ������ǰ��������������в�������������Ϊ0
 *   width - ���Ĺ���������
 *   height - ���Ĺ�������߶�
 */
function freezeTable(table, freezeRowNum, freezeColumnNum, width, height) {
    if (typeof(freezeRowNum) == 'string')
        freezeRowNum = parseInt(freezeRowNum)

    if (typeof(freezeColumnNum) == 'string')
        freezeColumnNum = parseInt(freezeColumnNum)

    var tableId;
    if (typeof(table) == 'string') {
        tableId = table;
        table = $('#' + tableId);
    } else
        tableId = table.attr('id');

    var divTableLayout = $("#" + tableId + "_tableLayout");

    if (divTableLayout.length != 0) {
        divTableLayout.before(table);
        divTableLayout.empty();
    } else {
        table.after("<div id='" + tableId + "_tableLayout' style='overflow:hidden;height:" + height + "px; width:" + width + "px;'></div>");

        divTableLayout = $("#" + tableId + "_tableLayout");
    }

    var html = '';
    if (freezeRowNum > 0 && freezeColumnNum > 0)
        html += '<div id="' + tableId + '_tableFix" style="padding: 0px;"></div>';

    if (freezeRowNum > 0)
        html += '<div id="' + tableId + '_tableHead" style="padding: 0px;"></div>';

    if (freezeColumnNum > 0)
        html += '<div id="' + tableId + '_tableColumn" style="padding: 0px;"></div>';

    html += '<div id="' + tableId + '_tableData" style="padding: 0px;"></div>';


    $(html).appendTo("#" + tableId + "_tableLayout");

    var divTableFix = freezeRowNum > 0 && freezeColumnNum > 0 ? $("#" + tableId + "_tableFix") : null;
    var divTableHead = freezeRowNum > 0 ? $("#" + tableId + "_tableHead") : null;
    var divTableColumn = freezeColumnNum > 0 ? $("#" + tableId + "_tableColumn") : null;
    var divTableData = $("#" + tableId + "_tableData");

    divTableData.append(table);

    if (divTableFix != null) {
        var tableFixClone = table.clone(true);
        tableFixClone.attr("id", tableId + "_tableFixClone");
        divTableFix.append(tableFixClone);
    }

    if (divTableHead != null) {
        var tableHeadClone = table.clone(true);
        tableHeadClone.attr("id", tableId + "_tableHeadClone");
        divTableHead.append(tableHeadClone);
    }

    if (divTableColumn != null) {
        var tableColumnClone = table.clone(true);
        tableColumnClone.attr("id", tableId + "_tableColumnClone");
        divTableColumn.append(tableColumnClone);
    }

    $("#" + tableId + "_tableLayout table").css("margin", "0");

    if (freezeRowNum > 0) {
        var HeadHeight = 0;
        var ignoreRowNum = 0;
        $("#" + tableId + "_tableHead tr:lt(" + freezeRowNum + ")").each(function () {
            if (ignoreRowNum > 0)
                ignoreRowNum--;
            else {
                var td = $(this).find('td:first, th:first');
                HeadHeight += td.outerHeight(true);

                ignoreRowNum = td.attr('rowSpan');
                if (typeof(ignoreRowNum) == 'undefined')
                    ignoreRowNum = 0;
                else
                    ignoreRowNum = parseInt(ignoreRowNum) - 1;
            }
        });
        HeadHeight += 2;

        divTableHead.css("height", HeadHeight);
        divTableFix != null && divTableFix.css("height", HeadHeight);
    }

    if (freezeColumnNum > 0) {
        var ColumnsWidth = 0;
        var ColumnsNumber = 0;
        $("#" + tableId + "_tableColumn tr:eq(" + freezeRowNum + ")").find("td:lt(" + freezeColumnNum + "), th:lt(" + freezeColumnNum + ")").each(function () {
            if (ColumnsNumber >= freezeColumnNum)
                return;

            ColumnsWidth += $(this).outerWidth(true);

            ColumnsNumber += $(this).attr('colSpan') ? parseInt($(this).attr('colSpan')) : 1;
        });
        ColumnsWidth += 2;

        divTableColumn.css("width", ColumnsWidth);
        divTableFix != null && divTableFix.css("width", ColumnsWidth);
    }

    divTableData.scroll(function () {
        divTableHead != null && divTableHead.scrollLeft(divTableData.scrollLeft());

        divTableColumn != null && divTableColumn.scrollTop(divTableData.scrollTop());
    });

    divTableFix != null && divTableFix.css({"overflow": "hidden", "position": "absolute", "z-index": "50"});
    divTableHead != null && divTableHead.css({
        "overflow": "hidden",
        "width": width - 17,
        "position": "absolute",
        "z-index": "45"
    });
    divTableColumn != null && divTableColumn.css({
        "overflow": "hidden",
        "height": height - 17,
        "position": "absolute",
        "z-index": "40"
    });
    divTableData.css({"overflow": "scroll", "width": width, "height": height, "position": "absolute"});

    divTableFix != null && divTableFix.offset(divTableLayout.offset());
    divTableHead != null && divTableHead.offset(divTableLayout.offset());
    divTableColumn != null && divTableColumn.offset(divTableLayout.offset());
    divTableData.offset(divTableLayout.offset());
}

/*
 * ����������Ŀ�Ⱥ͸߶ȣ����������resize�¼��е���
 *
 * ��������
 *   table - Ҫ�����ı��Ԫ�ػ��߱��ID
 *   width - ���Ĺ���������
 *   height - ���Ĺ�������߶�
 */
function adjustTableSize(table, width, height) {
    var tableId;
    if (typeof(table) == 'string')
        tableId = table;
    else
        tableId = table.attr('id');

    $("#" + tableId + "_tableLayout").width(width).height(height);
    $("#" + tableId + "_tableHead").width(width - 17);
    $("#" + tableId + "_tableColumn").height(height - 17);
    $("#" + tableId + "_tableData").width(width).height(height);
}

function pageHeight() {
    if ($.browser && $.browser.msie) {
        return document.compatMode == "CSS1Compat" ? document.documentElement.clientHeight : document.body.clientHeight;
    } else {
        return self.innerHeight;
    }
};

//���ص�ǰҳ����
function pageWidth() {
    if ($.browser && $.browser.msie) {
        return document.compatMode == "CSS1Compat" ? document.documentElement.clientWidth : document.body.clientWidth;
    } else {
        return self.innerWidth;
    }
};

var isFrozen = false;
function frozen(i_sheet, i_col, i_row) {
    $("#showdiv").attr("align", "left");
    var obj_win = window;//$("iframe:eq(0)")[0].contentWindow;
    var tableId = "sheet" + i_sheet;//table.attr('id');
    var table = $("#" + tableId, obj_win.document);
    var freezeRowNum = i_row;//table.attr('freezeRowNum');
    var freezeColumnNum = i_col;//table.attr('freezeColumnNum');

    if (typeof(freezeRowNum) != 'undefined' || typeof(freezeColumnNum) != 'undefined') {
        obj_win.freezeTable(table, freezeRowNum || 0, freezeColumnNum || 0, obj_win.pageWidth(), obj_win.pageHeight());

        var flag = false;
        $(window).resize(function () {
            if (flag)
                return;

            setTimeout(function () {
                obj_win.adjustTableSize(tableId, obj_win.pageWidth(), obj_win.pageHeight());
                flag = false;
            }, 100);

            flag = true;
        });
        if(!isFrozen) isFrozen = true;
    }
}

function unfrozen() {
    //var atop = $(document).scrollTop();
    //var aleft = $(document).scrollLeft();
    window.location.reload();
    //window.scrollTo(aleft, atop);
    isFrozen = false;
}

$(document).ready(function () {
    if(window.parent != undefined && window.parent.is_mobile || typeof(is_mobile) != 'undefined' && is_mobile) {
        $("td").bind("click", function () {
            if ($(this).find("a").length > 0) return;
            var d = $(this).attr("class").indexOf(" ");
            if (d == -1) {
                d = $(this).attr("class").length
            }
            var a = $(this).attr("class").substr(0, d);
            var b = {
                x: a.replace("column", ""),
                y: $(this).parent().attr("id").replace("row", ""),
                "pg": $(this).parent().parent().parent().attr("id").replace("sheet", "")
            };
            frozen(b.pg, parseInt(b.x) + 1, parseInt(b.y) + 1);
        });
    }else{
        $("td").bind("dblclick", function () {
            if ($(this).find("a").length > 0) return;
            var d = $(this).attr("class").indexOf(" ");
            if (d == -1) {
                d = $(this).attr("class").length
            }
            var a = $(this).attr("class").substr(0, d);
            var b = {
                x: a.replace("column", ""),
                y: $(this).parent().attr("id").replace("row", ""),
                "pg": $(this).parent().parent().parent().attr("id").replace("sheet", "")
            };
            frozen(b.pg, parseInt(b.x) + 1, parseInt(b.y) + 1);
        });
    }
    // var table = $("table");
    // var tableId = table.attr('id');
    // var freezeRowNum = table.attr('freezeRowNum');
    // var freezeColumnNum = table.attr('freezeColumnNum');
    //
    // if (typeof(freezeRowNum) != 'undefined' || typeof(freezeColumnNum) != 'undefined') {
    //     freezeTable(table, freezeRowNum || 0, freezeColumnNum || 0, pageWidth(), pageHeight());
    //
    //     var flag = false;
    //     $(window).resize(function () {
    //         if (flag)
    //             return;
    //
    //         setTimeout(function () {
    //             adjustTableSize(tableId, pageWidth(), pageHeight());
    //             flag = false;
    //         }, 100);
    //
    //         flag = true;
    //     });
    // }
});
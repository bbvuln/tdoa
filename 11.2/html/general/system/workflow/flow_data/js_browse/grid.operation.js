jQuery(document).ready(function(){
    function tdClick(){
        //将td的文本内容保存
        var td = jQuery(this);
        var tdText = td.text();
        //获取列名
        var column_name=td.find("input[name=column]").val();
        //获取key_id
        var key_value=td.parent().find("#key_value").val();
        td.empty();
        var input = jQuery("<input type='text'>");
        input.attr("value",tdText);
        td.append(input);
        input.blur(function(){  
            var input = jQuery(this);
            var inputText = input.val();
            var td = input.parent("td");
            td.html(inputText);
            jQuery.ajax
            ({           
                url:"column_value.php?d_name="+d_name+"&key_value="+key_value+"&column_name="+column_name+"&input_value="+inputText,
                async: false,
                success: function(data){
                    if(data.indexOf('error') !== -1)
                    {
                        alert(data.substr(6));
                    }
                    jQuery("#gridTable").trigger("reloadGrid");
                },
                error: function(data){        
                    alert(data.responseText);
                }
            });         
            //将列名返回td中
            var old_hidden=jQuery("<input type='hidden' name='column'>");
            old_hidden.attr("value",column_name);
            td.append(old_hidden);
            //让td重新拥有点击事件
            td.click(tdClick);
        });
        //将输入框中的文本高亮选中
        var inputDom = input.get(0);
        inputDom.select();
        //将td的点击事件移除
        td.unbind("click");
    }
    var sizeArr = getLogGridTableSize();
    jQuery.getJSON("data_browse/getcolumns.php?d_name="+d_name, {
            "date":Date.parse(new Date()), 
            "cookieName":cookieName, 
            'vWidth':jQuery(document.body).width()-2,
            'pageType':pageType
        }, 
        function(columns){
            jQuery.each(columns.fields, function(i,t){
                if(t.sortable == ""){
                    columns.fields[i].sortable = false;
                }else if(t.checkable == ""){
                    columns.fields[i].checkable = false;
                }else if(t.resizable == ""){
                    columns.fields[i].resizable = false;
                }
                columns.fields[i].hidden = (t.hidden === 'true' ? true : false);
            });
            jQuery("#gridTable").jqGrid({
                datatype:"json",
                url: "data_browse/getdata.php",
                mtype: "POST",
                postData: {d_name: d_name, pageType: pageType},
                height: sizeArr.vHeight,
                width: sizeArr.vWidth,
                shrinkToFit: false, //用于控制列宽是否按比例进行计算
                colModel:columns.fields,
                sortname:'id',
                sortorder:'asc',
                viewrecords:true,
                subGridWidth: 30,
                rowNum:jQuery.cookie(cookieName+"_perpage") ? jQuery.cookie(cookieName+"_perpage") : 10,
                rowList:[10,20,30,40,50,60,70,80,90,100],
                pager:"#pager",
                loadComplete:function(xhr){
                    jQuery("td[aria-describedby=gridTable_OPERATION]").removeAttr("title");                    
                    var tdNods = jQuery("td[title]");
                    jQuery("a[id=save]").hide();
                    tdNods.click(tdClick);
                    jQuery("#gridTable").find("tr:even").addClass("alt");
                    jQuery('#current_page').html(jQuery(this).getGridParam("page"));
                    jQuery('#gopage_url').val(jQuery(this).getGridParam("url"));
                    jQuery('#gopage').val(jQuery(this).getGridParam("page"));
                    jQuery('#total_page').html(jQuery('#sp_1_pager').html());
                    jQuery('#total_records').html(jQuery(this).getGridParam("records"));
                    jQuery("select.ui-pg-selbox").change(function(){
                        jQuery.cookie(cookieName+"_perpage",jQuery(this).val(),{expires:30});
                    });
                    if(jQuery(this).getGridParam("records") == 0){
                        jQuery(".jqgfirstrow").css("height","1px");
                    }
                    loadPager();
                },
                resizeStop:function(newWidth, index){
                    var colName = jQuery("#gridTable").getGridParam('colModel')[index].name;
                    jQuery.cookie(cookieName+"_"+colName+"_width",newWidth,{expires:30});
                }
            });
        });
        jQuery(window).resize(function(){
        var sizeArr = getLogGridTableSize();
        jQuery("#gridTable").jqGrid('setGridWidth',sizeArr.vWidth);
        jQuery("#gridTable").jqGrid('setGridHeight',sizeArr.vHeight);

    });
});        

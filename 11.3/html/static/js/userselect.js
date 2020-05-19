userSaveAndBind = {
    init: function() {

        //privҳ���ʼ��ajax
        jQuery.ajax({
            type: "POST",
            url: "/module/user_select/data.php",
            data: {ACTION:"priv",FUNC_ID:1,MODULE_ID:2,PRIV_NO_FLAG:0},
            dataType: "json",
            success: function(msg) {
                if(msg.status == 1) {
                    jQuery("#priv_menu").html("");
                    jQuery("#priv_item").html("");
                    jQuery("#priv_menu").append("<div class='block-left-header' title=" + msg.data[0].title + ">"+ msg.data[0].name +"</div>");
                    var msgshout = msg.data.slice(1);
                    jQuery.each(msgshout,function(index,element) {
                        jQuery("#priv_menu").append("<div class='block-left-item' action='bypriv' block='priv' title=" + element.priv_name + " item_id="+element.item_id+">"+element.priv_name+"</div>");
                    });
                    jQuery("#priv_item").append("<div class='message'>��ѡ���ɫ</div>")
                }
                else if(msg.status == 0) {
                    jQuery("#priv_menu").html("");
                    jQuery("#priv_item").html("");
                    jQuery("#priv_menu").append("<div class='message'>���޽�ɫ</div>")
                }
            }
        });

        //groupҳ���ʼ��ajax
        jQuery.ajax({
            type: "POST",
            url: "/module/user_select/data.php",
            data: {ACTION:"group",FUNC_ID:1,MODULE_ID:2,PRIV_NO_FLAG:0},
            dataType: "json",
            success: function(msg){
                if(msg.status == 0) {
                    jQuery("#group_menu").html("");
                    jQuery("#group_item").html("");
                    jQuery("#group_menu").append("<div class='message'>��δ���÷���</div>")
                }
                else if(msg.status == 1) {
                    jQuery("#block_group #group_menu").html("");
                    jQuery("#block_group #group_item").html("");
                    jQuery.each(msg.data,function(index,element) {
                        jQuery("#block_group #group_item").append("<div class='message'>��ѡ�����</div>");
                        jQuery("#block_group #group_menu").append("<div class='block-left-header'>" + element.title + "</div>")
                        jQuery.each(element.data,function(index,deepelement) {
                            jQuery("#block_group #group_menu").append("<div class='block-left-item' action='bygroup' block='group' title=" + deepelement.group_name + " item_id=" + deepelement.group_id + "><span>" + deepelement.group_name + "</span></div>")
                        })
                    })
                }

            }
        });

        //onlineҳ���ʼ��ajax
        jQuery.ajax({
            type: "POST",
            url: "/module/user_select/data.php",
            data: {ACTION:"online",FUNC_ID:1,MODULE_ID:2,PRIV_NO_FLAG:0},
            dataType: "json",
            success: function(msg) {
                jQuery("#online_item_0").html("");
                jQuery("#online_item_0").append("<div class='block-right-header' title='������Ա'>������Ա</div>"+
                                            "<div class='block-right-add'>ȫ�����</div>"+
                                            "<div class='block-right-remove'>ȫ��ɾ��</div>");
                jQuery.each(msg.data,function(index,element) {
                    jQuery("#online_item_0").append("<div class='block-right-item' item_id=" + element.user_id + " item_name=" + element.user_name + " user_id=" + element.user_id + " title=" + element.priv_name.replace(/\s/g,'') +"[" + element.dept_long_name + "]><span class='name'>" + element.user_name + "<span class='status'> (" + element.attend_status + ")</span></span></div>")
                });
            }
        })
    },

    //����selectedҳ�����⣬������ʼ��
    initSelected: function(id) {

        //selectedҳ���ʼ��ajax
        jQuery.ajax({
            type: "POST",
            url: "/module/user_select/data.php",
            data: {ACTION:"selected",FUNC_ID:1,MODULE_ID:2,PRIV_NO_FLAG:0,TO_ID_STR:id.toString()},
            dataType: "json",
            success: function(response) {
                if(response.status == 0) {
                    jQuery("#block_selected .right #selected_item_0").html("");
                    jQuery("#block_selected .right #selected_item_0").append("<div class='message'>" + response.msg + "</div>");
                }
                else if(response.status == 1) {
                    jQuery("#block_selected .right #selected_item_0").html("");
                    jQuery("#block_selected .right #selected_item_0").append("<div class='block-right-header' title='������Ա'>������Ա</div>"+
                                                                "<div class='block-right-add'>ȫ�����</div>"+
                                                                "<div class='block-right-remove'>ȫ��ɾ��</div>");
                    jQuery.each(response.data,function(index,element){
                        jQuery("#block_selected .right #selected_item_0").append("<div class='block-right-item active' item_id=" + element.user_id + " item_name=" + element.user_name + " user_id=" + element.user_id + " title=" + element.priv_name.replace(/\s/g,'') +"[" + element.dept_long_name + "]><span class='name'>" + element.user_name + "<span class='status'> (" + element.attend_status + ")</span></span></div>")
                    })
                }
            },
            error: function(XMLResponse) {
                alert(XMLResponse.responseText);
            }
        });
    },

    //Ϊ���ɵĽ�ɫ�󶨵���¼�
    itemBindClick: function(id) {

        //left-item
        jQuery(".block-left-item").die('click.checked');
        jQuery(".block-left-item").live('click.checked',function() {
            var self =this
            if(jQuery(self).hasClass("active")) {
                return;
            }
            else {
                jQuery(self).parent().children(".block-left-item").removeClass("active");
                jQuery(self).addClass("active");
            }
        });

        //priv left-item
        jQuery("#priv_menu .block-left-item").die('click.ajax');
        jQuery("#priv_menu .block-left-item").live('click.ajax',function() {
            var self = this;
            if(jQuery("#priv_item .block-right-header[title=" + jQuery(self).attr("title") + "]").length > 0) {
                jQuery("#priv_item").children().hide();
                jQuery("#priv_item .block-right-header[title=" + jQuery(self).attr("title") + "]").parent().show();
                return;
            }
            jQuery.ajax({
                type: "POST",
                url: "/module/user_select/data.php",
                data: {ACTION:"bypriv",FUNC_ID:1,USER_PRIV:jQuery(self).attr("item_id"),MODULE_ID:2,PRIV_NO_FLAG:0},
                dataType: "json",
                success: function(msg){
                    if(msg.status == 0) {
                        jQuery("#priv_item").children().hide();
                        jQuery("#priv_item .message").show();
                        jQuery("#priv_item .message").text(msg.msg);
                        return;
                    }
                    else if(msg.status == 1) {
                        jQuery("#priv_item").children().hide();
                        jQuery("#priv_item").append("<div class='block-right' id=priv_item_" + jQuery(self).attr("item_id") + "><div class='block-right-header' title=" + jQuery(self).attr("title") + ">" + jQuery(self).attr("title") + "</div><div class='block-right-add'>ȫ�����</div><div class='block-right-remove'>ȫ��ɾ��</div></div>")
                        jQuery.each(msg.data,function(index,element) {
                            if(element.priv_id == jQuery(self).attr("item_id")) {
                                jQuery("#priv_item_"+jQuery(self).attr("item_id")).append("<div class='block-right-item' item_id=" + element.user_id + " item_name=" + element.user_name + " user_id=" + element.user_id + " title=" + element.priv_name + "><span class='name'>" + element.user_name + "</span></div>");
                            }
                            else {
                                if(jQuery("#priv_item_"+jQuery(self).attr("item_id")).find(".block-right-header[title:'������ɫ']").length > 0 ){
                                    return;
                                }
                                else {
                                    jQuery("#priv_item").append("<div class='block-right-header' style='margin-top:10px;' title='������ɫ'>������ɫ</div>")
                                }     
                            }
                            if(id.toString().indexOf(element.user_id) != -1) {
                                jQuery(".block-right-item[item_name=" + element.user_name + "]").addClass("active");
                            }
                        })
                    }
                }
            })
        });

        //group left-item
        jQuery("#group_menu .block-left-item").die('click.ajax');
        jQuery("#group_menu .block-left-item").live('click.ajax',function() {
            var self = this;
            if(jQuery("#" + jQuery(self).attr("block") + "_item .block-right-header[title=" + jQuery(self).attr("title") + "]").length > 0) {
                jQuery("#" + jQuery(self).attr("block") + "_item").children().hide();
                jQuery("#" + jQuery(self).attr("block") + "_item .block-right-header[title=" + jQuery(self).attr("title") + "]").parent().show();
                return;
            }
            jQuery.ajax({
                type: "POST",
                url: "/module/user_select/data.php",
                data: {ACTION:"bygroup",FUNC_ID:1,GROUP_ID:jQuery(self).attr("item_id"),MODULE_ID:2,PRIV_NO_FLAG:0},
                dataType: "json",
                success: function(msg){
                    if(msg.status == 0) {
                        jQuery("#" + jQuery(self).attr("block") + "_item").children().hide();
                        jQuery("#" + jQuery(self).attr("block") + "_item .message").show();
                        jQuery("#" + jQuery(self).attr("block") + "_item .message").text(msg.msg);
                        return;
                    }
                    else if(msg.status == 1) {
                        jQuery("#group_item").children().hide();
                        jQuery("#group_item").append("<div class='block-right' id=group_item_" + jQuery(self).attr("item_id") + "><div class='block-right-header' title=" + jQuery(self).attr("title") + ">" + jQuery(self).attr("title") + "</div><div class='block-right-add'>ȫ�����</div><div class='block-right-remove'>ȫ��ɾ��</div>")
                        jQuery.each(msg.data,function(index,element) {
                            jQuery("#group_item_" + jQuery(self).attr("item_id")).append("<div class='block-right-item' item_id=" + element.user_id + " item_name=" + element.user_name + " user_id=" + element.user_id + " title=" + element.priv_name + "><span class='name'>" + element.user_name + "</span></div>");
                            if(id.toString().indexOf(element.user_id) != -1) {
                                jQuery(".block-right-item[item_name=" + element.user_name + "]").addClass("active");
                            }
                        })
                    }
                }
            })
        });

        //ȫ�����
        jQuery(".block-right-add").die('click');
        jQuery(".block-right-add").live('click',function() {
            var self =this;
            jQuery.each(jQuery(self).parent().find(".block-right-item"),function(index,element) {
                jQuery(".block-right-item[item_id=" + jQuery(element).attr("item_id") + "]").addClass("active");
                id.push(jQuery(element).attr("user_id"));
            })
        })

        //ȫ��ɾ��
        jQuery(".block-right-remove").die('click');
        jQuery(".block-right-remove").live('click',function() {
            var self =this;
            jQuery.each(jQuery(self).parent().find(".block-right-item"),function(index,element) {
                jQuery(".block-right-item[item_id=" + jQuery(element).attr("item_id") + "]").removeClass("active");
                userSaveAndBind.removeByValue(id,jQuery(element).attr("item_id"))
            })
        })

        //block-right-item����¼�
        jQuery(".block-right-item").die('click');
        jQuery(".block-right-item").live('click',function() {
            var self = this;
            if(jQuery(self).hasClass("active")) {
                jQuery(".block-right-item[item_id=" + jQuery(self).attr("item_id") + "]").removeClass("active");
                userSaveAndBind.removeByValue(id,jQuery(self).attr("item_id"));
            }
            else {
                jQuery(".block-right-item[item_id=" + jQuery(self).attr("item_id") + "]").addClass("active");
                id.push(jQuery(self).attr("user_id"));
            }
        });
    },

    //Ϊ������keyup�¼�
    bindKeyup: function() {
        jQuery("#keyword").die('keyup');
        jQuery("#keyword").live('keyup',function() {
            jQuery(".main-block").css("display","none");
            jQuery("#block_query").css("display","block");
            var self=this;
            jQuery.ajax({
                type: "POST",
                url: "/module/user_select/data.php",
                data: {ACTION:"query",FUNC_ID:1,MODULE_ID:2,PRIV_NO_FLAG:0,KEYWORD:$(self).val()},
                dataType: "json",
                success: function(msg){

                }
            })
        })
    },

    //ɾ������ָ��Ԫ��
    removeByValue: function(arr, val) {
        for(var i=0; i<arr.length; i++) {
            if(arr[i] == val) {
                arr.splice(i, 1);
                break;
            }
        }
    },

    TO_ID:[],
    COPY_TO_ID:[],
    SECRET_TO_ID:[]
} 

function user_select(value)
{
    var $ = jQuery;

    //������¼�
    $("#navMenu a").die('click');

    //��ʾģ̬��
    if($(".alert-module-box").is(":hidden"))
    {
        $(".alert-module-box").show()
    }
    else
    {
        $("body .alert-module-box").hide()
    }

    //�ж��Ƿ���ʾ��ѡ
    $("#navMenu a").removeClass("active"); //ȥ��a��ǩ��active
    if(userSaveAndBind[value] != ""){
        $(".alert-module-box-text-box .main-block").hide();
        $(".alert-module-box-text-box #block_selected").show();
        $("#navMenu a[block='selected']").addClass("active");
    }
    else{
        $(".alert-module-box-text-box .main-block").hide();
        $(".alert-module-box-text-box #block_dept").show();
        $("#navMenu a[block='dept']").addClass("active");
    }

    //��ʼ��ҳ�棬����ÿ��ѡ���ajax�����ÿ��ҳ������ݣ�����װ
    userSaveAndBind.init();
    userSaveAndBind.initSelected(userSaveAndBind[value]);

    //�󶨵���¼�
    userSaveAndBind.itemBindClick(userSaveAndBind[value]);

    //������keyup�¼�
    userSaveAndBind.bindKeyup()

    //�ر�ģ̬��
    $('.BigButtonA').live('click',function(){
        $(".alert-module-box").hide();
    })

    //�����������ɫ�仯��ҳ���л�
    $("#navMenu a").live('click',function(){
        var self=this;
        if($(self).hasClass("active")){
            return;
        }
        else{
            $(self).parent().find("a.active").removeClass("active");
            $(".main-block").css("display","none")
            $(self).addClass("active");
            $("#block_" + $(self).attr("block")).css("display","block");
        }
        if($(self).attr("block") == "selected") {
            userSaveAndBind.initSelected(userSaveAndBind[value]);
        }
    });

}


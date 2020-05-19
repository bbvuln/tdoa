$(function (){
    $(document).ready(function() {
        $('div[id^="dept-tags"]').each(function(){
            var targetid = $(this).attr('data-dept-id');
            //var depttags = $('#dept-tags'+targetid).data('tags') || $('#dept-tags'+targetid).tags().data('tags');
            var depttags = $('#dept-tags'+targetid).data('tags') || $('#dept-tags'+targetid).tags({
                callbacks: {
                    remove: function(){
                        var c = depttags.serialize();
                        $('#manager_id_'+targetid).val(c.value ? c.value + ',' : c.value);
                        $('#manager_name_'+targetid).val(c.text ? c.text + ',' : c.text);
                        
                    },
                    clear: function(){
                        
                        $('#manager_id_'+targetid).val('');
                        $('#manager_name_'+targetid).val('');
                    }
                }
            }).data('tags');
            //depttags.clear();
            var manager_id = $('#manager_id_'+targetid).val();
            var manager_name = $('#manager_name_'+targetid).val();
            var manager_idarr=manager_id.split(",");
            var manager_namearr=manager_name.split(",");
            var result=[];
            for(var i = 0; i < manager_idarr.length-1; i++){
                var json = {};
                json["value"] = manager_idarr[i];
                json["text"] = manager_namearr[i];
                result[i] = json;
            }
            $.each(result, function(){
                depttags.add(this);
            }); 
        })  
        
        $('div[id^="higherdept-tags"]').each(function(){
            var targetid = $(this).attr('data-dept-id');
            var depttags = $('#higherdept-tags'+targetid).data('tags') || $('#higherdept-tags'+targetid).tags({
                callbacks: {
                    remove: function(){
                        var c = depttags.serialize();
                        $('#highermanager_id_'+targetid).val(c.value ? c.value + ',' : c.value);
                        $('#highermanager_name_'+targetid).val(c.text ? c.text + ',' : c.text);
                    },
                    clear: function(){
                        
                        $('#highermanager_id_'+targetid).val('');
                        $('#highermanager_name_'+targetid).val('');
                    }
                }
            }).data('tags');
            var manager_id = $('#highermanager_id_'+targetid).val();
            var manager_name = $('#highermanager_name_'+targetid).val();
            var manager_idarr=manager_id.split(",");
            var manager_namearr=manager_name.split(",");
            var result=[];
            for(var i = 0; i < manager_idarr.length-1; i++){
                var json = {};
                json["value"] = manager_idarr[i];
                json["text"] = manager_namearr[i];
                result[i] = json;
            }
            $.each(result, function(){
                depttags.add(this);
            }); 
        })

        $("button[id^='dept-plus-']").click(function(){
            var dept = $(this).attr("id");
            var deptid = dept.substr(10,dept.length);
            var to_id = "manager_id_"+deptid,
            to_name = "manager_name_"+deptid;
            var usertags = $("#dept-tags"+deptid).tags({
                callbacks: {
                    remove: function(){
                        var c = usertags.serialize();
                        $('#manager_id_'+deptid).val(c.value ? c.value + ',' : c.value);
                        $('#manager_name_'+deptid).val(c.text ? c.text + ',' : c.text);
                    },
                    clear: function(){
                        $('#manager_id_'+deptid).val('');
                        $('#manager_name_'+deptid).val('');
                    }
                }
            }).data('tags');
            window.org_select_callbacks = window.org_select_callbacks || {};
            window.org_select_callbacks.add = function(item_id, item_name){
                usertags.add({ value: item_id, text: item_name });
            };
            window.org_select_callbacks.remove = function(item_id, item_name){
                usertags.remove(item_id);
            };
            window.org_select_callbacks.clear = function(){
                usertags.clear();
            };
            SelectUser('31', '', to_id, to_name);
            return false;
        })
        $("button[id^='higherdept-plus-']").click(function(){
            var dept = $(this).attr("id");
            var deptid = dept.substr(16,dept.length);
            var to_id = "highermanager_id_"+deptid,
            to_name = "highermanager_name_"+deptid;
            var usertags = $("#higherdept-tags"+deptid).tags({
                callbacks: {
                    remove: function(){
                        var c = usertags.serialize();
                        $('#highermanager_id_'+deptid).val(c.value ? c.value + ',' : c.value);
                        $('#highermanager_name_'+deptid).val(c.text ? c.text + ',' : c.text);
                    },
                    clear: function(){
                        $('#highermanager_id_'+deptid).val('');
                        $('#highermanager_name_'+deptid).val('');
                    }
                }
            }).data('tags');
            window.org_select_callbacks = window.org_select_callbacks || {};
            window.org_select_callbacks.add = function(item_id, item_name){
                usertags.add({ value: item_id, text: item_name });                    
            };
            window.org_select_callbacks.remove = function(item_id, item_name){
                usertags.remove(item_id);
            };
            window.org_select_callbacks.clear = function(){
                usertags.clear();
            };
            SelectUser('31', '', to_id, to_name);
            return false;
        })
        $("button[id^='dept-trash-']").click(function(){
            var dept = $(this).attr("id");
            var deptid = dept.substr(11,dept.length);
            $('#manager_id_'+deptid).val('');
            $('#manager_name_'+deptid).val('');
            var usertags = $("#dept-tags"+deptid).tags({
                callbacks: {
                    remove: function(){
                        var c = usertags.serialize();
                        $('#manager_id_'+deptid).val(c.value ? c.value + ',' : c.value);
                        $('#manager_name_'+deptid).val(c.text ? c.text + ',' : c.text);
                    },
                    clear: function(){
                        $('#manager_id_'+deptid).val('');
                        $('#manager_name_'+deptid).val('');
                    }
                }
            }).data('tags');
            usertags.clear();
        })
        $("button[id^='higherdept-trash-']").click(function(){
            var dept = $(this).attr("id");
            var deptid = dept.substr(17,dept.length);
            $('#highermanager_id_'+deptid).val('');
            $('#highermanager_name_'+deptid).val('');
            var usertags = $("#higherdept-tags"+deptid).tags({
                callbacks: {
                    remove: function(){
                        var c = usertags.serialize();
                        $('#highermanager_id_'+deptid).val(c.value ? c.value + ',' : c.value);
                        $('#highermanager_name_'+deptid).val(c.text ? c.text + ',' : c.text);
                    },
                    clear: function(){
                        $('#highermanager_id_'+deptid).val('');
                        $('#highermanager_name_'+deptid).val('');
                    }
                }
            }).data('tags');
            usertags.clear();
        })
    });
});
jQuery(document).ready(function(){
    jQuery.getJSON("/general/workflow/get_flow_list.inc.php",{"FLOW_ID":"<?=$FLOW_ID?>","action":3,"root":true},function(jsonData){
        jQuery("#FLOW_ID").html("");
            jQuery.each(jsonData,function(i,t){
                jQuery("#FLOW_ID").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+'>'+t.txt+'</option>');
                jQuery("#flow_id").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+'>'+t.txt+'</option>');
                jQuery("#EXP_FLOW_ID").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+'>'+t.txt+'</option>');
                jQuery("#DEL_FLOW_ID").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+'>'+t.txt+'</option>');
                jQuery("#exp_flow_id").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+'>'+t.txt+'</option>');
                jQuery("#del_flow_id").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+'>'+t.txt+'</option>');
                jQuery("#DES_FLOW_ID").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+'>'+t.txt+'</option>');
                jQuery("#RES_FLOW_ID").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+'>'+t.txt+'</option>');
            });
        });
})
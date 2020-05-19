function trigger_callback(type, args){
    //var parent_window = jQuery.browser.msie ? parent.dialogArguments : parent.opener;
    var parent_window = parent.opener;
    if(typeof parent_window.org_select_callbacks == 'object' && (typeof parent_window.org_select_callbacks[type] == 'function' || typeof parent_window.org_select_callbacks[type] == 'object')){
        try
        {
           // parent_window.org_select_callbacks[type].apply(this, args);
           //console.log(args)
           parent_window.org_select_callbacks[type](args);

        }
        catch(e)
        {

        }
    }
}

function begin_set()
{

	jQuery("td[class='menulines']").each(function(){
		var user_id = jQuery(this).attr("id");
		var user_name = jQuery(this).attr("name");
        if(parent.prcs_user != "" && parent.prcs_user != null && (parent.prcs_user.indexOf(","+user_id+",")>0 || parent.prcs_user.indexOf(user_id+",")==0)){
            //console.log('经办add',user_id, user_name)
            borderize_on(jQuery(this));
        }else{
            //console.log('经办remove',user_id, user_name)
            borderize_off(jQuery(this));
        }
	});
	jQuery("td[class='menulines_op']").each(function(){
		var op_user_id = jQuery(this).attr("id").substr(0, jQuery(this).attr("id").length-3);
		var op_user_name = jQuery(this).attr("name");
		if(parent.op_user == op_user_id){
		    //console.log('主办add',op_user_id, op_user_name)
			borderize_on(jQuery(this));
			jQuery($("opbox_"+op_user_id)).attr('checked', true);
		}else{
		    //console.log('主办remove',op_user_id, op_user_name)
			borderize_off(jQuery(this));
		}
	});

	//console.log(parent.prcs_user,parent.op_user)

	var _op_uid = parent.op_user;
	var _prcs_uid = parent.prcs_user;
	var _op_uname = parent.op_uname;
	var _prcs_uname = parent.prcs_uname;

	//_op_uname = jQuery('#'+parent.op_user+'_op').attr('name');

	//liumingcai,wangyun,wangde,
//	var arr = _prcs_uid.split(',')
//	if(arr.length > 0 ){
//	    arr.forEach(function(item){
//    	    if(item != null && item != undefined && item != ''){
//    	        var name = jQuery('#'+item).attr('name')
//    	        name = name ? name : '';
//    	        _prcs_uname += jQuery('#'+item).attr('name')+',';
//    	    }
//    	})
//    }

    var args = {
        prcs_op_uid: _op_uid,
        prcs_op_uname: _op_uname,
        prcs_uid: _prcs_uid,
        prcs_uname: _prcs_uname
    }
    args = JSON.stringify(args)
    trigger_callback('update',args);

}

function begin_set_others()
{
//    var remind_others_id_val = remind_others_id.val();
    jQuery("td[class='menulines']").each(function(){
		var user_id = jQuery(this).attr("id");
        if(parent.prcs_user != "" && parent.prcs_user != null && (parent.prcs_user.indexOf(","+user_id+",")>0 || parent.prcs_user.indexOf(user_id+",")==0))
        {
            borderize_on(jQuery(this));
        }
	});
}
function click_user(user_id, is_child_node)
{
	var self = jQuery($(user_id));
	var user_name = self.attr('name');
	if(parent.prcs_user == "" && parent.top_flag == 0){ //如果经办为空则同时选择主办人
		set_op(user_id,user_name);
	}
	if(parent.prcs_user.indexOf(","+user_id+",")>0 || parent.prcs_user.indexOf(user_id+",")==0){
		if(parent.prcs_user.indexOf(user_id+",") == 0){
			parent.prcs_user = parent.prcs_user.replace(user_id+",","")
			if(parent.prcs_uname.indexOf(","+user_name+",")>0 || parent.prcs_uname.indexOf(user_name+",")==0){
			    parent.prcs_uname = parent.prcs_uname.replace(user_name+",","")
			}
			if(parent.prcs_uname.indexOf(","+user_name+",")>0){
			    parent.prcs_uname = parent.prcs_uname.replace(user_name+",","")
			}
	
		}
		if(parent.prcs_user.indexOf(","+user_id+",")>0){
			parent.prcs_user = parent.prcs_user.replace(","+user_id+",", ",");
            if(parent.prcs_uname.indexOf(","+user_name+",")>0 || parent.prcs_uname.indexOf(user_name+",")==0){
			    parent.prcs_uname = parent.prcs_uname.replace(user_name+",","")
			}
			if(parent.prcs_uname.indexOf(","+user_name+",")>0){
			    parent.prcs_uname = parent.prcs_uname.replace(user_name+",","")
			}
		}
		//console.log(parent.prcs_user, parent.prcs_uname)
		if(parent.op_user == user_id){
			unset_op();
		}
	}else{
		parent.prcs_user =  parent.prcs_user + user_id + ",";
		parent.prcs_uname =  parent.prcs_uname + user_name + ",";
	}
    if(parent.top_flag != 0){
        jQuery("input[id^='opbox_']").attr("checked",false);
    }
    //console.log(parent.prcs_user, parent.prcs_uname)
	begin_set();
}
function click_others(user_id)
{
    var self = jQuery($(user_id));
	var user_name = self.attr('name');
//    var remind_others_id_val = remind_others_id.val();
//    var remind_others_name_val = remind_others_name.val();
//    if(remind_others_id_val.indexOf(user_id) >= 0)
//    {
//        var remind_others_id_val_left = remind_others_id_val.substr(0,remind_others_id_val.indexOf(user_id));
//        var remind_others_id_val_right = remind_others_id_val.substr(remind_others_id_val.indexOf(user_id) + user_id.length + 1);
//        var remind_others_name_val_left = remind_others_name_val.substr(0,remind_others_name_val.indexOf(user_name));
//        var remind_others_name_val_right = remind_others_name_val.substr(remind_others_name_val.indexOf(user_name) + user_name.length + 1);
//        var remind_others_id_val_new = remind_others_id_val_left + remind_others_id_val_right;
//        var remind_others_name_val_new = remind_others_name_val_left + remind_others_name_val_right;
//        remind_others_id.val(remind_others_id_val_new);
//        remind_others_name.val(remind_others_name_val_new);
//        borderize_off(self)
//    }
//    else
//    {
//        remind_others_id_val += user_id+",";
//        remind_others_name_val += user_name+",";
//        remind_others_id.val(remind_others_id_val);
//        remind_others_name.val(remind_others_name_val);
//        borderize_on(self);
//    }
}
function add_all_others()
{
//    var remind_others_id_val = remind_others_id.val();
//    var remind_others_name_val = remind_others_name.val();
//    jQuery("td[class='menulines']").each(function(){
//		var user_id = jQuery(this).attr('id');
//		var user_name = jQuery(this).attr('name');
//        if(remind_others_id_val.indexOf(user_id) < 0)
//        {
//            remind_others_id_val += user_id+",";
//            remind_others_name_val += user_name+",";
//            remind_others_id.val(remind_others_id_val);
//            remind_others_name.val(remind_others_name_val);
//            borderize_on(jQuery(this));
//        }
//	});
}
function del_all_others()
{
//    jQuery("td[class='menulines']").each(function(){
//        var remind_others_id_val = remind_others_id.val();
//        var remind_others_name_val = remind_others_name.val();
//		var user_id = jQuery(this).attr('id');
//		var user_name = jQuery(this).attr('name');
//        if(remind_others_id_val.indexOf(user_id) >= 0)
//        {
//            var remind_others_id_val_left = remind_others_id_val.substr(0,remind_others_id_val.indexOf(user_id));
//            var remind_others_id_val_right = remind_others_id_val.substr(remind_others_id_val.indexOf(user_id) + user_id.length + 1);
//            var remind_others_name_val_left = remind_others_name_val.substr(0,remind_others_name_val.indexOf(user_name));
//            var remind_others_name_val_right = remind_others_name_val.substr(remind_others_name_val.indexOf(user_name) + user_name.length + 1);
//            var remind_others_id_val_new = remind_others_id_val_left + remind_others_id_val_right;
//            var remind_others_name_val_new = remind_others_name_val_left + remind_others_name_val_right;
//            remind_others_id.val(remind_others_id_val_new);
//            remind_others_name.val(remind_others_name_val_new);
//            borderize_off(jQuery(this));
//        }
//	});
}

function click_op(op_id) //处理主办
{
	var targetelement = jQuery($(op_id));
	var user_id = op_id.substr(0, op_id.length-3);
	var user_name = targetelement.attr('name');
	if(parent.op_user == user_id){
		unset_op();
	}else{
        if(parent.top_flag == 0){
            set_op(user_id,user_name);
        }
		if((!(parent.prcs_user.indexOf(","+user_id+",")>0 || parent.prcs_user.indexOf(user_id+",")==0)) && parent.top_flag == 0){
      		click_user(user_id);
      	}
	}
	begin_set();
}

function uncheck_all()
{
	jQuery("input[type='checkbox']").attr('checked', false);
}

function set_op(user_id,user_name)
{
	unset_op();
	if(parent.top_flag != 0){ //没有主办人的情况下不做任何操作
		return;
	}
	parent.op_user = user_id;
	parent.op_uname = user_name;
	uncheck_all();
	document.getElementById("opbox_"+user_id).checked=true;
}

function unset_op()
{
	parent.op_user = '';
	parent.op_uname = '';
	uncheck_all();
}


function borderize_on(targetelement)
{
	var color = "#003FBF";
	jQuery(targetelement).css({
		'borderColor'		: "black",
		'backgroundColor'	: color,
		'color'				: "white",
		'fontWeight'		: "bold"
	});
}

function borderize_off(targetelement)
{
	jQuery(targetelement).css({
		'borderColor'		: "",
		'backgroundColor'	: '',
		'color'				: "",
		'fontWeight'		: ""
	});
}

function add_all()
{
	jQuery("td[class='menulines']").each(function(){
		var user_id = jQuery(this).attr('id');
		var user_name = jQuery(this).attr('name');
		if(parent.prcs_user.indexOf(','+user_id+',') < 0 && parent.prcs_user.indexOf(user_id + ',') != 0){
			parent.prcs_user = parent.prcs_user + user_id + ',';
			
			parent.prcs_uname = parent.prcs_uname + user_name + ',';
		}
	});
	begin_set();
}

function del_all()
{
	jQuery("td[class='menulines']").each(function(){
		var user_id = jQuery(this).attr('id');
		var user_name = jQuery(this).attr('name');
		if(user_id == parent.op_user){
			unset_op();
		}
		if(parent.prcs_user.indexOf(user_id + ',') == 0){
			parent.prcs_user = parent.prcs_user.replace(user_id + ',', '');
			if(parent.prcs_uname.indexOf(","+user_name+",")>0 || parent.prcs_uname.indexOf(user_name+",")==0){
			    parent.prcs_uname = parent.prcs_uname.replace(user_name+",","")
			}
			if(parent.prcs_uname.indexOf(","+user_name+",")>0){
			    parent.prcs_uname = parent.prcs_uname.replace(user_name+",","")
			}
			//parent.prcs_uname = parent.prcs_uname.replace(user_name + ',', '');
		}
		if(parent.prcs_user.indexOf(',' + user_id + ',') > 0){
			parent.prcs_user = parent.prcs_user.replace(',' + user_id +',', ',');
			//parent.prcs_uname = parent.prcs_uname.replace(',' + user_name +',', ',');
			if(parent.prcs_uname.indexOf(","+user_name+",")>0 || parent.prcs_uname.indexOf(user_name+",")==0){
			    parent.prcs_uname = parent.prcs_uname.replace(',' + user_name +',', ',');
			}
			if(parent.prcs_uname.indexOf(","+user_name+",")>0){
			    parent.prcs_uname = parent.prcs_uname.replace(',' + user_name +',', ',');
			}
		}
	});
	begin_set();
}

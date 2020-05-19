function begin_set()
{
	jQuery(document).find("td[class='menulines']").each(function(){
		var user_id = jQuery(this).attr("id");
        if(prcs_user.val() != "" && prcs_user.val() != null)
        {   
            if(prcs_user.val().indexOf(","+user_id+",")>0 || prcs_user.val().indexOf(user_id+",")==0){
                borderize_on(jQuery(this));	
            }else{
                borderize_off(jQuery(this));
            }
        }
	});
	jQuery(document).find("td[class='menulines_op']").each(function(){
		var op_user_id = jQuery(this).attr("id").substr(0, jQuery(this).attr("id").length-3);
		if(op_user.val() == op_user_id){
			borderize_on(jQuery(this));
			jQuery($("opbox_"+op_user_id)).attr('checked', true);
		}else{
			borderize_off(jQuery(this));	
		}
	});
}
function click_user(user_id)
{
	var self = jQuery($(user_id));
	var user_name = self.attr('name');
    var prcs_user_val = prcs_user.val();
	if(prcs_user.val() == ""){ //�������Ϊ����ͬʱѡ��������
		set_op(user_id,user_name);
	}
	if(prcs_user_val.indexOf(","+user_id+",")>0 || prcs_user_val.indexOf(user_id+",")==0){
		if(prcs_user_val.indexOf(user_id+",") == 0){
			prcs_user.val(prcs_user.val().replace(user_id+",",""));
		}
		if(prcs_user_val.indexOf(","+user_id+",")>0){
			prcs_user.val(prcs_user.val().replace(","+user_id+",", ",")) ;
		}
		removeName(user_id);
		if(op_user.val() == user_id){
			unset_op();	
		}
	}else{
		prcs_user.val(prcs_user.val() + user_id + ",");
    	addName(user_id,user_name);	
	}
	begin_set();
}
function removeName(user_id)
{
	jQuery(prcs_op_block_div).find("div[class='user-tags'][user_id='"+user_id+"']").remove();
}
function addName(user_id,user_name)
{
	jQuery(prcs_op_block_div).append('<div class="user-tags" user_id="'+user_id+'">'+user_name+'<i class="close">��</i></div>');
}

function click_op(op_id) //��������
{ 
	var targetelement = jQuery($(op_id));
	var user_id = op_id.substr(0, op_id.length-3);
	var user_name = targetelement.attr('name');
    var prcs_user_val = prcs_user.val();
	if(op_user.val() == user_id){
		unset_op();
	}else{
		set_op(user_id,user_name);
		if(!(prcs_user_val.indexOf(","+user_id+",")>0 || prcs_user_val.indexOf(user_id+",")==0)){
      		click_user(user_id);
      	}      		
	}
	begin_set();
}

function  uncheck_all()
{
	jQuery("input[type='checkbox']").attr('checked', false);
  
}

function set_op(user_id,user_name)
{
	unset_op();
	if(top_flag != 0){ //û�������˵�����²����κβ���
		return;
	}
	op_user.val(user_id);
	jQuery(host_op_block_div).append('<div class="user-tags" user_id="'+user_id+'">'+user_name+'<i class="close">��</i></div>');
	uncheck_all();
	document.getElementById("opbox_"+user_id).checked=true;
}

function unset_op()
{
	op_user.val('');
	jQuery(host_op_block_div).find('.user-tags').remove();
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
    var prcs_user_val = prcs_user.val();
	jQuery("td[class='menulines']").each(function(){
		var user_id = jQuery(this).attr('id');
		var user_name = jQuery(this).attr('name');
		if(prcs_user_val.indexOf(','+user_id+',') < 0 && prcs_user_val.indexOf(user_id + ',') != 0){
			prcs_user.val(prcs_user.val() + user_id + ',');
			addName(user_id, user_name);
		}
	});
	begin_set();
}

function del_all()
{
    var prcs_user_val = prcs_user.val();
	jQuery("td[class='menulines']").each(function(){
		var user_id = jQuery(this).attr('id');
		var user_name = jQuery(this).attr('name');
		if(user_id == op_user.val()){
			unset_op();
		}
		if(prcs_user_val.indexOf(user_id + ',') == 0){
			prcs_user.val(prcs_user.val().replace(user_id + ',', ''));
		}
		if(prcs_user_val.indexOf(',' + user_id + ',') > 0){
			prcs_user.val(prcs_user.val().replace(',' + user_id +',', ','));
		}
		removeName(user_id);
	});
	begin_set();
}
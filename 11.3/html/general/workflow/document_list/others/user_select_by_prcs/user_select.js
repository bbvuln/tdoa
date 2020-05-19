function begin_set()
{
	jQuery(document).find("td[class='menulines']").each(function(){
		var user_id = jQuery(this).attr("id");
		if($to_id.val().indexOf(","+user_id+",")>0 || $to_id.val().indexOf(user_id+",")==0){
			borderize_on(jQuery(this));	
		}else{
			borderize_off(jQuery(this));
		}
	});
}
function click_user(user_id)
{
	var self = jQuery($(user_id));
	var user_name = self.attr('name');
	if($to_id.val().indexOf(","+user_id+",")>0 || $to_id.val().indexOf(user_id+",")==0){
		removeName(user_id,user_name);
		if($to_id.val().indexOf(user_id+",") == 0){
			$to_id.val($to_id.val().replace(user_id+",",""));
		}
		if($to_id.val().indexOf(","+user_id+",")>0){
			$to_id.val($to_id.val().replace(","+user_id+",", ",")) ;
		}
	}else{
		$to_id.val($to_id.val() + user_id + ",");
    	addName(user_id,user_name);	
	}
	begin_set();
}
function removeName(user_id,user_name)
{
	if($to_id.val().indexOf(user_id+",") == 0){
		$to_name.val($to_name.val().replace(user_name+",",""));
	}
	if($to_id.val().indexOf(","+user_id+",")>0){
		$to_name.val($to_name.val().replace(","+user_name+",", ",")) ;
	}
}
function addName(user_id,user_name)
{
	$to_name.val($to_name.val() + user_name + ",");
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
		if($to_id.val().indexOf(','+user_id+',') < 0 && $to_id.val().indexOf(user_id + ',') != 0){
			$to_id.val($to_id.val() + user_id + ',');
			addName(user_id, user_name);
		}
	});
	begin_set();
}

function del_all()
{
	jQuery("td[class='menulines']").each(function(){
		var user_id = jQuery(this).attr('id');
		var user_name = jQuery(this).attr('name');
		removeName(user_id,user_name);
		if($to_id.val().indexOf(user_id + ',') == 0){
			$to_id.val($to_id.val().replace(user_id + ',', ''));
		}
		if($to_id.val().indexOf(',' + user_id + ',') > 0){
			$to_id.val($to_id.val().replace(',' + user_id +',', ','));
		}
	});
	begin_set();
}
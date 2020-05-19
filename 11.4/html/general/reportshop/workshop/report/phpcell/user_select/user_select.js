function begin_set()
{
	var user_obj = document.getElementsByTagName("td");
  for (step_i=0; step_i<user_obj.length; step_i++)
  {
    if(user_obj[step_i].className=="menulines")
    {
       user_id=user_obj[step_i].id;
       if(op_user.value.indexOf(","+user_id+",")>0 || op_user.value.indexOf(user_id+",")==0)
          borderize_on(user_obj[step_i]);
       else
       	  borderize_off(user_obj[step_i]);
    }
  }
}
function click_user(user_id)
{
  var targetelement=document.getElementById(user_id);
  var user_name=targetelement.getAttribute("name");

//  if(op_user.value=="")
//     set_op(user_id,user_name);

  if(op_user.value.indexOf(","+user_id+",")>0 || op_user.value.indexOf(user_id+",")==0)
  {
  	if(op_user.value.indexOf(user_id+",")==0)
      op_user.value=op_user.value.replace(user_id+",","");
    if(op_user.value.indexOf(","+user_id+",")>0)
      op_user.value=op_user.value.replace(","+user_id+",",",");

    removeName(user_id);
  }
  else
  {
    op_user.value+=user_id+",";
    addName(user_id,user_name);
  }
  begin_set();
}
function removeName(user_id)
{
   var user_span = op_user_name.getElementsByTagName('span');
   for(var i=0;i<user_span.length;i++)
   {
   	 if(user_span[i].id==user_id)
   	 {
   	 	if(is_moz)
	    {
		    var obj_parent=user_span[i].parentNode;
		    obj_parent.removeChild(user_span[i]);
	    }
	    else
   	    user_span[i].removeNode(true);
   	  break;
   	 }
   }
}
function addName(user_id,user_name)
{
	var user_span = parent_window.createElement("span");
	user_span.setAttribute("class","underline");
	user_span.setAttribute("id",user_id);
	user_span.innerHTML=user_name+DEL_IMG1;
    op_user_name.appendChild(user_span);
}

function click_op(op_id)
{
  var targetelement=document.getElementById(op_id);
  var user_id=op_id.substr(0,op_id.length-3);
  var user_name=targetelement.getAttribute("name");
  if(op_user.value==user_id)
     unset_op();
  else
  {
    set_op(user_id,user_name);

    if(!(prcs_user.value.indexOf(","+user_id+",")>0 || prcs_user.value.indexOf(user_id+",")==0))
      click_user(user_id);
  }
  begin_set();
}

function  uncheck_all()
{
	var obj_array = document.getElementsByTagName("input");
	for (check_i=0; check_i<obj_array.length; check_i++)
  {
  	obj_array[check_i].checked=false;
  }
}

function set_op(user_id,user_name)
{
	unset_op();

	if(top_flag!=0)
	   return;

  op_user.value = user_id;
  var op_span = parent_window.createElement("span");
  op_span.setAttribute("className","underline");
  op_span.setAttribute("id",user_id);
  op_span.innerHTML=user_name+DEL_IMG0;
  op_user_name.appendChild(op_span);
  uncheck_all();
  document.getElementById("opbox_"+user_id).checked=true;
}

function unset_op()
{
   op_user.value='';
   op_user_name.innerHTML='';
   uncheck_all();
}


function borderize_on(targetelement)
{
 color="#003FBF";
 targetelement.style.borderColor="black";
 targetelement.style.backgroundColor=color;
 targetelement.style.color="white";
 targetelement.style.fontWeight="bold";
}

function borderize_off(targetelement)
{
  targetelement.style.backgroundColor="";
  targetelement.style.borderColor="";
  targetelement.style.color="";
  targetelement.style.fontWeight="";
}

function add_all()
{
	var user_obj = document.getElementsByTagName("td");
  for (var step_i=0; step_i<user_obj.length; step_i++)
  {
    if(user_obj[step_i].className=="menulines")
    {
       user_id=user_obj[step_i].id;
       user_name=user_obj[step_i].getAttribute("name");
       borderize_on(user_obj[step_i]);
       if(op_user.value.indexOf(","+user_id+",")<0 && op_user.value.indexOf(user_id+",")!=0)
       {
           op_user.value+=user_id+",";
          addName(user_id,user_name);
       }
    }
  }
}

function del_all()
{
  var user_obj = document.getElementsByTagName("td");
  for (var step_i=0; step_i<user_obj.length; step_i++)
  {
    if(user_obj[step_i].className=="menulines")
    {
       user_id=user_obj[step_i].id;
       user_name=user_obj[step_i].getAttribute("name");
       if(user_id==op_user.value)
          unset_op();

       if(op_user.value.indexOf(user_id+",")==0)
           op_user.value=op_user.value.replace(user_id+",","");
       if(op_user.value.indexOf(","+user_id+",")>0)
         op_user.value=op_user.value.replace(","+user_id+",",",");

       removeName(user_id);
       borderize_off(user_obj[step_i]);
    }
  }
  begin_set();
}

function getOpenner()
{
    if(is_moz || true)
        return parent.opener.document;
    else
        return parent.dialogArguments.document;
}
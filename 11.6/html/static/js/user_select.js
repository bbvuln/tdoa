function click_user(user_id)
{
  TO_VAL=to_id.value;
  TO_NAME=to_name.value;
  targetelement=$(user_id);
  user_name=targetelement.title;
  if(TO_VAL.indexOf(","+user_id+",")>0 || TO_VAL.indexOf(user_id+",")==0)
  {
    if(TO_VAL.indexOf(user_id+",")==0)
       to_id.value=to_id.value.replace(user_id+",","");
    else if(TO_VAL.indexOf(","+user_id+",")>0)
       to_id.value=to_id.value.replace(","+user_id+",",",");
    
    if(TO_NAME.indexOf(user_name+",")==0)
       to_name.value=to_name.value.replace(user_name+",","");
    else if(TO_NAME.indexOf(","+user_name+",")>0)
       to_name.value=to_name.value.replace(","+user_name+",",",");
    
    borderize_off(targetelement);
  }
  else
  {
  	//处理最大字符数
  	var to_name_length = to_name.value.length + user_name.length;
  	if(to_name.maxLength < to_name_length && to_name.maxLength != -1)
  		return;
  	
    to_id.value+=user_id+",";
    to_name.value+=user_name+",";
    borderize_on(targetelement);
  }

}

function borderize_on(targetelement)
{
   if(targetelement.className.indexOf("TableRowActive") < 0)
      targetelement.className = "TableRowActive " + targetelement.className;
}

function borderize_off(targetelement)
{
   if(targetelement.className.indexOf("TableRowActive") >= 0)
      targetelement.className = targetelement.className.substr(15);
}

function begin_set()
{
  TO_VAL=to_id.value;

  for (step_i=0; step_i<allElements.length; step_i++)
  {
    if(allElements[step_i].className.indexOf("menulines")>=0)
    {
       user_id=allElements[step_i].id;
       if(TO_VAL.indexOf(","+user_id+",")>0 || TO_VAL.indexOf(user_id+",")==0)
          borderize_on(allElements[step_i]);
    }
  }
  
  set_attend_status();
}
function set_attend_status()
{
   var evection = leave = out = null;
   var dept = parent.dept;
   if(dept)
   {
      evection = dept.document.getElementById('user_evection');
      leave = dept.document.getElementById('user_leave');
      out = dept.document.getElementById('user_out');
   }
   
   if(!evection || !leave || !out)
   {
      window.setTimeout(set_attend_status, 1000);
      return;
   }
   
   var user_evection = evection.innerText;
   var user_leave = leave.innerText;
   var user_out = out.innerText;
   
   var spans = document.getElementsByTagName("span");
   for(var i=0; i<spans.length; i++)
   {
      var span = spans[i];
      if(span.id.substr(0, 14) != "attend_status_" || span.innerHTML != "" || span.title == "" || span.title == "undefined")
         continue;
      
      var user_id = span.title;
      if(user_evection.indexOf(user_id+",") == 0 || user_evection.indexOf(","+user_id+",") > 0)
         span.innerHTML = td_lang.inc.msg_100;//"(出差)"
      else if(user_leave.indexOf(user_id+",") == 0 || user_leave.indexOf(","+user_id+",") > 0)
         span.innerHTML = td_lang.inc.msg_101;//"(请假)"
      else if(user_out.indexOf(user_id+",") == 0 || user_out.indexOf(","+user_id+",") > 0)
         span.innerHTML = td_lang.inc.msg_102;//"(外出)"
   }
}
function add_all(flag)
{
  if(isUndefined(flag))
     flag="";
  TO_VAL=to_id.value;
  for (step_i=0; step_i<allElements.length; step_i++)
  {
    if(allElements[step_i].className.indexOf("menulines"+flag)>=0)
    {
       user_id=allElements[step_i].id;
       user_name=allElements[step_i].title;

       if(TO_VAL.indexOf(","+user_id+",")<0 && TO_VAL.indexOf(user_id+",")!=0)
       {
         to_id.value+=user_id+",";
         to_name.value+=user_name+",";
         borderize_on(allElements[step_i]);
       }
    }
  }
}

function del_all(flag)
{
  if(isUndefined(flag))
     flag="";

  for (step_i=0; step_i<allElements.length; step_i++)
  {
    TO_VAL=to_id.value;
    TO_NAME=to_name.value;
    if(allElements[step_i].className.indexOf("menulines"+flag)>=0)
    {
       user_id=allElements[step_i].id;
       user_name=allElements[step_i].title;
       if(TO_VAL.indexOf(user_id+",")==0)
          to_id.value=to_id.value.replace(user_id+",","");
       else if(TO_VAL.indexOf(","+user_id+",")>0)
          to_id.value=to_id.value.replace(","+user_id+",",",");
       
       if(TO_NAME.indexOf(user_name+",")==0)
          to_name.value=to_name.value.replace(user_name+",","");
       else if(TO_NAME.indexOf(","+user_name+",")>0)
          to_name.value=to_name.value.replace(","+user_name+",",",");
       
       borderize_off(allElements[step_i]);
    }
  }
}
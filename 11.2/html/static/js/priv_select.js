
function close_window()
{
   if(typeof(window.external) == 'undefined' || typeof(window.external.OA_SMS) == 'undefined' || !window.external.OA_SMS("", "", "GET_VERSION") || window.external.OA_SMS("", "", "GET_VERSION") < '20110223')
   {
      window.open('','_self','');
      window.close();
   }
   else
   {
      window.external.OA_SMS("", "", "CLOSE_WINDOW")
   }
}

function trigger_callback(type, args){
    var parent_window = jQuery.browser.msie ? parent.dialogArguments : parent.opener;
    if(typeof parent_window.org_select_callbacks == 'object' && typeof parent_window.org_select_callbacks[type] == 'function'){
        try
        {
            parent_window.org_select_callbacks[type].apply(this, args);
        }
        catch(e)
        {
        
        }
    }
}

function add_item(item_id, item_name)
{
   if(!item_id || !item_name)
      return;
   
   if(single_select)
   {
      to_id_field.value = item_id;
      to_name_field.value = item_name;
      trigger_callback('add', arguments);
      close_window();
      return;
   }

   if(item_id == "ALL_DEPT")
   {   
      to_id_field.value = item_id;
      to_name_field.value = item_name;
      trigger_callback('add', arguments);
      return;
   }
   
   if(to_id_field.value == 'ALL_DEPT' || to_id_field.value == 'ALL_DEPT,')
   {
      to_id_field.value = '';
      to_name_field.value = '';
      trigger_callback('clear');
   }

   if(to_id_field.value.indexOf(item_id + ",") != 0 && to_id_field.value.indexOf("," + item_id + ",") <= 0)
   {
      to_id_field.value += item_id + ",";
      to_name_field.value += item_name + ",";
   }
   trigger_callback('add', arguments);
}
function remove_item(item_id, item_name)
{
   if(!item_id || !item_name)
      return;

   if(single_select)
   {        
      trigger_callback('remove', arguments);
      clear_item();
      return;
   }

   if(to_id_field.value.indexOf(item_id + ",") == 0 || to_id_field.value.indexOf("," + item_id + ",") > 0)
   {
      if(to_id_field.value.indexOf(item_id + ",") == 0)
         to_id_field.value = to_id_field.value.substr(item_id.length + 1);
      else if(to_id_field.value.indexOf("," + item_id + ",") > 0)
         to_id_field.value = to_id_field.value.replace("," + item_id + ",", ",");
      
      if(to_name_field.value.indexOf(item_name + ",") == 0)
         to_name_field.value = to_name_field.value.substr(item_name.length + 1);
      else if(to_name_field.value.indexOf("," + item_name + ",")>0)
         to_name_field.value = to_name_field.value.replace("," + item_name + ",", ",");
   
      trigger_callback('remove', arguments);
      //jQuery(".block-right-item[item_id='" + item_id + "']").removeClass('active');
   }
}
function clear_item()
{
   to_id_field.value = '';
   to_name_field.value = '';
   jQuery('.block-right:visible .block-right-item').removeClass('active');
   trigger_callback('clear', arguments);
}
function init_item(block)
{
   jQuery('#' + block + '_item .block-right-item').each(function(){
      var item_id = this.getAttribute("item_id");
      if(to_id_field.value.indexOf(item_id + ",") == 0 || to_id_field.value.indexOf("," + item_id + ",") > 0 || to_id_field.value == item_id)
         jQuery(this).addClass('active');
      else
         jQuery(this).removeClass('active');
   });
   trigger_callback('init', arguments);
}

//点击部门名称事件
function node_click(node)
{
   if(node.isStatusNode() || !node.data.dept_id)
      return ;
   
   if(node.data.url)
      get_items(node.data.url + '&ACTION=bydept&TITLE=' + node.data.title + '&' + query_string, 'dept', node.data.dept_id);
}

//点击部门复选框事件
function click_node(id,checked)
{
   id = id.substr(5);
   var item_id_prefix = typeof(action_children_prefix) == 'undefined' ? '' : action_children_prefix;
	var url = item_url + "?ACTION=children&DEPT_ID=" + id + "&CHECKED=" + checked + "&" + query_string;
	get_items(url, 'dept', item_id_prefix+id);
	
	var dept_item_i = jQuery('#dept_item_' + item_id_prefix + id);
	if(dept_item_i.length > 0)
	{
   	if(checked)
   	{
   	   if(id == "0" && jQuery('.block-right-alldept', dept_item_i).length > 0)
   	      jQuery('.block-right-alldept', dept_item_i).trigger('click');
   	   else
            jQuery('.block-right-add', dept_item_i).trigger('click');
      }
      else
      {
         jQuery('.block-right-remove', dept_item_i).trigger('click');
      }
   }
}

function get_items(url, block, item_id)
{
   var block_item = jQuery('#' + block + '_item_' + item_id);
   if(block != 'selected' && block != 'query' && block_item.length > 0)
   {
      block_item.siblings().hide();
      block_item.show();
      init_item(block);
   }
   else
   {
      jQuery.ajax({
         url:url,
         async:false,
         dataType:'json',
         success:function(data){
            if(data.item && jQuery('#' + block + '_item').length > 0)
            {
               jQuery('#' + block + '_item').children().hide();
               if(block == 'dept' || block == 'priv' || block == 'group')
                  jQuery('#' + block + '_item').append(data.item);
               else
                  jQuery('#' + block + '_item').html(data.item);
               
               init_item(block);
               
               if(data.checked)
                  jQuery('#' + block + '_item_' + item_id + ' .block-right-add').trigger('click');
            }
            
            if(data.menu && jQuery('#' + block + '_menu').length > 0)
               jQuery('#' + block + '_menu').html(data.menu);
         },
         error:function(XMLHttpRequest, textStatus, errorThrown){
            alert(textStatus)
         }
      });
   }
}

function get_items_group(url, block, item_id)
{
   var block_item = jQuery('#' + block + '_item_' + item_id);
   if(block != 'selected' && block_item.length > 0)
   {
      block_item.siblings().hide();
      block_item.show();
      init_item(block);
   }
   else
   {
      jQuery.ajax({
         url:url,
         async:false,
         dataType:'json',
         success:function(data){
            if(data.item && jQuery('#' + block + '_item').length > 0)
            {
               jQuery('#' + block + '_item').children().hide();
               if(block == 'dept' || block == 'priv' || block == 'group')
                  jQuery('#' + block + '_item').append(data.item);
               else
               {
                  jQuery('#dept_item').show();
                  jQuery('#dept_item').html(data.item);
               }
               init_item(block);
               
               if(data.checked)
                  jQuery('#' + block + '_item_' + item_id + ' .block-right-add').trigger('click');
            }
            
            if(data.menu && jQuery('#' + block + '_menu').length > 0)
               jQuery('#' + block + '_menu').html(data.menu);
         },
         error:function(XMLHttpRequest, textStatus, errorThrown){
            alert(textStatus)
         }
      });
   }
}

function load_init()
{
   //顶部标签点击事件
   jQuery('#navMenu > a').click(function(){
      jQuery(this).siblings().removeClass('active');
      jQuery(this).addClass('active');
      jQuery('.main-block').hide();
      
      var block = jQuery(this).attr('block');
      jQuery('#block_' + block).show();
      init_item(block);
      if(block == "selected" || jQuery('#' + block + '_item').text() == "" && block != "query")
      {
         var url = item_url + '?ACTION=' + block + '&' + query_string;
         if(block == "selected")
            url += '&TO_ID_STR=' + encodeURIComponent(to_id_field.value);
         if(jQuery(this).attr('notlogin_flag')=='1')
         {
             url += '&NOTLOGIN_FLAG=1';
         }
         
         get_items(url, block, '0');
      }
   });
   
   //搜索框的输入事件
   jQuery('#keyword').keyup(function(event){
      if(this.value == "")
      {
         return false;
      }
      
      jQuery('#search_clear').show();
      if(jQuery('#query_item:visible').length <= 0)
         jQuery('#navMenu > a[block="query"]').triggerHandler('click');
      var url = item_url + '?ACTION=query&' + query_string + '&KEYWORD=' + this.value.replace(/'/g,"");
      if(jQuery(this).attr('notlogin_flag')=='1')
      {
         url += '&NOTLOGIN_FLAG=1';
      }
      get_items(url, 'query', '0');
   });
   
    jQuery("#keyword").focus(function()
    {
        jQuery("#keyword").keyup();
    });
   
   //清除按钮的点击事件
   jQuery('#search_clear').click(function(event){
      jQuery('#keyword').val('');
      jQuery(this).hide();
      jQuery("#navMenu > a[block='priv']").trigger("click");
      jQuery('#keyword').focus();
   });
   
   //左侧角色、分组等点击、鼠标hover事件
   jQuery('div.left .block-left-item').live('click', function(){
      jQuery(this).siblings().removeClass('active');
      if(jQuery(this).attr('className').indexOf('active') < 0)
      {
         jQuery(this).addClass('active');
         get_items(item_url + '?' + jQuery(this).attr('query_string') + '&' + query_string, jQuery(this).attr('block'), jQuery(this).attr('item_id'));
      }
   });
   jQuery('div.left .block-left-item').live('mouseenter', function(){
      jQuery(this).addClass('hover');
   });
   jQuery('div.left .block-left-item').live('mouseleave', function(){
      jQuery(this).removeClass('hover');
   });
   
   //右侧用户列表点击、鼠标hover事件
   jQuery('div.right .block-right-item').live('click', function(){
      if(single_select)
         jQuery(this).siblings().removeClass('active');
      
      jQuery(this).toggleClass('active');
      if(jQuery(this).attr('className').indexOf('active') < 0)
         remove_item(this.getAttribute("item_id"), this.getAttribute("item_name"));
      else
         add_item(this.getAttribute("item_id"), this.getAttribute("item_name"));
   });
   jQuery('div.right .block-right-item').live('mouseenter', function(){
      jQuery(this).addClass('hover');
   });
   jQuery('div.right .block-right-item').live('mouseleave', function(){
      jQuery(this).removeClass('hover');
   });
   
   //右侧全部添加点击、鼠标hover事件
   jQuery('div.right .block-right-add').live('click', function(){
      jQuery(this).siblings('.block-right-item').each(function(){
         add_item(this.getAttribute("item_id"), this.getAttribute("item_name"));
         jQuery(this).addClass('active');
      });
   });
   jQuery('div.right .block-right-add').live('mouseenter', function(){
      jQuery(this).addClass('add-hover');
   });
   jQuery('div.right .block-right-add').live('mouseleave', function(){
      jQuery(this).removeClass('add-hover');
   });
   
   //右侧全部删除点击、鼠标hover事件
   jQuery('div.right .block-right-remove').live('click', function(){
      jQuery(this).siblings('.block-right-item').each(function(){
         remove_item(this.getAttribute("item_id"), this.getAttribute("item_name"));
         jQuery(this).removeClass('active');
      });
      trigger_callback('clear');
   });
   jQuery('div.right .block-right-remove').live('mouseenter', function(){
      jQuery(this).addClass('remove-hover');
   });
   jQuery('div.right .block-right-remove').live('mouseleave', function(){
      jQuery(this).removeClass('remove-hover');
   });
   
   //右侧全体部门点击、鼠标hover事件
   jQuery('div.right .block-right-alldept').live('click', function(){
      clear_item();
      add_item(this.getAttribute("item_id"), this.getAttribute("item_name"));
      close_window();
   });
   jQuery('div.right .block-right-alldept').live('mouseenter', function(){
      jQuery(this).addClass('alldept-hover');
   });
   jQuery('div.right .block-right-alldept').live('mouseleave', function(){
      jQuery(this).removeClass('alldept-hover');
   });
   
   //右侧返回点击、鼠标hover事件
   jQuery('div.right .block-right-goback').live('click', function(){
      var block = jQuery(this).attr('block');
      var item_id = jQuery(this).attr('item_id');
      jQuery('#' + block + '_item').children().hide();
      jQuery('#' + block + '_item_' + item_id).show();
   });
   jQuery('div.right .block-right-goback').live('mouseenter', function(){
      jQuery(this).addClass('goback-hover');
   });
   jQuery('div.right .block-right-goback').live('mouseleave', function(){
      jQuery(this).removeClass('goback-hover');
   });
   
   jQuery('input.BigButtonA').hover(
      function(){this.className = 'BigButtonAHover';},
      function(){this.className = 'BigButtonA';}
   );
}

function clear_query()
{
    if("" == jQuery("#keyword").val())
    {
        jQuery('#search_clear').hide();
        jQuery("#navMenu > a[block='priv']").trigger("click");
    }
}

function load_init_group()
{         
    if(to_id_field.value){
          //jQuery('.main-block').hide();
          var block = "selected";
          //jQuery('#block_' + block).show();
          //init_item(block);
    
          if(block == "selected" || jQuery('#' + block + '_item').text() == "")
          {
             var url = item_url + '?'+ query_string;
             if(to_id_field.value){
                url += '&TO_ID_STR=' + encodeURIComponent(to_id_field.value)+'&ACTION=selected' ;
                }
             if(jQuery(this).attr('notlogin_flag')=='1')
             {
                 url += '&NOTLOGIN_FLAG=1';
             }
             get_items_group(url, block, '0');
          }
    }
   
   //搜索框的输入事件
   jQuery('#keyword').keyup(function(event){
      if(this.value == "")
      {
         return false;
      }
      
      jQuery('#search_clear').show();
      if(jQuery('#query_item:visible').length <= 0)
         jQuery('#navMenu > a[block="query"]').triggerHandler('click');
      var url = item_url + '?ACTION=query&' + query_string + '&KEYWORD=' + this.value.replace(/'/g,"");
      if(jQuery(this).attr('notlogin_flag')=='1')
      {
         url += '&NOTLOGIN_FLAG=1';
      }
      get_items(url, 'query', '0');
   });
   
    jQuery("#keyword").focus(function()
    {
        jQuery("#keyword").keyup();
    });
   
   //清除按钮的点击事件
   jQuery('#search_clear').click(function(event){
      jQuery('#keyword').val('');
      jQuery(this).hide();
      jQuery("#navMenu > a[block='priv']").trigger("click");
      jQuery('#keyword').focus();
   });
   
   //左侧角色、分组等点击、鼠标hover事件
   jQuery('div.left .block-left-item').live('click', function(){
      jQuery(this).siblings().removeClass('active');
      if(jQuery(this).attr('className').indexOf('active') < 0)
      {
         jQuery(this).addClass('active');
         get_items(item_url + '?' + jQuery(this).attr('query_string') + '&' + query_string, jQuery(this).attr('block'), jQuery(this).attr('item_id'));
      }
   });
   jQuery('div.left .block-left-item').live('mouseenter', function(){
      jQuery(this).addClass('hover');
   });
   jQuery('div.left .block-left-item').live('mouseleave', function(){
      jQuery(this).removeClass('hover');
   });
   
   //右侧用户列表点击、鼠标hover事件
   jQuery('div.right .block-right-item').live('click', function(){
      if(single_select)
         jQuery(this).siblings().removeClass('active');
      
      jQuery(this).toggleClass('active');
      if(jQuery(this).attr('className').indexOf('active') < 0)
         remove_item(this.getAttribute("item_id"), this.getAttribute("item_name"));
      else
         add_item(this.getAttribute("item_id"), this.getAttribute("item_name"));
   });
   jQuery('div.right .block-right-item').live('mouseenter', function(){
      jQuery(this).addClass('hover');
   });
   jQuery('div.right .block-right-item').live('mouseleave', function(){
      jQuery(this).removeClass('hover');
   });
   
   //右侧全部添加点击、鼠标hover事件
   jQuery('div.right .block-right-add').live('click', function(){
      jQuery(this).siblings('.block-right-item').each(function(){
         add_item(this.getAttribute("item_id"), this.getAttribute("item_name"));
         jQuery(this).addClass('active');
      });
   });
   jQuery('div.right .block-right-add').live('mouseenter', function(){
      jQuery(this).addClass('add-hover');
   });
   jQuery('div.right .block-right-add').live('mouseleave', function(){
      jQuery(this).removeClass('add-hover');
   });
   
   //右侧全部删除点击、鼠标hover事件
   jQuery('div.right .block-right-remove').live('click', function(){
      jQuery(this).siblings('.block-right-item').each(function(){
         remove_item(this.getAttribute("item_id"), this.getAttribute("item_name"));
         jQuery(this).removeClass('active');
      });
      trigger_callback('clear');
   });
   jQuery('div.right .block-right-remove').live('mouseenter', function(){
      jQuery(this).addClass('remove-hover');
   });
   jQuery('div.right .block-right-remove').live('mouseleave', function(){
      jQuery(this).removeClass('remove-hover');
   });
   
   //右侧全体部门点击、鼠标hover事件
   jQuery('div.right .block-right-alldept').live('click', function(){
      clear_item();
      add_item(this.getAttribute("item_id"), this.getAttribute("item_name"));
      close_window();
   });
   jQuery('div.right .block-right-alldept').live('mouseenter', function(){
      jQuery(this).addClass('alldept-hover');
   });
   jQuery('div.right .block-right-alldept').live('mouseleave', function(){
      jQuery(this).removeClass('alldept-hover');
   });
   
   //右侧返回点击、鼠标hover事件
   jQuery('div.right .block-right-goback').live('click', function(){
      var block = jQuery(this).attr('block');
      var item_id = jQuery(this).attr('item_id');
      jQuery('#' + block + '_item').children().hide();
      jQuery('#' + block + '_item_' + item_id).show();
   });
   jQuery('div.right .block-right-goback').live('mouseenter', function(){
      jQuery(this).addClass('goback-hover');
   });
   jQuery('div.right .block-right-goback').live('mouseleave', function(){
      jQuery(this).removeClass('goback-hover');
   });
   
   jQuery('input.BigButtonA').hover(
      function(){this.className = 'BigButtonAHover';},
      function(){this.className = 'BigButtonA';}
   );
}
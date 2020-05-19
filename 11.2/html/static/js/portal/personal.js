var APP_ITEM_HEIGHT = 38;
var MIN_PNAEL_HEIGHT = 8 * APP_ITEM_HEIGHT;
var SCROLL_HEIGHT = 4 * APP_ITEM_HEIGHT;
var SCREEN_MAX_APP_NUM = 32;

//-- 模块对应ID固定 --
var moduleInfo = {"email":1,"notify":4,"news":147,"vote":148,"workflow":5,"calendar":8,"diary":9||81,"attendance":7,"bbs":62,"file_folder":15,"reportshop":550,"approve_center":301};
var moduleInfoIndex = {"a1":"email","a4":"notify","a147":"news","a148":"vote","a5":"workflow","a8":"calendar","a9":"diary","a81":"diary","a7":"attendance","a62":"bbs","a15":"file_folder","a550":"reportshop","a301":"approve_center"};

//-- 可用菜单图标 --
var availappicon = [];
//由于19版想改版为三级菜单对应图标，但图标又不全，只能临时处理
if(ostheme == '19'){
	availappicon = ['address','asset','approve_center','attendance','bbs','bbs2','bi_design','book','calendar','calendarArrange','comm','crm','default','diary','document','email','erp','exam_manage','fax','file_folder','hr','index','info','itask','jin_xiao_cun','kanban','knowledge_management','management_center','meeting','mobile_sms','mytable','netdisk','news','notify','office_product','person_info','picture','project','reportshop','roll_manage','safe_doc','score','sms','sns','source','system','todo','training','vehicle','vote','wiki','work_plan','workflow','report','zhidao','invoice'];
}else{
	availappicon = ['address','asset','attendance','bbs','book','calendar','comm','crm','default','diary','document','email','erp','exam_manage','fax','file_folder','hr','info','itask','meeting','mytable','netdisk','news','notify','person_info','picture','project','reportshop','roll_manage','score','sms','system','todo','training','vehicle','vote','wiki','work_plan','workflow','report','invoice'];
}

var default_icon = 'default';
var s_default_icon = 'oa';
var rowAppNum = 8;
//字体图标对象
if(ostheme=="19"){
	var module2iconfont  = {
        // "01": "&#xe653;",
		// "02": "",
		// "05": "&#xe6cc;",
		// "10": "&#xe65a;",
		// "13": "&#xe648;",
		// "20": "&#xe655;",
		// "30": "&#xe612;",
		// "40": "&#xe611;",
		// "45": "&#xe645;",
		// "48": "&#xe649;",
		// "50": "&#xe64e;",
		// "65": "&#xe64c;",
		// "70": "&#xe64a;",
		// "85": "&#xe648;",
		// "90": "&#xe651;",
		// "95": "&#xe6cd;",
		// a0: "&#xe649;",
		b0: "&#xe73a;",
		// d0: "&#xe652;",
		// dd: "&#xe646;",
		// e0: "&#xe613;",
		y0: "&#xe6f7;",
		z0: "&#xe732;",
		shortcut: "&#xe737;",
		m0: "&#xe736;",
		"0001": "&#xe72c;",
		"0002": "",
		"0005": "&#xe72f;",
		"0010": "&#xe705;",
		// "0013": "&#xe648;",
		"0020": "&#xe72d;",
		"0030": "&#xe735;",
		"0040": "&#xe73b;",
		"0045": "&#xe72e;",
		"0048": "&#xe733;",
		"0049": "&#xe6f6;",
		"0050": "&#xe730;",
		"0065": "&#xe71c;",
		"0070": "&#xe6fd;",
		// "0085": "&#xe648;",
		"0090": "&#xe731;",
		"0095": "&#xe739;",
		// "00a0": "&#xe649;",
		"00b0": "&#xe73a;",
		// "00d0": "&#xe652;",
		// "00dd": "&#xe646;",
		// "00e0": "&#xe613;",
		"00y0": "&#xe6f7;",
		"00z0": "&#xe732;",
		"00m0": "&#xe736;",
		"default": "&#xe78f;"
	};
}else{
	var module2iconfont  = {
		"01": "&#xe653;",
		"02": "",
		"10": "&#xe65a;",
		"13": "&#xe648;",
		"20": "&#xe655;",
		"30": "&#xe612;",
		"40": "&#xe611;",
		"45": "&#xe645;",
		"50": "&#xe64e;",
		"65": "&#xe64c;",
		"70": "&#xe64a;",
		"85": "&#xe648;",
		"90": "&#xe651;",
		"a0": "&#xe649;",
		"b0": "&#xe647;",
		"d0": "&#xe652;",
		"dd": "&#xe646;",
		"e0": "&#xe613;",
		"y0": "&#xe64b;",
		"z0": "&#xe650;",
		"0001": "&#xe653;",
		"0002": "",
		"0010": "&#xe65a;",
		"0013": "&#xe648;",
		"0020": "&#xe655;",
		"0030": "&#xe612;",
		"0040": "&#xe611;",
		"0045": "&#xe645;",
		"0050": "&#xe64e;",
		"0065": "&#xe64c;",
		"0070": "&#xe64a;",
		"0085": "&#xe648;",
		"0090": "&#xe651;",
		"00a0": "&#xe649;",
		"00b0": "&#xe647;",
		"00d0": "&#xe652;",
		"00dd": "&#xe646;",
		"00e0": "&#xe613;",
		"00y0": "&#xe64b;",
		"00z0": "&#xe650;",
		"default": "&#xe67a;"
	};
}
window.onactive = function(){
   jQuery(window).triggerHandler('resize');
   window.onactive = null;
};

//lp 设置界面Html 结构
var appboxHtml = '';
appboxHtml =    '<div id="portalSetting">';
appboxHtml +=       '<div id="bar" class="ui-layout-north">'; 
appboxHtml +=         '<span id="btnAppSet"></span>';
appboxHtml +=         '<span id="btnScreenSet"></span>';
appboxHtml +=         '<span id="portalSettingMsg"></span>';        
appboxHtml +=      '</div>';
appboxHtml +=      '<div id="appPageAll" class="ui-layout-center">';
appboxHtml +=         '<div id="appPageDom" class="appPage">';
appboxHtml +=            '<div id="app_cate_list" class="ui-layout-west">';
appboxHtml +=               '<div class="scroll-up"></div>';
appboxHtml +=               '<ul>';
appboxHtml +=                 '<div class="clearfix"></div>'; 
appboxHtml +=               '</ul>';
appboxHtml +=               '<div class="scroll-down"></div>';    
appboxHtml +=            '</div>';
appboxHtml +=            '<div id="app_list_box" class="ui-layout-center">';
appboxHtml +=               '<div id="app_list_record"></div>';
appboxHtml +=               '<ul></ul>';
appboxHtml +=               '<div class="clearfix"></div>';   
appboxHtml +=            '</div>';
appboxHtml +=         '</div>';
appboxHtml +=         '<div id="screenPageDom">';
appboxHtml +=            '<div id="screen_list">';
appboxHtml +=               '<div class="clearfix"></div>';   
appboxHtml +=               '<ul></ul>';
appboxHtml +=            '</div>';
appboxHtml +=         '</div>';
appboxHtml +=      '</div>';
appboxHtml +=   '</div>';

//过滤重复js元素 return array;
function unique(d){
   var o = {};
   jQuery.each(d, function(i, e) { 
      o[e] = i; 
   }); 
   var a = []; 
   jQuery.each(o, function(i, e) { 
      a.push(d[e]); 
   });
   return a;
}
//过滤重复js元素 返回 boolean
Array.prototype.S=String.fromCharCode(2);
Array.prototype.in_array=function(e)
{
    var r=new RegExp(this.S+e+this.S);
    return (r.test(this.S+this.join(this.S)+this.S));
}

function isTouchDevice(){
    try{
        document.createEvent("TouchEvent");
        return true;
    }catch(e){
        return false;
    }
}

//添加桌面应用 e {"func_id": ,"id": ,"name":} index 为要添加应用的屏幕索引
function addApp(e, index) { 
    var newli = jQuery('#block_'+e.func_id).length;
    if(newli<=0){
        var s = slideBox.getScreen(index); 
       if (s) { 
          var ul = s.find("ul"); 

          if (!ul.length) { 
             ul = jQuery("<ul></ul>");
             s.append(ul); 
              ul.sortable({
                revert: true,
                //delay: 200,
                //distance: 10,               //延迟拖拽事件(鼠标移动十像素),便于操作性
                tolerance: 'pointer',       //通过鼠标的位置计算拖动的位置*重要属性*
                connectWith: ".screen ul",
                scroll: false,
                stop: function(e, ui) {
                  setTimeout(function() {
                        jQuery(".block.remove").remove();
                        jQuery("#trash").hide();
                        ui.item.click(openUrl);
                        serializeSlide();
                  }, 0);
                },
                start: function(e, ui) {
                   jQuery("#trash").show();
                   ui.item.unbind("click");
                }
             });
          }
          addModule(e, s.find("ul")); 
       } 
    }else{
        return;
    }
   
}


function getAppMargin(){
      var clientSize = jQuery(document.body).outerWidth(true);
      var appsize = 120 * rowAppNum;
      if(clientSize > appsize){
         var _margin = Math.floor((clientSize - appsize - 70*2)/16);     
      }else{
         var _margin = 0;    
      }
      return _margin; 
}
   
function refixAppPos(){
      var _margin = getAppMargin() + "px";
      jQuery("#container .screen li.block").css({"margin-left": _margin, "margin-right":_margin})   
}
   
function addModule(e, el, bImgDelay) {
   el = jQuery(el);
   bImgDelay = typeof(bImgDelay) != "undefined" ? bImgDelay : false;
   var _id = e.id;
   img_src = fixAppImage(_id);
   var li = jQuery("<li class=\"block\"></li>");
   var img = jQuery("<div class='img'><p><img " + (bImgDelay ? ('src="'+static_server+'/static/images/transparent.gif" _src="' + img_src + '"') : ('src="' + img_src + '"')) + "/></p></div>");
   if(_id.indexOf(".")!="-1")
   {
      img.find("img").error(function(){
         jQuery(this).attr("src",static_server+"/static/images/app_icons/default.png");
      });
   }
   var divT = jQuery("<div class=\"count\"></div>");
   li.attr("id", "block_" + e.func_id);
   li.attr("title", e.name);
   li.attr("index", e.func_id);
   li.attr("data-url", func_array['f'+e.func_id][1]);
   li.attr("data-title", func_array['f'+e.func_id][2]);
   var _margin = getAppMargin() + "px";
   li.css({"margin-left": _margin, "margin-right":_margin});
   divT.attr("id", "count_" + e.func_id);
   if(e.count > 0){
      divT.addClass("count" + e.count);   
   }
   var a = jQuery("<a class=\"icon-text\" href=\"javascript: void(0)\"></a>"); 
   var span = jQuery("<span></span>").text(e.name); 
   li.append(img.append(divT)).append(a.append(span)); 
   el.append(li);
}

function delModule(el){
   var pObj = jQuery("#container .screen ul li.block");
   pObj.each(function(){
      var index = jQuery(this).attr("index");
      if(el == index){
         jQuery(this).remove();
         var flag = serializeSlide();
      }
   });
}

//lp 检查应用图片是否存在
function fixAppImage(e){
   var els = availappicon;   
   if(e == ""){
      return static_server+"/static/images/app_icons/" + default_icon + '.png';       
   }else if(jQuery.inArray(e,els) == -1 && e.indexOf(".") == "-1"){
      return static_server+"/static/theme/"+ostheme+"/images/app_icons/" + default_icon + ".png";
   }else if(e.indexOf(".")!="-1"){
      return static_server+"/static/images/app_icons/" + e;   
   }else{
      return static_server+"/static/theme/"+ostheme+"/images/app_icons/" + e + ".png";   
   }            
}

//lp 获取当前屏幕应用的个数
function getAppNums(index){
   var index = (index == "" || typeof(index) == "undefined") ? slideBox.getCursor() : index;  
   var num =  jQuery("#container .screen:eq("+index+") ul li.block").size();
   return num;          
}

function initMenus()
{	
	var modules = [];
	var screen_count = 0;
	var screen_array = funcIdStr.split("|");
	for(var i=0; i<screen_array.length; i++)
	{
	   var idStr = screen_array[i];
	   if(idStr == "")
	      continue;
	   
	   var items = [];
	   var item_count = 0;
	   var item_array = idStr.split(",");
	   for(var j=0; j<item_array.length; j++)
   	{
   	   var func_id = item_array[j];
   	   if(func_id == "" || !funcarray["f" + func_id])
   	      continue;
   	   
   	   items[item_count++] = {id:funcarray["f" + func_id][2], name:funcarray["f" + func_id][0], func_id:func_id, count:0};
   	   if(funcarray["f" + func_id][2])
   	      moduleIdStr += funcarray["f" + func_id][2] + ",";
   	}
   	modules[screen_count++] = {title:"", id:"1", items:items};
	}
	
	return modules;
}

function initModules(modules, el) {
   
   window.slideBox = jQuery("#container").slideBox({
      count: modules.length,
      cancel: isTouchDevice() ? "" : ".block", 
      obstacle: "200",
      speed: "slow",
      touchDevice: isTouchDevice(),
      control: "#control .control-c",
      listeners: {
         afterScroll: function(i) {
          },
          beforeScroll: function(i) {
             //图片延迟加载
             jQuery("img[_src]", slideBox.getScreen(i)).each(function(){
                this.src = this.getAttribute("_src");
                this.removeAttribute("_src");
             });
          }
       }
   });
   el = jQuery(el);
   var count = 0;
   jQuery.each(modules || [] , function(i, e) {
      var ul = jQuery("<ul></ul>");
      slideBox.getScreen(i).append(ul)
      jQuery.each(e.items || [], function(j, e) {
         addModule(e, ul, (i!=0));
      });
      i++;
   });
}

jQuery.noConflict();
(function($){
   function resizeContainer()
   {
      var wWidth = Math.floor(parseInt((window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth))*0.9));
      var blockWidth = $('#container > .block:first').outerWidth();
      if(blockWidth <= 0)
         return;
      
      var count = Math.min(4, Math.max(3, Math.floor(wWidth/blockWidth)));
      $('#container').width(blockWidth*count);
   }
    //点击模块打开列表框     
   function openUrl(){
    var dataurl = $(this).attr("data-url");
    var datatitle = $(this).attr("data-title");
    var id = this.id.substr(6);
    //默认打开给默认窗口进入模块提供id,name,路径和模块id
    $("#appid").val(id);
    $("#appname").val($(this).attr('title'));
    $("#appurl").val(dataurl);
    $("#apptitle").val(datatitle);
    if($('#count_'+id).attr('class').indexOf(' ') > 0)
    {
        var func_id = 'f' + $(this).attr('index');
        if($('#dialog_'+id).length <= 0)
        CreateDialogPanel(id, $(this).attr('title')); //创建新的对话框面板 
        $('#dialog_title_'+id).addClass('active');
        $('#dialogPanel .content').html('<div class="loading">'+td_lang.inc.msg_30+'</div>');//正在加载，请稍候……
        $('#overlay').show();
        $('#dialogPanel').show(); 
        $('#dialogPanel').trigger('_show');
        LoadContent(id);                              //加载对话框内容
        dialogNavOpration();                          //对话框导航操作                  
    }
    else
    {
      var func_id = 'f' + $(this).attr('index');
      if(typeof(funcarray) != 'object' || typeof(funcarray[func_id]) != 'object')
      {
         if($(this).attr('url'))
         {
            if(top.bTabStyle)
               top.openURL('w' + (top.nextTabId++), $(this).attr('title'), $(this).attr('url'));

            else
               openURL(0, '', $(this).attr('url'));
         }
      }
      else
      {
         if(top.bTabStyle)
            top.createTab(func_id.substr(1), funcarray[func_id][0], funcarray[func_id][1], funcarray[func_id][2]);
         else
            openURL(func_id.substr(1), funcarray[func_id][0], funcarray[func_id][1]);
      }
    }
  }
   
   function initBlock()
   {
      $('#container .screen ul li.block').live("click",openUrl);
   }
   
   function initDialog()
   {
      $('div.dialogContainer,div.dialogPanel', document.body).live('_show', function(e, cfg){
         var animate = cfg && cfg.animate || false;
         var wWidth = (window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth));
         var hHeight = (window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight));
         $(this).css('transition', animate ? 'width 0.4s ease-in-out' : 'none');  
		 var left = 0;
         var top = 0;
         var maxWidth = wWidth-300;
         var maxHeight = hHeight - 100;
         var minHeight = 400;

         if($(this).outerHeight() < minHeight)
         {
            $("div.msg-content,div.content", this).height(minHeight);
         }
         else if(hHeight - $(this).outerHeight() >200 )
         {
            top = Math.floor((hHeight - $(this).outerHeight())/2);
			left = Math.floor((wWidth - $(this).outerWidth())/2);
		 }
         else
         {
            $("div.msg-content,div.content", this).height(maxHeight-88);
         }
		 
         if(wWidth - $(this).outerWidth() > 0 )
         {
            left = Math.floor((wWidth - $(this).outerWidth())/2);
         }
         else
         {
            $("div.msg-content,div.content", this).width(maxWidth);
			left = Math.floor((wWidth - $(this).outerWidth())/2);			
         }
         // var top = 0;
         var bst = document.body.scrollTop || document.documentElement.scrollTop;
         top = Math.round((hHeight - $(this).height())/2 + bst) + "px";
		 // $("div.msg-content,div.content", this).width(maxWidth-18);
         $(this).css({left:left});
         $(this).css({top:top});
		 
         $('#overlay').height(hHeight);

      });
   
      $('div.dialogContainer,div.dialogPanel', document.body).live('_hide', function(){
         var index = $(this).attr('index');
         if(index !="appbox"){
            index = moduleInfoIndex["a"+index];
            GetCounts(index);
         }
      });
      
      $('#panel_close').live('click', function(){
         $('#overlay').hide();
         $('#dialogPanel').remove();
		 GetCounts(moduleIdStr);
      });
      //对话框关闭按钮
      var dialogClose = $('a.close', $('div.dialogContainer'));
      dialogClose.live('click', function(){
         var dialog = $('div.dialogContainer:visible', document.body).first();
         dialog.trigger('_hide');
         refixminScreenbtn();
         $('#overlay').hide();
         $("body").focus();
         dialog.hide();
      });
   }
   
   function GetCounts(moduleIdStr)
   {
      $.ajax({
         type: 'GET',
         url: 'count.php',
         data: {'OUTPUT':'1', 'MODULE_ID_STR': moduleIdStr},
         success: function(data){
            var array = Text2Object(data);
            if(typeof(array) == "object")
            {
               var counts = 0;
               window.countsStorage = array;
               for(var id in array)
               {
                  window.count_num = Math.min(10, array[id]);               
                  var className = count_num > 0 ? ('count count' + count_num) : 'count';
                  if(moduleInfo[id])
                  {
                     $('#count_' + moduleInfo[id]).attr('class', className);   
                  }
                  counts += count_num;
               } 
               UpdateDialog();             
               if(counts > 0 && parent && typeof(parent.BlinkTabs) == 'function')
                  parent.BlinkTabs('p0');
            }
            
            window.setTimeout(GetCounts, monInterval*60*1000, moduleIdStr);
         },
         error: function(request, textStatus, errorThrown){
            window.setTimeout(GetCounts, monInterval*60*1000, moduleIdStr);
         }
      });
   }
   
   function LoadContent(id)
   {
      if(moduleInfoIndex["a"+id]){
         enid = moduleInfoIndex["a"+id];
      }
      $.ajax({
         type: 'GET',
         url: enid + '.php',
         success: function(data){
			$('#dialogPanel .content').html(data);
			$('#dialogPanel').trigger('_show', { animate: true });
         },
         error: function(request, textStatus, errorThrown){
            $('#dialogPanel .content').html(td_lang.inc.msg_73 + request.status);//'获取内容错误：'
         }
      });
   }
         
   function CreateDialog(id, title, parent, func_id)
   {
      var html = '<div id="dialog_' + id + '" index="' + id + '" class="dialogContainer">';
      html += '<table class="dialog" align="center">';
      html += '   <tr class="head">';
      html += '      <td class="left"></td>';
      html += '      <td class="center">';
      html += '         <div class="title">' + title + '</div>';
      html += '         <a class="close" href="javascript:;"></a>';
      if(func_id){
          html += '         <a class="enter-icon" href="javascript:;" onclick="top.createTab('+ func_id.substr(1) +',\''+ funcarray[func_id][0] +'\',\''+ funcarray[func_id][1] +'\',\''+ funcarray[func_id][2] +'\');">'+ entertip +'</a>';
      }
      html += '      </td>';
      html += '      <td class="right"></td>';
      html += '   </tr>';
      html += '   <tr class="body">';
      html += '      <td class="left"></td>';
      html += '      <td class="center">';
      html += '         <div id="dialog_content_' + id + '" class="msg-content" style="overflow-x:auto;"></div>';
      html += '      </td>';
      html += '      <td class="right"></td>';
      html += '   </tr>';
      html += '   <tr class="foot">';
      html += '      <td class="left"></td>';
      html += '      <td class="center"></td>';
      html += '      <td class="right"></td>';
      html += '   </tr>';
      html += '</table>';
      html += '</div>';
      $(parent).append(html);
      $("#dialog_"+id).draggable({handle: 'tr.head',containment: 'window' , scroll: false});
   }
   //新建对话框面板 sxm
   function CreateDialogPanel(id, title){
      var html ='<div class="dialogPanel" id="dialogPanel">';
      html += '   <div class="dialogNav">';
      html += '      <ul id="dialog_nav_ul">';
      html += '      </ul>';
      html += '   </div>';
      html += '   <div class="dialogContent"  >';
      html += '      <div class="head" >';
      html += '         <a class="title" href="javascript:;">' + title + '</a>';
      //html += '         <a  href="javascript:;" class="openTitle" title="在新窗口打开"></ a>';
      html += ' <a class="iconfont openTitle pull-right" title="在新窗口打开" href="javascript:;">&#xe678;</a>';
      /*
      if(dataurl && datatitle){
          html += ' <a class="iconfont openTitle pull-right" title="在新窗口打开" href="javascript:;" onclick="top.createTab('+ id +',\''+ title +'\',\''+ dataurl +'\',\''+ datatitle +'\');">&#xe678;</a>';
      }
      */
      html += '         <a class="close" id="panel_close" href="javascript:;" title="关闭">&#xe620;</a>';
      html += '      </div>';
      html += '      <div class="content" id="panel_content" >';
      html += '      </div>';
      html += '   </div>';
      html += '</div>';
      if($('#dialogPanel').size()){
         return;
      }
      $('body').append(html);
      $("#dialogPanel").draggable({handle: '.head',containment: 'window' , scroll: false});
      UpdateDialog();
   }
   // 对话框内容刷新 sxm
   function UpdateDialog(){
      if( $('#dialogPanel').length > 0 ){
         for( var id in countsStorage )
         {
            // var count = Math.min(10, countsStorage[id]);
			var count = countsStorage[id];
            if( count <= 0 ){ 
               if( $('#dialog_title_'+moduleInfo[id]).hasClass('active') > 0 ){
                  $('#nav_count_'+ moduleInfo[id]).text(count);
                  $('#panel_content').empty();
                  $('#nav_count_'+ moduleInfo[id]).css('background-color','#9d9d9d');
                  $('#panel_content').append('<div class="dialogNoContent">无内容</div>');
               }
               else{
                  $('#dialog_title_'+moduleInfo[id]).remove();
               }
            }
            else{
               if($('#dialog_title_'+moduleInfo[id]).length <=0){
                   $('#dialog_nav_ul').append('<li class="dialog-nav-title" data-title="'+ func_array["f"+ moduleInfo[id]][2] +'" data-url="'+ func_array["f"+ moduleInfo[id]][1] +'" id="dialog_title_' + moduleInfo[id] + '" ><span>' + func_array["f"+ moduleInfo[id]][0]+ '</span><span class="dialog-nav-num " id="nav_count_' + moduleInfo[id] + '">' + count + '</span></li>');
               }
               else{ 
                  if( $('#dialog_title_'+moduleInfo[id]).hasClass('active') > 0 ){  
                     $('#nav_count_'+ moduleInfo[id]).text(count);                  
                     LoadContent(moduleInfo[id]);
                  }
                  else{
                     $('#nav_count_'+ moduleInfo[id]).text(count);
                  }  
               }
            }
         }
      }
      else{
         return;
      }
   }

   //对话框列表操作 sxm
   function dialogNavOpration(){
      $('#dialog_nav_ul').delegate( 'li','click',function(){
         
         $('.dialog-nav-num').each(function(){
            if($(this).text()==0){
               var numberId =$(this).attr('id').substr(10);
               $('#dialog_title_' + numberId).remove();
            }
         });

         var index = $(this).attr('id').substr(13);
         $('#dialog_nav_ul li').removeClass('active');
         var target = $('#dialog_title_'+index).addClass('active');
         var title = $($('#dialog_title_' + index + ' span')[0]).text();
         $('a.title').text(title); 
         
         //未获取模块入口增加隐藏域值 edit by tl
         var dataurl = $(this).attr("data-url");
         var datatitle = $(this).attr("data-title");
         $("#appid").val(index);
         $("#appname").val(title);
         $("#appurl").val(dataurl);
         $("#apptitle").val(datatitle);
         // LoadContent(index);
		 GetCounts(moduleIdStr);
      });
      $("#dialogPanel").delegate(".openTitle,.title","click",function(){
        //点击左侧栏切换隐藏域值，点击进入模块取隐藏域值
        var appid = $("#appid").val(),
            appname = $("#appname").val(),
            appurl = $("#appurl").val(),
            apptitle = $("#apptitle").val();
        top.createTab(appid, appname, appurl, apptitle);
      });
   }
   // 调整窗口时对话框自适应 sxm 2014-12-19
    $(window).resize((function(){
        var timer = null;
        var response = function(){
            $('#dialogPanel .content,#dialogPanels').trigger('_show'); 
            return;
        };
        return function(){
            timer && clearTimeout(timer);
            timer = setTimeout(response, 400);
        }
    })()).resize();
   //垃圾箱
   function initTrash() {
         $("#trash").droppable({
            over: function() {
               $("#trash").addClass("hover");
            },
            out: function() {
               $("#trash").removeClass("hover");
            },
            drop: function(event, ui) {
               ui.draggable.addClass("remove").hide();
               delModule && delModule(ui.draggable.attr("index"));
               $(".ui-sortable-placeholder").animate({
                  width: "0"
               }, "normal", function() {
               });
               $("#trash").removeClass("hover");
            }
         });   
   }
   
   //lp 扩展对话框
   $.extend({
      tExtDialog: function (options) {
         var defaults = {
            width: 600,
            height: 400,
            parent: $("body"),
            title: ''
         };
         
         var options = $.extend(true, defaults, options);
                 
         var width = options.width;
         var height = options.height;
         var id = options.id;
         var title = options.title;
         var parent = options.parent;
         var src = options.src;
         var icon = options.icon;
         var content = options.content;
        
         if(!$('#dialog_' + id).length)
         {         
            CreateDialog(id, title, parent);
            $('#dialog_' + id).draggable("destroy");
            $('#dialog_' + id).addClass('extDialog');
            $('#dialog_' + id + ' .dialog tr.head').css("cursor","");
            $('#dialog_' + id).css({"width" : width +"px","height" : height +"px"});
            $('#dialog_' + id + ' > .dialog').css({"width":"100%"});
            $("div.msg-content", $('#dialog_' + id)).css({"height":(height - 48) + "px"})
            if(icon){
               $('#dialog_' + id + ' .dialog .head .center .title').prepend("<img src = '"+icon+"' style='margin-right:5px' width='16' height='16' />");
            }
            if(src){
               $("#dialog_content_"+id).html("<iframe name='iframe' src='" + src +"' width='100%' height='100%' border='0' frameborder='0' marginwidth='0' marginheight='0'></iframe>");
            }else{
               $("#dialog_content_"+id).html(content);   
            }
         }
         
         function display()
         {
            var wWidth = (window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth));
            var hHeight = (window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight));
            
            var top = left = 0;
            var bst = document.body.scrollTop || document.documentElement.scrollTop;
            top = Math.round((hHeight - height)/2 + bst) + "px";
            mleft = "-" + Math.round(width/2) + "px";
            top = top < 0 ? top = 0 : top;

            $('#dialog_' + id).css({"top":top,"left":"50%","margin-left":mleft});
            $('#dialog_' + id).show();
            $('#overlay').height(window.document.documentElement.scrollHeight);
            $('#overlay').show();
         }
         return{
            display: display   
         }
      }
   });
   //lp 构造一级菜单html结构 return str;
   function returnFmenu()
   {
      var html = "";
	  var extWebApp_icon = ostheme==19?'&#xe791;':'&#xe67a;';
	  var extFav_icon = ostheme==19?'&#xe790;':'&#xe679;';
      for(var i=0; i< fmenu.length; i++)
      {
         var menu_id = fmenu[i];
         if(typeof(funcarray['m'+menu_id]) != "object")
         continue;
         var image = !funcarray['m'+menu_id][1] ? s_default_icon : funcarray['m'+menu_id][1];
         html += '<li><a id="m' + menu_id + '" href="javascript:;" hidefocus="hidefocus" title="'+funcarray['m'+menu_id][0]+'"><i class="'+image+' appbox_icons">'+ (module2iconfont[menu_id] || module2iconfont['default'])+'</i> ' + funcarray['m'+menu_id][0] + '</a></li>';
      }
      html += '<li style="display:none;"><a id="extWebApp" href="javascript:;" hidefocus="hidefocus" title='+td_lang.inc.msg_74+'><i class="appbox appbox_icons">'+extWebApp_icon+'</i> '+td_lang.inc.msg_74+'</a></li>';//"互联网应用"
      html += '<li><a id="extFav" href="javascript:;" hidefocus="hidefocus" title='+td_lang.inc.personfav+'><i class="fav appbox_icons">'+extFav_icon+'</i> '+td_lang.inc.personfav+'</a></li>';//"个人收藏"
      return html;
   }
        
   //生成一级对应的二级菜单和三级菜单 @fappid 一级菜单ID return array;
   function returnSTmenu(fappid){
      var myapp = getScreenAppIds();
      var arrMyapp = new Array()
      var arrfinalApp = new Array();
      var arrWebApp = new Array();
      arrMyapp = myapp.split(",");
      var arrSmenu = new Array();
      if(smenu[fappid]){
         var arrSmenu = $.grep(smenu[fappid], function(n,i){
            return ((!arrMyapp.in_array(n)) && !(tmenu["f"+n]));
         });
         $.merge(arrfinalApp, arrSmenu);
      }
      //互联网app
      if(funcarray[fappid]){
         var arrWebApp = $.grep(funcarray[fappid], function(n,i){
            return (!(arrMyapp.in_array(n)) && funcarray["f"+n]);
         });
         $.merge(arrfinalApp, arrWebApp);   
      }
      
      if(smenu[fappid] && smenu[fappid].length > 0){
         var smenulen = smenu[fappid].length;
      }
      
      if(smenulen > 0)
      {
         var _smenu = smenu[fappid];
         var arrTmenu = new Array();
         for(i=0;i<smenulen;i++){
            if(!tmenu["f"+_smenu[i]]) continue;
            var arrTmenuIterm = $.grep(tmenu["f"+_smenu[i]], function(n,k){
               return !arrMyapp.in_array(n);
            });
            $.merge(arrfinalApp, arrTmenuIterm);
         }
      }
      return unique(arrfinalApp);
   }

   //构造一级菜单下所有除桌面已有菜单的图标 return str;
   function appBuilding(appids){
      var html = menu_id = '';
      var _len = appids.length;
      for(var i=0; i< _len; i++)
      {
         menu_id = appids[i];
         if(menu_id.indexOf('ewp')!="-1"){
            var image = !(funcarray['f'+menu_id][0]) ? 'default.png' : funcarray['f'+menu_id][2];
            html += '<li><a id="' + menu_id + '" appid ="'+ menu_id +'" apptitle="'+ funcarray['f'+menu_id][0] +'" appEid="'+image+'" appurl ="'+funcarray['f'+menu_id][1]+'" href="javascript:;" hidefocus="hidefocus" title="'+ funcarray['f'+menu_id][0] +'"><img width="48" height="48" _src="'+static_server+'/static/images/app_icons/' + image + '" align="absMiddle" onerror="this.src=\''+static_server+'/static/images/app_icons/default.png\'"/><span class="lleft"><span class="lright">' + funcarray['f'+menu_id][0] + '</span></span></a></li>';
         }else{
            var image = (!(funcarray['f'+menu_id][1]) || ($.inArray(funcarray['f'+menu_id][2],availappicon) == -1)) ? 'default' : funcarray['f'+menu_id][2];
            html += '<li><a id="' + menu_id + '" appid ="'+ menu_id +'" apptitle="'+funcarray['f'+menu_id][0]+'" appEid="'+image+'" appurl ="'+funcarray['f'+menu_id][1]+'" href="javascript:;" hidefocus="hidefocus" title="'+ funcarray['f'+menu_id][0] +'"><img width="48" height="48" _src="'+static_server+'/static/theme/'+ ostheme +'/images/app_icons/' + image + '.png" align="absMiddle" /><span class="lleft"><span class="lright">' + funcarray['f'+menu_id][0] + '</span></span></a></li>';   
         }
      }
      return html;
   }
        
   //构造屏幕设置html结构 return str;
   function returnScreen(){
      var html = '';
      var _len = slideBox.getCount();
      for(var i=0; i< _len; i++)
      {
         html += '<li class="minscreenceil" index='+i+'>' + (i+1) +'</li>';
      }
      return html;
   }
   
   //选中桌面已有的app，@para srceenid 屏幕自然索引    
   function getScreenAppIds(srceenid){
      var idstr = sep = '';
      if(srceenid){
         obj = $("#container .screen").eq(srceenid).find("li.block")
      }else{
         obj = $("#container .screen li.block");
      }
      obj.each(function(){
         var appid = $(this).attr("index");
         idstr += sep + appid;
         sep = ',';
      });
      return idstr;
   }
        
   //显示消息 @para msg 要显示的提示文字
   function portalMessage(msg){
      if(!msg) return;
      msgObj = $("#portalSettingMsg");
      msgObj.html(msg).show();
      setTimeout(function(){msgObj.empty().hide()},5000);
   }
   
   //修正点击按钮出现屏幕小按钮width为0的现象
   function refixminScreenbtn(){
      $('#control').width(window.document.documentElement.clientWidth);   
   }
   
   //refixDialogPos
   function refixDialogPos(){
      var dialog = $('div.extDialog:visible', document.body).first();
      height = dialog.height();
      width = dialog.width();
      var wWidth = (window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth));
      var hHeight = (window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight));
      var top = left = 0;
      var bst = document.body.scrollTop || document.documentElement.scrollTop;
      top = Math.round((hHeight - height)/2 + bst) + "px";
      mleft = "-" + Math.round(width/2) + "px";
      top = top < 0 ? top = 0 : top;
      dialog.css({"top":top,"left":"50%","margin-left":mleft});
   }
   
   $(window).resize(function(){
      
      refixAppPos();
            
      $('#overlay').height(window.document.documentElement.scrollHeight);
      
      refixminScreenbtn();
      
      refixDialogPos();
      
   });
   
   //菜单滚动箭头事件,id为app_cate_list
   function initAppScroll(id)
   {
      //菜单向上滚动箭头事件
      $('#' + id + ' > .scroll-up:first').hover(
         function(){$(this).addClass('scroll-up-hover');},
         function(){$(this).removeClass('scroll-up-hover');}
      );

      //点击向上箭头
      $('#' + id + ' > .scroll-up:first').click(
         function(){
            var ul = $('#' + id + ' > ul:first');
            ul.animate({'scrollTop':(ul.scrollTop()-SCROLL_HEIGHT)}, 600);
         }
      );

      //向下滚动箭头事件
      $('#' + id + ' > .scroll-down:first').hover(
         function(){$(this).addClass('scroll-down-hover');},
         function(){$(this).removeClass('scroll-down-hover');}
      );

      //点击向下箭头
      $('#' + id + ' > .scroll-down:first').click(
         function(){
            var ul = $('#' + id + ' > ul:first');
            ul.animate({'scrollTop':(ul.scrollTop()+SCROLL_HEIGHT)}, 600);
         }
      );
   }
   
   function initAppListScroll(){
      var su = $("#app_cate_list .scroll-up:first");
      var sd = $("#app_cate_list .scroll-down:first");
      var scrollHeight = $("#app_cate_list ul").attr('scrollHeight');
      var orgheight = $("#app_cate_list ul").height();
      if(orgheight < scrollHeight)
      {
         var height = scrollHeight > MIN_PNAEL_HEIGHT ? MIN_PNAEL_HEIGHT : scrollHeight;
         $("#app_cate_list ul").height(height);
      }
      
      if(orgheight >= scrollHeight)
      {
         su.hide();
         sd.hide();
      }
      initAppScroll('app_cate_list'); 
   }
   
   function reSortMinScreen(){
      $("#screenPageDom #screen_list ul li.minscreenceil").each(function(i){
         $(this).text(i+1);
         $(this).attr("index",i);      
      });      
   }
   
   $(document).ready(function($){
      
      $("body").focus();
      
      $('#overlay').height(window.document.documentElement.scrollHeight);
      
      //初始化显示列数
      //resizeContainer();
      
      //初始化图标
      initModules(initMenus());
      
     //初始化图标间距
      refixAppPos();
      
      //模块点击事件
      initBlock();
      
      //对话框事件
      initDialog();
      
      GetCounts(moduleIdStr);
      
      initTrash();
      
      //初始化屏幕
      $(".screen ul").sortable({
            revert: true,
            //delay: 200,
            //distance: 10,               //延迟拖拽事件(鼠标移动十像素),便于操作性
            tolerance: 'pointer',       //通过鼠标的位置计算拖动的位置*重要属性*
            connectWith: ".screen ul",
            scroll: false,
            stop: function(e, ui) {
              setTimeout(function() {
                    $(".block.remove").remove();
                    $("#trash").hide();
                    ui.item.click(openUrl);
                     serializeSlide();
              }, 0);
            },
            start: function(e, ui) {
               $("#trash").show();
               refixminScreenbtn();
               ui.item.unbind("click");
            }
      });
         
      //lp 绑定“界面设置”事件   
      var d = '';
      $("#openAppBox").click(function(){
         
         refixminScreenbtn();
          
         if(!d){
            d = new $.tExtDialog({
               height: 420,
               width: 800,
               id: "appbox",
               title: td_lang.inc.msg_75,//"应用盒子"
               content: appboxHtml
            });
            d.display();
         }else{
            
            $('#overlay').css("display","block");
            
            d.display();
            
            $("#screenPageDom #screen_list ul li.minscreenceil").each(function(i){
               $(this).html(i+1);
            });
            
            //重新加载点击分类
            if($("#app_cate_list ul li a.current").length > 0){
               $("#app_cate_list ul li a.current").trigger("click");
            }
            
            //如果已经创建过那么就显示且退出
            return;   
         }
         
         //重新加载点击分类
         if($("#app_cate_list ul li a.current").length > 0){
            $("#app_cate_list ul li a.current").trigger("click");
         }
         
         //lp 绑定应用设置和屏幕设置的操作
         $("#btnAppSet").live("click",function(){
            var _display = $("#appPageDom").css("display");
            if(_display == "none"){
               $("#screenPageDom").hide();
               $("#appPageDom").show();
               
               //重新加载点击分类
               $("#app_cate_list ul li a").eq(0).trigger("click");
            }
         });
         
         $("#btnScreenSet").live("click",function(){
            var _display = $("#screenPageDom").css("display");
            if(_display == "none"){
               $("#appPageDom").hide();
               $("#screenPageDom").show();
            }
         });
         
         //根据权限生成一级菜单分类
         var Fmenu = returnFmenu();
         $("#app_cate_list ul").html(Fmenu);
         
         //根据个人屏幕设置生成
         var screenHtml = returnScreen();
         $("#screenPageDom #screen_list ul").html(screenHtml);
         $("#screenPageDom #screen_list ul").append("<li id='btnAddScreen' class='no-draggable-holder' title="+td_lang.inc.msg_76+"></li>");//'添加屏幕'
         
         //高亮显示当前屏幕 @todo
         var currentScreen = slideBox.getCursor();
         $("#screenPageDom #screen_list ul li.minscreenceil").eq(currentScreen).addClass("current");
         
         //移动屏幕
         $("#screenPageDom #screen_list ul").sortable({
               cursor: 'move', 
               tolerance: 'pointer',
               cancel: '#btnAddScreen',
               stop: function(){
                  var arrScreen = new Array();
                  $(this).find("li").each(function(){
                     arrScreen.push($(this).attr("index"));
                  });
                  slideBox.sortScreen(arrScreen);
                  $(this).find("li").each(function(i){
                     $(this).attr("index",i);
                  });
                  var flag = serializeSlide();
                  if(flag)   portalMessage(td_lang.inc.msg_77);      //"桌面顺序已设置成功！"
               }
         });
         
         //添加屏幕
         $("#btnAddScreen").live("click",function(){
            slideBox.addScreen();
            slideBox.scroll(slideBox.getCount() - 1);
            var screenlist = $("#screenPageDom #screen_list ul");
            var _max = 0;
            screenlist.find("li.minscreenceil").each(function(){
               _max = _max > parseInt($(this).attr("index")) ? _max : parseInt($(this).attr("index"));      
            });
            screenlist.find("#btnAddScreen").remove();
            screenlist.append("<li class='minscreenceil' index='"+ (_max+1) +"'>"+(_max+2)+"</li><li id='btnAddScreen' class='no-draggable-holder' title="+td_lang.inc.msg_76+"></li>");//'添加屏幕'
            var flag = serializeSlide();
            if(flag) portalMessage(td_lang.inc.msg_78);      //"屏幕添加成功！"
         });
         
         //鼠标滑过屏幕样式
         $("#screenPageDom #screen_list ul li.minscreenceil'").live('mouseenter', function(){
            $(this).css({"font-size":"60px"});
            if($('span.closebtn', this).length <= 0)
               $(this).append("<span class='closebtn' title="+td_lang.inc.msg_79+"></span>");//'移除此屏'
            $('span.closebtn', this).show();
         });
         
         $("#screenPageDom #screen_list ul li.minscreenceil").live('mouseleave', function(){
            $(this).css({"font-size":""});
            $('span.closebtn', this).hide();
         });
         
         //删除屏幕
         $("#screenPageDom #screen_list ul li.minscreenceil span").live("click",function(){
            if(confirm(td_lang.inc.msg_80)){//"删除桌面，将删除桌面全部应用模块，确定要删除吗？"
               var currentDom = $(this).parent("li");
               slideBox.removeScreen(currentDom.index("li.minscreenceil"));
               var flag = serializeSlide();
               if(flag)
               {
                  portalMessage(td_lang.inc.msg_81);//"桌面删除成功！"
                  currentDom.remove();
                  reSortMinScreen();
               }
            }   
         });
         
         //绑定一级菜单分类点击事件
         $("#app_cate_list ul li a").live("click",function(){
            $("#app_cate_list ul li a").removeClass("current");
            $(this).addClass("current");
            
            //显示一级对应的所有2级菜单
            var appId = $(this).attr("id");
            var appIds = returnSTmenu(appId);
            var apphtml = appBuilding(appIds);
            
            $("#app_list_box ul").html(apphtml);
            $("#app_list_box img[_src]").each(function(){
               $(this).attr('src', $(this).attr('_src'));
            });
         });
         
         //绑定右侧应用,点击事件

         $("#app_list_box ul li").live("click",function(){
            var obj = $(this).find("a");
            var appid = obj.attr("appid");
            var appEid = obj.attr("appEid");
            var apptitle = obj.attr("apptitle");
            var appurl = obj.attr("appurl");
            if(getAppNums() >= SCREEN_MAX_APP_NUM){
            	 var msg1 = sprintf(td_lang.inc.msg_124,SCREEN_MAX_APP_NUM);
               if(!confirm(msg1)){
                  return;   
               }   
            }
            //@todo 添加桌面图标事件
            addApp({"func_id":appid,"id":appEid, "name":apptitle},slideBox.getCursor());
            var flag = serializeSlide();

            if(flag){
               $(this).fadeOut(($.browser.msie ? 1 : 300),function(){$(this).remove();});
               portalMessage(td_lang.inc.msg_82);//"应用已添加到当前桌面！"
            }else{
               portalMessage(td_lang.inc.msg_83);      //"应用添加错误！"
            }
            
         });
         
         //默认选中第一个
         $("#app_cate_list ul li a:first").trigger("click");
         
         //更新高度
         $("#portalSetting").layout({north:{size:38}, center:{}});
         $("#appPageDom").layout({west: {size:'auto'},center:{}});
         
         //定义应用一级菜单是否滚动
         initAppListScroll();
         
         $("#app_cate_list ul").mousewheel(function(){
            $('#app_cate_list ul').stop().animate({'scrollTop':($('#app_cate_list ul').scrollTop() - this.D)}, 50);
         });
         
         CheckBkImg('#dialog_appbox div,#dialog_appbox a,#dialog_appbox ul,#dialog_appbox li,#dialog_appbox span');
      });
      
      CheckBkImg('div,a,ul,li,span');
   });
      
})(jQuery);

function CheckBkImg(selector)
{
   jQuery(selector).each(function(){
      jQuery(this).css('background-image');
   });
}

var __sto = setTimeout;
window.setTimeout = function(callback,timeout,param)
{
   var args = Array.prototype.slice.call(arguments,2);
   var _cb = function()
   {
      callback.apply(null,args);
   }
   return __sto(_cb,timeout);
};

//序列化桌面上的图标,并且更新
function serializeSlide() {
   var s = "";
   jQuery("#container .screen").each(function(i, e) {
      jQuery(this).find("li.block").each(function(j, el) {
         if(!jQuery(el).attr("index")) return true;
         s += jQuery(el).attr("index");
         s += ",";
      });
      s += "|";
   });
   if (s.length) {
      s = s.replace(/\|$/, "");   
   }
   var flag = false;
   jQuery.ajax({
      async: false,
      data: {"action":"general", "icon_id": s},
      url: '/general/slidebox.php',
      success: function(r) {
         if (r == "+ok") {
            flag = true;
         }
      }
   });
   return flag;
}

function Text2Object(data)
{
   try{
      var func = new Function("return " + data);
      return func();
   }
   catch(ex){
      return '<b>' + ex.description + '</b><br /><br />' + data;
   }
}

function openURL(id, name, code)
{
   if(code.indexOf('http://') == 0 || code.indexOf('https://') == 0 || code.indexOf('ftp://') == 0)
   {
      window.open(code);
      return;
   }
   else if(code.indexOf('file://') == 0)
   {
      winexe(name, code.substr(7));
      return;
   }
   
   var url = "";
   if(id >= 10000 && id <= 14999)
      url = '/fis/' + code
   else if(id >= 15000 && id <= 15499)
      url = '/hr/' + code
   else if(id >= 650 && id <= 1000 || code.length > 4 && code.substr(code.length-4).toLowerCase() == ".jsp")
      url = '/app/' + code
   else if(code.substr(0, 9) != '/general/')
      url = '/general/' + code
   else
      url = code;

   if(url.indexOf(".") < 0 && url.indexOf("?") < 0  && url.indexOf("#") < 0 && url.substring(url.length-1) != "/")
      url += "/";
      
   window.open(url);
}

function winexe(NAME,PROG)
{
   var URL="/general/winexe/?PROG="+PROG+"&NAME="+NAME;
   window.open(URL,"winexe","height=100,width=350,status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,top=0,left=0,resizable=no");
}
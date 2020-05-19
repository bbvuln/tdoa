if(typeof(LoadScript) != "function")
{
   function LoadScript(url)
   {
      url = url.toLowerCase();
      var scripts = document.getElementsByTagName('script');
      for(var i=0; i<scripts.length; i++)
      {
         var src = scripts[i].getAttribute('src');
         if(src)
         {
            src = src.toLowerCase();
            if(src == url || src + ".gz" == url || src == url + ".gz")
               return;
         }
      }
      
      document.write( '<scr' + 'ipt type="text/javascript" src="' + url + '"><\/scr' + 'ipt>' ) ;
      scripts = null;
   }
}

if(typeof(LoadCss) != "function")
{
   function LoadCss(url)
   {
      url = url.toLowerCase();
      var links = document.getElementsByTagName('link');
      for(var i=0; i<links.length; i++)
      {
         var href = links[i].getAttribute('href');
         if(href)
         {
            href = href.toLowerCase();
            if(href == url || href + ".gz" == url || href == url + ".gz")
               return;
         }
      }
      
   	document.write( '<link href="' + url + '" type="text/css" rel="stylesheet" />' ) ;
   	links = null;
   }
}

var gz_postfix = typeof(window.top.gz_postfix) == "string" ? window.top.gz_postfix : "";

LoadScript('/static/js/ispirit.js');
typeof jQuery != "undefined" || LoadScript('/static/js/jquery-1.5.1/jquery.min.js');
LoadScript('/static/js/jquery-1.5.1/jquery-ui.custom.min.js');
LoadScript('/static/js/jquery-1.5.1/jquery.cookie.js');
LoadScript('/static/js/jquery-1.5.1/jquery.dynatree.js');

function Tree(id, jsonURL, iconsPath, checkbox, selectMode, options)
{
   this.id = id;
   this.jsonURL = jsonURL;
   this.options = options;
   this.iconsPath = iconsPath ? iconsPath : '/static/images/org/';
   this.checkbox = checkbox ? checkbox : false;
   this.selectMode = selectMode ? selectMode : 3;
   this.tree = null;
   this.minExpandLevel = typeof(this.options) == "object" && options.minExpandLevel ? options.minExpandLevel : 1;
   this.persist = typeof(this.options) == "object" && options.persist == true ? true : false;
   this.span = document.createElement("span");
}

Tree.prototype.BuildTree = function()
{
   jQuery("#" + this.id).dynatree({
      minExpandLevel: this.minExpandLevel,
      persist: this.persist,
      autoFocus: false,
      imagePath: this.iconsPath,
      checkbox: this.checkbox,
      selectMode: this.selectMode,
      customOptions:this.options,
      children: typeof(this.options) == "object" && typeof(this.options.LazyReadAPI) == "function" ? this.options.LazyReadAPI(this.options.paras) : null,
      fx: { height: "toggle", duration: 200 },
      initAjax: {
         url: this.jsonURL
      },
      onPostInit: function(isReloading, isError){
         if(typeof(tree_loaded) == 'function')
            tree_loaded(this, isReloading, isError);
      },
      onLazyRead: function(node){
         if(typeof(this.options.customOptions) == "object" && typeof(this.options.customOptions.LazyReadAPI) == "function")
         {
            node.addChild(this.options.customOptions.LazyReadAPI({"node":node, "flag":this.options.customOptions.paras.flag}));
            node.setLazyNodeStatus(DTNodeStatus_Ok);
         }
         else if(node.data.json)
         {
            node.appendAjax({
               url: node.data.json
            });
         }
         else
         {
            node.setLazyNodeStatus(DTNodeStatus_Ok);
         }
      },
      onActivate: function(node){
         if(typeof(tree_click) == 'function')
            tree_click(node);
             node = null;
      },
      onBlur: function(node) {
         node.deactivate();
         node = null;
      },
      onDblClick: function(node){
         if(typeof(tree_dblclick) == 'function')
            tree_dblclick(node);
         node = null;
      },
      onSelect: function(select, node){
         if(typeof(tree_select) == 'function')
            tree_select(select, node);
         node = null;
      },
      onRender: function(node, nodeSpan){
         if(typeof(tree_render) == 'function')
            tree_render(node, nodeSpan);
         node = null;
         nodeSpan = null;
      },
      onCreate: function(node, nodeSpan){
         if(typeof(tree_create) == 'function')
            tree_create(node, nodeSpan);
         node = null;
         nodeSpan = null;
      },
      strings: {
         loading: td_lang.inc.msg_84,//"加载中..."
         loadError: td_lang.inc.msg_85
      }
   });
   
   this.tree = jQuery("#" + this.id).dynatree('getTree');
   if(typeof(mouseenter_tree_li_callback) == "function"){
      jQuery("#" + this.id + " li").live('mouseenter', mouseenter_tree_li_callback);

   }
}

Tree.prototype.reload = function()
{
   var objs = document.getElementById(this.id).getElementsByTagName('li');
   for(var i=0; i<objs.length; i++)
   {
      if(objs[i].getAttribute('dtnode'))
         objs[i].removeAttribute('dtnode');
   }
   objs = null;
   
   this.tree.getRoot().removeChildren();
   remove_nodes(this.tree.options.children);
   
   if(typeof(this.options) == "object" && typeof(this.options.LazyReadAPI) == "function")
   {
      this.tree.options.children = null;
      this.tree.options.children = this.options.LazyReadAPI(this.options.paras);
   }
   
   this.tree.reload();
}

Tree.prototype.addNode = function(data)
{
}

Tree.prototype.editNode = function(data)
{
   var node = this.tree.getNodeByKey(data.key);
   if(!node)
      return;
   
   if(data.new_key)
      node.data.key = data.new_key;
   if(data.icon)
      node.data.icon = data.icon;
   if(data.title)
   {
     node.data.title = data.title;
     node.data.tooltip = data.title;
   }
   if(data.url)
   {
     node.data.url = data.url;
   }
   node.render();
}

Tree.prototype.render = function(key, data)
{
   var node = this.tree.getNodeByKey(key);
   if(!node)
      return;
   node.data = data;
   node.render();
}

Tree.prototype.deleteNode = function(data)
{
   var node = this.tree.getNodeByKey(data.key);
   if(!node)
      return;
   
   var parent = node.parent;
   node.remove();
   
   if(parent.countChildren() <= 0)
   {
      if(parent.parent == this.tree.getRoot())
         this.tree.reload();
      else
         parent.parent.reloadChildren();
   }
}

Tree.prototype.redrawNode = function(id,action,text,new_id,url)
{
   if(jQuery("#msg").length > 0)
      jQuery("#msg").hide();
   
   if(id=="0" || !id)
   {
      this.tree.reload();
      return;
   }
   
   if(action=="add" || action=="copy" || action=="cut" || action=="share")
   {
      var node = this.tree.getNodeByKey('folder_' + id);
      if(!node)
         return;
      
      //--修改,判断当树子节点的子节点为空时直接刷新整个树,--yzx
      if(node.data.children==null||node.data.children=='')
      {
          this.tree.reload();
      }
      //----------------
      
      if(node.data.isLazy)
      {
         node.reloadChildren();
      }
      else
      {
         node.parent.reloadChildren();
      }
   }
   else if(action=="delete")
   {
      this.deleteNode({key: 'folder_' + id});
   }
   else if(action=="rename")
   {
      this.editNode({
         key: 'folder_' + id, 
         title: text, 
         new_key: 'folder_' + new_id,
         url: url
      });
   }
}

function tree_click(node)
{
   if(typeof(node_click) == 'function')
   {
      node_click(node);
   }
   else if(typeof(window.top.ispirit_js) != 'function' || typeof window.external == 'undefined' || typeof(window.external.OA_SMS) == 'undefined')
   {
      if(node.data.url && node.data.target)
      {
         if(window.frames[node.data.target])
            window.frames[node.data.target].location = node.data.url;
         else if(parent.frames[node.data.target])
            parent.frames[node.data.target].location = node.data.url;
         else if(top.frames[node.data.target])
            top.frames[node.data.target].location = node.data.url;
         else
            window.open(node.data.url);
      }
   }
}

function tree_select(select, node)
{
   if(node.data.onCheck)
      eval(node.data.onCheck + "('" + node.data.key + "', " + select + ");");
}

function get_client_type(client)
{
   if(client == "0")
      return td_lang.inc.msg_86;//"浏览器"
   else if(client == "1")
      return td_lang.inc.msg_87;//"手机浏览器"
   else if(client == "2")
      return td_lang.inc.msg_88;//"OA精灵"
   else if(client == "5")
      return td_lang.inc.msg_89;//"iPhone"
   else if(client == "6")
      return td_lang.inc.msg_90;//"Android"
   else
      return "";
}

function find_id(str, id)
{
   return (str.indexOf(id + ",") == 0) || (str.indexOf("," + id + ",") > 0) ? 1 : 0;
}

function remove_nodes(nodes)
{
   if(!nodes || !nodes.children)
   {
      nodes = null;
      return;
   }
   
   for(var i=0; i<nodes.children.length; i++)
   {
      remove_nodes(nodes.children[i]);
   }
   
   nodes.children = null;
   nodes = null;
}

function XML()
{
   this.lastError = 0;
   this.async = false;
   this.xmlDOM = null;
}

XML.prototype.loadFromURL = function(url)
{
   var xhttp = this.newXMLHttpRequest();
   if(xhttp)
   {
      var xmlDOM = null;
      xhttp.open("GET", url, this.async);
      xhttp.onreadystatechange=function(){
         if(xhttp.readyState==4){
            xmlDOM = xhttp.responseXML;
         }
      };
      xhttp.send(null);
      this.xmlDOM = xmlDOM;
   }
   else
   {
      this.xmlDOM = this.createXMLDom();
      if(this.xmlDOM)
      {
         this.xmlDOM.async = this.async;
         this.xmlDOM.load(url);
         
         if(window.DOMParser)
            this.lastError = this.xmlDOM.documentElement.childNodes[0].nodeValue;
         else
            this.lastError = this.xmlDOM.parseError.reason;
      }
   }
}

XML.prototype.loadFromString = function(str)
{
   if(window.DOMParser)
   {
      var parser = new DOMParser();
      this.xmlDOM = parser.parseFromString(str,"text/xml");
      if(this.xmlDOM.documentElement.childNodes.length > 0)
         this.lastError = this.xmlDOM.documentElement.childNodes[0].nodeValue;
   }
   else
   {
      this.xmlDOM = this.createXMLDom();
      if(this.xmlDOM)
      {
         this.xmlDOM.async = this.async;
         this.xmlDOM.loadXML(str);
         this.lastError = this.xmlDOM.parseError.reason;
      }
      else
      {
         this.lastError = "Create XMLDom Failed!";
      }
   }
}

XML.prototype.getRoot = function()
{
   if(!this.xmlDOM || this.lastError)
      return null;
   
   return this.xmlDOM.documentElement; //xml文档根节点
}

XML.prototype.createXMLDom = function() //创建XMLDOM对象函数，跨浏览器解决方案
{
   if(window.ActiveXObject) //IE
   {
      var DomType = new Array("Microsoft.XMLDOM","msxml.domdocument","msxml2.domdocument","msxml2.domdocument.3.0","msxml2.domdocument.4.0","msxml2.domdocument.5.0");
      for(var i=0;i<DomType.length;i++)
      {
         try{
            var a = new ActiveXObject(DomType[i]);
            if(!a) continue;
            return a;
         }
         catch(ex){}
      }
   }
   else if(document.implementation && document.implementation.createDocument) //FireFox,Opera,safari
   {
      try{
         return document.implementation.createDocument("","",null);
      }
      catch(ex){}
   }
   else
   {
       return null;
   }
}

XML.prototype.newXMLHttpRequest = function()
{
	var a=null;
	if(window.XMLHttpRequest) // for IE7, Firefox, Opera, etc.
	{
		a=new XMLHttpRequest();
	}
	else if(window.ActiveXObject)// for IE6, IE5
	{
		a=new ActiveXObject("Msxml2.XMLHTTP");
		if(!a)
		{
			a=new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	return a;
}

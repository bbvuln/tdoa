var $ = function(id) {return document.getElementById(id);};

function newXMLHttpRequest()
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

function NewDomObj()
{
   var DomType = new Array("microsoft.xmldom","msxml.domdocument","msxml2.domdocument","msxml2.domdocument.3.0","msxml2.domdocument.4.0","msxml2.domdocument.5.0");
   for(var i=0;i<DomType.length;i++)
   {
      try{
         var a = new ActiveXObject(DomType[i]);
         if(!a) continue;
         return a;
      }
      catch(ex){}
   }
   return null;
}

function CreateXMLDom(XmlSrc) //创建XMLDOM对象函数，跨浏览器解决方案
{
   var xmlDom = null;
   if(window.ActiveXObject) //IE
   {
       xmlDom = NewDomObj();
       xmlDom.async = false;
       xmlDom.load(XmlSrc);
       if(xmlDom.parseError.errorCode != 0)
       {
          xmlDom = null;
       }
   }
   else if(document.implementation && document.implementation.createDocument) //FireFox,Opera
   {
       xmlDom = document.implementation.createDocument("","",null);
       xmlDom.async = false;
       try{
          xmlDom.load(XmlSrc);
       }
       catch(ex){//Safari,Chorme
          xmlDom = null;
       }
   }
   else
   {
       window.alert("不支持XMLDOM对象");
       return null;
   }
   
   if(xmlDom == null)
   {
      var req = newXMLHttpRequest();
      req.open("GET", XmlSrc, false);
      req.onreadystatechange=function(){
         if(req.readyState==4){
            xmlDom = req.responseXML;
         }
      };
      req.send(null);
   }
   
   return xmlDom;
}

function Tree(id, XmlSrc)
{
   this.id = id;
   this.name = id;
   this.XmlSrc = XmlSrc;
   this.baseURL = '';
   this.Xml = {};
   this.icons = {
      'plus'         : '/images/collapsed.gif',
      'minus'        : '/images/expanded.gif',
      'transparent'  : '/images/transparent.gif',
      'loading'      : '/images/endnode.gif',
      'msg'          : '/images/msg.png',
      'email'        : '/images/email.png'
   };
   this.msg = {
      'loading'    : '<img align="absmiddle" src="' + this.icons['loading'] + '" class="NodeLoadingImg">加载中...',
      'loadfailed' : '<img align="absmiddle" src="' + this.icons['loading'] + '" class="NodeLoadingImg">加载失败',
      'parsefailed'    : '不能解析XML文档'
   };
}

Tree.prototype.BuildTree = function()
{
   $(this.id).innerHTML = this.msg['loading'];
   var xmlDom = CreateXMLDom(this.baseURL + this.XmlSrc); //创建XMLDOM对象
   if(typeof(xmlDom) != "object") return;
   
   var rootNode = xmlDom.documentElement; //xml文档根节点
   if(!rootNode)
   {
      alert(this.msg['parsefailed']+xmlDom.documentURI);
      return;
   }

   $(this.id).innerHTML = this.Node2HTML(rootNode, true);
}

Tree.prototype.ClickNode = function(id)
{
   var container = $(this.id + '_container_' + id);
   var expander = $(this.id + '_expand_' + id);
   if(!container || !expander) return;
   
   if(container.innerHTML.trim() == "")  //加载下级节点XML内容
   {
      this.LoadNode(id);
   }
   else
   {
      if(container.style.display == "none")
      {
         container.style.display = "block"; //展开下级节点
         expander.src = this.icons['minus'];
      }
      else
      {
         container.style.display = "none";   //收缩/隐藏下级节点
         expander.src = this.icons['plus'];
      }
   }
//   this.CancelBuble(event); //plus停止事件冒泡
}

Tree.prototype.LoadNode = function(id)
{
   var container = $(this.id + '_container_' + id);
   var expander = $(this.id + '_expand_' + id);
   if(!container || !expander) return;
   
   expander.src = this.icons['minus'];
   container.innerHTML = this.msg['loading'];
   var xmlDom = CreateXMLDom(this.baseURL + this.Xml[id]); //创建XMLDOM对象
   if(typeof(xmlDom) != "object")
   {
      container.innerHTML = this.msg['loadfailed'];
      return;
   }
   
   var rootNode = xmlDom.documentElement; //xml文档根节点
   if(!rootNode)
   {
      alert(this.msg['parsefailed']);
      return;
   }
   
   var html = this.Node2HTML(rootNode);
   container.innerHTML = html;
   container.style.display = 'block';
   this.CheckChildren(container.parentNode);
   
   if(html.trim() == "")  //如果下级节点内容为空，则隐藏+-符号图标，置onclick事件为null
   {
      expander.src = this.icons['transparent'];
      expander.onclick = null;
      $(this.id + '_link_' + id).onclick = null;
      $(this.id + '_div_' + id).removeChild(container);
   }
}

Tree.prototype.Node2HTML = function(rootNode, first)
{
   var html = '';
   var nodes = rootNode.childNodes; //xml文档根节点的所有下属子节点
   for (var i=0;i<nodes.length;i++) //循环显示一级分类
   {
      var node = nodes[i];
      if(node.nodeType != 1)
         continue;
      
      var childrenHtml = this.Node2HTML(node, false);
      
      var id      = node.getAttribute("id");
      var text    = node.getAttribute("text");
      var href    = node.getAttribute("href");
      var target  = node.getAttribute("target");
      var title   = node.getAttribute("title");
      var onclick = node.getAttribute("onclick");
      var img_src = node.getAttribute("img_src");
      var op_sms  = node.getAttribute("op_sms");
      var Xml     = node.getAttribute("Xml");
      
      this.Xml[id] = Xml;
      
      text  = (text == null) ? '&nbsp;' : text;
      href  = (href == null) ? 'javascript:;' : href;
      title = (title == null) ? '' : title;
      target= (target == null) ? '_self' : target;
      
      html += '<div id="' + this.id + '_div_' + id + '" class="NodeDiv" nowrap="true">';
      if(Xml != null)
         html += '<img id="' + this.id + '_expand_' + id + '" onclick="' + this.id + '.ClickNode(\'' + id + '\');" src="' + (childrenHtml != '' && first ? this.icons['minus'] : this.icons['plus']) + '" class="NodeExpandImg" align="absmiddle" />';
      else
         html += '<img id="' + this.id + '_expand_' + id + '" src="' + this.icons['transparent'] + '" class="NodeTransparentImg" align="absmiddle" />';
      html += '<img width="16" height="16" id="' + this.id + '_img_' + id + '"' + (Xml != null ? ' onclick="' + this.id + '.ClickNode(\'' + id + '\');"' : '') + ' src="' + img_src + '" class="NodeImg" align="absmiddle" />';
      if(onclick != null)
         html += '<input type="checkbox" id="' + this.id + '_checkbox_' + id + '" onclick="' + onclick + ';' + this.id + '.CheckChildren(this.parentNode);' + this.id + '.CheckParent(this.parentNode);" />';
      html += '<span id="' + this.id + '_span_' + id + '" title="' + title + '" class="NodeSpan"';
      if(op_sms == "1")
         html += ' onmouseover="$(\'' + this.id + '_span_op_' + id + '\').style.display=\'inline\';" onmouseout="$(\'' + this.id + '_span_op_' + id + '\').style.display=\'none\';"';
      html += ' nowrap="true"><a id="' + this.id + '_link_' + id + '" href="' + href + '"' + (Xml != null ? ' onclick="' + this.id + '.ClickNode(\'' + id + '\');"' : '') + ' class="NodeLink" target="' + target + '">' + text + '</a>';
      if(op_sms == "1")
      {
         html += "<span id=\"" + this.id + '_span_op_' + id + "\" style=\"display:none;\">&nbsp;<a href=javascript:parent.send_sms('"+ id +"','"+ escape(text) +"') title='发短信' style='padding:0px;'><img src='"+this.icons['msg']+"' align='absmiddle' /></a>";
         html += "<a href=javascript:parent.send_email('"+ id +"','"+ escape(text) +"') title='发邮件' style='padding:0px;'><img src='"+this.icons['email']+"' align='absmiddle' /></a></span>";
      }
      html += '</span>';
      if(Xml != null)
         html += '<div id="' + this.id + '_container_' + id + '" class="NodeContainer"' + ((childrenHtml != '' && !first) ? 'style="display:none;"' : 'style="display:block;"') + ' nowrap="true">' + childrenHtml + '</div>';
      html += '</div>';//alert(html)
   }
   return html;
}

Tree.prototype.CheckChildren = function(objNode)
{
   var Children = this.getChildren(objNode);
   var Button = this.getElement(objNode,"input");
   if(Children && Button)
   {
      var indeterminate = Button.indeterminate;
      var isCheck = Button.checked;
      for(var i=0; i<Children.length; i++)
      {
         var _button = this.getElement(Children[i],"input")
         if(_button)
         {
            _button.indeterminate = indeterminate;
            _button.checked = isCheck;
            this.CheckChildren(Children[i]);
         }
      }
   }
}

Tree.prototype.SetBaseURL = function(baseURL)
{
   this.baseURL = isUndefined(baseURL) ? '' : baseURL;
}

Tree.prototype.LoadCss = function(href)
{
   var css = document.createElement('link');
   css.type = 'text/css';
   css.rel = 'stylesheet';
   css.href = href;
   var headNode = document.getElementsByTagName("head")[0];
   if(headNode)
      headNode.appendChild(css);
}

Tree.prototype.CheckParent = function(objNode)
{
   var Parent = this.getParentNode(objNode);
   var Button = this.getElement(objNode,"input");
   if(Parent)
   {
      var Children = this.getChildren(Parent);
      var count=indeterminate=0;
      for(var i=0; Children && i<Children.length; i++)
      {
         var checkobx_i=this.getElement(Children[i],"input");
         if(!checkobx_i)
            continue;
         if(checkobx_i.checked)
           count++;
         if(checkobx_i.indeterminate)
           indeterminate++;
      }
      
      var checkobx=this.getElement(Parent,"input");
      if(checkobx)
      {
          if(count==0)
          {
             checkobx.indeterminate=false;
             //checkobx.checked=false;
          }
          else if(indeterminate>0 || count>0 && count<Children.length)
          {
             checkobx.indeterminate=true;
             //checkobx.checked=false;
          }
          else
          {
             checkobx.indeterminate=false;
             if(checkobx.checked==false)
                checkobx.indeterminate=true;
             //checkobx.checked=true;
          }
      }
      this.CheckParent(Parent);
   }
}

Tree.prototype.getElement = function(el,T)
{
   var ol=null;
   if(!el || (!el.childNodes && !el.children))
      return null;
   var Children = el.children ? el.children : el.childNodes;
   for(var i=0;i<Children.length;i++)
   { if(Children[i].tagName.toUpperCase()==T.toUpperCase()){ ol=Children[i];break;} }
   return ol;
}

Tree.prototype.getParentNode = function(el){
	var tmp = el.parentElement ? el.parentElement : el.parentNode;
	if(tmp.className=="NodeContainer")return tmp.parentElement ? tmp.parentElement : tmp.parentNode;
	return null;
}

Tree.prototype.getChildren = function(el){
	var tmp=this.getElement(el,"div");
	if(tmp){ return tmp.children ? tmp.children : tmp.childNodes;}
	return null;
}

Tree.prototype.redrawNode = function(id,action,text)
{
   if($("msg"))
      $("msg").style.display = "none";
   
   var div = $(this.id + '_div_' + id);
   var link = $(this.id + '_link_' + id);
   if(id=="0" || !id || !div || !link)
   {
      this.BuildTree();
      return;
   }
   
   if(action=="add" || action=="copy" || action=="cut" || action=="share")
   {
      var container = $(this.id + '_container_' + id);
      if(container) //如果当前节点有container，则重建当前节点，否则重建父节点
      {
         this.LoadNode(id);
      }
      else
      {
         var parent = div.parentNode;
         if(!parent) return;
         
         if(parent.id == this.id) //如果是根div则重建树
         {
            this.BuildTree();
         }
         else //重建父节点
         {
            var pid = parent.id.substr(parent.id.lastIndexOf('_')+1);
            this.LoadNode(pid);
         }
      }
   }
   else if(action=="delete")
   {
      var parent = div.parentNode;
      if(!parent) return;
      
      if(parent.id == this.id) //如果是根div则重建树
      {
         this.BuildTree();
      }
      else //重建父节点
      {
         var pid = parent.id.substr(parent.id.lastIndexOf('_')+1);
         if(parent.childNodes.length > 1)
            parent.removeChild(div);
         else
            this.LoadNode(pid);
      }
   }
   else if(action=="rename")
   {
      link.innerHTML = text;
   }
}

Tree.prototype.CancelBuble = function(event) //停止事件冒泡函数,跨浏览器解决方案
{return;
    if (window.ActiveXObject) //IE
    {event.cancelBubble = true;}
    else //FireFox
    {event.stopPropagation();}
}

String.prototype.trim = function()
{
  return this.replace(/(^[\s\t　]+)|([　\s\t]+$)/g, "");
};
function isUndefined(variable) {
   return typeof variable == 'undefined' ? true : false;
}
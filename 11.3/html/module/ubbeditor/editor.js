function UBBEditor(_id, _StartFocus, _CtrlEnter)
{
  this.tid = _id;
  this.tName = '';
  this.tValue = '';
  this.tbaseURL = '/module/ubbeditor/';
  this.tStartFocus = _StartFocus;
  this.tCtrlEnter = _CtrlEnter;
  this.tSmileyNum = 30;
  this.tPanelHeight = 22;
  this.tEditState = 1;
  this.tEditUBBMode = 1;
  this.tInstance = null;
  this.tSelection = null;
  this.tRange = null;
  this.tRangeText = null;
  this.tInputObject = null;
  this.tTheme = 'default';
  this.tToolbar = 'default';
  this.tToolbarSets = Array;
  this.tToolbarSets['default'] = ['FontName','FontSize','Bold','Italic','Underline','TextColor','separator','Link','Unlink','Smiley','separator','RemoveFormat'];
  this.FontNameSets = ['默认字体','宋体','黑体','楷体','楷体_GB2312','隶书','幼圆','Arial','Courier New','Fixedsys','Georgia','Tahoma','Verdana'];
  this.FontSizeSets = [1,2,3,4,5,6,7];
  this.tEI = function(_id)
  {
    return document.getElementById(_id);
  };
  this.tEH = function(_strers, _strtagname)
  {
    var tObject = null;
    var tstrers = _strers;
    var tstrtagname = _strtagname;
    if (tstrers && tstrtagname)
    {
      var tObj1 = this.tEI(this.tid + '-divFactory');
      tObj1.innerHTML = tstrers;
      tObject = tObj1.getElementsByTagName(tstrtagname).item(0);
    };
    return tObject;
  };
  this.tFW = function(_id)
  {
    var tid = _id;
    var tobj = null;
    try
    {
      tobj = document.frames[tid];
    } catch(e){};
    if (tobj == null)
    {
      try
      {
        tobj = this.tEI(tid).contentWindow;
      } catch(e){};
    };
    return tobj;
  };
  this.tAttachEvent = function(_obj, _eventName, _handler, _object)
  {
    var tobj = _obj;
    var teventName = _eventName;
    var thandler = _handler;
    var teventHandler = _handler;
    var tobject = _object;
    if (tobj)
    {
      if (tobject)
      {
        teventHandler = function(e)
        {
          thandler.call(tobject, e);
        };
      };
      try {tobj.addEventListener(teventName, teventHandler, false);}
      catch(e)
      {
        if (teventName == 'keydown') tobj = tobj.document;
        tobj.attachEvent('on' + teventName, teventHandler);
      };
    };
  };
  this.tIsIE = function()
  {
    return (navigator.userAgent.toLowerCase().indexOf('msie')!= -1 && document.all);
  };
  this.tReplace = function(_strers, _reary, _ign)
  {
    var tstrers = _strers;
    var treary = _reary;
    var tign = _ign;
    var tstate1 = true;
    for (var ti = 0; ti < treary.length; ti ++)
    {
      if (!treary[ti][2]) tstrers = tstrers.replace(treary[ti][0], (tign ? '' : treary[ti][1]));
    };
    while(tstate1)
    {
      tstate1 = false;
      for (var ti = 0; ti < treary.length; ti ++)
      {
        if (treary[ti][2] && tstrers.search(treary[ti][0]) != -1)
        {
          tstate1 = true;
          tstrers = tstrers.replace(treary[ti][0], (tign ? '' : treary[ti][1]));
        };
      };
    };
    return tstrers;
  };
  this.tHTMLEncode = function(_strers)
  {
    var tstrers = _strers;
    if (tstrers)
    {
      tstrers = tstrers.replace(/&/igm, '&amp;');
      tstrers = tstrers.replace(/</igm, '&lt;');
      tstrers = tstrers.replace(/>/igm, '&gt;');
      tstrers = tstrers.replace(/\"/igm, '&quot;');
    };
    return tstrers;
  };
  this.tHTMLDecode = function(_strers)
  {
    var tstrers = _strers;
    if (tstrers)
    {
      tstrers = tstrers.replace(/&lt;/igm, '<');
      tstrers = tstrers.replace(/&gt;/igm, '>');
      tstrers = tstrers.replace(/&quot;/igm, '"');
      tstrers = tstrers.replace(/&nbsp;/igm, ' ');
      tstrers = tstrers.replace(/&amp;/igm, '&');
    };
    return tstrers;
  };
  this.tHTMLClear = function(_strers)
  {
    var tstrers = _strers;
    if (tstrers)
    {
	    tstrers = tstrers.replace(/<script[^>]*>[\s\S]*?<\/script[^>]*>/gim, '');
	    tstrers = tstrers.replace(/<(\/?)(script|i?frame|style|html|head|body|title|link|meta|object|\?|\%)([^>]*?)>/gi, '');
	    tstrers = tstrers.replace(/<([a-z]+)+\s*(?:onerror|onload|onunload|onresize|onblur|onchange|onclick|ondblclick|onfocus|onkeypress|onkeydown|onkeyup|onmousemove|onmousedown|onmouseout|onmouseover|onmouseup|onselect)[^>]*>/gi, '<$1>');
    };
    return tstrers;
  };
  this.tHTML2XHTML = function(_strers)
  {
    var tstrers = _strers;
    if (tstrers)
    {
	    tstrers = tstrers.replace(/<br.*?>/gi, '<br />');
	    tstrers = tstrers.replace(/(<hr\s+[^>]*[^\/])(>)/gi, '$1 />');
	    tstrers = tstrers.replace(/(<img\s+[^>]*[^\/])(>)/gi, '$1 />');
    };
    return tstrers;
  };
  this.tXHTML2UBB = function(_strers)
  {
    var tstrers = _strers;
    if (tstrers)
    {
      var tthis = this;
      var tReplaceAry = [
        [/<br \/>/ig, '[br]', false],
        [/<p>([^<]*?)<\/p>/igm, '$1', true],
        [/<b>([^<]*?)<\/b>/igm, '[b]$1[/b]', true],
        [/<strong>([^<]*?)<\/strong>/igm, '[b]$1[/b]', true],
        [/<i>([^<]*?)<\/i>/igm, '[i]$1[/i]', true],
        [/<em>([^<]*?)<\/em>/igm, '[i]$1[/i]', true],
        [/<u>([^<]*?)<\/u>/igm, '[u]$1[/u]', true],
        [/<ol>([^<]*?)<\/ol>/igm, '[ol]$1[/ol]', true],
        [/<ul>([^<]*?)<\/ul>/igm, '[ul]$1[/ul]', true],
        [/<li>([^<]*?)<\/li>/igm, '[li]$1[/li]', true],
        [/<span\s[^>]*?>([^<]*?)<\/span>/igm, function($0, $1) {
          var tString = $1;
          var tObj1 = tthis.tEH($0, 'span');
          if (tObj1.style.fontWeight.toLowerCase() == 'bold') tString = '[b]' + tString + '[/b]';
          if (tObj1.style.fontStyle.toLowerCase() == 'italic') tString = '[i]' + tString + '[/i]';
          if (tObj1.style.textDecoration.toLowerCase() == 'underline') tString = '[u]' + tString + '[/u]';
          if (tObj1.style.color) tString = '[color=' + tObj1.style.color + ']' + tString + '[/color]';
          if (tObj1.style.backgroundColor) tString = '[hilitecolor=' + tObj1.style.backgroundColor + ']' + tString + '[/hilitecolor]';
          return tString;
        }, true],
        [/<font\s[^>]*?>([^<]*?)<\/font>/igm, function($0, $1) {
          var tString = $1;
          var tObj1 = tthis.tEH($0, 'font');
          if (tObj1.getAttribute('color')) tString = '[color=' + tObj1.getAttribute('color') + ']' + tString + '[/color]';
          if (tObj1.style.color) tString = '[color=' + tObj1.style.color + ']' + tString + '[/color]';
          if (tObj1.style.backgroundColor) tString = '[hilitecolor=' + tObj1.style.backgroundColor + ']' + tString + '[/hilitecolor]';

          if (tObj1.getAttribute('face')) tString = '[face=' + tObj1.getAttribute('face') + ']' + tString + '[/face]';
          if (tObj1.getAttribute('size')) tString = '[size=' + tObj1.getAttribute('size') + ']' + tString + '[/size]';

          return tString;
        }, true],
        [/<p\s[^>]*?>([^<]*?)<\/p>/igm, function($0, $1) {
          var tString = $1;
          var tObj1 = tthis.tEH($0, 'p');
          if (tObj1.getAttribute('align')) tString = '[align=' + tObj1.getAttribute('align') + ']' + tString + '[/align]';
          if (tObj1.style.textAlign) tString = '[align=' + tObj1.style.textAlign + ']' + tString + '[/align]';
          tString = '[p]' + tString + '[/p]';
          return tString;
        }, true],
        [/<div\s[^>]*?>([^<]*?)<\/div>/igm, function($0, $1) {
          var tString = $1;
          var tObj1 = tthis.tEH($0, 'div');
          if (tObj1.className == 'ubb_code') tString = '[code]' + tString + '[/code]';
          if (tObj1.className == 'ubb_quote') tString = '[quote]' + tString + '[/quote]';
          if (tObj1.getAttribute('align')) tString = '[align=' + tObj1.getAttribute('align') + ']' + tString + '[/align]';
          if (tObj1.style.textAlign) tString = '[align=' + tObj1.style.textAlign + ']' + tString + '[/align]';
          return tString;
        }, true],
        [/<a\s[^>]*?>([^<]*?)<\/a>/igm, function($0, $1) {
          var tString = $1;
          var tObj1 = tthis.tEH($0, 'a');
          if (tObj1.getAttribute('href')) tString = '[url=' + tObj1.getAttribute('href') + ']' + tString + '[/url]';
          return tString;
        }, true],
        [/<img\s[^>]*?>/igm, function($0) {
          var tObj1 = tthis.tEH($0, 'img');
          if (tObj1.getAttribute('src')) tString = '[img]' + tObj1.getAttribute('src') + '[/img]';
          return tString;
        }, true]
      ];
      tstrers = this.tReplace(tstrers, tReplaceAry);
      tstrers = tstrers.replace(/<[^>]*>/igm, '');
      tstrers = this.tHTMLDecode(tstrers);
      if(tstrers == "[br]" || tstrers == "[p][/p]" || tstrers == "[p] [/p]")
         tstrers = "";
    };
    return tstrers;
  };
  this.tUBB2XHTML = function(_strers)
  {
    var tstrers = _strers;
    if (tstrers)
    {
      var tthis = this;
      var tReplaceAry = [
        [/\[br\]/ig, '<br />', false],
        [/\[p\]([^\[]*?)\[\/p\]/igm, '<p>$1</p>', true],
        [/\[b\]([^\[]*?)\[\/b\]/igm, '<b>$1</b>', true],
        [/\[i\]([^\[]*?)\[\/i\]/igm, '<i>$1</i>', true],
        [/\[u\]([^\[]*?)\[\/u\]/igm, '<u>$1</u>', true],
        [/\[ol\]([^\[]*?)\[\/ol\]/igm, '<ol>$1</ol>', true],
        [/\[ul\]([^\[]*?)\[\/ul\]/igm, '<ul>$1</ul>', true],
        [/\[li\]([^\[]*?)\[\/li\]/igm, '<li>$1</li>', true],
        [/\[code\]([^\[]*?)\[\/code\]/igm, '<div class="ubb_code" style="BORDER: #dcdcdc 1px dotted; PADDING: 5px; LINE-HEIGHT: 150%; FONT-STYLE: italic">$1</div>', true],
        [/\[quote\]([^\[]*?)\[\/quote\]/igm, '<div class="ubb_quote" style="BORDER: #dcdcdc 1px dotted; PADDING: 5px; LINE-HEIGHT: 150%">$1</div>', true],
        [/\[color=([^\]]*)\]([^\[]*?)\[\/color\]/igm, '<font color="$1">$2</font>', true],
        [/\[face=([^\]]*)\]([^\[]*?)\[\/face\]/igm, '<font face="$1">$2</font>', true],
        [/\[size=([^\]]*)\]([^\[]*?)\[\/size\]/igm, '<font size="$1">$2</font>', true],
        [/\[hilitecolor=([^\]]*)\]([^\[]*?)\[\/hilitecolor\]/igm, '<font style="background-color: $1">$2</font>', true],
        [/\[align=([^\]]*)\]([^\[]*?)\[\/align\]/igm, '<div style="text-align: $1">$2</div>', true],
        [/\[url=([^\]]*)\]([^\[]*?)\[\/url\]/igm, '<a href="$1">$2</a>', true],
        [/\[img\]([^\[]*?)\[\/img\]/igm, '<img src="$1" />', true]
      ];
      tstrers = this.tHTMLEncode(tstrers);
      tstrers = this.tReplace(tstrers, tReplaceAry);
    };
    return tstrers;
  };
  this.tcreateStyleSheet = function()
  {
    var tObj1 = document.getElementsByTagName('head').item(0);
    if (!tObj1) tObj1 = document.getElementsByTagName('body').item(0);
    if (tObj1)
    {
      var tLink1 = document.createElement('link');
      tLink1.setAttribute('rel', 'stylesheet');
      tLink1.setAttribute('type', 'text/css');
      tLink1.setAttribute('href', this.tbaseURL + 'theme/' + this.tTheme + '/css/editor.css');
      tObj1.appendChild(tLink1);
    };
  };
  this.tsetCommand = function(Command, Value)
  {
      this.tLoadMaskClose();
      switch (Command)
	   {
       case 'FontName':
         this.texecCommand("selectAll");
         this.texecCommand('fontname', Value);
         this.texecCommand("Unselect");
         break;
       case 'FontSize':
         this.texecCommand("selectAll");
         this.texecCommand('fontsize', Value);
         this.texecCommand("Unselect");
         break;
       case 'Bold':
         this.texecCommand("selectAll");
         this.texecCommand('bold');
         this.texecCommand("Unselect");
         break;
       case 'Italic':
         this.texecCommand("selectAll");
         this.texecCommand('italic');
         this.texecCommand("Unselect");
         break;
       case 'Underline':
         this.texecCommand("selectAll");
         this.texecCommand('underline');
         this.texecCommand("Unselect");
         break;
       case 'TextColor':
         this.tLoadForeColorTable();
         break;
       case 'TextColorS':
         this.texecCommand("selectAll");
         this.texecCommand('forecolor', Value);
         this.texecCommand("Unselect");
         break;
       case 'Link':
         this.tLoadLinkTable();
         this.tGetSelection();
         break;
       case 'LinkS':
         this.tRangeReselect();
         this.texecCommand('createlink', Value);
         break;
       case 'Unlink':
         this.texecCommand('unlink');
         break;
       case 'Smiley':
         this.tLoadSmileyTable();
         break;
       case 'SmileyS':
         this.texecCommand('insertimage', Value);
         break;
       case 'RemoveFormat':
         this.texecCommand("selectAll");
         this.texecCommand('removeformat');
         this.texecCommand("Unselect");
         break;
      };

      if(Command == 'Bold' || Command == 'Italic' || Command == 'Underline')
      {
         var img = this.tEI(this.tid + '-EditorToolbar-' + Command);//alert(img.className)
         if(img.className != 'EditorSelected')
            img.className = 'EditorSelected';
         else
            img.className = '';
      }
  };
  this.texecCommand = function(Command, Value)
  {
    this.tInstance.focus();
    this.tInstance.document.execCommand(Command, false, Value);
  };
  this.tGetHTML = function()
  {
    var tHTML = this.tInstance.document.body.innerHTML;//.toLowerCase();
    return tHTML;
  };
  this.tInsertHTML = function(tHTML)
  {
    this.tInstance.document.body.innerHTML = tHTML;
  };
  this.tGetUBB = function()
  {
    var tHTML = this.tGetHTML();
    tHTML = this.tHTML2XHTML(tHTML);
    tHTML = this.tHTMLClear(tHTML);
    tHTML = this.tXHTML2UBB(tHTML);
    return tHTML;
  };
  this.tGetSelection = function()
  {
    try
    {
      this.tSelection = this.tInstance.document.selection;
      this.tRange = this.tSelection.createRange();
      this.tRangeText = this.tRange.text;
    }
    catch(e)
    {
      this.tSelection = this.tInstance.getSelection();
      this.tRange = this.tSelection.getRangeAt(0);
      this.tRangeText = this.tRange.toString();
    };
  };
  this.tRangeReselect = function()
  {
    try
    {
      if (this.tRangeText) this.tRange.select();
      else  this.tRange.focus();
    }
    catch(e) {};
  };
  this.tSetInputValue = function()
  {
    var tHTML = this.tGetHTML();
    tHTML = this.tHTML2XHTML(tHTML);
    tHTML = this.tHTMLClear(tHTML);
    if (this.tEditUBBMode == 1) tHTML = this.tXHTML2UBB(tHTML);
    this.tInputObject.value = tHTML;
    if(parent && parent.document.getElementById(this.tid))
       parent.document.getElementById(this.tid).value = tHTML;
  };
  this.tLoadToolbar = function(_obj)
  {
    var tObj1 = _obj;
    if (!tObj1) return;

    var tHTMLString1 = '';
    var tArray1 = this.tToolbarSets[this.tToolbar];
    if (!tArray1) tArray1 = this.tToolbarSets['default'];
    for (var tKey1 in tArray1)
    {
      var tnKey = tArray1[tKey1];
      if(tnKey == 'FontName')
      {
         tHTMLString1 += '<select id="' + this.tid + '-EditorToolbar-' + tnKey + '" onchange="' + this.tName + '.tsetCommand(\'' + tnKey + '\', this.value);" title="' + EditorLang[tnKey] + '">';
         for(var j=0; j< this.FontNameSets.length; j++)
         {
            tHTMLString1 += '<option value="' + (j > 0 ? this.FontNameSets[j] : '') + '">' + this.FontNameSets[j] + '</option>';
         }
         tHTMLString1 += '</select>';
      }
      else if(tnKey == 'FontSize')
      {
         tHTMLString1 += '<select id="' + this.tid + '-EditorToolbar-' + tnKey + '" onchange="' + this.tName + '.tsetCommand(\'' + tnKey + '\', this.value);" title="' + EditorLang[tnKey] + '">';
         for(var j=0; j< this.FontSizeSets.length; j++)
         {
            tHTMLString1 += '<option value="' + this.FontSizeSets[j] + '"';
            if(this.FontSizeSets[j] == 6)
               tHTMLString1 += ' selected="selected"';
            tHTMLString1 += '>' + this.FontSizeSets[j] + '</option>';
         }
         tHTMLString1 += '</select>';
      }
      else if (tnKey == '-' || tnKey == 'separator')
      {
         tHTMLString1 += '<img src="' + this.tbaseURL + 'theme/' + this.tTheme + '/images/toolbar.' + tnKey + '.gif" align="absMiddle" />';
      }
      else
      {
         tHTMLString1 += '<img id="' + this.tid + '-EditorToolbar-' + tnKey + '" src="' + this.tbaseURL + 'theme/' + this.tTheme + '/images/' + tnKey + '.gif" onmouseover="if(this.className == \'\') this.className = \'EditorHover\';" onmouseout="if(this.className == \'EditorHover\') this.className = \'\';" onclick="' + this.tName + '.tsetCommand(\'' + tnKey + '\');" align="absMiddle" title="' + EditorLang[tnKey] + '" />';
      }
    };
    tObj1.innerHTML = tHTMLString1;
  };
  this.tLoadMask = function()
  {
    var tObj1 = this.tEI(this.tid + '-div');
    if (tObj1)
    {
      var tDiv1 = document.createElement('div');
      tDiv1.setAttribute('id', this.tid + '-EditorMask');
      tDiv1.style.position = 'absolute';
      tDiv1.style.top = this.tPanelHeight + "px";
      tDiv1.style.left = '0px';
      tDiv1.style.background = '#FFFFFF';
      tDiv1.style.filter = 'Alpha(Opacity=0)';
      tDiv1.style.opacity = '0';
      tDiv1.style.width = '100%';//tObj1.offsetWidth + 'px';
      tDiv1.style.height = '100%';//tObj1.offsetHeight-this.tPanelHeight + 'px';
      tDiv1.style.zIndex = '100';
      var onclickStr = this.tName + '.tLoadMaskClose()';
      tDiv1.onclick = function(){eval(onclickStr);};
      tObj1.appendChild(tDiv1);

      var tDiv2 = document.createElement('div');
      tDiv2.setAttribute('id', this.tid + '-EditorMaskDIV');
      tDiv2.style.position = 'absolute';
      tDiv2.style.top = this.tPanelHeight + 7 + "px";
      tDiv2.style.left = "50%";
      tDiv2.style.zIndex = '101';
      tObj1.appendChild(tDiv2);
    };
  };
  this.tLoadMaskShow = function(_strHTML)
  {
    var tstrHTML = _strHTML;
    if (tstrHTML)
    {
      var tObj1 = this.tEI(this.tid + '-EditorMaskDIV');
      if (!tObj1)
      {
        this.tLoadMask();
        tObj1 = this.tEI(this.tid + '-EditorMaskDIV');
      };
      if (tObj1)
      {
        tObj1.style.display = 'none';
        tObj1.innerHTML = tstrHTML;
        tObj1.style.display = 'block';
        tObj1.style.marginLeft = (0 - Math.floor(tObj1.offsetWidth / 2)) + 'px';
        //tObj1.style.marginTop = (0 - Math.floor(tObj1.offsetHeight / 2)) + 'px';
      };
    };
  };
  this.tLoadMaskClose = function()
  {
    var tObj1 = this.tEI(this.tid + '-div');
    if (tObj1)
    {
      var tobj21 = this.tEI(this.tid + '-EditorMask');
      var tobj22 = this.tEI(this.tid + '-EditorMaskDIV');
      if (tobj21 && tobj22)
      {
        tObj1.removeChild(tobj21);
        tObj1.removeChild(tobj22);
      };
    };
  };
  this.tLoadLinkTable = function()
  {
    var tLinkTableHTML = '<table cellpadding="0" cellspacing="5" class="EditorLinkTable">';
    tLinkTableHTML += '  <tr>';
    tLinkTableHTML += '    <td>' + EditorLang.tLinkURL + '</td>';
    tLinkTableHTML += '  </tr>';
    tLinkTableHTML += '  <tr>';
    tLinkTableHTML += '    <td><input id="' + this.tid + '-EditorLinkText" type="text" value="http://" class="EditorLinkText" ondblclick="this.select();" /></td>';
    tLinkTableHTML += '  </tr>';
    tLinkTableHTML += '  <tr>';
    tLinkTableHTML += '    <td class="EditorTD1"><input type="button" value="' + EditorLang.tOK + '" class="EditorLinkButton" onclick="' + this.tName + '.tsetCommand(\'LinkS\', ' + this.tName + '.tEI(\'' + this.tid + '-EditorLinkText\').value);" />&nbsp;<input type="button" value="' + EditorLang.tCancel + '" class="EditorLinkButton" onclick="' + this.tName + '.tLoadMaskClose();" /></td>';
    tLinkTableHTML += '  </tr>';
    tLinkTableHTML += '</table>';
    this.tLoadMaskShow(tLinkTableHTML);
  },
  this.tLoadSmileyTable = function()
  {
    var tni = 0;
    var tRowNum = 6;
    var tSmileyTableHTML = '<table cellpadding="0" cellspacing="0" class="EditorSmileyTable">';
    tSmileyTableHTML += '  <tr>';
    tSmileyTableHTML += '    <td colspan="' + tRowNum + '">' + EditorLang.tSmileyImage + '</td>';
    tSmileyTableHTML += '  </tr>';
    tSmileyTableHTML += '  <tr>';
    for (var ti = 0; ti < this.tSmileyNum; ti ++)
    {
      tni += 1;
      tSmileyTableHTML +='    <td onmouseover="this.className=\'Selected\';" onmouseout="this.className=\'\';"><img src="' + this.tbaseURL + 'theme/' + this.tTheme + '/smiley/' + tni + '.gif" onclick="' + this.tName + '.tsetCommand(\'SmileyS\', this.src);" /></td>';
      if (tni % tRowNum == 0 && tni != this.tSmileyNum+1)
      {
        tSmileyTableHTML += '  </tr>';
        tSmileyTableHTML += '  <tr>';
      };
    };
    tSmileyTableHTML += '  </tr>';
    tSmileyTableHTML += '</table>';
    this.tLoadMaskShow(tSmileyTableHTML);
  };
  this.tLoadForeColorTable = function()
  {
    var tHTML = this.tGetUBB();
    var re = /\[color=([^\]]*)\]([^\[]*?)\[\/color\]/igm;
    re.exec(tHTML);
    var tColor = RegExp.$1

    var tRowNum = 8;
    var tColorAry = new Array();
    tColorAry[0]="#000000";tColorAry[1]="#993300";tColorAry[2]="#333300";tColorAry[3]="#003300";
    tColorAry[4]="#003366";tColorAry[5]="#000080";tColorAry[6]="#333399";tColorAry[7]="#333333";

    tColorAry[8]="#800000";tColorAry[9]="#FF6600";tColorAry[10]="#808000";tColorAry[11]="#008000";
    tColorAry[12]="#008080";tColorAry[13]="#0000FF";tColorAry[14]="#666699";tColorAry[15]="#808080";

    tColorAry[16]="#FF0000";tColorAry[17]="#FF9900";tColorAry[18]="#99CC00";tColorAry[19]="#339966";
    tColorAry[20]="#33CCCC";tColorAry[21]="#3366FF";tColorAry[22]="#800080";tColorAry[23]="#999999";

    tColorAry[24]="#FF00FF";tColorAry[25]="#FFCC00";tColorAry[26]="#FFFF00";tColorAry[27]="#00FF00";
    tColorAry[28]="#00FFFF";tColorAry[29]="#00CCFF";tColorAry[30]="#993366";tColorAry[31]="#CCCCCC";

    tColorAry[32]="#FF99CC";tColorAry[33]="#FFCC99";tColorAry[34]="#FFFF99";tColorAry[35]="#CCFFCC";
    tColorAry[36]="#CCFFFF";tColorAry[37]="#99CCFF";tColorAry[38]="#CC99FF";tColorAry[39]="#FFFFFF";

    var tColorTableHTML = '<table cellpadding="0" cellspacing="0" class="EditorColorTable">';
    tColorTableHTML += '  <tr>';
    tColorTableHTML += '    <td colspan="' + tRowNum + '">' + EditorLang.tColorPicker + '</td>';
    tColorTableHTML += '  </tr>';
    tColorTableHTML += '  <tr>';
    for (var ti = 0; ti < tColorAry.length; ti++)
    {
          tColorTableHTML +='    <td onmouseover="this.className=\'Selected\';" onmouseout="this.className=\'\';" onclick="' + this.tName + '.tsetCommand(\'TextColorS\', \'' + tColorAry[ti] + '\');"';
          if(tColor.toUpperCase() == tColorAry[ti])
             tColorTableHTML +=' class="Selected"';
          tColorTableHTML +='><div style="width:11px;height:11px;background-color:' + tColorAry[ti] + ';"></div></td>';
          if ((ti+1) % tRowNum == 0 && ti+1 != tColorAry.length)
          {
            tColorTableHTML += '  </tr>';
            tColorTableHTML += '  <tr>';
          };
    };
    tColorTableHTML += '  </tr>';
    tColorTableHTML += '</table>';
    this.tLoadMaskShow(tColorTableHTML);
  };
  this.tInit = function(_name, _baseURL)
  {
    this.tName = _name;
    this.tbaseURL = _baseURL;
    var tObj1 = this.tEI(this.tid);
    if (tObj1)
    {
      this.tcreateStyleSheet();
      this.tValue = tObj1.value;
      var tObj1Name = tObj1.name;
      var tObj1Width,tObj1Height;

      /*
       *判断元素是否隐藏，隐藏则获取不到offsetWidth和offsetHeight
       *modify by lx 2009.06.09
       */
      if(tObj1.offsetWidth==0 || tObj1.offsetHeight==0){
      	if(URLParams['Width']=="100%")
      	  tObj1Width = URLParams['Width'];
      	else
          tObj1Width = URLParams['Width'].substring(0,URLParams['Width'].indexOf("px"));
        tObj1Height = URLParams['Height'].substring(0,URLParams['Height'].indexOf("px"));
      }else{
      	tObj1Width = tObj1.offsetWidth-6;
        tObj1Height = tObj1.offsetHeight-8;
      }

      var tObj2 = tObj1.parentNode;
      var tDiv1 = document.createElement('div');
      tDiv1.setAttribute('id', this.tid + '-div');
      tDiv1.style.width = tObj1Width=="100%" ? tObj1Width : tObj1Width + 'px';
      tDiv1.style.height = tObj1Height + 'px';
      tDiv1.className = 'EditorDiv';
      tObj2.appendChild(tDiv1);
      tObj2.replaceChild(tDiv1, tObj1);
      
      var tInput1 = document.createElement('input');
      tInput1.name = tObj1Name;
      tInput1.id = tObj1Name;
      tInput1.type = 'hidden';
      tDiv1.appendChild(tInput1);
      this.tInputObject = tInput1;
      var tDiv2 = document.createElement('div');
      tDiv2.setAttribute('id', this.tid + '-divPanel');
      tDiv2.style.height = this.tPanelHeight + 'px';
      tDiv2.className = 'EditorDivPanel';
      tDiv1.appendChild(tDiv2);
      //this.tLoadToolbar(tDiv2);
      var tDiv3 = document.createElement('div');
      tDiv3.setAttribute('id', this.tid + '-divFactory');
      tDiv3.style.display = 'none';
      tDiv1.appendChild(tDiv3);
      var tTextarea1 = document.createElement('textarea');
      tTextarea1.setAttribute('id', this.tid + '-textarea');
      tTextarea1.style.width = tObj1Width=="100%"? tObj1Width:tObj1Width + 'px';
      tTextarea1.style.maxWidth = tObj1Width=="100%"? tObj1Width:tObj1Width + 'px';
      tTextarea1.style.height = (tObj1Height - this.tPanelHeight - 5) + 'px';
      tTextarea1.style.maxHeight = (tObj1Height - this.tPanelHeight - 5) + 'px';
      tTextarea1.style.display = 'none';
      tTextarea1.className = 'EditorTextarea';
      tDiv1.appendChild(tTextarea1);
      var tIframe1 = document.createElement('iframe');
      tIframe1.setAttribute('id', this.tid + '-iframe');
      tIframe1.setAttribute('frameBorder', '0');
      tIframe1.setAttribute('marginWidth', '3');
      tIframe1.setAttribute('marginHeight', '3');
      tIframe1.setAttribute('allowTransparency', 'true');
      tIframe1.style.width = '100%';
      tIframe1.style.height = (tObj1Height - this.tPanelHeight - 7) + 'px';
      tIframe1.className = 'EditorIframe';
      tDiv1.appendChild(tIframe1);
      var tObj3 = this.tFW(this.tid + '-iframe');
      if (this.tEditUBBMode == 1) this.tValue = this.tUBB2XHTML(this.tValue);
      var contentEditable = window.navigator.userAgent.indexOf("Firefox") > 0 ? '' : ' contentEditable="true"';
      var tObj3HTML = '<html><head><link href="' + this.tbaseURL + 'theme/' + this.tTheme + '/css/iframe.css" rel="stylesheet" type="text/css" /></head><body' + contentEditable + '>' + this.tValue + '</body></html>';
      tObj3.document.designMode = 'On';
      tObj3.document.open();
      tObj3.document.writeln(tObj3HTML);
      tObj3.document.close();
      this.tInstance = tObj3;
      var tObj3Object = new Object();
      tObj3Object.tObject = this;
      tObj3Object.tInstance = this.tInstance;
      this.tAttachEvent(tObj3, 'blur', this.tOnblur, tObj3Object);
      this.tAttachEvent(tObj3, 'keydown', this.tOnkeydown, tObj3Object);
      this.tAttachEvent(tObj3, 'load', this.tOnLoad, tObj3Object);
      this.tSetInputValue();
    };
  };
  this.tOnblur = function()
  {
    this.tObject.tSetInputValue();
  };
  this.tOnkeydown = function()
  {
    if (this.tObject.tEditState == 1)
    {
      var event = this.tInstance.window.event ? this.tInstance.window.event : this.tObject.tOnkeydown.caller.arguments[0];
      var keyCode = event.keyCode ? event.keyCode : event.which;
      if(event.ctrlKey && (keyCode == 10 || keyCode == 13))//Firefox 13, IE 10
      {
         this.tObject.tSetInputValue();
         eval(this.tObject.tCtrlEnter);
      }
      else if(typeof(window.external.OA_SMS) != 'undefined' && !event.ctrlKey && !event.shiftKey && (keyCode == 10 || keyCode == 13))
      {
         var sel = document.selection;
         if(sel)
         {
            var range = sel.createRange();
            if(range)
            {
               range.pasteHTML('<br />');
               range.select();
            }
         }
      }
    };
  };
  this.tOnLoad = function()
  {
    if(this.tObject.tStartFocus == "1")
    {
      this.tInstance.focus();
      this.tInstance.document.body.focus();
      //this.tInstance.document.body.setActive();
    }
  };
};
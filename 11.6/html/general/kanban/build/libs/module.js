var userAgent = navigator.userAgent.toLowerCase();
var is_opera = userAgent.indexOf('opera') != -1 && opera.version();
var is_moz = (navigator.product == 'Gecko') && userAgent.substr(userAgent.indexOf('firefox') + 8, 3);
var ua_match = /(trident)(?:.*rv:([\w.]+))?/.exec(userAgent) || /(msie) ([\w.]+)/.exec(userAgent);
var is_ie = ua_match && (ua_match[1] == 'trident' || ua_match[1] == 'msie') ? true : false;

function LoadDialogWindow(URL, parent, loc_x, loc_y, width, height)
{
  if(window.showModalDialog){
  //if(is_ie){
     window.showModalDialog(URL,parent,"edge:raised;scroll:1;status:0;help:0;resizable:1;dialogWidth:"+width+"px;dialogHeight:"+height+"px;dialogTop:"+loc_y+"px;dialogLeft:"+loc_x+"px",true);
  }else{
  	window.open(URL,"load_dialog_win","height="+height+",width="+width+",status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,top="+loc_y+",left="+loc_x+",resizable=yes,modal=yes,dependent=yes,dialog=yes,minimizable=no",true);
  }
}
function SelectUser(FUNC_ID,MODULE_ID,TO_ID, TO_NAME, MANAGE_FLAG,FORM_NAME,USE_UID,NOTLOGIN_FLAG)
{
  var w = 453, h = 350;
  URL="/module/user_select/?FUNC_ID="+FUNC_ID+"&MODULE_ID="+MODULE_ID+"&TO_ID="+TO_ID+"&TO_NAME="+TO_NAME+"&MANAGE_FLAG="+MANAGE_FLAG+"&FORM_NAME="+FORM_NAME+"&USE_UID="+USE_UID+"&NOTLOGIN_FLAG="+NOTLOGIN_FLAG;
  var loc_y = loc_x = 200;
  if(is_ie)
  {
      loc_x=document.body.scrollLeft+event.clientX-100;
      loc_y=document.body.scrollTop+event.clientY+170;
  }else{
      event =arguments.callee.caller.arguments[0];
      var tleft = event.screenX;   
      var ttop = event.screenY;
      
      if(tleft > w)
          tleft = tleft - w - 30;

      loc_x = tleft;   
      loc_y = ttop + 15;
  }
  LoadDialogWindow(URL,self,loc_x, loc_y, w, h);//这里设置了选人窗口的宽度和高度
}
function ClearUser(TO_ID, TO_NAME)
{
  if(TO_ID=="" || TO_ID=="undefined" || TO_ID== null)
  {
     TO_ID="TO_ID";
     TO_NAME="TO_NAME";
  }
  document.getElementsByName(TO_ID)[0].value="";
  document.getElementsByName(TO_NAME)[0].value="";
}

//工作流选择
function SelectPrcs(MODULE_ID,TO_ID, TO_NAME, MANAGE_FLAG,FORM_NAME)
{
  URL="/module/flow_prcs_select/?MODULE_ID="+MODULE_ID+"&TO_ID="+TO_ID+"&TO_NAME="+TO_NAME+"&MANAGE_FLAG="+MANAGE_FLAG+"&FORM_NAME="+FORM_NAME;
  loc_y=loc_x=200;
  if(is_ie)
  {
     loc_x=document.body.scrollLeft+event.clientX-400;
     loc_y=document.body.scrollTop+event.clientY+170;
  }
  window.open(URL,"flow_prcs_select","height=350,width=400,status=0,toolbar=no,menubar=no,location=no,scrollbars=no,top="+loc_y+",left="+loc_x+",resizable=yes");
}
function ClearPrcs(TO_ID, TO_NAME)
{
  if(TO_ID=="" || TO_ID=="undefined" || TO_ID== null)
  {
     TO_ID="TO_ID";
     TO_NAME="TO_NAME";
  }
  document.getElementsByName(TO_ID)[0].value="";
  document.getElementsByName(TO_NAME)[0].value="";
}
function SelectUserSingle(FUNC_ID,MODULE_ID,TO_ID, TO_NAME, MANAGE_FLAG, FORM_NAME,USE_UID,OUT_FLAG,NOTLOGIN_FLAG)
{
  URL="/module/user_select_single/?FUNC_ID="+FUNC_ID+"&MODULE_ID="+MODULE_ID+"&TO_ID="+TO_ID+"&TO_NAME="+TO_NAME+"&MANAGE_FLAG="+MANAGE_FLAG+"&FORM_NAME="+FORM_NAME+"&USE_UID="+USE_UID+"&OUT_FLAG="+OUT_FLAG;
  if(NOTLOGIN_FLAG)
  {
      URL += '&NOTLOGIN_FLAG='+NOTLOGIN_FLAG;
  }
  loc_y=loc_x=200;
  if(is_ie)
  {
     loc_x=document.body.scrollLeft+event.clientX-100;
     loc_y=document.body.scrollTop+event.clientY+170;
  }
  LoadDialogWindow(URL,self,loc_x, loc_y, 450, 350);
}
function SelectDept(MODULE_ID,TO_ID, TO_NAME, PRIV_OP,FORM_NAME)
{
  URL="/module/dept_select/?MODULE_ID="+MODULE_ID+"&TO_ID="+TO_ID+"&TO_NAME="+TO_NAME+"&PRIV_OP="+PRIV_OP+"&FORM_NAME="+FORM_NAME;
  loc_y=loc_x=200;
  if(is_ie)
  {
     loc_x=document.body.scrollLeft+event.clientX-100;
     loc_y=document.body.scrollTop+event.clientY+170;
  }
  LoadDialogWindow(URL,self,loc_x, loc_y, 400, 350);
}
function SelectDeptSingle(MODULE_ID,TO_ID, TO_NAME, PRIV_OP,FORM_NAME)
{
  URL="/module/dept_select_single/?MODULE_ID="+MODULE_ID+"&TO_ID="+TO_ID+"&TO_NAME="+TO_NAME+"&PRIV_OP="+PRIV_OP+"&FORM_NAME="+FORM_NAME;
  loc_y=loc_x=200;
  if(is_ie)
  {
     loc_x=document.body.scrollLeft+event.clientX-100;
     loc_y=document.body.scrollTop+event.clientY+170;
  }
  LoadDialogWindow(URL,self,loc_x, loc_y, 200, 350);
}

function SelectPriv(MODULE_ID,TO_ID, TO_NAME, PRIV_OP,FORM_NAME, FUNC_ID)
{
  URL="/module/priv_select/?MODULE_ID="+MODULE_ID+"&TO_ID="+TO_ID+"&TO_NAME="+TO_NAME+"&PRIV_OP="+PRIV_OP+"&FORM_NAME="+FORM_NAME+"&FUNC_ID="+FUNC_ID;
  loc_y=loc_x=200;
  if(is_ie)
  {
     loc_x=document.body.scrollLeft+event.clientX-100;
     loc_y=document.body.scrollTop+event.clientY+170;
  }
  LoadDialogWindow(URL,self,loc_x, loc_y, 400, 350);
}

function SelectPrivSingle(MODULE_ID,TO_ID, TO_NAME, PRIV_OP,FORM_NAME, FUNC_ID)
{
    URL="/module/priv_select_single/?MODULE_ID="+MODULE_ID+"&TO_ID="+TO_ID+"&TO_NAME="+TO_NAME+"&PRIV_OP="+PRIV_OP+"&FORM_NAME="+FORM_NAME+"&FUNC_ID="+FUNC_ID;
    loc_y=loc_x=200;
    if(is_ie)
    {
        loc_x=document.body.scrollLeft+event.clientX-100;
        loc_y=document.body.scrollTop+event.clientY+170;
    }
    LoadDialogWindow(URL,self,loc_x, loc_y, 400, 350);
}

function SelectOrg(MODULE_ID,TO_ID, TO_NAME, PRIV_OP,FORM_NAME, SINGLE_SELECT)
{
    URL="/module/org_select/?MODULE_ID="+MODULE_ID+"&TO_ID="+TO_ID+"&TO_NAME="+TO_NAME+"&PRIV_OP="+PRIV_OP+"&FORM_NAME="+FORM_NAME+"&SINGLE_SELECT="+SINGLE_SELECT;
    loc_y=loc_x=200;
    if(is_ie)
    {
        loc_x=document.body.scrollLeft+event.clientX-100;
        loc_y=document.body.scrollTop+event.clientY+170;
    }
    LoadDialogWindow(URL,self,loc_x, loc_y, 250, 350);
}

function SelectMytable(TO_ID, TO_NAME, POS)
{
  URL="/module/mytable/?TO_ID="+TO_ID+"&TO_NAME="+TO_NAME+"&POS="+POS;
  loc_y=loc_x=200;
  if(is_ie)
  {
     loc_x=document.body.scrollLeft+event.clientX-100;
     loc_y=document.body.scrollTop+event.clientY+170;
  }
  LoadDialogWindow(URL,self,loc_x, loc_y, 500, 350);
}
function SelectPortal(TO_ID, TO_NAME)
{
  URL="/module/portal/?TO_ID="+TO_ID+"&TO_NAME="+TO_NAME;
  loc_x=500;
  loc_y=100;
  if(is_ie)
  {
     loc_x=document.body.scrollLeft+event.clientX+250;
     loc_y=document.body.scrollTop+event.clientY+80;
  }
  LoadDialogWindow(URL,self,loc_x, loc_y, 100, 350);
}
function SelectShortcut(TO_ID, TO_NAME)
{
  URL="/module/shortcut/?TO_ID="+TO_ID+"&TO_NAME="+TO_NAME;
  loc_y=loc_x=200;
  if(is_ie)
  {
     loc_x=document.body.scrollLeft+event.clientX-100;
     loc_y=document.body.scrollTop+event.clientY+170;
  }
  LoadDialogWindow(URL,self,loc_x, loc_y, 500, 350);
}
function td_calendar(fieldname)
{
  var URL="/inc/calendar.php?FIELDNAME="+fieldname;
  loc_y=loc_x=200;
  if(is_ie)
  {
    loc_x=document.body.scrollLeft+event.clientX-event.offsetX-80;
    loc_y=document.body.scrollTop+event.clientY-event.offsetY+140;
  }
  LoadDialogWindow(URL,self,loc_x, loc_y, 300, 230);
}
function td_clock(fieldname)
{
  var URL="/inc/clock.php?FIELDNAME="+fieldname;
  loc_y=loc_x=200;
  if(is_ie)
  {
    loc_x=document.body.scrollLeft+event.clientX-event.offsetX-80;
    loc_y=document.body.scrollTop+event.clientY-event.offsetY+140;
  }
  LoadDialogWindow(URL,self,loc_x, loc_y, 280, 120);
}
function SelectAddr(FIELD, TO_ID, FORM_NAME)
{
  URL="/module/addr_select/?FIELD="+FIELD+"&TO_ID="+TO_ID+"&FORM_NAME="+FORM_NAME;
  loc_y=loc_x=200;
  if(is_ie)
  {
     loc_x=document.body.scrollLeft+event.clientX-event.offsetX-100;
     loc_y=document.body.scrollTop+event.clientY-event.offsetY+170;
  }
  LoadDialogWindow(URL,self,loc_x, loc_y, 600, 350);//这里设置了选人窗口的宽度和高度
}
function ClearAddr(TO_ID)
{
  if(TO_ID=="" || TO_ID=="undefined" || TO_ID== null)
     return;
  document.getElementsByName(TO_ID)[0].value="";
}

function AddFav(FAV_DESC, FAV_URL, OPEN_WINDOW)
{
   URL="/module/fav/?URL_DESC="+encodeURIComponent(FAV_DESC)+"&URL="+encodeURIComponent(FAV_URL)+"&OPEN_WINDOW="+OPEN_WINDOW;
   loc_y=loc_x=200;
   if(is_ie)
   {
      loc_x=(window.screen.availWidth-400)/2;
      loc_y=(window.screen.availHeight-130)/2-100;
   }
   window.open(URL,"fav","height=220,width=600,status=0,toolbar=no,menubar=no,location=no,scrollbars=no,top="+loc_y+",left="+loc_x+",resizable=yes");
}

function LoadForeColorTable(ClickFunc)
{
   var tColor = "";
  var tRowNum = 8;
  var tColorAry = new Array();
  tColorAry[0]="#000000";tColorAry[1]="#993300";tColorAry[2]="#333300";tColorAry[3]="#003300";
  tColorAry[4]="#003366";tColorAry[5]="#000080";tColorAry[6]="#333399";tColorAry[7]="#333333";

  tColorAry[8]="#800000";tColorAry[9]="#FF6600";tColorAry[10]="#808000";tColorAry[11]="#008000";
  tColorAry[12]="#008080";tColorAry[13]="#0e86fe";tColorAry[14]="#666699";tColorAry[15]="#808080";

  tColorAry[16]="#0066CC";tColorAry[17]="#FF9900";tColorAry[18]="#99CC00";tColorAry[19]="#339966";
  tColorAry[20]="#33CCCC";tColorAry[21]="#3366FF";tColorAry[22]="#800080";tColorAry[23]="#999999";

  tColorAry[24]="#FF00FF";tColorAry[25]="#FFCC00";tColorAry[26]="#FFFF00";tColorAry[27]="#00FF00";
  tColorAry[28]="#00FFFF";tColorAry[29]="#00CCFF";tColorAry[30]="#993366";tColorAry[31]="#CCCCCC";

  tColorAry[32]="#FF99CC";tColorAry[33]="#FFCC99";tColorAry[34]="#FFFF99";tColorAry[35]="#CCFFCC";
  tColorAry[36]="#CCFFFF";tColorAry[37]="#99CCFF";tColorAry[38]="#CC99FF";tColorAry[39]="#FFFFFF";

  var tColorTableHTML = '<table cellpadding="0" cellspacing="0" class="ColorTable">';
  tColorTableHTML += '  <tr>';
  for (var ti = 0; ti < tColorAry.length; ti++)
  {
        tColorTableHTML +='    <td onmouseover="this.className=\'Selected\';" onmouseout="this.className=\'\';" onclick="' + ClickFunc + '(\'' + tColorAry[ti] + '\');"';
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
 
  return tColorTableHTML;
}
function LoadForeColorTable_notify(ClickFunc)
{
  var tColor = "";
  var tRowNum = 6;
  var tColorAry = new Array();
  tColorAry[0]="#000000";tColorAry[1]="#78b800";tColorAry[2]="#0159df";tColorAry[3]="#630098";
  tColorAry[4]="#e5ad00";tColorAry[5]="#f00001";

  var tColorTableHTML = '<table cellpadding="0" cellspacing="0" class="ColorTable">';
  tColorTableHTML += '  <tr>';
  for (var ti = 0; ti < tColorAry.length; ti++)
  {
        tColorTableHTML +='    <td onmouseover="this.className=\'Selected\';" onmouseout="this.className=\'\';" onclick="' + ClickFunc + '(\'' + tColorAry[ti] + '\');"';
        if(tColor.toUpperCase() == tColorAry[ti])
           tColorTableHTML +=' class="Selected"';
        tColorTableHTML +='><div style="width:15px;height:19px;background-color:' + tColorAry[ti] + ';"></div></td>';
        if ((ti+1) % tRowNum == 0 && ti+1 != tColorAry.length)
        {
          tColorTableHTML += '  </tr>';
          tColorTableHTML += '  <tr>';
        };
  }; 
  tColorTableHTML += '  </tr>';
  tColorTableHTML += '</table>';
 
  return tColorTableHTML;
}
function SelectUserExternal(MODULE_ID, TO_ID, TO_NAME, MANAGE_FLAG, FORM_NAME)
{
  URL="/module/user_external_select/?MODULE_ID="+MODULE_ID+
                                    "&TO_ID="+TO_ID+
                                    "&TO_NAME="+TO_NAME+
                                    "&MANAGE_FLAG="+MANAGE_FLAG+
                                    "&FORM_NAME="+FORM_NAME;
  loc_y=loc_x=200;
  if(is_ie)
  {
     loc_x=document.body.scrollLeft+event.clientX+60;
     loc_y=document.body.scrollTop+event.clientY+170;
  }
  //window.open(URL);
  LoadDialogWindow(URL,self,loc_x, loc_y, 220, 350);//这里设置了选人窗口的宽度和高度
}
function SelectTable(TO_ID, DB_NAME, FORM_NAME)
{
  URL="/module/table_select/?TO_ID="+TO_ID+"&DB_NAME="+DB_NAME+"&FORM_NAME="+FORM_NAME;
  loc_y=loc_x=200;
  if(is_ie)
  {
     loc_x=document.body.scrollLeft+event.clientX-100;
     loc_y=document.body.scrollTop+event.clientY;
  }
  LoadDialogWindow(URL,self,loc_x, loc_y, 600, 450);
}
function ClearTable(TO_ID)
{
  if(TO_ID=="" || TO_ID=="undefined" || TO_ID== null)
  {
     TO_ID="TABLES";
  }
  document.getElementsByName(TO_ID)[0].value="";
}
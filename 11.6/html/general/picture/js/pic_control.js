var TmpFileNameStr="";
var temp_sub_dir="";
function file_name_add(TmpFileName,ob_id)
{
	if(document.getElementById(ob_id).checked ==true)
	{
	   TmpFileNameStr += TmpFileName+"@~@";
	   if(ob_id.indexOf("CHECK_ID")!=-1)
	   {
	      var temp_id=ob_id.split("_");
        temp_temp="id_url_"+temp_id[0];
        temp_temp=document.getElementById(temp_temp).innerHTML;
        temp_sub_dir=temp_temp.slice(1);
     }
	}
	else
	{
  	 TmpFileNameStr = TmpFileNameStr.replace(TmpFileName+"@~@","");
  	 temp_sub_dir="";
     
  }
  
}
function file_name_clear()
{
	TmpFileNameStr="";
}
//删除
function picdelete(PIC_ID,SUB_DIR,PIC_PATH,LOCATION){
  if(TmpFileNameStr!="")
  {
     msg=td_lang.general.msg_6;//"确定要删除选中文件吗?"
     if(window.confirm(msg))
     {
       URL="picdelete.php?DelFileNameStr="+encodeURIComponent(TmpFileNameStr)+"&PIC_ID="+PIC_ID+"&PIC_PATH="+PIC_PATH+"&LOCATION="+LOCATION+"&SUB_DIR="+SUB_DIR;
       window.location=URL;
     }
  }else{
  	alert(td_lang.general.msg_7);//"请至少选择一张图片"
  }
}

//下载
function do_action(SUB_DIR,PIC_PATH)
{
  if(TmpFileNameStr!="")
  {
  	 URL="batch_down.php?TmpFileNameStr="+encodeURIComponent(TmpFileNameStr)+"&SUB_DIR="+SUB_DIR+"&PIC_PATH="+PIC_PATH;
     window.location=URL;
  }
  else
  {	  
  	alert(td_lang.general.msg_7);//"请至少选择一张图片"
  }
}
//重命名
function do_rename(SUB_DIR,PIC_PATH)
{
	 var count=0;
	 var oo = document.getElementsByTagName("input");
	 var PIC_NAME="";        
   for(var i=0;i< oo.length;i++)
      if((oo[i].name !='allbox') && (oo[i].type == 'checkbox') && oo[i].checked)
      {
      	 PIC_NAME=oo[i].title;
         count++;
      }  

   if(count == 0)
   {
      alert(td_lang.general.msg_7);//"请至少选择一个图片"
      return;
   }
   if(count>1 )
   {
      alert(td_lang.general.msg_8);//"只能选择一个图片，重命名"
      return;
   }

   loc_x=(screen.availWidth-300)/2;
   loc_y=(screen.availHeight-300)/2;
   if(temp_sub_dir=="")
     URL = "rename_action.php?SUB_DIR="+SUB_DIR+"&PIC_PATH="+PIC_PATH+"&PIC_NAME="+encodeURIComponent(PIC_NAME);
   else
   	 URL = "rename_action.php?SUB_DIR="+temp_sub_dir+"&PIC_PATH="+PIC_PATH+"&PIC_NAME="+encodeURIComponent(PIC_NAME);
   window.open(URL,"picture","height=230,width=380,status=1,toolbar=no,menubar=no,location=no,scrollbars=yes,top="+loc_y+",left="+loc_x+",resizable=yes",'alwaysRaised=true');
	 window.focus();
}

//显示或隐藏树
function hide_tree()
{
	parent.test.cols = parent.test.cols=="0,*"?"200,*":"0,*";
	var temp = document.getElementById("tree_img")
	if(parent.test.cols=="200,*")
	{
	  temp.className='scroll-left';
	  temp.title=td_lang.general.msg_9;//"隐藏目录树"
	}
	else 
	{
		temp.className='scroll-right';
		temp.title=td_lang.general.msg_10;//"显示目录树"
	}
}

//复制
function pic_paste(filename,pic_action,pic_id,sub_dir,pic_path,pic_dir)
{
	  if(TmpFileNameStr=="")
	    alert(td_lang.general.msg_7);//"请至少选择一张图片"
	  else
	  {
	       document.cookie = "pic_id="+pic_id;
         document.cookie = "pic_dir="+escape(pic_dir);
         document.cookie = "pic_sub_dir="+escape(sub_dir);
         document.cookie = "pic_path="+escape(pic_path);
         document.cookie = "pic_filename="+escape(TmpFileNameStr);
         document.cookie = "pic_action="+pic_action;
         
         alert(td_lang.general.msg_25+"\n"+td_lang.general.msg_26);//"选择的文件已标记\n请到目标目录中进行“粘贴”操作"
         if(TmpFileNameStr.indexOf("|")==-1)
            document.getElementById("paste_file").style.display='';
    }
}


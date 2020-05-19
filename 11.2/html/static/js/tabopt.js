//关闭tab，提示 是否保存，只针对有文本域的tab
function confirmSaveBeforeCloseTab(type, text_area_id, confirm_msg)
{
	if(window.top.bTabStyle)
	{
		if(confirm_msg == "")
		{
			confirm_msg="内容没有保存，确定不保存退出吗？";
		}
		if(type == "draf_mail")
		{
			window.parent.onclose = function(){
				if(checkEditorDirty('CONTENT'))
				{
					return window.confirm(confirm_msg);
				}
				return true;
			}
		}
		else
		{
			window.onclose = function()
			{
				if(checkEditorDirty('CONTENT'))
				{
					return window.confirm(confirm_msg);
				}
				return true;
			}
		}
	}
/*	
	if(type == "notify_modify")
	{
		window.onbeforeunload =function () {
			if(checkEditorDirty('CONTENT'))
			{
				return confirm_msg;
			}
			else
			{
				return FALSE;
			}
		}
	}
*/
}



    
//�ر�tab����ʾ �Ƿ񱣴棬ֻ������ı����tab
function confirmSaveBeforeCloseTab(type, text_area_id, confirm_msg)
{
	if(window.top.bTabStyle)
	{
		if(confirm_msg == "")
		{
			confirm_msg="����û�б��棬ȷ���������˳���";
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



    
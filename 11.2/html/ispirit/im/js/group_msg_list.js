var msgs = [];
/**
 * �ṩ���������,ˢ������Ϣ�ĺ���
 */
function refreshMsg() {
	jQuery.ajax({
		url: "group_msg_list_serve.php",
		data:  {
			MSG_GROUP_ID: msgGroupId,
			t: new Date().getTime()
		},
		dataType: "text",
		success: function(text) {
			var json = parseJson(text);
			if (json.msg) {
				   json.msg.sort(function(l, r) {
					return (l && l.msgId || 0) - (r && r.msgId || 0);
				});
				
				for(var i=0; i<json.msg.length; i++)
				{
				   var msg = json.msg[i];
				   if (msg && jQuery.inArray(msg.msgId, msgs) < 0)
				   {
						msgs.push(msg.msgId);
						appendMsg(msg.userName, msg.time, msg.content);
					}
				}
			}
		}
	});
}

jQuery(function() {
	refreshMsg();
});

function parseJson(text) {
	try {
		return eval("(" + text+ ")");
	} catch (e) {
		return {};
	} finally {
	}
}

/**
 * ������Ϣ�ķ���
 */
function appendMsg(user, time, content) {
	var ctn = jQuery("<div></div>");
	var ut = jQuery("<div class='user_time'></div>")
	var ct = jQuery("<div></div>");
	ct.html(content);
	ut.append("<span>" + user + "</span>&nbsp;&nbsp;<span>" + time + "</span>");
	ctn.append(ut).append(ct);
	jQuery("#container").append(ctn);
	window.scrollTo(0, document.body.scrollHeight);
}
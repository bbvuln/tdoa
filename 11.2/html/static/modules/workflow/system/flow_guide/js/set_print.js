function _post(url, args, fn, sync)
{
   sync=isUndefined(sync)?true:sync;
   var req = new_req();
	try{
	   req.open('POST', url,sync);
	}
	catch(ex){
	   alert(ex.description);
	   return;
	}
	req.setRequestHeader("Method", "POST " + url + " HTTP/1.1");
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	req.onreadystatechange = function() {
			if (req.readyState == 4){
				var s;
				try {s = req.status;}catch (ex) {
						alert(ex.description);
				}
				if (s == 200)fn(req);
			}
	}
	req.send(args);
}
function isUndefined(variable) {
	return typeof variable == 'undefined' ? true : false;
}
function new_req() {
	if (window.XMLHttpRequest) return new XMLHttpRequest;
	else if (window.ActiveXObject) {
		var req;
		try { req = new ActiveXObject("Msxml2.XMLHTTP"); }
		catch (e) { try { req = new ActiveXObject("Microsoft.XMLHTTP"); }
		catch (e) { return null; }}
		return req;
	} else return null;
}
var $ = function(id) {return document.getElementById(id);};
var userAgent = navigator.userAgent.toLowerCase();
var is_opera = userAgent.indexOf('opera') != -1 && opera.version();
var is_moz = (navigator.product == 'Gecko') && userAgent.substr(userAgent.indexOf('firefox') + 8, 3);
var is_ie = (userAgent.indexOf('msie') != -1 && !is_opera) && userAgent.substr(userAgent.indexOf('msie') + 5, 3);
var imageType = "gif,jpg,jpeg,png,bmp,iff,jp2,jpx,jb2,jpc,xbm,wbmp";
function isUndefined(variable) {
	return typeof variable == 'undefined' ? true : false;
}


//products pages,tab

function prepareshow() {
	if(!document.getElementById("description_head")) return false;
	var description_head = document.getElementById("description_head");
	var description_links = description_head.getElementsByTagName("a");
	for(var i=0; i<description_links.length; i++) {
		var sectionId = description_links[i].getAttribute("href").split("#")[1];
		description_links[i].ment = sectionId;
		description_links[i].onclick = function() {
			showtab(this.ment);
			getheight();
			for(var j=0; j<description_links.length; j++) {
				description_links[j].className = '';
			}
			this.className = 'here';
			return false;
		}
		description_links[i].onmouseover = function() {
			for(var j=0; j<description_links.length; j++) {
				description_links[j].className = '';
			}
			this.className = 'here';
		}
		description_links[i].onmouseout = function() {
			for(var j=0; j<description_links.length; j++) {
				description_links[j].className = '';
			}
			var description_content = document.getElementById("description_content");
			var divs = description_content.getElementsByTagName("div");
			for( var d=0; d<divs.length; d++) {
				if(divs[d].style.display == "block") {
					var theid = divs[d].getAttribute("id");
					for(var k=0; k<description_links.length; k++) {
						description_links[k].className = "";
						if(description_links[k].href.indexOf(theid) != -1) description_links[k].className = 'here';
					}
				}
			}
		}
			
	}
}

function showtab(id) {
	var description_content = document.getElementById("description_content");
	var divs = description_content.getElementsByTagName("div");
	for( var i=0; i<divs.length; i++) {
		divs[i].style.display = "none";
		if (divs[i].getAttribute("id") != id) {			
			divs[i].style.display = "none";
		} 
		else {
			divs[i].style.display = "block";
		}
	}
}

function showfirst() {
	if(!document.getElementById("description_content")) return false;
	var description_content = document.getElementById("description_content"); 
	if(!document.getElementById("description_head")) return false;
	var description_head = document.getElementById("description_head");
	var description_links = description_head.getElementsByTagName("a");
	for(var i=0; i<description_links.length; i++) {
		var sectionId = description_links[i].getAttribute("href").split("#")[1];
		description_links[i].ment = sectionId;
		var divs = description_content.getElementsByTagName("div");
		var now_href = window.location.href;
		if(now_href.indexOf(sectionId) != -1) {
			divs[0].style.display = 'none';
			document.getElementById(sectionId).style.display = 'block';
		} else {
			var divs = description_content.getElementsByTagName("div");
			divs[0].style.display = 'block';
		}
		if(now_href.indexOf(description_links[i].getAttribute("href")) != -1) {
			for(var j=0; j<description_links.length; j++) {
				description_links[j].className = '';
			}
			description_links[i].className = "here";
		}
	}
	getheight();
}

addLoadEvent(showfirst);
addLoadEvent(prepareshow);

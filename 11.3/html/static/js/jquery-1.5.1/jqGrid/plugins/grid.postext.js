/**
 * jqGrid extension
 * Paul Tiseo ptiseo@wasteconsultants.com
 * 
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
**/ 
;(function($){$.jgrid.extend({getPostData:function(){var a=this[0];if(!a.grid){return}return a.p.postData},setPostData:function(a){var b=this[0];if(!b.grid){return}if(typeof(a)==='object'){b.p.postData=a}else{alert("Error: cannot add a non-object postData value. postData unchanged.")}},appendPostData:function(a){var b=this[0];if(!b.grid){return}if(typeof(a)==='object'){$.extend(b.p.postData,a)}else{alert("Error: cannot append a non-object postData value. postData unchanged.")}},setPostDataItem:function(a,b){var c=this[0];if(!c.grid){return}c.p.postData[a]=b},getPostDataItem:function(a){var b=this[0];if(!b.grid){return}return b.p.postData[a]},removePostDataItem:function(a){var b=this[0];if(!b.grid){return}delete b.p.postData[a]},getUserData:function(){var a=this[0];if(!a.grid){return}return a.p.userData},getUserDataItem:function(a){var b=this[0];if(!b.grid){return}return b.p.userData[a]}})})(jQuery);
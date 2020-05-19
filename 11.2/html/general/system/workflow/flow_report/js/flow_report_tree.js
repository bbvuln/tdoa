var xtree = new Tree("tree","getTreeList.php", '/static/modules/workflow/system/images/');
xtree.BuildTree();
(function($){
	setTreeListHeight = function(){
		var h = parent.document.documentElement.clientHeight || parent.document.body.clientHeight;
		h = Math.min(h-$("#wrapperTitle").height()-70,600);
		jQuery("#bottom_info",parent.document).css("height",(h)+"px");
		jQuery("#menu_left",parent.document).height(h);
	};
	$(document).ready(function(){
		setTreeListHeight();
		$(window).resize(function(){
			setTreeListHeight();
		});
		if($.browser.msie && $.browser.version =="9.0"){
			$("#treeContent").css("overFlow","scroll");
		}
	});
})(jQuery);
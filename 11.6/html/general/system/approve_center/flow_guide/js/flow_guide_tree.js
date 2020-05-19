var xtree = new Tree("tree","getTreeList.php", '/static/modules/workflow/system/images/');
xtree.BuildTree();
(function($){
	$(document).ready(function(){
		$(this).bind("keydown",function(e){if(e.keyCode==13){return false;}});
		/*if($.browser.msie && $.browser.version =="9.0"){
			$("#treeContent").css("overFlow","scroll");
		}*/
		$("#kword").click(function(){
			if($(this).val() == td_lang.general.workflow.msg_141){
				$(this).val("");
			}else {
				$(this).select();
			}
		});
		$("#kword").blur(function(){
			if($(this).val() == ""){
				$(this).val(td_lang.general.workflow.msg_141);
			}
		});
		$("#kword").bind("keyup",function(){
			if($("#kword").val() == "" || $("#kword").val() == td_lang.general.workflow.msg_141){
				$('#treesearch').remove();
				$("#tree").show();
				xtree.reload();			
			} else {
				$("#tree").hide();
				if($('#treesearch').length>0){
					$('#treesearch').remove();
				}
				$("#treeContent").append('<div id="treesearch" ></div>'); 
				var url = "getSearch.php?KWORD="+$(this).val();
				var xtreeSearch = new Tree("treesearch",url, '/static/modules/workflow/system/images/');
				xtreeSearch.BuildTree();
			}
			return false;  		
		});
	});
})(jQuery);
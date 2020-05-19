function openTree(pathString){
	if(pathString == ""){
		return false;
	}
	xtree1.tree.reload();
	setTimeout(function(){
		xtree1.tree.loadKeyPath(pathString, function(node, status){
			if(status == "loaded") {
				node.expand();
			}else if(status == "ok") {
				node.activate();
			}
		});
	}, 1000);
	
}
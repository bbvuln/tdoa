$(document).ready(function(){
	
	$('.inputnextandre .delete').click(function(){
		
		var elem = $(this).closest('.inputnextandre');
		// Download by http://www.codefans.net
		$.confirm({
			'title'		: '退出新建任务导航',
			'message'	: '您是否要保存',
			'buttons'	: {
				'Yes'	: {
					'class'	: 'blue',
					'action': function(){
					location.href = 'http://www.baidu.com'
						}
				},
				'No'	: {
					'class'	: 'gray',
					'action': function(){
						location.href = './'
						}	// Nothing to do in this case. You can as well omit the action property.
				}
			}
		});
		
	});
	
});
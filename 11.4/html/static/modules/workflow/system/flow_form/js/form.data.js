(function($){
    $(document).ready(function (){
    	var FORM_ID = $("#FORM_ID").val();
		$.ajax({
			url: "form_data.php",
			data: "form_id="+FORM_ID,
			type: "POST",
			async: true,
			success: function(data){
				var jsonData = $.parseJSON(data);
				alert(data);
				
			},
			error: function(data){
				alert(data.responseText);
			}
		});
	});
})(jQuery);
	
	
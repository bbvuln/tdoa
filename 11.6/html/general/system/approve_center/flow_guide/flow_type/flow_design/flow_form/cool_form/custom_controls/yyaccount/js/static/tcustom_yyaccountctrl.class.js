define('TCUSTOM_YYACCOUNTCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('base');
    var TCUSTOM_YYACCOUNTCtrl = Base.extend({
        initialize: function(config) {
        	var self = this;
        	self.config = config;
            TCUSTOM_YYACCOUNTCtrl.superclass.initialize.call(this, config);
            this.$obj = $('img[name="'+config.id+'"]').eq(0);
            this.$addObj = $('#yyAccount_add_btn_'+config.item_id);
            this.$addObj.click(function(){
            	var addNum = $('#yyAccount_add_btn_num_'+config.item_id).val();
            	for(var i=0;i<addNum;i++){
            		self.addAccountRow(config);
            	}
            });
            this.$delObj = $('#yyAccount_del_btn_'+config.item_id);
            this.$delObj.click(function(){
            	self.delAccountRow(config);
            });
            $("img[type='yyAccountImage']").live('click',function(){
            	var $table = $("#yyaccount_"+config.id);
            	var nameArr = $(this).attr('name').split('_');
            	if(nameArr.length != 4){
            		return false;
            	}
            	var imgCount = nameArr[3];
            	if($table.length == 1){
            		var URL = "/module/workflow/flow_form/cool_form/custom_controls/yyaccount/datalist/index.php?count="+imgCount+"&datasrc="+$table.attr("datasrc")+"&data_control="+$table.attr("data_control")+"&field="+config.id;
            	    var width = 320;
            	    var height = 400;
            	    var loc_x = ($(window.top).width() - width)/2;
            	    var loc_y = ($(window.top).height() - height)/2;
            	    
            	    if(typeof(window.showModalDialog) != 'undefined')
            	       window.showModalDialog(URL,window,"edge:raised;scroll:1;status:0;help:0;resizable:1;dialogWidth:"+width+"px;dialogHeight:"+height+"px;dialogTop:"+loc_y+"px;dialogLeft:"+loc_x+"px",true);
            	    else
            	       window.open(URL, "SelectDateSrcExt", ("height="+height+",width="+width+",status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,top="+loc_y+",left="+loc_x+",resizable=yes,modal=yes,dependent=yes,dialog=yes,minimizable=no"), true);
            	}
            });
            $("img[type='yyAccountNumIma']").live('click',function(){
            	var $table = $("#yyaccount_"+config.id);
            		var URL = "/module/workflow/flow_form/cool_form/custom_controls/yyaccount/datalist/top_index.php?datasrc="+$table.attr("datasrc")+"&data_control="+$table.attr("data_control")+"&field="+config.id;
            	    var width = 320;
            	    var height = 400;
            	    var loc_x = ($(window.top).width() - width)/2;
            	    var loc_y = ($(window.top).height() - height)/2;
            	    
            	    if(typeof(window.showModalDialog) != 'undefined')
            	       window.showModalDialog(URL,window,"edge:raised;scroll:1;status:0;help:0;resizable:1;dialogWidth:"+width+"px;dialogHeight:"+height+"px;dialogTop:"+loc_y+"px;dialogLeft:"+loc_x+"px",true);
            	    else
            	       window.open(URL, "SelectDateSrcExt", ("height="+height+",width="+width+",status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,top="+loc_y+",left="+loc_x+",resizable=yes,modal=yes,dependent=yes,dialog=yes,minimizable=no"), true);
            	
            });
            
        	/*$("input[name^='date_']").live('focus',function(){
        		 var item_id=$(this).attr('id').substring();
        		 var lv_item_id=(item_id.substring(item_id.indexOf('_')+1,item_id.lastIndexOf('_')));
                 var date=$(this).val();
                 var Y = date.substring(0,4);
                 var M = date.substring(5,7);
                 var Y_M=Y+'ÄêµÚ'+M+'ÆÚ';
                 $("div[id='yyAccount_"+lv_item_id+"_infoyear']").html(Y);
                 $("div[id='yyAccount_"+lv_item_id+"_infomonth']").html(M);           
        	});*/
        },
        onSubmit:function(){
			var self = this;
			if(self.config){
				var result = this.yyAccountCheck(self.config);
				if(!result){
					return result; 
				}
			}
		},
        addAccountRow:function(config){
        	var $copyTr = $('#yyaccount_template_'+config.item_id).clone();
        	var lastRow = $("tr[type='yyAccount'][dataParent='"+config.id+"']:last");
        	if(lastRow.length > 0){
        		var rowCount = lastRow.attr('rowCount');
        	}else{
        		var rowCount = 0;
        	}
    		var newNum = parseInt(rowCount)+1;
    		var newTrHtml = $copyTr.html().replace(/#yyNum#/g, newNum);
    		var newTrOuterHtml = "<tr style=\"height:25px;\" type='yyAccount' dataParent='"+config.id+"'rowCount='"+newNum+"'>"+newTrHtml+"</tr>";
    		$(newTrOuterHtml).insertBefore($('#yyaccount_'+config.id).find("tr[type='opRow']"));
        },
        delAccountRow:function(config){
        	var $lastRow = $("tr[type='yyAccount'][dataParent='"+config.id+"']:last");
        	if($lastRow.length > 0){
        		$lastRow.remove();
        	}else{
        		return false;
        	}
        },
        yyAccountCheck:function(config){
	    	var boole='';
	    	var money=0;
	    	var je=0;
	    	if(boole==''){
				$("input[name^='yyaccountID_']").each(function(){
				if($(this).val()==""){
					    boole='false';
						alert(td_lang.general.workflow.msg_304);
						return false;
					}
			    });
			}
	    	if(boole==''){
				$("input[name^='yyaccountDATE_']").each(function(){
				if($(this).val()==""){
					    boole='false';
						alert(td_lang.general.workflow.msg_305);
						return false;
					}
			    });
			}
	    	if(boole==''){
				$("input[name^='yyaccountDATE2_']").each(function(){
				if($(this).val()==""){
					    boole='false';
						alert(td_lang.general.workflow.msg_306);
						return false;
					}
			    });
			}
			
			if(boole==''){
				$("input[id^='yyAccount_zy_'][id!='yyAccount_zy_"+config.item_id+"_#yyNum#']").each(function(){
				if($(this).val()==""){
					    boole='false';
						alert(td_lang.general.workflow.msg_313);
						return false;
					}
			   });
			}
	    	if(boole==''){
	    	$("input[name^='yyAccount_km_show_'][id!='yyAccount_km_"+config.item_id+"_show_#yyNum#']").each(function(){
	    		
	    	
				if($(this).val()==""){
				    boole='false';
					alert(td_lang.general.workflow.msg_295);
					return false;
				}
			});
			}
			if(boole==''){
				$("select[id^='yyAccount_jd_'][id!='yyAccount_jd_"+config.item_id+"_#yyNum#']").each(function(){
				if($(this).val()==""){
					    boole='false';
						alert(td_lang.general.workflow.msg_296);
						return false;
					}
			   });
			}
			if(boole==''){
				$("input[id^='yyAccount_je_'][id!='yyAccount_je_"+config.item_id+"_#yyNum#']").each(function(){
					if($(this).val()==""){
					    boole='false';
						alert(td_lang.general.workflow.msg_297);
						return false;
					}
					var isnum=isNaN($(this).val());
					if(isnum==true){
				    	boole='false';
						alert(td_lang.general.workflow.msg_307);
						return false;
				    }
			    });
			}
	    	
			if(boole==''){			
				var $kdaccountTables = $("table[id^='yyaccount_']");
				$kdaccountTables.each(function(){
					var $kdaccountTableUnit = this;
					var $tr = $(this).find("tr[type=yyAccount]");
					$tr.each(function(i){
						var j=i+1;
							jd=$(this).find("select[id=yyAccount_jd_"+config.item_id+"_"+j+"]").val();
							je=parseInt($(this).find("input[id=yyAccount_je_"+config.item_id+"_"+j+"]").val());
							if(jd==0){
						        money=money-je;
					        }else{
					        	money=money+je;
					        }
					 });
					 if(money!=0){
						boole='false';
					 	alert(td_lang.general.workflow.msg_298);
					 	return false;
					 }
				});	
			}
			if(boole==''){
				this.detailYYAccountFields(config);
			}else{
				return false;
			}
			return true;
	    },
	    detailYYAccountFields:function (config){
			var $yyaccountTables = $("table[id^='yyaccount_']");
			$yyaccountTables.each(function(i){
				var $Fields='';
				var $yyaccountTableUnit = this;
				var $id=$(this).attr("id");
				var str = $id.split("_") ;
				var name = str[1].toString() + "_" + str[2].toString();
				var $tr = $(this).find("tr[type=yyAccount]");
				$Fields=$(this).find("td[id=yyaccount_name_"+config.item_id+"]").html()+"#YYA;#"
				       +$(this).find("input[id=yyaccount_sign_"+config.item_id+"]").val()+"#YYA;#"
				       +$(this).find("input[id=yyaccount_id_"+config.item_id+"]").val()+"#YYA;#"
				       +$(this).find("input[id=yyaccount_"+config.item_id+"_date]").val()+"#YYA;#"
				       +$(this).find("input[id=yyaccount_"+config.item_id+"_date2]").val()+"#YYA;#"
				       +$(this).find("input[id=yyaccount_num_"+config.item_id+"]").val()+"#YYA;#"
				       +$(this).find("input[id=yyaccount_num2_"+config.item_id+"]").val()+"#rDKAn#";
				$tr.each(function(i){
					var j=i+1;
					$Fields=$Fields+$(this).find("input[id=yyAccount_zy_"+config.item_id+"_"+j+"]").val()+"#YYA;#"
					+$(this).find("input[id=yyAccount_km_"+config.item_id+"_hidden_"+j+"]").val()+","+$(this).find("input[id=yyAccount_km_"+config.item_id+"_show_"+j+"]").val()+"#YYA;#"
					+$(this).find("select[id=yyAccount_jd_"+config.item_id+"_"+j+"]").val()+"#YYA;#"
					+$(this).find("input[id=yyAccount_je_"+config.item_id+"_"+j+"]").val()+"#rDKAn#";
				});	
				$(this).find("input[name="+name+"]").val($Fields);
			});	
	   	}

    });
    exports.TCUSTOM_YYACCOUNTCtrl = window.TCUSTOM_YYACCOUNTCtrl = TCUSTOM_YYACCOUNTCtrl;
});
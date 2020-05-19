define('TCUSTOM_KDACCOUNTCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('base');
    var TCUSTOM_KDACCOUNTCtrl = Base.extend({
        initialize: function(config) {
        	var self = this;
        	self.config = config;
            TCUSTOM_KDACCOUNTCtrl.superclass.initialize.call(this, config);
            this.$obj = $('img[name="'+config.id+'"]').eq(0);
            this.$addObj = $('#kdAccount_add_btn_'+config.item_id);
            this.$addObj.click(function(){
            	var addNum = $('#kdAccount_add_btn_num_'+config.item_id).val();
            	for(var i=0;i<addNum;i++){
            		self.addAccountRow(config);
            	}
            });
            this.$delObj = $('#kdAccount_del_btn_'+config.item_id);
            this.$delObj.click(function(){
            	self.delAccountRow(config);
            });
            
            $("img[type='kdAccountPZZImage']").live('click',function(){
            	var $table = $("#kdaccount_"+config.id);
            	var nameArr = $(this).attr('name').split('_');
            	if(nameArr.length != 4){
            		return false;
            	}
            	if($table.length == 1){
            		var URL = "/module/workflow/flow_form/cool_form/custom_controls/kdaccount/vgroup/index.php?datasrc="+$table.attr("datasrc")+"&data_control="+$table.attr("data_control")+"&field="+config.id;
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
            $("img[type='kdAccountImage']").live('click',function(){
            	var $table = $("#kdaccount_"+config.id);
            	var nameArr = $(this).attr('name').split('_');
            	if(nameArr.length != 4){
            		return false;
            	}
            	var imgCount = nameArr[3];
            	if($table.length == 1){
            		var URL = "/module/workflow/flow_form/cool_form/custom_controls/kdaccount/datalist/index.php?count="+imgCount+"&datasrc="+$table.attr("datasrc")+"&data_control="+$table.attr("data_control")+"&field="+config.id;
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
        	$("input[name^='kdaccountDATE_']").live('focus',function(){
        		 var item_id=$(this).attr('id').substring();
        		 var lv_item_id=(item_id.substring(item_id.indexOf('_')+1,item_id.lastIndexOf('_')));
                 var date=$(this).val();
                 var Y = date.substring(0,4);
                 var M = date.substring(5,7);
                 $("div[id='kdAccount_"+lv_item_id+"_infoyear']").html(Y);
                 $("div[id='kdAccount_"+lv_item_id+"_infomonth']").html(M);           
        	});
        },
		onSubmit:function(){
			var self = this;
			if(self.config){
				var result = this.kdAccountCheck(self.config);
				if(!result){
					return result; 
				}
			}
		},
        addAccountRow:function(config){
        	var $copyTr = $('#kdaccount_template_'+config.item_id).clone();
        	var lastRow = $("tr[type='kdAccount'][dataParent='"+config.id+"']:last");
        	if(lastRow.length > 0){
        		var rowCount = lastRow.attr('rowCount');
        	}else{
        		var rowCount = 0;
        	}
    		var newNum = parseInt(rowCount)+1;
    		var newTrHtml = $copyTr.html().replace(/#kdNum#/g, newNum);
    		var newTrOuterHtml = "<tr style=\"height:25px;\" type='kdAccount' dataParent='"+config.id+"'rowCount='"+newNum+"'>"+newTrHtml+"</tr>";
    		$(newTrOuterHtml).insertBefore($('#kdaccount_'+config.id).find("tr[type='opRow']"));
        },
        delAccountRow:function(config){
        	var $lastRow = $("tr[type='kdAccount'][dataParent='"+config.id+"']:last");
        	if($lastRow.length > 0){
        		$lastRow.remove();
        	}else{
        		return false;
        	}
        },
        kdAccountCheck:function(config){
	    	var boole='';
	    	var money=0;
	    	var je=0;
	    	if(boole==''){
				$("input[name^='kdaccountYWDATE_']").each(function(){
					
				if($(this).val()==""){
					    boole='false';
						alert(td_lang.general.workflow.msg_299);
						return false;
					}
			    });
			}
	    	if(boole==''){
				$("input[name^='kdaccountDATE_']").each(function(){
				if($(this).val()==""){
					    boole='false';
						alert(td_lang.general.workflow.msg_300);
						return false;
					}
			    });
			}
			if(boole==''){
				$("input[name^='kdaccountPZZ_SHOW_']").each(function(){
				if($(this).val()==""){
					    boole='false';
						alert(td_lang.general.workflow.msg_301);
						return false;
					}
			    });
			}
	    	if(boole==''){
				$("input[name^='kdaccountFJS_']").each(function(){
					var isnum=isNaN($(this).val());
					if(isnum==true){
				    	boole='false';
						alert(td_lang.general.workflow.msg_309);
						return false;
				    }
				    if(parseInt($(this).val())<1){
				    	boole='false';
				    	alert(td_lang.general.workflow.msg_309);
						return false;
				    }
				    var fjs_frist = $(this).val().substring(0,1);
				    if(fjs_frist=='0'){
				    	boole='false';
				    	alert(td_lang.general.workflow.msg_311);
						return false;
				    }
					
			    });
			}
	    	if(boole==''){
				$("input[name^='kdaccountXH_']").each(function(){   
					var isnum=isNaN($(this).val());
					if(isnum==true){
				    	boole='false';
						alert(td_lang.general.workflow.msg_310);
						return false;
				    }
				    if(parseInt($(this).val())<1){
				    	boole='false';
				    	alert(td_lang.general.workflow.msg_310);
						return false;
				    }
				    var xh_frist = $(this).val().substring(0,1);
				    if(xh_frist=='0'){
				    	boole='false';
				    	alert(td_lang.general.workflow.msg_312);
						return false;
				    }
			    });
			} 
			if(boole==''){
				$("input[id^='kdAccount_zy_'][id!='kdAccount_zy_"+config.item_id+"_#kdNum#']").each(function(){
				if($(this).val()==""){
					    boole='false';
						alert(td_lang.general.workflow.msg_313);
						return false;
					}
			   });
			}
			
			if(boole==''){
	    	$("input[name^='kdAccount_km_show_'][name!='kdAccount_km_show_"+config.item_id+"_#kdNum#']").each(function(){
	    		
	    	
				if($(this).val()==""){
				    boole='false';
					alert(td_lang.general.workflow.msg_295);
					return false;
				}
			});
			}
			if(boole==''){
				$("select[id^='kdAccount_jd_'][id!='kdAccount_jd_"+config.item_id+"_#kdNum#']").each(function(){
				if($(this).val()==""){
					    boole='false';
						alert(td_lang.general.workflow.msg_296);
						return false;
					}
			   });
			}
	    	if(boole==''){
				$("input[id^='kdAccount_je_'][id!='kdAccount_je_"+config.item_id+"_#kdNum#']").each(function(){
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
				var $kdaccountTables = $("table[id^='kdaccount_']");
				$kdaccountTables.each(function(){
					var $kdaccountTableUnit = this;
					var $tr = $(this).find("tr[type=kdAccount][id!='kdaccount_template_"+config.item_id+"']");
					$tr.each(function(i){
						var j=i+1;
							jd=$(this).find("select[id=kdAccount_jd_"+config.item_id+"_"+j+"]").val();
							je=parseInt($(this).find("input[id=kdAccount_je_"+config.item_id+"_"+j+"]").val());
							if(jd==0){
						        money=money-je;
					        }else{
					        	money=money+je;
					        }
					 });
					 if(money!=0){
					 	alert(td_lang.general.workflow.msg_298);
						boole='false';
					 	return false;
					 }
				});	
			}		
			if(boole==''){
				this.detailKDAccountFields(config);
			}else{
				return false;
			}
			return true;
	    },
	    detailKDAccountFields:function (config){
			var $kdaccountTables = $("table[id^='kdaccount_']");
			$kdaccountTables.each(function(i){
				var $Fields='';
				var $kdaccountTableUnit = this;
				var $id=$(this).attr("id");
				var str = $id.split("_") ;
				var name = str[1].toString() + "_" + str[2].toString();
				var $tr = $(this).find("tr[type=kdAccount][id!='kdaccount_template_"+config.item_id+"']");
				$Fields=$(this).find("input[id=kdaccount_"+config.item_id+"_ywdate]").val()+"#KDA;#"
				       +$(this).find("input[id=kdaccount_"+config.item_id+"_date]").val()+"#KDA;#"
				       +$(this).find("input[id=kdAccount_pzz_"+config.item_id+"_hidden]").val()+","
				       +$(this).find("input[id=kdAccount_pzz_"+config.item_id+"_show]").val()+"#KDA;#"
				       +$(this).find("input[id=kdaccount_"+config.item_id+"_fjs]").val()+"#KDA;#"
				       +$(this).find("input[id=kdaccount_"+config.item_id+"_xh]").val()+"#rDKAn#";
				$tr.each(function(i){
					var j=i+1;
					$Fields=$Fields+$(this).find("input[id=kdAccount_zy_"+config.item_id+"_"+j+"]").val()+"#KDA;#"
					+$(this).find("input[id=kdAccount_km_"+config.item_id+"_hidden_"+j+"]").val()+","+$(this).find("input[id=kdAccount_km_"+config.item_id+"_show_"+j+"]").val()+"#KDA;#"
					+$(this).find("select[id=kdAccount_jd_"+config.item_id+"_"+j+"]").val()+"#KDA;#"
					+$(this).find("input[id=kdAccount_je_"+config.item_id+"_"+j+"]").val()+"#rDKAn#";
				});	
				$(this).find("input[name="+name+"]").val($Fields);		
			});	
	   	}
    });
    exports.TCUSTOM_KDACCOUNTCtrl = window.TCUSTOM_KDACCOUNTCtrl = TCUSTOM_KDACCOUNTCtrl;
    
});
;(function(win, $){
	win.G = win.G || {},
	$popPanel = $('#popPanel'),
	siderTmpl = '<ul class="group">{{each lis}}<li id="${id}" title="${title}" _attr_="${attr}" _type_="${type}" class="item">${text}</li>{{/each}}</ul>',
	loadingTmpl = '<div class="loading"></div>',
	iframeTmpl = '<iframe frameborder="0" src="" style="width:100%;overflow: hidden;"></iframe>',

	
	//跟后台交互的接口
	getJson = function(url, datas, callback){
		$.post(url, datas, function(msg){
			callback( $.parseJSON(msg) );
		});
	},
	
	// 生成唯一的panel，返回实例化后的对象
	initPanel = function(opts){
		var p = $popPanel.data('popPanel');
		opts = opts || {};
		p&&p.destory();
		p = $popPanel
			.popPanel(opts)
			.data('popPanel');
		return p;
	},
	
	// 获得当前的panel对象
	getPanel = function(){
		return $popPanel.data('popPanel');
	},
	
	initHistoryNav = function(toolbar){
		toolbar.find('[id="historyNav"]').remove();
		var $hisNav = $('<div id="historyNav"></div>').appendTo(toolbar);
		var p = getPanel();
		return new win.HistoryNav($hisNav,{
			onChange: function(){
				var me = this;	
				var c = $('<div></div>').attr('id', 'explorer');
				p.setContent(c);
				var e = c.explorer(this.getCurState().json,{
					onDbclick: function(){
								var selectedId = this.id,
								text = $(this).find('a').html(),
								isFolder = this.getAttribute('isFolder');
								if(isFolder){								
									G.updateExplore(selectedId, c, e, me, text);
								} else {
									G.openURL('process-copy-' + selectedId, '复制流程', '/general/system/approve_center/flow_guide/flow_type/newflow.php?act=copy&entity_name=' + text + '&FLOW_ID=' + selectedId + '&SORT_ID=' + G.sortid);
								}
					}
				}).data('explorer');
				p.renderCtrlBar([
						{
							text:'复制',
							className:'btn btn-primary',
							func:function(){
								var selectedId = e.getSelected().attr('id');
								if(!selectedId){
									p.message('请选择一个流程.');							
									return false;							 
								}
								isFolder = e.getSelected().attr('isFolder');
								if(isFolder){								
									p.message('请选择一个流程.');							
									return false;	
								} else {
									G.openURL('process-copy-' + selectedId, '复制流程', '/general/system/approve_center/flow_guide/flow_type/newflow.php?act=copy&FLOW_ID=' + selectedId + '&SORT_ID=' + G.sortid);
								}
							}
						},
						{
							text:'取消',
							className:'btn',
							func:function(){
								p.close();
							}
						}
				]);
				e.$element.find('li:first').trigger('click');
			}
		});
	},
	
	/*	根据字符串返回函数
	 *	funcName： String 函数名 支持命名空间
	 *	root：Object 上下文环境 默认为window
	 *	如：
	 *		'G.funcName' => return G.funcName
	*/
	getFunc = function(funcName, root){
		var root = root || window,
		funcs = funcName.split('.');
		for(k in funcs){
			if( root[funcs[k]] ){
				root = root[funcs[k]];
			}
		}
		if( typeof root === 'function' ){
			return root;
		}
	};

	// 一个空的占位函数，子页面完成更新后调用
	win.ok_callback = $.noop;
	G.getPanel = getPanel;
	//旧主题开新窗口，新主题开新页签
	G.openURL = function(pid, pname, purl){
		var fixTabName = ( top.jQuery && top.jQuery.fn.getSelected ) ? '&targetTab=' + top.jQuery.fn.getSelected() : '';
		win.openNewProtal(purl + fixTabName, pname, pid);
	};
	
	//视频教程
	G.openVideo = function(url){
		var obj = '<p align="center"><embed src="' + url + '" allowfullscreen="true" quality="high" width="720" height="480" align="middle" allowscriptaccess="always" type="application/x-shockwave-flash" style="position: relative;z-index: 100;margin:auto;"></p>';
		var popPanel = initPanel();
		popPanel.setContent(obj).open();
	};

	// 新开悬浮面板，iframe装载url
	G.openPanel = function(url, opts, ctrlbarConfig){
		var h = document.documentElement.clientHeight || document.body.clientHeight;
		h = Math.min(h-120,600);
		opts = $.extend({ height:h },opts||{});
		var p = initPanel(opts), e,
		closeCallback = '&closeCallback='+creatCallback(function(){p.close();}),	
		c = $(iframeTmpl).attr('src', url + closeCallback);
		c.bind('load',function(){
			this.style.height = 'auto';
			var h = $(this.contentWindow.document).height();
			$(this).height(h);
			$("body", this.contentDocument).css('background','#ffffff');
		});
		p.setContent(c).open();
		
		var ctrls = [];
		ctrlbarConfig = ctrlbarConfig || { save: true, close: true };
	
		ctrlbarConfig.save && ctrls.push({
			text:'保存',
			className:'btn btn-primary',
			func:function(){
				ok_callback && ok_callback();
			}
		});
		ctrlbarConfig.close && ctrls.push({
			text:'关闭',
			className:'btn',
			func:function(){
				p.close();
			}			
		});
		p.renderCtrlBar( ctrls );
	};
	G.exportFlow = function(url){
		window.location = url;	
	};
	G.formView = function(FORM_ID){
		var url = "/general/approve_center/form_view.php?FORM_ID="+FORM_ID;
		window.open(url,"_blank");
	};
	//清空
	G.empty_form = function(FLOW_ID){
	    var msg="确认要清空依托于该流程的所有工作数据吗?";
	    if(window.confirm(msg)){
	        var url="/general/system/approve_center/flow_guide/flow_type/empty.php?FLOW_ID="+FLOW_ID;
			ajax_update(url,{success: '清空成功！',fail: '清空失败！'},function(){
				$("#guide-view-frame")[0].contentWindow.location.reload();	
			});
	    }
	};
	
	//删除
	G.delete_form = function(FLOW_ID){
	    var msg="确认要删除该流程吗？这将删除：\n1、流程描述与步骤设置；\n2、依托于该流程的所有工作。";
	    if(window.confirm(msg)){
	        var url="/general/system/approve_center/flow_guide/flow_type/delete.php?FLOW_ID="+FLOW_ID;
			ajax_update(url,{success: '删除成功！',fail: '删除失败！'},function(){
				window.location.href = "/general/system/approve_center/flow_guide/index.php";	
			});
	    }
	}
	
	//模块相关函数
	G.flowCmd = function( protalId, protalName, url){
		var h = document.documentElement.clientHeight || document.body.clientHeight;
		h = Math.min(h-180,600);
		var popPanel = initPanel({height:h});
		popPanel.open();
		G.initFlowMenuList( popPanel );
		popPanel.callback = (function( protalId, protalName, _url){
			return function(param){
				var splitChar = _url.indexOf('?') < 0 ? '?' : '&';
				var baseUrl = _url;
				if( typeof param === 'object' ){
					baseUrl += splitChar + $.param(param);
				}else{
					baseUrl += splitChar + param;
				}
				G.openURL(protalId, protalName, baseUrl);
			}
		})(protalId, protalName, url);
	};
	G.moveData = function(){
		G.openPanel('/general/system/approve_center/flow_guide/flow_type/data/?FLOW_ID=' + G.flowId ,{ }, { close:true });
	};
	// 侧边栏加载oa菜单
	G.initFlowMenuList = function(p){
		var t = $.tmpl(siderTmpl,[
			{
				lis:[
					{ id: '', text: '空白流程', attr: 'menus|*|blank' }/*,
					{ id: '', text: '常用流程', attr: 'menus|*|common' },
					{ id: '', text: '最近使用流程', attr: 'menus|*|recent' }*/
				]
			}
		]);
		c = $('<div></div>').append('<h3 class="group-header">常用</h3>').append(t).append('<hr>');
		p.setSider(c);
		t.find('li:first').trigger('click');
		getJson("getMenuJson.php",{ sortId: 0, type:'menus' },
			(function(c){
				return function(obj){
					var t2 = $.tmpl(siderTmpl, obj);
					c.append('<h3 class="group-header">模版</h3>').append(t2);
				}
			})(c)
		);
		//G.menus();
	};

	// 实体面板左侧的菜单列表事件
	G.menus = function(){
		var args = arguments,e,
		c = $('<div></div>').attr('id', 'explorer'),
		blankModel,commonModel,
		p = getPanel();
		
		p.setContent(c);
		p.setTips('<b>提示:</b> 您可以使用空白流程进行新建，也可以从模版中选择已有的流程进行复制.');
		
		var $toolbar = $('#toolbar-nav').size() ?
							$('#toolbar-nav')
						:	$('<div></div>').attr('id', 'toolbar-nav').insertBefore(c.parent());
						
		var historyNav = initHistoryNav($toolbar);
		
		if(args[0] === 'blank'){
			historyNav.destory();
			$toolbar.find('[id="historyNav"]').remove();
			blankModel = [{"text":"空白流程","items":[{"id":"1","className":"ico-blank","text":"空白流程"}]}];
			var e = c.explorer(blankModel,{
					onDbclick: function(){
						p.callback();
					}
				}).data('explorer');
			p.renderCtrlBar([
				{
					text:'新建',
					className:'btn btn-primary',
					func:function(){								// 取得当前选中的图标id，执行callback
						p.callback();
					}
				},
				{
					text:'取消',
					className:'btn',
					func:function(){
						p.close();
					}
				}
			]);
			e.$element.find('li:first').trigger('click');
		
		} else {

	
			c.html(loadingTmpl);
			getJson("getModelsJson.php",{ sortId: args[0], type: 'models'},
				(function(c, p){
					return function(obj){
						historyNav.pushState({ id: args[0], text: args[1], json:obj });
						
					}
				})(c, p)
			);
		}
	};
	G.updateExplore = function(selectedId, c, e, historyNav, text){
		c.html(loadingTmpl);
		getJson("getModelsJson.php",{ sortId: selectedId, type: 'models'},function(obj){
			historyNav.pushState({ id: selectedId, text: text, json: obj });
		});
	};
	
	//
	G.searchTmplList = function(){
		var p = initPanel(), e,
			
		c = $('<div></div>').attr('id', 'explorer');
		
		p.setContent(c).open();
		
		getJson("getSearchTmplsJson.php",{ flowId: G.flowId },

			(function(c){
				return function(obj){
				
					e = c.explorer(obj, { view: 'list' }).data('explorer');
					
					e.$element.find('li:first').trigger('click');
				}
			})(c)
		);
		p.renderCtrlBar([
			{
				text:'编辑',
				className:'btn-blue',
				func:function(){				
					var selectedId = e.getSelected().attr('id');					
					if(!selectedId){					
						p.message('请选择一个模板.');				
						return false;					
					}					
					G.openURL('search-tmpl-edit-'+selectedId, '编辑查询模板', '/module/flow_query_tpl/edit.php?SEQ_ID='  + selectedId + "&FLOW_ID=" + G.flowId + "&SORT_ID=" + G.sortid );							
					p.close();
				}
			},{
				text:'删除',
				className:'btn-red',
				func:function(){				
					var selectedNode = e.getSelected(),
					selectedId = selectedNode.attr('id');
					
					if(!selectedId){					
						p.message('请选择一个模板.');
						return false;					
					}					
					if(!window.confirm('确定要删除吗?')){						
						return false;					
					}
					
					$.post('/module/flow_query_tpl/delete_ajax.php',	
						{
								SEQ_ID: selectedId,
								FLOW_ID: G.flowId,
								SORT_ID: G.sortid
						},
						function(msg){			
							if(msg == '+OK'){
								p.message('删除成功');								
								selectedNode.remove();
							} else {
								p.message('删除失败');								
							}
					});							
				}
			},{
				text:'取消',
				className:'btn',
				func:function(){
					p.close();					
				}
			}
		]);
	};	
	//定时任务相关动作
	G.taskCmd = function(){
		var p = initPanel(), e,
			
		c = $('<div></div>').attr('id', 'explorer');
		
		p.setContent(c).open();
		
		getJson("getTasksJson.php",{ flowId: G.flowId },
			(function(c){
				return function(obj){				
					e = c.explorer(obj, { view: 'list' }).data('explorer');					
					e.$element.find('li:first').trigger('click');
				}
			})(c)
		);
		p.renderCtrlBar([
			{
				text:'编辑',
				className:'btn-blue',
				func:function(){				
					var selectedId = e.getSelected().attr('id');					
					if(!selectedId){					
						p.message('请选择一个任务.');				
						return false;					
					}					
					G.openURL('task-edit-'+selectedId, '编辑定时任务', '/general/system/approve_center/flow_guide/flow_type/set_timer/new_timer.php?EDIT_FLAG=1&FLOW_ID=' + G.flowId + '&T_ID=' + selectedId);							
					p.close();
				}
			},{
				text:'删除',
				className:'btn-red',
				func:function(){				
					var selectedNode = e.getSelected(),
					selectedId = selectedNode.attr('id');	
					
					if(!selectedId){					
						p.message('请选择一个任务.');				
						return false;					
					}
					
					if(!window.confirm('确定要删除吗?')){						
						return false;					
					}
					
					$.post('/general/system/approve_center/flow_guide/flow_type/set_timer/del_schema.php', { TASK_ID: selectedId }, function(msg){
						if(msg == '+OK'){
							p.message('删除成功');							
							selectedNode.remove();
						} else {
							p.message('删除失败');							
						}
					});							
				}
			},{
				text:'取消',
				className:'btn',
				func:function(){
					p.close();					
				}
			}
		]);
	};
	
	//板式文件相关动作
	G.printCmd = function(){
		var p = initPanel(), e,
			
		c = $('<div></div>').attr('id', 'explorer');
		
		p.setContent(c).open();
		
		getJson("getPrintsJson.php",{ sortId: G.sortid, flowId: G.flowId },

			(function(c){
				return function(obj){				
					e = c.explorer(obj, { view: 'list' }).data('explorer');					
					e.$element.find('li:first').trigger('click');
				}
			})(c)
		);
		p.renderCtrlBar([
			{
				text:'编辑',
				className:'btn-blue',
				func:function(){				
					var selectedId = e.getSelected().attr('id');					
					if(!selectedId){					
						p.message('请选择一个板式文件.');				
						return false;					
					}					
					G.openURL('print-edit-'+selectedId, '编辑版式文件', '/general/system/approve_center/flow_guide/flow_type/set_print/new_tpl.php?FLOW_ID=' + G.flowId + '&SORT_ID=' + G.sortid + '&T_ID=' + selectedId);							
					p.close();
				}
			},{
				text:'删除',
				className:'btn-red',
				func:function(){				
					var selectedNode = e.getSelected(),
					selectedId = selectedNode.attr('id');
					
					if(!selectedId){					
						p.message('请选择一个板式文件.');				
						return false;					
					}
					
					if(!window.confirm('确定要删除吗?')){						
						return false;					
					}
					
					$.post('/general/system/approve_center/flow_guide/flow_type/set_print/delete.php', { T_ID: selectedId }, function(msg){
						
						if(msg == '+OK'){
							p.message('删除成功');							
							selectedNode.remove();
						} else {
							p.message('删除失败');							
						}
					});							
				}
			},{
				text:'取消',
				className:'btn',
				func:function(){
					p.close();					
				}
			}
		]);
	}
	
	jQuery(document).ready(function(){

		jQuery(document).on("click", "ul.group > li.item", function()
		{
			//$popPanel.find('ul.group > li.item').live('click',function(){
			var func,$this = $(this),
			attr = $this.attr('_attr_') || '';
			var attrs = attr.split('|*|');
			$popPanel.find('ul.group > li.item').removeClass('active');
			$(this).addClass('active');
			func = getFunc( attrs.splice(0, 1)[0], G );
			typeof func === 'function' && func.apply( this, attrs );
			return false;
		});
		var report=jQuery('#report').val();
		if(report==undefined){
			var flow_id = jQuery(window.frames["guideFrame"].document).find("#guide_flow_id").val(); 
		}
		if(typeof(flow_id) == "undefined"){
			jQuery('#flow_smart').attr({"disabled":"disabled"});
			jQuery('#flow_smart').removeClass("btn-primary");	
		}
		$('#_my97DP').remove();
	});
})(window, jQuery);
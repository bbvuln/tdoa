(function($, dragula) {
    jQuery(document).ready(function(){		
		// function initCtrlandShift(){
			// var _clicked = [];  
			// function shift_select(){  
				// $(".td-contact-choose-list .tag").click(function (e){  
					// _clicked.push($(".td-contact-choose-list .tag").index($(this)))  
					// if(e.shiftKey){  
						// var iMin = Math.min(_clicked[_clicked.length-2],_clicked[_clicked.length-1])  
						// var iMax = Math.max(_clicked[_clicked.length-2],_clicked[_clicked.length-1])  
						// for(i=iMin;i<=iMax;i++){  
						// $(".td-contact-choose-list .tag:eq("+i+")").addClass("tag-selected")
						// }  
					// }else{  
						// $(this).toggleClass("tag-selected");  
					// }  
				// });  
			// }  
			// $(function(){  
				// shift_select();  
			// });  
			// document.onselectstart=function(event){//避免文字被选中  
				// event = window.event||event;  
				// event.returnValue = false;  
			// }  
			// document.onmousedown = function(event){
				// event = window.event || event;  
				////console.log(event)
			// }
		// }
		// initCtrlandShift();
		function asyncHiddenToTag() {
			$('.to_id').each(function(){
				var $this = $(this)
				var $container = $this.parents('.td-contact-choose-wrapper')
				var $list = $container.find('.td-contact-choose-list')
				var $to_id = $container.find('.to_id')
				var $to_name = $container.find('.to_name')
				var $count = $container.find('.td-contact-count')
				var to_id_arr = $to_id.val().split(',');
				var to_name_arr = $to_name.val().split(',');
				$list.html('<span></span>')
				for (var i=0;i<to_id_arr.length;i++ ) {
					if(to_id_arr[i]){
						$list.append('<span class="td-contact-choose-item tag" data-tag-value="'+ to_id_arr[i] +'" data-tag-text="'+ to_name_arr[i] +'"><a href="javascript:void(0)" class="td-contact-choose-item-close">×</a><span class="tag-content">'+ to_name_arr[i] +'</span></span>')
					}
				}
				var count = $list.find('.td-contact-choose-item').length
				count = count ? count : 0
				$count.html(count)
			})
		}
		function asyncTagToHidden(){
			$('.td-contact-choose-list').each(function(){
				var $list = $(this),
					$container = $list.parent('.td-contact-choose-wrapper');
				var $to_id = $container.find('.to_id');
				var $to_name = $container.find('.to_name');
				var $count = $container.find('.td-contact-count');
				var to_id_str = '';
				var to_name_str = '';
				$list.find('.td-contact-choose-item').each(function(){
					to_id_str += $(this).attr('data-tag-value') + ',';
					to_name_str += $(this).attr('data-tag-text') + ',';
				})
				$to_id.val(to_id_str)
				$to_name.val(to_name_str)
				$count.html($list.find('.td-contact-choose-item').length)
			})
		}
		function initSortable(){
			dragula([document.getElementById('inbox-list'), document.getElementById('copy-list'), document.getElementById('secret-list')],{
			})
			.on('drop', function (el) {
				var $targetlist = $(el).parents('.td-contact-choose-list')
				var isRepeat = false
				var ids_array = [] 
				$targetlist.find('.td-contact-choose-item').each(function(){
					var $this = $(this)
					var id = $this.attr('data-tag-value')
					if(ids_array.indexOf(id) != '-1'){
						isRepeat = true
						return;
					}
					ids_array.push(id)
				})
				if(isRepeat){
					//console.log('已存在')
					this.cancel(true);
				}
				asyncTagToHidden();
			})
			// $( ".td-contact-choose-list" ).sortable({
				// helper: "clone",
				// appendTo: '.td-contact-choose-list',
				// connectWith: ".td-contact-choose-list",
				// scroll: false,
				// scrollSensitivity: 100,
				// placeholder: "ui-state-highlight",
				// forcePlaceholderSize: true,
				// stop: function(event, ui) {
					////console.log('stop',event, ui)
					// var $targetlist = $(ui.item[0]).parents('.td-contact-choose-list')
					// var isRepeat = false
					// var ids_array = [] 
					// $targetlist.find('.td-contact-choose-item').each(function(){
						// var $this = $(this)
						// var id = $this.attr('data-tag-value')
						// if(ids_array.indexOf(id) != '-1'){
							// isRepeat = true
							// return;
						// }
						// ids_array.push(id)
					// })
					// if(isRepeat){
						////console.log('已存在')
						// return false	
					// }
					// asyncTagToHidden();
				// }
			// }).disableSelection();
		}
		// var start = null
		// var end = null
		// $( ".td-contact-choose-list" ).droppable({
			// placeholder: "ui-state-highlight",
			// forcePlaceholderSize: true,
			// drop: function( event, ui ) {
				// console.log(event, ui)
				// var $targetlist = $(event.target)
				// var isRepeat = false
				// var ids_array = [] 
				// $targetlist.find('.td-contact-choose-item').each(function(){
					// var $this = $(this)
					// var id = $this.attr('data-tag-value')
					// if(ids_array.indexOf(id) != '-1'){
						// isRepeat = true
						// return;
					// }
					// ids_array.push(id)
				// })
				// if(isRepeat){
					// console.log('已存在')
					// return false	
				// }
				// var id = $(ui.draggable[0]).attr('data-tag-value')
				// var name = $(ui.draggable[0]).attr('data-tag-text')
				// $(ui.draggable[0]).remove();
				// $targetlist.append('<span class="td-contact-choose-item tag" data-tag-value="'+ id +'" data-tag-text="'+ name +'"><a href="javascript:void(0)" class="td-contact-choose-item-close">×</a><span class="tag-content">'+ name +'</span></span>')
			// }
		// });
		
		asyncHiddenToTag();
		initSortable();
		
		
		var module_searchtimer = null;
		var clear_searchtimer = null;
		function TdContact (config) {
			this.config = config;
			this.selected = []
			this.$add = config.$el;
			this.$container = this.$add.parents('.td-contact-choose-wrapper');
			this.$list = this.$container.find('.td-contact-choose-list');
			this.$to_id = this.$container.find('.to_id');
			this.$to_name = this.$container.find('.to_name');
			this.$count = this.$container.find('.td-contact-count');
			this.initialize()
		}
		TdContact.prototype.initialize = function() {
			this.asyncSelected();
			var me = this,
				module_id = '2', 
				to_id = this.$to_id.attr('name'), 
				to_name = this.$to_name.attr('name'), 
				manage_flag = "", 
				form_name = "";
			window.org_select_callbacks = window.org_select_callbacks || {};
			window.org_select_callbacks.add = function(item_id, item_name){
				//console.log('add', item_id, item_name);
				if(me.selected._includes(item_id)){
				}else{
					me.selected.push({
						id: item_id, 
						name: item_name
					})
					module_searchtimer && clearTimeout(module_searchtimer);
					module_searchtimer = setTimeout(function (){
						me.render()
					}, 800)
				}
			};
			window.org_select_callbacks.remove = function(item_id, item_name){
				//console.log('remove', item_id, item_name)    
				var _selected = me.selected.filter(function(item){
					return item.id != item_id
				})
				me.selected = _selected
				clear_searchtimer && clearTimeout(clear_searchtimer);
				clear_searchtimer = setTimeout(function (){
					me.render()
				}, 800)
			};                
			window.org_select_callbacks.clear = function(){                    
				//console.log('clear') 
			};
			SelectUser('1', module_id, to_id, to_name, manage_flag, form_name);
			return false;	
		};
		TdContact.prototype.asyncSelected = function() {
			var me = this
			var to_id_str = this.$to_id.val()
			var to_name_str = this.$to_name.val()
			if(to_id_str){
				var to_id_arr = to_id_str.split(',');
				var to_name_arr = to_name_str.split(',');
				for (var i=0;i<to_id_arr.length;i++ ) {
					if(to_id_arr[i]){
						me.selected.push({
							id: to_id_arr[i],
							name: to_name_arr[i]
						})
					}
				}
				/*
				to_id_arr.map(function(item, key){
					if(item){
						//console.log('同步隐藏域值至this.selected', item, to_name_arr[key])
						me.selected.push({
							id: item,
							name: to_name_arr[key]
						})
					}
				})
				*/
			}
		}
		TdContact.prototype.render = function() {
			var _selected = this.selected;
			//whf 2019-3-27  去重
			if(_selected.length!=0){
		
					var hash=[];
					for (var i = 0; i < _selected.length; i++) {
						for (var j = i+1; j < _selected.length; j++) {
							//console.log(_selected[i].id,_selected[j].id)
							if(_selected[i].id===_selected[j].id){
								++i;
							}
						}
							hash.push(_selected[i]);
					}
					 _selected=hash
				}
			var items = ''
			$.each(_selected, function(key, item){
				//console.log('render item', item)
				items += '<span class="td-contact-choose-item tag" data-tag-value="'+ item.id +'" data-tag-text="'+ item.name +'"><a href="javascript:void(0)" class="td-contact-choose-item-close">×</a><span class="tag-content">'+ item.name +'</span></span>'
			})
			this.$list.html(items)
			this.$count.html(_selected.length ? _selected.length : 0)						
		}
		$('body').delegate('.td-contact-add', 'click', function(){
			new TdContact({
				$el: $(this)
			})
		})
		$('body').delegate('.td-contact-choose-item-close', 'click', function(){
			//console.log($(this))
			var $target = $(this).parent('.td-contact-choose-item')
			var id = $target.attr('data-tag-value')
			var name = $target.attr('data-tag-text')
			$target.remove()
			asyncTagToHidden();
			return false;
		})
		
		$('body').delegate('.td-contact-clear', 'click', function(){
			var $this = $(this)
			var $container = $(this).parents('.td-contact-choose-wrapper')
			var $list = $container.find('.td-contact-choose-list')
			var $to_id = $container.find('.to_id')
			var $to_name = $container.find('.to_name')
			var $count = $container.find('.td-contact-count')
			$list.html('<span></span>')
			$to_id.val('')
			$to_name.val('')
			$count.html(0)
			return false;
		})
		
	})
	
})(jQuery, dragula);
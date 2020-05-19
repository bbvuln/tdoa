// polyfill for trim()
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

(function() {
    // some globals
    var formId = location.search ? location.search.substring(1).split('=')[1] : '';
    var debug = false;
    var hasModified = false;
    var hasEmptyGroup = false;
    var hasIllegeChar = false;
    window.formData = null;
    window.idHash = {};
    
    
    // when dom is ready
    $(function() {

        //编辑表单
        if (formId !== '') {
            
            //取对应form_id的数据
            $.get('/general/system/workflow/flow_form/pda/formData.php',{FORM_ID:formId}, 
            // $.get('data.json',
            function(data) {
                //console.info('getdata',data);
                typeof data === 'string' ? data = JSON.parse(data) : data = data
                //如果数据不为空
                if (data !== null) {
                    try {
                        window.formData = data;
                    } catch (e) {
                        debug && alert(e.message);
                        return false;
                    }
                    
                    
                    //移除placeholder
                    $('.mbui_group_list').find('.mbui_panel_form_tips').remove();
                    
                    $.each(data, function(index, item) {
                        //定义每个组的容器和相应id
                        var el = $('<div class="mbui_cells_group"><div class="mbui_cells_title"><span>组容器</span><img src="images/shouqi.png" onclick="toggleExtension(this);" /></div><div class="mbui_cells"></div><div class="mbui_cell_layer mbui_cell_group_layer" title="双击编辑组容器名称"><div class="mbui_cell_layer_del group_layer_del"></div></div> </div>');
                        var groundId = generateId('td_' + item.type);
                        
                        //子控件容器
                        var subContainer = el.find('.mbui_cells');
                        //设置组容器名称
                        el.find('.mbui_cells_title span').text(item.name);
                        //添加到设计器中，并让它接收控件拖拽
                        $('.mbui_group_list').append(el);
                        //绑事件
                        el.attr('data-group-id', groundId).click(function(e) {
                            if (!$(e.target).hasClass('mbui_cell_layer_del')) {
                                setCellActive(this);
                                //高亮被点击的控件	
                            }
                        });
                        el.dblclick(function(e) {
                            if (!$(e.target).hasClass('mbui_cell_layer_del') && !$(e.target).hasClass('rename-group')) {
                                var groupName = $(this).find('.mbui_cells_title span').html()
                                $('<input class="rename-group" type="text" placeholder=" 请输入组容器名称..." value="' +groupName+ '" />').appendTo(this).select()
                            }
                        });
                        
                        // el.hover(function(e) {
                        //     var offset = $(this).offset()
                        //     var width = $(this).width()
                        //     var tH = offset.top - 10
                        //     var tW = offset.left + width/2 - 130/2
                        //     $('<div class="my-tooltip" style="top:'+tH+'px;left:'+tW+'px;">双击编辑组容器名称</div>').prependTo('body')
                        //     setTimeout(function() {
                        //         $('.my-tooltip').remove()
                        //     }, 2000);
                        // })
                        
                        makeGroupSortable();
                        
                        
                        //遍历出子控件
                        $.each(item.fields, function(index, item) {
                            
                            //根据拖拽控件类型去取设计器模板，并存在本地变量el中
                            var el = $($('#mbui_cell_' + item.type).html());
                            var ctrlId = generateId('td_' + item.type);
                            
                            // 储存id
                            window.idHash[ctrlId] = item.id;
                            
                            //设置名称
                            item.name && el.find('.mbui_label').text(item.name);
                            //说明控件
                            if (item.type === "desc") {
                                el.find('.mbui_label').text(item.value);
                            }
                            //设置placeholder
                            if (el.find('.mbui_input').length > 0) {
                                el.find('.mbui_input').attr('placeholder', item.placeholder);
                            }
                            if (el.find('.mbui_textarea').length > 0) {
                                el.find('.mbui_textarea').attr('placeholder', item.placeholder);
                            }
                            //添加到组容器中
                            subContainer.append(el);
                            //帮事件
                            el.attr('data-ctrl-id', ctrlId).click(function(e) {
                                if (!$(e.target).hasClass('mbui_cell_layer_del')) {
                                    //高亮被点击的控件
                                    setCellActive(this);
                                    $('.rename-group').blur()
                                    return false;
                                }
                            });
                            el.attr('data-ctrl-id', ctrlId).dblclick(function(e) {
                                if (!$(e.target).hasClass('mbui_cell_layer_del')) {
                                    return false;
                                }
                            });
                        });
                    });
                }
            });
        }
        
		$(".mbui_group_list").sortable({
			opacity: 0.8,
			axis: "y",
		  	items: ".mbui_cells_group",
		  	placeholder: "magic_placeholder",
		  	receive: function(event,ui){

		  	},
		  	stop: function(){
		  		$('.mbui_cells_group').removeClass('fold');
		  		$('.mbui_cells_title img').attr('src','images/shouqi.png');
		  		hasModified = true;

		  	},
		  	start: function(){
		  		$('.mbui_cells_group').addClass('fold');
		  		$('.mbui_cells_title img').attr('src','images/xiala.png');
		  	}
		})
		
		// Event handles
		// Add group container
		$('.group_add_btn').click(function(e) {
		    //定义每个组的容器和相应id
            var el = $('<div class="mbui_cells_group"><div class="mbui_cells_title"><span>组容器</span><img src="images/shouqi.png" onclick="toggleExtension(this);" /></div><div class="mbui_cells"></div><div class="mbui_cell_layer mbui_cell_group_layer" title="双击编辑组容器名称"><div class="mbui_cell_layer_del group_layer_del"></div></div> </div>');
            var groundId = generateId('td_group');

            //设置组容器名称
            el.find('.mbui_cells_title span').text('组容器');
            //添加到设计器中，并让它接收控件拖拽
            el.prependTo('.mbui_group_list');
            //绑事件
            el.attr('data-group-id', groundId).click(function(e) {
                if (!$(e.target).hasClass('mbui_cell_layer_del')) {
                    //加载设置模板
                    setCellActive(this);
                    //高亮被点击的控件	
                }
            });
            el.attr('data-group-id', groundId).dblclick(function(e) {
                if (!$(e.target).hasClass('mbui_cell_layer_del') && !$(e.target).hasClass('rename-group')) {
                    var groupName = $(this).find('.mbui_cells_title span').html()
                    $('<input class="rename-group" type="text" placeholder=" 请输入组容器名称..." value="' +groupName+ '" />').appendTo(this).select()
                }
            });
            makeGroupSortable();
		})
		
		// Delete groups only if their contain no fields
		$('.mbui_panel_form').on('click','.group_layer_del',function(e) {
		    var sortableDiv = $(this).parent().prev()
		    if(sortableDiv.find('.mbui_cell').length > 0) {
		        alert('该组容器不为空，无法删除。')
		    } else {
		        $(this).parents('.mbui_cells_group').remove()
		    }
		})
		
		
		$('.mbui_panel_form').on('click','.mbui_cells_title',function(e) {
		    //debugger
		})
		
		// Modify the group title
		$('.mbui_panel_form').on('blur', '.rename-group', function() {
		    var el = $(this)
		    var newName = el.val().trim()
		    if(newName === '') {
		        newName = '组容器'
		    }
		    if(/[\<\>\'\"\/\\]/.test(newName)) {
		        alert('组容器名称不能包含<，>，' + "'"  +'，"，/，\\等非法字符')
		        hasIllegeChar = true
		        return false
		    }
		    hasIllegeChar = false
		    el.prevAll('.mbui_cells_title').find('span').html(newName)
		    el.remove()
		})
		$('.mbui_panel_form').on('click', '.rename-group', function() {
		    return false
		})
		$('.mbui_panel_form').on('keypress', '.rename-group', function(e) {
		    if(e.keyCode === 13) {
		        $('.rename-group').blur()
		    }
		})
		
		$(document).click(function() {
		    $('.rename-group').blur()
		})
		
		
		$('.mbui_header_save').click(function(e) {
		    var dataJson = scanForm()
		    
		    if(hasEmptyGroup) {
		        alert('保存失败，组容器不能为空。')
		        return false;
		    }
		    if(hasIllegeChar) {
		        alert('保存失败，组容器名称不能包含非法字符。')
		        return false;
		    }
		    $.post('/general/system/workflow/flow_form/pda/submit.php',
		        {FORM_ID:formId, result:JSON2.stringify(dataJson)},
		        function(data) {
					if(data == 1)
					{
						alert("保存成功");
					}
		            debug && console.log(arguments)
		    })
		    debug && console.log(dataJson)
		})
		
    })


    function generateId(originalId){
		return originalId + '_' + new Date().getTime() + Math.floor(Math.random()*1000);
	}
	
	function setCellActive(self){
		$('.mbui_cell_layer').removeClass("active");
		$(self).children('.mbui_cell_layer').addClass("active");
	}
	
	function makeGroupSortable(){
	   // return false
		$(".mbui_panel_form .mbui_cells").
    		sortable({
    			opacity: 0.8,
    			items: ".mbui_cell",
    			placeholder: "magic_placeholder",
    			connectWith: ".mbui_cells",
    			receive: function(event,ui){

    				hasModified = true;
    				//剥离helper内联样式
        			if(ui.helper){
        				ui.helper.removeAttr('style');
        				//if(ui.helper === ui.item)
        					//return false;
        			} else {
        				ui.item.removeAttr('style');
        				//return false;
        			}
    			},
    			stop: function(event,ui){
    				ui.item.removeAttr("style");
    				hasModified = true;
    			}
    		});
	}
	
	//扫描设计器
	function scanForm(){
		var srcStr = $('.mbui_group_list').html(),
			matchedId = srcStr.match(/td_(\w)+_(\d)+/g) || [],
			data = [],
			lastGroup = {};

		$.each(matchedId,function(index,item){
			if(item.indexOf('group') !== -1){
				var obj = {};
				$.extend(obj,{type:'group'});
				obj.name = $('[data-group-id="'+ item +'"]').find('.mbui_cells_title span').text();
				obj.fields = [];
				data.push(obj);
			} else {
				lastGroup = data[data.length-1];
				lastGroup.fields.push(idHash[item]);
			}
		  
		});

		hasEmptyGroup = false;
		//不能有空容器
		$.each(data,function(index,item){
			if(item.fields.length === 0){
				hasEmptyGroup = true;
			}
		});

		return data;
	}

})()


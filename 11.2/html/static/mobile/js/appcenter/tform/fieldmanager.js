define('FieldManager', ['FieldLoader', "base"], function(require, exports, module) {
    var $ = window.Zepto;
    var Base = require('base');
    var Fields = require('FieldLoader');
    var FieldManager = Base.extend({
        attrs: {
            container: 'body'
        },
        initialize: function(config, fieldsMap,charts) {
            FieldManager.superclass.initialize.call(this, config,charts);
            this.$container = $(this.get('container'))
            //this.store = store
            this.fieldsMap = this.structorData(fieldsMap)
            //this.layout = store.layout
            this.instances = {}
            this.charts_instances ={}
            this.charts_fieldsMap = fieldsMap
            this.charts = charts
            this.initInstances();
            this.setTitle();
        },
        initInstances: function() {
            var me = this;
            var fieldsMap = me.fieldsMap;
            var charts_fieldsMap = me.charts_fieldsMap;
            var charts = me.charts
            for(var i in fieldsMap){
                // try {
                    var fieldCfg = fieldsMap[i];
                    var className = me.getFieldClassName(fieldCfg.type); //text => TextCtrl
                    fieldCfg.fieldManager = me;
                    var FieldClass = Fields[className]; //TextCtrl
                    fieldCfg.container = me.$container;
                    fieldCfg.template = $('#f-' + fieldCfg.type + '-tmpl').html();
                    fieldCfg.pure_id = fieldCfg.field_id.substring(1,fieldCfg.field_id.length-1)
					          fieldCfg.tip = '';
					          fieldCfg.color = '';
                    me.instances[fieldCfg.field_id] = new FieldClass(fieldCfg);
                // } catch (e) {
                //     console.log(fieldsMap[i])
                //     console.log(fieldsMap[i].name+"发生了错误！！！name: " + e.name + "message: " + e.message);
                // }
            }
            if(charts){
              var list_item = null
                for(var i in charts){
                  try {
                      var chartCfg = charts[i];
                      if(chartCfg.config.categoryRegion){
                          for(var guid in fieldsMap){
                              var field = fieldsMap[guid];
                              if(field.type === 'list'){
                                  if(field.subFields){
                                      var subField = field.subFields.filter(function (subField) { return subField.guid === chartCfg.config.categoryRegion[0] && subField});
                                      if(subField && subField.length === 1){
                                          list_item = field.pure_id;
                                          break;
                                      }
                                  }
                              }
                          }
                      }
                      var chartType = charts[i].config.chartType;
                      var id = list_item;
                      chartCfg.el ='chart-'+list_item;
                      chartCfg.chartMap = charts_fieldsMap;
                      chartCfg.container = me.$container;
                      var FieldClass = Fields['ChartsCtrl'];
                      me.charts_instances[id] = new FieldClass(chartCfg);
                  } catch (e) {
                      console.log(charts[i])
                      console.log(charts[i].name+"发生了错误！！！name: " + e.name + "message: " + e.message);
                  }
                }
            }
        },
        getFieldClassName: function(type) {
            type = type.replace(/-/g, "");
            type = type.firstUpperCase();
            return type + 'Ctrl';
        },
        structorData: function(fieldsMap) {
            var firstPattern = /\[\{([0-9A-Z]|-){36}\}.\{([0-9A-Z]|-){36}\}\]/g;//匹配sum([{**}.{**}])
        	var secondPattern = /\{([0-9A-Z]|-){36}\}.\{([0-9A-Z]|-){36}\}/g;//匹配{**}.{**}
        	var thirdPattern = /\{([0-9A-Z]|-){36}\}/g;//{**}
            for(var i in fieldsMap){
        		var instance = fieldsMap[i]
        		var _math = instance.math
        		var type 	= instance.type
        		//遍历主表字段（不包含列表字段）
        		if(_math != undefined) {
        				//匹配出SUM[{**}]
        			_math = _math.replace(firstPattern, function(item){
        				//console.log(item)
        				var fieldArr = item.match(thirdPattern)
        				var list_id  = fieldArr[0]
        				var subfield_id  = fieldArr[1]
        				//console.log(list_id, subfield_id)
        				fieldsMap[list_id].subFields.forEach(function(subfield){
        					if(subfield.field_id == subfield_id){
        						if(subfield.effect != undefined){
        							if(subfield.effect.includes(i) === false){
        								subfield.effect.push(i)
        							}
        						}else{
        							subfield.effect = [i]
        						}
        					}
        				})
        				return ''
        			})
        			//匹配出{**}
        			_math = _math.replace(thirdPattern, function(item){
        			    if(item !== i) {
                            if (fieldsMap[item].effect != undefined) {
                                if (fieldsMap[item].effect.includes(i) === false) {
                                    fieldsMap[item].effect.push(i)
                                }
                            } else {
                                fieldsMap[item].effect = [i]
                            }
                        }
        				return ''
        			})
        			//console.log(_math)
        		}
        		if(type == 'list'){//单独处理列表控件
        			instance.subFields.forEach(function(field){
        				var _math = field.math
        				if(_math != undefined) {
        					//console.log('start',_math)
        					//匹配出SUM[{**}]
        					_math = _math.replace(':', ' : ')
        					_math = _math.replace(firstPattern, function(item){
        							//console.log(item)
        						var fieldArr = item.match(thirdPattern)
        						var list_id  = fieldArr[0]
        						var subfield_id  = fieldArr[1]
        						//console.log(list_id, subfield_id)
        						fieldsMap[list_id].subFields.forEach(function(subfield){
        							if(subfield.field_id == subfield_id && item !== i + '.' + field.field_id){
        								if(subfield.effect != undefined){
        									if(subfield.effect.includes(i+'.'+field.field_id) === false){
        										subfield.effect.push(i+'.'+field.field_id)
        									}
        								}else{
        									subfield.effect = [i+'.'+field.field_id]
        								}
        							}
        						})
        						return ''
        					})
        					//console.log(_math)
        					//匹配出{**}.{**}
        					_math = _math.replace(secondPattern, function(item){
        							//console.log(field.name, item)
        						var fieldArr = item.match(thirdPattern)
        						var list_id  = fieldArr[0]
        						var subfield_id  = fieldArr[1]
        						//console.log(list_id, subfield_id)
        						fieldsMap[list_id].subFields.forEach(function(subfield){
        							if(subfield.field_id == subfield_id && item !== i + '.' + field.field_id){
        								if(subfield.effect != undefined){
        									if(subfield.effect.includes(i+'.'+field.field_id) === false){
        										subfield.effect.push(i+'.'+field.field_id)
        									}
        								}else{
        									subfield.effect = [i+'.'+field.field_id]
        								}
        							}
        						})
        						return ''
        					})
        					//console.log(_math)
        					//匹配出{**}
        					_math = _math.replace(thirdPattern, function(item){
        						if(fieldsMap[item]){
	        						if(fieldsMap[item].effect != undefined){
	        							if(fieldsMap[item].effect.includes(i+'.'+field.field_id) === false){
	        								fieldsMap[item].effect.push(i+'.'+field.field_id)
	        							}
	        						}else{
	        							fieldsMap[item].effect = [i+'.'+field.field_id]
	        						}
        						}
        						return ''
        					})
        					//console.log('end',_math)
        				}
        			})
        		}
        	}
            return fieldsMap
        },

        calc: function(field_id, obj_res, list_data) {
            var self = this;
            console.log(field_id+"触发了计算")
            var firstPattern = /\[\{([0-9A-Z]|-){36}\}.\{([0-9A-Z]|-){36}\}\]/g;//匹配sum([{**}.{**}])
    		var secondPattern = /\{([0-9A-Z]|-){36}\}.\{([0-9A-Z]|-){36}\}/g;//匹配{**}.{**}
    		var thirdPattern = /\{([0-9A-Z]|-){36}\}/g;//{**}
    		var fieldsMap = this.fieldsMap
				var calculated_items = [];

    		var translateMath = function(field) {
    			//待回填的字段
    			var effect = field ? field.effect : []
    			effect.forEach(function(item){
    				//待回填的是列表子字段
    				if(item.indexOf('.') != -1){
    					//找到对应子字段的math
    					var id = item.split('.')
    					var list_id = id[0]
    					var subfield_id = id[1]
    					var arr = fieldsMap[list_id].subFields.filter(function(subfield){
    						return subfield.field_id == subfield_id && subfield
    					})
    					var subinstance = arr[0]
    					var _math = subinstance.math
    					_math = _math.replace(':', ' : ')
    					var loop = false;
    					if(calculated_items.indexOf(item) === -1 && subinstance.effect != undefined && subinstance.effect instanceof Array && subinstance.effect.length>0){
    						loop = true
    					}
    					//console.log(_math)
    					//对math执行三步替换
    					//替换sum([{}])
    					_math = _math.replace(firstPattern, function(item){
							var fieldArr = item.match(thirdPattern)
							var list_id  = fieldArr[0]
							var subfield_id  = fieldArr[1]
							var sum = []
							fieldsMap[list_id].value.forEach(function(row){
                                if(row.data instanceof Array){
                                    row.data.forEach(function(field){
                                        if(field.field_id == subfield_id){
                                            var value = field.value
            								sum.push(value?value:0)
                                            return false;
                                        }
                                    })
                                }else{
                                    var value = row.data[subfield_id].value
    								sum.push(value?value:0)
                                }
							})
							sum = sum.join(',')
							sum = sum.substring(0,sum.length)
							return sum?sum:0
    					})
    					//替换{}.{}
    					fieldsMap[list_id].value.forEach(function(row){
    						//console.log(_math)
    						var self_math = _math
    						self_math = self_math.replace(secondPattern, function(item){
    							var fieldArr = item.match(thirdPattern)
    							var list_id  = fieldArr[0]
    							var subfield_id  = fieldArr[1]

                                if(row.data instanceof Array){
                                    var value = 0;
                                    var b_number = false;
                                    row.data.forEach(function(field){
                                        if(field.field_id == subfield_id){
                                            value = field.value
                                            var arr = fieldsMap[list_id].subFields.filter(function(subfield){
                                                return subfield.field_id == subfield_id && subfield
                                            })
                                            var subfield = arr[0];
                                            var b_number = ['number', 'currency'].indexOf(subfield['type']) !== -1;
                                            return false;
                                        }
                                    })
                                    return b_number ? (value ? value : 0) : (value ? "'" + value + "'" : "''");
                                }else{
                                    var value = row.data[subfield_id].value;
                                    var arr = fieldsMap[list_id].subFields.filter(function(subfield){
                                        return subfield.field_id == subfield_id && subfield
                                    })
                                    var subfield = arr[0];
                                    var b_number = ['number', 'currency'].indexOf(subfield['type']) !== -1;
                                    return b_number ? (value ? value : 0) : (value ? "'" + value + "'" : "''");
                                }
    						})
    						//替换{}
    						var final_math = self_math
    						final_math = final_math.replace(thirdPattern, function(field){
    													if(fieldsMap[field]){
                                var b_number = ['number', 'currency'].indexOf(fieldsMap[field]['type']) !== -1;
                                var value = fieldsMap[field].value;
    							return b_number ? (value ? value : 0) : (value ? "'" + value + "'" : "''");
    												}
    						});
    						final_math = final_math.toLowerCase()
    						var res = '';//math.eval(final_math)
                            try{
                                res = math.eval(final_math)
                            }catch(e){
                                try{
                                    res = eval(final_math)
                                }catch(e){
                                    res = final_math
                                }
                            }
                            if(row.data instanceof Array){
                                row.data.forEach(function(field){
                                    if(field.field_id == subfield_id){
                                        field.value = res
                                    }
                                })
                            }else{
                                row.data[subfield_id].value = res
                            }
                            // //对象更新dom
                            // $.isFunction(self.instances[list_id].reRender) && self.instances[list_id].reRender(fieldsMap[list_id].value)
                            if(subinstance.trigger != undefined && subinstance.trigger == true){
                                obj_res.trigger = true;
                                var obj_find = obj_res.triggerFields.filter(function(field){
                                    return field.field_id == subfield_id && field.index === row.index && field
                                })
                                if(!obj_find || !obj_find.length){
                                    obj_res.triggerFields.push({field_id: subfield_id, index: row.index});
                                }
                            }
    					})
                        //对象更新dom
                        if($.isFunction(self.instances[list_id].reRender)){
                            self.instances[list_id]._config.value = fieldsMap[list_id].value;
                            self.instances[list_id].reRender(self.instances[list_id]._config);
                        }
                        // $.isFunction(self.instances[list_id].reRender) && self.instances[list_id].reRender(fieldsMap[list_id])
    					if(loop == true){
    						calculated_items.push(item);
    						translateMath(subinstance)
    					}
    				}else{//待回填的是主字段
    					var _math = fieldsMap[item].math
    					var loop = false;
    					if(calculated_items.indexOf(item) === -1 && fieldsMap[item].effect != undefined && fieldsMap[item].effect instanceof Array && fieldsMap[item].effect.length>0){
    						loop = true
    					}
    					_math = _math.replace(firstPattern, function(item){
							var fieldArr = item.match(thirdPattern)
							var list_id  = fieldArr[0]
							var subfield_id  = fieldArr[1]
							var sum = []
							fieldsMap[list_id].value.forEach(function(row){
                                if(row.data instanceof Array){
                                    row.data.forEach(function(field){
                                        if(field.field_id == subfield_id){
                                            var value = field.value
            								sum.push(value?value:0)
                                            return false;
                                        }
                                    })
                                }else{
                                    var value = row.data[subfield_id].value
    								sum.push(value?value:0)
                                }
							})
							sum = sum.join(',')
							sum = sum.substring(0,sum.length)
							return sum?sum:0
    					})
    					_math = _math.replace(thirdPattern, function(item){
    					    var b_number = ['number', 'currency'].indexOf(fieldsMap[item]['type']) !== -1;
    					    var value = fieldsMap[item].value;
    						return b_number ? (value ? value : 0) : (value ? "'" + value + "'" : "''");//fieldsMap[item].value ? fieldsMap[item].value : 0
    					})

                        var res = '';//math.eval(_math)
                        try{
                            res = math.eval(_math)
                        }catch(e){
                            try{
                                res = eval(_math)
                            }catch(e){
                                res = _math
                            }
                        }
                        //对象更新值
                        fieldsMap[item].value = res
                        //对象更新dom
                        // $.isFunction(self.instances[item].reRender) && self.instances[item].reRender(res)
                        if($.isFunction(self.instances[item].reRender)){
                            self.instances[item]._config.value = res;
                            self.instances[item].reRender(self.instances[item]._config);
                        }
                        // $.isFunction(self.instances[item].reRender) && self.instances[item].reRender(fieldsMap[item])

                        if(fieldsMap[item].trigger != undefined && fieldsMap[item].trigger == true){
                            obj_res.trigger = true;
                            var obj_find = obj_res.triggerFields.filter(function(field){
                                return field.field_id == item && field
                            })
                            if(!obj_find || !obj_find.length){
                                obj_res.triggerFields.push({field_id: item, index: 1});
                            }
                        }
    					if(loop == true){
    						calculated_items.push(item)
    						translateMath(fieldsMap[item])
    					}
    				}
    			})
    		}
    		if(field_id.indexOf('.') != -1){//由列表字段子字段触发
				var id = field_id.split('.')
				var list_id = id[0]
				var subfield_id = id[1]
				var list_instance = fieldsMap[list_id]
                if(list_data) {
                    list_instance.value.forEach(function (row) {
                        if (row.index === list_data.index) {
                            row.data = list_data.data;
                            return false;
                        }
                    })
                }
				list_instance.subFields.forEach(function(field){
					if(field.field_id == subfield_id){
						translateMath(field)
                        return false;
					}
				})
    		}else{//由主表字段触发
				var field = fieldsMap[field_id]
                //console.log(field)
				translateMath(field)
    		}
        },
        validate: function(){
            var me = this;
            var isOk = true;
            for(i in me.instances){
				if($.isFunction(me.instances[i].validate)){
					var isValidate = me.instances[i].validate()
					if(isValidate === false){
						isOk = false
						//console.log(me.instances[i]._config.name)
						return false;
					}
				}
            }
            return isOk
        },
        getDataFromStore:function(){
            var fieldsMap = store.fieldsMap
            var data = []
            for(var i in fieldsMap) {
                var type  = fieldsMap[i].type;
                if(type == 'list'){
                    var value = fieldsMap[i].value
                        for(var j in value) {
                            delete value[j].actions
                        }
                    // value.forEach(item=>{
                    //     delete item.actions
                    // })
                    data.push({
                        field_id: i,
                        value:value
                    })
                }else{
                    data.push({
                        field_id: i,
                        value: fieldsMap[i].value
                    })
                }
            }
            return data
        },
        triggerByManu:function(key){
          // console.log((decodeURI(name)))
          	var self = this;
            var funcName = store.formInfo.manu[key]
            var formInfo = store.formInfo
            var formId = formInfo.formId,
                userid = formInfo.userid,
                time = formInfo.time,
                type = formInfo.type,
                did = formInfo.did,
                run_id = formInfo.run_id,
                flow_id = formInfo.flow_id,
                prcs_key_id = formInfo.prcs_key_id,
                prcs_id = formInfo.prcs_id,
                flow_prcs = formInfo.flow_prcs;
                console.log(self.getData())
            var data = JSON.stringify(self.getData());
                $.ajax({
               type: "POST",
               url: "/general/appbuilder/web/appcenter/appdata/exec",
               async: false,
               data: {
                   formId:formId,
                   userid:userid,
                   time:time,
                   flow_prcs:flow_prcs,
                   type:type,
                   apptime: 'MANU',
                   data:data,
                   funcName: funcName,
                   fields: [],
                   did:did,
                   run_key:store.run_key,
                   all_page: store.all_page,
                   run_id:run_id,
                   prcs_id:prcs_id
               },
               success: function(response) {
                 if(response.status != 'ok'){
                     alert(response.message)
                     return false
                 }else{
           var new_fieldsMap = response.data;
           //对象更新dom
           for(var i in new_fieldsMap){
             // new_fieldsMap[i].pure_id = new_fieldsMap[i].field_id.substring(1,new_fieldsMap[i].field_id.length-1);
             // new_fieldsMap[i].tip = new_fieldsMap[i].tip ? new_fieldsMap[i].tip : '';
             // new_fieldsMap[i].color = new_fieldsMap[i].color ? new_fieldsMap[i].color : '';
             // $.isFunction(self.instances[i].reRender) && self.instances[i].reRender(new_fieldsMap[i]);
               if(self.instances[i].reRender){
                   self.instances[i]._config.gatherData = new_fieldsMap[i].gatherData ? new_fieldsMap[i].gatherData: [];
                   self.instances[i]._config.totalCount = new_fieldsMap[i].totalCount ? new_fieldsMap[i].totalCount: '0';
                   self.instances[i]._config.value = new_fieldsMap[i].value;
                   self.instances[i]._config.tip = new_fieldsMap[i].tip ? new_fieldsMap[i].tip : '';
                   self.instances[i]._config.color = new_fieldsMap[i].color ? new_fieldsMap[i].color : '';
                   self.instances[i]._config.options = new_fieldsMap[i].options ? new_fieldsMap[i].options : [];
                   self.instances[i].reRender(self.instances[i]._config)
               }
           }
           //触发器修改列表后图表重新渲染
           $.each(self.charts_instances, function (i, field) {
             $.isFunction(self.charts_instances[i].reRender) && self.charts_instances[i].reRender()
           })
           if($('.ui-form-tips').length > 0){
             $('.ui-container').scrollTop($('.ui-form-tips').eq(0).offset().top-100)
           }
           setTimeout(function(){
             $('.ui-form-tips').hide()
           },3000)
}
               }
           })



        },
        exec: function(data, callback){
			var self = this;
            //获取表单信息
            var formInfo = store.formInfo
    		var formId = formInfo.formId,
                userid = formInfo.userid,
                time = formInfo.time,
                type = formInfo.type,
				did = formInfo.did,
                run_id = formInfo.run_id,
                flow_id = formInfo.flow_id,
                prcs_key_id = formInfo.prcs_key_id,
                prcs_id = formInfo.prcs_id,
                flow_prcs = formInfo.flow_prcs;
            $.ajax({
                url: '/general/appbuilder/web/appcenter/appdata/exec',
                type: "post",
                data: {
                    formId: formId,
                    userid: userid,
					did: did,
                    time: time,
                    flow_prcs: flow_prcs,
                    type: type,
                    apptime: 'BEFORESAVE',
                    data: data,
                    fields: null,
                    run_key:store.run_key,
                    all_page: store.all_page
                },
                success: function (response) {
                    if(response.status != 'ok'){
                        alert(response.message)
                        return false
                    }
                    if(response.checkError == true){
						if(response.notValidateSave){
							//验证未通过仍保存
							callback()
						}else{
							//验证未通过不保存
							alert('数据验证未通过，不允许保存！')
							var new_fieldsMap = response.data;
							//对象更新dom
							for(var i in new_fieldsMap){
								// new_fieldsMap[i].pure_id = new_fieldsMap[i].field_id.substring(1,new_fieldsMap[i].field_id.length-1);
								// new_fieldsMap[i].tip = new_fieldsMap[i].tip ? new_fieldsMap[i].tip : '';
								// new_fieldsMap[i].color = new_fieldsMap[i].color ? new_fieldsMap[i].color : '';
								// $.isFunction(self.instances[i].reRender) && self.instances[i].reRender(new_fieldsMap[i]);
                                if(self.instances[i].reRender){
                                    self.instances[i]._config.gatherData = new_fieldsMap[i].gatherData ? new_fieldsMap[i].gatherData: [];
                                    self.instances[i]._config.totalCount = new_fieldsMap[i].totalCount ? new_fieldsMap[i].totalCount: '0';
                                    self.instances[i]._config.value = new_fieldsMap[i].value;
                                    self.instances[i]._config.tip = new_fieldsMap[i].tip ? new_fieldsMap[i].tip : '';
                                    self.instances[i]._config.color = new_fieldsMap[i].color ? new_fieldsMap[i].color : '';
                                    self.instances[i]._config.options = new_fieldsMap[i].options ? new_fieldsMap[i].options : [];
                                    self.instances[i].reRender(self.instances[i]._config)
                                }
							}
              //触发器修改列表后图表重新渲染
              $.each(self.charts_instances, function (i, field) {
                $.isFunction(self.charts_instances[i].reRender) && self.charts_instances[i].reRender()
              })
							if($('.ui-form-tips').length > 0){
								$('.ui-container').scrollTop($('.ui-form-tips').eq(0).offset().top-100)
							}
							setTimeout(function(){
								$('.ui-form-tips').hide()
							},5000)
						}
                    }else{
                        //继续保存
                        callback()
                    }
                },
                error: function (request, strError) {
                    alert('保存前触发器执行失败');
                },
                async: false
            });
        },
        triggerTrig:function(cfg, triggerFields){
			// console.log(cfg.name+cfg.index+"的triggerTrig触发了");
            var self = this;
            var all_data = self.getData();
            var formInfo = store.formInfo;
    		var formId = formInfo.formId,
                userid = formInfo.userid,
                time = formInfo.time,
				did = formInfo.did,
                type = formInfo.type,
                flow_prcs = formInfo.flow_prcs;
            var data_arr = [];
            var list_id = '';
			if(cfg && (cfg.subFields || cfg.trig_field_id)){//如果是列表控件子控件
				if(cfg.data) {//lhs 18.8.28
                    list_id = cfg.field_id;
                    var list_linesdata = self.instances[cfg.field_id].getValue();//store.fieldsMap[cfg.field_id].value;
                    var new_field_data = {};
                    //遍历列表控件新增一行的子字段
                    $.each(cfg.data, function (i, data) {
                        new_field_data[data.field_id] = {
                            field_id: data.field_id,
                            value: data.value
                        };
                    })
                    if (list_linesdata.length > 0) {
                        list_linesdata.forEach(function(row, idx){
                            if(row.index == cfg.index){
                                // new_list_linesdata.push({'index': row.index, 'data': new_field_data});
                                row.data = new_field_data;
                            }else{
                                // new_list_linesdata.push(row);
                            }
                        });
                        // var b_edit = false;//是否是修改
                        // $.each(list_linesdata, function (i, line) {
                        //     if (line.index == cfg.index) {
                        //         b_edit = true;
                        //         list_linesdata[i]["data"] = new_field_data;
                        //         return false;
                        //     }
                        //     // $.each(line.data,function(i,data){
                        //     //     old_list_data.push({
                        //     //         field_id: data.field_id,
                        //     //         value: data.value
                        //     //     })
                        //     // })
                        //     // line_data.push({
                        //     //     index: line.index,
                        //     //     flag: line.flag,
                        //     //     data: old_list_data
                        //     // })
                        // })
                        // if (!b_edit) {//添加
                        //     list_linesdata.push({
                        //         index: cfg.index,
                        //         flag: cfg.flag,
                        //         data: new_field_data
                        //     });
                        // }
                    } else {
                        list_linesdata = [{
                            index: cfg.index,
                            flag: cfg.flag,
                            data: new_field_data
                        }];
                    }
                    data_arr.push({
                        field_id: cfg.field_id,
                        value: list_linesdata
                    })
                }
				/*var line_data =[];
				var old_list_data = [];
				if(cfg.flag == "new" && cfg.index != "0"){  //新建触发的
					// 遍历已有的列表行
					if(list_linesdata.length > 0){
						$.each(list_linesdata,function(i,line){

							$.each(line.data,function(i,data){
								old_list_data.push({
									field_id: data.field_id,
									value: data.value
								})
							})
							line_data.push({
								index: line.index,
								flag: line.flag,
								data: old_list_data
							})
						})
					}else{
						var new_field_data = [];
						//遍历列表控件新增一行的子字段
						$.each(cfg.data,function(i,data){
							new_field_data.push({
								field_id: data.field_id,
								value: data.value
							})
						})
						line_data.push({
							index: cfg.index,
							flag: cfg.flag,
							data: new_field_data
						})
					}
				}else{ //编辑已有行触发的
					$.each(list_linesdata,function(i,line){
						if(line.index == cfg.index){
							var edit_list_data = [];
							$.each(cfg.data,function(i,data){
								edit_list_data.push({
									field_id: data.field_id,
									value: data.value
								})
							})
							line_data.push({
								index: line.index,
								flag: line.flag,
								data: edit_list_data
							})
						}else{
							$.each(line.data,function(i,data){
								old_list_data.push({
									field_id: data.field_id,
									value: data.value
								})
							})
							line_data.push({
								index: line.index,
								flag: line.flag,
								data: old_list_data
							})
						}
					})
				}

				data_arr.push({
					field_id: cfg.field_id,
					value:line_data
				})*/
			}else{//如果是主表控件
				// for (var i in store.fieldsMap){
				// 	data_arr.push({
				// 		field_id: i,
				// 		value: store.fieldsMap[i].value
				// 	})
				// }
			}
			if(data_arr.length) {//lhs 18.08.28
                $.each(all_data, function (i, field) {
                    if (field.field_id == data_arr[0].field_id) {
                        field.value = data_arr[0].value;
                        return false;//lhs 18.08.28
                    }
                })
            }
            var fields = [];
			if(triggerFields){
                fields = triggerFields;
            }else if(cfg instanceof Array){
                fields = cfg;
            }else if(cfg.subFields || cfg.trig_field_id){//如果是列表控件子控件
				//for(var i=0; i<cfg.data.length;i++){
				if(cfg.trig_field_id) {
					if(typeof cfg.trig_field_id == "string") {
                        fields.push(
                            {
                                field_id: cfg.trig_field_id,
                                index: cfg.index
                            }
                        );
					}else if(typeof cfg.trig_field_id == "object"){
						$.each(cfg.trig_field_id, function (idx, field) {
                            fields.push(
                                {
                                    field_id: field,
                                    index: cfg.index
                                }
                            );
                        });
                    }
                }else if(cfg.add_edit_delete_trigger_fields){
					fields = cfg.add_edit_delete_trigger_fields;
				}
			}else if(cfg){//如果是主表控件
				fields = [
					 {
						 field_id: cfg.field_id,    //主表字段id
						 index: 1                   //主表列表行数
					 }
				]
			}
            $.ajax({
                url: '/general/appbuilder/web/appcenter/appdata/exec',
                type: "post",
                data: {
                    formId: formId,
                    userid: userid,
                    time: time,
					did: did,
                    flow_prcs: flow_prcs,
                    type: type,
                    apptime: 'CHANGE',
                    data: JSON.stringify(all_data),  	//所有字段的数据
                    fields: JSON.stringify(fields),	    //促发字段的数据
                    run_key:store.run_key,
                    all_page: store.all_page,
                    run_id: formInfo.run_id,
                    prcs_id: formInfo.prcs_id
                },
                success: function (response) {
                    if(response.status != 'ok'){
                        alert(response.message)
                        return false
                    }
                    //这里不作验证提示 lhs 18.8.31
                    // if(response.checkError == true){
                    //     alert('数据验证未通过，不允许保存！')
                    //
                    // }
					var new_fieldsMap = response.data;

					//对象更新dom
					for(var i in new_fieldsMap){
					    if(1 || !list_id || list_id == i) {
                            // new_fieldsMap[i].pure_id = new_fieldsMap[i].field_id.substring(1, new_fieldsMap[i].field_id.length - 1);
                            // new_fieldsMap[i].tip = new_fieldsMap[i].tip ? new_fieldsMap[i].tip : '';
                            // new_fieldsMap[i].color = new_fieldsMap[i].color ? new_fieldsMap[i].color : '';
                            if(self.instances[i].reRender){
                                self.instances[i]._config.gatherData = new_fieldsMap[i].gatherData ? new_fieldsMap[i].gatherData: [];
                                self.instances[i]._config.totalCount = new_fieldsMap[i].totalCount ? new_fieldsMap[i].totalCount: '0';
                                self.instances[i]._config.value = new_fieldsMap[i].value;
                                self.instances[i]._config.tip = new_fieldsMap[i].tip ? new_fieldsMap[i].tip : '';
                                self.instances[i]._config.color = new_fieldsMap[i].color ? new_fieldsMap[i].color : '';
                                self.instances[i]._config.options = new_fieldsMap[i].options ? new_fieldsMap[i].options : [];
                                self.instances[i].reRender(self.instances[i]._config)
                            }
                            //以下会破坏字段的触发关系
                            // $.isFunction(self.instances[i].reRender) && self.instances[i].reRender(new_fieldsMap[i]);

                            // if(list_id) return false;
                        }
					}
          //触发器修改列表后图表重新渲染
          $.each(self.charts_instances, function (i, field) {
            $.isFunction(self.charts_instances[i].reRender) && self.charts_instances[i].reRender()
          })
					if($('.ui-form-tips').length > 0){
						$('.ui-container').scrollTop($('.ui-form-tips').eq(0).offset().top-100)
					}
					setTimeout(function(){
						$('.ui-form-tips').hide()
					},3000)

                },
                error: function (request, strError) {
                    alert('条件触发执行失败');
                },
                async: false
            });
        },
        getData: function(short_data){
            var me = this;
            var data = [];
            var i_idx = 0;
            var flow_id = store.formInfo.flow_id;
            for(i in me.instances){
                // data.push({
                //     field_id: me.instances[i]._config.field_id,
                //     value: $.isFunction(me.instances[i].getValue) && me.instances[i].getValue()
                // })
                data[i_idx++] = {
                        field_id: me.instances[i]._config.field_id,
                        value: $.isFunction(me.instances[i].getValue) && me.instances[i].getValue()
                    }
                    if(short_data && (me.instances[i]._config.type == 'autoNumber' || me.instances[i]._config.asTitle || flow_id > 0)){
                        short_data.push({
                            field_id: me.instances[i]._config.field_id,
                            value: $.isFunction(me.instances[i].getValue) && me.instances[i].getValue()
                        });
                    }
            }
            return data
        },
        save: function(callback) {
            //$("textarea").blur();
            $(document.activeElement).blur();
            var self = this;
            //验证未通过返回
            var isOk = this.validate();
			         console.log(isOk)
            if(isOk === false){return;}
            //获取表单数据
            var short_data = [];
            var form_data = JSON.stringify(this.getData(short_data));
            //var data = this.getData();
            //获取表单信息
            var formInfo = store.formInfo
    		var formId = formInfo.formId,
                userid = formInfo.userid,
                time = formInfo.time,
                type = formInfo.type,
                run_id = formInfo.run_id,
                flow_id = formInfo.flow_id,
				        did = formInfo.did,
                prcs_key_id = formInfo.prcs_key_id,
                prcs_id = formInfo.prcs_id,
                flow_prcs = formInfo.flow_prcs,
                triggerBeforeSave = formInfo.triggerBeforeSave,
                signcontent = store.signcontent,
                signattchment = store.signattchment;
                if(signattchment == undefined || signattchment == 'undefined'){
                    signattchment = '';
                }
            //定义保存ajax
            var ajaxSave = function(){
                if(store.debug){
                    console.log('save',data)
                }else{
                    $.ajax({
                        url: '/general/appbuilder/web/appcenter/appdata/save',
                        type: "post",
                        dataType: "json",
                        data: {
                            formId: formId,
    						userid: userid,
    						time: time,
    						type: type,
							did: did,
    						run_id: run_id,
    						prcs_key_id: prcs_key_id,
    						prcs_id: prcs_id,
    						flow_prcs: flow_prcs,
    						data: form_data,
    						signcontent: signcontent,
							title: self.getTitle(),
                            attachment: signattchment,//self.getSignAttachment(),
                            run_key:store.run_key,
                            all_page: store.all_page
                        },
                        beforeSend: function(){
                            $.ProLoading.show('正在保存')
                        },
                        success: function (response) {
                            $.ProLoading.hide()
                            if(response.status != 'ok'){
                                alert(response.message)
                                return false
                            }else{
                                var data = response.data;
                                var new_formInfo = data.formInfo;//,
                                for(var i in new_formInfo){
                                    formInfo[i] = new_formInfo[i];
                                }
                                //  charts = data.layout.charts;
                                store.setFormInfo(formInfo)
                                 //  store.setCharts(charts)
								// store.setFieldsMap(data.fieldsMap)
								//store.renderForm();
                                self.setTitle();

                                if(formInfo.can_feedback && (signcontent || signattchment && signattchment.length > 0)){//formInfo.flow_id > 0) {
                                    $.ajax({
                                        type: 'GET',
                                        url: '/general/appbuilder/web/appcenter/appdata/fetchcomment',
                                        cache: false,
                                        // data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs, 'OP_FLAG': q_op_flag},
                                        data: {
                                            'formId': formId,
                                            'run_id': formInfo.run_id,
                                            'prcs_id': formInfo.prcs_id,
                                            'flow_prcs': formInfo.flow_prcs
                                        },
                                        success: function (response) {
                                            store.signcontent = '';
                                            $("#signcontent").val("");
                                            $("#editSignBox").html('');
                                            $("#sign_suggest .ui-attach-file").html('');
                                            if (response.status != "ok") {
                                                console.log(response.message)
                                                return false
                                            }
                                            if (response.data.data instanceof Object == false) {
                                                alert('获取会签数据格式错误')
                                                return false
                                            } else {
                                                $('#editSignBox').html('')
                                                var signtmpl = $('#sign-tmpl').html();
                                                if (response.data.data.length > 0) {
                                                    var loop = function (data, $container) {
                                                        data.has_prc_id = data.prcs_id != undefined ? true : false
                                                        data['prcs_id'] = data.prcs_id != undefined ? data.prcs_id : ''
                                                        $container.append($.parseTpl(signtmpl, data));
                                                        if (data.replys) {
                                                            var _$container = $("#sign-list-" + data.feed_id)
                                                            data.replys.forEach(function (item) {
                                                                loop(item, _$container)
                                                            })
                                                        }
                                                    }
                                                    var $container = $('#editSignBox')
                                                    response.data.data.forEach(function (item) {
                                                        loop(item, $container)
                                                    })
                                                    $('#editSignBox').find('.ui-attach-file').delegate('i.ui-icon-close-progress', 'tap', function(e) {
                                                        e.stopPropagation();
                                                        var attach_id = $(this).parent('.ui-attch-file-wrap').attr('data-id');
                                                        $(this).parent('a.ui-attch-file-wrap').remove();
                                                        return false
                                                    })
                                                }
                                            }
                                        }
                                    });
                                }

                                $.tips({
                                    content:'保存成功',
                                    stayTime:2000,
                                    type:"success"
                                });
                                /* setTimeout(function(){
                                    window.history.back()
                                },2000); */
                                callback && callback()
                            }

                        },
                        error: function (request, strError) {
                            $.ProLoading.hide()
                            alert(strError);
                        },
                        async: false
                    });
                }
            }
            //保存前如果triggerBeforeSave为true,先调用 exec 接口 type 为 "beforesave"
    		if(triggerBeforeSave){
                self.exec(form_data, function(){
                    if(!formInfo.b_trace) {
                        form_data = JSON.stringify(short_data)
                    }
                    ajaxSave()
                })
            }else{
                ajaxSave()
            }
        },
        ajaxToTrans: function() {//一键转交
            var Trans = function(){
                //获取表单信息
                var formInfo = store.formInfo
        		var formId = formInfo.formId,
                    run_id = formInfo.run_id,
                    prcs_id = formInfo.prcs_id,
                    prcs_key_id = formInfo.prcs_key_id,
                    flow_prcs = formInfo.flow_prcs,
                    run_key = store.run_key;
                $.ajax({
                    type: 'GET',
                    url: './../../general/appbuilder/web/appcenter/appdata/onetrans',
                    cache: false,
                    data: {
                        formId:formId,
						            run_id:run_id,
						            prcs_key_id:prcs_key_id,
						            prcs_id:prcs_id,
						            flow_prcs:flow_prcs,
                        run_key:run_key
                    },
                    success: function(response)
                    {
                        console.log(response)
                        if(response.status == 'ok') {
                            window.history.back();
                        }else{
                            showMessage(response.message);
                        }
                    },
                    error: function(data, strError){
                    	if(strError != "abort") {
                            showMessage("获取失败" + strError);
                        }
                    },
					asyn: false
                });
            }
            this.save(Trans);
        },
        turn: function() {
            var turn = function(){
                //获取表单信息
                var formInfo = store.formInfo
        		var formId = formInfo.formId,
                    userid = formInfo.userid,
                    time = formInfo.time,
                    type = formInfo.type,
                    run_id = formInfo.run_id,
					did = formInfo.did,
                    run_name = formInfo.run_name,
                    begin_user = formInfo.begin_user,
                    flow_id = formInfo.flow_id,
                    prcs_key_id = formInfo.prcs_key_id,
                    prcs_id = formInfo.prcs_id,
                    flow_prcs = formInfo.flow_prcs;

                $.ajax({
                    type: 'GET',
                    url: './../approve_center/turn.php',
                    cache: false,
                    data: {
                        'RUN_ID': run_id,
                        'FLOW_ID': flow_id,
						'did': did,
                        'PRCS_ID': prcs_id,
                        'FLOW_PRCS': flow_prcs,
                        'PRCS_KEY_ID':prcs_key_id,
                        'FLOW_TYPE': '1',
                        'RUN_NAME': run_name,
                        'BEGIN_USER': begin_user
                    },
                    success: function(data)
                    {
                        if (data == "NOEDITPRIV") {
                            showMessage(noeditpriv);
                            return;
                        } else if (data == "NOSIGNFLOWPRIV") {
                            showMessage(nosignflowpriv);
                            return;
                        } else if (data == "NORIGHTNEXTPRCS") {
                            showMessage(norightnextprcs);
                            return;
                        } else if (data == "NOSETNEWPRCS") {
                            showMessage(norightnextprcs);
                            return;
                        } else if (data.indexOf("noMeetCondition") >= 0) {
                            showMessage(data.substr(16));
                            return;
                        }

                        pages.to('turn');
                        console.log("turn :" + data)
                        $("#scroller_turn").empty().append(data);
                        $("#scroller_turn .view-cy-item").parent().hide()//移动端暂不支持传阅人
                    },
                    error: function(data, strError){
                    	if(strError != "abort") {
                            showMessage("获取失败" + strError);
                        }
                    },
					asyn: false
                });
            }
            this.save(turn);
        },
        back: function() {
            var back = function(){
                var formInfo = store.formInfo
        		var formId = formInfo.formId,
                    userid = formInfo.userid,
                    time = formInfo.time,
                    type = formInfo.type,
                    run_id = formInfo.run_id,
                    flow_id = formInfo.flow_id,
                    prcs_key_id = formInfo.prcs_key_id,
                    prcs_id = formInfo.prcs_id,
                    flow_prcs = formInfo.flow_prcs;
                $.ajax({
            		type : "GET",
            		url : "/pda/approve_center/sel_back.php",
            		cache : false,
            		data : {
            			"RUN_ID" : run_id,
            			"FLOW_ID" : flow_id,
            			"PRCS_ID" : prcs_id,
            			"FLOW_PRCS" : flow_prcs,
                        "PRCS_KEY_ID" : prcs_key_id
            		},
            		beforeSend : function() {
            			$.ProLoading.show('正在退回');
            		},
            		success : function(data) {
            			$.ProLoading.hide();
            			pages.to('back_work');
            			$("#scroller_back_work").empty().append(data);
            		},
            		error : function(data) {
            			$.ProLoading.hide();
            			showMessage("退回失败");
            		},
                    async: false
            	});
            }
            //this.save(back)
			back();//退回不保存
        },
		//会签办理完毕
        stopWorkFlow: function(type) {
			var stop = function(){
				var stopType = type;
				var feedback_content = store.signcontent;
				$.ajax({
					type: 'GET',
					url: '/pda/approve_center/stop.php',
					cache: false,
					data: { 'RUN_ID': store.formInfo.run_id, 'FLOW_ID': store.formInfo.flow_id, 'PRCS_ID': store.formInfo.prcs_id, 'FLOW_PRCS': store.formInfo.flow_prcs, 'PRCS_KEY_ID': store.formInfo.prcs_key_id, 'top_flag': store.formInfo.top_flag, 'feedback_content': feedback_content, 'stop_type': stopType },
					beforeSend: function() {
						$.ProLoading.show();
					},
					success: function(data) {
						$.ProLoading.hide();
						if (data == "NOSUBEDITPRIV") {
							showMessage(nosubeditpriv);
							return;
						} else if (data == "WORKDONECOMPLETE") {
							showMessage(workdonecomplete);
							setTimeout("back2list('" + workdonecomplete + "')", 1000);
							return;
						} else if (data == "SIGNISNOTEMPTY") {
							showMessage(signisnotempty);
							return;
						} else if (data == "TURNNEXT") {
							turnWorkFlow('stop');
							return;
						}
					},
					error: function(data) {
						$.ProLoading.hide();
						showMessage("获取失败");
					},
                    async: false
				});
			}
			this.save(stop);
		},
    defaults:{
            pageNo:1, //当前页
            totalPage:null,//页码
            pageSize:15,//一页几条
            totalSize:null,//总记录数,
            trigger_data:null,//触发器数据
            _columns:[],
            option_val:''//查询字段
        },
		//选择数据
        dataList:function(cfg,search_expr){
            // console.log(cfg.name+cfg.index+"选择数据");
            var self = this;
            var all_data = self.getData();
            var formInfo = store.formInfo;
            var formId = formInfo.formId,
                userid = formInfo.userid,
                time = formInfo.time,
                did = formInfo.did,
                type = formInfo.type,
                flow_prcs = formInfo.flow_prcs;
            var data_arr = [];
            self.defaults.trigger_data = cfg
            if(cfg.subFields || cfg.trig_field_id ){//如果是列表控件子控件
                if(cfg.data) {//lhs 18.8.28
                    var list_linesdata = self.instances[cfg.field_id].getValue();//store.fieldsMap[cfg.field_id].value;
                    var new_field_data = {};
                    //遍历列表控件新增一行的子字段
                    $.each(cfg.data, function (i, data) {
                        new_field_data[data.field_id] = {
                            field_id: data.field_id,
                            value: data.value
                        };
                    })
                    if (list_linesdata.length > 0) {
                        var b_edit = false;//是否是修改
                        $.each(list_linesdata, function (i, line) {
                            if (line.index == cfg.index) {
                                b_edit = true;
                                list_linesdata[i]["data"] = new_field_data;
                                return false;
                            }
                            // $.each(line.data,function(i,data){
                            //     old_list_data.push({
                            //         field_id: data.field_id,
                            //         value: data.value
                            //     })
                            // })
                            // line_data.push({
                            //     index: line.index,
                            //     flag: line.flag,
                            //     data: old_list_data
                            // })
                        })
                        if (!b_edit) {//添加
                            list_linesdata.push({
                                index: cfg.index,
                                flag: cfg.flag,
                                data: new_field_data
                            });
                        }
                    } else {
                        list_linesdata = [{
                            index: cfg.index,
                            flag: cfg.flag,
                            data: new_field_data
                        }];
                    }
                    data_arr.push({
                        field_id: cfg.field_id,
                        value: list_linesdata
                    })
                }
            }else{//如果是主表控件
                for (var i in store.fieldsMap){
                    data_arr.push({
                        field_id: i,
                        value: store.fieldsMap[i].value
                    })
                }
            }
            if(data_arr.length) {//lhs 18.08.28
                $.each(all_data, function (i, field) {
                    if (field.field_id == data_arr[0].field_id) {
                        field.value = data_arr[0].value;
                        return false;//lhs 18.08.28
                    }
                })
            }
            var fields = [];
            if(cfg.subFields || cfg.trig_field_id){//如果是列表控件子控件
                //for(var i=0; i<cfg.data.length;i++){
                if(cfg.trig_field_id) {
                    fields.push(
                        {
                            field_id: cfg.trig_field_id,
                            index: cfg.index
                        }
                    )
                }else if(cfg.add_edit_delete_trigger_fields){
                    fields = cfg.add_edit_delete_trigger_fields;
                }
                //}

            }else{//如果是主表控件
                fields = [
                    {
                        field_id: cfg.field_id,    //主表字段id
                        index: 1                   //主表列表行数
                    }
                ]
            }
            $.ajax({
                url: '/general/appbuilder/web/appcenter/appdata/datalist',
                type: "post",
                data: {
                    formId: formId,
                    userid: userid,
                    time: time,
                    did: did,
                    flow_prcs: flow_prcs,
                    search_expr:search_expr||'',
                    search_type:[self.defaults.option_val],
                    type: type,
                    page:self.defaults.pageNo,
                    pageSize:self.defaults.pageSize,
                    run_key:store.run_key,
                    data: JSON.stringify(all_data),  	//所有字段的数据
                    arr_field: JSON.stringify(fields)	    //促发字段的数据
                },
                success: function (response) {
                    if(response.status != 'ok'){
                        alert(response.message)
                        return false
                    }
                    var data = response.data
                    self.pageinit(data)
                },
                error: function (request, strError) {
                    alert('执行数据选择失败');
                }
            });
        },
        pageinit:function(data){//解析数据
            var self = this;
            self.defaults.totalSize = data.total_count;
            self.defaults.pageSize = data.pageSize;
            self.defaults.totalPage = self.pageCount(data.total_count,data.pageSize)
            $("#scroller_data_list .list-wrapper").html('')

                s_html = '';
            var columns = {};
            for(i in data.columns){
                if(typeof data.columns[i] == "function") continue;
                columns[data.columns[i].key] = data.columns[i].title;
            }
            var added_title = {}
            var distinct_column = []
            var added_key = []
            var _columns = data.columns.length==0?self.defaults._columns:data.columns;
                for(j in _columns){
                var title = _columns[j].title.lastIndexOf('.') != -1 ? _columns[j].title.substr(_columns[j].title.lastIndexOf('.') + 1) : _columns[j].title;
                _columns[j].tit = title
                if(added_title[title]) {
                    if (distinct_column[added_title[title]]["keys"].indexOf(_columns[j].key) == -1){
                        distinct_column[added_title[title]]["keys"].push(_columns[j].key)
                    }
                }else{
                    distinct_column.push({title: title, key: _columns[j].key, keys: [_columns[j].key], dataIndex: _columns[j].key})
                    added_title[title] = distinct_column.length - 1
                    added_key.push(_columns[j].key)
                }
            }
            self.defaults._columns = _columns
            var select_html=''
                for(var i=0;i<_columns.length;i++){
                  if(_columns[0].length!=0){
                    select_html+='<option value="'+_columns[i].key+'">'+_columns[i].tit +'</option>'
                  }
            }
            $("#scroller_data_list input").val('')
            $("#scroller_data_list .search_columns").html(select_html)
            $("#scroller_data_list .search_columns").val(self.defaults.option_val)
            if( data.data.length!=0){
                for(var i in data.data){
                    if(typeof data.data[i] == "function") continue;
                    s_html += '<div class="read_detail clearfix tag-RListField"><div class="clearfix list-item ">';
                    for(var j in data.data[i]){
                        if(j == "key" || typeof data.data[i][j] == "function") continue;
                        s_html += '<label key="' + j + '" value="' + data.data[i][j] + '">' + (columns[j].lastIndexOf('.') != -1 ? columns[j].substr(columns[j].lastIndexOf('.') + 1) : columns[j]) + ': ' + data.data[i][j] + '</label>';
                    }
                    s_html += "</div></div>";
                }
                s_html += "</div></div>";
            }else{
                s_html+='<div class="read_detail clearfix tag-RListField" style="text-align:center"><p>暂无信息</p></div>'
            }
            $("#scroller_data_list .list-wrapper").append(s_html);
            if(self.defaults.totalSize!=0){
              $("#scroller_data_list .list-wrapper").append('<div class="data_list_page list-page"></di>');
              $("#scroller_data_list .list-wrapper .data_list_page").paging({
                nowPage: self.defaults.pageNo, // 当前页码,默认为1
                pageNum: self.defaults.totalPage, // 总页码
                buttonNum: 5, //要展示的页码数量，默认为7，若小于5则为5
                callback: function(num) { //回调函数,num为当前页码
                  self.defaults.pageNo = num;
                  var keyword = $("#scroller_data_list input").val()
                  self.dataList(self.defaults.trigger_data,keyword)
                }
              });
            }
                pages.to('data_list');
                self.bindEvent()
        },
        //绑定数据选择列表事件
        bindEvent:function(){
            var self = this;
            $("#scroller_data_list div.tag-RListField").on("click", function () {
                var parent_key = "", data = {}, b_value_changed = false;
                var main_effect = [],  main_trigger = {trigger: false, triggerFields: []};
                $(this).find("label").each(function(){
                    var key = $(this).attr("key"), value = $(this).attr("value");
                    if(key.charAt(0) == "{"){
                        if(self.instances[key]){
                            var config = $.extend(true, {}, self.instances[key]._config);
                            config["value"] = value;
                            $.isFunction(self.instances[key].reRender) && self.instances[key].reRender(config);
                            if(config.effect && config.effect.length){
                                main_effect.push({field_id: key, effect: config.effect});
                            }
                            if(config.trigger){
                                if(!main_trigger.trigger) main_trigger.trigger = true;
                                main_trigger.triggerFields.push({field_id: key, index: 1});
                            }
                            // if(config["trigger"]){
                            //     self.triggerTrig(config);
                            // }
                        }else{
                            if(parent_key == "") {
                                parent_key = window.store.subFieldToListMap[key];
                            }
                            data[key] = {"field_id": key, "value": value};
                        }
                    }
                });
                if(data && parent_key != "" && self.instances[parent_key]){
                    // var value = [{"index": window.listHandleIndex, "flag": undefined, "data": data}];
                    // var config = $.extend(true, {}, self.instances[parent_key]._config);
                    // config["value"] = value;
                    var effect = [], trigger = {trigger: false, triggerFields: []};
                    var config = self.instances[parent_key]._config;
                    config['subFields'].map(field => {
                        if(data[field.field_id] && field.effect && field.effect.length){
                            effect.push({field_id: field.field_id, effect: field.effect});
                        }
                        if(data[field.field_id] && field.trigger){
                            if(!trigger.trigger) trigger.trigger = true;
                            trigger.triggerFields.push({field_id: field.field_id, index: window.listHandleIndex});
                        }
                    });

                    for(var i in config['value']){
                        if(typeof config['value'][i] === 'function') break;
                        if(config['value'][i]['index'] === window.listHandleIndex){
                            for(var j in config['value'][i]['data']){
                                if(typeof config['value'][i]['data'][j] === 'function') break;
                                if(data[config['value'][i]['data'][j]['guid']]){
                                    config['value'][i]['data'][j]['value'] = data[config['value'][i]['data'][j]['guid']]['value'];
                                }
                            }
                            break;
                        }
                    }
                    $.isFunction(self.instances[parent_key].reRender) && self.instances[parent_key].reRender(config);
                    if(effect.length){
                        effect.map(field => {
                            //var list_data = self.instances[parent_key]._config['value'][list_data_index]['data'][0].listManager.register.main[0];
                            self.calc(parent_key + '.' + field.field_id, trigger);
                        });
                    }
                    if(trigger.trigger){
                        self.triggerTrig(undefined, trigger.triggerFields);
                    }
                    // var cfg = $.extend(true, {}, self.instances[parent_key].listViewManager.lists[0].instances[window.listHandleIndex].cfg);
                    //  cfg.trig_field_id = [];
                    //  $.each(cfg.data, function(idx, field){
                    //      if(field["trigger"]) {
                    //         cfg.trig_field_id.push(field["field_id"]);
                    //     }
                    // });
                    //  if(cfg.trig_field_id.length > 0){
                    //     //self.triggerTrig(cfg);
                    // }
                }else{
                    if(main_effect && main_effect.length){
                        main_effect.map(field => self.calc(field.field_id, main_trigger));
                    }
                    if(main_trigger.trigger){
                        self.triggerTrig(undefined, main_trigger.triggerFields);
                    }
                }
                history.back();
            });

                 //绑定每一组数据的搜索
                 $("#scroller_data_list .search_box .input_box button").one("click", function () {
                        var keyword = $("#scroller_data_list input").val();
                        var search_field = $("#scroller_data_list .search_columns").val();
                        if(search_field==''){
                            alert('请选择要查询字段')
                            self.bindEvent()
                        }else{
                            self.dataList(self.defaults.trigger_data,keyword)
                        }
                });
                $("#scroller_data_list .search_columns").on("change", function () {
                    var keyword = $(this).val();
                   self.defaults.option_val = keyword
            });

        },
         pageCount:function(totalnum,limit){//一共有多少页
         return totalnum > 0 ? ((totalnum < limit) ? 1 : ((totalnum % limit) ? (parseInt(totalnum / limit) + 1) : (totalnum / limit))) : 0;
        },
		getTitle: function () {
			if($("#data_title").css('display') != "none"){
				return $("#data_title input.run_name_content").val() + $("#data_title em.run_name_content").text();
			}
			return "";
        },
		setTitle: function () {
        	if(store.formInfo.type != "create" && store.formInfo.type != "edit" && store.formInfo.type != "read") return;
            if(store.formInfo.flow_id > 0){
                $("#data_title .run_id").text(store.formInfo.run_id);
                if(store.formInfo.can_edit_title && store.formInfo.type != "read"){
                    $("#data_title input.run_name_content").val(store.formInfo.title);
                    $("#data_title em.run_name_content").hide();
                }else{
                    $("#data_title em.run_name_content").text(store.formInfo.title);
                    $("#data_title input.run_name_content").hide();
                }
                $("#data_title").show();
            }else{
                $("#data_title h2").hide();
                if(store.formInfo.can_edit_title && store.formInfo.type != "read"){
                    $("#data_title input.run_name_content").val(store.formInfo.title);
                    $("#data_title em.run_name_content").hide();
                    $("#data_title").show();
                }else{
                    $("#data_title em.run_name_content").text(store.formInfo.title);
                    $("#data_title input.run_name_content").hide();
                    if(store.formInfo.title != "") {
                        $("#data_title").show();
                    }
                }
            }
        },
		getSignAttachment: function () {
			var attach = [];
            $('#sign_suggest >div > div.ui-attach-file').find("a").each(function () {
				attach.push({
					attach_id: $(this).attr("data-id").charAt($(this).attr("data-id").length - 1) == ","? $(this).attr("data-id").substr(0, $(this).attr("data-id").length - 1) : $(this).attr("data-id"),
					attach_name: $(this).children("span").text()
				});
            });
            return attach.length > 0 ? JSON.stringify(attach) : "";
        }
    });
    exports.FieldManager = window.FieldManager = FieldManager;
});

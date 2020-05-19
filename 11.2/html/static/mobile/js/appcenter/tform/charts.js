define('ChartsCtrl', function(require, exports, module){
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var ChartsCtrl = Base.extend({
        initialize: function(config) {
            ChartsCtrl.superclass.initialize.call(this, config);
            this._config = config;
            this.chartType = config.config.chartType;
            this.id = config.el
            this._render();
            this.reRender()
        },
        _render: function() {
          var me = this;
          var txt="<div id='"+me.id+"'></div>";               // 以 HTML 创建新元素
            me._config.container.append(txt);
            var settings = me.getChartSetting(me._config.config, me._config.row, me._config.col);
             Highcharts.chart(me.id, settings)
        },
        reRender: function() {
          var me = this;
          var settings = me.getChartSetting(me._config.config, me._config.row, me._config.col);
           Highcharts.chart(me.id, settings)
        },
        ResetData:function(value){
          var chartvalue = value;
          var new_value=[]
          for(var j in chartvalue){
            var arr =[]
              if(chartvalue[j].data instanceof Array === true){
                  var hash = {};
                      $.each(chartvalue[j].data, function(i,item) {
                      var item_data = {};
                      item_data.field_id = item.field_id;
                      item_data.value = item.value;
                      hash[item.field_id] = item_data;
                  })
                  arr[j]={data:hash};
              }
              new_value.push(arr[j])
          }
          return new_value
        },
        getDataFromStore: function() {
            var fieldsMap = store.fieldsMap
            var data = []
              for(var i in fieldsMap) {
                  var type  = fieldsMap[i].type
                  if(type == 'list'){
                    var value = fieldsMap[i].value
                      for(var j in value) {
                        if(value[j].data instanceof Array === true){
                            var hash = {};
                            value[j].data.forEach(function(item){
                                var item_data = {};
                                item_data.field_id = item.field_id;
                                item_data.value = item.value;
                                hash[item.field_id] = item_data;
                            })
                            value[j].data = hash;
                        }
                            delete value[j].num;
                            delete value[j].flag;
                            delete value[j].index;
                            delete value[j].edit_op;
                            delete value[j].delete_op;
                            delete value[j].name;
                    }
                    data.push({
                      field_id:fieldsMap[i].field_id,
                      value:value
                    })
                  }else{
                    data.push({
                      field_id:fieldsMap[i].field_id,
                      value:value
                })
      }
    }
    return data
},
        openLink:function(field_id, index, row, col){
            var me = this;
            var formInfo = store.formInfo;
            var data = this.getDataFromStore();
        		var formId = formInfo.formId;
            var type = formInfo.type
        		var params = {
        			formId:formId,
        			data:data,
        			field_id:field_id,
              run_key:store.run_key
        		}
        		if(index != undefined) {
        			params['index'] = index
        		}
        		if(row != undefined){
        			params['row'] = row
        		}
        		if(col != undefined){
        			params['col'] = col
        		}
                $.ajax({
                    type: "POST",
                    url: "/general/appbuilder/web/appcenter/appdata/link",
                    data: {
                        ...params
                    },
                    success: function(response) {
                        if(response.status == 'ok') {
                            var url = response.url
                          if(type=='create'||type=='edit'){
                              fieldManager.save()
                          }
                          window.location = url
                        } else {
                            //alert(response.message)
                        }
                    }
                })
        },
        getChartSetting:function(config, chartRow, chartCol,listconfig){
            var fieldsMap = $.extend(true,{}, store.fieldsMap);
            var categories = [], series = [];
            var list_item = null, me = this;
            if(config.chartType === 'radar'){
                config.chartType = 'polar'
            }
            //分类
            if(config.categoryRegion){
                for(var guid in fieldsMap){
                    var field = fieldsMap[guid];
                    if(field.type === 'list'){
                        if(field.subFields){
                            var subField = field.subFields.filter(subField => subField.guid === config.categoryRegion[0]);
                            if(subField && subField.length === 1){
                                list_item = field;
                                list_item.chartval = field.value
                                break;
                            }
                        }
                    }
                }
            }
            if(list_item && list_item.value){
            value = me.ResetData(list_item.chartval);
                var subFieldNameMap = [];
                list_item.subFields.map(subField => subFieldNameMap[subField.guid] = subField.title);

                if(config.orientation == '2'){
                    value.map((row, row_idx) => {
                        categories.push(row.data[config.categoryRegion[0]]['value']);

                        config.dataRegion.map((guid, idx) => {
                            if(row_idx === 0 && idx <= series.length){
                                series.push({guid, name: subFieldNameMap[guid], data: [], type: config.yOptions && config.yOptions.length > idx ? config.yOptions[idx].type : config.chartType});
                            }
                            if(config.chartType !== 'pie'){
                                series[idx]['data'].push(parseFloat(row.data[guid]['value']));
                            }else{
                                series[idx]['data'].push({name: row.data[config.categoryRegion[0]]['value'], y: parseFloat(row.data[guid]['value'])});
                            }
                        });
                    });
                }else{
                    config.dataRegion.map((guid, idx) => {
                        categories.push(subFieldNameMap[guid]);
                    });

                    value.map(row => {
                        series.push({name: row.data[config.categoryRegion[0]]['value'], data: []});
                        config.dataRegion.map((guid, idx) => {
                            if(config.chartType !== 'pie'){
                                series[series.length - 1]['data'].push(parseFloat(row.data[guid]['value']));
                            }else{
                                series[series.length - 1]['data'].push({name: row.data[config.categoryRegion[0]]['value'], y: parseFloat(row.data[guid]['value'])});
                            }
                        });
                    });
                }
            }

            var series_count = series.length;
            if(series_count > 0 && config.chartOptions && config.chartOptions.trendMethod){
                series.push({name: config.chartOptions.trendName, type: config.chartOptions.trendType ? config.chartOptions.trendType : 'line', data: []});
                series[0]['data'].map((val, idx) =>{
                    var amount = 0;
                    for(var i = 0; i < series_count; i++){//map不能嵌套：这里不能再此使用map
                        amount += series[i]['data'][idx];
                    }
                    amount /= series_count;
                    series[series_count]['data'].push(parseFloat(amount.toFixed(parseInt(config.chartOptions.trendDecimal))));//toFixed之后要再次parseFloat
                });
            }

            var obj_chart_config = {}
            if(config.chartType === 'gauge'){
                obj_chart_config = {
                    chart: {
                        type: "gauge",
                        plotBackgroundColor: null,
                        plotBackgroundImage: null,
                        plotBorderWidth: 0,
                        plotShadow: false,
                        style: {fontFamily: "\u5b8b\u4f53", fontSize: "12px"}
                    },
                    title: {text: config.title, style: {fontFamily: "\u5b8b\u4f53", fontSize: "16px", fontweight: "bold"}},
                    pane: {
                        startAngle: -120,
                        endAngle: 120,
                        background: [{
                                backgroundColor: {
                                    linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                                    stops: [[0, "#FFF"], [1, "#333"]]
                                }, borderWidth: 0, outerRadius: "109%"
                            }, {
                                backgroundColor: {
                                    linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                                    stops: [[0, "#333"], [1, "#FFF"]]
                                }, borderWidth: 1, outerRadius: "107%"
                            }, {}, {backgroundColor: "#DDD", borderWidth: 0, outerRadius: "105%", innerRadius: "103%"}]
                    },
                    plotOptions: {
                        series: {
                            cursor: "pointer",
                            point: {
                                events: {
                                    click: function ()
                                    {
                                      me.openLink(this.series.userOptions.guid, parseInt(this.x), chartRow, chartCol);
                                    }
                                }
                            },
                            marker: {lineWidth: 1},
                            dataLabels: {enabled: true}
                        }
                    },
                    yAxis: {
                        min: !config.minValue ? 0 : config.minValue,
                        max: !config.maxValue ? 100 : config.maxValue,
                        minorTickInterval: "auto",
                        minorTickWidth: 1,
                        minorTickLength: 10,
                        minorTickPosition: "inside",
                        minorTickColor: "#666",
                        tickPixelInterval: 30,
                        tickWidth: 2,
                        tickPosition: "inside",
                        tickLength: 10,
                        tickColor: "#666",
                        labels: {step: 2, rotation: "auto"},
                        plotBands: [{
                            from: 0,
                            to: 60,
                            color: '#55BF3B' // green
                        }, {
                            from: 60,
                            to: 90,
                            color: '#DDDF0D' // yellow
                        }, {
                            from: 90,
                            to: 100,
                            color: '#DF5353' // red
                        }]
                    },
                    series: series,
                    credits: {enabled: false}
                }
            }else if(config.chartType === 'polar'){
                obj_chart_config = {
                    chart: {
                        polar: true,
                        type: 'line'
                    },
                    title: {
                        text: config.title
                    },
                    pane: {
                        size: '70%'
                    },
                    xAxis: {
                        categories: categories,
                        labels: {
                            style: {fontFamily:'"宋体"',fontSize:'10px'},
                            align: 'right',
                            rotation: -40
                        }
                    },
                    yAxis: {title: {text: config.y}},
                    plotOptions: {
                        series: {
                            cursor: "pointer",
                            point: {
                                events: {
                                    click: function ()
                                    {
                                        me.openLink(this.series.userOptions.guid, parseInt(this.x), chartRow, chartCol);
                                    }
                                }
                            },
                            marker: {lineWidth: 1}
                        }
                    },
                    legend: {
                        layout: "vertical",
                        align: "right",
                        verticalAlign: "top",
                        x: -10,
                        y: 100,
                        borderWidth: 0,
                        style: {fontFamily: '"\u5b8b\u4f53"', fontSize: "12px"}
                    },
                    series: series,
                    legend:{
                        layout:'vertical',
                        align:'right',
                        x: 10,
                        verticalAlign:'top',
                        y:0,
                        floating:true,
                        style:{
                            fontFamily:'"宋体"',
                            fontSize:'12px'
                        },
                        borderWidth: 1,
                        backgroundColor: '#FFFFFF',
                                shadow: true
                    },
                    credits: {enabled: false}
                }
            }else{
                obj_chart_config = {
                    chart: {
                        type: config.chartType === 'stackedColumn' ? 'column' : (config.chartType === 'stackedBar' ? 'bar' : (config.chartType === 'stackedArea' ? 'area' : config.chartType)),
                        borderWidth: 1
                    },
                    title: {
                        text: config.title
                    },
                    xAxis: {
                        categories: categories
                    },
                    plotOptions: {
                        series: {
                            stacking: config.chartType === 'stackedColumn' || config.chartType === 'stackedBar' || config.chartType === 'stackedArea' ? 'normal' : '',
                            cursor: 'pointer',
                            point: {
                                events: {
                                    click: function ()
                                    {
                                      me.openLink(this.series.userOptions.guid, parseInt(this.x), chartRow, chartCol);
                                    }
                                }
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            text: config.y
                        }
                    },
                    series: series,
                    credits: {enabled: false},
                    legend: {
                        layout: "vertical",
                        align: "right",
                        verticalAlign: "top",
                        x: -10,
                        y: 100,
                        borderWidth: 0,
                        style: {fontFamily: '"\u5b8b\u4f53"', fontSize: "12px"}
                    }
                }
            }
            return obj_chart_config;
        }
    });
    exports.ChartsCtrl = window.ChartsCtrl = ChartsCtrl;
});

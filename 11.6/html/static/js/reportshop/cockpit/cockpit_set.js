0 && Highcharts.createElement('link', {
    href: 'http://fonts.googleapis.com/css?family=Signika:400,700',
    rel: 'stylesheet',
    type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);


// Add the background image to the container
Highcharts.wrap(Highcharts.Chart.prototype, 'getContainer', function (proceed) {
    proceed.call(this);
    /*
    this.container.style.background = 'rgba(0, 0, 0, 0.35)';
   this.container.style.border = '1px solid rgba(0, 0, 0, 0.45)';
    */
        'url(http://img4.duitang.com/uploads/item/201407/26/20140726230312_wEJQs.jpeg)';
});


Highcharts.theme = {
    colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
        "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
    chart: {
        backgroundColor: null,
        style: {
            fontFamily: "arial, Signika, serif"
        }
    },
    title: {
        style: {
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold'
        }
    },
    subtitle: {
        style: {
            color: 'white'
        }
    },
    tooltip: {
        borderWidth: 0
    },
    legend: {
        itemStyle: {
            fontWeight: 'bold',
            fontSize: '13px',
            color: '#666'
        }
    },
    xAxis: {
        labels: {
            style: {
                color: '#fff'
            }
        }
    },
    yAxis: {
        labels: {
            style: {
                color: '#fff'
            }
        }
    },
    plotOptions: {
        series: {
            shadow: true
        },
        candlestick: {
            lineColor: '#404048'
        },
        map: {
            shadow: false
        }
    },

    // Highstock specific
    navigator: {
        xAxis: {
            gridLineColor: '#D0D0D8'
        }
    },
    rangeSelector: {
        buttonTheme: {
            fill: 'white',
            stroke: '#C0C0C8',
                'stroke-width': 1,
            states: {
                select: {
                    fill: '#D0D0D8'
                }
            }
        }
    },
    scrollbar: {
        trackBorderColor: '#C0C0C8'
    },

    // General
    background2: '#E0E0E8'

};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);
function startIntro(){
    var intro = introJs();
    intro.setOptions({
        nextLabel: '下一步',
        prevLabel: '上一步',
        skipLabel: '跳过',
        doneLabel: '完成',
        steps: [
            {
                element: '#container-left',
                intro: "您可将表设置显示在左侧"
            },
            {
                element: '#container',
                intro: "也可以放在中间。",
                position: 'right'
            },
            {
                element: '#container-right',
                intro: '还可以放在右侧。',
                position: 'left'
            },
            {
                element: '#menu-l-b',
                intro: "点这里可设置表位置和内容。",
                position: 'bottom'
            },
            {
                element: '#menu-r-b',
                intro: '点这里也一样哦！'
            },
            {
                element: '#operation',
                intro: '按下按钮自由设置您的驾驶舱吧！'
            }
        ]
    });
    intro.start();
}
$(document).ready(function() {
    var Cockpit = {
        init: function(){
            this.$menu = $("#operation");
            this.$title = $("#title");
            this.$container = $("#container");
            this.$container_l = $("#container-left");
            this.$container_r = $("#container-right");
            this.$menu_l_b = $("#menu-l-b");
            this.$menu_r_b = $("#menu-r-b");
            this.bindEvent();
            this.getInfo();
        },
        getInfo: function(){
            var self = this;
            $.ajax({
                type: "get",
                url: "getdata.php",
                data: {flag: 2},
                success: function(d){
                    d = JSON.parse(d);
                    $.each(d, function(k, v){
                        $('[index="'+ v.index +'"]').attr({
                            title: v.rname,
                            pos: v.pos,
                            rid: v.rid,
                            id: "reportbtn_"+v.rid
                        });
                        $('[index="'+ v.index +'"] span').text(v.rname);
                    });
                }
            });
        },
        bindEvent: function(){
            var self = this;
            $("body").delegate(".reportbtn", "click", function(){
                var index_id = $(this).attr("index");
                $("#indexid").val(index_id);
                $('#pos option:first').attr("selected", true);
                $('#rid option:first').attr("selected", true);
                $("body").addClass("on");
                $.ajax({
                    type: "get",
                    url: "getdata.php",
                    data: {index_id: index_id,flag: 0},
                    success: function(d){
                        $('#pos option,#rid option').removeAttr("selected");
                        d = JSON.parse(d);
                        if(d.flag == "edit"){
                            $("#name").val(d.data.rname);
                            $('#pos option[value="'+ d.data.pos +'"]').attr("selected", true);
                            $('#rid option[value="'+ d.data.rid +'"]').attr("selected", true);
                            $("#cid").val(d.data.cid);
                        }
                        else if(d.flag == "new"){
                            return;
                        }
                    }
                });
            });
            $("#save").click(function(){
                var cur_index = $("#indexid").val();
                var cid = $("#cid").val();
                var cur_name = $("#name").val();
                var cur_pos = $('#pos option:selected').val();
                var cur_rid = $('#rid option:selected').val();
                var cur_rname = $('#rid option:selected').text();
                $.ajax({
                    type: "get",
                    url: "getdata.php",
                    data: {
                        cur_index: cur_index,
                        cur_name: cur_name,
                        cur_pos: cur_pos,
                        cur_rid: cur_rid,
                        cid: cid,
                        flag: 1
                    },
                    success: function(d){
                        if(d == "ok"){
                            $("body").removeClass("on");
                            $("#name").val("");
                            $('#pos option,#rid option').removeAttr("selected");
                            $("#cid").val("");
                            $('[index="'+ cur_index +'"]').attr({
                                title: cur_name,
                                pos: cur_pos,
                                rid: cur_rid,
                                id: "reportbtn_"+cur_rid
                            });
                            $('[index="'+ cur_index +'"] span').text(cur_name);
                            //生成占位
                            if(cur_pos == 1){
                                $("#container-left .chartwrapper").remove();
                                $('<div class="chartwrapper" id="report_'+cur_rid+'" rid="'+cur_rid+'"><h5>'+ cur_rname +'</h5><div class="chart"></div></div>').appendTo("#container-left").addClass("active");
                            }else if(cur_pos == 2){
                                $("#container .chartwrapper").remove();
                                $('<div class="chartwrapper" id="report_'+cur_rid+'" rid="'+cur_rid+'"><h5>'+ cur_rname +'</h5><div class="chart"></div></div>').appendTo("#container").addClass("active");
                            }
                            else if(cur_pos == 3){
                                $("#container-right .chartwrapper").remove();
                                $('<div class="chartwrapper" id="report_'+cur_rid+'" rid="'+cur_rid+'"><h5>'+ cur_rname +'</h5><div class="chart"></div></div>').appendTo("#container-right").addClass("active");
                            }
                            //加载                            
                            self.getChartData(cur_rid, cur_pos);
                        }
                    }
                });
            });
            $("#close").click(function(){
                $("body").removeClass("on");
                $("#name").val("");
                $('#pos option,#rid option').removeAttr("selected");
                $("#cid").val("");
            });
        },
        //获取指定rid信息
        getChartData: function(rid, pos){
                $.ajax({
                    type: "get",
                    url: "/general/management_center/portal/breif/getdata.php",
                    data: {rid: rid,flag: 0},
                    success: function(d){
                        d = JSON.parse(d);
                        var chart_height = 0;
                        if(pos == 2){
                            chart_height = 400;
                        }else{
                            chart_height = 260;
                        }
                        draw_chart(rid,d.chart_type,d.chart_forecolor,chart_height,d.chart_xAxis,d.chart_series,d.chart_title,d.s_link,d.s_result); 
                    }
                }); 
           
        }
    };
    window.Cockpit = Cockpit;
    Cockpit.init();
    
      
    
    
});
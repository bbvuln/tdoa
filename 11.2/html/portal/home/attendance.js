var el = $("#attendance");
new HomeTitle(el, {
    title: "���˿���"
});
var slideData = [
    "unpunch",
    "late",
    "leave_early",
    "leavetime",
    "overtime",
    "evetime",
    "outtime"
];
var colorMap = {
    late: {
        name: "�ٵ�",
        color: "#e72a17"
    },
    unpunch: {
        name: "δ��",
        color: "#53e69d"
    },
    overtime: {
        name: "�Ӱ�",
        color: "#2cabe3"
    },
    evetime: {
        name: "����",
        color: "#7bcef3"
    },
    leavetime: {
        name: "���",
        color: "#f6b37f"
    },
    outtime: {
        name: "���",
        color: "#a6937c"
    },
    leave_early: {
        name: "����",
        color: "#8f82bc"
    }
};
var colorNamesNode = "";
$.each(slideData, function(key, value) {
    var liNode =
        '<div class="color-info"><div class="color-value" style="background-color:' +
        colorMap[value].color +
        '"></div><div class="color-name">' +
        colorMap[value].name +
        "</div></div>";
    colorNamesNode += liNode;
});

el.append(
    '<div class="attendance-container"><div id="attendance-chart"></div><div class="sidebar">' +
        colorNamesNode +
        '</div></div><div class="button-wrap"><span>���°�Ǽ�</span></div>'
);

var fetchAttendance = function() {
    $.ajax({
        url: "/general/appbuilder/web/portal/homepage/getattendance",
        success: function(response) {
            var status = response.status ? response.status : null;
            if (status) {
                var data = response.data ? response.data : [];
                var count = 0;
                var arr = [];
                var colorArr = [];
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    var second = item.second;
                    count += second;
                }
                var title = "���¿���";
                if (count) {
                    for (var j = 0; j < data.length; j++) {
                        var Jitem = data[j];
                        var second = Jitem.second;
                        var key = Jitem.key;
                        if (second) {
                            Jitem.y = second / count;
                            arr.push(Jitem);
                            colorArr.push(colorMap[key].color);
                        }
                    }
                } else {
                    arr.push({
                        name: "��������",
                        y: 1
                    });
                    title = "��������";
                    colorArr.push("#bebebe");
                }
                var chart = Highcharts.chart(
                    "attendance-chart",
                    {
                        credits: false,
                        chart: {
                            spacing: [40, 0, 40, 0]
                        },
                        title: {
                            useHTML: true,
                            floating: true,
                            text: title
                        },
                        tooltip: {
                            // pointFormat:
                            //     "{series.name}: <b>{point.second}��</b>",
                            formatter: function() {
                                if (this.point.second) {
                                    return (
                                        this.point.name +
                                        ": <b>" +
                                        this.point.second +
                                        "��</b>"
                                    );
                                } else {
                                    return false;
                                }
                            }
                        },
                        plotOptions: {
                            pie: {
                                colors: colorArr,
                                allowPointSelect: true,
                                cursor: "pointer",
                                dataLabels: {
                                    enabled: false,
                                    format:
                                        "<b>{point.name}</b>: {point.percentage:.1f} %",
                                    style: {
                                        color:
                                            (Highcharts.theme &&
                                                Highcharts.theme
                                                    .contrastTextColor) ||
                                            "black"
                                    },
                                    connectorWidth: 0
                                },
                                point: {
                                    events: {
                                        mouseOver: function(e) {
                                            // ��껬��ʱ��̬���±���
                                            // ������º�����API ��ַ��https://api.hcharts.cn/highcharts#Chart.setTitle
                                            if (count) {
                                                chart.setTitle({
                                                    text: e.target.name
                                                });
                                            }
                                        },
                                        mouseOut: function(e) {
                                            if (count) {
                                                chart.setTitle({
                                                    text: title
                                                });
                                            }
                                        },
                                        click: function(e) {
                                            // ͬ���Ŀ����ڵ���¼��ﴦ��
                                            return false;
                                            // chart.setTitle({
                                            //     text: e.point.name+ '\t'+ e.point.y + ' %'
                                            // });
                                        }
                                    }
                                }
                            }
                        },
                        series: [
                            {
                                type: "pie",
                                innerSize: "90%",
                                name: "",
                                data: arr
                            }
                        ]
                    },
                    function(c) {
                        // ͼ���ʼ����Ϻ�Ļ������
                        // ����ͼԲ��
                        var centerY = c.series[0].center[1],
                            titleHeight = parseInt(c.title.styles.fontSize);
                        // ��̬���ñ���λ��
                        c.setTitle({
                            y: centerY + titleHeight / 2
                        });
                    }
                );
                el.find(".button-wrap span").click(function(e) {
                    createTab(
                        "button-wrap",
                        "���°�Ǽ�",
                        "attendance/personal/duty/",
                        ""
                    );
                });
            }
        }
    });
};
fetchAttendance();

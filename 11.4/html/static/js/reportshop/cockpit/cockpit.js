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
            this.getInfo();
            this.bindEvent();
            this.cometTip();
        },
        bindEvent: function(){
            var self = this;
            $("body").delegate(".reportbtn", "click", function(){
                var rid = $(this).attr("rid");
                var pos = $(this).attr("pos");
                self.getChartData(rid, pos);
            });
            $(".i-know").click(function(){
                $(".robot").hide();
                $(this).hide();
                $("#title").html("");
            });
        },
        //获取按钮数据
        getInfo: function(){
            var self = this;
            $.ajax({
                type: "get",
                url: "getdata.php",
                data: {type: "info",flag: 1},
                success: function(d){
                    d = JSON.parse(d);
                    $.each(d, function(k, v){
                        //生成左中右按钮
                        if(v.index>=1 && v.index<=8){
                            $('#menuTmpl').tmpl(v).appendTo(self.$menu); 
                        }
                        else if(v.index>=9 && v.index<=12){
                            $('#menuTmpl').tmpl(v).appendTo(self.$menu_l_b);  
                        }
                        else if(v.index>=13 && v.index<=16){
                            $('#menuTmpl').tmpl(v).appendTo(self.$menu_r_b);  
                        }
                        //生成左中右占位
                        if(v.pos == 1){
                            $('#chartTmpl').tmpl(v).appendTo(self.$container_l);  
                        }else if(v.pos == 2){
                            $('#chartTmpl').tmpl(v).appendTo(self.$container);  
                        }
                        else if(v.pos == 3){
                            $('#chartTmpl').tmpl(v).appendTo(self.$container_r);  
                        }
                        //加载前三项
                       // if(k<=2)
                        if(k=="1" || k=="11" || k=="12"){
                            self.getChartData(d[k].rid, v.pos);
                        }
                    });
                    
                }
            }); 
        },
        //获取指定rid信息
        getChartData: function(rid, pos){
            //隐藏同一位置的其他报表，显示当前报表
            if(pos == 1){
                $("#container-left .chartwrapper").removeClass("active");
            }
            else if(pos == 2){
                $("#container .chartwrapper").removeClass("active");
            }
            else if(pos == 3){
                $("#container-right .chartwrapper").removeClass("active");
            }
            $("#report_"+rid).addClass("active");
            var obj = $("#report_"+rid+" .chart").html();
            if(obj == ""){//先判断是否表已加载，已加载不再重复加载
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
            else{
                return false;
            }
        },
        cometTip: function(){
            //机器人预警信息默认加载一次，每隔一小时更新一次，每次循环显示结束后机器人隐藏
            var self = this;
            $.ajax({
                type: "get",
                url: "getdata.php",
                data: {type: "info",flag: 0},
                success: function(d){
                    d = JSON.parse(d);
                    $("#title").html("");
                    $.each(d, function(k, v){
                        $('#tipTmpl').tmpl(v).appendTo("#title");
                    });
                    $('#title div').hide().eq(0).fadeIn(1000);
                    $(".robot,.i-know").show();
                    var i = 1, t = $('#title div').not(":first").hide().length, tmp = setInterval(function(){
                        $('#title div').hide().eq(i > t-1 ? i = 1 : i++).fadeIn(1000);
                        if(i == 1) {
                            $('#title div').remove();
                            $(".robot,.i-know").hide();
                            clearInterval(tmp);
                        };
                    }, 5000);
                }
            });
        }
    };
    window.Cockpit = Cockpit;
    Cockpit.init();
    //机器人显隐
    setInterval(function(){
        Cockpit.cometTip();
    },1000*60*60);
});
/*
var container, stats;
var camera, scene, renderer, particle;
var mouseX = 0,
    mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;


var yesIE = navigator.userAgent.search(/Trident/i);
if(yesIE <= 0){
    init();
    animate();
}


function init() {

    container = document.createElement('div');
    document.body.appendChild(container);
    container = $('#canvas')[0];
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.z = 1000;

    scene = new THREE.Scene();

    var material = new THREE.SpriteMaterial({
        map: new THREE.Texture(generateSprite()),
        blending: THREE.AdditiveBlending
    });

    for (var i = 0; i < 1000; i++) {

        particle = new THREE.Sprite(material);

        initParticle(particle, i * 10);

        scene.add(particle);
    }

    renderer = new THREE.CanvasRenderer();
    renderer.setClearColor(0x000040);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);

    //

    window.addEventListener('resize', onWindowResize, false);
    onWindowResize();
}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = 450 / 360;

    //camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(450, 360);

}

function generateSprite() {

    var canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;

    var context = canvas.getContext('2d');
    var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
    gradient.addColorStop(1, 'rgba(0,0,0,1)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    return canvas;

}

function initParticle(particle, delay) {

    var particle = this instanceof THREE.Sprite ? this : particle;
    var delay = delay !== undefined ? delay : 0;

    particle.position.set(0, 0, 0)
    particle.scale.x = particle.scale.y = Math.random() * 32 + 16;

    new TWEEN.Tween(particle)
        .delay(delay)
        .to({}, 10000)
        .onComplete(initParticle)
        .start();

    new TWEEN.Tween(particle.position)
        .delay(delay)
        .to({
        x: Math.random() * 4000 - 2000,
        y: Math.random() * 1000 - 500,
        z: Math.random() * 4000 - 2000
    }, 10000)
        .start();

    new TWEEN.Tween(particle.scale)
        .delay(delay)
        .to({
        x: 0,
        y: 0
    }, 10000)
        .start();

}

//

function onDocumentMouseMove(event) {

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart(event) {

    if (event.touches.length == 1) {

        event.preventDefault();

        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;

    }

}

function onDocumentTouchMove(event) {

    if (event.touches.length == 1) {

        event.preventDefault();

        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;

    }

}

//

function animate() {

    requestAnimationFrame(animate);

    render();
    stats.update();

}

function render() {

    TWEEN.update();

    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);

}
*/
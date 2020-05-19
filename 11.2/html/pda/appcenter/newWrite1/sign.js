var canvas;//定义全局画布
var context;//定义全局context
var img1=[];//储存图像数组，用于撤销
var canX;//画布左上角的x坐标
var canY;//画布左上角y坐标
$(function(){
	canvas = $('#cavs')[0];//获取画布的dom
	context = canvas.getContext('2d');//获取context
	canX=canvas.offsetLeft;//获取画布左上角的x坐标
	canY=canvas.offsetTop;//获取画布左上角的y坐标
	// var imgData=context.getImageData(0,0,canvas.width,canvas.height);
	// img1.push(imgData);
	var paint=Object.create(Line);//定义父类，初始化获取画线条的对象
	context.lineCap="round";//线条起始和结尾样式
	context.lineJoin="round";//线条转弯样式
	$('#qingping').click(function(event) {
		 context.clearRect(0,0,canvas.width,canvas.height);
		 //context的clearRect方法
	});
	$('#chexiao').click(function() {
		context.putImageData(img1.pop(),0,0);
	});
	paint.draw();
});
var Line={
	name:"line",
	draw:function(){
		// context.lineWidth = $("#cuxi").val();//笔画粗细
		context.lineCap =  "round";
		context.pX = undefined;
		context.pY = undefined;
		var lines = [,,];
		var painting = false;//初始化设置为不可画状态
		var offset = $(canvas).offset();
		var self = {
			init: function() {
				//兼容PC鼠标画图事件
				canvas.addEventListener('mousedown', self.pcdown, false);
				canvas.addEventListener('mousemove', self.pcmove, false);
				canvas.addEventListener('mouseup', self.pcup, false);
				canvas.addEventListener('mouseleave', self.pcleave, false);
				//兼容触屏事件
				canvas.addEventListener('touchstart', self.preDraw, false);
				canvas.addEventListener('touchmove', self.draw, false);
			},
			preDraw: function(event) {
				$.each(event.touches, function(i, touch) {
					var id      = touch.identifier,
					mycolor = "#000000";//默认黑色笔迹
					lines[id] = { x: this.pageX - offset.left, 
					y: this.pageY - offset.top, 
					color : context.strokeStyle,
					width:context.lineWidth
					};
				});
				event.preventDefault();
			},
			draw: function(event) {
				var e = event, hmm = {};

				$.each(event.touches, function(i, touch) {
					var id = touch.identifier,
					moveX = this.pageX - offset.left - lines[id].x,
					moveY = this.pageY - offset.top - lines[id].y;
					ispad=1;
					var ret = self.move(id, moveX, moveY);
					lines[id].x = Math.round(ret.x);
					lines[id].y = Math.round(ret.y);
				});
				event.preventDefault();
			},
			move: function(i, changeX, changeY) {
				context.strokeStyle = lines[i].color;
				context.lineWidth = lines[i].width;
				context.beginPath();
				context.moveTo(lines[i].x, lines[i].y);
				context.lineTo(lines[i].x + changeX, lines[i].y + changeY);
				context.stroke();
				context.closePath();
				return { x: lines[i].x + changeX, y: lines[i].y + changeY };
			},
			pcmove:function(e)
			{
				if(painting===true)//判断是否是可绘画状态
				{
					var x = e.pageX;//鼠标当前x坐标
					var y = e.pageY;//鼠标当前y坐标
					context.lineTo(x-canX,y-canY);//确定线的结束位置，canvas.offsetLeft画板离浏览器左侧的距离，canvas.offsetTop画板离浏览器上部的距离
					context.stroke();
				}
			},
			pcdown:function(e)
			{
				painting = true;//鼠标按下可以作画
				p_x = e.pageX;//画笔起始x坐标
				p_y = e.pageY;//画笔起始y坐标
				context.beginPath();//开始作画
				context.moveTo(p_x-canX,p_y-canY);//画笔开始位置
				$('#cavs').css('cursor','pointer');//将鼠标图形设置成小手
				//复制图像，为了撤销
				var imgData=context.getImageData(0,0,canvas.width,canvas.height);
				//加入数组
				// img1.push(imgData);
			},
			pcup:function()
			{
				painting = false;//鼠标松开，禁止作画
				context.closePath();//关闭画笔路径
			},
			pcleave:function()
			{
				painting = false;
				context.closePath();
			}
		};
		$("#color").change(function(event) {//当颜色改变时触发
			context.strokeStyle = $(this).val();//改变画笔颜色
		});
		$("#cuxi").change(function(event) {//修改粗细时，进行赋值
			context.lineWidth = $(this).val();
		});
		return self.init();
	}
}
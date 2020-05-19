var CanvasDrawr = function(options) {
	// grab canvas element
	var canvas = document.getElementById(options.id),
	ctxt = canvas.getContext("2d");
	console.log(111);
	// set props from options, but the defaults are for the cool kids
	ctxt.lineWidth = $('#cuxi').val();
	ctxt.lineCap = options.lineCap || "round";
	ctxt.pX = undefined;
	ctxt.pY = undefined;
	var painting = false;
	var lines = [,,];
	var offset = $(canvas).offset();
	var canX=canvas.offsetLeft;//获取画布左上角的x坐标
	var canY=canvas.offsetTop;//获取画布左上角的y坐标
	var self = {
		//bind click events
		init: function() {
			//set pX and pY from first click
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
				var id      = touch.identifier;
				// colors  = ["red", "green", "yellow", "blue", "magenta", "orangered"],
				// mycolor = colors[0];
				lines[id] = { x: this.pageX - offset.left, 
				y: this.pageY - offset.top, 
				color : ctxt.strokeStyle,
				width:ctxt.lineWidth
				};
			});
			if(pagewrite!=""){
				pagewrite+=")(";
			}

			// event.preventDefault();
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
				var page=canvas.id.replace("page","");
				if(beforePage==page){
					pagewrite+=lines[id].x+","+lines[id].y+","+ctxt.lineWidth+";";
				}else{
					if(pagewrite==""){
						pagewrite+="<"+page+","+canvas.width+","+canvas.height+","+ctxt.strokeStyle+"("+lines[id].x+","+lines[id].y+","+ctxt.lineWidth+";";
					}else{
						pagewrite+=")><"+page+","+canvas.width+","+canvas.height+","+ctxt.strokeStyle+"("+lines[id].x+","+lines[id].y+","+ctxt.lineWidth+";";
					}
				}
				beforePage=canvas.id.replace("page","");
			});
			// event.preventDefault();
		},

		move: function(i, changeX, changeY) {
			// ctxt.strokeStyle = lines[i].color;
			ctxt.strokeStyle = lines[i].color;
			ctxt.lineWidth = lines[i].width;
			ctxt.beginPath();
			ctxt.moveTo(lines[i].x, lines[i].y);
			ctxt.lineTo(lines[i].x + changeX, lines[i].y + changeY);
			ctxt.stroke();
			ctxt.closePath();
			return { x: lines[i].x + changeX, y: lines[i].y + changeY };
		},
		pcmove:function(e)
		{
			if(painting===true)//判断是否是可绘画状态
			{
				var x = e.pageX;//鼠标当前x坐标
				var y = e.pageY;//鼠标当前y坐标
				ctxt.lineTo(x-canX,y-canY);//确定线的结束位置，canvas.offsetLeft画板离浏览器左侧的距离，canvas.offsetTop画板离浏览器上部的距离
				ctxt.stroke();
			}
		},
		pcdown:function(e)
		{
			painting = true;//鼠标按下可以作画
			p_x = e.pageX;//画笔起始x坐标
			p_y = e.pageY;//画笔起始y坐标
			ctxt.beginPath();//开始作画
			ctxt.moveTo(p_x-canX,p_y-canY);//画笔开始位置
			$('#cavs').css('cursor','pointer');//将鼠标图形设置成小手
			//复制图像，为了撤销
			var imgData=ctxt.getImageData(0,0,canvas.width,canvas.height);
			//加入数组
			// img1.push(imgData);
		},
		pcup:function()
		{
			painting = false;//鼠标松开，禁止作画
			ctxt.closePath();//关闭画笔路径
		},
		pcleave:function()
		{
			painting = false;
			ctxt.closePath();
		}
	};
	$("#color").change(function(event) {//当颜色改变时触发
		ctxt.strokeStyle = $(this).val();//改变画笔颜色
	});
	$("#cuxi").change(function(event) {//修改粗细时，进行赋值
		ctxt.lineWidth = $(this).val();
	});
	$('#qingping').click(function(event) {
		 ctxt.clearRect(0,0,canvas.width,canvas.height);
		 showbook('pg',1);
		 //context的clearRect方法
	});
	// $('#chexiao').click(function() {
		// ctxt.putImageData(img1.pop(),0,0);
	// });
	return self.init();
};

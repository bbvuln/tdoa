
var xDistance  = 10;
var yDistance  = 30;
var rectWidth  = 85;
var rectHeight = 30;

function deptTreeNode(deptID, deptLabel, width, height, xPos, yPos){
	this.id		= deptID;
	this.label  = deptLabel;
	this.width  = width;
	this.height = height;
	this.xPos	= xPos;
	this.yPos	= yPos;
}

deptTreeNode.prototype.move = function(x, y){
	this.xPos = this.xPos + x;
	this.yPos = this.yPos + y;
}

deptTreeNode.prototype.moveTo = function(x, y){
	this.xPos = x;
	this.yPos = y;
}

function deptTree(width, height, level){
	this.width		=	width;
	this.height		=	height;
	this.level		=  level;
	this.nodes		=  new Array(); 
	this.childTrees = new Array();
}

function deptTree(node){
	this.width		= node.width;
	this.height		= node.height;
	this.level		= 1;
	this.nodes		= new Array();
	this.nodes[0]	= node;
	this.childTrees = new Array();
}

deptTree.prototype.fillDeptRect = function(jg, color){
	if(typeof(color) == "undefined"){
		jg.setColor("#000000");
	}else{
		jg.setColor(color);
	}
	for(var i = 0; i < this.nodes.length; i++){
		jg.fillRect(this.nodes[i].xPos, this.nodes[i].yPos, this.nodes[i].width, this.nodes[i].height); 
	}
}

deptTree.prototype.drawDeptRect = function(jg, color){
	if(typeof(color) == "undefined"){
		jg.setColor("#000000");
	}else{
		jg.setColor(color);
	}

	for(var i = 0; i < this.nodes.length; i++){
		jg.drawRect(this.nodes[i].xPos, this.nodes[i].yPos, this.nodes[i].width, this.nodes[i].height); 
	}
}

deptTree.prototype.drawDeptString = function(jg, color, rectFlag){
	if(typeof(color) == "undefined"){
		jg.setColor("#000000");
	}else{
		jg.setColor(color);
	}
	
	for(var i = 0; i < this.nodes.length; i++){
		var str = "<div title='" + deptNewArray[this.nodes[i].id][FIELD_DEPT_LONG_LABEL_CONST] + "'>" + this.nodes[i].label + "</div>"
		if (rectFlag == "1")
		   jg.drawStringRect(str, this.nodes[i].xPos, this.nodes[i].yPos+this.nodes[i].height/2 - 5, this.nodes[i].width, "center"); 
		else
		   jg.drawString(str, this.nodes[i].xPos, this.nodes[i].yPos+this.nodes[i].height/2 - 5); 
	}
}
deptTree.prototype.drawDeptLine =  function(jg, color){
	if(typeof(color) == "undefined"){
		jg.setColor("#000000");
	}else{
		jg.setColor(color);
	}
	
	for(var i = 0; i < this.childTrees.length; i++){
		var startXPos = this.nodes[0].xPos + this.nodes[0].width/2;
		var startYPos = this.nodes[0].yPos + this.nodes[0].height;
		var endXPos   = this.childTrees[i].nodes[0].xPos + this.childTrees[i].nodes[0].width/2;
		var endYPos   = this.childTrees[i].nodes[0].yPos;
		drawLine(startXPos, startYPos, endXPos, endYPos, jg);
		this.childTrees[i].drawDeptLine(jg, color);
	}
}

deptTree.prototype.moveTo = function(x, y){
	for(var i = 0; i < this.nodes.length; i++){
		this.nodes[i].moveTo(x, y);
	}
}

deptTree.prototype.move = function(x, y){
	for(var i = 0; i < this.nodes.length; i++){
		this.nodes[i].move(x, y);
	}
}

deptTree.prototype.addNode = function(node){
	this.nodes[this.nodes.length] = node;
	
}

deptTree.prototype.addChildTreeNodes = function(tree){
	if(typeof(tree) == "undefined") return;

	this.childTrees[this.childTrees.length] = tree;
	for(var i = 0; i < tree.nodes.length; i++){
		this.nodes[this.nodes.length] = tree.nodes[i];
	}

}

/*deptTree.prototype.print = function(){
	var str = "root id:" + this.nodes[0].id + " " + this.width + " " + this.height + " " + this.level;
	for(var i = 0; i < this.nodes.length; i++){
		str += "\n" + this.nodes[i].id + " xpos:" + this.nodes[i].xPos + " ypos:" + this.nodes[i].yPos ;
	}
	alert(str);
}*/



/**
  *		function	:  �ϲ���
  *		parentNode	:  ���ڵ�
  *     childTrees  :  ����
  */
function unionTree(parentNode, childTrees){
	var tree;
	if(typeof(childTrees) == "undefined"){//���ڵ��������(�����������)
		tree =  new deptTree(parentNode);
	}else{	//�������������
		var totalWidth  = 0;	//�������ܿ��
		var maxHeight   = 0;    //���������߶�
		var maxLevel    = 0;    //������������
	
		//������Ĳ������ܿ��
		for(var i = 0; i < childTrees.length; i++){
			totalWidth += childTrees[i].width;
			if(maxLevel < childTrees[i].level){
				maxLevel = childTrees[i].level;
			}
			if(maxHeight < childTrees[i].height){
				maxHeight = childTrees[i].height;
			}
		}
		totalWidth += (childTrees.length-1) * xDistance;
		maxLevel    = maxLevel + 1;
		maxHeight   = parentNode.height + yDistance + maxHeight;
		
		//������
		parentNode.moveTo((totalWidth-parentNode.width)/2, 0);				//���ڵ��ƶ���ҳ�����������м�
		tree = new deptTree(parentNode);
		tree.width	= totalWidth;
		tree.height	= maxHeight;
		tree.level  = maxLevel;
		
		for(var i = 0;  i < childTrees.length; i++){	//Yλ�õı��ˣ�������һ��
			childTrees[i].move(0, parentNode.height + yDistance);
		}
		var xPos = 0;
		for(var i = 1;  i < childTrees.length; i++){	//������������ǰһ����������ƫ��һ������λ��
			xPos += childTrees[i-1].width + xDistance
			childTrees[i].move(xPos, 0);
		}
	
		//���μ����������ϲ�����,
		for(var i = 0; i < childTrees.length; i++){
			tree.addChildTreeNodes(childTrees[i]);		
		}

		//��������ڵ��X���꣬��X�����ǵ�һ���������ڵ�X��������һ���������ڵ�X������м�λ��
		var rootXPos = (childTrees[0].nodes[0].xPos + childTrees[childTrees.length-1].nodes[0].xPos)/2;
		tree.nodes[0].xPos = rootXPos;
	}
	return tree;
}

/**
  *		function		:  ����������
  *     deptArray		:  ������Ϣ����
  *		rootDeptID		:  ���ڵ㲿��ID
  *     rootDeptLabel	:  ���ڵ㲿����
  */
function createDeptTree(deptArray, rootDeptID, rootDeptLabel){
	var tree;
	if(deptArray[rootDeptID][FIELD_DEPT_LEAF_CONST] == true){
		var node =  new deptTreeNode(rootDeptID, rootDeptLabel, rectWidth, rectHeight, 0, 0);
		tree     =  new deptTree(node);
	}else{
	   if (rootDeptID == "0")
	   {
	      rectWidth = 200;
	   }
	   else
	      rectWidth = 85;
	   
		var node =  new deptTreeNode(rootDeptID, rootDeptLabel, rectWidth, rectHeight, 0, 0);
                var childStr = deptArray[rootDeptID][FIELD_DEPT_CHILD_CONST];
		var childs	 = childStr.split(",");
		var childTrees = new Array();
		for(var i = 0; i < childs.length-1; i++){
			childTrees[i] = createDeptTree(deptArray, childs[i], deptArray[childs[i]][FIELD_DEPT_LABEL_CONST]);
		}
		tree = unionTree(node, childTrees);
	}
	return tree;
}

/**
  *		function		:  �������������㷨
  *     startXpos		:  ��ʼ���ӵ�X����
  *		startYPos		:  ��ʼ���ӵ�Y����
  *     endXpos			:  �������ӵ�X����
  *     endYpos			:  �������ӵ�Y����
  *     jg				:  ���ʶ���
  */
function drawLine(startXpos, startYPos, endXpos, endYPos, jg){
	var Xpoints = new Array();
	var Ypoints = new Array();

	Xpoints[0] = startXpos;
	Xpoints[1] = startXpos;
	Xpoints[2] = endXpos;
	Xpoints[3] = endXpos;
	
	Ypoints[0] = startYPos;
	Ypoints[1] = startYPos + (endYPos - startYPos)/2;
	Ypoints[2] = startYPos + (endYPos - startYPos)/2;
	Ypoints[3] = endYPos;

	jg.drawPolyline(Xpoints, Ypoints);
}





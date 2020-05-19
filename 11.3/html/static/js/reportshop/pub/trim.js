/*
 * Copyright (c) 2006-2008, cuitianxin. All Rights Reserved.
 */

/**
 *  trimForm�����з���
 *	created by cuitianxin@2006.10.17
 */
//ȥ���ִ�ͷβ�ո񡢻س����Ʊ��
String.prototype.trim = function() {
	return (this.replace(/^(( )|(��)|\r|\n|\t)*/g,"")).replace(/(( )|(��)|\r|\n|\t)*$/g,"");
}
Array.prototype.indexOf = function( v, bIgnoreCase ) {
	for ( var i=0; i<this.length; i++ ) {
		if ( bIgnoreCase && (typeof(v) == "string") ) {
			if ( v.toLowerCase() == String(this[i]).toLowerCase() )
				return i;
		} else if ( v == this[i] ) {
			return i;
		}
	}
	return -1;
}
Array.prototype.contains = function( v, bIgnoreCase ) {
	return (this.indexOf(v, bIgnoreCase) != -1);
}
//ȥ���ִ�ͷβ�ո񡢻س����Ʊ��
function trim(s){return (s.replace(/^(( )|(��)|\r|\n|\t)*/g,"")).replace(/(( )|(��)|\r|\n|\t)*$/g,"")}/*v1.1 ȥ���ִ�sͷβ�ո񡢻س����Ʊ��*/

function nvl(vTmp){
	if(vTmp == undefined || vTmp == null){
		return "";
	}else{
		return trim(vTmp);
	}
}
//������input��textarea�ؼ�trimһ��
function trimForm(doc) {
	if(doc ==null || doc == undefined){
		if(parent != null && parent.frames("infoFrm")!=null){
			doc = parent.frames("infoFrm").document;
		}else{
			doc = document;
		}
	}
	var rgInput = doc.getElementsByTagName("input");

	for ( var i=0; i<rgInput.length; i++ ) {
		try {
			if ( !["password","file"].contains(rgInput[i].type,true) && rgInput[i].value ) {
				rgInput[i].value = rgInput[i].value.trim();
			}
		} catch (e) {}
	}
	rgInput = doc.getElementsByTagName("textarea");
	for ( var i=0; i<rgInput.length; i++ ) {
		if ( rgInput[i].value ) {
			var s = rgInput[i].value.trim();
			//ֵ�ĳ���<500K����trim��û�б仯�������¸�ֵ
			if ( (s != rgInput[i].value) && s.length<500000 ) {
				rgInput[i].value = s;
			}
		}
	}
}
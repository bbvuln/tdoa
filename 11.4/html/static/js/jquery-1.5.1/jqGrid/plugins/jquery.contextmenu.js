/*
 * ContextMenu - jQuery plugin for right-click context menus
 *
 * Author: Chris Domigan
 * Contributors: Dan G. Switzer, II
 * Parts of this plugin are inspired by Joern Zaefferer's Tooltip plugin
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Version: r2
 * Date: 16 July 2007
 *
 * For documentation visit http://www.trendskitchens.co.nz/jquery/contextmenu/
 *
 */

(function($){var g,shadow,content,hash,currentTarget;var h={menuStyle:{listStyle:'none',padding:'1px',margin:'0px',backgroundColor:'#fff',border:'1px solid #999',width:'100px'},itemStyle:{margin:'0px',color:'#000',display:'block',cursor:'default',padding:'3px',border:'1px solid #fff',backgroundColor:'transparent'},itemHoverStyle:{border:'1px solid #0a246a',backgroundColor:'#b6bdd2'},eventPosX:'pageX',eventPosY:'pageY',shadow:true,onContextMenu:null,onShowMenu:null};$.fn.contextMenu=function(b,c){if(!g){g=$('<div id="jqContextMenu"></div>').hide().css({position:'absolute',zIndex:'500'}).appendTo('body').bind('click',function(e){e.stopPropagation()})}if(!shadow){shadow=$('<div></div>').css({backgroundColor:'#000',position:'absolute',opacity:0.2,zIndex:499}).appendTo('body').hide()}hash=hash||[];hash.push({id:b,menuStyle:$.extend({},h.menuStyle,c.menuStyle||{}),itemStyle:$.extend({},h.itemStyle,c.itemStyle||{}),itemHoverStyle:$.extend({},h.itemHoverStyle,c.itemHoverStyle||{}),bindings:c.bindings||{},shadow:c.shadow||c.shadow===false?c.shadow:h.shadow,onContextMenu:c.onContextMenu||h.onContextMenu,onShowMenu:c.onShowMenu||h.onShowMenu,eventPosX:c.eventPosX||h.eventPosX,eventPosY:c.eventPosY||h.eventPosY});var d=hash.length-1;$(this).bind('contextmenu',function(e){var a=(!!hash[d].onContextMenu)?hash[d].onContextMenu(e):true;currentTarget=e.target;if(a){display(d,this,e);return false}});return this};function display(c,d,e){var f=hash[c];content=$('#'+f.id).find('ul:first').clone(true);content.css(f.menuStyle).find('li').css(f.itemStyle).hover(function(){$(this).css(f.itemHoverStyle)},function(){$(this).css(f.itemStyle)}).find('img').css({verticalAlign:'middle',paddingRight:'2px'});g.html(content);if(!!f.onShowMenu)g=f.onShowMenu(e,g);$.each(f.bindings,function(a,b){$('#'+a,g).bind('click',function(){hide();b(d,currentTarget)})});g.css({'left':e[f.eventPosX],'top':e[f.eventPosY]}).show();if(f.shadow)shadow.css({width:g.width(),height:g.height(),left:e.pageX+2,top:e.pageY+2}).show();$(document).one('click',hide)}function hide(){g.hide();shadow.hide()}$.contextMenu={defaults:function(b){$.each(b,function(i,a){if(typeof a=='object'&&h[i]){$.extend(h[i],a)}else h[i]=a})}}})(jQuery);$(function(){$('div.contextMenu').hide()});
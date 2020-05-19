/**
 * TableDnD plug-in for JQuery, allows you to drag and drop table rows
 * You can set up various options to control how the system will work
 * Copyright (c) Denis Howlett <denish@isocra.com>
 * Licensed like jQuery, see http://docs.jquery.com/License.
 *
 * Configuration options:
 * 
 * onDragStyle
 *     This is the style that is assigned to the row during drag. There are limitations to the styles that can be
 *     associated with a row (such as you can't assign a border--well you can, but it won't be
 *     displayed). (So instead consider using onDragClass.) The CSS style to apply is specified as
 *     a map (as used in the jQuery css(...) function).
 * onDropStyle
 *     This is the style that is assigned to the row when it is dropped. As for onDragStyle, there are limitations
 *     to what you can do. Also this replaces the original style, so again consider using onDragClass which
 *     is simply added and then removed on drop.
 * onDragClass
 *     This class is added for the duration of the drag and then removed when the row is dropped. It is more
 *     flexible than using onDragStyle since it can be inherited by the row cells and other content. The default
 *     is class is tDnD_whileDrag. So to use the default, simply customise this CSS class in your
 *     stylesheet.
 * onDrop
 *     Pass a function that will be called when the row is dropped. The function takes 2 parameters: the table
 *     and the row that was dropped. You can work out the new order of the rows by using
 *     table.rows.
 * onDragStart
 *     Pass a function that will be called when the user starts dragging. The function takes 2 parameters: the
 *     table and the row which the user has started to drag.
 * onAllowDrop
 *     Pass a function that will be called as a row is over another row. If the function returns true, allow 
 *     dropping on that row, otherwise not. The function takes 2 parameters: the dragged row and the row under
 *     the cursor. It returns a boolean: true allows the drop, false doesn't allow it.
 * scrollAmount
 *     This is the number of pixels to scroll if the user moves the mouse cursor to the top or bottom of the
 *     window. The page should automatically scroll up or down as appropriate (tested in IE6, IE7, Safari, FF2,
 *     FF3 beta
 * dragHandle
 *     This is the name of a class that you assign to one or more cells in each row that is draggable. If you
 *     specify this class, then you are responsible for setting cursor: move in the CSS and only these cells
 *     will have the drag behaviour. If you do not specify a dragHandle, then you get the old behaviour where
 *     the whole row is draggable.
 * 
 * Other ways to control behaviour:
 *
 * Add class="nodrop" to any rows for which you don't want to allow dropping, and class="nodrag" to any rows
 * that you don't want to be draggable.
 *
 * Inside the onDrop method you can also call $.tableDnD.serialize() this returns a string of the form
 * <tableID>[]=<rowID1>&<tableID>[]=<rowID2> so that you can send this back to the server. The table must have
 * an ID as must all the rows.
 *
 * Other methods:
 *
 * $("...").tableDnDUpdate() 
 * Will update all the matching tables, that is it will reapply the mousedown method to the rows (or handle cells).
 * This is useful if you have updated the table rows using Ajax and you want to make the table draggable again.
 * The table maintains the original configuration (so you don't have to specify it again).
 *
 * $("...").tableDnDSerialize()
 * Will serialize and return the serialized string as above, but for each of the matching tables--so it can be
 * called from anywhere and isn't dependent on the currentTable being set up correctly before calling
 *
 * Known problems:
 * - Auto-scoll has some problems with IE7  (it scrolls even when it shouldn't), work-around: set scrollAmount to 0
 * 
 * Version 0.2: 2008-02-20 First public version
 * Version 0.3: 2008-02-07 Added onDragStart option
 *                         Made the scroll amount configurable (default is 5 as before)
 * Version 0.4: 2008-03-15 Changed the noDrag/noDrop attributes to nodrag/nodrop classes
 *                         Added onAllowDrop to control dropping
 *                         Fixed a bug which meant that you couldn't set the scroll amount in both directions
 *                         Added serialize method
 * Version 0.5: 2008-05-16 Changed so that if you specify a dragHandle class it doesn't make the whole row
 *                         draggable
 *                         Improved the serialize method to use a default (and settable) regular expression.
 *                         Added tableDnDupate() and tableDnDSerialize() to be called when you are outside the table
 */
jQuery.tableDnD={currentTable:null,dragObject:null,mouseOffset:null,oldY:0,build:function(a){this.each(function(){this.tableDnDConfig=jQuery.extend({onDragStyle:null,onDropStyle:null,onDragClass:"tDnD_whileDrag",onDrop:null,onDragStart:null,scrollAmount:5,serializeRegexp:/[^\-]*$/,serializeParamName:null,dragHandle:null},a||{});jQuery.tableDnD.makeDraggable(this)});jQuery(document).bind('mousemove',jQuery.tableDnD.mousemove).bind('mouseup',jQuery.tableDnD.mouseup);return this},makeDraggable:function(c){var d=c.tableDnDConfig;if(c.tableDnDConfig.dragHandle){var e=jQuery("td."+c.tableDnDConfig.dragHandle,c);e.each(function(){jQuery(this).mousedown(function(a){jQuery.tableDnD.dragObject=this.parentNode;jQuery.tableDnD.currentTable=c;jQuery.tableDnD.mouseOffset=jQuery.tableDnD.getMouseOffset(this,a);if(d.onDragStart){d.onDragStart(c,this)}return false})})}else{var f=jQuery("tr",c);f.each(function(){var b=jQuery(this);if(!b.hasClass("nodrag")){b.mousedown(function(a){if(a.target.tagName=="TD"){jQuery.tableDnD.dragObject=this;jQuery.tableDnD.currentTable=c;jQuery.tableDnD.mouseOffset=jQuery.tableDnD.getMouseOffset(this,a);if(d.onDragStart){d.onDragStart(c,this)}return false}}).css("cursor","move")}})}},updateTables:function(){this.each(function(){if(this.tableDnDConfig){jQuery.tableDnD.makeDraggable(this)}})},mouseCoords:function(a){if(a.pageX||a.pageY){return{x:a.pageX,y:a.pageY}}return{x:a.clientX+document.body.scrollLeft-document.body.clientLeft,y:a.clientY+document.body.scrollTop-document.body.clientTop}},getMouseOffset:function(a,b){b=b||window.event;var c=this.getPosition(a);var d=this.mouseCoords(b);return{x:d.x-c.x,y:d.y-c.y}},getPosition:function(e){var a=0;var b=0;if(e.offsetHeight==0){e=e.firstChild}if(e&&e.offsetParent){while(e.offsetParent){a+=e.offsetLeft;b+=e.offsetTop;e=e.offsetParent}a+=e.offsetLeft;b+=e.offsetTop}return{x:a,y:b}},mousemove:function(a){if(jQuery.tableDnD.dragObject==null){return}var b=jQuery(jQuery.tableDnD.dragObject);var c=jQuery.tableDnD.currentTable.tableDnDConfig;var d=jQuery.tableDnD.mouseCoords(a);var y=d.y-jQuery.tableDnD.mouseOffset.y;var e=window.pageYOffset;if(document.all){if(typeof document.compatMode!='undefined'&&document.compatMode!='BackCompat'){e=document.documentElement.scrollTop}else if(typeof document.body!='undefined'){e=document.body.scrollTop}}if(d.y-e<c.scrollAmount){window.scrollBy(0,-c.scrollAmount)}else{var f=window.innerHeight?window.innerHeight:document.documentElement.clientHeight?document.documentElement.clientHeight:document.body.clientHeight;if(f-(d.y-e)<c.scrollAmount){window.scrollBy(0,c.scrollAmount)}}if(y!=jQuery.tableDnD.oldY){var g=y>jQuery.tableDnD.oldY;jQuery.tableDnD.oldY=y;if(c.onDragClass){b.addClass(c.onDragClass)}else{b.css(c.onDragStyle)}var h=jQuery.tableDnD.findDropTargetRow(b,y);if(h){if(g&&jQuery.tableDnD.dragObject!=h){jQuery.tableDnD.dragObject.parentNode.insertBefore(jQuery.tableDnD.dragObject,h.nextSibling)}else if(!g&&jQuery.tableDnD.dragObject!=h){jQuery.tableDnD.dragObject.parentNode.insertBefore(jQuery.tableDnD.dragObject,h)}}}return false},findDropTargetRow:function(a,y){var b=jQuery.tableDnD.currentTable.rows;for(var i=0;i<b.length;i++){var c=b[i];var d=this.getPosition(c).y;var e=parseInt(c.offsetHeight)/2;if(c.offsetHeight==0){d=this.getPosition(c.firstChild).y;e=parseInt(c.firstChild.offsetHeight)/2}if((y>d-e)&&(y<(d+e))){if(c==a){return null}var f=jQuery.tableDnD.currentTable.tableDnDConfig;if(f.onAllowDrop){if(f.onAllowDrop(a,c)){return c}else{return null}}else{var g=jQuery(c).hasClass("nodrop");if(!g){return c}else{return null}}return c}}return null},mouseup:function(e){if(jQuery.tableDnD.currentTable&&jQuery.tableDnD.dragObject){var a=jQuery.tableDnD.dragObject;var b=jQuery.tableDnD.currentTable.tableDnDConfig;if(b.onDragClass){jQuery(a).removeClass(b.onDragClass)}else{jQuery(a).css(b.onDropStyle)}jQuery.tableDnD.dragObject=null;if(b.onDrop){b.onDrop(jQuery.tableDnD.currentTable,a)}jQuery.tableDnD.currentTable=null}},serialize:function(){if(jQuery.tableDnD.currentTable){return jQuery.tableDnD.serializeTable(jQuery.tableDnD.currentTable)}else{return"Error: No Table id set, you need to set an id on your table and every row"}},serializeTable:function(a){var b="";var c=a.id;var d=a.rows;for(var i=0;i<d.length;i++){if(b.length>0)b+="&";var e=d[i].id;if(e&&e&&a.tableDnDConfig&&a.tableDnDConfig.serializeRegexp){e=e.match(a.tableDnDConfig.serializeRegexp)[0]}b+=c+'[]='+e}return b},serializeTables:function(){var a="";this.each(function(){a+=jQuery.tableDnD.serializeTable(this)});return a}}jQuery.fn.extend({tableDnD:jQuery.tableDnD.build,tableDnDUpdate:jQuery.tableDnD.updateTables,tableDnDSerialize:jQuery.tableDnD.serializeTables});
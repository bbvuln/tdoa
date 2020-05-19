/* Plugin:      searchFilter v1.2.9
 * Author:      Kasey Speakman (kasey@cornerspeed.com)
 * License:     Dual Licensed, MIT and GPL v2 (http://www.gnu.org/licenses/gpl-2.0.html)
 *
 * REQUIREMENTS:
 *    jQuery 1.3+           (http://jquery.com/)
 *    A Themeroller Theme   (http://jqueryui.com/themeroller/)
 *
 * SECURITY WARNING
 *    You should always implement server-side checking to ensure that
 *    the query will fail when forged/invalid data is received.
 *    Clever users can send any value they want through JavaScript and HTTP POST/GET.
 *
 * THEMES
 *    Simply include the CSS file for your Themeroller theme.
 *
 * DESCRIPTION
 *     This plugin creates a new searchFilter object in the specified container
 *
 * INPUT TYPE
 *     fields:  an array of field objects. each object has the following properties:
 *              text: a string containing the display name of the field (e.g. "Field 1")
 *              itemval: a string containing the actual field name (e.g. "field1")
 *              optional properties:
 *                  ops: an array of operators in the same format as jQuery.fn.searchFilter.defaults.operators
 *                       that is: [ { op: 'gt', text: 'greater than'}, { op:'lt', text: 'less than'}, ... ]
 *                       if not specified, the passed-in options used, and failting that, jQuery.fn.searchFilter.defaults.operators will be used
 *                  *** NOTE ***
 *                  Specifying a dataUrl or dataValues property means that a <select ...> (drop-down-list) will be generated
 *                  instead of a text input <input type='text'.../> where the user would normally type in their search data
 *                  ************
 *                  dataUrl: a url that will return the html select for this field, this url will only be called once for this field
 *                  dataValues: the possible values for this field in the form [ { text: 'Data Display Text', value: 'data_actual_value' }, { ... } ]
 *                  dataInit: a function that you can use to initialize the data field. this function is passed the jQuery-fied data element
 *                  dataEvents: list of events to apply to the data element. uses $("#id").bind(type, [data], fn) to bind events to data element
 *              *** JSON of this object could look like this: ***
 *               var fields = [
 *                 {
 *                   text: 'Field Display Name',
 *                   itemval: 'field_actual_name',
 *                   // below this are optional values
 *                   ops: [ // this format is the same as jQuery.fn.searchFilter.defaults.operators
 *                     { op: 'gt', text: 'greater than' },
 *                     { op: 'lt', text: 'less than' }
 *                   ],
 *                   dataUrl: 'http://server/path/script.php?propName=propValue', // using this creates a select for the data input instead of an input type='text'
 *                   dataValues: [ // using this creates a select for the data input instead of an input type='text'
 *                     { text: 'Data Value Display Name', value: 'data_actual_value' },
 *                     { ... }
 *                   ],
 *                   dataInit: function(jElem) { jElem.datepicker(options); },
 *                   dataEvents: [ // these are the same options that you pass to $("#id").bind(type, [data], fn)
 *                     { type: 'click', data: { i: 7 }, fn: function(e) { console.log(e.data.i); } },
 *                     { type: 'keypress', fn: function(e) { console.log('keypress'); } }
 *                   ]
 *                 },
 *                 { ... }
 *               ]
 *     options: name:value properties containing various creation options
 *              see jQuery.fn.searchFilter.defaults for the overridable options
 *
 * RETURN TYPE: This plugin returns a SearchFilter object, which has additional SearchFilter methods:
 *     Methods
 *         add:    Adds a filter. added to the end of the list unless a jQuery event object or valid row number is passed.
 *         del:    Removes a filter. removed from the end of the list unless a jQuery event object or valid row number is passed.
 *         reset:  resets filters back to original state (only one blank filter), and calls onReset
 *         search: puts the search rules into an object and calls onSearch with it
 *         close:  calls the onClose event handler
 *
 * USAGE
 *     HTML
 *         <head>
 *             ...
 *             <script src="path/to/jquery.min.js" type="text/javascript"></script>
 *             <link href="path/to/themeroller.css" rel="Stylesheet" type="text/css" />
 *             <script src="path/to/jquery.searchFilter.js" type="text/javascript"></script>
 *             <link href="path/to/jquery.searchFilter.css" rel="Stylesheet" type="text/css" />
 *             ...
 *         </head>
 *         <body>
 *             ...
 *             <div id='mySearch'></div>
 *             ...
 *         </body>
 *     JQUERY
 *         Methods
 *             initializing: $("#mySearch").searchFilter([{text: "Field 1", value: "field1"},{text: "Field 2", value: "field2"}], {onSearch: myFilterRuleReceiverFn, onReset: myFilterResetFn });
 *         Manual Methods (there's no need to call these methods unless you are trying to manipulate searchFilter with script)
 *             add:          $("#mySearch").searchFilter().add();     // appends a blank filter
 *                           $("#mySearch").searchFilter().add(0);    // copies the first filter as second
 *             del:          $("#mySearch").searchFilter().del();     // removes the bottom filter
 *                           $("#mySearch").searchFilter().del(1);    // removes the second filter
 *             search:       $("#mySearch").searchFilter().search();  // invokes onSearch, passing it a ruleGroup object
 *             reset:        $("#mySearch").searchFilter().reset();   // resets rules and invokes onReset
 *             close:        $("#mySearch").searchFilter().close();   // without an onClose handler, equivalent to $("#mySearch").hide();
 * 
 * NOTE: You can get the jQuery object back from the SearchFilter object by chaining .$
 *     Example
 *         $("#mySearch").searchFilter().add().add().reset().$.hide();
 *     Verbose Example
 *         $("#mySearch")      // gets jQuery object for the HTML element with id="mySearch"
 *             .searchFilter() // gets the SearchFilter object for an existing search filter
 *             .add()          // adds a new filter to the end of the list
 *             .add()          // adds another new filter to the end of the list
 *             .reset()        // resets filters back to original state, triggers onReset
 *             .$              // returns jQuery object for $("#mySearch")
 *             .hide();        // equivalent to $("#mySearch").hide();
 */
jQuery.fn.searchFilter=function(C,D){function SearchFilter(k,m,n){this.$=k;this.add=function(i){if(i==null)k.find(".ui-add-last").click();else k.find(".sf:eq("+i+") .ui-add").click();return this};this.del=function(i){if(i==null)k.find(".sf:last .ui-del").click();else k.find(".sf:eq("+i+") .ui-del").click();return this};this.search=function(e){k.find(".ui-search").click();return this};this.reset=function(o){if(o===undefined)o=false;k.find(".ui-reset").trigger('click',[o]);return this};this.close=function(){k.find(".ui-closer").click();return this};if(m!=null){function hover(){jQuery(this).toggleClass("ui-state-hover");return false}function active(e){jQuery(this).toggleClass("ui-state-active",(e.type=="mousedown"));return false}function buildOpt(a,b){return"<option value='"+a+"'>"+b+"</option>"}function buildSel(a,b,c){return"<select class='"+a+"'"+(c?" style='display:none;'":"")+">"+b+"</select>"}function initData(a,b){var c=k.find("tr.sf td.data "+a);if(c[0]!=null)b(c)}function bindDataEvents(a,b){var c=k.find("tr.sf td.data "+a);if(c[0]!=null){jQuery.each(b,function(){if(this.data!=null)c.bind(this.type,this.data,this.fn);else c.bind(this.type,this.fn)})}}var p=jQuery.extend({},jQuery.fn.searchFilter.defaults,n);var q=-1;var r="";jQuery.each(p.groupOps,function(){r+=buildOpt(this.op,this.text)});r="<select name='groupOp'>"+r+"</select>";k.html("").addClass("ui-searchFilter").append("<div class='ui-widget-overlay' style='z-index: -1'>&#160;</div><table class='ui-widget-content ui-corner-all'><thead><tr><td colspan='5' class='ui-widget-header ui-corner-all' style='line-height: 18px;'><div class='ui-closer ui-state-default ui-corner-all ui-helper-clearfix' style='float: right;'><span class='ui-icon ui-icon-close'></span></div>"+p.windowTitle+"</td></tr></thead><tbody><tr class='sf'><td class='fields'></td><td class='ops'></td><td class='data'></td><td><div class='ui-del ui-state-default ui-corner-all'><span class='ui-icon ui-icon-minus'></span></div></td><td><div class='ui-add ui-state-default ui-corner-all'><span class='ui-icon ui-icon-plus'></span></div></td></tr><tr><td colspan='5' class='divider'><hr class='ui-widget-content' style='margin:1px'/></td></tr></tbody><tfoot><tr><td colspan='3'><span class='ui-reset ui-state-default ui-corner-all' style='display: inline-block; float: left;'><span class='ui-icon ui-icon-arrowreturnthick-1-w' style='float: left;'></span><span style='line-height: 18px; padding: 0 7px 0 3px;'>"+p.resetText+"</span></span><span class='ui-search ui-state-default ui-corner-all' style='display: inline-block; float: right;'><span class='ui-icon ui-icon-search' style='float: left;'></span><span style='line-height: 18px; padding: 0 7px 0 3px;'>"+p.searchText+"</span></span><span class='matchText'>"+p.matchText+"</span> "+r+" <span class='rulesText'>"+p.rulesText+"</span></td><td>&#160;</td><td><div class='ui-add-last ui-state-default ui-corner-all'><span class='ui-icon ui-icon-plusthick'></span></div></td></tr></tfoot></table>");var s=k.find("tr.sf");var t=s.find("td.fields");var u=s.find("td.ops");var v=s.find("td.data");var w="";jQuery.each(p.operators,function(){w+=buildOpt(this.op,this.text)});w=buildSel("default",w,true);u.append(w);var x="<input type='text' class='default' style='display:none;' />";v.append(x);var y="";var z=false;var A=false;jQuery.each(m,function(i){var c=i;y+=buildOpt(this.itemval,this.text);if(this.ops!=null){z=true;var d="";jQuery.each(this.ops,function(){d+=buildOpt(this.op,this.text)});d=buildSel("field"+c,d,true);u.append(d)}if(this.dataUrl!=null){if(i>q)q=i;A=true;var e=this.dataEvents;var f=this.dataInit;var g=this.buildSelect;jQuery.ajax(jQuery.extend({url:this.dataUrl,complete:function(a){var b;if(g!=null)b=jQuery("<div />").append(g(a));else b=jQuery("<div />").append(a.responseText);b.find("select").addClass("field"+c).hide();v.append(b.html());if(f)initData(".field"+i,f);if(e)bindDataEvents(".field"+i,e);if(i==q){k.find("tr.sf td.fields select[name='field']").change()}}},p.ajaxSelectOptions))}else if(this.dataValues!=null){A=true;var h="";jQuery.each(this.dataValues,function(){h+=buildOpt(this.value,this.text)});h=buildSel("field"+c,h,true);v.append(h)}else if(this.dataEvents!=null||this.dataInit!=null){A=true;var h="<input type='text' class='field"+c+"' />";v.append(h)}if(this.dataInit!=null&&i!=q)initData(".field"+i,this.dataInit);if(this.dataEvents!=null&&i!=q)bindDataEvents(".field"+i,this.dataEvents)});y="<select name='field'>"+y+"</select>";t.append(y);var B=t.find("select[name='field']");if(z)B.change(function(e){var a=e.target.selectedIndex;var b=jQuery(e.target).parents("tr.sf").find("td.ops");b.find("select").removeAttr("name").hide();var c=b.find(".field"+a);if(c[0]==null)c=b.find(".default");c.attr("name","op").show();return false});else u.find(".default").attr("name","op").show();if(A)B.change(function(e){var a=e.target.selectedIndex;var b=jQuery(e.target).parents("tr.sf").find("td.data");b.find("select,input").removeClass("vdata").hide();var c=b.find(".field"+a);if(c[0]==null)c=b.find(".default");c.show().addClass("vdata");return false});else v.find(".default").show().addClass("vdata");if(z||A)B.change();k.find(".ui-state-default").hover(hover,hover).mousedown(active).mouseup(active);k.find(".ui-closer").click(function(e){p.onClose(jQuery(k.selector));return false});k.find(".ui-del").click(function(e){var b=jQuery(e.target).parents(".sf");if(b.siblings(".sf").length>0){if(p.datepickerFix===true&&jQuery.fn.datepicker!==undefined)b.find(".hasDatepicker").datepicker("destroy");b.remove()}else{b.find("select[name='field']")[0].selectedIndex=0;b.find("select[name='op']")[0].selectedIndex=0;b.find(".data input").val("");b.find(".data select").each(function(){this.selectedIndex=0});b.find("select[name='field']").change(function(a){a.stopPropagation()})}return false});k.find(".ui-add").click(function(e){var b=jQuery(e.target).parents(".sf");var c=b.clone(true).insertAfter(b);c.find(".ui-state-default").removeClass("ui-state-hover ui-state-active");if(p.clone){c.find("select[name='field']")[0].selectedIndex=b.find("select[name='field']")[0].selectedIndex;var d=(c.find("select[name='op']")[0]==null);if(!d)c.find("select[name='op']").focus()[0].selectedIndex=b.find("select[name='op']")[0].selectedIndex;var f=c.find("select.vdata");if(f[0]!=null)f[0].selectedIndex=b.find("select.vdata")[0].selectedIndex}else{c.find(".data input").val("");c.find("select[name='field']").focus()}if(p.datepickerFix===true&&jQuery.fn.datepicker!==undefined){b.find(".hasDatepicker").each(function(){var a=jQuery.data(this,"datepicker").settings;c.find("#"+this.id).unbind().removeAttr("id").removeClass("hasDatepicker").datepicker(a)})}c.find("select[name='field']").change(function(a){a.stopPropagation()});return false});k.find(".ui-search").click(function(e){var d=jQuery(k.selector);var f;var g=d.find("select[name='groupOp'] :selected").val();if(!p.stringResult){f={groupOp:g,rules:[]}}else{f="{\"groupOp\":\""+g+"\",\"rules\":["}d.find(".sf").each(function(i){var a=jQuery(this).find("select[name='field'] :selected").val();var b=jQuery(this).find("select[name='op'] :selected").val();var c=jQuery(this).find("input.vdata,select.vdata :selected").val();c+="";if(!p.stringResult){f.rules.push({field:a,op:b,data:c})}else{c=c.replace(/\\/g,'\\\\').replace(/\"/g,'\\"');if(i>0)f+=",";f+="{\"field\":\""+a+"\",";f+="\"op\":\""+b+"\",";f+="\"data\":\""+c+"\"}"}});if(p.stringResult)f+="]}";p.onSearch(f);return false});k.find(".ui-reset").click(function(e,a){var b=jQuery(k.selector);b.find(".ui-del").click();b.find("select[name='groupOp']")[0].selectedIndex=0;p.onReset(a);return false});k.find(".ui-add-last").click(function(){var b=jQuery(k.selector+" .sf:last");var c=b.clone(true).insertAfter(b);c.find(".ui-state-default").removeClass("ui-state-hover ui-state-active");c.find(".data input").val("");c.find("select[name='field']").focus();if(p.datepickerFix===true&&jQuery.fn.datepicker!==undefined){b.find(".hasDatepicker").each(function(){var a=jQuery.data(this,"datepicker").settings;c.find("#"+this.id).unbind().removeAttr("id").removeClass("hasDatepicker").datepicker(a)})}c.find("select[name='field']").change(function(a){a.stopPropagation()});return false});this.setGroupOp=function(b){selDOMobj=k.find("select[name='groupOp']")[0];var c={},l=selDOMobj.options.length,i;for(i=0;i<l;i++){c[selDOMobj.options[i].value]=i}selDOMobj.selectedIndex=c[b];jQuery(selDOMobj).change(function(a){a.stopPropagation()})};this.setFilter=function(a){var o=a['sfref'],filter=a['filter'];var b=[],i,j,l,lj,li,valueindexmap={};selDOMobj=o.find("select[name='field']")[0];for(i=0,l=selDOMobj.options.length;i<l;i++){valueindexmap[selDOMobj.options[i].value]={'index':i,'ops':{}};b.push(selDOMobj.options[i].value)}for(i=0,li=b.length;i<li;i++){selDOMobj=o.find(".ops > select[class='field"+i+"']")[0];if(selDOMobj){for(j=0,lj=selDOMobj.options.length;j<lj;j++){valueindexmap[b[i]]['ops'][selDOMobj.options[j].value]=j}}selDOMobj=o.find(".data > select[class='field"+i+"']")[0];if(selDOMobj){valueindexmap[b[i]]['data']={};for(j=0,lj=selDOMobj.options.length;j<lj;j++){valueindexmap[b[i]]['data'][selDOMobj.options[j].value]=j}}}var c,fieldindex,opindex,datavalue,dataindex;c=filter['field'];if(valueindexmap[c]){fieldindex=valueindexmap[c]['index']}if(fieldindex!=null){opindex=valueindexmap[c]['ops'][filter['op']];if(opindex===undefined){for(i=0,li=n.operators.length;i<li;i++){if(n.operators[i].op==filter.op){opindex=i;break}}}datavalue=filter['data'];if(valueindexmap[c]['data']==null){dataindex=-1}else{dataindex=valueindexmap[c]['data'][datavalue]}}if(fieldindex!=null&&opindex!=null&&dataindex!=null){o.find("select[name='field']")[0].selectedIndex=fieldindex;o.find("select[name='field']").change();o.find("select[name='op']")[0].selectedIndex=opindex;o.find("input.vdata").val(datavalue);o=o.find("select.vdata")[0];if(o){o.selectedIndex=dataindex}return true}else{return false}}}}return new SearchFilter(this,C,D)};jQuery.fn.searchFilter.version='1.2.9';jQuery.fn.searchFilter.defaults={clone:true,datepickerFix:true,onReset:function(a){alert("Reset Clicked. Data Returned: "+a)},onSearch:function(a){alert("Search Clicked. Data Returned: "+a)},onClose:function(a){a.hide()},groupOps:[{op:"AND",text:"all"},{op:"OR",text:"any"}],operators:[{op:"eq",text:"is equal to"},{op:"ne",text:"is not equal to"},{op:"lt",text:"is less than"},{op:"le",text:"is less or equal to"},{op:"gt",text:"is greater than"},{op:"ge",text:"is greater or equal to"},{op:"in",text:"is in"},{op:"ni",text:"is not in"},{op:"bw",text:"begins with"},{op:"bn",text:"does not begin with"},{op:"ew",text:"ends with"},{op:"en",text:"does not end with"},{op:"cn",text:"contains"},{op:"nc",text:"does not contain"}],matchText:"match",rulesText:"rules",resetText:"Reset",searchText:"Search",stringResult:true,windowTitle:"Search Rules",ajaxSelectOptions:{}};
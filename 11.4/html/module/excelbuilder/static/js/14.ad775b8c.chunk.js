(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{618:function(e,t,a){"use strict";a(31),a(620)},619:function(e,t,a){"use strict";var n=a(0),r=a(12),c=a(39),l=a(8),s=a(4),o=a.n(s),i=a(14);function m(e){return(m="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function u(){return(u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e}).apply(this,arguments)}function p(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function f(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function d(e){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function h(e,t){return(h=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function b(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function E(){}a.d(t,"a",function(){return v});var v=function(e){function t(){var e,a,s;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),a=this,s=d(t).apply(this,arguments),(e=!s||"object"!==m(s)&&"function"!==typeof s?b(a):s).state={closing:!0,closed:!1},e.handleClose=function(t){t.preventDefault();var a=r.findDOMNode(b(b(e)));a.style.height="".concat(a.offsetHeight,"px"),a.style.height="".concat(a.offsetHeight,"px"),e.setState({closing:!1}),(e.props.onClose||E)(t)},e.animationEnd=function(){e.setState({closed:!0,closing:!0}),(e.props.afterClose||E)()},e.renderAlert=function(t){var a,r,s=t.getPrefixCls,i=e.props,m=i.description,f=i.prefixCls,d=i.message,h=i.closeText,b=i.banner,E=i.className,v=void 0===E?"":E,y=i.style,g=i.icon,N=e.props,w=N.closable,C=N.type,k=N.showIcon,x=N.iconType,O=s("alert",f);k=!(!b||void 0!==k)||k,C=b&&void 0===C?"warning":C||"info";var P="filled";if(!x){switch(C){case"success":x="check-circle";break;case"info":x="info-circle";break;case"error":x="close-circle";break;case"warning":x="exclamation-circle";break;default:x="default"}m&&(P="outlined")}h&&(w=!0);var j,S=o()(O,"".concat(O,"-").concat(C),(p(a={},"".concat(O,"-close"),!e.state.closing),p(a,"".concat(O,"-with-description"),!!m),p(a,"".concat(O,"-no-icon"),!k),p(a,"".concat(O,"-banner"),!!b),p(a,"".concat(O,"-closable"),w),a),v),_=w?n.createElement("a",{onClick:e.handleClose,className:"".concat(O,"-close-icon")},h||n.createElement(l.a,{type:"close"})):null,T=(j=e.props,Object.keys(j).reduce(function(e,t){return"data-"!==t.substr(0,5)&&"aria-"!==t.substr(0,5)&&"role"!==t||"data-__"===t.substr(0,7)||(e[t]=j[t]),e},{})),I=g&&(n.isValidElement(g)?n.cloneElement(g,{className:o()((r={},p(r,g.props.className,g.props.className),p(r,"".concat(O,"-icon"),!0),r))}):n.createElement("span",{className:"".concat(O,"-icon")},g))||n.createElement(l.a,{className:"".concat(O,"-icon"),type:x,theme:P});return e.state.closed?null:n.createElement(c.a,{component:"",showProp:"data-show",transitionName:"".concat(O,"-slide-up"),onEnd:e.animationEnd},n.createElement("div",u({"data-show":e.state.closing,className:S,style:y},T),k?I:null,n.createElement("span",{className:"".concat(O,"-message")},d),n.createElement("span",{className:"".concat(O,"-description")},m),_))},e}var a,s,v;return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&h(e,t)}(t,n["Component"]),a=t,(s=[{key:"render",value:function(){return n.createElement(i.a,null,this.renderAlert)}}])&&f(a.prototype,s),v&&f(a,v),t}()},620:function(e,t,a){},649:function(e,t,a){"use strict";a.r(t);a(618);var n=a(619),r=(a(94),a(22)),c=(a(52),a(10)),l=a(95),s=a(11),o=a(23),i=a(24),m=a(29),u=a(28),p=a(30),f=a(63),d=(a(295),a(149)),h=a(0),b=a.n(h),E=a(96),v=(a(622),a(199),d.a.TabPane),y=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(m.a)(this,Object(u.a)(t).call(this,e))).owner=a.props.owner,a.state={ischanged:!1,exprShowFlag:!1,outLinkShowFlag:!1,name:"",title:"\u9644\u4ef6",alias:"",desc:"",defaultType:"custom",defaultValue:"",required:!1,noDup:!1,readonly:!1,hidden:!1,asTitle:!1,isSearch:!1,link:"",type:"attachment",multi:!1,className:"",hoverClassName:"",isview:!1},a.state=Object(s.a)({},a.state,a.props.def),a.commonControllesIndex=E.b.filter(function(e){return e.name===a.state.type}),a.allControllesIndex=E.a.filter(function(e){return e.name===a.state.type}),a.owner.comfirmControlProp=a.comfirmControlProp.bind(Object(f.a)(Object(f.a)(a))),a}return Object(p.a)(t,e),Object(i.a)(t,[{key:"componentWillReceiveProps",value:function(e){var t=Object(s.a)({},this.state,e.def,{ischanged:!1});this.setState(t)}},{key:"setControlProp",value:function(e,t){var a,n=this;"defaultType"===e?this.setState((a={},Object(l.a)(a,e,t),Object(l.a)(a,"defaultValue",""),a)):this.setState(Object(l.a)({},e,t));this.setState({ischanged:!0}),"type"===e&&window.setTimeout(function(){return n.comfirmControlProp()},0)}},{key:"comfirmControlProp",value:function(){if(this.state.ischanged){this.setState({ischanged:!1});var e=Object(s.a)({},this.state);delete e.ischanged,delete e.exprShowFlag,delete e.outLinkShowFlag,this.owner.sysCurCellMeta(e)}""!==this.props.parent_list&&this.owner.setState({curSubField:null,curSubFieldIndex:0})}},{key:"render",value:function(){var e=this,t=this.commonControllesIndex,a=this.allControllesIndex;this.state.defaultValue,this.props.formId;return b.a.createElement("div",{className:"config-panel"},""!==this.props.parent_list?b.a.createElement(c.a,{className:"ant-btn save-btn",onClick:this.comfirmControlProp.bind(this)},"\u786e\u5b9a"):null,b.a.createElement(d.a,{defaultActiveKey:"1",size:"small",tabBarGutter:"0"},b.a.createElement(v,{tab:"\u57fa\u672c\u5c5e\u6027",key:"1"},b.a.createElement("div",{className:"ant-row ant-form-item"},b.a.createElement("div",{className:"ant-form-item-label"},b.a.createElement("label",null,"\u540d\u79f0")),b.a.createElement("div",{className:"ant-form-item-control has-success"},b.a.createElement("span",{className:"ant-input-wrapper"},b.a.createElement("input",{type:"text",placeholder:"\u8bf7\u8f93\u5165\u63a7\u4ef6\u540d\u79f0",className:"config-text-len ant-input",value:this.state.title,onChange:function(t){return e.setControlProp("title",t.target.value)}})))),b.a.createElement("div",{className:"ant-row ant-form-item"},b.a.createElement("div",{className:"ant-form-item-label"},b.a.createElement("label",null,"\u663e\u793a\u522b\u540d")),b.a.createElement("div",{className:"ant-form-item-control has-success"},b.a.createElement("span",{className:"ant-input-wrapper"},b.a.createElement("input",{type:"text",placeholder:"\u8bf7\u8f93\u5165\u663e\u793a\u522b\u540d",className:"config-text-len ant-input",value:this.state.alias,onChange:function(t){return e.setControlProp("alias",t.target.value)}})))),b.a.createElement("div",{className:"ant-row ant-form-item"},b.a.createElement("div",{className:"ant-form-item-label"},b.a.createElement("label",null,"\u63a7\u4ef6\u7c7b\u578b"),b.a.createElement("span",{className:"ant-input-wrapper config-typename"},t&&t.length>0?b.a.createElement(r.a,{value:[this.state.type],onChange:function(t){return e.setControlProp("type",t)},size:"small",style:{width:"120px"}},E.b.map(function(e){return b.a.createElement(r.a.Option,{value:e.name,key:e.name},e.label)})):b.a.createElement("span",{className:"ant-input-wrapper config-typename"},a[0].label)))),b.a.createElement("div",{className:"ant-row ant-form-item"},b.a.createElement("div",{className:"ant-form-item-label"},b.a.createElement("label",null,"\u63cf\u8ff0")),b.a.createElement("div",{className:"ant-form-item-control has-success"},b.a.createElement("span",{className:"ant-input-wrapper"},b.a.createElement("textarea",{type:"textarea",placeholder:"\u8bf7\u8f93\u5165\u63a7\u4ef6\u63cf\u8ff0",className:"config-text-desc ant-input",value:this.state.desc,onChange:function(t){return e.setControlProp("desc",t.target.value)}})))),b.a.createElement("div",{className:"ant-row ant-form-item last-ant-form-item"},b.a.createElement("div",{class:"ant-form-item-control has-success"},b.a.createElement("label",{class:"ant-checkbox-wrapper"},b.a.createElement("input",{type:"checkbox",class:"config-address-multi",checked:this.state.multi,onChange:function(t){return e.setControlProp("multi",t.target.checked)}}),b.a.createElement("span",null,"\u591a\u6587\u4ef6"))),b.a.createElement("div",{className:"ant-form-item-control has-success"},b.a.createElement("label",{className:"ant-checkbox-wrapper"},b.a.createElement("input",{type:"checkbox",className:"config-text-required",checked:this.state.required,onChange:function(t){return e.setControlProp("required",t.target.checked)}}),b.a.createElement("span",null,"\u5fc5\u586b"))),b.a.createElement("div",{className:"ant-form-item-control has-success"},b.a.createElement("label",{className:"ant-checkbox-wrapper"},b.a.createElement("input",{type:"checkbox",className:"config-text-readonly",checked:this.state.readonly,onChange:function(t){return e.setControlProp("readonly",t.target.checked)}}),b.a.createElement("span",null,"\u53ea\u8bfb"))),b.a.createElement("div",{className:"ant-form-item-control has-success"},b.a.createElement("label",{className:"ant-checkbox-wrapper"},b.a.createElement("input",{type:"checkbox",className:"config-text-hidden",checked:this.state.hidden,onChange:function(t){return e.setControlProp("hidden",t.target.checked)}}),b.a.createElement("span",null,"\u9690\u85cf"))),""===this.props.parent_list?b.a.createElement("div",{className:"ant-form-item-control has-success"},b.a.createElement("label",{className:"ant-checkbox-wrapper"},b.a.createElement("input",{type:"checkbox",className:"config-text-isview",checked:this.state.isview,onChange:function(t){return e.setControlProp("isview",t.target.checked)}}),b.a.createElement("span",null,"\u662f\u5426\u5728\u6570\u636e\u7ba1\u7406\u9690\u85cf"))):null)),b.a.createElement(v,{tab:"\u6837\u5f0f",key:"2"},b.a.createElement("div",null,b.a.createElement("div",{className:"ant-row ant-form-item"},b.a.createElement("div",{className:"ant-form-item-label"},b.a.createElement("label",null,"\u8f93\u5165\u6846\u6837\u5f0f")),b.a.createElement("div",{className:"ant-form-item-control has-success"},b.a.createElement("span",{className:"ant-input-wrapper"},b.a.createElement("input",{type:"text",placeholder:"\u8bf7\u8f93\u5165\u6837\u5f0f\u540d\u79f0",className:"config-text-classname ant-input",value:this.state.className,onChange:function(t){return e.setControlProp("className",t.target.value)}})))),b.a.createElement("div",{className:"ant-row ant-form-item"},b.a.createElement("div",{className:"ant-form-item-label"},b.a.createElement("label",null,"\u8f93\u5165\u6846\u9f20\u6807\u60ac\u505c\u6837\u5f0f")),b.a.createElement("div",{className:"ant-form-item-control has-success"},b.a.createElement("span",{className:"ant-input-wrapper"},b.a.createElement("input",{type:"text",placeholder:"\u8bf7\u8f93\u5165\u6837\u5f0f\u540d\u79f0",className:"config-text-hoverclassName ant-input",value:this.state.hoverClassName,onChange:function(t){return e.setControlProp("hoverClassName",t.target.value)}})))),b.a.createElement("div",{className:"ant-row ant-form-item"},b.a.createElement(n.a,{message:"\u81ea\u5b9a\u4e49\u6837\u5f0f\u6587\u4ef6\u540d\u79f0\u53ca\u5b58\u653e\u8def\u5f84\u4e3a\uff1a/static/modules/appbuilder/appcenter/appform/{formNo}/addon.css, \u5176\u4e2d{formNo}\u4ee3\u8868\u8868\u5355\u7f16\u53f7\u3002\u5047\u5982\u8868\u5355\u7f16\u53f7\u4e3a\uff1afrm01\uff0c\u90a3\u4e48\u81ea\u5b9a\u4e49\u6837\u5f0f\u6587\u4ef6\u4e3a\uff1a/static/modules/appbuilder/appcenter/appform/frm01/addon.css",type:"info",style:{"word-break":"break-all"}}))))))}}]),t}(h.Component);t.default=y}}]);
//# sourceMappingURL=14.ad775b8c.chunk.js.map
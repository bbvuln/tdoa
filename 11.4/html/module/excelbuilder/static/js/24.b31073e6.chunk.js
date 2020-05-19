(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{618:function(e,t,a){"use strict";a(31),a(620)},619:function(e,t,a){"use strict";var n=a(0),r=a(12),l=a(39),o=a(8),c=a(4),s=a.n(c),i=a(14);function m(e){return(m="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function p(){return(p=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e}).apply(this,arguments)}function u(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function f(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function d(e){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function h(e,t){return(h=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function b(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function v(){}a.d(t,"a",function(){return E});var E=function(e){function t(){var e,a,c;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),a=this,c=d(t).apply(this,arguments),(e=!c||"object"!==m(c)&&"function"!==typeof c?b(a):c).state={closing:!0,closed:!1},e.handleClose=function(t){t.preventDefault();var a=r.findDOMNode(b(b(e)));a.style.height="".concat(a.offsetHeight,"px"),a.style.height="".concat(a.offsetHeight,"px"),e.setState({closing:!1}),(e.props.onClose||v)(t)},e.animationEnd=function(){e.setState({closed:!0,closing:!0}),(e.props.afterClose||v)()},e.renderAlert=function(t){var a,r,c=t.getPrefixCls,i=e.props,m=i.description,f=i.prefixCls,d=i.message,h=i.closeText,b=i.banner,v=i.className,E=void 0===v?"":v,y=i.style,N=i.icon,g=e.props,w=g.closable,C=g.type,k=g.showIcon,O=g.iconType,x=c("alert",f);k=!(!b||void 0!==k)||k,C=b&&void 0===C?"warning":C||"info";var j="filled";if(!O){switch(C){case"success":O="check-circle";break;case"info":O="info-circle";break;case"error":O="close-circle";break;case"warning":O="exclamation-circle";break;default:O="default"}m&&(j="outlined")}h&&(w=!0);var P,S=s()(x,"".concat(x,"-").concat(C),(u(a={},"".concat(x,"-close"),!e.state.closing),u(a,"".concat(x,"-with-description"),!!m),u(a,"".concat(x,"-no-icon"),!k),u(a,"".concat(x,"-banner"),!!b),u(a,"".concat(x,"-closable"),w),a),E),_=w?n.createElement("a",{onClick:e.handleClose,className:"".concat(x,"-close-icon")},h||n.createElement(o.a,{type:"close"})):null,F=(P=e.props,Object.keys(P).reduce(function(e,t){return"data-"!==t.substr(0,5)&&"aria-"!==t.substr(0,5)&&"role"!==t||"data-__"===t.substr(0,7)||(e[t]=P[t]),e},{})),I=N&&(n.isValidElement(N)?n.cloneElement(N,{className:s()((r={},u(r,N.props.className,N.props.className),u(r,"".concat(x,"-icon"),!0),r))}):n.createElement("span",{className:"".concat(x,"-icon")},N))||n.createElement(o.a,{className:"".concat(x,"-icon"),type:O,theme:j});return e.state.closed?null:n.createElement(l.a,{component:"",showProp:"data-show",transitionName:"".concat(x,"-slide-up"),onEnd:e.animationEnd},n.createElement("div",p({"data-show":e.state.closing,className:S,style:y},F),k?I:null,n.createElement("span",{className:"".concat(x,"-message")},d),n.createElement("span",{className:"".concat(x,"-description")},m),_))},e}var a,c,E;return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&h(e,t)}(t,n["Component"]),a=t,(c=[{key:"render",value:function(){return n.createElement(i.a,null,this.renderAlert)}}])&&f(a.prototype,c),E&&f(a,E),t}()},620:function(e,t,a){},658:function(e,t,a){"use strict";a.r(t);a(73);var n=a(34),r=(a(618),a(619)),l=(a(94),a(22)),o=(a(52),a(10)),c=a(95),s=a(11),i=a(23),m=a(24),p=a(29),u=a(28),f=a(30),d=a(63),h=(a(295),a(149)),b=a(0),v=a.n(b),E=a(96),y=(a(622),a(199),h.a.TabPane),N=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(p.a)(this,Object(u.a)(t).call(this,e))).owner=a.props.owner,a.state={ischanged:!1,exprShowFlag:!1,outLinkShowFlag:!1,name:"",title:"\u6309\u94ae",alias:"",desc:"",type:"button",className:"",hoverClassName:"",onclick:"",ondblclick:""},a.state=Object(s.a)({},a.state,a.props.def),a.commonControllesIndex=E.b.filter(function(e){return e.name===a.state.type}),a.allControllesIndex=E.a.filter(function(e){return e.name===a.state.type}),a.owner.comfirmControlProp=a.comfirmControlProp.bind(Object(d.a)(Object(d.a)(a))),a}return Object(f.a)(t,e),Object(m.a)(t,[{key:"componentWillReceiveProps",value:function(e){var t=Object(s.a)({},this.state,e.def,{ischanged:!1});this.setState(t)}},{key:"setControlProp",value:function(e,t){var a,n=this;"defaultType"===e?this.setState((a={},Object(c.a)(a,e,t),Object(c.a)(a,"defaultValue",""),a)):this.setState(Object(c.a)({},e,t));this.setState({ischanged:!0}),"type"===e&&window.setTimeout(function(){return n.comfirmControlProp()},0)}},{key:"comfirmControlProp",value:function(){if(this.state.ischanged){this.setState({ischanged:!1});var e=Object(s.a)({},this.state);delete e.ischanged,delete e.exprShowFlag,delete e.outLinkShowFlag,this.owner.sysCurCellMeta(e)}""!==this.props.parent_list&&this.owner.setState({curSubField:null,curSubFieldIndex:0})}},{key:"render",value:function(){var e=this,t=this.commonControllesIndex,a=this.allControllesIndex;this.state.defaultValue,this.props.formId,Object.keys(this.props.columnsOfForm).map(function(t){return e.props.columnsOfForm[t]}),this.props.parent_list;return v.a.createElement("div",{className:"config-panel"},""!==this.props.parent_list?v.a.createElement(o.a,{className:"ant-btn save-btn",onClick:this.comfirmControlProp.bind(this)},"\u786e\u5b9a"):null,v.a.createElement(h.a,{defaultActiveKey:"1",size:"small",tabBarGutter:"0"},v.a.createElement(y,{tab:"\u57fa\u672c\u5c5e\u6027",key:"1"},v.a.createElement("div",{className:"ant-row ant-form-item"},v.a.createElement("div",{className:"ant-form-item-label"},v.a.createElement("label",null,"\u540d\u79f0")),v.a.createElement("div",{className:"ant-form-item-control has-success"},v.a.createElement("span",{className:"ant-input-wrapper"},v.a.createElement("input",{type:"text",placeholder:"\u8bf7\u8f93\u5165\u63a7\u4ef6\u540d\u79f0",className:"config-text-len ant-input",value:this.state.title,onChange:function(t){return e.setControlProp("title",t.target.value)}})))),v.a.createElement("div",{className:"ant-row ant-form-item"},v.a.createElement("div",{className:"ant-form-item-label"},v.a.createElement("label",null,"\u663e\u793a\u522b\u540d")),v.a.createElement("div",{className:"ant-form-item-control has-success"},v.a.createElement("span",{className:"ant-input-wrapper"},v.a.createElement("input",{type:"text",placeholder:"\u8bf7\u8f93\u5165\u663e\u793a\u522b\u540d",className:"config-text-len ant-input",value:this.state.alias,onChange:function(t){return e.setControlProp("alias",t.target.value)}})))),v.a.createElement("div",{className:"ant-row ant-form-item"},v.a.createElement("div",{className:"ant-form-item-label"},v.a.createElement("label",null,"\u63a7\u4ef6\u7c7b\u578b"),v.a.createElement("span",{className:"ant-input-wrapper config-typename"},t&&t.length>0?v.a.createElement(l.a,{value:[this.state.type],onChange:function(t){return e.setControlProp("type",t)},size:"small",style:{width:"120px"}},E.b.map(function(e){return v.a.createElement(l.a.Option,{value:e.name,key:e.name},e.label)})):v.a.createElement("span",{className:"ant-input-wrapper config-typename"},a[0].label)))),v.a.createElement("div",{className:"ant-row last-ant-form-item"},v.a.createElement("div",{className:"ant-form-item-label"},v.a.createElement("label",null,"\u63cf\u8ff0")),v.a.createElement("div",{className:"ant-form-item-control has-success"},v.a.createElement("span",{className:"ant-input-wrapper"},v.a.createElement("textarea",{type:"textarea",placeholder:"\u8bf7\u8f93\u5165\u63a7\u4ef6\u63cf\u8ff0",className:"config-text-desc ant-input",value:this.state.desc,onChange:function(t){return e.setControlProp("desc",t.target.value)}}))))),v.a.createElement(y,{tab:"\u6837\u5f0f",key:"2"},v.a.createElement("div",null,v.a.createElement("div",{className:"ant-row ant-form-item"},v.a.createElement("div",{className:"ant-form-item-label"},v.a.createElement("label",null,"\u8f93\u5165\u6846\u6837\u5f0f")),v.a.createElement("div",{className:"ant-form-item-control has-success"},v.a.createElement("span",{className:"ant-input-wrapper"},v.a.createElement("input",{type:"text",placeholder:"\u8bf7\u8f93\u5165\u6837\u5f0f\u540d\u79f0",className:"config-text-classname ant-input",value:this.state.className,onChange:function(t){return e.setControlProp("className",t.target.value)}})))),v.a.createElement("div",{className:"ant-row ant-form-item"},v.a.createElement("div",{className:"ant-form-item-label"},v.a.createElement("label",null,"\u8f93\u5165\u6846\u9f20\u6807\u60ac\u505c\u6837\u5f0f")),v.a.createElement("div",{className:"ant-form-item-control has-success"},v.a.createElement("span",{className:"ant-input-wrapper"},v.a.createElement("input",{type:"text",placeholder:"\u8bf7\u8f93\u5165\u6837\u5f0f\u540d\u79f0",className:"config-text-hoverclassName ant-input",value:this.state.hoverClassName,onChange:function(t){return e.setControlProp("hoverClassName",t.target.value)}})))),v.a.createElement("div",{className:"ant-row ant-form-item"},v.a.createElement(r.a,{message:"\u81ea\u5b9a\u4e49\u6837\u5f0f\u6587\u4ef6\u540d\u79f0\u53ca\u5b58\u653e\u8def\u5f84\u4e3a\uff1a/static/modules/appbuilder/appcenter/appform/{formNo}/addon.css, \u5176\u4e2d{formNo}\u4ee3\u8868\u8868\u5355\u7f16\u53f7\u3002\u5047\u5982\u8868\u5355\u7f16\u53f7\u4e3a\uff1afrm01\uff0c\u90a3\u4e48\u81ea\u5b9a\u4e49\u6837\u5f0f\u6587\u4ef6\u4e3a\uff1a/static/modules/appbuilder/appcenter/appform/frm01/addon.css",type:"info",style:{"word-break":"break-all"}})))),v.a.createElement(y,{tab:"\u4e8b\u4ef6",key:"3"},v.a.createElement("div",null,v.a.createElement("div",{className:"ant-row ant-form-item"},v.a.createElement("div",{className:"ant-form-item-label"},v.a.createElement("label",null,v.a.createElement(n.a,{title:"\u5f53\u5bf9\u8c61\u6216\u9009\u4e2d\u533a\u7684\u5185\u5bb9\u6539\u53d8\u65f6\u89e6\u53d1"},"onclick"))),v.a.createElement("div",{className:"ant-form-item-control has-success"},v.a.createElement("span",{className:"ant-input-wrapper"},v.a.createElement("input",{type:"text",hint:"\u5f53\u5bf9\u8c61\u6216\u9009\u4e2d\u533a\u7684\u5185\u5bb9\u6539\u53d8\u65f6\u89e6\u53d1",placeholder:"\u8bf7\u8f93\u5165\u4e8b\u4ef6\u5904\u7406\u51fd\u6570\u540d\u79f0",className:"config-text-len ant-input",value:this.state.onclick,onChange:function(t){return e.setControlProp("onclick",t.target.value)}})))),v.a.createElement("div",{className:"ant-row ant-form-item"},v.a.createElement("div",{className:"ant-form-item-label"},v.a.createElement("label",null,v.a.createElement(n.a,{title:"\u5f53\u7528\u6237\u53cc\u51fb\u5bf9\u8c61\u65f6\u89e6\u53d1"},"ondblclick"))),v.a.createElement("div",{className:"ant-form-item-control has-success"},v.a.createElement("span",{className:"ant-input-wrapper"},v.a.createElement("input",{type:"text",hint:"\u5f53\u7528\u6237\u53cc\u51fb\u5bf9\u8c61\u65f6\u89e6\u53d1",placeholder:"\u8bf7\u8f93\u5165\u4e8b\u4ef6\u5904\u7406\u51fd\u6570\u540d\u79f0",className:"config-text-len ant-input",value:this.state.ondblclick,onChange:function(t){return e.setControlProp("ondblclick",t.target.value)}})))),v.a.createElement("div",{className:"ant-row ant-form-item"},v.a.createElement(r.a,{message:"\u81ea\u5b9a\u4e49\u811a\u672c\u6587\u4ef6\u540d\u79f0\u53ca\u5b58\u653e\u8def\u5f84\u4e3a\uff1a/static/modules/appbuilder/appcenter/appform/{formNo}/addon.js, \u5176\u4e2d{formNo}\u4ee3\u8868\u8868\u5355\u7f16\u53f7\u3002\u5047\u5982\u8868\u5355\u7f16\u53f7\u4e3a\uff1afrm01\uff0c\u90a3\u4e48\u81ea\u5b9a\u4e49\u811a\u672c\u6587\u4ef6\u4e3a\uff1a/static/modules/appbuilder/appcenter/appform/frm01/addon.js",type:"info",style:{"word-break":"break-all"}}))))))}}]),t}(b.Component);t.default=N}}]);
//# sourceMappingURL=24.b31073e6.chunk.js.map
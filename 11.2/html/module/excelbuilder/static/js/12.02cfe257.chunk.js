(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{647:function(e,t,a){"use strict";a.r(t);a(618);var n=a(619),l=(a(94),a(22)),s=(a(52),a(10)),r=a(95),c=a(11),o=a(23),i=a(24),m=a(29),u=a(28),p=a(30),h=a(63),d=(a(295),a(149)),f=a(0),E=a.n(f),v=a(96),b=a(622),g=a(199),N=(a(623),a(2)),k=a.n(N),x=d.a.TabPane,w=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(m.a)(this,Object(u.a)(t).call(this,e))).owner=a.props.owner,a.state={ischanged:!1,exprShowFlag:!1,outLinkShowFlag:!1,name:"",title:"\u5730\u5740",alias:"",desc:"",defaultType:"custom",defaultValue:"",required:!1,noDup:!1,readonly:!1,hidden:!1,asTitle:!1,isSearch:!1,link:"",type:"address",detail:!1,className:"",hoverClassName:"",aiItems:[],isview:!1},a.state=Object(c.a)({},a.state,a.props.def),a.commonControllesIndex=v.b.filter(function(e){return e.name===a.state.type}),a.allControllesIndex=v.a.filter(function(e){return e.name===a.state.type}),a.owner.comfirmControlProp=a.comfirmControlProp.bind(Object(h.a)(Object(h.a)(a))),a}return Object(p.a)(t,e),Object(i.a)(t,[{key:"componentWillReceiveProps",value:function(e){var t=Object(c.a)({},this.state,e.def,{ischanged:!1});this.setState(t)}},{key:"setControlProp",value:function(e,t){var a;"defaultType"===e?this.setState((a={},Object(r.a)(a,e,t),Object(r.a)(a,"defaultValue",""),a)):this.setState(Object(r.a)({},e,t));this.setState({ischanged:!0})}},{key:"comfirmControlProp",value:function(){if(this.state.ischanged){this.setState({ischanged:!1});var e=Object(c.a)({},this.state);delete e.ischanged,delete e.exprShowFlag,delete e.outLinkShowFlag,this.owner.sysCurCellMeta(e)}""!==this.props.parent_list&&this.owner.setState({curSubField:null,curSubFieldIndex:0})}},{key:"renderExpr",value:function(){var e=this,t={value:"",formId:e.props.formId,forms:"",logic:!1,receiver:function(t,a){e.setState({defaultValue:a,exprShowFlag:!1}),e.setState({ischanged:!0})},cancel:function(){e.setState({exprShowFlag:!1})}};return""!==this.state.defaultValue?(k.a.ajaxSettings.async=!1,k.a.post("/general/appbuilder/web/appdesign/appform/convertfunc",{formId:this.props.formId,expr:this.state.defaultValue},function(e){"ok"===e.status&&(t.value=e.data?e.data:"")}),k.a.ajaxSettings.async=!0,E.a.createElement(b.a,{formulaData:t})):E.a.createElement(b.a,{formulaData:t})}},{key:"render",value:function(){var e=this,t=this.commonControllesIndex,a=this.allControllesIndex;this.state.defaultValue,this.props.formId;return E.a.createElement("div",{className:"config-panel"},""!==this.props.parent_list?E.a.createElement(s.a,{className:"ant-btn save-btn",onClick:this.comfirmControlProp.bind(this)},"\u786e\u5b9a"):null,E.a.createElement(d.a,{defaultActiveKey:"1",size:"small",tabBarGutter:"0"},E.a.createElement(x,{tab:"\u57fa\u672c\u5c5e\u6027",key:"1"},E.a.createElement("div",{className:"ant-row ant-form-item"},E.a.createElement("div",{className:"ant-form-item-label"},E.a.createElement("label",null,"\u540d\u79f0")),E.a.createElement("div",{className:"ant-form-item-control has-success"},E.a.createElement("span",{className:"ant-input-wrapper"},E.a.createElement("input",{type:"text",placeholder:"\u8bf7\u8f93\u5165\u63a7\u4ef6\u540d\u79f0",className:"config-text-len ant-input",value:this.state.title,onChange:function(t){return e.setControlProp("title",t.target.value)}})))),E.a.createElement("div",{className:"ant-row ant-form-item"},E.a.createElement("div",{className:"ant-form-item-label"},E.a.createElement("label",null,"\u663e\u793a\u522b\u540d")),E.a.createElement("div",{className:"ant-form-item-control has-success"},E.a.createElement("span",{className:"ant-input-wrapper"},E.a.createElement("input",{type:"text",placeholder:"\u8bf7\u8f93\u5165\u663e\u793a\u522b\u540d",className:"config-text-len ant-input",value:this.state.alias,onChange:function(t){return e.setControlProp("alias",t.target.value)}})))),E.a.createElement("div",{className:"ant-row ant-form-item"},E.a.createElement("div",{className:"ant-form-item-label"},E.a.createElement("label",null,"\u63a7\u4ef6\u7c7b\u578b"),E.a.createElement("span",{className:"ant-input-wrapper config-typename"},t&&t.length>0?E.a.createElement(l.a,{value:[this.state.type],onChange:function(t){return e.setControlProp("type",t)},size:"small",style:{width:"120px"}},v.b.map(function(e){return E.a.createElement(l.a.Option,{value:e.name,key:e.name},e.label)})):E.a.createElement("span",{className:"ant-input-wrapper config-typename"},a[0].label)))),E.a.createElement("div",{className:"ant-row ant-form-item"},E.a.createElement("div",{className:"ant-form-item-label"},E.a.createElement("label",null,"\u63cf\u8ff0")),E.a.createElement("div",{className:"ant-form-item-control has-success"},E.a.createElement("span",{className:"ant-input-wrapper"},E.a.createElement("textarea",{type:"textarea",placeholder:"\u8bf7\u8f93\u5165\u63a7\u4ef6\u63cf\u8ff0",className:"config-text-desc ant-input",value:this.state.desc,onChange:function(t){return e.setControlProp("desc",t.target.value)}})))),E.a.createElement("div",{className:"ant-row ant-form-item"},E.a.createElement("div",{className:"ant-form-item-label"},E.a.createElement("label",null,"\u9ed8\u8ba4\u503c")),E.a.createElement("div",{className:"ant-form-item-control has-success"},E.a.createElement(l.a,{size:"small",value:[this.state.defaultType],onChange:function(t){return e.setControlProp("defaultType",t)},style:{width:100}},E.a.createElement(l.a.Option,{value:"custom",key:"custom"},"\u81ea\u5b9a\u4e49"),E.a.createElement(l.a.Option,{value:"outlink",key:"outlink"},"\u5173\u8054\u63d0\u53d6")),"custom"===this.state.defaultType?E.a.createElement("input",{type:"text",placeholder:"\u8bf7\u8f93\u5165\u63a7\u4ef6\u9ed8\u8ba4\u503c",className:"config-text-len ant-input",value:this.state.defaultValue,onChange:function(t){return e.setControlProp("defaultValue",t.target.value)}}):"expression"===this.state.defaultType?E.a.createElement("div",null,E.a.createElement(s.a,{size:"small",onClick:function(){return e.setState({exprShowFlag:!0})}},"\u5b9a\u4e49\u8868\u8fbe\u5f0f")):E.a.createElement("div",null,E.a.createElement(s.a,{size:"small",onClick:function(){return e.setState({outLinkShowFlag:!0})}},"\u5b9a\u4e49\u5173\u8054\u63d0\u53d6")),"expression"===this.state.defaultType&&this.state.exprShowFlag?this.renderExpr():null,"outlink"===this.state.defaultType&&this.state.outLinkShowFlag?E.a.createElement(g.a,Object.assign({},this.props,{owner:this,updateOutlink:function(t){return e.setState({defaultValue:t})}})):null)),null,E.a.createElement("div",{className:"ant-row ant-form-item last-ant-form-item"},E.a.createElement("div",{class:"ant-form-item-control has-success"},E.a.createElement("label",{class:"ant-checkbox-wrapper"},E.a.createElement("input",{type:"checkbox",class:"config-address-detail",checked:this.state.detail,onChange:function(t){return e.setControlProp("detail",t.target.checked)}}),E.a.createElement("span",null,"\u663e\u793a\u8be6\u7ec6\u5730\u5740"))),E.a.createElement("div",{className:"ant-form-item-control has-success"},E.a.createElement("label",{className:"ant-checkbox-wrapper"},E.a.createElement("input",{type:"checkbox",className:"config-text-required",checked:this.state.required,onChange:function(t){return e.setControlProp("required",t.target.checked)}}),E.a.createElement("span",null,"\u5fc5\u586b"))),E.a.createElement("div",{className:"ant-form-item-control has-success"},E.a.createElement("label",{className:"ant-checkbox-wrapper"},E.a.createElement("input",{type:"checkbox",className:"config-text-dup",checked:this.state.noDup,onChange:function(t){return e.setControlProp("noDup",t.target.checked)}}),E.a.createElement("span",null,"\u4e0d\u53ef\u91cd\u590d"))),""!==this.props.parent_list?E.a.createElement("div",{className:"ant-form-item-control has-success"},E.a.createElement("label",{className:"ant-checkbox-wrapper"},E.a.createElement("input",{type:"checkbox",className:"config-text-dup",checked:this.state.noDupAll,onChange:function(t){return e.setControlProp("noDupAll",t.target.checked)}}),E.a.createElement("span",null,"\u5168\u4f53\u4e0d\u53ef\u91cd\u590d"))):null,E.a.createElement("div",{className:"ant-form-item-control has-success"},E.a.createElement("label",{className:"ant-checkbox-wrapper"},E.a.createElement("input",{type:"checkbox",className:"config-text-readonly",checked:this.state.readonly,onChange:function(t){return e.setControlProp("readonly",t.target.checked)}}),E.a.createElement("span",null,"\u53ea\u8bfb"))),E.a.createElement("div",{className:"ant-form-item-control has-success"},E.a.createElement("label",{className:"ant-checkbox-wrapper"},E.a.createElement("input",{type:"checkbox",className:"config-text-hidden",checked:this.state.hidden,onChange:function(t){return e.setControlProp("hidden",t.target.checked)}}),E.a.createElement("span",null,"\u9690\u85cf"))),E.a.createElement("div",{className:"ant-form-item-control has-success"},E.a.createElement("label",{className:"ant-checkbox-wrapper"},E.a.createElement("input",{type:"checkbox",className:"config-text-issearch",checked:this.state.isSearch,onChange:function(t){return e.setControlProp("isSearch",t.target.checked)}}),E.a.createElement("span",null,"\u662f\u5426\u662f\u67e5\u8be2\u5b57\u6bb5"))),""===this.props.parent_list?E.a.createElement("div",{className:"ant-form-item-control has-success"},E.a.createElement("label",{className:"ant-checkbox-wrapper"},E.a.createElement("input",{type:"checkbox",className:"config-text-isview",checked:this.state.isview,onChange:function(t){return e.setControlProp("isview",t.target.checked)}}),E.a.createElement("span",null,"\u662f\u5426\u5728\u6570\u636e\u7ba1\u7406\u9690\u85cf"))):null)),E.a.createElement(x,{tab:"\u6837\u5f0f",key:"2"},E.a.createElement("div",null,E.a.createElement("div",{className:"ant-row ant-form-item"},E.a.createElement("div",{className:"ant-form-item-label"},E.a.createElement("label",null,"\u8f93\u5165\u6846\u6837\u5f0f")),E.a.createElement("div",{className:"ant-form-item-control has-success"},E.a.createElement("span",{className:"ant-input-wrapper"},E.a.createElement("input",{type:"text",placeholder:"\u8bf7\u8f93\u5165\u6837\u5f0f\u540d\u79f0",className:"config-text-classname ant-input",value:this.state.className,onChange:function(t){return e.setControlProp("className",t.target.value)}})))),E.a.createElement("div",{className:"ant-row ant-form-item"},E.a.createElement("div",{className:"ant-form-item-label"},E.a.createElement("label",null,"\u8f93\u5165\u6846\u9f20\u6807\u60ac\u505c\u6837\u5f0f")),E.a.createElement("div",{className:"ant-form-item-control has-success"},E.a.createElement("span",{className:"ant-input-wrapper"},E.a.createElement("input",{type:"text",placeholder:"\u8bf7\u8f93\u5165\u6837\u5f0f\u540d\u79f0",className:"config-text-hoverclassName ant-input",value:this.state.hoverClassName,onChange:function(t){return e.setControlProp("hoverClassName",t.target.value)}})))),E.a.createElement("div",{className:"ant-row ant-form-item"},E.a.createElement(n.a,{message:"\u81ea\u5b9a\u4e49\u6837\u5f0f\u6587\u4ef6\u540d\u79f0\u53ca\u5b58\u653e\u8def\u5f84\u4e3a\uff1a/static/modules/appbuilder/appcenter/appform/{formNo}/addon.css, \u5176\u4e2d{formNo}\u4ee3\u8868\u8868\u5355\u7f16\u53f7\u3002\u5047\u5982\u8868\u5355\u7f16\u53f7\u4e3a\uff1afrm01\uff0c\u90a3\u4e48\u81ea\u5b9a\u4e49\u6837\u5f0f\u6587\u4ef6\u4e3a\uff1a/static/modules/appbuilder/appcenter/appform/frm01/addon.css",type:"info",style:{"word-break":"break-all"}}))))))}}]),t}(f.Component);t.default=w}}]);
//# sourceMappingURL=12.02cfe257.chunk.js.map
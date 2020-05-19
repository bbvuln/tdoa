(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{618:function(e,a,t){"use strict";t(31),t(620)},619:function(e,a,t){"use strict";var n=t(0),i=t(12),c=t(39),l=t(8),r=t(4),o=t.n(r),v=t(14);function _(e){return(_="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function m(){return(m=Object.assign||function(e){for(var a=1;a<arguments.length;a++){var t=arguments[a];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])}return e}).apply(this,arguments)}function s(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function u(e,a){for(var t=0;t<a.length;t++){var n=a[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function d(e){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function y(e,a){return(y=Object.setPrototypeOf||function(e,a){return e.__proto__=a,e})(e,a)}function k(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function E(){}t.d(a,"a",function(){return T});var T=function(e){function a(){var e,t,r;return function(e,a){if(!(e instanceof a))throw new TypeError("Cannot call a class as a function")}(this,a),t=this,r=d(a).apply(this,arguments),(e=!r||"object"!==_(r)&&"function"!==typeof r?k(t):r).state={closing:!0,closed:!1},e.handleClose=function(a){a.preventDefault();var t=i.findDOMNode(k(k(e)));t.style.height="".concat(t.offsetHeight,"px"),t.style.height="".concat(t.offsetHeight,"px"),e.setState({closing:!1}),(e.props.onClose||E)(a)},e.animationEnd=function(){e.setState({closed:!0,closing:!0}),(e.props.afterClose||E)()},e.renderAlert=function(a){var t,i,r=a.getPrefixCls,v=e.props,_=v.description,u=v.prefixCls,d=v.message,y=v.closeText,k=v.banner,E=v.className,T=void 0===E?"":E,p=v.style,h=v.icon,b=e.props,L=b.closable,I=b.type,g=b.showIcon,f=b.iconType,V=r("alert",u);g=!(!k||void 0!==g)||g,I=k&&void 0===I?"warning":I||"info";var x="filled";if(!f){switch(I){case"success":f="check-circle";break;case"info":f="info-circle";break;case"error":f="close-circle";break;case"warning":f="exclamation-circle";break;default:f="default"}_&&(x="outlined")}y&&(L=!0);var N,R=o()(V,"".concat(V,"-").concat(I),(s(t={},"".concat(V,"-close"),!e.state.closing),s(t,"".concat(V,"-with-description"),!!_),s(t,"".concat(V,"-no-icon"),!g),s(t,"".concat(V,"-banner"),!!k),s(t,"".concat(V,"-closable"),L),t),T),C=L?n.createElement("a",{onClick:e.handleClose,className:"".concat(V,"-close-icon")},y||n.createElement(l.a,{type:"close"})):null,P=(N=e.props,Object.keys(N).reduce(function(e,a){return"data-"!==a.substr(0,5)&&"aria-"!==a.substr(0,5)&&"role"!==a||"data-__"===a.substr(0,7)||(e[a]=N[a]),e},{})),w=h&&(n.isValidElement(h)?n.cloneElement(h,{className:o()((i={},s(i,h.props.className,h.props.className),s(i,"".concat(V,"-icon"),!0),i))}):n.createElement("span",{className:"".concat(V,"-icon")},h))||n.createElement(l.a,{className:"".concat(V,"-icon"),type:f,theme:x});return e.state.closed?null:n.createElement(c.a,{component:"",showProp:"data-show",transitionName:"".concat(V,"-slide-up"),onEnd:e.animationEnd},n.createElement("div",m({"data-show":e.state.closing,className:R,style:p},P),g?w:null,n.createElement("span",{className:"".concat(V,"-message")},d),n.createElement("span",{className:"".concat(V,"-description")},_),C))},e}var t,r,T;return function(e,a){if("function"!==typeof a&&null!==a)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(a&&a.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),a&&y(e,a)}(a,n["Component"]),t=a,(r=[{key:"render",value:function(){return n.createElement(v.a,null,this.renderAlert)}}])&&u(t.prototype,r),T&&u(t,T),a}()},620:function(e,a,t){},623:function(e,a,t){"use strict";t(94);var n=t(22),i=t(0),c=t.n(i),l=n.a.Option,r=n.a.OptGroup;c.a.createElement(r,{label:"\u589e\u503c\u7a0e\u53d1\u7968",key:"VatInvoice"},c.a.createElement(l,{value:"VatInvoice_InvoiceType",key:"VatInvoice_InvoiceType"},"\u53d1\u7968\u79cd\u7c7b\u540d\u79f0"),c.a.createElement(l,{value:"VatInvoice_InvoiceCode",key:"VatInvoice_InvoiceCode"},"\u53d1\u7968\u4ee3\u7801"),c.a.createElement(l,{value:"VatInvoice_InvoiceNum",key:"VatInvoice_InvoiceNum"},"\u53d1\u7968\u53f7\u7801"),c.a.createElement(l,{value:"VatInvoice_InvoiceDate",key:"VatInvoice_InvoiceDate"},"\u5f00\u7968\u65e5\u671f"),c.a.createElement(l,{value:"VatInvoice_TotalAmount",key:"VatInvoice_TotalAmount"},"\u5408\u8ba1\u91d1\u989d"),c.a.createElement(l,{value:"VatInvoice_TotalTax",key:"VatInvoice_TotalTax"},"\u5408\u8ba1\u7a0e\u989d"),c.a.createElement(l,{value:"VatInvoice_AmountInFiguers",key:"VatInvoice_AmountInFiguers"},"\u4ef7\u7a0e\u5408\u8ba1(\u5c0f\u5199)"),c.a.createElement(l,{value:"VatInvoice_AmountInWords",key:"VatInvoice_AmountInWords"},"\u4ef7\u7a0e\u5408\u8ba1(\u5927\u5199)"),c.a.createElement(l,{value:"VatInvoice_SellerName",key:"VatInvoice_SellerName"},"\u9500\u552e\u65b9\u540d\u79f0"),c.a.createElement(l,{value:"VatInvoice_SellerRegisterNum",key:"VatInvoice_SellerRegisterNum"},"\u9500\u552e\u65b9\u7eb3\u7a0e\u4eba\u8bc6\u522b\u53f7"),c.a.createElement(l,{value:"VatInvoice_PurchaserName",key:"VatInvoice_PurchaserName"},"\u8d2d\u65b9\u540d\u79f0"),c.a.createElement(l,{value:"VatInvoice_PurchaserRegisterNum",key:"VatInvoice_PurchaserRegisterNum"},"\u8d2d\u65b9\u7eb3\u7a0e\u4eba\u8bc6\u522b\u53f7")),c.a.createElement(r,{label:"\u706b\u8f66\u7968",key:"TrainTicket"},c.a.createElement(l,{value:"TrainTicket_ticket_num",key:"TrainTicket_ticket_num"},"\u8f66\u7968\u53f7"),c.a.createElement(l,{value:"TrainTicket_starting_station",key:"TrainTicket_starting_station"},"\u59cb\u53d1\u7ad9"),c.a.createElement(l,{value:"TrainTicket_train_num",key:"TrainTicket_train_num"},"\u8f66\u6b21\u53f7"),c.a.createElement(l,{value:"TrainTicket_destination_station",key:"TrainTicket_destination_station"},"\u5230\u8fbe\u7ad9"),c.a.createElement(l,{value:"TrainTicket_date",key:"TrainTicket_date"},"\u51fa\u53d1\u65e5\u671f"),c.a.createElement(l,{value:"TrainTicket_ticket_rates",key:"TrainTicket_ticket_rates"},"\u8f66\u7968\u91d1\u989d"),c.a.createElement(l,{value:"TrainTicket_seat_category",key:"TrainTicket_seat_category"},"\u5e2d\u522b"),c.a.createElement(l,{value:"TrainTicket_name",key:"TrainTicket_name"},"\u4e58\u5ba2\u59d3\u540d")),c.a.createElement(r,{label:"\u51fa\u79df\u8f66\u7968\uff08\u4ec5\u652f\u6301\u5317\u4eac\u5730\u533a\uff09",key:"TaxiReceipt"},c.a.createElement(l,{value:"TaxiReceipt_Date",key:"TaxiReceipt_Date"},"\u65e5\u671f"),c.a.createElement(l,{value:"TaxiReceipt_Fare",key:"TaxiReceipt_Fare"},"\u5b9e\u4ed8\u91d1\u989d"),c.a.createElement(l,{value:"TaxiReceipt_InvoiceCode",key:"TaxiReceipt_InvoiceCode"},"\u53d1\u7968\u4ee3\u53f7"),c.a.createElement(l,{value:"TaxiReceipt_InvoiceNum",key:"TaxiReceipt_InvoiceNum"},"\u53d1\u7968\u53f7\u7801"),c.a.createElement(l,{value:"TaxiReceipt_TaxiNum",key:"TaxiReceipt_TaxiNum"},"\u8f66\u724c\u53f7"),c.a.createElement(l,{value:"TaxiReceipt_Time",key:"TaxiReceipt_Time"},"\u4e0a\u4e0b\u8f66\u65f6\u95f4")),c.a.createElement(r,{label:"\u8eab\u4efd\u8bc1",key:"idcard"},c.a.createElement(l,{value:"idcard_address",key:"idcard_address"},"\u4f4f\u5740"),c.a.createElement(l,{value:"idcard_num",key:"idcard_num"},"\u516c\u6c11\u8eab\u4efd\u53f7\u7801"),c.a.createElement(l,{value:"idcard_birthday",key:"idcard_birthday"},"\u51fa\u751f\u65e5\u671f"),c.a.createElement(l,{value:"idcard_name",key:"idcard_name"},"\u59d3\u540d"),c.a.createElement(l,{value:"idcard_sex",key:"idcard_sex"},"\u6027\u522b"),c.a.createElement(l,{value:"idcard_nation",key:"idcard_nation"},"\u6c11\u65cf")),c.a.createElement(r,{label:"\u94f6\u884c\u5361",key:"bankcard"},c.a.createElement(l,{value:"bankcard_bank_card_number",key:"bankcard_bank_card_number"},"\u94f6\u884c\u5361\u5361\u53f7"),c.a.createElement(l,{value:"bankcard_bank_name",key:"bankcard_bank_name"},"\u94f6\u884c\u540d"),c.a.createElement(l,{value:"bankcard_bank_card_type",key:"bankcard_bank_card_type"},"\u94f6\u884c\u5361\u7c7b\u578b")),c.a.createElement(r,{label:"\u9a7e\u9a76\u8bc1",key:"drivingLicense"},c.a.createElement(l,{value:"drivingLicense_num",key:"drivingLicense_num"},"\u8bc1\u53f7"),c.a.createElement(l,{value:"drivingLicense_limit",key:"drivingLicense_limit"},"\u6709\u6548\u671f\u9650"),c.a.createElement(l,{value:"drivingLicense_type",key:"drivingLicense_type"},"\u51c6\u9a7e\u8f66\u578b"),c.a.createElement(l,{value:"drivingLicense_date",key:"drivingLicense_date"},"\u6709\u6548\u8d77\u59cb\u65e5\u671f"),c.a.createElement(l,{value:"drivingLicense_address",key:"drivingLicense_address"},"\u4f4f\u5740"),c.a.createElement(l,{value:"drivingLicense_name",key:"drivingLicense_name"},"\u59d3\u540d"),c.a.createElement(l,{value:"drivingLicense_nation",key:"drivingLicense_nation"},"\u56fd\u7c4d"),c.a.createElement(l,{value:"drivingLicense_birthday",key:"drivingLicense_birthday"},"\u51fa\u751f\u65e5\u671f"),c.a.createElement(l,{value:"drivingLicense_sex",key:"drivingLicense_sex"},"\u6027\u522b"),c.a.createElement(l,{value:"drivingLicense_firstdate",key:"drivingLicense_firstdate"},"\u521d\u6b21\u9886\u8bc1\u65e5\u671f")),c.a.createElement(r,{label:"\u884c\u9a76\u8bc1",key:"vehicleLicense"},c.a.createElement(l,{value:"vehicleLicense_brand_type",key:"vehicleLicense_brand_type"},"\u54c1\u724c\u578b\u53f7"),c.a.createElement(l,{value:"vehicleLicense_date",key:"vehicleLicense_date"},"\u53d1\u8bc1\u65e5\u671f"),c.a.createElement(l,{value:"vehicleLicense_kind",key:"vehicleLicense_kind"},"\u4f7f\u7528\u6027\u8d28"),c.a.createElement(l,{value:"vehicleLicense_engineer_num",key:"vehicleLicense_engineer_num"},"\u53d1\u52a8\u673a\u53f7\u7801"),c.a.createElement(l,{value:"vehicleLicense_num",key:"vehicleLicense_num"},"\u53f7\u724c\u53f7\u7801"),c.a.createElement(l,{value:"vehicleLicense_owner",key:"vehicleLicense_owner"},"\u6240\u6709\u4eba"),c.a.createElement(l,{value:"vehicleLicense_registered_date",key:"vehicleLicense_registered_date"},"\u6ce8\u518c\u65e5\u671f"),c.a.createElement(l,{value:"vehicleLicense_id_num",key:"vehicleLicense_id_num"},"\u8f66\u8f86\u8bc6\u522b\u4ee3\u53f7"),c.a.createElement(l,{value:"vehicleLicense_type",key:"vehicleLicense_type"},"\u8f66\u8f86\u7c7b\u578b")),c.a.createElement(r,{label:"\u8f66\u724c\u8bc6\u522b",key:"licensePlate"},c.a.createElement(l,{value:"licensePlate_color",key:"licensePlate_color"},"\u8f66\u724c\u989c\u8272"),c.a.createElement(l,{value:"licensePlate_number",key:"licensePlate_number"},"\u8f66\u724c\u53f7\u7801")),c.a.createElement(r,{label:"\u8425\u4e1a\u6267\u7167",key:"vehicleLicense"},c.a.createElement(l,{value:"vehicleLicense_company",key:"vehicleLicense_company"},"\u5355\u4f4d\u540d\u79f0"),c.a.createElement(l,{value:"vehicleLicense_legal",key:"vehicleLicense_legal"},"\u6cd5\u4eba"),c.a.createElement(l,{value:"vehicleLicense_address",key:"vehicleLicense_address"},"\u5730\u5740"),c.a.createElement(l,{value:"vehicleLicense_validate_date",key:"vehicleLicense_validate_date"},"\u6709\u6548\u671f"),c.a.createElement(l,{value:"vehicleLicense_num",key:"vehicleLicense_num"},"\u8bc1\u4ef6\u7f16\u53f7"),c.a.createElement(l,{value:"vehicleLicense_credit_num",key:"vehicleLicense_credit_num"},"\u793e\u4f1a\u4fe1\u7528\u4ee3\u7801")),c.a.createElement(r,{label:"\u589e\u503c\u7a0e\u53d1\u7968",key:"VatInvoice"},c.a.createElement(l,{value:"VatInvoice_InvoiceType",key:"VatInvoice_InvoiceType"},"\u53d1\u7968\u79cd\u7c7b\u540d\u79f0"),c.a.createElement(l,{value:"VatInvoice_InvoiceCode",key:"VatInvoice_InvoiceCode"},"\u53d1\u7968\u4ee3\u7801"),c.a.createElement(l,{value:"VatInvoice_InvoiceNum",key:"VatInvoice_InvoiceNum"},"\u53d1\u7968\u53f7\u7801"),c.a.createElement(l,{value:"VatInvoice_InvoiceDate",key:"VatInvoice_InvoiceDate"},"\u5f00\u7968\u65e5\u671f"),c.a.createElement(l,{value:"VatInvoice_TotalAmount",key:"VatInvoice_TotalAmount"},"\u5408\u8ba1\u91d1\u989d"),c.a.createElement(l,{value:"VatInvoice_TotalTax",key:"VatInvoice_TotalTax"},"\u5408\u8ba1\u7a0e\u989d"),c.a.createElement(l,{value:"VatInvoice_AmountInFiguers",key:"VatInvoice_AmountInFiguers"},"\u4ef7\u7a0e\u5408\u8ba1(\u5c0f\u5199)"),c.a.createElement(l,{value:"VatInvoice_AmountInWords",key:"VatInvoice_AmountInWords"},"\u4ef7\u7a0e\u5408\u8ba1(\u5927\u5199)"),c.a.createElement(l,{value:"VatInvoice_SellerName",key:"VatInvoice_SellerName"},"\u9500\u552e\u65b9\u540d\u79f0"),c.a.createElement(l,{value:"VatInvoice_SellerRegisterNum",key:"VatInvoice_SellerRegisterNum"},"\u9500\u552e\u65b9\u7eb3\u7a0e\u4eba\u8bc6\u522b\u53f7"),c.a.createElement(l,{value:"VatInvoice_PurchaserName",key:"VatInvoice_PurchaserName"},"\u8d2d\u65b9\u540d\u79f0"),c.a.createElement(l,{value:"VatInvoice_PurchaserRegisterNum",key:"VatInvoice_PurchaserRegisterNum"},"\u8d2d\u65b9\u7eb3\u7a0e\u4eba\u8bc6\u522b\u53f7"),c.a.createElement(l,{value:"VatInvoice_CommodityName",key:"VatInvoice_CommodityName"},"\u8d27\u7269\u540d\u79f0"),c.a.createElement(l,{value:"VatInvoice_CommodityType",key:"VatInvoice_CommodityType"},"\u89c4\u683c\u578b\u53f7"),c.a.createElement(l,{value:"VatInvoice_CommodityUnit",key:"VatInvoice_CommodityUnit"},"\u5355\u4f4d"),c.a.createElement(l,{value:"VatInvoice_CommodityNum",key:"VatInvoice_CommodityNum"},"\u6570\u91cf"),c.a.createElement(l,{value:"VatInvoice_CommodityPrice",key:"VatInvoice_CommodityPrice"},"\u5355\u4ef7"),c.a.createElement(l,{value:"VatInvoice_CommodityAmount",key:"VatInvoice_CommodityAmount"},"\u91d1\u989d"),c.a.createElement(l,{value:"VatInvoice_CommodityTaxRate",key:"VatInvoice_CommodityTaxRate"},"\u7a0e\u7387"),c.a.createElement(l,{value:"VatInvoice_CommodityTax",key:"VatInvoice_CommodityTax"},"\u7a0e\u989d")),c.a.createElement(r,{label:"\u706b\u8f66\u7968",key:"TrainTicket"},c.a.createElement(l,{value:"TrainTicket_ticket_num",key:"TrainTicket_ticket_num"},"\u8f66\u7968\u53f7"),c.a.createElement(l,{value:"TrainTicket_starting_station",key:"TrainTicket_starting_station"},"\u59cb\u53d1\u7ad9"),c.a.createElement(l,{value:"TrainTicket_train_num",key:"TrainTicket_train_num"},"\u8f66\u6b21\u53f7"),c.a.createElement(l,{value:"TrainTicket_destination_station",key:"TrainTicket_destination_station"},"\u5230\u8fbe\u7ad9"),c.a.createElement(l,{value:"TrainTicket_date",key:"TrainTicket_date"},"\u51fa\u53d1\u65e5\u671f"),c.a.createElement(l,{value:"TrainTicket_ticket_rates",key:"TrainTicket_ticket_rates"},"\u8f66\u7968\u91d1\u989d"),c.a.createElement(l,{value:"TrainTicket_seat_category",key:"TrainTicket_seat_category"},"\u5e2d\u522b"),c.a.createElement(l,{value:"TrainTicket_name",key:"TrainTicket_name"},"\u4e58\u5ba2\u59d3\u540d")),c.a.createElement(r,{label:"\u51fa\u79df\u8f66\u7968\uff08\u4ec5\u652f\u6301\u5317\u4eac\u5730\u533a\uff09",key:"TaxiReceipt"},c.a.createElement(l,{value:"TaxiReceipt_Date",key:"TaxiReceipt_Date"},"\u65e5\u671f"),c.a.createElement(l,{value:"TaxiReceipt_Fare",key:"TaxiReceipt_Fare"},"\u5b9e\u4ed8\u91d1\u989d"),c.a.createElement(l,{value:"TaxiReceipt_InvoiceCode",key:"TaxiReceipt_InvoiceCode"},"\u53d1\u7968\u4ee3\u53f7"),c.a.createElement(l,{value:"TaxiReceipt_InvoiceNum",key:"TaxiReceipt_InvoiceNum"},"\u53d1\u7968\u53f7\u7801"),c.a.createElement(l,{value:"TaxiReceipt_TaxiNum",key:"TaxiReceipt_TaxiNum"},"\u8f66\u724c\u53f7"),c.a.createElement(l,{value:"TaxiReceipt_Time",key:"TaxiReceipt_Time"},"\u4e0a\u4e0b\u8f66\u65f6\u95f4")),c.a.createElement(r,{label:"\u8eab\u4efd\u8bc1",key:"idcard"},c.a.createElement(l,{value:"idcard_address",key:"idcard_address"},"\u4f4f\u5740"),c.a.createElement(l,{value:"idcard_num",key:"idcard_num"},"\u516c\u6c11\u8eab\u4efd\u53f7\u7801"),c.a.createElement(l,{value:"idcard_birthday",key:"idcard_birthday"},"\u51fa\u751f\u65e5\u671f"),c.a.createElement(l,{value:"idcard_name",key:"idcard_name"},"\u59d3\u540d"),c.a.createElement(l,{value:"idcard_sex",key:"idcard_sex"},"\u6027\u522b"),c.a.createElement(l,{value:"idcard_nation",key:"idcard_nation"},"\u6c11\u65cf")),c.a.createElement(r,{label:"\u94f6\u884c\u5361",key:"bankcard"},c.a.createElement(l,{value:"bankcard_bank_card_number",key:"bankcard_bank_card_number"},"\u94f6\u884c\u5361\u5361\u53f7"),c.a.createElement(l,{value:"bankcard_bank_name",key:"bankcard_bank_name"},"\u94f6\u884c\u540d"),c.a.createElement(l,{value:"bankcard_bank_card_type",key:"bankcard_bank_card_type"},"\u94f6\u884c\u5361\u7c7b\u578b")),c.a.createElement(r,{label:"\u9a7e\u9a76\u8bc1",key:"drivingLicense"},c.a.createElement(l,{value:"drivingLicense_num",key:"drivingLicense_num"},"\u8bc1\u53f7"),c.a.createElement(l,{value:"drivingLicense_limit",key:"drivingLicense_limit"},"\u6709\u6548\u671f\u9650"),c.a.createElement(l,{value:"drivingLicense_type",key:"drivingLicense_type"},"\u51c6\u9a7e\u8f66\u578b"),c.a.createElement(l,{value:"drivingLicense_date",key:"drivingLicense_date"},"\u6709\u6548\u8d77\u59cb\u65e5\u671f"),c.a.createElement(l,{value:"drivingLicense_address",key:"drivingLicense_address"},"\u4f4f\u5740"),c.a.createElement(l,{value:"drivingLicense_name",key:"drivingLicense_name"},"\u59d3\u540d"),c.a.createElement(l,{value:"drivingLicense_nation",key:"drivingLicense_nation"},"\u56fd\u7c4d"),c.a.createElement(l,{value:"drivingLicense_birthday",key:"drivingLicense_birthday"},"\u51fa\u751f\u65e5\u671f"),c.a.createElement(l,{value:"drivingLicense_sex",key:"drivingLicense_sex"},"\u6027\u522b"),c.a.createElement(l,{value:"drivingLicense_firstdate",key:"drivingLicense_firstdate"},"\u521d\u6b21\u9886\u8bc1\u65e5\u671f")),c.a.createElement(r,{label:"\u884c\u9a76\u8bc1",key:"vehicleLicense"},c.a.createElement(l,{value:"vehicleLicense_brand_type",key:"vehicleLicense_brand_type"},"\u54c1\u724c\u578b\u53f7"),c.a.createElement(l,{value:"vehicleLicense_date",key:"vehicleLicense_date"},"\u53d1\u8bc1\u65e5\u671f"),c.a.createElement(l,{value:"vehicleLicense_kind",key:"vehicleLicense_kind"},"\u4f7f\u7528\u6027\u8d28"),c.a.createElement(l,{value:"vehicleLicense_engineer_num",key:"vehicleLicense_engineer_num"},"\u53d1\u52a8\u673a\u53f7\u7801"),c.a.createElement(l,{value:"vehicleLicense_num",key:"vehicleLicense_num"},"\u53f7\u724c\u53f7\u7801"),c.a.createElement(l,{value:"vehicleLicense_owner",key:"vehicleLicense_owner"},"\u6240\u6709\u4eba"),c.a.createElement(l,{value:"vehicleLicense_registered_date",key:"vehicleLicense_registered_date"},"\u6ce8\u518c\u65e5\u671f"),c.a.createElement(l,{value:"vehicleLicense_id_num",key:"vehicleLicense_id_num"},"\u8f66\u8f86\u8bc6\u522b\u4ee3\u53f7"),c.a.createElement(l,{value:"vehicleLicense_type",key:"vehicleLicense_type"},"\u8f66\u8f86\u7c7b\u578b")),c.a.createElement(r,{label:"\u8f66\u724c\u8bc6\u522b",key:"licensePlate"},c.a.createElement(l,{value:"licensePlate_color",key:"licensePlate_color"},"\u8f66\u724c\u989c\u8272"),c.a.createElement(l,{value:"licensePlate_number",key:"licensePlate_number"},"\u8f66\u724c\u53f7\u7801")),c.a.createElement(r,{label:"\u8425\u4e1a\u6267\u7167",key:"vehicleLicense"},c.a.createElement(l,{value:"vehicleLicense_company",key:"vehicleLicense_company"},"\u5355\u4f4d\u540d\u79f0"),c.a.createElement(l,{value:"vehicleLicense_legal",key:"vehicleLicense_legal"},"\u6cd5\u4eba"),c.a.createElement(l,{value:"vehicleLicense_address",key:"vehicleLicense_address"},"\u5730\u5740"),c.a.createElement(l,{value:"vehicleLicense_validate_date",key:"vehicleLicense_validate_date"},"\u6709\u6548\u671f"),c.a.createElement(l,{value:"vehicleLicense_num",key:"vehicleLicense_num"},"\u8bc1\u4ef6\u7f16\u53f7"),c.a.createElement(l,{value:"vehicleLicense_credit_num",key:"vehicleLicense_credit_num"},"\u793e\u4f1a\u4fe1\u7528\u4ee3\u7801"))}}]);
//# sourceMappingURL=2.4643d5b2.chunk.js.map
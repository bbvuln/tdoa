;
(function() {
    window.flowDesign = {
        width:(window.screen.availWidth-10),//设置打开的窗口的宽度
        height:(window.screen.availHeight-30),//设置打开的窗口的高度
        add_prcs_offset : {},
        error:false,
        init : function() {
            document.onselectstart = function () { return false; }
        },
        initEdit: function(){
            flowDesign.init();
            flowDesign.loadPrcsData();
            flowDesign.initOpPosition();
            flowDesign.initAddBlockDraggable();
            flowDesign.addPrcsListener();
            flowDesign.initArrowOp();
            flowDesign.initPrcsOperations();
        },
        initPrcsOperations : function(){
            jQuery(document).on("mouseup", ".prcs-block", function(e){
                if(3 == e.which){
                    jQuery("#selectId").val(jQuery(this).attr("id"));
                    if(jQuery(this).attr('prcs_type') == 0 || jQuery(this).attr('prcs_type') == 3 || typeof(jQuery(this).attr('prcs_type')) == 'undefined'){
                        jQuery('#context-menu>ul>li').find('a[prcs_type="other"]').parent().show();
                    }else{
                        jQuery('#context-menu>ul>li').find('a[prcs_type="other"]').parent().hide();
                    }
                    //if(jQuery(this).attr('ui_type') == "auto" || jQuery(this).attr('ui_type') == "")
                    //{
                    //    jQuery('#context-menu>ul>li').find('a[tabindex="Form"]').parent().hide();
                    //}else
                    //{
                    //    jQuery('#context-menu>ul>li').find('a[tabindex="Form"]').parent().show();
                    //}
                }
            });
            jQuery(document).on("click", "a[cate='op']", function(e){
                var fun = "design"+jQuery(this).attr("tabindex");
                if(typeof window["flowDesign"][fun] === "function"){
                    window["flowDesign"][fun]();
                }
            });
        },
        loadPrcsData : function(){
            jQuery(window.parent.document).find('#error_prcs_info').html('');
            var flow_id = jQuery("#flow_id").val();
            if(flow_id != ""){
                jQuery.ajax({//添加流程步骤
                    url:"data/prcs_operations.php",
                    data:"action=getFlowPrcsData&flow_id="+flow_id,
                    success:function(data){
                        if(data.designdata){
                            for(var prcs in data.designdata){
                                var prcsObj = eval("data.designdata."+prcs);
                                prcsObj.id = prcs;
                                flowDesign.addStaticDisc(prcsObj, data.max, data.ends);
                            }
                        }
                        if(data.connections){
                            flowDesign.initDiamondSource();
                            flowDesign.initEllipseSource();
                            jQuery(data.connections).each(function(i, conn){
                                var a_conn = conn.split("=>");
                                if(a_conn.length == 2){
                                    var sourceId = a_conn[0];
                                    var targetId = a_conn[1];
                                    var tIds = targetId.split('_');
                                    if((jQuery("#"+sourceId).length == 0 || jQuery("#"+targetId).length == 0)){
                                        return true;
                                    }
                                    jsPlumb.connect({ 
                                            source:sourceId, 
                                            target:targetId, 
                                            anchors:[ 
                                                        [ "Perimeter", { shape:jQuery("#"+sourceId).attr("data-shape"), rotation:0 }], 
                                                     [ "Perimeter", { shape:jQuery("#"+targetId).attr("data-shape"), rotation:0 }]
                                                   ]
                                    });
                                }
                            });
                        }

                        flowDesign.addPrcsRightMenu();
                        flowDesign.initConnRule();
                        flowDesign.showError();
                        jQuery("[title]").tooltip();
                    },
                    error:function(XMLHttpRequest, textStatus, errorThrown){
                        //console.log("textStatus:"+textStatus+"&errorThrown:"+errorThrown);
                    }
                });
            }
        },
        initConnRule : function(){
            jsPlumb.bind("beforeDrop", function(conn) {//添加关联前
                if(conn.sourceId.split('_').length == 3 || conn.targetId.split('_').length == 3 ){
                    alert(td_lang.general.workflow.msg_226);
                    return false;
                }
                if(conn.sourceId == conn.targetId || jsPlumb.getConnections({source:conn.sourceId, target:conn.targetId}).length > 0){
                    if(conn.connection.suspendedElementId && conn.targetId != conn.connection.suspendedElementId){
                        var data = {
                            "flow_id":jQuery("#flow_id").val(),
                            "sourceId":conn.sourceId,
                            "sourceIdKeyId":jQuery("#"+conn.sourceId).attr("key_id"),
                            "targetId":conn.targetId,
                            "targetIdKeyId":jQuery("#"+conn.targetId).attr("key_id"),
                            "suspendedElementId":conn.connection.suspendedElementId,
                            "suspendedElementIdKeyId":jQuery("#"+conn.connection.suspendedElementId).attr("key_id")
                            
                        };
                        flowDesign.addEventListener("delConnNextPrcsId", data);
                    }
                    return false;
                }
                return true;
            });
            jsPlumb.bind("connection", function(i,c) { //添加关联后时处理
                var conn = i.connection;
                if(conn.targetId != conn.suspendedElementId){
                    var data = {
                        "flow_id":jQuery("#flow_id").val(),
                        "sourceId":conn.sourceId,
                        "sourceIdKeyId":jQuery("#"+conn.sourceId).attr("key_id"),
                        "targetId":conn.targetId,
                        "targetIdKeyId":jQuery("#"+conn.targetId).attr("key_id"),
                        "suspendedElementId":conn.suspendedElementId,
                        "suspendedElementIdKeyId":jQuery("#"+conn.suspendedElementId).attr("key_id")
                    };
                    if(jQuery("#"+conn.targetId).attr('data_type') != 'new'){
                        flowDesign.addEventListener("addConn", data);
                    }
                    
                }
            });
        },
        initOpPosition : function(){
            var controlLeft = 0;
            jQuery(".design-control").css({"left":controlLeft,"bottom":0});
            flowDesign.add_prcs_offset = {left:16,top:0};
            jQuery("#add_prcs_copy").mousedown(function(){
                jQuery("#add_prcs,#add_prcs_copy").css({'background-color':'transparent',"left":flowDesign.add_prcs_offset.left,"top":flowDesign.add_prcs_offset.top});
            }).mousedown(); 
            jsPlumb.draggable(jsPlumb.getSelector(jQuery(".design-control")));
            jQuery(".design-control").css({"cursor":"pointer"});
        },
        initAddBlockDraggable : function(){
            jsPlumb.draggable(jsPlumb.getSelector(".move"));
        },
        addPrcsListener : function(){
            jQuery("#add_prcs").mousedown(function(e){
                jQuery(this).addClass('add_prcs_move');
                jQuery(this).css({'border':'1px solid #2e863e'});
            });
            jQuery("#add_prcs").mouseup(function(e){
                var offset = jQuery(this).offset();
                jQuery(this).removeClass('add_prcs_move');
                jQuery(this).css({'background-color':'transparent',"left":flowDesign.add_prcs_offset.left,"top":flowDesign.add_prcs_offset.top, 'border':"none"});
                var controlOffset = jQuery(".design-control").offset();
                var inLeftFlag = (offset.left >= controlOffset.left && offset.left < controlOffset.left + jQuery(".design-control").outerWidth(true));
                var inTopFlag = (offset.top >= controlOffset.top && offset.top < controlOffset.top + jQuery(".design-control").outerHeight(true));
                
                if(!inLeftFlag || !inTopFlag){
                    flowDesign.addDisc(e);
                    if(jQuery("#arrow-block").attr("dragable") === "false"){
                        var status = jsPlumb.toggleDraggable(jsPlumb.getSelector(".prcs-block"))
                        jQuery("#arrow-block").attr("dragable", status).toggleClass("static-block");
                    }
                    flowDesign.addPrcsRightMenu();
                }
            });
        },
        addPrcsRightMenu : function(){
            jsPlumb.getSelector(".prcs-block").contextmenu({ 
                target:'#context-menu',
                onItem: function(e, item){
                    
                }
            });
        },
        designProperty : function(){//基本属性
            var key_id = jQuery("#"+jQuery("#selectId").val()).attr("key_id");
            var url = "view_list/index.php?LIST_TYPE=designer&FLOW_ID="+jQuery("#flow_id").val()+"&ID="+key_id;
            window.open (url, '', 'height='+flowDesign.height+', width='+flowDesign.width+', top=0, left=0, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no');
        },
        designManagersPermissions : function(){//经办权限
            var key_id = jQuery("#"+jQuery("#selectId").val()).attr("key_id");
            var url = "view_list/index.php?LIST_TYPE=designer&FLOW_ID="+jQuery("#flow_id").val()+"&ID="+key_id+"&ADDRESS_ID=operator";
            window.open (url, '', 'height='+flowDesign.height+', width='+flowDesign.width+', top=0, left=0, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no');
        },
        designWritableFields : function(){ //可写字段
            var key_id = jQuery("#"+jQuery("#selectId").val()).attr("key_id");
            var url = "view_list/index.php?LIST_TYPE=designer&FLOW_ID="+jQuery("#flow_id").val()+"&ID="+key_id+"&ADDRESS_ID=writable";
            window.open (url, '', 'height='+flowDesign.height+', width='+flowDesign.width+', top=0, left=0, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no');
        },
        designSecretFields : function(){//保密字段
            var key_id = jQuery("#"+jQuery("#selectId").val()).attr("key_id");
            var url = "view_list/index.php?LIST_TYPE=designer&FLOW_ID="+jQuery("#flow_id").val()+"&ID="+key_id+"&ADDRESS_ID=hidden";
            window.open (url, '', 'height='+flowDesign.height+', width='+flowDesign.width+', top=0, left=0, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no');
        },
        designRequiredFields : function(){//必填字段
            var key_id = jQuery("#"+jQuery("#selectId").val()).attr("key_id");
            var url = "view_list/index.php?LIST_TYPE=designer&FLOW_ID="+jQuery("#flow_id").val()+"&ID="+key_id+"&ADDRESS_ID=required";
            window.open (url, '', 'height='+flowDesign.height+', width='+flowDesign.width+', top=0, left=0, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no');
        },
        designConditions : function(){//条件设置
            var key_id = jQuery("#"+jQuery("#selectId").val()).attr("key_id");
            var url = "view_list/index.php?LIST_TYPE=designer&FLOW_ID="+jQuery("#flow_id").val()+"&ID="+key_id+"&ADDRESS_ID=condition";
            window.open (url, '', 'height='+flowDesign.height+', width='+flowDesign.width+', top=0, left=0, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no');
        },
        designForm: function()
        {
            var key_id = jQuery("#"+jQuery("#selectId").val()).attr("key_id");
            var s_ui_type = jQuery("#"+jQuery("#selectId").val()).attr("ui_type");
            var s_ui_url = jQuery("#"+jQuery("#selectId").val()).attr("ui_url");
            var prcs_id = jQuery("#selectId").val().replace("prcs_", "");
            var url = "select_form.php?FLOW_ID=" + jQuery("#flow_id").val() + "&ID=" + key_id + "&PRCS_ID=" + prcs_id;
            //if(s_ui_type == "form")
            //{
            //    var url = "flow_form/cool_form/ue.php?FORM_ID=" + s_ui_url + "&LIST_TYPE=designer&FLOW_ID=" + jQuery("#flow_id").val() + "&ID=" + key_id;
            //}else if(s_ui_type == "iframe" || s_ui_type == "url")
            //{
            //    var url = "set_url.php?LIST_TYPE=designer&FLOW_ID=" + jQuery("#flow_id").val() + "&ID=" + key_id;
            //}else if(s_ui_type == "as")
            //{
            //    var url = "select_node.php?LIST_TYPE=designer&FLOW_ID=" + jQuery("#flow_id").val() + "&ID=" + key_id;
            //}
            window.open (url, '', 'height='+flowDesign.height+', width='+flowDesign.width+', top=0, left=0, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no');
        },
        designClone : function(){//克隆步骤
            var msg=td_lang.system.workflow.msg_13;//'确认要克隆该步骤么？'
            if(!window.confirm(msg)){
                return false;
            }
            var key_id = jQuery("#"+jQuery("#selectId").val()).attr("key_id");
            jQuery.ajax({//添加流程步骤
                url:"view_list/clone.php",
                data:"LIST_TYPE=desinger&FLOW_ID="+jQuery("#flow_id").val()+"&ID="+key_id,
                success:function(msg){
                    if(msg === "Success"){
                        window.location = window.location.href;
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    //console.log("textStatus:"+textStatus+"&errorThrown:"+errorThrown);
                }
            });
        },
        designDelete : function(){
            var msg=td_lang.system.workflow.msg_12;//'确认要删除该步骤么？'
            if(!window.confirm(msg)){
                return false;
            }
            var selectObj = jQuery("#"+jQuery("#selectId").val());
            selectObj.trigger('mouseout');
            var key_id = selectObj.attr("key_id");
            var prcs_id = jQuery("#selectId").val().replace("prcs_", "");
            jQuery.ajax({//添加流程步骤
                url:"data/prcs_operations.php",
                data:"action=delPrcs&key_id="+key_id+"&prcs_id="+prcs_id+"&flow_id="+jQuery("#flow_id").val(),
                success:function(data){
                    if(data.delFlag == 1){
                        jsPlumb.detachAllConnections(selectObj);
                        selectObj.remove();
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    //console.log("textStatus:"+textStatus+"&errorThrown:"+errorThrown);
                }
            });
            //console.log("designDelete@"+prcs_id);
            return false;
        },
        initDiamondSource : function(){
            var color = "gray";
            var arrowCommon = { foldback:0.7, fillStyle:color, width:14 },
            overlays = [
                [ "Arrow", { location:0.6 }, arrowCommon ]
            ];
            var sourceAnchors = [ "Perimeter", { shape:'Rectangle', rotation:0 }];
            jsPlumb.importDefaults({
                Connector:"Straight",
                PaintStyle:{ lineWidth:2, strokeStyle:color},
                Endpoints : [ ["Dot", { radius:0.1 } ], [ "Dot", { radius:1 } ] ],
                EndpointStyles : [{ fillStyle:"gray" }, { fillStyle:"gray" }],
                EndpointStyles : [{ fillStyle:"gray" }, { fillStyle:"gray" }],
                HoverPaintStyle : {strokeStyle:"#ec9f2e",radius:4},
                EndpointHoverStyle : {fillStyle:"BLUE",radius:8 },
                ConnectionOverlays : [
                    [ "Arrow", { location:0.5 }, arrowCommon ],
                    [ "Arrow", { 
                        location:1,
                        id:"arrow",
                        length:14,
                        foldback:0.8
                    } ]
                ],
                isSource:true,
                isTarget:false
            });
            var windows = jQuery(".prcs-block");
            windows.each(function(i, v){
                jsPlumb.makeSource(jQuery(v),{
                    anchor:[ [ "Perimeter", { shape:jQuery(v).attr("data-shape"), rotation:0 }]],
                    connector:[ "Straight", { curviness:50 } ],
                    isSource:false,
                    isTarget:false,
                    beforeDetach:function(conn) { 
                        var data = {
                            "flow_id":jQuery("#flow_id").val(),
                            "sourceId":conn.sourceId,
                            "sourceIdKeyId":jQuery("#"+conn.sourceId).attr("key_id"),
                            "targetId":conn.targetId,
                            "targetIdKeyId":jQuery("#"+conn.targetId).attr("key_id")
                        };
                        flowDesign.addEventListener("delConn", data);
                        return true;
                    }
                });
                jsPlumb.makeTarget(jQuery("#"+jQuery(v).attr("id")), {        
                    anchor:[ 
                             [ "Perimeter", { shape:jQuery(v).attr("data-shape"), rotation:0 }]
                           ],    // you could supply this if you want, but it was set in the defaults above.                    
                    dropOptions:{ hoverClass:"hover" },
                    isSource:true,
                    isTarget:true
                });
            });
        },
        initEllipseSource : function(){
            var color = "gray";
            var arrowCommon = { foldback:0.7, fillStyle:color, width:14 },
                overlays = [
                    [ "Arrow", { location:0.6 }, arrowCommon ]
                ];
            var sourceAnchors = [ "Perimeter", { shape:'Rectangle', rotation:0 }];
            jsPlumb.importDefaults({
                Connector:"Straight",
                PaintStyle:{ lineWidth:2, strokeStyle:color},
                Endpoints : [ ["Dot", { radius:0.1 } ], [ "Dot", { radius:1 } ] ],
                EndpointStyles : [{ fillStyle:"gray" }, { fillStyle:"gray" }],
                EndpointStyles : [{ fillStyle:"gray" }, { fillStyle:"gray" }],
                HoverPaintStyle : {strokeStyle:"#ec9f2e",radius:4},
                EndpointHoverStyle : {fillStyle:"BLUE",radius:8 },
                ConnectionOverlays : [
                    [ "Arrow", { location:0.5 }, arrowCommon ],
                    [ "Arrow", {
                        location:1,
                        id:"arrow",
                        length:14,
                        foldback:0.8
                    } ]
                ],
                isSource:true,
                isTarget:false
            });
            var windows = jQuery(".prcs-block");
            windows.each(function(i, v){
                jsPlumb.makeSource(jQuery(v),{
                    anchor:[ [ "Perimeter", { shape:jQuery(v).attr("data-shape"), rotation:0 }]],
                    connector:[ "Straight", { curviness:50 } ],
                    isSource:false,
                    isTarget:false,
                    beforeDetach:function(conn) {
                        var data = {
                            "flow_id":jQuery("#flow_id").val(),
                            "sourceId":conn.sourceId,
                            "sourceIdKeyId":jQuery("#"+conn.sourceId).attr("key_id"),
                            "targetId":conn.targetId,
                            "targetIdKeyId":jQuery("#"+conn.targetId).attr("key_id")
                        };
                        flowDesign.addEventListener("delConn", data);
                        return true;
                    }
                });
                jsPlumb.makeTarget(jQuery("#"+jQuery(v).attr("id")), {
                    anchor:[
                        [ "Perimeter", { shape:jQuery(v).attr("data-shape"), rotation:0 }]
                    ],    // you could supply this if you want, but it was set in the defaults above.
                    dropOptions:{ hoverClass:"hover" },
                    isSource:true,
                    isTarget:true
                });
            });
        },
        initArrow : function(){
            var color = "gray";
            var arrowCommon = { foldback:0.7, fillStyle:color, width:14 },
                overlays = [
                    [ "Arrow", { location:0.6 }, arrowCommon ]
                ];
            var sourceAnchors = [ "Perimeter", { shape:'Rectangle', rotation:0 }];
            jsPlumb.importDefaults({    
                Anchors : [ sourceAnchors, sourceAnchors],    
                DragOptions : { cursor: "pointer", zIndex:2000 },
                PaintStyle : { strokeStyle:color, lineWidth:2 },
                Endpoints : [ ["Dot", { radius:0.1 } ], [ "Dot", { radius:1 } ] ],
                EndpointStyles : [{ fillStyle:"gray" }, { fillStyle:"gray" }],
                HoverPaintStyle : {strokeStyle:"#ec9f2e",radius:4},
                EndpointHoverStyle : {fillStyle:"BLUE",radius:8 },
                ConnectionOverlays : [
                    [ "Arrow", { location:0.5 }, arrowCommon ],
                    [ "Arrow", { 
                        location:1,
                        id:"arrow",
                        length:14,
                        foldback:0.8
                    } ]
                ],
                isSource:true,
                isTarget:false
            });
            var windows = jQuery(".prcs-block");
            windows.each(function(i, v){
                jsPlumb.makeSource(jQuery(v),{
                    anchor:[ [ "Perimeter", { shape:jQuery(v).attr("data-shape"), rotation:0 }]],
                    connector:[ "Straight", { curviness:50 } ],
                    isSource:false,
                    isTarget:false,
                    beforeDetach:function(conn) { 
                        var data = {
                            "flow_id":jQuery("#flow_id").val(),
                            "sourceId":conn.sourceId,
                            "sourceIdKeyId":jQuery("#"+conn.sourceId).attr("key_id"),
                            "targetId":conn.targetId,
                            "targetIdKeyId":jQuery("#"+conn.targetId).attr("key_id")
                        };
                        flowDesign.addEventListener("delConn", data);
                        return true;
                    }
                });
                jsPlumb.makeTarget(jQuery("#"+jQuery(v).attr("id")), {        
                    anchor:[ 
                             [ "Perimeter", { shape:jQuery(v).attr("data-shape"), rotation:0 }]
                           ],    // you could supply this if you want, but it was set in the defaults above.                    
                    dropOptions:{ hoverClass:"hover" },
                    isSource:true,
                    isTarget:true
                });
            });
        },
        initArrowOp : function(){
            jQuery("#arrow-block").click(function(){
                jQuery('.prcs-block').attr('data_type', '');
                flowDesign.initArrow();
                if(jsPlumb.getSelector(".prcs-block").length){
                    jQuery(this).toggleClass("static-block");
                    var status = jsPlumb.toggleDraggable(jsPlumb.getSelector(".prcs-block"));
                    jQuery('div[data-shape="Rectangle"]').toggleClass('static-rectangle');
                    jQuery('div[data-shape="Diamond"]').toggleClass('static-diamond');
                    jQuery('div[data-shape="Ellipse"][class*="shape-ellipsegreen"]').toggleClass('static-ellipsegreen');
                    jQuery('div[data-shape="Ellipse"][class*="shape-ellipsepink"]').toggleClass('static-ellipsepink');
                    jQuery(this).attr("dragable", status);
                }
                
            });
        },
        initView : function(){
            flowDesign.init();
            flowDesign.loadPrcsData();
            flowDesign.hidenControlPanel();
        },
        hidenControlPanel : function(){
            jQuery(".design-control").hide(true);
            jQuery(".shortcut_switch").hide(true);
        },
        addEventListener : function(action, data){
            switch(action){
                case "addPrcs":
                    flowDesign.addPrcsData(data);
                    break;
                case "delConn":
                    flowDesign.delPrcsConnDatas(data);
                    break;
                case "delConnNextPrcsId":
                    flowDesign.delPrcsNextConnDatas(data);
                    //console.log("TODO:将步骤["+data.sourceId+"]中去除掉下一步骤号["+data.suspendedElementId+"]");
                    break;
                case "addConn":
                    flowDesign.addFlowConnDatas(data);
                    break;
                default:
                    break;
            }
        },
        delPrcsNextConnDatas : function(data){
            jQuery.ajax({//添加流程步骤
                url:"data/prcs_operations.php",
                data:"action=delConnNextPrcsId&flow_id="+data.flow_id+"&sourceId="+data.sourceId
                    +"&suspendedElementId="+data.suspendedElementId 
                    +"&sourceIdKeyId="+data.sourceIdKeyId+"&suspendedElementIdKeyId="+data.suspendedElementIdKeyId,
                success:function(msg){
                    //console.log(msg);
                    //jQuery("#"+data.prcs_id).attr("key_id", data.insert_id);
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    //console.log("textStatus:"+textStatus+"&errorThrown:"+errorThrown);
                }
            });
        },
        delPrcsConnDatas : function(data){
            jQuery.ajax({//添加流程步骤
                url:"data/prcs_operations.php",
                data:"action=delConn&flow_id="+data.flow_id+"&sourceId="+data.sourceId+"&targetId="
                    +data.targetId+"&sourceIdKeyId="+data.sourceIdKeyId+"&targetIdKeyId="+data.targetIdKeyId,
                success:function(msg){
                    //console.log(msg);
                    //jQuery("#"+data.prcs_id).attr("key_id", data.insert_id);
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    //console.log("textStatus:"+textStatus+"&errorThrown:"+errorThrown);
                }
            });
        },
        addFlowConnDatas : function(data){
            jQuery.ajax({//添加流程步骤
                url:"data/prcs_operations.php",
                data:"action=addConn&flow_id="+data.flow_id+"&sourceId="+data.sourceId+"&targetId="
                    +data.targetId+"&suspendedElementId="+data.suspendedElementId 
                    +"&sourceIdKeyId="+data.sourceIdKeyId+"&targetIdKeyId="+data.targetIdKeyId+"&suspendedElementIdKeyId="+data.suspendedElementIdKeyId,
                success:function(msg){
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    //console.log("textStatus:"+textStatus+"&errorThrown:"+errorThrown);
                }
            });
        },
        addPrcsData : function(data){
            jQuery.ajax({//添加流程步骤
                url:"data/prcs_operations.php",
                data:"action=addPrcs&flow_id="+data.flow_id+"&prcs_id="+data.prcs_id+"&set_left="+data.left+"&set_top="+data.top,
                success:function(msg){
                    jQuery("#"+data.prcs_id).attr("key_id", msg.insert_id);
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    //console.log("textStatus:"+textStatus+"&errorThrown:"+errorThrown);
                }
            });
        },
        addStaticDisc : function(data, max, ends){
            flowDesign.createStaticDisc(data, max, ends);
            jsPlumb.draggable(jsPlumb.getSelector("#"+data.id));
        },
        createStaticDisc : function(data, max, ends){
            var disc = {};
            var diamondFlag = (data.prcs_in != "" && data.prcs_to != null && data.prcs_to.match(/\b0,/) == null);
            var data_shape = "Rectangle";
            if(diamondFlag && data.prcs_id != 1){
                data_shape = "Diamond";
            }
            if(data.prcs_id == 1 || jQuery.inArray('prcs_' + data.prcs_id, ends) != -1 || (data.prcs_to != null && data.prcs_to.match(/\b0,/) != null)){
                data_shape = "Ellipse";
            }
            var parentId = "design-panel";
            var idPrefix = 'prcs_';
            var prcsId = data.prcs_id; //((new Date().getTime()));
            var id= data.id;
            var d = document.createElement("div");
            d.setAttribute("data-shape", data_shape);
            d.className = "prcs-block";
            if(data.prcs_id == 1){
                d.className += " shape-"+data_shape.toLowerCase()+'green';
            }else if(jQuery.inArray('prcs_' + data.prcs_id, ends) != -1 || (data.prcs_to != null && data.prcs_to.match(/\b0,/) != null)){
                d.className += " shape-"+data_shape.toLowerCase()+'pink';
            }else{
                d.className += " shape-"+data_shape.toLowerCase();
            }
            var dSubWrap = document.createElement("div");
            dSubWrap.className = "prcs-tontent-wrap";
            var dcontent = document.createElement("div");
            dcontent.className = "content";
            dSubWrap.appendChild(dcontent);
            d.appendChild(dSubWrap);
            document.getElementById(parentId).appendChild(d);
            d.setAttribute("id", id);
            d.setAttribute("prcs_id", prcsId);
            d.setAttribute("prcs_to", data.prcs_to);
            d.setAttribute("prcs_type", data.prcs_type);
            d.setAttribute("ui_type", data.ui_type);
            d.setAttribute("ui_url", data.ui_url);

            if(data.prcs_type == 3)
            {
                
                jQuery("#prcs_"+prcsId).css({"background-color":"#e96b62"}); 
                
            }else if(data.prcs_type == 4)
			{
				jQuery("#prcs_"+prcsId).css({"background-color":"##ffff37"});
			}
            if(data.child_flow_id == 1)
            {
                jQuery("#prcs_"+prcsId).css({"background-color":"#2095f2"}); 
            }
            d.setAttribute("key_id", data.key_id);
            dcontent.innerHTML = data.prcs_id+"."+data.prcs_name;
            d.setAttribute("title", data.title);
            disc.id = id;
            if(data.id.split('_').length == 3){
                d.style.backgroundColor = '#FFFF00';
                flowDesign.error = true;
                var errorHtml = dcontent.innerHTML+"<br />";
                jQuery(window.parent.document).find('#error_prcs_info').html(jQuery(window.parent.document).find('#error_prcs_info').html()+errorHtml);
            }
            var offset = {x:data.left, y:data.top};
            flowDesign.setPosition(d, offset);
        },
        showError : function(){
            if(flowDesign.error === true){
                window.parent.open_bootcss_modal("myModal_design_tips","350","20");//修改窗口大小
            }
        },
        addDisc : function(e) {
            var info = flowDesign.createDisc(e);
            jsPlumb.draggable(jsPlumb.getSelector("#"+info.id));
            flowDesign.initArrow();
            var tmpIdArr = info.id.split('_');
            var tmpId = tmpIdArr[1]-1
            var targetId = tmpIdArr[0]+'_'+tmpId;
            jQuery('#'+info.id).attr('data_type', 'new');
            if(jQuery("#"+targetId).attr('prcs_to') == '' || jQuery("#"+targetId).attr('prcs_to') == undefined){
                if(jQuery("#"+targetId).length != 0 && jQuery("#"+info.id).length != 0){
                    jsPlumb.connect({ 
                        source:targetId, 
                        target:info.id, 
                        anchors:[ 
                                 [ "Perimeter", { shape:jQuery("#"+targetId).attr("data-shape"), rotation:0 }],
                                 [ "Perimeter", { shape:jQuery("#"+info.id).attr("data-shape"), rotation:0 }]
                               ]
                    });
                }
            }
            jQuery('div[data-shape="Rectangle"]').removeClass('static-rectangle');
            jQuery('div[data-shape="Diamond"]').removeClass('static-diamond');
            jQuery('div[data-shape="Ellipse"][class*="static-ellipsegreen"]').removeClass('static-ellipsegreen');
            jQuery('div[data-shape="Ellipse"][class*="static-ellipsepink"]').removeClass('static-ellipsepink');
            jQuery("[title]").tooltip();
        },
        createDisc : function(e) {
            var offset = flowDesign.getMousePosition(e);
            var disc = {};
            var parentId = "design-panel";
            var idPrefix = 'prcs_';
            var prcsId = flowDesign.getNextPrcsId(); //((new Date().getTime()));
            var id= idPrefix + prcsId;
            var d = document.createElement("div");
            d.setAttribute("data-shape", "Rectangle");
            d.className = "prcs-block";
            var dSubWrap = document.createElement("div");
            dSubWrap.className = "prcs-tontent-wrap";
            var dcontent = document.createElement("div");
            dcontent.className = "content";
            dSubWrap.appendChild(dcontent);
            d.appendChild(dSubWrap);
            document.getElementById(parentId).appendChild(d);
            d.setAttribute("id", id);
            dcontent.innerHTML = prcsId+"."+prcsId;
            d.title = td_lang.general.workflow.msg_227+prcsId+"<br />"+td_lang.general.workflow.msg_228;
            disc.id = id;
            var offset = flowDesign.getMousePosition(e);
            flowDesign.setPosition(d, offset);
            var data = {
                "flow_id"    :jQuery("#flow_id").val(),
                "prcs_id"    :id,
                "left"       :offset.x,
                "top"        :offset.y
            };
            flowDesign.addEventListener("addPrcs", data);
            return disc;
        },
        getNextPrcsId : function(){
            var maxPrcsId = 0;
            var a_prcs_id = new Array();
            a_prcs_id[0] = 0;
            jQuery(".prcs-block").each(function(){
                a_prcs_id.push(parseInt(jQuery(this).attr("id").replace("prcs_", "")));
            });
            a_prcs_id.sort(function(a,b){return parseInt(a)<parseInt(b)?1:-1});//从大到小排序
            return parseInt(a_prcs_id[0]+1);
        },
        getMousePosition : function(e) {
            var offset = {};
            offset.x = e.pageX;
            offset.y = e.pageY;
            return offset;
        },
        setPosition : function(obj, offset){
            obj.style.top= offset.y + 'px';
            obj.style.left= offset.x + 'px';
        }
    }
})();
jsPlumb.ready(function(){
    flowDesign.initEdit();
    //flowDesign.initView();
    jQuery(document).on('mouseover', '.shape-rectangle', function(){
        jQuery(this).addClass("shape-rectangle-hover");
    });
    jQuery(document).on('mouseout', '.shape-rectangle', function(){
        jQuery(this).removeClass("shape-rectangle-hover");
    });
    jQuery(document).on('mouseover', '.shape-diamond', function(){
        jQuery(this).addClass("shape-diamond-hover");
    });
    jQuery(document).on('mouseout', '.shape-diamond', function(){
        jQuery(this).removeClass("shape-diamond-hover");
    });
    jQuery(document).on('mouseover', '.shape-ellipsegreen', function(){
        jQuery(this).addClass("shape-ellipsegreen-hover");
    });
    jQuery(document).on('mouseout', '.shape-ellipsegreen', function(){
        jQuery(this).removeClass("shape-ellipsegreen-hover");
    });
    jQuery(document).on('mouseover', '.shape-ellipsepink', function(){
        jQuery(this).addClass("shape-ellipsepink-hover");
    });
    jQuery(document).on('mouseout', '.shape-ellipsepink', function(){
        jQuery(this).removeClass("shape-ellipsepink-hover");
    });
    jQuery.easing.def = "easeInOutBack";
    jQuery('#panel-switch').click(function(){
        var control_width = jQuery(".design-control").outerWidth(true);
        if(jQuery(this).hasClass("content-close")){
            jQuery(this).removeClass("content-close").addClass("content-open");
            jQuery(".design-control").animate({left: -control_width+16}, "slow");
        }else if(jQuery(this).hasClass("content-open")){
            jQuery(this).removeClass("content-open").addClass("content-close");
            jQuery(".design-control").animate({left: '0px'}, "slow");
        }
    });
    jQuery(document).on("dblclick", ".prcs-block", function(){
        var obj_id = jQuery(this).attr('id');
        var a_obj_id = obj_id.split('_');
        if(a_obj_id.length >= 2){
			var url = "view_list/index.php?LIST_TYPE=designer&FLOW_ID="  + jQuery('#flow_id').val() + "&ID=" + jQuery(this).attr("key_id");
            window.open (url, '', 'height='+flowDesign.height+', width='+flowDesign.width+', top=0, left=0, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no');
            
        }
    });
    jQuery('html,body').keydown(function(event){
        if(jQuery(".dropdown-menu").is(":visible")){
            switch(event.keyCode){
                case 68: //(D) 删除
                    jQuery(".dropdown-menu").find("a[tabindex='Delete']").trigger("click");
                    break;
                case 66: //(B) 基本属性
                    jQuery(".dropdown-menu").find("a[tabindex='Property']").trigger("click");
                    break;
                case 79: //(O) 经办权限
                    $find_a = jQuery(".dropdown-menu").find("a[tabindex='ManagersPermissions']");
                    if($find_a.is(":visible")){
                        $find_a.trigger("click");
                    }
                    break;
                case 87: //(W) 可写字段
                    $find_a = jQuery(".dropdown-menu").find("a[tabindex='WritableFields']");
                    if($find_a.is(":visible")){
                        $find_a.trigger("click");
                    }
                    break;
                case 83: //(S) 保密字段
                    $find_a = jQuery(".dropdown-menu").find("a[tabindex='SecretFields']");
                    if($find_a.is(":visible")){
                        $find_a.trigger("click");
                    }
                    break;
                case 77: //(M) 必填字段
                    $find_a = jQuery(".dropdown-menu").find("a[tabindex='RequiredFields']");
                    if($find_a.is(":visible")){
                        $find_a.trigger("click");
                    }
                    break;
                case 67: //(C) 克隆步骤
                    jQuery(".dropdown-menu").find("a[tabindex='Clone']").trigger("click");
                    break;
                case 82: //(R) 条件设置
                    jQuery(".dropdown-menu").find("a[tabindex='Conditions']").trigger("click");
                    break;
                case 70: //(F) 设计表单
                    jQuery(".dropdown-menu").find("a[tabindex='DesignForm']").trigger("click");
                    break;
                default:
                    break;
            }
        }
    }).scroll(function(){
        if(jQuery(".dropdown-menu").is(":visible")){
            jQuery("body").click();
        }
    });
});

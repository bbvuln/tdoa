function Tree(id, jsonURL, iconsPath, checkbox, selectMode, options) {
      this.id = id;
      this.jsonURL = jsonURL;
      this.options = options;
      this.iconsPath = iconsPath ? iconsPath : '/static/images/org/';
      this.checkbox = checkbox ? checkbox : false;
      this.selectMode = selectMode ? selectMode : 3;
      this.tree = null;
      this.minExpandLevel = typeof (this.options) == "object" && options.minExpandLevel ? options.minExpandLevel : 1;
      this.persist = typeof (this.options) == "object" && options.persist == true ? true : false;
}

Tree.prototype.BuildTree = function () {
      jQuery("#" + this.id).dynatree({
            minExpandLevel: this.minExpandLevel,
            persist: this.persist,
            autoFocus: false,
            imagePath: this.iconsPath,
            checkbox: this.checkbox,
            selectMode: this.selectMode,
            customOptions: this.options,
            children: typeof (this.options) == "object" && typeof (this.options.LazyReadAPI) == "function" ? this.options.LazyReadAPI(this.options.paras) : null,
            fx: {
                  height: "toggle",
                  duration: 200
            },
            initAjax: {
                  url: this.jsonURL
            },
            onPostInit: function (isReloading, isError) {
                  if (typeof (tree_loaded) == 'function')
                        tree_loaded(this, isReloading, isError);
            },
            onLazyRead: function (node) {
                  if (typeof (this.options.customOptions) == "object" && typeof (this.options.customOptions.LazyReadAPI) == "function") {
                        node.addChild(this.options.customOptions.LazyReadAPI({
                              "node": node,
                              "flag": this.options.customOptions.paras.flag
                        }));
                        node.setLazyNodeStatus(DTNodeStatus_Ok);
                  } else if (node.data.json) {
                        node.appendAjax({
                              url: node.data.json
                        });
                  } else {
                        node.setLazyNodeStatus(DTNodeStatus_Ok);
                  }
            },
            onActivate: function (node) {
                  if (typeof (tree_click) == 'function')
                        tree_click(node);
                  node = null;
            },
            onBlur: function (node) {
                  node.deactivate();
                  node = null;
            },
            onDblClick: function (node) {
                  if (typeof (tree_dblclick) == 'function')
                        tree_dblclick(node);
                  node = null;
            },
            onSelect: function (select, node) {
                  if (typeof (tree_select) == 'function')
                        tree_select(select, node);
                  node = null;
            },
            onRender: function (node, nodeSpan) {
                  if (typeof (tree_render) == 'function')
                        tree_render(node, nodeSpan);
                  node = null;
                  nodeSpan = null;
            },
            onCreate: function (node, nodeSpan) {
                  if (typeof (tree_create) == 'function')
                        tree_create(node, nodeSpan);
                  node = null;
                  nodeSpan = null;
            },
            strings: {
                  loading: td_lang.inc.msg_84, //"加载��?..."
                  loadError: td_lang.inc.msg_85
            }
      });

      this.tree = jQuery("#" + this.id).dynatree('getTree');

      if (typeof (mouseenter_tree_li_callback) == "function")
            jQuery("#" + this.id + " li").live('mouseenter', mouseenter_tree_li_callback);
}

Tree.prototype.reload = function () {
      var objs = document.getElementById(this.id).getElementsByTagName('li');
      for (var i = 0; i < objs.length; i++) {
            if (objs[i].getAttribute('dtnode'))
                  objs[i].removeAttribute('dtnode');
      }
      objs = null;

      this.tree.getRoot().removeChildren();
      remove_nodes(this.tree.options.children);

      if (typeof (this.options) == "object" && typeof (this.options.LazyReadAPI) == "function") {
            this.tree.options.children = null;
            this.tree.options.children = this.options.LazyReadAPI(this.options.paras);
      }

      this.tree.reload();
}

Tree.prototype.addNode = function (data) {}

Tree.prototype.editNode = function (data) {
      var node = this.tree.getNodeByKey(data.key);
      if (!node)
            return;

      if (data.new_key)
            node.data.key = data.new_key;
      if (data.icon)
            node.data.icon = data.icon;
      if (data.title) {
            node.data.title = data.title;
            node.data.tooltip = data.title;
      }
      if (data.url) {
            node.data.url = data.url;
      }
      node.render();
}

Tree.prototype.render = function (key, data) {
      var node = this.tree.getNodeByKey(key);
      if (!node)
            return;
      node.data = data;
      node.render();
}

Tree.prototype.deleteNode = function (data) {
      var node = this.tree.getNodeByKey(data.key);
      if (!node)
            return;

      var parent = node.parent;
      node.remove();

      if (parent.countChildren() <= 0) {
            if (parent.parent == this.tree.getRoot())
                  this.tree.reload();
            else
                  parent.parent.reloadChildren();
      }
}

Tree.prototype.redrawNode = function (id, action, text, new_id, url) {
      if (jQuery("#msg").length > 0)
            jQuery("#msg").hide();

      if (id == "0" || !id) {
            this.tree.reload();
            return;
      }

      if (action == "add" || action == "copy" || action == "cut" || action == "share") {
            var node = this.tree.getNodeByKey('folder_' + id);
            if (!node)
                  return;

            //--修改,判断当树子节点的子节点为空时直接刷新整个��?--yzx
            if (node.data.children == null || node.data.children == '') {
                  this.tree.reload();
            }
            //----------------

            if (node.data.isLazy) {
                  node.reloadChildren();
            } else {
                  node.parent.reloadChildren();
            }
      } else if (action == "delete") {
            this.deleteNode({
                  key: 'folder_' + id
            });
      } else if (action == "rename") {
            this.editNode({
                  key: 'folder_' + id,
                  title: text,
                  new_key: 'folder_' + new_id,
                  url: url
            });
      }
}

function tree_click(node) {
      var self = this;
      if (typeof (node_click) == 'function') {
            node_click(node);
      } else if (typeof (window.top.ispirit_js) != 'function' || typeof window.external == 'undefined' || typeof (window.external.OA_SMS) == 'undefined') {
            if (node.data.url && node.data.target) {
                  if (jQuery("#dept_item_" + node.data.dept_id).length > 0) {
                        jQuery("#dept_item").children().hide();
                        jQuery("#dept_item_" + node.data.dept_id).show();
                        return;
                  } else {
                        if (jQuery("div.alert-modal-box").attr("data-select-user") == "selectuser" || jQuery(".alert-modal-box").attr("data-no-all") == "noall" || jQuery("div.alert-modal-box").attr("data-normal") == "normal") {
                              if (jQuery(".alert-modal-box").data("use_uid") == 1) {
                                    jQuery.ajax({
                                          type: "POST",
                                          url: jQuery("div.alert-modal-box").attr("data-ajax-url"),
                                          data: {
                                                ACTION: "bydept",
                                                DEPT_ID: node.data.dept_id,
                                                FUNC_ID: jQuery(".alert-modal-box").data("func_id"),
                                                MODULE_ID: jQuery(".alert-modal-box").data("module_id"),
                                                PRIV_NO_FLAG: jQuery(".alert-modal-box").data("priv_no_flag"),
                                                MANAGE_FLAG: jQuery(".alert-modal-box").data("manage_flag"),
                                                USE_UID: jQuery(".alert-modal-box").data("use_uid"),
                                                PRIV_OP: jQuery(".alert-modal-box").data("priv_op")
                                          },
                                          dataType: "json",
                                          success: function (msg) {
                                                if (msg.status == 0) {
                                                      jQuery("#dept_item").children().hide();
                                                      if (jQuery("#dept_item .message").length > 0) {
                                                            jQuery("#dept_item .message").show();
                                                      } else {
                                                            jQuery("#dept_item").append("<div class='message'>" + msg.msg + "</div>");
                                                      }
                                                } else if (msg.status == 1) {
                                                      jQuery("#dept_item").children().hide();
                                                      if (jQuery(".alert-modal-box").attr("data-no-all") != "noall") {
                                                            jQuery("#dept_item").append("<div class='block-right' id=dept_item_" + node.data.dept_id + "><div class='block-right-header' title=" + node.data.title + ">" + node.data.title + "</div><div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div></div>");
                                                      } else {
                                                            jQuery("#dept_item").append("<div class='block-right' id=dept_item_" + node.data.dept_id + "><div class='block-right-header' title=" + node.data.title + ">" + node.data.title + "</div></div>");
                                                      }
                                                      jQuery.each(msg.data, function (index, element) {
                                                            if (element.attend_status == "") {
                                                                  jQuery("#dept_item #dept_item_" + node.data.dept_id).append("<div class='block-right-item' item_id=\'" + element.uid + "\' item_name=" + element.user_name.replace(/\s/g, '') + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name'></span><span class='real-name'>" + element.user_name + "</span></div>")
                                                            } else {
                                                                  jQuery("#dept_item #dept_item_" + node.data.dept_id).append("<div class='block-right-item' item_id=\'" + element.uid + "\' item_name=" + element.user_name.replace(/\s/g, '') + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name'></span><span class='real-name'>" + element.user_name + "</span><span class='status'> (" + element.attend_status + ")</span></div>")
                                                            }
															
															var current = element.uid;
															var selected = userSaveAndBind[jQuery(".alert-modal-box").data("to-id")].toString() + ",";
															var findIt = includesUser(current, selected)
                                                            if (findIt) {
                                                                  jQuery(".block-right-item[item_id='" + element.uid + "']").addClass("active");
                                                            }
                                                      });
                                                }
                                          }
                                    })
                              } else {
                                    jQuery.ajax({
                                          type: "POST",
                                          url: jQuery("div.alert-modal-box").attr("data-ajax-url"),
                                          data: {
                                                ACTION: "bydept",
                                                DEPT_ID: node.data.dept_id,
                                                FUNC_ID: jQuery(".alert-modal-box").data("func_id"),
                                                MODULE_ID: jQuery(".alert-modal-box").data("module_id"),
                                                PRIV_NO_FLAG: jQuery(".alert-modal-box").data("priv_no_flag"),
                                                MANAGE_FLAG: jQuery(".alert-modal-box").data("manage_flag"),
                                                USE_UID: jQuery(".alert-modal-box").data("use_uid"),
                                                PRIV_OP: jQuery(".alert-modal-box").data("priv_op")
                                          },
                                          dataType: "json",
                                          success: function (msg) {
                                                if (msg.status == 0) {
                                                      jQuery("#dept_item").children().hide();
                                                      if (jQuery("#dept_item .message").length > 0) {
                                                            jQuery("#dept_item .message").show();
                                                      } else {
                                                            jQuery("#dept_item").append("<div class='message'>" + msg.msg + "</div>");
                                                      }
                                                } else if (msg.status == 1) {
													//console.log('success',msg)
                                                      jQuery("#dept_item").children().hide();
                                                      if (jQuery(".alert-modal-box").attr("data-no-all") != "noall") {
                                                            jQuery("#dept_item").append("<div class='block-right' id=dept_item_" + node.data.dept_id + "><div class='block-right-header' title=" + node.data.title + ">" + node.data.title + "</div><div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div></div>");
                                                      } else {
                                                            jQuery("#dept_item").append("<div class='block-right' id=dept_item_" + node.data.dept_id + "><div class='block-right-header' title=" + node.data.title + ">" + node.data.title + "</div></div>");
                                                      }
                                                      jQuery.each(msg.data, function (index, element) {
                                                            if (element.attend_status == "") {
                                                                  jQuery("#dept_item #dept_item_" + node.data.dept_id).append("<div class='block-right-item' item_id=\'" + element.user_id + "\' item_name=" + element.user_name.replace(/\s/g, '') + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name'></span><span class='real-name'>" + element.user_name + "</span></div>")
                                                            } else {
                                                                  jQuery("#dept_item #dept_item_" + node.data.dept_id).append("<div class='block-right-item' item_id=\'" + element.user_id + "\' item_name=" + element.user_name.replace(/\s/g, '') + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name'></span><span class='real-name'>" + element.user_name + "</span><span class='status'> (" + element.attend_status + ")</span></div>")
                                                            }
															var current = element.user_id;
															var selected = userSaveAndBind[jQuery(".alert-modal-box").data("to-id")].toString() + ",";
															var findIt = includesUser(current, selected)
															if(findIt){
																  jQuery(".block-right-item[item_id='" + element.user_id + "']").addClass("active");
                                                            }
                                                      });
                                                }
                                          }
                                    })
                              }
                        } else if (jQuery("div.alert-modal-box").attr("data-select-dept") == "selectdept") {
                              jQuery.ajax({
                                    type: "POST",
                                    url: jQuery("div.alert-modal-box").attr("data-ajax-url"),
                                    data: {
                                          ACTION: "bydept",
                                          DEPT_ID: node.data.dept_id,
                                          FUNC_ID: jQuery(".alert-modal-box").data("func_id"),
                                          MODULE_ID: jQuery(".alert-modal-box").data("module_id"),
                                          PRIV_NO_FLAG: jQuery(".alert-modal-box").data("priv_no_flag"),
                                          MANAGE_FLAG: jQuery(".alert-modal-box").data("manage_flag"),
                                          USE_UID: jQuery(".alert-modal-box").data("use_uid"),
                                          PRIV_OP: jQuery(".alert-modal-box").data("priv_op")
                                    },
                                    dataType: "json",
                                    success: function (msg) {
                                          if (msg.status == 0) {
                                                jQuery("#dept_item").children().hide();
                                                if (jQuery("#dept_item .message").length > 0) {
                                                      jQuery("#dept_item .message").show();
                                                } else {
                                                      jQuery("#dept_item").append("<div class='message'>" + msg.msg + "</div>");
                                                }
                                          } else if (msg.status == 1) {
                                                jQuery("#dept_item").children().hide();
												jQuery("#dept_item").append("<div class='block-right' id=dept_item_" + node.data.dept_id + "></div>");
												if(msg.flag){
													jQuery("#dept_item_" + node.data.dept_id).append("<div class='block-right-alldept' item_id='ALL_DEPT' item_name='全体部门'>全体部门</div>");
												}
												jQuery("#dept_item_" + node.data.dept_id).append("<div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div>");
												/*
                                                jQuery("#dept_item").append("<div class='block-right' id=dept_item_" + node.data.dept_id + "><div class='block-right-alldept' item_id='ALL_DEPT' item_name='全体部门'>全体部门</div><div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div></div>");
												*/
                                                jQuery.each(msg.data, function (index, element) {
                                                      jQuery("#dept_item #dept_item_" + node.data.dept_id).append("<div class='block-right-item' item_id=\'" + element.dept_id + "\' item_name=" + element.dept_name.replace(/\s/g, '') + " user_id=\'" + element.dept_id + "\'><span class='name'></span><span>" + element.dept_line + "</span><span class='real-name'>" + element.dept_name + "</span></div>")
                                                      
													  var current = element.dept_id;
														var selected = userSaveAndBind[jQuery(".alert-modal-box").data("to-id")].toString() + ",";
														var findIt = includesUser(current, selected)
														if(findIt){
                                                            jQuery(".block-right-item[item_id='" + element.dept_id + "']").addClass("active");
                                                      }
                                                })
                                          }
                                    }
                              })
                        } else if (jQuery("div.alert-modal-box").attr("data-role") == "role") {
                              jQuery.ajax({
                                    type: "POST",
                                    url: jQuery("div.alert-modal-box").attr("data-ajax-url"),
                                    data: {
                                          ACTION: "bydept",
                                          DEPT_ID: node.data.dept_id,
                                          FUNC_ID: jQuery(".alert-modal-box").data("func_id"),
                                          MODULE_ID: jQuery(".alert-modal-box").data("module_id"),
                                          PRIV_NO_FLAG: jQuery(".alert-modal-box").data("priv_no_flag"),
                                          MANAGE_FLAG: jQuery(".alert-modal-box").data("manage_flag"),
                                          USE_UID: jQuery(".alert-modal-box").data("use_uid"),
                                          PRIV_OP: jQuery(".alert-modal-box").data("priv_op")
                                    },
                                    dataType: "json",
                                    success: function (msg) {
                                          if (msg.status == 0) {
                                                jQuery("#dept_item").children().hide();
                                                if (jQuery("#dept_item .message").length > 0) {
                                                      jQuery("#dept_item .message").show();
                                                } else {
                                                      jQuery("#dept_item").append("<div class='message'>" + msg.msg + "</div>");
                                                }
                                          } else if (msg.status == 1) {
                                                jQuery("#dept_item").children().hide();
                                                jQuery("#dept_item").append("<div class='block-right' id=dept_item_" + node.data.dept_id + "><div class='block-right-header'>选择角色</div><div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div></div>");
                                                jQuery.each(msg.data, function (index, element) {
                                                      if (element.user_priv == undefined) {
                                                            jQuery("#dept_item #dept_item_" + node.data.dept_id).append("<div class='block-right-header' style='background:#F8F8F8;margin-top: 5px;' title=" + element.name + ">" + element.name + "</div>")
                                                      } else {
                                                            jQuery("#dept_item #dept_item_" + node.data.dept_id).append("<div class='block-right-item' item_id=\'" + element.user_priv + "\' item_name=" + element.priv_name.replace(/\s/g, '') + " user_id=\'" + element.user_priv + "\'><span class='name'></span><span class='real-name'>" + element.priv_name + "</span></div>")
                                                           
															var current = element.user_priv;
															var selected = userSaveAndBind[jQuery(".alert-modal-box").data("to-id")].toString() + ",";
															var findIt = includesUser(current, selected)
															if(findIt){
                                                                  jQuery(".block-right-item[item_id='" + element.user_priv + "']").addClass("active");
                                                            }
                                                      }
                                                });
                                          }
                                    }
                              })
                        }
                  }

                  //    if(window.frames[node.data.target])
                  //       window.frames[node.data.target].location = node.data.url;
                  //    else if(parent.frames[node.data.target])
                  //       parent.frames[node.data.target].location = node.data.url;
                  //    else if(top.frames[node.data.target])
                  //       top.frames[node.data.target].location = node.data.url;
                  //    else
                  //       window.open(node.data.url);
            }
      }
}

function tree_select(select, node) {
      if (jQuery("#dept_item_children_" + node.data.dept_id).length > 0) {
            jQuery("#dept_item").children().hide();
            jQuery("#dept_item_children_" + node.data.dept_id).show();
            if (select == true) {
                  jQuery.each(jQuery("#dept_item_children_" + node.data.dept_id + " .block-right-item"), function (index, element) {
                        jQuery(".block-right-item[item_id='" + jQuery(element).attr("item_id") + "']").addClass("active");
						
						var current = jQuery(element).attr("item_id");
						var selected = userSaveAndBind[jQuery(".alert-modal-box").data("to-id")].toString() + ",";
						var findIt = includesUser(current, selected)
						if(findIt){
                              return;
                        } else {
                              userSaveAndBind[jQuery(".alert-modal-box").data("to-id")].push(jQuery(element).attr("item_id"));
                              userSaveAndBind[jQuery(".alert-modal-box").data("to-name")].push(jQuery(element).find("span.real-name").text());
                        }
                        if (typeof (org_select_callbacks) == 'object') {
                              org_select_callbacks.add && org_select_callbacks.add.apply(this, [jQuery(element).attr("item_id"), jQuery(element).find("span.real-name").text()]);
                              jQuery("input#" + jQuery(".alert-modal-box").data("to-id")).parent().find("a.close").attr("data-to-id", jQuery(".alert-modal-box").data("to-id"));
                              jQuery("input#" + jQuery(".alert-modal-box").data("to-id")).parent().find("a.close").data("to-id", jQuery(".alert-modal-box").data("to-id"));
                              jQuery("input#" + jQuery(".alert-modal-box").data("to-id")).parent().find("a.close").attr("data-to-name", jQuery(".alert-modal-box").data("to-name"));
                              jQuery("input#" + jQuery(".alert-modal-box").data("to-id")).parent().find("a.close").data("to-name", jQuery(".alert-modal-box").data("to-name"));
                        }
                  });
                  jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-id") + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-id")].toString() + ",");
                  jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name") + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-name")].toString() + ",");
                  jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-name") + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-name")].toString() + ",");
            } else {
                  jQuery.each(jQuery("#dept_item_children_" + node.data.dept_id + " .block-right-item"), function (index, element) {
                        jQuery(".block-right-item[item_id='" + jQuery(element).attr("item_id") + "']").removeClass("active");
                        if (typeof (org_select_callbacks) == 'object') {
                              org_select_callbacks.remove && org_select_callbacks.remove.apply(this, [jQuery(element).attr("item_id"), jQuery(element).find("span.real-name").text()]);
                        }
                        userSaveAndBind.removeByValue(userSaveAndBind[jQuery(".alert-modal-box").data("to-id")], jQuery(element).attr("item_id"));
                        userSaveAndBind.removeByValue(userSaveAndBind[jQuery(".alert-modal-box").data("to-name")], jQuery(element).find("span.real-name").text());
                  });
                  if (userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-id")].length == 0) {
                        jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-id") + "]").val("");
                        jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name") + "]").val("");
                        jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-name") + "]").val("");
                  } else {
                        jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-id") + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-id")].toString() + ",");
                        jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name") + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-name")].toString() + ",");
                        jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-name") + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-name")].toString() + ",");
                  }
            }
            return;
      } else {
            if (select == true) {
                  if (jQuery("div.alert-modal-box").attr("data-select-user") == "selectuser" || jQuery("div.alert-modal-box").attr("data-normal") == "normal") {
                        if (jQuery(".alert-modal-box").data("use_uid") == 1) {
                              jQuery.ajax({
                                    type: "POST",
                                    url: jQuery("div.alert-modal-box").attr("data-ajax-url"),
                                    data: {
                                          ACTION: "children",
                                          DEPT_ID: node.data.dept_id,
                                          CHECKED: true,
                                          FUNC_ID: jQuery(".alert-modal-box").data("func_id"),
                                          MODULE_ID: jQuery(".alert-modal-box").data("module_id"),
                                          PRIV_NO_FLAG: jQuery(".alert-modal-box").data("priv_no_flag"),
                                          MANAGE_FLAG: jQuery(".alert-modal-box").data("manage_flag"),
                                          USE_UID: jQuery(".alert-modal-box").data("use_uid"),
                                          PRIV_OP: jQuery(".alert-modal-box").data("priv_op")
                                    },
                                    dataType: "json",
                                    success: function (msg) {
                                          if (msg.status == 0) {
                                                jQuery("#dept_item").children().hide();
                                                if (jQuery("#dept_item .message").length > 0) {
                                                      jQuery("#dept_item .message").show();
                                                } else {
                                                      jQuery("#dept_item").append("<div class='message'>" + msg.msg + "</div>");
                                                }
                                          } else if (msg.status == 1) {
                                                jQuery("#dept_item").children().hide();

                                                jQuery("#dept_item").append("<div class='block-right' id=dept_item_children_" + node.data.dept_id + "><div class='block-right-header' title=" + node.data.title + ">" + node.data.title + "</div><div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div></div>");
                                                jQuery.each(msg.data, function (index, element) {
                                                      if (element.uid == undefined) {
                                                            jQuery("#dept_item #dept_item_children_" + node.data.dept_id).append("<div class='block-right-header' style='text-align:left;border-top:0px;border-radius:0em;'>" + element.dept_line + element.dept_name + "</div>");
                                                      } else {
                                                            if (element.attend_status != "") {
                                                                  jQuery("#dept_item #dept_item_children_" + node.data.dept_id).append("<div class='block-right-item' item_id=\'" + element.uid + "\' item_name=" + element.user_name.replace(/\s/g, '') + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name' dept_special=\'" + element.user_id + "\'></span><span class='real-name'>" + element.user_name + "</span><span class='status'> (" + element.attend_status + ")</span></div>")
                                                            } else {
                                                                  jQuery("#dept_item #dept_item_children_" + node.data.dept_id).append("<div class='block-right-item' item_id=\'" + element.uid + "\' item_name=" + element.user_name.replace(/\s/g, '') + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name' dept_special=\'" + element.user_id + "\'></span><span class='real-name'>" + element.user_name + "</span></div>")
                                                            }
                                                            jQuery(".block-right-item[item_id='" + element.uid + "']").addClass("active");
                                                            if (typeof (org_select_callbacks) == 'object') {
                                                                  org_select_callbacks.add && org_select_callbacks.add.apply(this, [element.uid, element.user_name]);
                                                                  jQuery("input#" + jQuery(".alert-modal-box").data("to-id")).parent().find("a.close").attr("data-to-id", jQuery(".alert-modal-box").data("to-id"));
                                                                  jQuery("input#" + jQuery(".alert-modal-box").data("to-id")).parent().find("a.close").data("to-id", jQuery(".alert-modal-box").data("to-id"));
                                                                  jQuery("input#" + jQuery(".alert-modal-box").data("to-id")).parent().find("a.close").attr("data-to-name", jQuery(".alert-modal-box").data("to-name"));
                                                                  jQuery("input#" + jQuery(".alert-modal-box").data("to-id")).parent().find("a.close").data("to-name", jQuery(".alert-modal-box").data("to-name"));
                                                            }
															var current = element.uid;
															var selected = userSaveAndBind[jQuery(".alert-modal-box").data("to-id")].toString() + ",";
															var findIt = includesUser(current, selected)
															if(findIt){
                                                                  return;
                                                            } else {
                                                                  userSaveAndBind[jQuery(".alert-modal-box").data("to-id")].push(element.uid);
                                                                  userSaveAndBind[jQuery(".alert-modal-box").data("to-name")].push(element.user_name);
                                                            }
                                                      }
                                                });
                                                jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-id").toString() + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-id")].toString() + ",");
                                                jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-name")].toString() + ",");
                                                jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-name")].toString() + ",");
                                          }
                                    }
                              })
                        } else {
							  jQuery("#block_dept").append('<div class="userselect-loading" style="position: absolute;top: 0;bottom: 0;left: 0;right: 0;z-index: 99;background: #d2d2d2;opacity: 0.5;text-align: center;padding: 50px 0px;color: #000;font-weight: bold;">加载中,请稍后</div>');
							  var $dept_item = jQuery("#dept_item");
                              jQuery.ajax({
                                    type: "POST",
                                    url: jQuery("div.alert-modal-box").attr("data-ajax-url"),
                                    data: {
                                          ACTION: "children",
                                          DEPT_ID: node.data.dept_id,
                                          CHECKED: true,
                                          FUNC_ID: jQuery(".alert-modal-box").data("func_id"),
                                          MODULE_ID: jQuery(".alert-modal-box").data("module_id"),
                                          PRIV_NO_FLAG: jQuery(".alert-modal-box").data("priv_no_flag"),
                                          MANAGE_FLAG: jQuery(".alert-modal-box").data("manage_flag"),
                                          USE_UID: jQuery(".alert-modal-box").data("use_uid"),
                                          PRIV_OP: jQuery(".alert-modal-box").data("priv_op")
                                    },
                                    dataType: "json",
                                    success: function (msg) {
                                          if (msg.status == 0) {
                                                $dept_item.children().hide();
                                                if (jQuery("#dept_item .message").length > 0) {
                                                      jQuery("#dept_item .message").show();
                                                } else {
                                                      $dept_item.append("<div class='message'>" + msg.msg + "</div>");
                                                }
												jQuery("#block_dept").find('.userselect-loading').remove();
                                          } else if (msg.status == 1) {
                                                $dept_item.children().hide();

                                                $dept_item.append("<div class='block-right' id=dept_item_children_" + node.data.dept_id + "><div class='block-right-header' title=" + node.data.title + ">" + node.data.title + "</div><div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div></div>");
                                                jQuery.each(msg.data, function (index, element) {
                                                      if (element.uid == undefined) {
                                                             $dept_item.find("#dept_item_children_" + node.data.dept_id).append("<div class='block-right-header' style='text-align:left;border-top:0px;border-radius:0em;'>" + element.dept_line + element.dept_name + "</div>");
                                                      } else {
															  $dept_item.find("#dept_item_children_" + node.data.dept_id).append("<div class='block-right-item' item_id=\'" + element.user_id + "\' item_name=" + element.user_name.replace(/\s/g, '') + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name' dept_special=\'" + element.user_id + "\'></span><span class='real-name'>" + element.user_name + "</span>"+(element.attend_status ? "<span class='status'> (" + element.attend_status + ")</span>" : "")+"</div>");
                                                            $dept_item.find(".block-right-item[item_id='" + element.user_id + "']").addClass("active");
                                                            if (typeof (org_select_callbacks) == 'object') {
                                                                  org_select_callbacks.add && org_select_callbacks.add.apply(this, [element.user_id, element.user_name]);
																  var $close = jQuery("input#" + jQuery(".alert-modal-box").data("to-id")).parent().find("a.close");
                                                                  $close.attr("data-to-id", jQuery(".alert-modal-box").data("to-id"));
                                                                  $close.data("to-id", jQuery(".alert-modal-box").data("to-id"));
                                                                  $close.attr("data-to-name", jQuery(".alert-modal-box").data("to-name"));
                                                                  $close.data("to-name", jQuery(".alert-modal-box").data("to-name"));
                                                            }
															var current = element.user_id;
															var selected = userSaveAndBind[jQuery(".alert-modal-box").data("to-id")].toString() + ",";
															var findIt = includesUser(current, selected)
															if(findIt){
                                                                  return;
                                                            } else {
                                                                  userSaveAndBind[jQuery(".alert-modal-box").data("to-id")].push(element.user_id);
                                                                  userSaveAndBind[jQuery(".alert-modal-box").data("to-name")].push(element.user_name);
                                                            }
                                                      }
                                                });
                                                jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-id").toString() + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-id")].toString() + ",");
                                                jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-name")].toString() + ",");
                                                jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-name")].toString() + ",");
												 jQuery("#block_dept").find('.userselect-loading').remove();
                                          }
                                    },
									error: function(){
										jQuery("#block_dept").find('.userselect-loading').remove();
									}
                              })
                        }
                  } else if (jQuery("div.alert-modal-box").attr("data-select-dept") == "selectdept") {
                        jQuery.ajax({
                              type: "POST",
                              url: jQuery("div.alert-modal-box").attr("data-ajax-url"),
                              data: {
                                    ACTION: "children",
                                    DEPT_ID: node.data.dept_id,
                                    CHECKED: true,
                                    FUNC_ID: jQuery(".alert-modal-box").data("func_id"),
                                    MODULE_ID: jQuery(".alert-modal-box").data("module_id"),
                                    PRIV_NO_FLAG: jQuery(".alert-modal-box").data("priv_no_flag"),
                                    MANAGE_FLAG: jQuery(".alert-modal-box").data("manage_flag"),
                                    USE_UID: jQuery(".alert-modal-box").data("use_uid"),
                                    PRIV_OP: jQuery(".alert-modal-box").data("priv_op")
                              },
                              dataType: "json",
                              success: function (msg) {
                                    if (msg.status == 0) {
                                          jQuery("#dept_item").children().hide();
                                          if (jQuery("#dept_item .message").length > 0) {
                                                jQuery("#dept_item .message").show();
                                          } else {
                                                jQuery("#dept_item").append("<div class='message'>" + msg.msg + "</div>");
                                          }
                                    } else if (msg.status == 1) {
                                          jQuery("#dept_item").children().hide();
										  jQuery("#dept_item").append("<div class='block-right' id=dept_item_children_" + node.data.dept_id + "></div>");
										  if(msg.flag){
											  jQuery("#dept_item_children_" + node.data.dept_id).append("<div class='block-right-alldept' item_id='ALL_DEPT' item_name='全体部门'>全体部门</div>");
										  }
										  jQuery("#dept_item_children_" + node.data.dept_id).append("<div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div>");
										  /*
                                          jQuery("#dept_item").append("<div class='block-right' id=dept_item_children_" + node.data.dept_id + "><div class='block-right-alldept' item_id='ALL_DEPT' item_name='全体部门'>全体部门</div><div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div></div>");
										  */
                                          jQuery.each(msg.data, function (index, element) {
                                                jQuery("#dept_item #dept_item_children_" + node.data.dept_id).append("<div class='block-right-item' item_id=" + element.dept_id + " item_name=" + element.dept_name.replace(/\s/g, '') + " user_id=" + element.dept_id + "><span class='name' dept_special=" + element.dept_id + "></span><span>" + element.dept_line + "</span><span class='real-name'>" + element.dept_name + "</span></div>")
                                                jQuery(".block-right-item[item_id='" + element.dept_id + "']").addClass("active");
                                                if (jQuery("input[name=" + jQuery(".alert-modal-box").data("to-id") + "]").val() == "ALL_DEPT") {
                                                      if (typeof (org_select_callbacks) == 'object') {
                                                            org_select_callbacks.remove && org_select_callbacks.remove.apply(this, ["ALL_DEPT", "全体部门"]);
                                                      }
                                                      userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-id")] = [];
                                                      userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-name")] = [];
                                                      jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-id").toString() + "]").val("");
                                                      jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val("");
                                                      jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val("");
                                                }
                                                if (typeof (org_select_callbacks) == 'object') {
                                                      org_select_callbacks.add && org_select_callbacks.add.apply(this, [element.dept_id, element.dept_name]);
                                                      jQuery("input#" + jQuery(".alert-modal-box").data("to-id")).parent().find("a.close").attr("data-to-id", jQuery(".alert-modal-box").data("to-id"));
                                                      jQuery("input#" + jQuery(".alert-modal-box").data("to-id")).parent().find("a.close").data("to-id", jQuery(".alert-modal-box").data("to-id"));
                                                      jQuery("input#" + jQuery(".alert-modal-box").data("to-id")).parent().find("a.close").attr("data-to-name", jQuery(".alert-modal-box").data("to-name"));
                                                      jQuery("input#" + jQuery(".alert-modal-box").data("to-id")).parent().find("a.close").data("to-name", jQuery(".alert-modal-box").data("to-name"));
                                                }
												var current = element.dept_id;
												var selected = userSaveAndBind[jQuery(".alert-modal-box").data("to-id")].toString() + ",";
												var findIt = includesUser(current, selected)
												if(findIt){
                                                      return;
                                                } else {
                                                      userSaveAndBind[jQuery(".alert-modal-box").data("to-id")].push(element.dept_id);
                                                      userSaveAndBind[jQuery(".alert-modal-box").data("to-name")].push(element.dept_name);
                                                }
                                          });
                                          jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-id").toString() + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-id")].toString() + ",");
                                          jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-name")].toString() + ",");
                                          jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-name")].toString() + ",");
                                    }
                              }
                        })
                  } else if (jQuery("div.alert-modal-box").attr("data-role") == "role") {
                        jQuery.ajax({
                              type: "POST",
                              url: jQuery("div.alert-modal-box").attr("data-ajax-url"),
                              data: {
                                    ACTION: "children",
                                    DEPT_ID: node.data.dept_id,
                                    CHECKED: true,
                                    FUNC_ID: jQuery(".alert-modal-box").data("func_id"),
                                    MODULE_ID: jQuery(".alert-modal-box").data("module_id"),
                                    PRIV_NO_FLAG: jQuery(".alert-modal-box").data("priv_no_flag"),
                                    MANAGE_FLAG: jQuery(".alert-modal-box").data("manage_flag"),
                                    USE_UID: jQuery(".alert-modal-box").data("use_uid"),
                                    PRIV_OP: jQuery(".alert-modal-box").data("priv_op")
                              },
                              dataType: "json",
                              success: function (msg) {
                                    if (msg.status == 0) {
                                          jQuery("#dept_item").children().hide();
                                          if (jQuery("#dept_item .message").length > 0) {
                                                jQuery("#dept_item .message").show();
                                          } else {
                                                jQuery("#dept_item").append("<div class='message'>" + msg.msg + "</div>");
                                          }
                                    } else if (msg.status == 1) {
                                          jQuery("#dept_item").children().hide();

                                          jQuery("#dept_item").append("<div class='block-right' id=dept_item_children_" + node.data.dept_id + "><div class='block-right-header' title=" + node.data.title + ">" + node.data.title + "</div><div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div></div>");
                                          jQuery.each(msg.data, function (index, element) {

                                                if (element.user_priv == undefined) {
                                                      jQuery("#dept_item #dept_item_children_" + node.data.dept_id).append("<div class='block-right-header' style='text-align:center;border-top:0px;border-radius:0em;'>" + element.name + "</div>");
                                                } else {
                                                      jQuery("#dept_item #dept_item_children_" + node.data.dept_id).append("<div class='block-right-item' item_id=" + element.user_priv + " item_name=" + element.priv_name.replace(/\s/g, '') + " user_id=" + element.user_priv + "><span class='name'></span><span class='real-name'>" + element.priv_name + "</span></div>")
                                                      jQuery(".block-right-item[item_name=" + element.priv_name.replace(/\s/g, '') + "]").addClass("active");
                                                      if (typeof (org_select_callbacks) == 'object') {
                                                            org_select_callbacks.add && org_select_callbacks.add.apply(this, [element.user_priv, element.priv_name]);
                                                            jQuery("input#" + jQuery(".alert-modal-box").data("to-id")).parent().find("a.close").attr("data-to-id", jQuery(".alert-modal-box").data("to-id"));
                                                            jQuery("input#" + jQuery(".alert-modal-box").data("to-id")).parent().find("a.close").data("to-id", jQuery(".alert-modal-box").data("to-id"));
                                                            jQuery("input#" + jQuery(".alert-modal-box").data("to-id")).parent().find("a.close").attr("data-to-name", jQuery(".alert-modal-box").data("to-name"));
                                                            jQuery("input#" + jQuery(".alert-modal-box").data("to-id")).parent().find("a.close").data("to-name", jQuery(".alert-modal-box").data("to-name"));
                                                      }
													  var current = element.user_priv;
														var selected = userSaveAndBind[jQuery(".alert-modal-box").data("to-id")].toString() + ",";
														var findIt = includesUser(current, selected)
														if(findIt){
                                                            return;
                                                      } else {
                                                            userSaveAndBind[jQuery(".alert-modal-box").data("to-id")].push(element.user_priv);
                                                            userSaveAndBind[jQuery(".alert-modal-box").data("to-name")].push(element.priv_name);
                                                      }
                                                }
                                          });
                                          jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-id").toString() + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-id")].toString() + ",");
                                          jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-name")].toString() + ",");
                                          jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-name")].toString() + ",");
                                    }
                              }
                        })
                  }
            } else {
                  if (jQuery("div.alert-modal-box").attr("data-select-user") == "selectuser" || jQuery("div.alert-modal-box").attr("data-normal") == "normal") {
                        if (jQuery(".alert-modal-box").data("use_uid") == 1) {
                              jQuery.ajax({
                                    type: "POST",
                                    url: jQuery("div.alert-modal-box").attr("data-ajax-url"),
                                    data: {
                                          ACTION: "children",
                                          DEPT_ID: node.data.dept_id,
                                          CHECKED: true,
                                          FUNC_ID: jQuery(".alert-modal-box").data("func_id"),
                                          MODULE_ID: jQuery(".alert-modal-box").data("module_id"),
                                          PRIV_NO_FLAG: jQuery(".alert-modal-box").data("priv_no_flag"),
                                          MANAGE_FLAG: jQuery(".alert-modal-box").data("manage_flag"),
                                          USE_UID: jQuery(".alert-modal-box").data("use_uid"),
                                          PRIV_OP: jQuery(".alert-modal-box").data("priv_op")
                                    },
                                    dataType: "json",
                                    success: function (msg) {
                                          if (msg.status == 0) {
                                                jQuery("#dept_item").children().hide();
                                                if (jQuery("#dept_item .message").length > 0) {
                                                      jQuery("#dept_item .message").show();
                                                } else {
                                                      jQuery("#dept_item").append("<div class='message'>" + msg.msg + "</div>");
                                                }
                                          } else if (msg.status == 1) {
                                                jQuery("#dept_item").children().hide();

                                                jQuery("#dept_item").append("<div class='block-right' id=dept_item_children_" + node.data.dept_id + "><div class='block-right-header' title=" + node.data.title + ">" + node.data.title + "</div><div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div></div>");
                                                jQuery.each(msg.data, function (index, element) {
                                                      if (element.uid == undefined) {
                                                            jQuery("#dept_item #dept_item_children_" + node.data.dept_id).append("<div class='block-right-header' style='text-align:left;border-top:0px;border-radius:0em;'>" + element.dept_line + element.dept_name + "</div>");
                                                      } else {
                                                            if (element.attend_status != "") {
                                                                  jQuery("#dept_item #dept_item_children_" + node.data.dept_id).append("<div class='block-right-item' item_id=" + element.uid + " item_name=" + element.user_name.replace(/\s/g, '') + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name' dept_special=\'" + element.user_id + "\'></span><span class='real-name'>" + element.user_name + "</span><span class='status'> (" + element.attend_status + ")</span></div>")
                                                            } else {
                                                                  jQuery("#dept_item #dept_item_children_" + node.data.dept_id).append("<div class='block-right-item' item_id=" + element.uid + " item_name=" + element.user_name.replace(/\s/g, '') + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name' dept_special=\'" + element.user_id + "\'></span><span class='real-name'>" + element.user_name + "</span></div>")
                                                            }
                                                            jQuery(".block-right-item[item_id='" + element.uid + "']").removeClass("active");
                                                            if (typeof (org_select_callbacks) == 'object') {
                                                                  org_select_callbacks.remove && org_select_callbacks.remove.apply(this, [element.uid, element.user_name]);
                                                            }
                                                            userSaveAndBind.removeByValue(userSaveAndBind[jQuery(".alert-modal-box").data("to-id")], element.uid);
                                                            userSaveAndBind.removeByValue(userSaveAndBind[jQuery(".alert-modal-box").data("to-name")], element.user_name);
                                                      }
                                                });
                                                jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-id").toString() + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-id")].toString() + ",");
                                                jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-name")].toString() + ",");
                                                jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").text(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-name")].toString() + ",");
                                                jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-name")].toString() + ",");
                                                if (jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-id").toString() + "]").val() == "," || jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val() == "," || jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val() == ",") {
                                                      jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-id").toString() + "]").val("");
                                                      jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val("");
                                                      jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").text("");
                                                      jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val("");
                                                }
                                          }
                                    }
                              })
                        } else {
                              jQuery.ajax({
                                    type: "POST",
                                    url: jQuery("div.alert-modal-box").attr("data-ajax-url"),
                                    data: {
                                          ACTION: "children",
                                          DEPT_ID: node.data.dept_id,
                                          CHECKED: true,
                                          FUNC_ID: jQuery(".alert-modal-box").data("func_id"),
                                          MODULE_ID: jQuery(".alert-modal-box").data("module_id"),
                                          PRIV_NO_FLAG: jQuery(".alert-modal-box").data("priv_no_flag"),
                                          MANAGE_FLAG: jQuery(".alert-modal-box").data("manage_flag"),
                                          USE_UID: jQuery(".alert-modal-box").data("use_uid"),
                                          PRIV_OP: jQuery(".alert-modal-box").data("priv_op")
                                    },
                                    dataType: "json",
                                    success: function (msg) {
                                          if (msg.status == 0) {
                                                jQuery("#dept_item").children().hide();
                                                if (jQuery("#dept_item .message").length > 0) {
                                                      jQuery("#dept_item .message").show();
                                                } else {
                                                      jQuery("#dept_item").append("<div class='message'>" + msg.msg + "</div>");
                                                }
                                          } else if (msg.status == 1) {
                                                jQuery("#dept_item").children().hide();

                                                jQuery("#dept_item").append("<div class='block-right' id=dept_item_children_" + node.data.dept_id + "><div class='block-right-header' title=" + node.data.title + ">" + node.data.title + "</div><div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div></div>");
                                                jQuery.each(msg.data, function (index, element) {
                                                      if (element.uid == undefined) {
                                                            jQuery("#dept_item #dept_item_children_" + node.data.dept_id).append("<div class='block-right-header' style='text-align:left;border-top:0px;border-radius:0em;'>" + element.dept_line + element.dept_name + "</div>");
                                                      } else {
                                                            if (element.attend_status != "") {
                                                                  jQuery("#dept_item #dept_item_children_" + node.data.dept_id).append("<div class='block-right-item' item_id=\'" + element.user_id + "\' item_name=" + element.user_name.replace(/\s/g, '') + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name' dept_special=\'" + element.user_id + "\'></span><span class='real-name'>" + element.user_name + "</span><span class='status'> (" + element.attend_status + ")</span></div>")
                                                            } else {
                                                                  jQuery("#dept_item #dept_item_children_" + node.data.dept_id).append("<div class='block-right-item' item_id=\'" + element.user_id + "\' item_name=" + element.user_name.replace(/\s/g, '') + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name' dept_special=\'" + element.user_id + "\'></span><span class='real-name'>" + element.user_name + "</span></div>")
                                                            }
                                                            jQuery(".block-right-item[item_id='" + element.user_id + "']").removeClass("active");
                                                            if (typeof (org_select_callbacks) == 'object') {
                                                                  org_select_callbacks.remove && org_select_callbacks.remove.apply(this, [element.user_id, element.user_name]);
                                                            }
                                                            userSaveAndBind.removeByValue(userSaveAndBind[jQuery(".alert-modal-box").data("to-id")], element.user_id);
                                                            userSaveAndBind.removeByValue(userSaveAndBind[jQuery(".alert-modal-box").data("to-name")], element.user_name);
                                                      }
                                                });
                                                jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-id").toString() + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-id")].toString() + ",");
                                                jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-name")].toString() + ",");
                                                jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").text(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-name")].toString() + ",");
                                                jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-name")].toString() + ",");
                                                if (jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-id").toString() + "]").val() == "," || jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val() == "," || jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val() == ",") {
                                                      jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-id").toString() + "]").val("");
                                                      jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val("");
                                                      jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").text("");
                                                      jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val("");
                                                }
                                          }
                                    }
                              })
                        }
                  } else if (jQuery("div.alert-modal-box").attr("data-select-dept") == "selectdept") {
                        jQuery.ajax({
                              type: "POST",
                              url: jQuery("div.alert-modal-box").attr("data-ajax-url"),
                              data: {
                                    ACTION: "children",
                                    DEPT_ID: node.data.dept_id,
                                    CHECKED: true,
                                    FUNC_ID: jQuery(".alert-modal-box").data("func_id"),
                                    MODULE_ID: jQuery(".alert-modal-box").data("module_id"),
                                    PRIV_NO_FLAG: jQuery(".alert-modal-box").data("priv_no_flag"),
                                    MANAGE_FLAG: jQuery(".alert-modal-box").data("manage_flag"),
                                    USE_UID: jQuery(".alert-modal-box").data("use_uid"),
                                    PRIV_OP: jQuery(".alert-modal-box").data("priv_op")
                              },
                              dataType: "json",
                              success: function (msg) {
                                    if (msg.status == 0) {
                                          jQuery("#dept_item").children().hide();
                                          if (jQuery("#dept_item .message").length > 0) {
                                                jQuery("#dept_item .message").show();
                                          } else {
                                                jQuery("#dept_item").append("<div class='message'>" + msg.msg + "</div>");
                                          }
                                    } else if (msg.status == 1) {
                                          jQuery("#dept_item").children().hide();
										  jQuery("#dept_item").append("<div class='block-right' id=dept_item_children_" + node.data.dept_id + "></div>");
										  if(msg.flag){
											jQuery("#dept_item_children_"+node.data.dept_id).append("<div class='block-right-alldept' item_id='ALL_DEPT' item_name='全体部门'>全体部门</div>");
										  }
										  jQuery("#dept_item_children_"+node.data.dept_id).append("<div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div>");
										  /*
                                          jQuery("#dept_item").append("<div class='block-right' id=dept_item_children_" + node.data.dept_id + "><div class='block-right-alldept' item_id='ALL_DEPT' item_name='全体部门'>全体部门</div><div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div></div>");
										  */
                                          jQuery.each(msg.data, function (index, element) {
                                                jQuery("#dept_item #dept_item_children_" + node.data.dept_id).append("<div class='block-right-item' item_id=" + element.dept_id + " item_name=" + element.dept_name.replace(/\s/g, '') + " user_id=" + element.dept_id + "><span class='name' dept_special=" + element.dept_id + "></span><span>" + element.dept_line + "</span><span class='real-name'>" + element.dept_name + "</span></div>")
                                                jQuery(".block-right-item[item_id='" + element.dept_id + "']").removeClass("active");
                                                if (typeof (org_select_callbacks) == 'object') {
                                                      org_select_callbacks.remove && org_select_callbacks.remove.apply(this, [element.dept_id, element.dept_name]);
                                                }
                                                userSaveAndBind.removeByValue(userSaveAndBind[jQuery(".alert-modal-box").data("to-id")], element.dept_id);
                                                userSaveAndBind.removeByValue(userSaveAndBind[jQuery(".alert-modal-box").data("to-name")], element.dept_name);
                                          });
                                          jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-id").toString() + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-id")].toString() + ",");
                                          jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-name")].toString() + ",");
                                          jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").text(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-name")].toString() + ",");
                                          jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-name")].toString() + ",");
                                          if (jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-id").toString() + "]").val() == "," || jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val() == "," || jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val() == ",") {
                                                jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-id").toString() + "]").val("");
                                                jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val("");
                                                jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").text("");
                                                jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val("");
                                          }
                                    }
                              }
                        })
                  } else if (jQuery("div.alert-modal-box").attr("data-role") == "role") {
                        jQuery.ajax({
                              type: "POST",
                              url: jQuery("div.alert-modal-box").attr("data-ajax-url"),
                              data: {
                                    ACTION: "children",
                                    DEPT_ID: node.data.dept_id,
                                    CHECKED: true,
                                    FUNC_ID: jQuery(".alert-modal-box").data("func_id"),
                                    MODULE_ID: jQuery(".alert-modal-box").data("module_id"),
                                    PRIV_NO_FLAG: jQuery(".alert-modal-box").data("priv_no_flag"),
                                    MANAGE_FLAG: jQuery(".alert-modal-box").data("manage_flag"),
                                    USE_UID: jQuery(".alert-modal-box").data("use_uid"),
                                    PRIV_OP: jQuery(".alert-modal-box").data("priv_op")
                              },
                              dataType: "json",
                              success: function (msg) {
                                    if (msg.status == 0) {
                                          jQuery("#dept_item").children().hide();
                                          if (jQuery("#dept_item .message").length > 0) {
                                                jQuery("#dept_item .message").show();
                                          } else {
                                                jQuery("#dept_item").append("<div class='message'>" + msg.msg + "</div>");
                                          }
                                    } else if (msg.status == 1) {
                                          jQuery("#dept_item").children().hide();

                                          jQuery("#dept_item").append("<div class='block-right' id=dept_item_children_" + node.data.dept_id + "><div class='block-right-header' title=" + node.data.title + ">" + node.data.title + "</div><div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div></div>");
                                          jQuery.each(msg.data, function (index, element) {

                                                if (element.user_priv == undefined) {
                                                      jQuery("#dept_item #dept_item_children_" + node.data.dept_id).append("<div class='block-right-header' style='text-align:center;border-top:0px;border-radius:0em;'>" + element.name + "</div>");
                                                } else {
                                                      jQuery("#dept_item #dept_item_children_" + node.data.dept_id).append("<div class='block-right-item' item_id=" + element.user_priv + " item_name=" + element.priv_name.replace(/\s/g, '') + " user_id=" + element.user_priv + "><span class='name'></span><span class='real-name'>" + element.priv_name + "</span></div>")
                                                      jQuery(".block-right-item[item_name=" + element.priv_name.replace(/\s/g, '') + "]").removeClass("active");
                                                      if (typeof (org_select_callbacks) == 'object') {
                                                            org_select_callbacks.remove && org_select_callbacks.remove.apply(this, [element.user_priv, element.priv_name]);
                                                      }
                                                      userSaveAndBind.removeByValue(userSaveAndBind[jQuery(".alert-modal-box").data("to-id")], element.user_priv);
                                                      userSaveAndBind.removeByValue(userSaveAndBind[jQuery(".alert-modal-box").data("to-name")], element.priv_name);
                                                }
                                          });
                                          jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-id").toString() + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-id")].toString() + ",");
                                          jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-name")].toString() + ",");
                                          jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").text(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-name")].toString() + ",");
                                          jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val(userSaveAndBind[jQuery("div.alert-modal-box").attr("data-to-name")].toString() + ",");
                                          if (jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-id").toString() + "]").val() == "," || jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val() == "," || jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val() == ",") {
                                                jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-id").toString() + "]").val("");
                                                jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val("");
                                                jQuery("textarea[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").text("");
                                                jQuery("input[name=" + jQuery("div.alert-modal-box").attr("data-to-name").toString() + "]").val("");
                                          }
                                    }
                              }
                        })
                  }
            }
      }
}

function get_client_type(client) {
      if (client == "0")
            return td_lang.inc.msg_86; //浏览��??"
      else if (client == "1")
            return td_lang.inc.msg_87; //"手机浏览��?"
      else if (client == "2")
            return td_lang.inc.msg_88; //"OA精灵"
      else if (client == "5")
            return td_lang.inc.msg_89; //"iPhone"
      else if (client == "6")
            return td_lang.inc.msg_90; //"Android"
      else
            return "";
}

function find_id(str, id) {
      return (str.indexOf(id + ",") == 0) || (str.indexOf("," + id + ",") > 0) ? 1 : 0;
}

function remove_nodes(nodes) {
      if (!nodes || !nodes.children) {
            nodes = null;
            return;
      }

      for (var i = 0; i < nodes.children.length; i++) {
            remove_nodes(nodes.children[i]);
      }

      nodes.children = null;
      nodes = null;
}

function XML() {
      this.lastError = 0;
      this.async = false;
      this.xmlDOM = null;
}

XML.prototype.loadFromURL = function (url) {
      var xhttp = this.newXMLHttpRequest();
      if (xhttp) {
            var xmlDOM = null;
            xhttp.open("GET", url, this.async);
            xhttp.onreadystatechange = function () {
                  if (xhttp.readyState == 4) {
                        xmlDOM = xhttp.responseXML;
                  }
            };
            xhttp.send(null);
            this.xmlDOM = xmlDOM;
      } else {
            this.xmlDOM = this.createXMLDom();
            if (this.xmlDOM) {
                  this.xmlDOM.async = this.async;
                  this.xmlDOM.load(url);

                  if (window.DOMParser)
                        this.lastError = this.xmlDOM.documentElement.childNodes[0].nodeValue;
                  else
                        this.lastError = this.xmlDOM.parseError.reason;
            }
      }
}

XML.prototype.loadFromString = function (str) {
      if (window.DOMParser) {
            var parser = new DOMParser();
            this.xmlDOM = parser.parseFromString(str, "text/xml");
            if (this.xmlDOM.documentElement.childNodes.length > 0)
                  this.lastError = this.xmlDOM.documentElement.childNodes[0].nodeValue;
      } else {
            this.xmlDOM = this.createXMLDom();
            if (this.xmlDOM) {
                  this.xmlDOM.async = this.async;
                  this.xmlDOM.loadXML(str);
                  this.lastError = this.xmlDOM.parseError.reason;
            } else {
                  this.lastError = "Create XMLDom Failed!";
            }
      }
}

XML.prototype.getRoot = function () {
      if (!this.xmlDOM || this.lastError)
            return null;

      return this.xmlDOM.documentElement; //xml文档根节��?
}

XML.prototype.createXMLDom = function () //创建XMLDOM对象函数，跨浏览器解决方��?
{
      if (window.ActiveXObject) //IE
      {
            var DomType = new Array("Microsoft.XMLDOM", "msxml.domdocument", "msxml2.domdocument", "msxml2.domdocument.3.0", "msxml2.domdocument.4.0", "msxml2.domdocument.5.0");
            for (var i = 0; i < DomType.length; i++) {
                  try {
                        var a = new ActiveXObject(DomType[i]);
                        if (!a) continue;
                        return a;
                  } catch (ex) {}
            }
      } else if (document.implementation && document.implementation.createDocument) //FireFox,Opera,safari
      {
            try {
                  return document.implementation.createDocument("", "", null);
            } catch (ex) {}
      } else {
            return null;
      }
}

XML.prototype.newXMLHttpRequest = function () {
      var a = null;
      if (window.XMLHttpRequest) // for IE7, Firefox, Opera, etc.
      {
            a = new XMLHttpRequest();
      } else if (window.ActiveXObject) // for IE6, IE5
      {
            a = new ActiveXObject("Msxml2.XMLHTTP");
            if (!a) {
                  a = new ActiveXObject("Microsoft.XMLHTTP");
            }
      }
      return a;
}
var closeWebview = function() {
    tMobileSDK.closeWebview();
};
var loading = false;



var getQueryParams = function() {
    var qs = location.search.length > 0 ? location.search.substr(1) : "",
        args = {},
        items = qs.length > 0 ? qs.split("&") : [],
        item = null,
        name = null,
        value = null,
        i = 0,
        len = items.length;
    for (i = 0; i < len; i++) {
        item = items[i].split("=");
        name = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1]);

        if (name.length) {
            args[name] = value;
        }
    }
    return args;
};
var addQueryStringToUrl = function(url, options) {
    if (!options) {
        return url;
    }
    var newUrl = url;
    if (newUrl.indexOf("?") === -1) {
        newUrl += "?";
    }
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            newUrl +=
                "&" +
                encodeURIComponent(key) +
                "=" +
                encodeURIComponent(options[key]);
        }
    }
    return newUrl;
};
var isReimbursement = false;
var toast = new Toast($("body"));
var tip = function(str) {
    toast.show(str);
};
function throttle(fn, delay) {
    var timer = null;
    return function() {
        var context = this,
            args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
            fn.apply(context, args);
        }, delay);
    };
}
$(document).ready(function() {
    tMobileSDK.ready(function() {
        var data = {
            l: {
                class: "",
                event: "closeWebview();",
                title: ""
            },
            c: {
                class: "",
                title: "联系人"
            },
            r: null
        };
        tMobileSDK.buildHeader(data);
        var createEmpty = function(text) {
            text = "暂无联系人";
            text ? null : (text = "暂无联系人");
            return (
                '<div class="empty"><img class="img" src="/pda/officeProduct/applylist/img/todo_nodata_icon@3x.png"/><div class="empty-text">' +
                text +
                "</div></div>"
            );
        };
        var back = function() {
            location.href = "/pda/addressList/list/";
        };
        window.back = back;
        var emptyStr = createEmpty();
        

        function trim(str) {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }
        
        
       
       
        var el = $(".tabs-wrap");
        
        $("#address-search").on("focus", function(e) {
            location.href =  "/pda/addressList/query/";
        });
       
        //遍历右边导航栏
        $(".navigationMenu").empty()
        var navigationMenuHtml="<span class='anchor' style='line-height: 8px;padding-top: 6px;'>*</span>";
        for(var i=65;i<91;i++){
            var  item=String.fromCharCode(i);
            navigationMenuHtml+="<span class='anchor' data-url="+item+">"+item+"</span>"
            $(".navigationMenu").html(navigationMenuHtml)

        }
        $(".navigationMenu ").on("tap","span",function (event) {
            var thisUrl = $(this).attr("data-url");
            console.log(thisUrl)
            if($("#"+thisUrl)){
                $("#"+thisUrl)[0].scrollIntoView()
            }

        })
        
        
        function fetchApplylist(opt) {
            var list = $(".apply-list");
            list.empty();
            var params = {
                ATYPE:"getPsnList"
            };
            if (opt) {
                params = $.extend(true, params, opt);
                params.InvoiceType = invoiceTypeArr.join(",");
            }
            new gmu.Alist({
                el: list,
                template: {
                    item: $("#works-list-tmpl").html()
                },
                enablePullUp: false,
                enablePullDown: false,
                url: "/mobile/address/data.php",
                baseParam: params,
                itemclick: function() {
                    $(".addressLists  .ui-list").unbind();
                    $(".addressLists  .ui-list").on(
                        "tap",
                        ".item",
                        function(e) {
                            var Q_ID = $(e.currentTarget).attr("data-id");
                            var tmp = {
                               Q_ID: Q_ID,
                            };
                            var url = addQueryStringToUrl(
                                "/pda/addressList/detail/",
                                tmp
                            );
                            location.href = url;
                        }
                    );
                },
           
                param: function(dir, type, oldParam, changeDir) {
                    var data = {};
                    switch (dir) {
                        case "up":
                          
                            changeDir("reload");
                            break;
                        case "down":
                            
                            break;
                        case "reload":
                            break;
                    }
                    return $.extend({}, this._options.baseParam, data);
                }
            });
        }
        fetchApplylist();
              
       

    });
});
// $("body").css("overflow", "hidden");

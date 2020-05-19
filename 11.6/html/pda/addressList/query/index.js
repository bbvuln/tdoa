var closeWebview = function() {
    tMobileSDK.closeWebview();
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
                title: "查询面板"
            },
            r: null
        };
        tMobileSDK.buildHeader(data);
        var el = $(".tabs-wrap");
        var keyword = "";

        var $searchIput = $("#apply-product-search");
        $searchIput.val("");
        var throttleFetchApplylist = throttle(fetchApplylist, 300);
        function trim(str) {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }
        $searchIput.on("input", function(e) {
            var inputVal = $searchIput.val();
            var preKeyword = keyword;
            if (preKeyword !== inputVal) {
                keyword = trim(inputVal);
            }
            throttleFetchApplylist();
        });

        function fetchApplylist() {
            var opt={
                key_word:keyword
            }
            opt.ATYPE="searchList";

            $.ajax({
                url: "/mobile/address/data.php",
                data: opt,
                type: "post",
                success: function(res) {
                    res=JSON.parse(res);

                    if(res.status=="error"){
                        if(res.msg=="nofinddata"){
                            var createEmpty = function(text) {
                                text = "暂无联系人";
                                text ? null : (text = "暂无联系人");
                                return (
                                    '<div class="empty"><img class="img" src="/pda/officeProduct/applylist/img/todo_nodata_icon@3x.png"/><div class="empty-text">' +
                                    text +
                                    "</div></div>"
                                );
                            };
                            $(".queryLists").empty().html(createEmpty())
                            return
                        }else{
                            
                        }

                    }else  {
                        var str=''
                        $.each(res, function(index,item) {
                             str+='<div class="item" data-id='+item.add_id+' >'+item.psn_name+'</div>   '
                        });
                        $(".queryLists").empty().html(str)
                        $(".queryLists  ").unbind();
                        $(".queryLists ").on(
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
                    }
                }
            });
        };
    });
});

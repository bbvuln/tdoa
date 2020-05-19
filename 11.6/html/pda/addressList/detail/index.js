$(document).ready(function() {
    tMobileSDK.ready(function() {
        var loading = false;
        

        var data = {
            l: {
                class: "",
                event: "history.back();",
                title: ""
            },
            c: {
                class: "",
                title: "联系人详情"
            },
            r: null
        };
        tMobileSDK.buildHeader(data);
        function getQueryParams() {
            var qs =
                    location.search.length > 0 ? location.search.substr(1) : "",
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
      
        
     
       
     
    
        var fetchDetail = function(param) {
            $.ajax({
                url: "/mobile/address/data.php",
                data: param,
                type: "post",

                success: function(data) {
                    if(data){
                        var res=JSON.parse(data);
                        $(".group_name").html(res.group_name)
                        $(".psn_name").html(res.psn_name)
                        $(".sex").html(res.sex)
                        $(".dept_long_name").html(res.dept_long_name)
                        $(".dept_name").html(res.dept_name)

                        $(".ministration").html(res.ministration)
                        $(".birthday").html(res.birthday)
                        $(".tel_no_dept").html(res.tel_no_dept)
                        $(".fax_no_dept").html(res.fax_no_dept)
                        $(".tel_no_home").html(res.tel_no_home)
                        $(".mobil_no").html(res.mobil_no)
                        $(".nick_name").html(res.nick_name)
                        $(".oicq_no").html(res.oicq_no)

                        $(".icq_no").html(res.icq_no)
                        $(".email").html(res.email)
                        $(".mate").html(res.mate)
                        $(".child").html(res.child)
                        $(".post_no_dept").html(res.post_no_dept)
                        $(".add_home").html(res.add_home)
                        $(".post_no_home").html(res.post_no_home)
                        $(".notes").html(res.notes)
                   
                    }

                },
                error: function(err) {
                    console.log(err);
                }
            });
        };
        var qsParams = getQueryParams();

        if (qsParams.Q_ID) {
            var tmp = {
                Q_ID: qsParams.Q_ID,
                ATYPE:"getDetail"         
             };
            fetchDetail(tmp);
            
        } else {
            // getScanResult();
        }
    });
});

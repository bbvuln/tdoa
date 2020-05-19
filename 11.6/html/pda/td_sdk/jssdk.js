$(document).ready(function(){
    tMobileSDK.ready(function(){
        var JsSdk = {
            init: function(){
                this.build()
                this.bindEvent();
            },
            build: function(){
                var buildFuncType = "td_header";
                var tBuildFunc = function(opts) {
                    try {tMobileSDK.buildFunc(opts);} catch(e) {alert(e.message)}
                };
                var tHeadData = {
                    "page_index": {
                        "l": {
                            "class": "",
                            "event": "history.back();",
                            "title": ""
                        },
                        "c":{
                            "title": "hey"
                        },
                        "r": {
                            "class": "",
                            "event": "showMenu(\"index_opts\")",
                            "title": "操作",
							"type": "icon",
							"onSearchChange": function(result){
								alert(result)
							}
                        }
                    }
                };
                window.showMenu = function(opts){
                    var d = tDropdownData;
                    d && opts && d[opts] && tBuildFunc( d[opts] );
                };
                window.tDropdownData = {
                    "index_opts": [
                        {
                            "title": "item1",
                            "event": "alert('item1')"
                        }
                    ]
                } ;
				alert(JSON.stringify(tHeadData['page_index']));
                tMobileSDK.buildHeader(tHeadData['page_index'])
            },
            bindEvent: function(){
				$('#openUrl').click(function(){
                    tMobileSDK.openUrl({
                        url: 'https://www.baidu.com',//打开新界面地址
                        onSuccess: function(result){//点击确定回调函数，返回值result是点击按钮的索引值
                        },
                        onFail: function(){}//点击取消回调函数，返回值err是错误信息
                    })
                });
				
                $('#confirm').click(function(){
                    tMobileSDK.confirm({
                        title: '提示',//弹窗标题
                        message: '天气好吗',//弹窗提示内容
                        buttonLabels: ['好','不好'],//弹窗底部确定和取消按钮文字
                        onSuccess: function(result){//点击确定回调函数，返回值result是点击按钮的索引值
                            //alert(result);
                        },
                        onFail: function(){}//点击取消回调函数，返回值err是错误信息
                    })
                });

                $('#toast').click(function(){
                    tMobileSDK.toast({
                        text: '成功',//提示文字，默认值是"发送成功"
                        duration: 5,//持续时间s
                        delay: 0,//延时s
                        onSuccess: function(){},
                        onFail: function(){}//返回值err是错误信息
                    })
                });
                $('#location').click(function(){
                    tMobileSDK.getLocation({
                        onSuccess: function(result){
                            alert(JSON.stringify(result));
                        },
                        onFail: function(){}//返回值err是错误信息
                    })
                });
                $('#call').click(function(){
                    var phoneNum = $('#phoneNum').val();
                    tMobileSDK.call({
                        phoneNum: phoneNum,//电话号码
                        onSuccess: function(){},
                        onFail: function(){}
                    });
                });

                $('#sendMessage').click(function(){
                    var phoneNums = $('#phoneNums').val();
                    phoneNums = phoneNums.split(',');
                    tMobileSDK.sendMessage({
                        phoneNums: phoneNums,//电话号码
                        content: 'hello td!!',//短信内容
                        onSuccess: function(){},
                        onFail: function(){}
                    });
                });

                $('#networkType').click(function(){
                    tMobileSDK.getNetworkType({
                        onSuccess: function(result){
                            alert(JSON.stringify(result));
                        },
                        onFail: function(){}
                    });
                });

                $('#chooseImage').click(function(){
                    tMobileSDK.chooseImage({
                        onSuccess: function(result){
                            //alert(result)
                            //alert(JSON.stringify(result));
                           try{
                                $.each(result,function(k, image){
                                    //var url = location.origin + image['url'];
									var url = image['url'];
                                    $('#imagelist').append('<a href="javascript:void(0);" is_image="1" _href="'+url+'" class="pda_attach"><img src="'+url+'" /></a>');
                                });
                            }catch(e){
                                alert(e);
                            }

                        },
                        onFail: function(){}
                    });
                });

                $('#selectFile').click(function(){
                    tMobileSDK.selectFile({
                        onSuccess: function(result){
                            //alert(JSON.stringify(result));
                            try{
                                $.each(result,function(k, file){
                                    var name = file['name'];
                                    name = name.substr(0,name.length-1);
                                    $('#filelist').append('<a href="javascript:void(0);" is_image="0" _href="'+file['url']+'" class="pda_attach"><span>'+name+'</span></a>');
                                });
                            }catch(e){
                                alert(e);
                            }
                        },
                        onFail: function(){}
                    });
                });

                $('#selectUser').click(function(){
                    tMobileSDK.selectUser({
                        onSuccess: function(result){
                            alert(JSON.stringify(result));
                        },
                        onFail: function(){}
                    });
                });

                $('#selectDept').click(function(){
                    tMobileSDK.selectDept({
                        onSuccess: function(result){
                            alert(JSON.stringify(result));
                        },
                        onFail: function(){}
                    });
                });

                $('#launchApp').click(function(){
                    tMobileSDK.launchApp({
                        app: 'com.android.calendar',
                        onSuccess: function(result){
                            alert(JSON.stringify(result));
                        },
                        onFail: function(){}
                    });
                });

                $('#getMacAddress').click(function(){
                    tMobileSDK.getMacAddress({
                        onSuccess: function(result){
                            alert(JSON.stringify(result));
                        },
                        onFail: function(){}
                    });
                });

                $('#getLocationByMap').click(function(){
                    tMobileSDK.getLocationByMap({
                        onSuccess: function(result){
                            alert(JSON.stringify(result));
                        },
                        onFail: function(){}
                    });
                });
				
				$('#scanQRCode').click(function(){
                    tMobileSDK.scanQRCode({
                        onSuccess: function(result){
                            alert(JSON.stringify(result));
                        },
                        onFail: function(){}
                    });
                });
            }
        }
        JsSdk.init();
        //
        // window.tDropdownData = {
        //     "index_opts": [
        //             {
        //                 "title": "详情页",
        //                 "event": "PageTo(\"page_detail\")"
        //             }
        //         ]
        //     } ;
        // var buildFuncType = "td_header";
        // var tBuildFunc = function(opts) {
        //     try {tMobileSDK.buildFunc(opts);} catch(e) {alert(e.message)}
        // };
        // window.showMenu = function(opts){
        //     var d = window.tDropdownData;
        //     d && opts && d[opts] && tBuildFunc( d[opts] );
        // };
        // window.PageBack = function(){
        //     pages.back();
        // }
        // window.PageTo = function(page_id){
        //     if(page_id == "page_index"){
        //         window.tDropdownData["index_opts"] = [
        //             {
        //                 "title": "详情页",
        //                 "event": "PageTo(\"page_detail\")"
        //             }
        //         ];
        //         pages.to('page_index');
        //     }else if(page_id == "page_detail"){
        //         window.tDropdownData["detail_opts"] = [
        //             {
        //                 "title": "动作1",
        //                 "event": "alert(1)"
        //             },
        //             {
        //                 "title": "动作2",
        //                 "event": "alert(2)"
        //             },
        //             {
        //                 "title": "动作3",
        //                 "event": "alert(3)"
        //             }
        //         ];
        //         pages.to('page_detail');
        //     }
        // };
        //
        // var tHeadData = {
        //     "page_index": {
        //         "l": {
        //             "class": "",
        //             "event": "history.back();",
        //             "title": ""
        //         },
        //         "c":{
        //             "title": "首页"
        //         },
        //         "r": {
        //             "class": "",
        //             "event": "showMenu(\"index_opts\")",
        //             "title": "操作"
        //         }
        //     },
        //     "page_detail": {
        //         "l": {
        //             "class": "",
        //             "event": "history.back();",
        //             "title": ""
        //         },
        //         "c": {
        //             "title": "详情页"
        //         },
        //         "r": {
        //             "class": "",
        //             "event": "showMenu(\"detail_opts\")",
        //             "title": "操作"
        //         }
        //     }
        // };
        //
        // callback = function(){};
        // window.pages = new gmu.Pages({
        //     el: $('#pages'),
        //     router: (function(data){
        //         var router = {};
        //         $.each(data, function(k, v){
        //             router[k] = callback;
        //         });
        //         return router;
        //     })(tHeadData),
        //     header: tHeadData,
        //     active: '#page_index'
        // });
    });
});

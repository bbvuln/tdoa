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
                            "title": "����",
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
                        url: 'https://www.baidu.com',//���½����ַ
                        onSuccess: function(result){//���ȷ���ص�����������ֵresult�ǵ����ť������ֵ
                        },
                        onFail: function(){}//���ȡ���ص�����������ֵerr�Ǵ�����Ϣ
                    })
                });
				
                $('#confirm').click(function(){
                    tMobileSDK.confirm({
                        title: '��ʾ',//��������
                        message: '��������',//������ʾ����
                        buttonLabels: ['��','����'],//�����ײ�ȷ����ȡ����ť����
                        onSuccess: function(result){//���ȷ���ص�����������ֵresult�ǵ����ť������ֵ
                            //alert(result);
                        },
                        onFail: function(){}//���ȡ���ص�����������ֵerr�Ǵ�����Ϣ
                    })
                });

                $('#toast').click(function(){
                    tMobileSDK.toast({
                        text: '�ɹ�',//��ʾ���֣�Ĭ��ֵ��"���ͳɹ�"
                        duration: 5,//����ʱ��s
                        delay: 0,//��ʱs
                        onSuccess: function(){},
                        onFail: function(){}//����ֵerr�Ǵ�����Ϣ
                    })
                });
                $('#location').click(function(){
                    tMobileSDK.getLocation({
                        onSuccess: function(result){
                            alert(JSON.stringify(result));
                        },
                        onFail: function(){}//����ֵerr�Ǵ�����Ϣ
                    })
                });
                $('#call').click(function(){
                    var phoneNum = $('#phoneNum').val();
                    tMobileSDK.call({
                        phoneNum: phoneNum,//�绰����
                        onSuccess: function(){},
                        onFail: function(){}
                    });
                });

                $('#sendMessage').click(function(){
                    var phoneNums = $('#phoneNums').val();
                    phoneNums = phoneNums.split(',');
                    tMobileSDK.sendMessage({
                        phoneNums: phoneNums,//�绰����
                        content: 'hello td!!',//��������
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
        //                 "title": "����ҳ",
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
        //                 "title": "����ҳ",
        //                 "event": "PageTo(\"page_detail\")"
        //             }
        //         ];
        //         pages.to('page_index');
        //     }else if(page_id == "page_detail"){
        //         window.tDropdownData["detail_opts"] = [
        //             {
        //                 "title": "����1",
        //                 "event": "alert(1)"
        //             },
        //             {
        //                 "title": "����2",
        //                 "event": "alert(2)"
        //             },
        //             {
        //                 "title": "����3",
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
        //             "title": "��ҳ"
        //         },
        //         "r": {
        //             "class": "",
        //             "event": "showMenu(\"index_opts\")",
        //             "title": "����"
        //         }
        //     },
        //     "page_detail": {
        //         "l": {
        //             "class": "",
        //             "event": "history.back();",
        //             "title": ""
        //         },
        //         "c": {
        //             "title": "����ҳ"
        //         },
        //         "r": {
        //             "class": "",
        //             "event": "showMenu(\"detail_opts\")",
        //             "title": "����"
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

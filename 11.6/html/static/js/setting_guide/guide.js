(function($)
{
    $(function()
    {	
        if($("#popPanel").length > 0)
        {
            $("#personlay").show();
            $("#guide-main").show();
        }
        $(".wizard").scrollable(
        {
            onSeek: function(event,i)
            {    
                $(".status li").removeClass("active").eq(i).addClass("active");
            },
            onBeforeSeek:function(event,i)
            {
                if(i==2)
                {						
                    var pass = $("#PASS0").val();
                    var pass1 = $("#PASS1").val();
                    var pass2 = $("#PASS2").val();
                    var SEC_PASS_MIN = $("#SEC_PASS_MIN").val();
                    var SEC_PASS_MAX = $("#SEC_PASS_MAX").val();
                    var SEC_PASS_SAFE = $("#SEC_PASS_SAFE").val();
                    
                    //if(pass!="")
                    //{
                        if(pass1!="" && pass2=="")
                        {
                            alert(td_lang.general.settingguide.msg_1);
                            return false;
                        }
                        if(pass1!=pass2)
                        {
                            alert(td_lang.general.settingguide.msg_2);
                            return false;
                        }
                        if((pass1!="" && pass2!="") && (pass1.length<SEC_PASS_MIN || pass2.length<SEC_PASS_MIN || pass1.length>SEC_PASS_MAX || pass2.length>SEC_PASS_MAX))
                        {
                            alert(td_lang.general.settingguide.msg_3+SEC_PASS_MIN+"-"+SEC_PASS_MAX+td_lang.general.settingguide.msg_4);
                            return false;
                        }
    
                        if(pass1.indexOf("\'")>0)
                        {
                            alert(td_lang.general.settingguide.msg_5);
                            return false;
                        }
    	                if(SEC_PASS_SAFE==1 && pass1!="" && (!pass1.match("[a-z]") || !pass1.match("[0-9]")))
    	                {
    	                    alert(td_lang.general.settingguide.msg_6);
    	                    return false;
    	                }    
                        if(pass1!="" && (pass==pass1))
                        {
                            alert(td_lang.general.settingguide.msg_7);
                            return false;
                        }
                    //}
                }
                if(i==3)
                {
                    var email= $.trim($("#EMAIL").val());
                    var tel = $("#TEL_NO_DEPT").val();
                    var mobil = $("#MOBIL_NO").val();
                    $("#EMAIL").val(email);
                    /*if(tel!="" || mobil!="")
                    {
                        var mobilExp = /^(1[0-9]{10})?$/;
                        var telExp = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
                        var telExp1 = /^(\d{7,8})?$/;
                        var telexp2 = /^(\d{7,8})(-(\d{3}))?$/;
                        
                        if(!tel.match(telExp) && !tel.match(mobilExp) && !tel.match(telExp1) &&!tel.match(telexp2))
                        {
                            alert(td_lang.general.settingguide.msg_9);
                            return false;
                        }
                        if(!mobil.match(mobilExp))
                        {
                            alert(td_lang.general.settingguide.msg_8);
                            return false;
                        }
                                                
                    }*/
                    if(email!="")
                    {
                        //var emailExp = /[a-zA-Z0-9._%-]+@[a-zA-Z0-9._%-]+\.[a-zA-Z]{2,4}/;
                        var emailExp = /^(([0-9a-zA-Z]+)|([0-9a-zA-Z]+[_.0-9a-zA-Z-]*[0-9a-zA-Z-]+))@([a-zA-Z0-9-]+[.])+([a-zA-Z]{2,3}|net|NET|asia|ASIA|com|COM|gov|GOV|mil|MIL|org|ORG|edu|EDU|int|INT|cn|CN|cc|CC|tw|TW|hk|HK)$/;
                        if(!email.match(emailExp))
                        {
                            alert(td_lang.general.settingguide.msg_10);
                            return false;
                        }
                    }
                    if(window.uploader && window.uploader1){
                    }else{
                        if(window.initUpload){
                            initUpload();
                        }
                    }
                }	
            }
        });
        $(".theme-class a.theme-setting").bind("click",function()
        {
            var index = $(this).attr("index");
            $("#THEME_VALUE").val(index);
            $(".theme-class a").removeClass("current");
            $(this).addClass("current");
        });
        				
        $("#a_close,.cancle").click(function()
        {
            var data1=$("form").serialize();
             
            var pass = $("#PASS0").val();
            var pass1 = $("#PASS1").val();
            var pass2 = $("#PASS2").val();
            var SEC_PASS_MIN = $("#SEC_PASS_MIN").val();
            var SEC_PASS_MAX = $("#SEC_PASS_MAX").val();
            var SEC_PASS_SAFE = $("#SEC_PASS_SAFE").val();
            var email=$("#EMAIL").val();
            var tel = $("#TEL_NO_DEPT").val();
            var mobil = $("#MOBIL_NO").val();
            var photo = $("#PHOTO3").val();
            var avatar = $("#AVATAR3").val();
            
            $.get("/general/setting_guide/ismodify.php",data1,function(flag)
            {
                if(flag=="1")
                {
                    if(window.confirm(td_lang.general.settingguide.msg_11))
                    {
                        /*
                        if(tel!="" || mobil!="")
                        {
                            var mobilExp = /^(1[0-9]{10})?$/;
                            var telExp = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
                            var telExp1 = /^(\d{7,8})?$/;
                            var telexp2 = /^(\d{7,8})(-(\d{3}))?$/;
                            
                            if(!tel.match(telExp) && !tel.match(mobilExp) && !tel.match(telExp1) &&!tel.match(telexp2))
                            {
                                alert(td_lang.general.settingguide.msg_9);
                                return false;
                            }
                            if(!mobil.match(mobilExp))
                            {
                                alert(td_lang.general.settingguide.msg_8);
                                return false;
                            }                                                    
                        }*/
                        if(email!="")
                        {
                            //var emailExp = /[a-zA-Z0-9._%-]+@[a-zA-Z0-9._%-]+\.[a-zA-Z]{2,4}/;
                            var emailExp = /^(([0-9a-zA-Z]+)|([0-9a-zA-Z]+[_.0-9a-zA-Z-]*[0-9a-zA-Z-]+))@([a-zA-Z0-9-]+[.])+([a-zA-Z]{2,3}|net|NET|asia|ASIA|com|COM|gov|GOV|mil|MIL|org|ORG|edu|EDU|int|INT|cn|CN|cc|CC|tw|TW|hk|HK)$/;
                            if(!email.match(emailExp))
                            {
                                alert(td_lang.general.settingguide.msg_10);
                                return false;
                            }
                        }
                        
                        $.get("/general/setting_guide/update.php",data1,function(flag)
                        {
                            if(flag=="ok")
                            {
                                alert(td_lang.general.settingguide.msg_12); 
                                $("#guide-main").hide();
                                $("#personlay").hide();
                                //parent.parent.parent.location.reload()
                            }	
                            else
                            {
                                alert(flag);
                            }				
                        });
                    }else
                    {
                        $.get("/general/setting_guide/ismodify.php",{PHOTO:$("#PHOTO2").val(),AVATAR:$("#AVATAR2").val(),op:3},function(flag){
                                                    
                        })
                        $("#guide-main").hide();
                        $("#personlay").hide();
                    }
                }else
                {
                    if(window.confirm(td_lang.general.settingguide.msg_13))
                    {
                        $("#guide-main").hide();
                        $("#personlay").hide(); 
                    }else
                    {}
                }
                $('#default-avatar').attr('src','/static/modules/setting_guide/images/4_02.png');   
                $('#default-avatar1').attr('src','/static/modules/setting_guide/images/4_03.png');  
            });                       
        });
        $(".second-content span a").bind("click",function()
        {
            var data1=$("form").serialize();
            //$("#a1").attr({href:"/general/person_info",target:"_blank"});
            if(location.href.match('/general/person_info')) 
            {
                $("#guide-main").hide();
                $("#personlay").hide();
                return false;
            }  
        });
        		
        $("#sub").click(function()
        {
            var data1=$("form").serialize();
            $("#submit").css("display","block");
            $("#failed").css("display","none");
            $("#success").css("display","none");
                $.get("/general/setting_guide/update.php",data1,function(flag)
                {
                    if(flag=="ok")
                    {
                        $("#success").css("display","block");
                        $("#submit").css("display","none");
                        $("#failed").css("display","none");
                        //alert("修改成功");
                        //$("#a1").attr({href:"/general/person_info",target:"_blank"}); 
                    }	
                    else
                    {
                        $("#failed").css("display","block");
                        $("#success").css("display","none");
                        $("#submit").css("display","none");
                        //alert(flag);
                    }				
                }); 
                $('#default-avatar').attr('src','/static/modules/setting_guide/images/4_02.png');   
                $('#default-avatar1').attr('src','/static/modules/setting_guide/images/4_03.png');   
        });	
        $("#sub1").bind("click",function()
        {
            $("#guide-main").hide();
            $("#personlay").hide();
        });

        $("#PASS0").bind("blur",function(){
            $.get("/general/setting_guide/ismodify.php",{PASS0:$("#PASS0").val(),op:1},function(data){
                if(data==0)
                {
                    alert(td_lang.general.settingguide.msg_14);
                    //$("#PASS0").focus();
                }
            });
        });
        $("#NICK_NAME").bind("blur",function(){
            $.get("/general/setting_guide/ismodify.php",{NICK_NAME:$("#NICK_NAME").val(),op:2},function(data){
                if(data!="OK")
                {
                    alert(data);
                }
            });
        });
        			
    });	
})(jQuery);

//-- 个人设置向导显示
function setting_guide(from_type)
{
    if(from_type == 0)
    {
        document.getElementById("show_guide_content").style.display="none";
        document.getElementById("show_guide_back").style.display="none";
    }
    document.getElementById("guide").style.display="block";
    document.getElementById("guide-main").style.display="block";
    document.getElementById("personlay").style.display="block";    
    jQuery("#guide-main").css({"position":"absolute","top":"50%","left":"50%","margin-top":"-220px","margin-left":"-340px"});
    jQuery(".wizard").scrollable().begin(0);
}
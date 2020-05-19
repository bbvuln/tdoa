<?
include_once("inc/auth.inc.php");
include_once("inc/utility_all.php");
ob_end_clean();
//根据TC_ID和remind_id查找对应记录  create tl 2014-08-08 

if($remind_id!="")
{
   $query="select * from reminders where ID='$remind_id'";
   $cursor= exequery(TD::conn(),$query);
   if($ROW=mysql_fetch_array($cursor))
   {
        $ID           = $ROW['ID'];
        $USER_ID      = $ROW['USER_ID'];
        $APPOINT_TIME = $ROW['APPOINT_TIME'];
        $TYPE         = $ROW['TYPE'];
        $REMIND_DATE  = $ROW['REMIND_DATE'];
        $REMIND_TIME  = $ROW['REMIND_TIME'];
        $TITLE        = $ROW['TITLE'];
        $CONTENT      = $ROW['CONTENT'];
        $ADD_TIME     = $ROW['ADD_TIME'];
        $CLASSIFY     = $ROW['CLASSIFY'];
        $STATUS       = $ROW['STATUS'];
        
        $query1="select TCID from taskcenter where SOURCEID='".$ID."' and CATAGORY='REMINDERS'";
        
        $cursor1= exequery(TD::conn(),$query1);
        if($ROW1=mysql_fetch_array($cursor1))
        {
            $tcid = $ROW1['TCID'];
        }
        
        if($APPOINT_TIME != "" && $APPOINT_TIME != "NULL" && $APPOINT_TIME != 0)
        {
            //提醒时间不为空
            $CHECKED = "checked";
            //提醒年月日
            $APPOINT_DATE = date("Y-m-d",$APPOINT_TIME); 
            $APPOINT_HOUR = date("H",$APPOINT_TIME);
            $APPOINT_MINUTE = date("i",$APPOINT_TIME);
            //提醒时分
            $APPOINT_TIME = $APPOINT_HOUR.":".$APPOINT_MINUTE;
        }
        else
		{
		    $CHECKED = "";
			$APPOINT_DATE = date("Y-m-d",time()); 
			$APPOINT_HOUR = date("H",time());
            $APPOINT_MINUTE = date("i",time());
			if( $APPOINT_MINUTE > "30")
			{
                $APPOINT_HOUR = date("H",strtotime('+1 hours'));
                $APPOINT_MINUTE = "00";
            }else
			{
                $APPOINT_MINUTE = "30";
            }			
            
            $APPOINT_TIME = $APPOINT_HOUR.":".$APPOINT_MINUTE ;
        }
        //重复为空，默认重复时间
        if($TYPE == ""){
            $REMIND_HOUR = date("H",time());
            $REMIND_MINUTE = date("i",time());
			if( $REMIND_MINUTE > "30")
			{
                $REMIND_HOUR = date("H",strtotime('+1 hours'));
                $REMIND_MINUTE = "00";
            }else
			{
                $REMIND_MINUTE = "30";
            }			
            $REMIND_TIME = $REMIND_HOUR.":".$REMIND_MINUTE ;
        }
        
        //重复类型按年重复
        if($TYPE == 5 && $REMIND_DATE!=""){
            $REMIND_ARR = explode("-",$REMIND_DATE);
            $REMIND_MONTH = $REMIND_ARR[0];
            $REMIND_DAY = $REMIND_ARR[1];
        }
   }
   else
     exit;
}
?>
<form method="post" class="form-horizontal" name="form1" style="overflow-y: auto;overflow-x:hidden;padding: 15px 0px;margin-bottom: 0px;max-height:218px;">  
    <input type="hidden" id="remind_type" value="<?=$TYPE?>" />
    <input type="hidden" id="tcid" value="<?=$tcid?>" />           
    <input type="hidden" id="remindModal" modal_id="<?=$remind_id?>" />
    <div class="control-group" id="title-warn">
        <label class="control-label" id="remindTitle" for="inputError">标题：</label>
        <div class="controls">
            <input type="text" id="remind-title" name="title" value="<?=$TITLE?>">
            <span class="help-inline hide"  id="remind-title-help">请输入标题。</span>
        </div>
    </div>
    <div class="control-group">
        <div class="controls">
            <label class="checkbox inline">
                <input type="checkbox" id="fixed-date" name="fixed-date" value="fixed-date" <? if($CHECKED == "checked") echo "checked"; ?> > 指定日期
            </label>   
            <label class="checkbox inline hide" id="remind-repeat-lable" style="display: <? if($CHECKED == "checked") echo "inline-block";?>">
                <input type="checkbox" id="remind-repeat" name="repeat" value="repeat" <? if($TYPE != "") echo "checked"; ?>> 重复
            </label>
        </div>
    </div>	
    <div class="remindtime control-group hide" id="remind-time" style="display: <? if($CHECKED == "checked") echo "block";?>">
        <label class="control-label">提醒时间：</label>
        <div class="controls">
            <input name="appoint_date" id="appoint_date" class="timepadding input input-small" placeholder="提醒日期" type="text" value="<?=$APPOINT_DATE?>">
            <span class="bootstrap-timepicker">
                <input name="appoint_time" id="appoint_time" class="input input-mini calendar-remindtime valtype" placeholder="" type="text"  value="<?=$APPOINT_TIME?>">
            </span> 
            <span class="help-inline hide"  id="appoint-help">日期不正确。</span>   
        </div>                        
    </div>
    <div id="repeatType1" class="hide" style="display: <? if($TYPE != "") echo "block"; ?>">
        <div class="control-group" id="remind-repeat-option">
            <label class="control-label">重复时间：</label>
            <div class="controls">
                <select class="span2" id="TYPE">
                    <option value="2" <? if($TYPE == "2") echo "selected" ?>>按天重复</option>
                    <option value="3" <? if($TYPE == "3") echo "selected" ?>>按周重复</option>
                    <option value="4" <? if($TYPE == "4") echo "selected" ?>>按月重复</option>
                    <option value="5" <? if($TYPE == "5") echo "selected" ?>>按年重复</option>
                    <option value="6" <? if($TYPE == "6") echo "selected" ?>>按工作日重复</option>
                </select>
    
            </div>
        </div>
        <div class="control-group dropup" id="repeat2" data-repeat-type="2" style="display:<? if($TYPE != "" && $TYPE != "2") echo "none";?>">
            <label class="control-label">重复时间：</label>
            <div class="controls">
                <span class="bootstrap-timepicker">
                    <input id="remind-time-2" name="remind-time-2" class="input input-mini calendar-remindtime" placeholder="" type="text"  value="<?=$REMIND_TIME?>">
                </span>
            </div>
        </div>

        <div class="control-group repeatTime dropup hide" id="repeat3" data-repeat-type="3" style="display:<? if($TYPE == "3") echo "block";?>">
            <label class="control-label">重复时间：</label>
            <div class="controls">
                <select class="select-small" id="remind-date-3">
                    <option value="1" <? if($REMIND_DATE == "1") echo "selected";?>>星期一</option>
                    <option value="2" <? if($REMIND_DATE == "2") echo "selected";?>>星期二</option>
                    <option value="3" <? if($REMIND_DATE == "3") echo "selected";?>>星期三</option>
                    <option value="4" <? if($REMIND_DATE == "4") echo "selected";?>>星期四</option>
                    <option value="5" <? if($REMIND_DATE == "5") echo "selected";?>>星期五</option>
                    <option value="6" <? if($REMIND_DATE == "6") echo "selected";?>>星期六</option>
                    <option value="0" <? if($REMIND_DATE == "0") echo "selected";?>>星期日</option>
                </select>
                <span class="bootstrap-timepicker">
                    <input id="remind-time-3" name="remind-time-3" class="input input-mini calendar-remindtime" placeholder="" type="text"  value="<?=$REMIND_TIME?>">
                </span>
            </div>    
        </div>

        <div class="control-group repeatTime dropup hide" id="repeat4" data-repeat-type="4" style="display:<? if($TYPE == "4") echo "block";?>">
            <label class="control-label">重复时间：</label>
            <div class="controls">
                <select class="select-small" id="remind-day-4">
                    <?
                    for($I=1;$I<=31;$I++)
                    {
                    ?>
                    <option value="<?=$I?>" <? if($REMIND_DATE==$I) echo "selected";?>><?=$I?><?=_("日")?></option>
                    <?
                    }
                    ?>    
                </select>
                <span class="bootstrap-timepicker">
                    <input id="remind-time-4" class="input input-mini calendar-remindtime" placeholder="" type="text" value="<?=$REMIND_TIME?>">
                </span>
            </div>
        </div>

        <div class="control-group repeatTime dropup hide" id="repeat5" data-repeat-type="5" style="display:<? if($TYPE == "5") echo "block";?>">
            <label class="control-label">重复时间：</label>
            <div class="controls">
                <select class="select-small" id="remind-month-5">
                    <?
                    for($I=1;$I<=12;$I++)
                    {
                    ?>
                        <option value="<?=$I?>" <? if($REMIND_MONTH==$I) echo "selected";?>><?=$I?><?=_("月")?></option>
                    <?
                    }
                    ?>
                </select>
                <select class="select-small" id="remind-day-5">
                    <?
                    for($I=1;$I<=31;$I++)
                    {
                    ?>
                         <option value="<?=$I?>" <? if($REMIND_DAY==$I) echo "selected";?>><?=$I?><?=_("日")?></option>
                    <?
                    }
                    ?>
                </select>
                <span class="bootstrap-timepicker">
                    <input id="remind-time-5" class="input input-mini calendar-remindtime" placeholder="" type="text"  value="<?=$REMIND_TIME?>">
                </span>
            </div>
        </div>

        <div class="control-group repeatTime dropup hide" id="repeat6" data-repeat-type="6" style="display:<? if($TYPE == "6") echo "block";?>">
            <label class="control-label">重复时间：</label>
            <div class="controls">
                <span class="bootstrap-timepicker">
                    <input id="remind-time-6" class="input input-mini calendar-remindtime" placeholder="" type="text"  value="<?=$REMIND_TIME?>">
                </span>
            </div>
        </div>

    </div>
    <div class="control-group">
        <label class="control-label" for="remarks">备忘：</label>
        <div class="controls">
            <textarea cols="50" rows="4" class="input" name="remarks" style=" width: 206px; " id="remarks"><?=$CONTENT?></textarea>
        </div>
    </div>		         
</form>		

<div class="modal-footer">	  	  			 	
  	<button class="btn btn-small btn-primary" type="button" id="remind_submit">确定</button>
  	<button class="btn" type="button" data-dismiss="modal" aria-hidden="true">取消</button>  
</div>
<script>
jQuery.noConflict();
(function($){ 
    $(function(){
        var dateLangConfigs = {
        	monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
            monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
            dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
            dayNamesShort: ['日','一','二','三','四','五','六']
        };
        $.fn.datepicker.dates = {
        		days: dateLangConfigs['dayNames'],
        		daysShort: dateLangConfigs['dayNamesShort'],
        		daysMin: dateLangConfigs['dayNamesShort'],
        		months: dateLangConfigs['monthNames'],
        		monthsShort: dateLangConfigs['monthNamesShort']
        };
        $('#appoint_date').datepicker({
           format: "yyyy-m-d"
        }); 
        
        $('.calendar-remindtime').timepicker({ 
           minuteStep: 10,
           showMeridian : false
        });
        //标题为空判断
        $('#remind-title').blur(function(){
            var isEmpty = this.value == "";
            $('#remind-title-help')[ isEmpty ? 'show' : 'hide' ]();
            $('#title-warn')[ isEmpty ? 'addClass' : 'removeClass']('error');  	
        });
    
        //提醒时间判断
        $('#appoint_date').focus(function(){
            $('#appoint-help').hide();
            $('#remind-time').removeClass('error'); 
        });
        $('#appoint_date').blur(function(){
            var _date = $('#appoint_date').val() + " "+ $('#appoint_time').val();
            var _time = _date.replace(' ','-').replace(':','-');
            var _arr = _time.split('-');
            var _timer = Date.UTC(_arr[0],(_arr[1]-1),_arr[2],(_arr[3]),(_arr[4]),0);
            if(_timer < $.now()){     
                $('#appoint-help').show();
                $('#remind-time').addClass('error');  	
            }else{
                $('#appoint-help').hide();
                $('#remind-time').removeClass('error'); 
            }   	
        });
        //指定日期切换 edit tl 2014-08-08
        $('#fixed-date').change(function(){
            var isChecked = $(this).prop('checked') == "";
            if(isChecked){
                $('#remind-time').hide();
                $('#remind-repeat-lable').hide();
            }
            else{
                $('#remind-time').show();
                $('#remind-repeat-lable').css("display","inline-block");
            }
            var repeatcheck = $('#remind-repeat').prop('checked');
            if(repeatcheck == true){
                $('#remind-repeat').click();
                //$('#TYPE option:selected').removeAttr('selected');
                //$("#TYPE").trigger("change","2");
                $('#repeatType1').hide();
            }
        });
    
        //重复check切换 edit tl 2014-08-08
        $('#remind-repeat').change(function(){
            var ischecked = $(this).prop('checked');
            if (ischecked) 
            {
                $('#repeatType1').show();
            } 
            else 
            {
                $('#repeatType1').hide();
            }
        });
        //重复时间判断
        $('#TYPE').change(function(){
            var value = $(this).find('option:selected').val();
            $('[data-repeat-type]').hide().filter('[data-repeat-type = "' + value + '"]').show();
            var remind_type = $('#remind_type').val();
            switch (value)
            {
                case "3":
                    if(remind_type != "3"){//不为按周重复
                        var weekday = new Date().getDay();          
                        $("#remind-date-3 option[value='"+weekday+"'").attr("selected",true);
                    }
                    break;
                case "4":
                    if(remind_type != "4"){
                        var curday = new Date().getDate();          
                        $("#remind-day-4 option[value='"+curday+"'").attr("selected",true);
                    }
                    break;
                case "5":
                    if(remind_type != "5"){
                        var curmonth = new Date().getMonth()+1; 
                        var curday = new Date().getDate();          
                        $("#remind-month-5 option[value='"+curmonth+"'").attr("selected",true);
                        $("#remind-day-5 option[value='"+curday+"'").attr("selected",true);
                    }
                    break;
            }
        });


        $('#remind_submit').click(function(){
            var title = $('#remind-title').val();
            content = $('[name="remarks"]').val();
            var id = $('#remindModal').attr('modal_id');

            if(title == ""){
                $('#remind-title-help').show();
                $('#title-warn').addClass('error');
                return;  	            
            }else{
                var ischeck = $('#fixed-date').prop('checked');
                if(ischeck){
                    if($('#appoint_date').val() != "" && $('#appoint_time').val() != ""){
                        var _date = $('#appoint_date').val() + " "+ $('#appoint_time').val(),
                            _time = _date.replace(' ','-').replace(':','-'),
                            _arr = _time.split('-'),
                            _timer = Date.UTC(_arr[0],(_arr[1]-1),_arr[2],(_arr[3]),(_arr[4]),0);
                        if(_timer < $.now()){
                            $('#appoint_date').trigger('blur');
                            return;//提醒时间早于当前不保存
                        } else {
                            var appoint_time = $('#appoint_date').val()+" "+$('#appoint_time').val(),
                                remind_type = $('#TYPE').val(),
                                remind_date = "",
                                remind_time = "",
                                tcid = $('#tcid').val(),
                                fixeddate = $('#fixed-date').prop('checked'),
                                repeat = $('#remind-repeat').prop('checked');  
                            if(fixeddate == false){
                                //保存时未选中指定日期
                                appoint_time = "";  
                                remind_type = "";
                                remind_date = "";
                                remind_time = "00:00:00";
                            } else {
                                //保存时选中指定日期
                                if(repeat == false){
                                    remind_type = "";
                                    remind_date = "";
                                    remind_time = "00:00:00";
                                } else {
                                    switch(remind_type){
                                        case "2": 
                                            remind_time = $('#remind-time-2').val();
                                            break;
                                        case "3": 
                                            remind_date = $('#remind-date-3').find('option:selected').val();;
                                            remind_time = $('#remind-time-3').val();
                                            break;  
                                        case "4": 
                                            remind_date = $('#remind-day-4').find('option:selected').val();
                                            remind_time = $('#remind-time-4').val();
                                            break;
                                        case "5": 
                                            remind_month = $('#remind-month-5').find('option:selected').val();
                                            remind_date = $('#remind-day-5').find('option:selected').val();
                                            remind_date = remind_month+"-"+remind_date;
                                            remind_time = $('#remind-time-5').val();
                                            break;
                                        case "6": 
                                            remind_time = $('#remind-time-6').val();
                                            break;
                                    }
                                }
                            }
                            $.ajax({
                                url:'setReminder.php',
                                data: {
                                    id: id,
                                    tcid: tcid,
                                    action: "update",
                                    title: encodeURIComponent(title),
                                    appoint_time: appoint_time, 
                                    type: remind_type, 
                                    remind_date: remind_date,
                                    remind_time: remind_time,
                                    content: encodeURIComponent(content)
                                },
                                async: true,
                                type: 'get',
                                success:function(ret){
                                    getCount();
                                    jQuery('#reminder').trigger("click");
                                    $("#task-modal").modal('hide');
                                }                    
                            });
                            return;
                        }
                    }
                    
                }else{
                    $('#appoint_date').val('');
                    $('#appoint_time').val('');
                }
                $.ajax({
                    url:'setReminder.php',
                    data: {
                        id: id,
                        tcid: tcid,
                        action: "update",
                        title: encodeURIComponent(title),
                        content: encodeURIComponent(content)
                    },
                    async: true,
                    type: 'get',
                    success:function(ret){
                        getCount();
                        jQuery('#reminder').trigger("click");
                        $("#task-modal").modal('hide');
                    }
                });
            }
        })
    });
})(jQuery);
</script>
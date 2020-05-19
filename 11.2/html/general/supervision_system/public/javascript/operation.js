(function ($) {
    $(function () {
        $("#work_back").on('click', function () {
            $.layer({
                type: 2,
                shade: [0.1, '#000'],
                fix: false,
                title: '<b>��������</b>',
                maxmin: true,
                iframe: {src: 'feedback/feedback.php'},
                area: ['1000px', '500px']
            });

        });
        $("#work_instructions").on('click', function () {
            $.layer({
                type: 2,
                shade: [0.1, '#000'],
                fix: false,
                title: '<b>��ʾ���</b>',
                maxmin: true,
                iframe: {src: 'instructions/work_instructions.php'},
                area: ['1000px', '500px']
            });
        });
        $("#taskChange").on('click',function(){
            $.layer({
                type: 2,
                shade: [0.1, '#000'],
                fix: false,
                title: '<b>������</b>',
                maxmin: true,
                iframe: {src: 'change/task_change.php'},
                area: ['1000px', '500px']
            });
        });
        $("#taskApprove").on('click',function(){
            $.layer({
                type: 2,
                shade: [0.1, '#000'],
                fix: false,
                title: '<b>����������</b>',
                maxmin: true,
                iframe: {src: 'change/change_approve.php'},
                area: ['1000px', '500px']
            });
        });


        $("#select3").dblclick('dblclick',function (){
            option_move('select3', 'select4');
        });
        $("#select4").dblclick('dblclick',function (){
            option_move('select4', 'select3');
        });
    });

})(jQuery);
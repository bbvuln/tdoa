var tasks = [];
var panels = [];
var task = {};

var myTasksManager = {
	init: function(){
	    this.dataType = "todo";//Ĭ��δ��ɵ�
	    this.tasks = [];//�������� ƽ������
	    this.panelsData = [];//��δ��ɡ��Ҵ������Ҳ��롢����ɷ���
	    this.getData();
		this.bindEvent();
	},
	getData: function(){
	    //������������
	    var self = this;
        $.get("/mobile/kanban/get_tasks.php?P="+P,{},function(ret){
            var ret = JSON.parse(ret);
            if(ret.status == "1"){
                self.tasks = ret.data;
                self.filterData();//��δ��ɡ��Ҵ������Ҳ��롢����ɷ���
	            self.renderData();//���ݵ�ǰdataType��״̬�����            
            }
        });   
	},
	filterData: function(){
	    //console.log(this.tasks);
	    //��δ��ɡ��Ҵ������Ҳ��롢����ɹ���
        var self = this,
            panelsData = {
                'todo': [],
                'created': [],
                'joined': [],
                'done': []
            };
        
        $.each(self.tasks, function(key, task){
            
            //�Ҵ�����
            if(task.creator.uid == login_uid){
                panelsData.created.push(task);
            }
            //�Ҳ����
            var isJoined = false;
            $.each(task.member, function(k, user){
                if(user.uid == login_uid){
                    isJoined = true;
                    return false;
                }
            });
            if(task.executor.uid == login_uid){
                 isJoined = true;
            }
            if(isJoined){
                panelsData.joined.push(task);
            }
            
            //δ��ɵ�
            if(task.status == "0" && isJoined){
                panelsData.todo.push(task);
            }
            
            //����ɵ�
            if((task.status == "1" || task.status == "2") && isJoined){
                
                panelsData.done.push(task);
            }
        });
        self.panelsData = panelsData;
	},
	renderData: function(){
	    //������Ⱦ�ĸ����
	    var self       = this,
	        renderData = [];
	    console.log('��������',this.tasks);
	    console.log('����������',self.panelsData)
	    switch(self.dataType)
        {
            case "todo":
                renderData = self.formatPanelData(self.panelsData.todo);
                break;
            case "created":
                renderData = self.formatPanelData(self.panelsData.created);
                break;
            case "joined":
                renderData = self.formatPanelData(self.panelsData.joined);
                break;
            case "done":
                renderData = self.formatPanelData(self.panelsData.done);
                break;
            default:
                return;
        }
        panels = renderData;
        //������䵱ǰtab��html
        $('[tab-type="'+ self.dataType +'"]').html(_.template($('#paneltpl').html(),panels) );
	},
	filterDataByStatus: function(data){
	    //����tab�������ݰ�״̬��ֳɲ�ͬ���
	    var ret = {
	        "overtime": [],
	        "today": [],
	        "next": [],
	        "done": []
	    };
	    $.each(data, function(key, task){
	        if(task.status == "0"){
	            if(task.time_status == "0"){
	                ret.overtime.push(task);
	            }else if(task.time_status == "1"){
	                ret.today.push(task);
	            }else if(task.time_status == "2"){
	                ret.next.push(task);
	            }
	        }else if(task.status == "1" || task.status == "2"){
	            ret.done.push(task);
	        }
	    });
	    return ret;
	},
	formatPanelData: function(){
	    //����ǰtab�����ݰ�״̬����岢����
	    var self = this,
	        data = self.panelsData[self.dataType],
	        ret = [];
	    //����tab���Ͱ���������ÿ��tab��Ҫ��Ⱦ������
	    if(self.dataType == "todo"){
	        var d = self.filterDataByStatus(data);
	        ret = [
	            {
	                panel_type: 'overtime',
	                panel_name: '�ѳ�ʱ',
	                tasks: d.overtime
	            },
	            {
	                panel_type: 'today',
	                panel_name: '����',
	                tasks: d.today
	            },
	            {
	                panel_type: 'next',
	                panel_name: '������',
	                tasks: d.next
	            }
	        ];
	    }else if(self.dataType == "created" || self.dataType == "joined"){	        
	        var d = self.filterDataByStatus(data);
	        ret = [
	            {
	                panel_type: 'overtime',
	                panel_name: '�ѳ�ʱ',
	                tasks: d.overtime
	            },
	            {
	                panel_type: 'today',
	                panel_name: '����',
	                tasks: d.today
	            },
	            {
	                panel_type: 'next',
	                panel_name: '������',
	                tasks: d.next
	            },
	            {
	                panel_type: 'done',
	                panel_name: '�����',
	                tasks: d.done
	            }
	        ];
	    }else if(self.dataType == "done"){
	        var d = self.filterDataByStatus(data);
	        ret = [
	            {
	                panel_type: 'done',
	                panel_name: '�����',
	                tasks: d.done
	            }
	        ]
	    }
	    return ret;
	},
	bindEvent: function(){
	    var self = this;
	    var tab = new fz.Scroll('.ui-tab', {
            role: 'tab'
        });
        //�л�tab��ı����ͣ����°�״̬��֯��tab������
        tab.on('scrollEnd', function(curPage) {
            switch(curPage)
            {
                case 0:
                    self.dataType = "todo";
                    break;
                case 1:
                    self.dataType = "created";
                    break;
                case 2:
                    self.dataType = "joined";
                    break;
                case 3:
                    self.dataType = "done";
                    break;
                default:
                    return;
            }
            self.filterData();
            self.renderData();
        });
        //�༭����
    	$('.kanban').delegate('.task-item', 'click', function(){
    		var $this = $(this);
    		var task_id = $this.attr('task-id');
    		self.renderTaskInfo(task_id);
    	});
    	//�ַ�������
    	$('.kanban').delegate('.panel_name', 'click', function(){
    		var $this = $(this);
    		$this.parents('.panel').toggleClass('open');
    	});
	},
	renderTaskInfo: function(task_id){
	    var self = this;
	    
	    task = {};
	    //���� ����task_idȡ��Ӧ���ݲ���ֵ��task
	    $.each(self.tasks, function(k, v){
	        if(v.taskid == task_id){
	            task = v;
	            return false;
	        }
	    });
	    console.log('....��������',task);
	    taskInfo.render(task);
	    if(task.can_delete){
            window.tDropdownData['taskinfo_opts'] = [
                {
                    'title': '����',
                    'event': 'taskInfo.save()'
                },
                {
                    'title': 'ɾ��',
                    'event': 'taskInfo.delete()'
                }
            ];
        }else{
            window.tDropdownData['taskinfo_opts'] = [
                {
                    'title': '����',
                    'event': 'taskInfo.save()'
                }
            ];
        }
	    PageTo('page_taskinfo');
	}
}

var taskInfo = {
    init: function(){
        this.bindEvent();
    },
    bindEvent: function(){
        var self = this;
        //�л����״̬
        $('.kanban').delegate('.task-status i','click',function(){
            var $this = $(this);
            $this.parents('.ui-form-item').toggleClass('finish');
            var content = $('#task-content').val();
            $('.task-content-finish').text(content);
        });
        //�༭ѡ��ִ����
    	$('.kanban').delegate('#task-executor','click',function(){    
    	    var $this = $(this);        
    	    userselect.rerender({
                type: 'single',
                selected: [self.cfg.executor.uid],
                users:self.cfg.allMember,
                callbacks: {
                    'ok': function(ret){
                        var user = ret[0];
                        console.log(user);
                        //���ѡ�е��˲��ǵ�ǰִ����
                        if(user.uid != self.cfg.executor.uid){
                            var cfg = $.extend(true,{},self.cfg);
                            cfg.executor = user;//����ִ����
                            if(cfg.executor.uid == login_uid || cfg.creator.uid == login_uid){//����Լ���ִ���߻����Լ��Ǵ����ߣ���ɱ༭
                                cfg.can_edit = true;
                            }else{
                                cfg.can_edit = false;
                            }
                            self.render(cfg);
                        }
                        PageBack();
                    },
                    'cancel': function(){
                        PageBack();
                    }
                }
            },userselect);
            PageTo('page_selectuser');
        });
        //�༭ѡ�������
        $('.kanban').delegate('#task-member-add','click',function(){
    	    var selectedUser = [];
    	    $.each(self.cfg.member,function(k,v){
    	        selectedUser.push(v.uid);
    	    })
    	    userselect.rerender({
                type: 'multi',
                selected: selectedUser,
                users:self.cfg.allMember,
                callbacks: {
                    'ok': function(ret){
                        var users = "";
                        $.each(ret, function(k, user){
                            users += '<span class="ui-label-s" data-uid="'+ user.uid +'" data-userid="'+ user.userid +'">'+ user.username +'</span>';
                        });
                        $('#task-member').html(users);
                        self.cfg.member = ret;
                        PageBack();
                    },
                    'cancel': function(){
                        PageBack();
                    }
                }
            },userselect); 
            PageTo('page_selectuser');
        });
        //���������
        $('.kanban').delegate('.subtasks-item','click',function(){
            var $this = $(this),
                subtaskid = $this.attr('subtaskid');
            var cfg = {};
            $.each(self.cfg.sub_tasks, function(k, v){
                if(v.subtaskid == subtaskid){
                    v.proj_id = self.cfg.proj_id;
                    cfg = v;
                    return false;
                }
            });
            subTask.render(cfg);
            PageTo('page_subtask');
        });
        $('#task-info').delegate('.subtasks-add','click', function(){
            addSubTask.render(self.cfg);
            PageTo('page_addsubtask');
        });
        $('#task-info').delegate('[data-action="save"]', 'click', function(){
            self.save();
        });
        $('#task-info').delegate('[data-action="delete"]', 'click', function(){
            self.delete();
        });
        $('#task-info').delegate('[data-action="cancel"]', 'click', function(){
            self.cancel();
        });
    },
	render: function(cfg){
		this.cfg = cfg;
		//console.log('��������',cfg);
		//�ж��Ƿ��б༭Ȩ�ް��¼�
		this.initElement(cfg);
		if(cfg.can_edit){
		    this.initDate();//�б༭Ȩ�޲ſ���ѡ������
		}
	},
	renderSubtasks: function(){
	    var self = this;
	    $.get("/mobile/kanban/get_subtasks.php?P="+P,
            {
                taskid: self.cfg.taskid
            },function(ret){
                var ret = JSON.parse(ret);
                if(ret.status == "1"){
                    self.cfg.sub_tasks = ret.data;
                    var subtasks = ret.data;
                    if(subtasks.length > 0){
            	        var html = "";
            	        var tplHTML = '<li subtaskid="<%=subtaskid%>" class="ui-border-t subtasks-item">'+
                			    	'<div class="ui-list-info">'+
                			    		'<h4 class="ui-nowrap">'+
                			    		    '<%=content %>'+
                			    		    '<span class="ui-panel-subtitle"><%=end %></span>'+
                			    		'</h4>'+
                			    		'<img class="ui-panel-title-tips" src="<%=executor.avatar %>" />'+
                			    	'</div>'+
                			    '</li>';
            	        $.each(subtasks, function(k, task){
            	            html += $.tpl(tplHTML,task);
            	        });
                	    $('#task-subtasks').html(html);
                	    $('.sub_tasks_container').removeClass('showEmpty');
            	    }else{
            	        $('.sub_tasks_container').addClass('showEmpty');
            	    }
                }
            }
        );
	},
	initElement: function(cfg){
	    task = cfg;
	    //console.log(cfg);
	    var klass = this.cfg.can_edit ? '':'cannot_edit';
		$('#task-info').html(_.template($('#tasktpl').html(), task)).removeClass('cannot_edit').addClass(klass);
	},
	initDate: function(){
	    if($('[data-type="date"]').length > 0){
            $('[data-type="date"]').mobiscroll().date({
                theme: 'ios7',
                lang: 'zh',
                dateFormat: 'yy-mm-dd',
                display: 'bottom',
                mode: 'scroller',
                endYear:2020
            });
        }
	},
	getData: function(){
	    var status = $('#task-status').parents('.ui-form-item').hasClass('finish') ? '1':'0';
	    var content = $('#task-content').val();
	    var executor = $('#task-executor').find('span').attr('data-uid');
	    var end = $('#task-end input').val();
	    var level = $('#task-level option:checked').val();
	    var panel_id = $('#task-panels option:checked').val();
	    var member = "";
	    if($('#task-member span').length > 0){
    	    $('#task-member span').each(function(){
    	        member += $(this).attr('data-uid') + ',';
    	    });
	    }
	    if(end == ""){
	        var d = new Date();
	        var year  = d.getFullYear();
            var month = d.getMonth()+1;
            var date = d.getDate();
	        if(month<10){
	            month = "0" + month;
	        }
	        if(date<10){
	            date = "0" + date;
	        }
	        end = year + month + date;
	    }
	    var data = {
	        panel_id: panel_id,
	        taskid: this.cfg.taskid,
    	    status: status,
    	    content: content,
    	    executor: executor,
    	    end: end,
    	    level: level,
    	    member: member
    	}
        return data;
	},
	save: function(){
	    var data = this.getData();
        var self = this;
	    console.log('���������񱣴�ǰ',data);
	    $.get("/mobile/kanban/edit_task.php?P="+P,data,function(ret){
            console.log('�����',JSON.parse(ret));
            var ret = JSON.parse(ret);
            if(ret.status == "1"){
        	    myTasksManager.getData();
                PageBack();   
            }else{
                 alert('���񱣴�ʧ�ܣ�');   
            }
        });
	},
	delete: function(){
	    var self = this;
	    $.get("/mobile/kanban/delete_task.php?P="+P,
	        {
                taskid: self.cfg.taskid,
                panel_id: self.cfg.panel_id
            },function(ret){
                var ret = JSON.parse(ret);
                if(ret.status == "1"){
                    myTasksManager.getData();
                    PageBack();      
                }else{
                    alert('ɾ������ʧ�ܣ�');
                }
            }
        );
	},
	cancel: function(){
	    PageBack();
	}
};

var subTask = {
    init: function(){
        this.bindEvent();
    },
    bindEvent: function(){
        var self = this;
        //�༭������״̬
        $('#subtask').delegate('.subtask-status i', 'click', function(){
            var $this = $(this);
            $this.parents('.subtask-info').toggleClass('finish');
            var content = $this.parents('.subtask-info').find('.subtask-content').val();
            $this.parents('.subtask-info').find('p').text(content);
        });
        //ִ����
    	$('#subtask').delegate('#subtask-executor','click',function(){    
    	    var $this = $(this);        
    	    userselect.rerender({
                type: 'single',
                selected: [self.cfg.executor.uid],
                users: self.cfg.allmember,
                callbacks: {
                    'ok': function(ret){
                        var user = ret[0];
                        //���ѡ�е��˲��ǵ�ǰִ����
                        if(user.uid != self.cfg.executor.uid){
                            var cfg = $.extend(true,{},self.cfg);
                            cfg.executor = user;//����ִ����
                            if(cfg.executor.uid == login_uid  || cfg.creator.uid == login_uid){//������Լ����ִ����
                                cfg.can_edit = true;
                            }else{
                                cfg.can_edit = false;
                            }
                            self.render(cfg);
                        }
                        PageBack();
                    },
                    'cancel': function(){
                        PageBack();
                    }
                }
            },userselect);
            PageTo('page_selectuser');
        });
        
        $('#subtask').delegate('[data-action="save"]','click', function(){
            self.save();
        });
        $('#subtask').delegate('[data-action="delete"]','click', function(){
            self.delete();
        });
        $('#subtask').delegate('[data-action="cancel"]','click', function(){
            self.cancel();
        });
    },
    render: function(cfg){
        this.cfg = cfg;
        subtask = cfg;
        var self = this;
        this.cfg.allmember = [];
        $.get("/mobile/kanban/get_new_task_info.php?P="+P,
            {
                proj_id: self.cfg.proj_id
            },function(ret){
                var ret = JSON.parse(ret);
                if(ret.status == "1"){
                    self.cfg.allmember = ret.data.allmember;
                }
            }
        );
        if(subtask !== undefined){//�༭
            $('#subtask').html(_.template($('#subtasktpl').html(), subtask));    
            if(cfg.can_edit){
    		    this.initDate();//�б༭Ȩ�޲ſ���ѡ������
    		}
        }
    },
    initDate: function(){
	    if($('[data-type="date"]').length > 0){
            $('[data-type="date"]').mobiscroll().date({
                theme: 'ios7',
                lang: 'zh',
                dateFormat: 'yy-mm-dd',
                display: 'bottom',
                mode: 'scroller',
                endYear:2020
            });
        }
	},
	save: function(){
	    var self = this;
	    var subtaskid = self.cfg.subtaskid;
	    var parent = self.cfg.parent;
	    var content = $('.subtask-content').val();
	    var status = $('#subtask-info').hasClass('finish') ? '1': '0';
	    var end = $('.subtask-end input').val();
	    var executor = $('#subtask-executor-list span').attr('data-uid');
	    var data = {
            subtaskid: subtaskid,
            parent:parent, 
            content: content,
            status: status,
            end: end,
            executor: executor
	    };
	    $.get("/mobile/kanban/edit_subtask.php?P="+P,data,function(ret){
            //console.log(JSON.parse(ret));
            var ret = JSON.parse(ret);
            if(ret.status == "1"){
                taskInfo.renderSubtasks();
                PageBack();
            }else{
                alert('����ʧ�ܣ�');
            }
            
        });
	},
	delete: function(){
	    var self = this;
	    $.get("/mobile/kanban/delete_subtask.php?P="+P,
            {
                subtaskid: self.cfg.subtaskid
            },function(ret){
                var ret = JSON.parse(ret);
                if(ret.status == "1"){
                    taskInfo.renderSubtasks();
                    PageBack();
                }else{
                    alert('ɾ��ʧ�ܣ�');
                }
            }
        );
	},
	cancel: function(){
	    PageBack();
	}
};

var addSubTask = {
    init: function(){
        this.bindEvent();
    },
    bindEvent: function(){
        var self = this;
        //ִ����
    	$('#addsubtask').delegate('#addsubtask-executor','click',function(){    
    	    var $this = $(this);        
    	    userselect.rerender({
                type: 'single',
                selected: [self.cfg.executor.uid],
                users: self.cfg.allmember,
                callbacks: {
                    'ok': function(ret){
                        var user = ret[0];
                        $('#addsubtask-executor-list').html('<span data-uid="'+ user.uid +'" data-userid="'+ user.userid +'" data-username="'+ user.username +'">'+ user.username +'</span>');
                        self.cfg.executor = user;//����ִ����
                        PageBack();
                    },
                    'cancel': function(){
                        PageBack();
                    }
                }
            },userselect);
            PageTo('page_selectuser');
        });
        
        $('#addsubtask').delegate('[data-action="save"]','click', function(){
            self.save();
        });
        $('#addsubtask').delegate('[data-action="cancel"]','click', function(){
            self.cancel();
        });
    },
    render: function(parentTask){
        var self = this;
        this.cfg = {
            allmember: [],
            proj_id: parentTask.proj_id,
            panel_id: parentTask.panel_id,
            parent: parentTask.taskid,
            executor: {}
        };
        $.get("/mobile/kanban/get_new_task_info.php?P="+P,
            {
                proj_id: self.cfg.proj_id
            },function(ret){
                var ret = JSON.parse(ret);
                if(ret.status == "1"){
                    self.cfg.allmember = ret.data.allmember;
                }
            }
        );
        $('#addsubtask').html(_.template($('#addsubtasktpl').html(), {}));    
        this.initDate();
    },
    initDate: function(){
	    if($('[data-type="date"]').length > 0){
            $('[data-type="date"]').mobiscroll().date({
                theme: 'ios7',
                lang: 'zh',
                dateFormat: 'yy-mm-dd',
                display: 'bottom',
                mode: 'scroller',
                endYear:2020
            });
        }
	},
	save: function(){
	    var self = this;
        var parent = self.cfg.parent;
	    var panel_id = self.cfg.panel_id;
	    var content = $('#addsubtask-info .subtask-content').val();
	    var end = $('#addsubtask-info .subtask-end input').val();
        var executor = self.cfg.executor;
	    var data = {
            parent:parent, 
            content: content,
            panel_id: panel_id,
            end: end,
            executor: executor.uid
	    };
	    $.get("/mobile/kanban/add_subtask.php?P="+P,data,function(ret){
            var ret = JSON.parse(ret);
            if(ret.status == "1"){
                self.cfg.executor = executor;
                //console.log('�����',self.cfg);
                //���»�����������ҳ���������б�
                var cfg = $.extend(true, {}, ret.data);
                cfg.executor = executor;
                cfg.creator = {uid: ret.data.creator};
                taskInfo.renderSubtasks();
                PageBack();
            }else{
                alert('�½�������ʧ�ܣ�');
            }
            
        });
	},
	cancel: function(){
	    PageBack();
	}
};

$(document).ready(function() {
tMobileSDK.ready(function() {
    window.myTasksManager = myTasksManager;
    window.taskInfo = taskInfo;
    window.subTask = subTask;
    window.addSubTask = addSubTask;
	myTasksManager.init();
	taskInfo.init();
	subTask.init();
	addSubTask.init();
	
	window.tDropdownData = {} ;
    var buildFuncType = "td_header";
    var tBuildFunc = function(opts) {
        tMobileSDK.buildFunc(opts);
    };
    window.showMenu = function(opts){
        var d = window.tDropdownData;   
        d && opts && d[opts] && tBuildFunc( d[opts] );
    };
    window.toProjects = function(){
        location.href = '/mobile/kanban/index.php?#page_projects';
    };
    window.toTasks = function(){
        location.href = '/mobile/kanban/mytasks.php?#page_mytask';
    };
    window.PageBack = function(){
        pages.back();
    }
    window.PageTo = function(page_id){
        if(page_id == "page_selectuser"){
            pages.to('page_selectuser');
        }else if(page_id == "page_taskinfo"){
//            window.tDropdownData['taskinfo_opts'] = [
//                {
//                    'title': '����',
//                    'event': 'taskInfo.save()'
//                },
//                {
//                    'title': 'ɾ��',
//                    'event': 'taskInfo.delete()'
//                }
//            ];
            pages.to('page_taskinfo');
        }else if(page_id == "page_subtask"){
            window.tDropdownData['subtask_opts'] = [
                {
                    'title': '����',
                    'event': 'subTask.save()'
                },
                {
                    'title': 'ɾ��',
                    'event': 'subTask.delete()'
                }
            ];
            pages.to('page_subtask');
        }else if(page_id == "page_addsubtask"){
            window.tDropdownData['addsubtask_opts'] = [
                {
                    'title': '����',
                    'event': 'addSubTask.save()'
                }
            ];
            pages.to('page_addsubtask');
        }
    };
    
    var tHeadData = {
        "page_mytask": {
            "l": {
                "class": "",
                "event": "tMobileSDK.closeWebview();",
                "title": ""
            },
            "c":[
                {
                    'title': '��Ŀ',
                    'event': 'toProjects()',
                    'active': 0
                },
                {
                    'title': '�ҵ�����',
                    'event': 'toTasks()',
                    'active': 1
                }
            ],
            "r": null
        },
        "page_taskinfo": {
            "l": {
                "class": "",
                "event": "history.back();",
                "title": ""
            },
            "c": {
                "title": "��������"
            },
            "r": {
                "class": "",
                "event": "showMenu(\"taskinfo_opts\")",
                "title": "����"
            }
        },
        "page_selectuser": {
            "l": {
                "class": "",
                "event": "history.back();",
                "title": ""
            },
            "c": {
                "title": "ѡ��"
            },
            "r": null
        },
        "page_subtask": {
            "l": {
                "class": "",
                "event": "history.back();",
                "title": ""
            },
            "c": {
                "title": "�༭������"
            },
            "r": {
                "class": "",
                "event": "showMenu(\"subtask_opts\")",
                "title": "����"
            }
        },
        "page_addsubtask": {
            "l": {
                "class": "",
                "event": "history.back();",
                "title": ""
            },
            "c": {
                "title": "�½�������"
            },
            "r": {
                "class": "",
                "event": "showMenu(\"addsubtask_opts\")",
                "title": "����"
            }
        }
    };
    
    callback = function(){};
	//callback = function(){tMobileSDK.buildHeader(tHeadData);};
    window.pages = new gmu.Pages({
        el: $('#pages'),
        router: (function(data){
            var router = {};
            $.each(data, function(k, v){
                router[k] = callback;
            });
            return router;
        })(tHeadData),
        header: tHeadData,
        active: '#page_mytask'
    });
    window.userselect = new UserSelect( $('#userselect'), {
        type: 'multi',
        selected: [],
        users: [],
        callbacks: {
            'ok': function(ret){
                PageBack();
            },
            'cancel': function(){
                PageBack();
            }
        }
    });
});
});
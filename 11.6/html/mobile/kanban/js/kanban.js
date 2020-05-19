var projects = [];
var panels = [];
var task = {};
var subtask = {};
var tasks = [];

var setLeft = {
    init: function(){
        tMobileSDK.setLeft({
            onSuccess: function(){
                $("#task-panel-list").empty();
                history.back();
            }
        })
    }
}
window.setLeft = setLeft;


var kanbanManager = {
	init: function(){
		this.projects = [];//��Ŀ��������
		this.instances = {
		    projectsInstances: [],
		    panelsInstances: [],
		    tasksInstances: []
		};
		this.getAllProjects();
		this.bindEvent();
	},
	getAllProjects: function(){
		var self = this;
		$.get("/mobile/kanban/get_projects.php?P="+P,function(ret){
		    var ret = JSON.parse(ret);
		    if(ret.status == "1"){
		        console.log('������Ŀ��Ϣ',ret.data);
		        self.projects = ret.data;
		        self.initProjects();
		    }else{
		        alert('��Ŀ����ʧ��');
		    }
		});
	},
	initProjects: function(){
		var self 	 = this,
			projects = this.projects;
	    if(projects.length > 0){
    		$.each(projects, function(key, data){
    			var $wrapper = data.status == 1 ? $('#custom_projects') : $('#archived_projects');//1��׼��Ŀ0�鵵��Ŀ
    			var instance = new ProjectItem($wrapper, data, self.instances);
    			//self.instances.projectsInstances.push(instance);
    			self.instances.projectsInstances[data.proj_id] = instance;
    		});
	    }
		if($('#custom_projects li').length == 0){
		    $('#custom_projects').parents('.mod').addClass('showEmpty');
		}
		if($('#archived_projects li').length == 0){
		    $('#archived_projects').parents('.mod').addClass('showEmpty');
		}
	},
	renderTaskInfo: function(task_id){
	    task = {};
	    $.get("/mobile/kanban/get_task_info.php?P="+P,{taskid: task_id},function(ret){
                var ret = JSON.parse(ret);
                if(ret.status == "1"){
                    task = ret.data;
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
                }else{
                    alert('�������ʧ�ܣ�');
                }
            }
        );
	},
	bindEvent: function(){
		var self = this;
		//�½�����
    	$('.kanban').delegate('.task-add', 'click', function(){
    		var $this = $(this);
    		var panel_id = $this.attr('panel-id');
    		var proj_id = $this.attr('proj-id');
    		var tasklist_id = $this.attr('tasklist_id');

    		//�½�ʱȡ��Ĭ�ϵ���Ŀid��Ĭ�ϵ����
    		var cfg = {
    		    panel_id: panel_id,
    		    proj_id: proj_id,
    		    tasklist_id: tasklist_id
    		};

    		taskNew.render(cfg);
    		PageTo('page_tasknew');
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

    	$('.kanban').delegate('.project-item', 'click', function(){
    	    var id = $(this).attr('proj_id');
    	    var instance = self.instances.projectsInstances[id];
    		TaskPanels.render(instance.config, instance, self.instances);
    		PageTo('page_project');
    	});

	}
}

function ProjectItem($wrapper, config, instances){
	this.$wrapper = $wrapper;
	this.config = config;
    this.instances = instances;
	this.initElement();
}

ProjectItem.prototype = {
    constructor: ProjectItem,
    initElement: function(){
		var html = this.parseHtml(this.config);
		this.$wrapper.append(html);
    },
    parseHtml: function(d){
    	var tplHTML =   '<li class="ui-border-t project-item" proj_id="<%=proj_id%>">'+
					    	'<div class="ui-list-info">'+
					    		'<h4 class="ui-nowrap"><%=proj_name%></h4>'+
					    	'</div>'+
					    '</li>';
    	return $.tpl(tplHTML,d);
    }
}

var TaskPanels = {
	render: function(config, ProjectItem, instances){
		this.config = config;
		this.ProjectItem = ProjectItem;
		this.instances = instances;
		this.panels = [];
		//��Ⱦ�����б�ҳ����
		this.renderInfo();
		//��Ⱦ���
		this.rendePanels();
	},
	renderInfo: function(){
		var tplHTML = '<div class="project-name"><%=proj_name%></div><div class="project-desc"><%=desc%></div><div class="project-main"><label>�����ˣ�<span><%=creator.username%></span></label><label>��Ա��<span><%=mem_count%></span></label></div>';
		$('#project-info-head').html($.tpl(tplHTML,this.config));
    },
    getPanels: function(proj_id, list_id, callback){
        var self = this;
    	//������Ŀid ��ȡpanels
    	$.get("/mobile/kanban/get_panels.php?P="+P,
            {
                proj_id: proj_id,
                list_id: list_id
            },function(ret){
                var ret = JSON.parse(ret);
                setLeft.init();
                if(ret.status == "1"){
                    console.log('����б�',ret.data[list_id]);
                    $.each(ret.data[list_id], function(k, v){
                        v.proj_id = proj_id;
                    })
                    self.panels = ret.data[list_id];
                    callback && callback.call(self);
                }else{
                    alert('��Ŀ������ʧ�ܣ�');
                }
            }
        );
    },
    rendePanels: function(){
		var proj_id  = this.config.proj_id,
		    list_id  = this.config.task_lists,
		    callback = this.renderPanelInstance;
		this.getPanels(proj_id, list_id, callback);
    },
    renderPanelInstance: function(){
        var self = this;
        panels = self.panels;
        $('#task-panel-list').html( _.template($('#paneltpl').html(), panels) );

        $.each(self.panels, function(key, panel){
            panel.proj_id = self.config.proj_id;
			var instance = new Panel(panel, self.instances);
            self.instances.panelsInstances[panel.panel_id] = instance;
		});

    }
}

function Panel(config, instances){
	this.config   = config;
	this.instances   = instances;
	this.initTasks();
}
Panel.prototype = {
    constructor: Panel,
	initTasks: function(){
		var self = this;
		$.each(this.config.tasks, function(key, task){
			var instance = new Task(task);
			self.instances.tasksInstances[task.taskid] = instance;
		});
	}
}

function Task(config){
	this.config = config;
}
Task.prototype = {
    constructor: Task
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
                users: self.cfg.allMember,
                callbacks: {
                    'ok': function(ret){
                        var user = ret[0];
                        //console.log(user);
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
                users: self.cfg.allMember,
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
        //����
        $('#task-info').delegate('[data-action="save"]', 'click', function(){
            self.save();
        });
        //ɾ��
        $('#task-info').delegate('[data-action="delete"]', 'click', function(){
            self.delete();
        });
        //ȡ��
        $('#task-info').delegate('[data-action="cancel"]', 'click', function(){
            self.cancel();
        });
        //�����������Ŀ
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
    },
	render: function(cfg){
		this.cfg = cfg;
		//console.log('��������',cfg);
		this.initElement(cfg);
		if(cfg.can_edit){
		    this.initDate();//�б༭Ȩ�޲ſ���ѡ������
		}
	},
	initElement: function(cfg){
	    task = cfg;
	    console.log('��������������',cfg);
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
	    //var data = $.extend(true,{}, this.cfg);
	    //console.log('this.cfg',this.cfg);
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
                			    		//'<span class="ui-panel-title-tips"><%=executor.username %></span>'+
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
	validate: function(data){
	    if($.trim(data.content) == ""){
	        alert("�������ݲ���Ϊ�գ�");
	        return false;
	    }else{
	        return true;
	    }
	},
	save: function(){
	    var data = this.getData();
	    var self = this;
	    console.log('���������񱣴�ǰ',data);
	    if(this.validate(data)){
            $.ajax({
                url: "/general/kanban/api/edit_task.php",
                data: data,
                type: 'get',
                success: function(ret){
                    var ret = JSON.parse(ret);
                    if(ret.status == "1"){
                        var proj_instance = kanbanManager.instances.projectsInstances[self.cfg.proj_id];
                        TaskPanels.render(proj_instance.config, proj_instance, proj_instance.instances);
                        PageBack();
                    }else{
                         alert('���񱣴�ʧ�ܣ�');
                    }
                },
                error: function(){
                    alert("���񱣴�ʧ�ܣ�");
                }
            })
        }
	},
	delete: function(){
	    //console.log('Ҫɾ��������',this.cfg);
	    var self = this;
	    $.get("/mobile/kanban/delete_task.php?P="+P,
	        {
                taskid: self.cfg.taskid,
                panel_id: self.cfg.panel_id
            },function(ret){
                var ret = JSON.parse(ret);
                if(ret.status == "1"){
                    var proj_instance = kanbanManager.instances.projectsInstances[self.cfg.proj_id];
                    TaskPanels.render(proj_instance.config, proj_instance, proj_instance.instances);
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

var taskNew = {
    init: function(){
        this.bindEvent();
    },
    bindEvent: function(){
        var self = this;
        //�½�ѡ��ִ����
        $('.kanban').delegate('#task-new-executor','click',function(){

    	    userselect.rerender({
                type: 'single',
                selected: [self.cfg.executor.uid],
                users: self.allmember,
                callbacks: {
                    'ok': function(ret){
                        var user = ret[0];
                        $('#task-new-executor-list').html('<span data-uid="'+ user.uid +'" data-userid="'+ user.userid +'" data-username="'+ user.username +'">'+user.username+'</span>');
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
        //�½�ѡ�������
        $('.kanban').delegate('#task-new-member-add','click',function(){

    	    var selectedUser = [];
    	    $.each(self.cfg.member,function(k,v){
    	        selectedUser.push(v.uid);
    	    })
    	    userselect.rerender({
                type: 'multi',
                selected: selectedUser,
                users: self.allmember,
                callbacks: {
                    'ok': function(ret){
                        var users = "";
                        $.each(ret, function(k, user){
                            users += '<span class="ui-label-s" data-uid="'+ user.uid +'" data-userid="'+ user.userid +'">'+ user.username +'</span>';
                        });
                        $('#task-new-member').html(users);
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
        $('#task-new').delegate('[data-action="save"]', 'click', function(){
            self.save();
        });
        $('#task-new').delegate('[data-action="cancel"]', 'click', function(){
            self.cancel();
        });
    },
    render: function(cfg){
        console.log('cfgΪ�½�����������Ŀ�����id',cfg);
        this.cfg = {
            content: '',
    	    executor: {},
    	    end: '',
    	    status: '0',
    	    level: '0',
    	    panel_id: cfg.panel_id,
    	    proj_id: cfg.proj_id,
    	    tasklist_id: cfg.tasklist_id,
    	    member: []
        };
        this.allmember = [];//ִ���ߺͲ����ߴ�ѡ��Ա
        this.allpanels = [];//��ѡ���
        this.renderHtml(cfg.proj_id,cfg.tasklist_id);
	},
	renderHtml: function(proj_id,tasklist_id){
	    var self = this;
	    //������Ŀid��ȡ����������г�Ա
	    $.get("/mobile/kanban/get_new_task_info.php?P="+P,
            {
                proj_id: proj_id
            },function(ret){
                var ret = JSON.parse(ret);
                if(ret.status == "1"){
                    self.allmember = ret.data.allmember;
                    self.allpanels = ret.data.allpanels[tasklist_id];
                    self.initElement();
                }
            }
        );
	},
	initElement: function(){
	    var panel_id = this.cfg.panel_id;
		$('#task-new').html(_.template($('#tasknewtpl').html(), {}));
		var panelsHtml = "";
        $.each(this.allpanels, function(k, v){
            if(v.panel_id == panel_id){
                panelsHtml += '<option value="'+ v.panel_id +'" selected>'+ v.panel_name +'</option>';
            }else{
                panelsHtml += '<option value="'+ v.panel_id +'" >'+ v.panel_name +'</option>';
            }
        });
        $('#task-new-panels').html(panelsHtml);
        this.initDate();
	},
	initDate: function(){
        $('[data-type="date"]').mobiscroll().date({
            theme: 'ios7',
            lang: 'zh',
            dateFormat: 'yy-mm-dd',
            display: 'bottom',
            mode: 'scroller',
            endYear:2020
        });
	},
	getData: function(){
	    var content = $('#task-new-content').val();
	    var executor = $('#task-new-executor').find('span').attr('data-uid');
	    var end = $('#task-new-end input').val();
	    var level = $('#task-new-level option:checked').val();
	    var panel_id = $('#task-new-panels option:checked').val();
	    var member = "";
	    if($('#task-new-member span').length > 0){
    	    $('#task-new-member span').each(function(){
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
    	    content: content,
    	    executor: executor,
    	    end: end,
    	    level: level,
    	    panel_id: panel_id,
    	    member: member
	    };
        return data;
	},
	validate: function(data){
	    if($.trim(data.content) == ""){
	        alert("�������ݲ���Ϊ�գ�");
	        return false;
	    }else{
	        return true;
	    }
	},
	save: function(){
	    var self = this;
	    var data = this.getData();
	    //console.log(this.cfg);
	    if(this.validate(data)){
	        console.log('�½����������',data);
	        $.get("/mobile/kanban/add_task.php?P="+P,data,function(ret){
	            var ret = JSON.parse(ret);
                if(ret.status == "1"){
    	            var proj_instance = kanbanManager.instances.projectsInstances[self.cfg.proj_id];
                    TaskPanels.render(proj_instance.config, proj_instance, proj_instance.instances);
                    PageBack();
                }else{
                    alert('�½�����ʧ��');
                }
            });
	    }
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
    	    console.log(self.cfg);
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
	    console.log('�½�������',data);
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

window.myTry = function(func,caller){
  var caller = caller || window;
  try{
    func && func.call(caller);
  } catch(e) {
    alert(e.message);
  }
};

$(document).ready(function() {
tMobileSDK.ready(function() {
    window.kanbanManager = kanbanManager;
    window.taskNew = taskNew;
    window.taskInfo = taskInfo;
    window.addSubTask = addSubTask;
	kanbanManager.init();
	taskNew.init();
	taskInfo.init();
	subTask.init();
	addSubTask.init();

    window.tDropdownData = {} ;
    var buildFuncType = "td_header";
    var tBuildFunc = function(opts) {
        try {tMobileSDK.buildFunc(opts);} catch(e) {alert(e.message)}
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
        if(page_id == "page_project"){
            pages.to('page_project');
        }else if(page_id == "page_selectuser"){
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
        }else if(page_id == "page_tasknew"){
            window.tDropdownData['tasknew_opts'] = [
                {
                    'title': '����',
                    'event': 'taskNew.save()'
                }
            ];
            pages.to('page_tasknew');
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
        "page_projects": {
            "l": {
                "class": "",
                "event": "tMobileSDK.closeWebview();",
                "title": ""
            },
            "c":[
                {
                    'title': '��Ŀ',
                    'event': 'toProjects()',
                    'active': 1
                },
                {
                    'title': '�ҵ�����',
                    'event': 'toTasks()',
                    'active': 0
                }
            ],
            "r": null
        },
        "page_project": {
            "l": {
                "class": "",
                "event": "history.back();",
                "title": ""
            },
            "c": {
                "title": "��Ŀ����"
            },
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
        "page_tasknew": {
            "l": {
                "class": "",
                "event": "history.back();",
                "title": ""
            },
            "c": {
                "title": "�½�����"
            },
            "r": {
                "class": "",
                "event": "showMenu(\"tasknew_opts\")",
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


    //callback = function(){tMobileSDK.buildHeader(tHeadData);};
	callback = function(){};
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
        active: '#page_projects'
    })

    window.userselect = new UserSelect( $('#userselect'), {
        type: 'multi',
        selected: [],
        users: [],
        callbacks: {
            'ok': function(ret){
                console.log(ret);
                PageBack();
            },
            'cancel': function(){
                PageBack();
            }
        }
    });


});

})

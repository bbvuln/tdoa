/*
 UserSelect created by tl 20160412
 */
(function ($) {
    var UserSelect = function ($container, opts) {
        var _this = this;
        this.$container = $container;
        this.opts = $.extend(true,{},opts);
        this.init();
        this.bindEvent();
    };
    UserSelect.prototype = {
        init: function(){
            var _this = this;
            _this.render();
            _this.$list = _this.$container.find('.ui-list');
            _this.$confirm = _this.$container.find('[node-type="confirm"]');
            _this.$cancel = _this.$container.find('[node-type="cancel"]');
            _this.renderUser();
        },
        rerender: function(opts, instance){
            instance.opts = $.extend(true,{}, opts); 
            instance.renderUser();
        },
        render: function(){
            var _this = this;
            _this.$container.html(_this.parseConatiner());                
        },
        renderUser: function(){
            var _this = this;
           
            _this.$list.html(_this.parseUsers());
        },
        parseConatiner: function(){//��Ⱦѡ����html
            var html = '<section class="ui-container userselect-ui-container">'+
            		        '<footer class="ui-footer ui-footer-btn">'+
            		            '<div class="ui-footer ui-footer-stable ui-btn-group ui-border-t">'+
            		                '<button node-type="confirm" class="ui-btn-lg ui-btn-primary">ȷ��</button>'+
            		                '<button node-type="cancel" class="ui-btn-lg">ȡ��</button>'+
            		            '</div>'+
            		        '</footer>'+
            		        '<section class="ui-container">'+
                                '<ul class="ui-list ui-border-tb"></ul>'+
            		        '</section>'+
            		     '</section>';
        	return html;
        },
        parseUserHtml: function(d){//��Ⱦѡ����Ա�б��Լ��ػ�
            var klass = this.opts.selected.indexOf(d.uid) != -1 ? '': 'unselected';
            var tplHTML = '<li class="ui-border-t user-item '+ klass +'" data-user-uid="<%=uid%>" data-user-id="<%=userid%>">'+
                            '<div class="ui-list-thumb-s">'+
                                '<i class="ui-icon-success"></i>'+
                            '</div>'+
                            '<div class="ui-list-info">'+
                                '<h4 class="ui-nowrap"><%=username%></h4>'+
                                '<p><span>���ţ�<%=dept_name%></span></p>'+
                            '</div>'+
                         '</li>';
        	return $.tpl(tplHTML,d);
        },
        parseUsers: function(){
            var _this = this;
            var html = '';
            if(_this.opts.users.length > 0){
                $.each(_this.opts.users, function(key, user){
                    html += _this.parseUserHtml(user);
                });
            }
            return html;
        },
        bindEvent: function(){
            var _this = this;
            _this.$container.delegate('.user-item', 'click', function(){
                var $this = $(this);
                var uid   = $this.attr('data-user-uid');
                //��ѡ�Ͷ�ѡ״̬���ÿ����Ŀ�İ��¼���ͬ
                if(_this.opts.type == "multi"){
                    //�����Ŀ���л�����Ŀ�Ĺ�ѡ״̬
                    $this.toggleClass('unselected');
                    if(_this.opts.selected.indexOf(uid) != -1){
                        var _index = null;
                        $.each(_this.opts.selected,function(k, v){
                            if(v == uid){
                                _index = k;
                                return false;
                            }
                        });
                        _this.opts.selected.splice(_index,1); 
                    }else{
                        _this.opts.selected.push(uid);
                    }
                }else if(_this.opts.type == "single"){
                    //��ѡ���������ǰԪ��֮���Ԫ�����δѡ������������������δѡ��������������selected���滻Ϊ�Լ�
                    _this.$container.find('.user-item').addClass('unselected');
                    $this.removeClass('unselected');
                    var array = [];
                    array.push(uid);
                    _this.opts.selected = array;
                }
            });
            _this.$container.delegate( _this.$confirm, 'click', function(){
                _this.ok();
            });  
            _this.$container.delegate( _this.$cancel, 'click', function(){
                _this.cancel();
            });
        },
        ok: function(){//ȷ��
            var _this = this;
            var ret = [];
            $.each(_this.opts.users, function(key, user){
                if(_this.opts.selected.indexOf(user.uid) != -1){
                    ret.push(user);
                }
            });
            _this.opts.callbacks && $.isFunction(_this.opts.callbacks.ok) && _this.opts.callbacks.ok(ret);
        },
        cancel: function(){//ȡ��
            var _this = this;
            _this.opts.callbacks && $.isFunction(_this.opts.callbacks.cancel) && _this.opts.callbacks.cancel();
        }
    };
    window.UserSelect = UserSelect;
})(Zepto);
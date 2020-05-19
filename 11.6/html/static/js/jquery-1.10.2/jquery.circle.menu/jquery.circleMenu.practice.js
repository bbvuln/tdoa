/**
 * Created by woota on 2014/8/14.
 */
(function($) {
    $.fn.circleMenu = function(options) {
        //build main options before element iteration
        var opts = $.extend({}, $.fn.circleMenu.defaults, options);
        $.fn.circleMenu.options = opts;

        //iterate and reformat each matched element
        return this.each(function() {
            //----------------------------------BEGIN DECLARING VARS----------------------------------------------------
            var $wrap = $(this),
                $target,
                items = $(opts.item, $wrap),
                numChildren = items.length,
                iAngle = 112/numChildren,
                degrees = 0,
                callBackHandler = function(direction) {
                    setTimeout(function() {
                        opts.animationParams[direction].callBack();
                    }, opts.animationParams[direction].speed)
                },
                animateItem = function(target, direction, y, x, opacity) {
                    target.stop().animate({'top': y, 'left': x, 'opacity': opacity}, {
                        duration: opts.animationParams[direction].speed,
                        specialEasing: {
                            'top': opts.animationParams[direction].animationType['top'],
                            'left': opts.animationParams[direction].animationType['left'],
                            'opacity': opts.animationParams[direction].animationType['opacity']
                        }
                    })
                };
            //----------------------------------END DECLARING VARS------------------------------------------------------


            //----------------------------------SET CSS-----------------------------------------------------------------
            items.css({'position': 'absolute', 'top': 0, 'z-index': 1, 'opacity': opts.styles.collapsedOpacity});
            $wrap.css({'position': 'relative', 'width': opts.width, 'height': opts.height}).addClass('circleMenuWrap');
            $wrap.prepend('<' + opts.item + ' class="' + opts.target_class + '"><a style="width:' + opts.width + '; height:' + opts.height + ';" href="#">open</a></' + opts.item + '>');
            $target = $('.' + opts.target_class, $wrap);
            //----------------------------------END CSS SET-------------------------------------------------------------


            items.hover(function(e) {
                    $(this).toggleClass('over');
                })
                .each(function(i, e) {
                    var _item = $(this),
                        _radians = (degrees * Math.PI/180),
                        _new_x = Math.round(0 + -Math.sin(_radians) * opts.displacement),
                        _new_y = Math.round(0 + -Math.cos(_radians) * opts.displacement);

                    //set different classes to the item for the <a> element showing purpose
                    if (_radians > 0 && _radians < Math.PI/2){
                        _item.addClass('CMItem_bottomright');
                    }else if (_radians > Math.PI/2 && _radians < Math.PI){
                        _item.addClass('CMItem_topright');
                    }else if (_radians > Math.PI && _radians < (3*Math.PI)/2){
                        _item.addClass('CMItem_topleft');
                    }else if (_radians > (3*Math.PI)/2 && _radians <2*Math.PI){
                        _item.addClass('CMItem_bottomleft');
                    }else if (_radians == 0 || _radians == 2*Math.PI){
                        _item.addClass('CMItem_bottom');
                    }else if (_radians == Math.PI/2){
                        _item.addClass('CMItem_right');
                    }else if (_radians == Math.PI){
                        _item.addClass('CMItem_top');
                    }else if (_radians == (3*Math.PI)/2){
                        _item.addClass('CMItem_left');
                    }

                    _item.bind('expand', function() {
                            animateItem($(this), 'out', _new_y, _new_x, opts.styles.expandedOpacity);
                        })
                        .bind('collapse', function() {
                            animateItem($(this), 'in', 0, 0, opts.styles.collapsedOpacity);
                        });

                    degrees += iAngle;
                });

            $wrap.bind('expandAll', function() {
                    items.trigger('expand');
                    $wrap.addClass('active');
                    opts.onExpand($wrap, items);
                })
                .bind('collapseAll', function() {
                    items.trigger('collapse');
                    $wrap.removeClass('active');
                    opts.onCollapse($wrap, items);
                });

            $target.css({'z-index': '100', 'position': 'relative', 'float': 'left'})
                .bind('click', function(e) {
                    e.preventDefault();

                    //collapse menu
                    if($wrap.hasClass('active')) {
                        $wrap.trigger('collapseAll');
                        callBackHandler('in');

                    //expand menu
                    } else {
                        //hide other opened menus if opts.solo === true
                        if(opts.solo === true) {
                            var _menu_expanded = $('.circleMenuWrap.active');
                            if(_menu_expanded.length > 0) {
                                _menu_expanded.trigger('collapseAll');
                            }
                        }
                        $wrap.trigger('expandAll');
                        callBackHandler('out');
                    }
                });
        });
    };

    //plugin defaults
    $.fn.circleMenu.defaults = {
        target_class: 'cM_target',
        item: 'li',
        width: '40px',
        height: '40px',
        displacement: 105,
        solo: true,
        styles: {
            expandedOpacity: 1,
            collapsedOpacity: 0
        },
        animationParams: {
            'in': {
                speed: 200,
                animationType: {
                    'top': 'easeOutExpo',
                    'left': 'easeOutExpo',
                    'opacity': 'easeOutExpo'
                },
                callBack: function() {}
            },
            'out': {
                speed: 200,
                animationType: {
                    'top': 'easeOutExpo',
                    'left': 'easeOutExpo',
                    'opacity': 'easeOutExpo'
                },
                callBack: function() {}
            }
        },
        onExpand: function(wrap, items) {

        },
        onCollapse: function(wrap, items) {

        }
    };
})(jQuery);
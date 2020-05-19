/**
*   鼠标手势
*
*   @author  jinxin<jx@tongda2000.com>
*
*   @edit_time  2013/07/29
*
*/

/*  
GM.init({ 
    normal_actions: {    
        L: {
            name : "上一封邮件",
            action : function(){ 
                // your code
            }
        },
        R: {
            name : "下一封邮件"
        }
    }     
  });
*/


(function(win){
  var IMGPATH = '/static/js/gesture/';

  var GM = {
    _lastX: 0,
    _lastY: 0,
    _directionChain: "",
    _isMousedown: false,
    _isLeftMousedown: false,
    _scroll_targets: [],
    ARROW_ICON: {
        U: IMGPATH + 'up.png',
        D: IMGPATH + 'down.png',
        L: IMGPATH + 'left.png',
        R: IMGPATH + 'right.png'
    },
    init: function (config) {
      if( !('addEventListener' in window) ){
        //lt ie9 say 88
        return;
      }
      GM.config = config;
      GM.id = config.id || 'mouse-gesture';
      GM.mouse_track = !(config.mouse_track === false);
      GM.visualized_arrow = !(config.visualized_arrow === false);
      GM.normal_actions = config.normal_actions || {};
      GM.config.minimumUnit = config.minimumUnit || 20;
      GM.root = config.root;
      GM.document = config.document;
      window.addEventListener("mousedown", GM, false);
      window.addEventListener("mousemove", GM, false);
      window.addEventListener("mouseup", GM, false);
      
      document.addEventListener("contextmenu", GM, false);
    },
    frameInit: function(context){
      var win = context || window;
      var doc = win.document;
      win.addEventListener("mousedown", GM, false);
      win.addEventListener("mousemove", GM, false);
      win.addEventListener("mouseup", GM, false);

      doc.addEventListener("contextmenu", GM, false);
    },
	clear: function() {
        var fields = document.getElementsByClassName('mouse-gesture-canvas');
       
        for(var i = 0, l = fields.length; i < l;i++){
            fields[i].parentNode.removeChild(fields[i]);
        }
    },
    handleEvent: function (e) {
      switch (e.type) {
        case "mousedown":
          if (e.button === 2 && !GM._isLeftMousedown) {
            if (window.getSelection().toString().length > 0) {
              return;
            }
            GM._isMousedown = true;
            GM._startGuesture(e);
          } else if (e.button === 0 && GM._isMousedown && !GM._isMousemove) {
            GM.flip_case = '#FlipBack';
          } else if (e.button === 2 && GM._isLeftMousedown && !GM._isMousemove) {
            GM.flip_case = '#FlipForward';
          } else if (e.button === 0 && GM.isLeft && !e.target.draggable) {
            GM._isLeftMousedown = true;
            GM.notdrag = true;
            
            GM._startGuesture(e);
          } else if (e.button === 0) {
            GM._isLeftMousedown = true;
          }
          break;
        case "mousemove":
          if (!GM.isLeft && GM._isMousedown && !GM.wheel_action) {
            GM._isMousemove = true;
            GM._progressGesture(e);
          } else if (GM._isLeftMousedown && GM.notdrag) {
            GM._isMousemove = true;
            GM._progressGesture(e);
            window.getSelection().removeAllRanges();
          }
          break;
        case "mouseup":
          var r;
          if (GM._isMousemove && GM.isLeft && (r = GM._stopGuesture(e))) {
            e.preventDefault();
          }
          if (GM._isMousedown || (GM.isLeft && GM._isLeftMousedown)) {
            if (GM.field && GM.field.parentNode) {
              setTimeout(function(){
                  GM.field && GM.field.parentNode.removeChild(GM.field);
                  GM.mouse_track_start = false;
              }, 1);
            }
          }
          GM._isMousedown = GM._isMousemove = GM._isLeftMousedown = GM.notdrag = false;
          break;
        case "contextmenu":
          if (GM.wheel_action) {
            GM.wheel_action = false;
            e.preventDefault();
            GM.title_end();
          }
          var r;
          if (r = GM._stopGuesture(e)) {
            e.preventDefault();
          }
          break;
      }
    },
    superdrag_action: function (e) {
      var act, action;
      var link = $X('ancestor-or-self::a', e.target)[0] || false;
      if (link && link.href && link.href.indexOf('javascript:') !== 0) {
        act = GM.linkdrag_actions[GM._directionChain];
        action = act && LINK_ACTION[act.name];
      } else {
        act = GM.textdrag_actions[GM._directionChain];
        action = act && TEXT_ACTION[act.name];
      }
      if (act && !action) {
        var ev = document.createEvent('Event');
        ev.initEvent(act.name, true, false);
        var target = link || e.target;
        if (target.dispatchEvent) {
          target.dispatchEvent(ev);
        } else {
          document.dispatchEvent(ev);
        }
        return true;
      }
      if (action) {
        action({config: GM.config, key: GM._directionChain, action: act, target: link || e.target, event: e});
        return true;
      }
    },
    title_list: function (titles) {
      var title_list = document.createElement('ul');
      title_list.id = 'chrome_gestures_title_list';
      title_list.setAttribute('style', 'position:fixed;width:40%;top:30%;left:30%;background:#fff;list-style-type:none;margin:0;padding:0;display:block;');
      titles.forEach(function (title) {
        var li = document.createElement('li');
        li.textContent = title.text;
        li.setAttribute('style', 'background:#fff;border:none;margin:3px;padding:4px;display:block;font-size:12pt;');
        if (title.selected) {
          li.style.background = '-webkit-gradient(linear, left top, left bottom, from(#aaa), to(#eee))';
        }
        title_list.appendChild(li);
      });
      document.body.appendChild(title_list);
      GM.titled = true;
      GM.title_end = function () {
        GM.titled = false;
        title_list.parentNode.removeChild(title_list);
        titles.some(function (title) {
          if (title.selected) {
           // connection.postMessage({tabid: title.id});
            return true;
          }
        });
      }
      GM.title_change = function (dir) {
        title_list.parentNode.removeChild(title_list);
        var index = 0;
        titles.some(function (title, i) {
          index = i;
          if (title.selected) {
            title.selected = false;
            return true;
          }
        });
        index += dir;
        if (index >= titles.length) {
          index = 0;
        } else if (index < 0) {
          index = titles.length - 1;
        }
        titles[index].selected = true;
        GM.title_list(titles);
      }
    },
    _startGuesture: function (e) {
      GM._lastX = e.clientX;
      GM._lastY = e.clientY;
      GM._directionChain = '';
      GM.target = e.target;
    },
    _progressGesture: function (e) {
      var x = e.clientX;
      var y = e.clientY;
      var doc = win.document;
      var Root = GM.root || doc.documentElement;
      var document = GM.document || doc;
      if (x === 0 && y === 0) {
        GM.dragging = GM._isMousedown = GM._isMousemove = false;
        if (GM.field && GM.field.parentNode) {
          GM.field.parentNode.removeChild(GM.field);
          GM.mouse_track_start = false;
        }
		GM.clear();
        return;
      }
      var dx = Math.abs(x - GM._lastX);
      var dy = Math.abs(y - GM._lastY);
      if (dx < GM.config.minimumUnit / 2 && dy < GM.config.minimumUnit / 2) return;
      if (GM.mouse_track) {
        if (!GM.mouse_track_start) {
          var field = GM.field = document.createElement("div");
          field.id = GM.id;
          field.className = 'mouse-gesture-canvas';
          var style = document.createElement("style");
          style.textContent = '#' + GM.id + ' *:after {display:none;}';
          field.appendChild(style);
          var SVG = 'http://www.w3.org/2000/svg';
          var svg = GM.svg = document.createElementNS(SVG, "svg");
          svg.style.position = "absolute";
          field.style.position = "fixed";
          field.addEventListener('click', function (_e) {
            GM.mouse_track_start = false;
            if (field.parentNode) field.parentNode.removeChild(field);
          }, false);
          var polyline = document.createElementNS(SVG, 'polyline');
          polyline.setAttribute('stroke', 'rgba(18,89,199,0.8)');
          polyline.setAttribute('stroke-width', '2');
          polyline.setAttribute('fill', 'none');
          GM.polyline = polyline;
          field.appendChild(svg);
          (document.body || document.documentElement).appendChild(field);
          field.style.left = "0px";
          field.style.top = "0px";
          field.style.display = 'block';
          field.style.zIndex = '1000000';
          field.style.textAlign = 'left';
          field.style.width = Root.clientWidth + 'px';
          field.style.height = Root.clientHeight + 'px';
          if (GM.visualized_arrow) {
            var pop = GM.pop = document.createElement("p");
            var label = GM.label = document.createElement("span");
            var arrows = GM.arrows = document.createElement("span");
            pop.setAttribute('style', 'display:block;background:transparent;position:absolute;top:300px;width:100%;text-align:center;min-height:4em;margin:0px;padding:0px;');
            label.setAttribute('style', 'font-size:large;font-weight:bold;color:white;display:inline-block;background:rgba(0,0,0,0.5);margin:0px;padding:10px;');
            arrows.setAttribute('style', 'display:inline-block;background:rgba(0,0,0,0.5);margin:10px;padding:10px;');
            pop.appendChild(arrows);
            pop.appendChild(document.createElement('br'));
            pop.appendChild(label);
            field.appendChild(pop);
          }
          svg.setAttribute('width', Root.clientWidth);
          svg.setAttribute('height', Root.clientHeight);
          field.style.background = 'transparent';
          field.style.border = 'none';
          GM.mouse_track_start = true;
          svg.appendChild(polyline);
        }
        GM.startX = e.clientX;
        GM.startY = e.clientY;
        var p = GM.svg.createSVGPoint();
        p.x = GM.startX;
        p.y = GM.startY;
        GM.polyline.points.appendItem(p);
      }
      if (dx < GM.config.minimumUnit && dy < GM.config.minimumUnit) return;
      var direction;
      if (dx > dy) {
        direction = x < GM._lastX ? "L" : "R";
      } else {
        direction = y < GM._lastY ? "U" : "D";
      }
      var lastDirection = GM._directionChain[GM._directionChain.length - 1];
      if (direction !== lastDirection) {
        GM._directionChain += direction;
        if (GM.mouse_track && GM.visualized_arrow) {
          var img = document.createElement('img');
          img.src = GM.ARROW_ICON[direction];
          GM.arrows.appendChild(img);
          
          var act = GM.normal_actions[GM._directionChain];       
          if (act) {
            var name = act.name;
            GM.label.textContent = name;
            GM.label.style.display = 'inline-block';
          } else {
            GM.label.style.display = 'none';
          }
        }
      }
      GM._lastX = x;
      GM._lastY = y;
    },
    _stopGuesture: function (e) {
      var isGS = GM._performAction(e);
      GM._directionChain = "";
      return isGS !== false;
    },
    _performAction: function (e) {
      if (GM.flip_case) {
        GM._directionChain = GM.flip_case;
        GM.flip_case = false;
      }
      var act = GM.normal_actions && GM.normal_actions[GM._directionChain] || GM._directionChain;

      var action = act && act.action;
      if (act && !action) {
        var ev = document.createEvent('MessageEvent');
        ev.initMessageEvent(act.name, true, false, JSON.stringify(act), location.protocol + "//" + location.host, "", window);
        document.dispatchEvent(ev);
        return true;
      }
      if (action) {
        action({config: GM.config, key: GM._directionChain, action: act, event: e});
        return true;
      } else if (GM._directionChain && GM.config.suppress_contextmenu) {
        return true;
      } else {
        return false;
      }
    }
  };
  win.GM = GM;
})(window);
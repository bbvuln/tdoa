
function isTouchDevice() {
  return 'ontouchstart' in window;
}

function fitTouchDevice() {
  if (!isTouchDevice()) {
    return;
  }
  function simMouseEvt(type, target, pos) {
    var evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(type, true, true, document, 
        0, pos.screenX, pos.screenY, pos.clientX, pos.clientY, 
        false, false, false, false, 
        0, target);
    return target.dispatchEvent(evt);
  }
  
  document.addEventListener("touchstart", function(e) {
    if (!simMouseEvt("mousedown", e.target, e.changedTouches[0])) {
      e.preventDefault();
      setTimeout(function() {
        if (e.target.getAttribute && !e.target.getAttribute("movement")) {
          e.target.removeAttribute("movement");
          simMouseEvt("mouseup", e.target, e.changedTouches[0]);
          simMouseEvt("click", e.target, e.changedTouches[0]);
        }
      }, 150);
    }
  });
  document.addEventListener("touchmove", function(e) {
    e.target.setAttribute && e.target.setAttribute("movement", "move");
    simMouseEvt("mousemove", e.target, e.changedTouches[0]) || e.preventDefault();
  });
  document.addEventListener("touchend", function(e) {
    e.target.removeAttribute && e.target.removeAttribute("movement");
    simMouseEvt("mouseup", e.target, e.changedTouches[0]) || e.preventDefault();
  });
}
fitTouchDevice();

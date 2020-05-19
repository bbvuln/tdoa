function throttle(fn, delay) {
    var timer = null;
    return function() {
        var context = this,
            args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
            fn.apply(context, args);
        }, delay);
    };
}

var Toast = function(el, opts) {
    this.init(el, opts);
    this.show = throttle(this.showHandler, 300);
};
Toast.prototype = {
    init: function(el, opts) {
        el.append('<div class="toast"><div class="toast-text"></div></div>');
    },
    showHandler: function(text) {
        var toastDom = $(".toast");
        toastDom.find(".toast-text").text(text);
        toastDom.addClass("show");
        setTimeout(function() {
            toastDom.removeClass("show");
        }, 2000);
    }
};

define('tDesktop19/tDesktop.Pulse', function(require,exports,module) {
    var $ = window.jQuery;
    
    exports.pulseFormer = function() {
        $('#progressBar').removeClass('done');
        $({property: 7}).animate({property: 60},{
            duration: 5000,
            step: function() {
                var percentage = Math.round(this.property);
                $('#progressBar').css('width',percentage+'%');
            }
        });
        //this is fake for oa tabs's second loading.
        setTimeout(function() {
            exports.pulseLater();
        },3000);
    };

    exports.pulseLater = function() {
        $({property: 60}).animate({property:100},{
            duration: 500,
            step: function() {
                var percentage = Math.round(this.property);
                $('#progressBar').css('width',percentage+'%');
                if(percentage == 100) {
                    $('#progressBar').addClass('done');
                }
            }
        });
    }
});
define('ComplexFieldLoder', ["CTextField","CTextAreaField","CDateField"], function(require, exports, module){
    var depends = module.dependencies;
    if([].forEach){
        depends.forEach(function(v, i){
            var mod = require(depends[i]);
            exports[depends[i]] = mod ? mod[depends[i]] : null;
        });
    }else{
       for(var i in depends){
           var mod = require(depends[i]);
           exports[depends[i]] = mod ? mod[depends[i]] : null;
       }
    }
});
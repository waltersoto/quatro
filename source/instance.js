var plugins = {
    me: null
};

function Instance(newPlugins) {
    this.me = newPlugins.me;
    if (!(this instanceof Instance)) {
        throw new Error("Constructor called as a function");
    }
    if (notNullOrUndefined(newPlugins)) {
        for (var p in newPlugins) {
            if (newPlugins.hasOwnProperty(p)) {
                if (notNullOrUndefined(newPlugins[p])) {
                    if (!notNullOrUndefined(Instance.prototype[p])) {
                        Instance.prototype[p] = newPlugins[p];
                    } else if (p === "me") {
                        Instance.prototype[p] = newPlugins[p];
                    }
                }
            }
        }
    }
};

Instance.prototype.forEach = function (fn) { 
    for (var i = 0, m = this.me.length; i < m; i++) {
        if (typeof fn === IS_FUNCTION) {
            fn.call(this.me[i]);
        }
    }
    return this;
};

function Quatro() {
    /// <signature>
    ///   <summary>Accepts one or more object ids</summary>
    ///   <param name="id" type="DOM object">DOM object id or reference</param> 
    /// </signature>
    /// <signature>
    ///   <summary>Accepts one or more object names</summary>
    ///   <param name="name" type="DOM object">Form object name or reference</param> 
    /// </signature>
    /// <signature>
    ///   <summary>Accepts a query selector (Ex. div.class) </summary>
    ///   <param name="query selector" type="DOM object">Query selector (Note: works on IE8+)</param> 
    /// </signature>
    var o = [];
    if (arguments.length > 0) {
        for (var i = 0, m = arguments.length; i < m; i++) {

            selector(arguments[i]).each(function (e) {
                if (typeof e.length !== "undefined") {
                    if (e.length > 0) {
                        for (var le = 0, lm = e.length; le < lm; le++) {
                            if (typeof e[le] !== "undefined") {
                                o.push(e[le]);
                            }
                        }
                    } else if (e === window) {
                        o.push(e);
                    }
                } else {
                    o.push(e);
                }
            });
        }
    }

    plugins.me = o;
    return new Instance(plugins);
};

Quatro.extend = function (extension) {
    ///	<summary>
    ///	Extend the object literal.
    ///	</summary>
    ///	<param name="extension" type="object">
    ///	 Object to be attached
    ///	</param>
    for (var p in extension) {
        if (extension.hasOwnProperty(p)) {
            if (notNullOrUndefined(extension[p])) {
                Quatro[p] = extension[p];
            }
        }
    }
};

Quatro.plugin = function (extension) {
    ///	<summary>
    ///	Add a plugin method
    ///	</summary>
    ///	<param name="extension" type="object">
    ///	 {
    ///     method:function(){
    ///         this.forEach(function(){
    ///             console.log(this.innerHTML);
    ///         });
    ///      }
    ///  }
    ///	</param> 
    for (var p in extension) {
        if (extension.hasOwnProperty(p)) {
            if (notNullOrUndefined(extension[p])) {
                if (!notNullOrUndefined(plugins[p])) {
                    plugins[p] = extension[p];
                }
            }
        }
    }
};


 

 


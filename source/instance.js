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
    each(this.me, fn);
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
    if (arguments.length === 1) {
        if (typeof arguments[0] === "function") {
            if (Quatro.ready) {
                Quatro.ready(arguments[0]);
            }
        }
    }
    each(arguments, function (a) {
        selector(a).each(function () {
            if (typeof this.length !== "undefined") {
                if (this.length > 0) {
                    for (var le = 0, lm = this.length; le < lm; le++) {
                        if (typeof this[le] !== "undefined") {
                            o.push(this[le]);
                        }
                    }
                } else if (this === window) {
                    o.push(this);
                }
            } else {
                o.push(this);
            }
        });
    }, true);
    plugins.me = o;
    return new Instance(plugins);
};

Quatro.exit = function () {
    ///	<summary>
    ///	Exit forEach loop
    ///	</summary>
    exitEach = true;
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

Quatro.select = selector;

Instance.prototype.select = function () {
    ///	<summary>
    ///  Select element(s) by id, name, class name, or query selector
    ///	</summary>
    ///	<returns type="element(s)" />
    if (this.me.length > 0) {
        var args = [];
        if (arguments.length > 0) {
            args = arguments[0];
        }
        return from(this.me[0]).select(args);
    }
    return [];
};








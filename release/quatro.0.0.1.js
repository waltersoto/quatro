/*******************************************************************************
The MIT License (MIT)

Copyright (c) 2015 Walter M. Soto Reyes

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*******************************************************************************/

(function () {
    


var IS_FUNCTION = "function";

function notNullOrUndefined(o) {
    return o !== null && typeof o !== "undefined";
}
function contains(str, substring) {
    return str.indexOf(substring) !== -1;
}
function trim(str) {
    return str.replace(/^\s+|\s+$/g, "");
}

function parseXml(text) {
    var xmlDoc;
    if (window.DOMParser) {
        var xmlParser = new DOMParser();
        xmlDoc = xmlParser.parseFromString(text, "text/xml");
    } else {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(text);
    }
    return xmlDoc;
}



var Selected = function(l) {
    var lst = l;
    this.count = function() {
        return lst.length;
    };

    this.all = function() {
        return lst;
    };

    this.first = function() {

        if (typeof lst !== "undefined" && lst.length > 0) {
            return lst[0];
        }
        return null;
    }

    this.last = function() {
        if (typeof lst !== "undefined" && lst.length > 0) {
            return lst[lst.length - 1];
        }
        return null;
    }

    this.each = function(callback) {
        if (typeof lst !== "undefined" && lst.length > 0) {
            for (var ei = 0, em = lst.length; ei < em; ei++) {
                if (typeof callback === "function") {
                    callback(lst[ei]);
                }
            }
        }
    };

    this.where = function(callback) {
        var subset = [];

        if (typeof lst !== "undefined" && lst.length > 0) {
            for (var ei = 0, em = lst.length; ei < em; ei++) {
                if (typeof callback === IS_FUNCTION) {
                    if (callback(lst[ei])) {
                        subset.push(lst[ei]);
                    }
                }
            }
        }
        return new Selected(subset);
    }
};

var select = function () {
    var list = [];
    var doc = document;
    var multiple = function (arr) {
        for (var multi = 0, max = arr.length; multi < max; multi++) {
            list.push(arr[multi]);
        }
    };
    var $c = function (action) {
        var elem = action;
        if (elem !== null && typeof elem !== "undefined") {
            if (elem.length === 0) {
                if (elem.length === 1) {
                    list.push(elem[0]);
                    return true;
                } else if (elem.length > 1) {
                    multiple(elem);
                    return true;
                }
            } else {
                list.push(elem);
                return true;
            }
        }

        return false;
    };
    for (var i = 0, m = arguments.length; i < m; i++) {
        var arg = arguments[i];
        if (typeof arg === "string") {

            if (arg.length > 0 && arg.charAt(0) === ".") {
                if (doc.getElementsByClassName) {
                    if ($c(doc.getElementsByClassName(arg.substring(1)))) {
                        continue;
                    }
                }
            }

            if ($c(doc.getElementById(arg))) {
                continue;
            }

            if ($c(doc.getElementsByTagName(arg))) {
                continue;
            }

            if ($c(doc.getElementsByName(arg))) {
                continue;
            }

            if (doc.querySelectorAll) {
                if ($c(doc.querySelectorAll(arg))) {
                    continue;
                }
            }

        } else {
            if (arg !== null && typeof arg !== "undefined") {
                list.push(arg);
            }
        }
    }

    return new Selected(list);
};




var onload = function (callback) {
    ///	<summary>
    /// Execute callback function when window is loaded
    ///	</summary>
    ///	<param name="callback" type="function">
    /// Function to execute.
    ///	</param>
    var current = window.onload;
    if (typeof window.onload !== IS_FUNCTION) {
        window.onload = callback;
    } else {
        if (typeof callback === IS_FUNCTION) {
            window.onload = function () {
                if (current) {
                    current();
                }
                callback();
            };
        }
    }
};

var readyExecuted = false;
var onReadyFn = null;
var ready = function (callback) {
    ///	<summary>
    /// Execute callback function when DOM is ready
    ///	</summary>
    ///	<param name="callback" type="function">
    /// Function to execute.
    ///	</param>
    if (typeof onReadyFn !== IS_FUNCTION) {
        onReadyFn = callback;
    } else {
        var current = onReadyFn;
        onReadyFn = function () {
            if (current) {
                current();
            }
            callback();
        };
    }

    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", function () {
            if (!readyExecuted) {
                onReadyFn();
                readyExecuted = true;
            }
        }, false);
    } else {
        onload(callback);
    }
};


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
    ///	<summary>
    ///	Iterate over objects  
    ///	</summary>
    ///	<param name="fn" type="function">
    ///	 Function to be executed for each element.
    ///	</param>
    ///	<returns type="this" />
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

            select(arguments[i]).each(function (e) {
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

Quatro.ready = ready;
 

 




if (!window.Quatro) {
    window.Quatro = window["Quatro"] = Quatro;
}

if (!window._q) {
    window._q = window["_q"] = Quatro;
}

})();
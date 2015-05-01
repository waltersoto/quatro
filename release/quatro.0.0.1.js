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



var selected = function(l) {
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
        return new selected(subset);
    }
};

var fromSelect = function (parent) {

    this.select = function() {

        var list = [];
        var doc = parent || document;
        var multiple = function (arr) {
            for (var multi = 0, max = arr.length; multi < max; multi++) {
                list.push(arr[multi]);
            }
        };
        var $c = function (action) {
            var elem = action;
            if (elem !== null && typeof elem !== "undefined") {
                if (!elem.length) {
                    list.push(elem);
                }else if (elem.length > 0) {
                    if (elem.length === 1) {
                        list.push(elem[0]);
                        return true;
                    } else if (elem.length > 1) {
                        multiple(elem);
                        return true;
                    }
                }
            }

            return false;
        };
        for (var i = 0, m = arguments.length; i < m; i++) {
            var arg = arguments[i];
      
            if (typeof arg === "string") {

                if (arg.length > 0 && arg.charAt(0) === ".") { 
                    if (doc.getElementsByClassName && $c(doc.getElementsByClassName(arg.substring(1)))) {
                        continue;
                    } 
                }
              
                if (doc.getElementById && $c(doc.getElementById(arg))) {
                    continue;
                }

                if ($c(doc.getElementsByTagName && doc.getElementsByTagName(arg))) {
                    continue;
                }

                if ($c(doc.getElementsByName && doc.getElementsByName(arg))) {
                    continue;
                }
                 
                if ($c(doc.querySelectorAll && doc.querySelectorAll(arg))) {
                    continue;
                }
               

            } else {
                if (arg !== null && typeof arg !== "undefined") {
                    list.push(arg);
                }
            }
        }

        return new selected(list);

    };

};

var from = function (parent) {
    if (typeof parent === "string") {
        parent = selector(parent).first();
    }
    return new fromSelect(parent);
};

var selector = function () {
    var args = [];
    if (arguments.length > 0) {
        args = arguments[0];
    }
    return from(document).select(args);
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


 

 




var onload = function (callback) {
    ///	<summary>
    ///	Execute a callback after the window load
    ///	</summary>
    ///	<param name="callback" type="function">
    ///	 Callback function
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
    ///	Execute a callback after the document is ready
    ///	</summary>
    ///	<param name="callback" type="function">
    ///	 Callback function
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

Quatro.ready = ready;
Quatro.onload = onload;

var eventHandler = function(elem,event, callback, remove) {
    if (notNullOrUndefined(elem)) {
        if (elem.addEventListener) {
            if (event.substring(0, 2) === "on") {
                event = event.substring(2);
            }
            if (remove) {
                elem.removeEventListener(event, callback, false);
            } else {
                elem.addEventListener(event, callback, false);
            }
            
        } else if (elem.attachEvent) {
            if (event.length > 2) {
                if (event.substring(0, 2) !== "on") {
                    event = "on" + event;
                }
            }
            if (remove) {
                elem.detachEvent(event, callback);
            } else {
                elem.attachEvent(event, callback);
            }
            
        }
    }
};

Instance.prototype.addEvent = function (event,callback) {
    ///	<summary>
    /// Attach an event to an element
    ///	</summary> 
    ///	<param name="event" type="string">
    /// Event name
    ///	</param>
    ///	<param name="callback" type="function">
    /// Function to execute
    ///	</param>
    ///	<returns type="this" />
    this.forEach(function() {
        eventHandler(this,event, callback, false);
    });
    
    return this;
};

Instance.prototype.removeEvent = function (event, callback) {
    ///	<summary>
    /// Detach an event from a element.
    ///	</summary> 
    ///	<param name="event" type="string">
    /// Event name
    ///	</param>
    ///	<param name="callback" type="function">
    /// Function to remove
    ///	</param>
    ///	<returns type="this" />
    this.forEach(function () {
        eventHandler(this, event, callback, true);
    });
    return this;
};

Instance.prototype.delegate = function (child, delegatedEvent, callback) {
    ///	<summary>
    ///	Delegate event handling to a parent
    ///	</summary>
    ///	<param name="child" type="string">
    ///	 child tag, identifier, or selector
    ///	</param> 
    ///	<param name="delegatedEvent" type="string">
    ///	 Action or event to delegate
    ///	</param> 
    ///	<param name="callback" type="string">
    ///	 Function to execute
    ///	</param> 
    ///	<returns type="this" />
    this.forEach(function () {
      
        eventHandler(this, delegatedEvent,function(event) {
            event = event || window.event;
            var target = event.target || event.srcElement;
            from(this).select(child).each(function (e) {
                if (target.id.length > 0) {
                    if (target.id === e.id) { callback.call(e); }
                } else {
                    if (target === e) { callback.call(e); }
                }
            } );

        }, false);

    });
    return this;
};

Instance.prototype.onClick = function (callback) {
    ///	<summary>
    ///	Add an onclick event
    ///	</summary>
    ///	<param name="callback" type="function">
    ///	 Callback function
    ///	</param>
    ///	<returns type="this" /> 
    this.forEach(function () { 
        eventHandler(this, "click", callback);
    });
    return this;
};

Instance.prototype.onMouseOver = function (callback) {
    ///	<summary>
    ///	Add an onMouseOver event
    ///	</summary>
    ///	<param name="callback" type="function">
    ///	 Callback function
    ///	</param>
    ///	<returns type="this" /> 
    this.forEach(function () { 
        eventHandler(this, "mouseover", callback);
    });
    return this;
};

Instance.prototype.onMouseOut = function (callback) {
    ///	<summary>
    ///	Add an onMouseOut event
    ///	</summary>
    ///	<param name="callback" type="function">
    ///	 Callback function
    ///	</param>
    ///	<returns type="this" /> 
    this.forEach(function () {
        eventHandler(this,"mouseout", callback);
    });
    return this;
};


Instance.prototype.text = function (content) {
    /// <signature>
    ///	<summary>
    ///	Read content from textContent, innerHTML, or value
    ///	</summary> 
    ///	<returns type="string|string[]" /> 
    /// </signature>
    /// <signature>
    ///	<summary>
    ///	Set content to an element's innerHTML or value.
    ///	</summary>
    ///	<param name="content" type="string">
    ///	 Content to be set
    ///	</param>
    ///	<returns type="this" /> 
    /// </signature>

    var result = [];
    var returnVal = (typeof content === "undefined");

    this.forEach(function () {
        var t = this;
        var usevalue = (t.tagName.toLowerCase() === "input" || t.tagName.toLowerCase() === "textarea");
        var isSelect = (t.tagName === "SELECT");
        if (returnVal) {
            if (isSelect) {
                //Read select/option value:
                if (t.multiple) {
                    for (var i = 0, m = t.length; i < m; i++) {
                        if (t.options[i].selected) {
                            result.push(t.options[i].value);
                        }
                    }
                } else {
                    result.push(t.options[t.selectedIndex].value);
                }
            } else {
                result.push(usevalue ? t.value : t.innerHTML);
            }

        } else {
            if (usevalue) {
                t.value = content;
            } else {
                if (t.textContent) {
                    t.textContent = content;
                } else {
                    t.innerHTML = content;
                }

            }
        }
    });

    if (returnVal) {
        if (result.length > 0) {
            if (result.length > 1) {
                return result;
            }
            return result[0];
        }
        return "";
    }

    return this;
};



if (!window.Quatro) {
    window.Quatro = window["Quatro"] = Quatro;
}

if (!window._q) {
    window._q = window["_q"] = Quatro;
}

})();
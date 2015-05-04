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

var exitEach = false;

var each = function (arr, callback, nocall) {
    exitEach = false;
    for (var fi = 0, fm = arr.length; fi < fm; fi++) {
        if (typeof callback === IS_FUNCTION) {
            if (nocall) {
              callback(arr[fi]); 
            } else {
              callback.call(arr[fi]);
            }
        }
        if (exitEach) {
            break;
        }
    }
};





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
                    callback.call(lst[ei]);
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
    ///	<summary>
    ///  Select element(s) by id, name, class name, or query selector
    ///	</summary>
    ///	<returns type="element(s)" /> 
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
  
    each(this.me,fn);

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

    },true);

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
            from(this).select(child).each(function () {
                if (target.id.length > 0) {
                    if (target.id === this.id) { callback.call(this); }
                } else {
                    if (target === this) { callback.call(this); }
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
    ///	Set content to an element's textContent, innerHTML, or value
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

Instance.prototype.isTextEmpty = function () {
    ///	<summary>
    ///	Is the element's textContent, innerHTML, or value empty
    ///	</summary> 
    ///	<returns type="Boolean" /> 
    var r = false;
    this.forEach(function () { r = Quatro(this).text().replace(/^\s+|\s+$/g, "").length === 0; });
    return r;
};

Instance.prototype.clear = function() {
    ///	<summary>
    ///	Clear element's textContent, innerHTML, or value.
    ///	</summary> 
    ///	<returns type="this" /> 
    this.forEach(function () { Quatro(this).text(""); });
};

Instance.prototype.appendText = function (content) {
    ///	<summary>
    ///	Append text to an element
    ///	</summary>
    ///	<param name="content" type="string">
    ///	 Content to append
    ///	</param>  
    ///	<returns type="this" /> 
    this.forEach(function () { Quatro(this).text(Quatro(this).text() + content); });
    return this;
};

var Attributes = function(list, name) {

    this.value = function (val) {
        /// <signature>
        ///   <summary>Set an attribute value</summary>
        ///   <param name="val" type="string">Attribute value</param> 
        ///	  <returns type="this" /> 
        /// </signature> 
        each(list, function() {
            this.setAttribute(name, val);
        });
    };

    this.read = function () {
        /// <signature>
        ///   <summary>Read attribute from element</summary>
        ///   <param name="name" type="string">Attribute name</param> 
        ///	  <returns type="string|string[]" /> 
        /// </signature>
        var r = [];
        each(list, function() {
            var t = this.getAttribute(name);
            if (t) {
                r.push(t);
            }
        });

        if (r.length > 1) {
            return r;
        }

        if (r.length === 1) {
            return r[0];
        }

        return "";
    };

    this.any = function() {
        ///	<summary>
        ///	Check if attribute exists in an element
        ///	</summary>
        /// <param name="name" type="string">Attribute name</param>
        ///	<returns type="boolean" /> 
        var result = false;

        each(list, function() {
            var t = this.getAttribute(name);
            if (t) {
                result = true;
            }
        });

        return result;
    };

    this.remove = function() {
        ///	<summary>
        ///	Remove an attribute from element
        ///	</summary>
        /// <param name="name" type="string">Attribute name</param>
        /// <returns type="this" /> 
        each(list, function () {
           this.removeAttribute(name);  
        });
    }

};

Instance.prototype.att = function (name) {
    /// <signature>
    ///   <summary>Manage attibutes</summary>
    ///   <param name="name" type="string">Attribute name</param>
    ///   <returns type="this" /> 
    /// </signature> 

    return new Attributes(this.me, name);
    
};

Instance.prototype.remove = function () {
    ///	<summary>
    ///	Remove element from DOM
    ///	</summary>
    /// <returns type="this" /> 
    this.forEach(function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
        
    });
    return this;
};

Instance.prototype.removeChildren = function (selector) {
    /// <signature>
    ///	<summary>
    ///	Remove all children nodes
    ///	</summary> 
    /// <returns type="this" /> 
    /// </signature>
    /// <signature>
    ///	<summary>
    ///	Remove all children nodes that match the selector
    ///	</summary>
    ///	<param name="selector" type="string">
    /// Selection expression (ex. .className or ul.className)
    ///	</param> 
    /// <returns type="this" />  
    /// </signature>  
    this.forEach(function () {
        if (this.hasChildNodes()) {
            if (typeof selector === "undefined") {
                while (this.childNodes.length >= 1) {
                    this.removeChild(this.firstChild);
                }
            } else {
                from(this).select(selector).each(function() {
                    Quatro(this).remove();
                });
            }

        }
    });

};






 
Instance.prototype.show = function() {
    ///	<summary>
    /// Set 'display' style to 'block'
    ///	</summary>
    this.forEach(function() {
            this.style.display = "block";
    }); 
};

Instance.prototype.hide = function() {
    ///	<summary>
    /// Set 'display' style to 'none'
    ///	</summary>
    this.forEach(function () {
        this.style.display = "none";
    });
};

Instance.prototype.swap = function() {
    /// <signature>
    ///	<summary>
    /// Swap 'display' style to from 'none' to 'inherit' if true is passed and viceversa
    ///	</summary>
    ///	<param name="inherit" type="boolean">
    /// Use 'inherit' instead of 'block'
    ///	</param>  
    /// </signature>
    /// <signature>
    ///	<summary>
    /// Swap 'display' style to from 'none' to 'block' and viceversa
    ///	</summary> 
    /// </signature> 
    this.forEach(function () {
        this.style.display = (this.style.display === "none")
            ? (inherit ? "inherit" : "block") : "none";
    });
};

Instance.prototype.inherit = function() {
    ///	<summary>
    /// Set 'display' style to 'inherit' 
    ///	</summary>
    this.forEach(function () {
        this.style.display = "inherit";
    });
};

var startClass = "(?:^|\\s)";
var endClass = "(?!\\S)";

var classExists = function(parent, name) { 
    return new RegExp(startClass + name + endClass).test(parent.className);
};

var replaceClasses = function(parent, oldName, newName) {
    if (typeof parent.className !== "undefined") {
        if (!classExists(parent, newName)) {
            parent.className = parent.className.replace(new RegExp(startClass + oldName + endClass), newName);
        }
    }
};

var ClassMan = function (list, name) {

    this.name = function() {
        return name;
    };
    var p = this;


    this.exists = function () {
        ///	<summary>
        /// Does css class exists?
        ///	</summary>
        ///	<returns type="Boolean" /> 
        var result = false;

        each(list, function() {
            result = classExists(this, name);
            if (result) {
                Quatro.exit();
            }
        });
         
        return result;
    };

    this.add = function() {
        ///	<summary>
        /// Add a css class
        ///	</summary>
        ///	<returns type="this" /> 
        each(list, function() {
            if (typeof this.className !== "undefined") {
                if (this.className.length <= 0) {
                    this.className = name;
                } else { 
                    if (!p.exists()) {
                        var current = this.className;
                        this.className = name + " " + current;
                    }
                }
            }
        });
        return p;
    };

    this.remove = function() {
        ///	<summary>
        /// Remove CSS class
        ///	</summary>
        ///	<returns type="this" />  
        each(list, function() {
            if (typeof this.className !== "undefined") {
                if (p.exists()) {
                    this.className = this.className.replace(new RegExp(startClass + name + endClass), "");
                }
            }
        }); 
        return p;
    };

    this.replaceWith = function(newName) {
        ///	<summary>
        /// Replace a CSS class by another
        ///	</summary>
        ///	<param name="newName" type="string">
        /// New class name
        ///	</param> 
        ///	<returns type="this" /> 
        each(list, function () {

            replaceClasses(this, name, newName);
            
        });

         
        return p;
    };

    this.toggleWith = function(to) {
        ///	<summary>
        /// Toggle between two CSS classes
        ///	</summary>
        ///	<param name="to" type="string">
        /// to this class
        ///	</param> 
        ///	<returns type="this" />
        
        each(list, function () {
             
            if (classExists(this, name)) { 
                replaceClasses(this, name, to);
                console.log("Replacing " + name + " to " + to);
                console.log(this.className);
            } else { 
                replaceClasses(this, to, name);
                console.log("Replacing " + to + " to " + name);
            } 
        });
         

        return p;
    };

};

Instance.prototype.cls = function (name) {
    return new ClassMan(this.me, name);
};




if (!window.Quatro) {
    window.Quatro = window["Quatro"] = Quatro;
}

if (!window._q) {
    window._q = window["_q"] = Quatro;
}

})();
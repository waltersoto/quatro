
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

Instance.prototype.clone = function (deep) {
    ///	<summary>
    ///	Abstracting cloneNode(true)
    ///	</summary>
    ///	<param name="deep" type="boolean">
    ///	True if the children of the node should also be cloned, or false to clone only the specified node.
    ///	</param>
    /// <returns type="clone" />
    if (this.me.length > 0) {
        if (typeof deep !== "undefined") {
            deep = true;
        }
        return this.me[0].cloneNode(deep);
    }
    return null;
};







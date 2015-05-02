
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
        each(list, function () {
           this.removeAttribute(name);  
        });
    }

};

Instance.prototype.att = function (name) {
    /// <signature>
    ///   <summary>Manage attibutes</summary>
    ///   <param name="name" type="string">Attribute name</param>
    /// </signature> 

    return new Attributes(this.me, name);
    
};



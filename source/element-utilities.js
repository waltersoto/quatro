
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

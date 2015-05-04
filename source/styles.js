
 
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
            } else { 
                replaceClasses(this, to, name);
            } 
        });
         

        return p;
    };

};

Instance.prototype.cls = function (name) {
    return new ClassMan(this.me, name);
};


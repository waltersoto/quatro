
var DisplayManager = function (list) {

    this.inherit = function () {
        ///	<summary>
        /// Set 'display' style to 'inherit' 
        ///	</summary>
        each(list, function () {
            this.style.display = "inherit";
        });
    }
    this.show = function () {
        ///	<summary>
        /// Set 'display' style to 'block'
        ///	</summary>
        each(list, function () {
            this.style.display =  "block";
        });
    };

    this.hide = function () {
        ///	<summary>
        /// Set 'display' style to 'none'
        ///	</summary>
        each(list, function () {
            this.style.display = "none";
        });
    };

    this.swap = function (inherit) {
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
        each(list, function () {
            this.style.display = (this.style.display === "none")
                ? (inherit ? "inherit" : "block") : "none";
        });
    };
};

Instance.prototype.display = function() {

    return new DisplayManager(this.me);

};


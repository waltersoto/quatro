

var selected = function (selectedItems) {
    var selectedList = selectedItems;
    this.count = function () {
        return selectedList.length;
    };

    this.all = function () {
        return selectedList;
    };

    this.first = function () {
        if (typeof selectedList !== "undefined" && selectedList.length > 0) {
            return selectedList[0];
        }
        return null;
    }

    this.last = function () {
        if (typeof selectedList !== "undefined" && selectedList.length > 0) {
            return selectedList[selectedList.length - 1];
        }
        return null;
    }

    this.each = function (callback) {
        if (typeof selectedList !== "undefined" && selectedList.length > 0) {
            for (var ei = 0, em = selectedList.length; ei < em; ei++) {
                if (typeof callback === "function") {
                    callback.call(selectedList[ei]);
                }
            }
        }
    };

    this.where = function (callback) {
        var subset = [];
        if (typeof selectedList !== "undefined" && selectedList.length > 0) {
            for (var ei = 0, em = selectedList.length; ei < em; ei++) {
                if (typeof callback === IS_FUNCTION) {
                    if (callback(selectedList[ei])) {
                        subset.push(selectedList[ei]);
                    }
                }
            }
        }
        return new selected(subset);
    }
};

var fromSelect = function (parent) {
    this.select = function () {
        var list = [];
        var doc = parent || document;
        var multiple = function (arr) {
            for (var multi = 0, max = arr.length; multi < max; multi++) {
                list.push(arr[multi]);
            }
        };
        var $addToList = function (action) {
            var elem = action;
            if (elem !== null && typeof elem !== "undefined") {
                if (!elem.length) {
                    list.push(elem);
                } else if (elem.length > 0) {
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
                    if (doc.getElementsByClassName && $addToList(doc.getElementsByClassName(arg.substring(1)))) {
                        continue;
                    }
                }
                if (doc.getElementById && $addToList(doc.getElementById(arg))) {
                    continue;
                }
                if ($addToList(doc.getElementsByTagName && doc.getElementsByTagName(arg))) {
                    continue;
                }
                if ($addToList(doc.getElementsByName && doc.getElementsByName(arg))) {
                    continue;
                }
                if ($addToList(doc.querySelectorAll && doc.querySelectorAll(arg))) {
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


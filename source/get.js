var get = function () {

    var list = [], doc = document;

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

    return new function () {

        this.all = function () {
            return list;
        };

        this.first = function () {

            if (typeof list !== "undefined" && list.length > 0) {
                return list[0];
            }
            return null;
        }

        this.last = function () {
            if (typeof list !== "undefined" && list.length > 0) {
                return list[list.length - 1];
            }
            return null;
        }

        this.each = function (callback) {
            if (typeof list !== "undefined" && list.length > 0) {
                for (var ei = 0, em = list.length; ei < em; ei++) {
                    if (typeof callback === "function") {
                        callback(list[ei]);
                    }
                }
            }
        };

    };

};
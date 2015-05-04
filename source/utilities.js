
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


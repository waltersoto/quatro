

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
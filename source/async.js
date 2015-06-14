
var METHOD = {
    POST: "POST",
    GET: "GET",
    HEADER: "HEADER"
};

var RESULT = {
    JSON: "JSON",
    TEXT: "TEXT",
    XML: "XML",
    STATUS: "STATUS"
};

var DEFAULT_CONTENT_TYPE = "application/x-www-form-urlencoded",
       JSON_CONTENT_TYPE = "application/json", UNDEFINED = "undefined";

var parseXml = function(text) {
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
};

function request() {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    } else { //IE 5,6
        try {
            return new ActiveXObject("Msxml2.XMLHTTP.6.0");
        } catch (e) {
            try {
                return new ActiveXObject("Msxml2.XMLHTTP.3.0");
            } catch (e2) {
                try {
                    return new ActiveXObject("Microsoft.XMLhttp");
                } catch (ex) {
                    return null;
                }
            }
        }
    }
}

function firstSymbol(url) {
    /// <summary>
    ///     Determine if a parameter will begin with ? or &
    /// </summary>
    /// <param name="url" type="string">
    ///     Ajax call url
    /// </param>
    var symbol;
    if (url.indexOf("?") === -1) {
        symbol = "?";
    } else {
        if (url.indexOf("&") === -1 && url.indexOf("?") === url.length - 1) {
            symbol = "";
        } else {
            symbol = "&";
        }
    }
    return symbol;
}

function getParameters(params, url, encode) {
    var symbol = firstSymbol(url), list = "";
    for (var p in params) {
        if (params.hasOwnProperty(p)) {
            if (typeof (params[p]) !== "undefined") {
                var par = params[p];
                if (typeof (encode) !== "undefined") {
                    par = encodeURIComponent(par);
                }
                list += symbol + p + "=" + par;
                if (symbol !== "&") {
                    symbol = "&";
                }
            }
        }
    }
    return list;
}

var callbackEvents = {
    response: "response",
    timeOut: "time-out",
    error: "error",
    header: "header"
};
var callbackQueue = [];

var RequestEvents = function () {

    this.timeOut = function (callback) {
        ///	<summary>
        ///	Handle timeout event
        ///	</summary>
        ///	<param name="callback" type="function">
        ///	 Callback function
        ///	</param>
        if (typeof callback === "function") {
            callbackQueue[callbackEvents.timeOut] = callback;
        }
        return this;
    };

    this.response = function (callback) {
        ///	<summary>
        ///	Handle asynchronous response event
        ///	</summary>
        ///	<param name="callback" type="function">
        ///	 Callback function (ex. function(result){})
        ///	</param>
        if (typeof callback === "function") {
            callbackQueue[callbackEvents.response] = callback;
        }
        return this;
    };

    this.error = function (callback) {
        ///	<summary>
        ///	Handle asynchronous error event
        ///	</summary>
        ///	<param name="callback" type="function">
        ///	 Callback function (ex. function(state,message){})
        ///	</param>
        if (typeof callback === "function") {
            callbackQueue[callbackEvents.error] = callback;
        }
        return this;
    };

    this.header = function (callback) {
        ///	<summary>
        ///	Handle header string request
        ///	</summary>
        ///	<param name="callback" type="function">
        ///	 Callback function (ex. function(result){})
        ///	</param>
        if (typeof callback === "function") {
            callbackQueue[callbackEvents.header] = callback;
        }
        return this;
    };

};
 


var call = function (req) {
    ///	<summary>
    ///	Perform an Ajax call
    ///	</summary>
    ///	<param name="req" type="json">
    ///	 {
    ///      method: 'Post'|'Get'|'Header',
    ///      url: '',
    ///      data: {
    ///       'Param 1': 'Value 1',
    ///       'Param 2': 'Value 2'
    ///      },
    ///      timeout:'wait for response time',
    ///      form:'form name' | 'form object' (Method must be post)
    ///      encode: true | false
    ///      resultType: 'Text'|'Xml'|'Json'|'Status',
    ///      contentType:'application/x-www-form-urlencoded',
    ///  }
    ///	</param> 

    if (req.url) {
        var format = typeof req.resultType !== "undefined" ? req.resultType : RESULT.JSON, parameters = "";
        if (req.data) {
            parameters = getParameters(req.data, req.url,
            (typeof req.encode !== "undefined" ? true : false));
        }
        var reqMethod =  (req.method ? req.method : METHOD.POST);
        var xH = request();

        if (xH !== null && typeof xH !== "undefined") {

            xH.onreadystatechange = function () {
                if (xH.readyState === 4) {
                    if (xH.responseText.length > 0) {
                        var result;
                        var status = xH.status;

                        if (status === 200) {

                            if (typeof callbackQueue[callbackEvents.response] === "function") {

                                switch (format.toString().toUpperCase()) {
                                    case RESULT.TEXT: result = xH.responseText; //Text
                                        break;
                                    case RESULT.XML: result = parseXml(xH.responseText);
                                        break;
                                    case RESULT.JSON: result = xH.responseText;
                                        if (typeof (JSON) !== UNDEFINED) {
                                            result = JSON.parse(result);
                                        }
                                        break;
                                    case RESULT.STATUS: result = status;
                                        break;
                                    default: result = xH.responseText;
                                        break;
                                }

                                callbackQueue[callbackEvents.response](result);
                            }

          

                            if (typeof callbackQueue[callbackEvents.header] === "function") {
                                callbackQueue[callbackEvents.header](xH.getAllResponseHeaders());
                            }
                           

                        } else {
                            if (typeof callbackQueue[callbackEvents.error] === "function") {
                                callbackQueue[callbackEvents.error](status, xH.statusText);
                            }
                           
                        }
                    }
                    xH = null;//End
                }
            };

            var params = null, reqUrl = req.url;

            //Get
            if (reqMethod.toUpperCase() === METHOD.GET) {
                reqUrl += parameters;
            } else if (reqMethod.toUpperCase() === METHOD.POST) {
                params = parameters.replace("?", "");
            }

            if (xH !== null) {
                
            
                var contentType = req.contentType ? req.contentType : DEFAULT_CONTENT_TYPE;
                if (typeof callbackQueue[callbackEvents.timeOut] === "function") {
                    xH.timeout = callbackQueue[callbackEvents.timeOut];
                } 

                xH.open(reqMethod, reqUrl, true);
                
                xH.setRequestHeader("Content-Type", contentType);

                if (contentType.toLocaleLowerCase() === JSON_CONTENT_TYPE) {
                    xH.send(JSON.stringify(req.data));
                } else {
                    xH.send(params);
                }

            }

        } else {
            if (typeof callbackQueue[callbackEvents.error] === "function") {
                callbackQueue[callbackEvents.error]("0", "Browser does not support ajax");
            }
        }
    }

    return new RequestEvents();
};

Quatro.request = call;






var onload = function (callback) {
    ///	<summary>
    ///	Execute a callback after the window load
    ///	</summary>
    ///	<param name="callback" type="function">
    ///	 Callback function
    ///	</param>
    var current = window.onload;
    if (typeof window.onload !== IS_FUNCTION) {
        window.onload = callback;
    } else {
        if (typeof callback === IS_FUNCTION) {
            window.onload = function () {
                if (current) {
                    current();
                }
                callback();
            };
        }
    }
};

var readyExecuted = false;
var onReadyFn = null;
var ready = function (callback) {
    ///	<summary>
    ///	Execute a callback after the document is ready
    ///	</summary>
    ///	<param name="callback" type="function">
    ///	 Callback function
    ///	</param>
    if (typeof onReadyFn !== IS_FUNCTION) {
        onReadyFn = callback;
    } else {
        var current = onReadyFn;
        onReadyFn = function () {
            if (current) {
                current();
            }
            callback();
        };
    }

    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", function () {
            if (!readyExecuted) {
                onReadyFn();
                readyExecuted = true;
            }
        }, false);
    } else {
        onload(callback);
    }
};

Quatro.ready = ready;
Quatro.onload = onload;

var eventHandler = function(elem,event, callback, remove) {
    if (notNullOrUndefined(elem)) {
        if (elem.addEventListener) {
            if (event.substring(0, 2) === "on") {
                event = event.substring(2);
            }
            if (remove) {
                elem.removeEventListener(event, callback, false);
            } else {
                elem.addEventListener(event, callback, false);
            }
            
        } else if (elem.attachEvent) {
            if (event.length > 2) {
                if (event.substring(0, 2) !== "on") {
                    event = "on" + event;
                }
            }
            if (remove) {
                elem.detachEvent(event, callback);
            } else {
                elem.attachEvent(event, callback);
            }
            
        }
    }
};

Instance.prototype.addEvent = function (event,callback) {
    ///	<summary>
    /// Attach an event to an element
    ///	</summary> 
    ///	<param name="event" type="string">
    /// Event name
    ///	</param>
    ///	<param name="callback" type="function">
    /// Function to execute
    ///	</param>
    ///	<returns type="this" />
    this.forEach(function() {
        eventHandler(this,event, callback, false);
    });
    
    return this;
};

Instance.prototype.removeEvent = function (event, callback) {
    ///	<summary>
    /// Detach an event from a element.
    ///	</summary> 
    ///	<param name="event" type="string">
    /// Event name
    ///	</param>
    ///	<param name="callback" type="function">
    /// Function to remove
    ///	</param>
    ///	<returns type="this" />
    this.forEach(function () {
        eventHandler(this, event, callback, true);
    });
    return this;
};

Instance.prototype.delegate = function (child, delegatedEvent, callback) {
    ///	<summary>
    ///	Delegate event handling to a parent
    ///	</summary>
    ///	<param name="child" type="string">
    ///	 child tag, identifier, or selector
    ///	</param> 
    ///	<param name="delegatedEvent" type="string">
    ///	 Action or event to delegate
    ///	</param> 
    ///	<param name="callback" type="string">
    ///	 Function to execute
    ///	</param> 
    ///	<returns type="this" />
    this.forEach(function () {
      
        eventHandler(this, delegatedEvent,function(event) {
            event = event || window.event;
            var target = event.target || event.srcElement;
            from(this).select(child).each(function () {
                if (target.id.length > 0) {
                    if (target.id === this.id) { callback.call(this); }
                } else {
                    if (target === this) { callback.call(this); }
                }
            } );

        }, false);

    });
    return this;
};

Instance.prototype.onClick = function (callback) {
    ///	<summary>
    ///	Add an onclick event
    ///	</summary>
    ///	<param name="callback" type="function">
    ///	 Callback function
    ///	</param>
    ///	<returns type="this" /> 
    this.forEach(function () { 
        eventHandler(this, "click", callback);
    });
    return this;
};

Instance.prototype.onMouseOver = function (callback) {
    ///	<summary>
    ///	Add an onMouseOver event
    ///	</summary>
    ///	<param name="callback" type="function">
    ///	 Callback function
    ///	</param>
    ///	<returns type="this" /> 
    this.forEach(function () { 
        eventHandler(this, "mouseover", callback);
    });
    return this;
};

Instance.prototype.onMouseOut = function (callback) {
    ///	<summary>
    ///	Add an onMouseOut event
    ///	</summary>
    ///	<param name="callback" type="function">
    ///	 Callback function
    ///	</param>
    ///	<returns type="this" /> 
    this.forEach(function () {
        eventHandler(this,"mouseout", callback);
    });
    return this;
};
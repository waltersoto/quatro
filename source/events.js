
var onload = function (callback) {
    ///	<summary>
    /// Execute callback function when window is loaded
    ///	</summary>
    ///	<param name="callback" type="function">
    /// Function to execute.
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
    /// Execute callback function when DOM is ready
    ///	</summary>
    ///	<param name="callback" type="function">
    /// Function to execute.
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

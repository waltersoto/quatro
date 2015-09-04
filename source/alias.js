
if (!window.Quatro) {
    window.Quatro = window["Quatro"] = function () {

        if (arguments.length > 0) {
            if (typeof arguments[0] === "function") {
                Quatro.ready(arguments[0]);
            } else {
                return Quatro.apply(this, arguments);
            }
        }
    };
}

if (!window._q) {
    window._q = window["_q"] = Quatro;
}
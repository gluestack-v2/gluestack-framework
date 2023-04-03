(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = (pluginName) => {
        if (pluginName.startsWith('glue-plugin-')) {
            return true;
        }
        if (pluginName.startsWith('@')) {
            let arr = pluginName.split('/');
            if (arr[1] && arr[1].startsWith('glue-plugin-')) {
                return true;
            }
        }
        return false;
    };
});

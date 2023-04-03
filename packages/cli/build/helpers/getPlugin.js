(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./getStorePath", "./print"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const getStorePath_1 = require("./getStorePath");
    const print_1 = require("./print");
    function getPlugin(app, path, pluginName = '', throwErrorAndExit = false) {
        try {
            const { GlueStackPlugin } = require(path);
            return new GlueStackPlugin(app, (0, getStorePath_1.injectPluginStore)(app, pluginName));
        }
        catch (e) {
            if (throwErrorAndExit) {
                (0, print_1.error)('Plugin not initialized');
                process.exit(0);
            }
        }
    }
    exports.default = getPlugin;
});

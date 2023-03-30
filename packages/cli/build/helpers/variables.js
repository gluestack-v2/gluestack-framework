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
    const variables = {};
    // user's cli path
    variables.cliPath = __dirname;
    // setter & getter
    variables.getVar = (variable) => variables[variable];
    variables.setVar = (variable, data) => (variables[variable] = data);
    exports.default = variables;
});

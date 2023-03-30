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
    exports.warning = exports.json = exports.error = exports.success = exports.info = exports.newline = void 0;
    const newline = () => console.log();
    exports.newline = newline;
    const info = (msg1, msg2 = '') => {
        if (!msg2 || msg2 === '') {
            return warning(msg1);
        }
        return console.log('>', msg1.brightBlue, '→', msg2);
    };
    exports.info = info;
    const success = (msg1, msg2 = '') => {
        if (!msg2 || msg2 === '') {
            return console.log('>', msg1.brightGreen);
        }
        else {
            return console.log('>', msg1.brightGreen, '→', msg2);
        }
    };
    exports.success = success;
    const error = (msg1, msg2 = '') => {
        if (!msg2 || msg2 === '') {
            console.log('>', msg1.brightRed);
        }
        else {
            console.log('>', msg1.brightRed, '→', msg2);
        }
    };
    exports.error = error;
    const json = (msg1) => console.log(msg1.brightGreen);
    exports.json = json;
    const warning = (msg1, msg2 = '') => {
        if (!msg2 || msg2 === '') {
            return console.log('>', msg1.brightYellow);
        }
        return console.log('>', msg1.brightYellow, '→', msg2);
    };
    exports.warning = warning;
});

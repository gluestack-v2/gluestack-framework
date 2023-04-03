var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "colors/safe"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.warning = exports.json = exports.error = exports.success = exports.info = exports.newline = void 0;
    const safe_1 = __importDefault(require("colors/safe"));
    const newline = () => console.log();
    exports.newline = newline;
    const info = (msg1, msg2 = '') => {
        if (!msg2 || msg2 === '') {
            return (0, exports.warning)(msg1);
        }
        return console.log('>', safe_1.default.blue(msg1), '→', msg2);
    };
    exports.info = info;
    const success = (msg1, msg2 = '') => {
        if (!msg2 || msg2 === '') {
            return console.log('>', safe_1.default.green(msg1));
        }
        else {
            return console.log('>', safe_1.default.green(msg1), '→', msg2);
        }
    };
    exports.success = success;
    const error = (msg1, msg2 = '') => {
        if (!msg2 || msg2 === '') {
            console.log('>', safe_1.default.red(msg1));
        }
        else {
            console.log('>', safe_1.default.red(msg1), '→', msg2);
        }
    };
    exports.error = error;
    const json = (msg1) => console.log(safe_1.default.green(msg1));
    exports.json = json;
    const warning = (msg1, msg2 = '') => {
        if (!msg2 || msg2 === '') {
            return console.log('>', safe_1.default.yellow(msg1));
        }
        return console.log('>', safe_1.default.yellow(msg1), '→', msg2);
    };
    exports.warning = warning;
});

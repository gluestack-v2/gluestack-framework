var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "path", "colors/safe", "../helpers/print"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const path_1 = require("path");
    const safe_1 = __importDefault(require("colors/safe"));
    const print_1 = require("../helpers/print");
    exports.default = (app) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, e_1, _b, _c, _d, e_2, _e, _f;
        try {
            for (var _g = true, _h = __asyncValues(app.plugins), _j; _j = yield _h.next(), _a = _j.done, !_a;) {
                _c = _j.value;
                _g = false;
                try {
                    const plugin = _c;
                    try {
                        for (var _k = true, _l = (e_2 = void 0, __asyncValues(plugin.instances)), _m; _m = yield _l.next(), _d = _m.done, !_d;) {
                            _f = _m.value;
                            _k = false;
                            try {
                                const instance = _f;
                                (0, print_1.success)('Found instance', instance.getName());
                                if (!instance.watch || !instance.watch().length) {
                                    (0, print_1.warning)(`${instance.getName()}`, 'contains no watch method or it exists but returns an empty array');
                                    continue;
                                }
                                (0, print_1.warning)(instance.getName(), 'watching for changes');
                                const cwd = (0, path_1.join)(process.cwd(), instance.getInstallationPath());
                                // AppCLI watch API
                                app.watch(cwd, instance.watch(), (event, path) => __awaiter(void 0, void 0, void 0, function* () {
                                    (0, print_1.info)(`${instance.getName()}`, `${safe_1.default.green(event)} :: ${safe_1.default.yellow(path)}`);
                                    // AppCLI write API
                                    yield app.write(cwd, instance.getName());
                                }));
                            }
                            finally {
                                _k = true;
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (!_k && !_d && (_e = _l.return)) yield _e.call(_l);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
                finally {
                    _g = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_g && !_a && (_b = _h.return)) yield _b.call(_h);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
});

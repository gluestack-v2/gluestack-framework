var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "path", "child_process"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const path_1 = require("path");
    const child_process_1 = require("child_process");
    function execute(steps) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const step of steps) {
                yield new Promise((resolve, reject) => {
                    (0, child_process_1.exec)(step, (error, stdout, stderr) => __awaiter(this, void 0, void 0, function* () {
                        if (error) {
                            reject(error);
                            return;
                        }
                        resolve(true);
                    }));
                });
            }
        });
    }
    exports.default = (packageName) => __awaiter(void 0, void 0, void 0, function* () {
        if (packageName.startsWith('./') || packageName.startsWith('../')) {
            const localPackagePath = (0, path_1.resolve)(packageName);
            yield execute([`npm uninstall ${localPackagePath}`]);
        }
        else {
            yield execute([`npm uninstall ${packageName}`]);
        }
    });
});

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
        define(["require", "exports", "../helpers/dependencies", "../helpers/print"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const dependencies_1 = require("../helpers/dependencies");
    const print_1 = require("../helpers/print");
    const runDoctor = () => __awaiter(void 0, void 0, void 0, function* () {
        const results = yield Promise.allSettled([
            (0, dependencies_1.node)(),
            (0, dependencies_1.npm)(),
            (0, dependencies_1.yarn)(),
            (0, dependencies_1.hasura)(),
            (0, dependencies_1.docker)(),
            (0, dependencies_1.dockerCompose)(),
            (0, dependencies_1.dockerStatus)(),
        ]);
        let failed = false;
        results.forEach((result) => {
            if (result.status === 'rejected' && result.reason) {
                (0, print_1.info)(result.reason, 'NO'.red);
                failed = true;
            }
            if (result.status === 'fulfilled') {
                (0, print_1.info)(result.value, 'YES'.brightGreen);
            }
        });
        if (failed) {
            (0, print_1.error)(`Pre-Requisites check for installation failed.`);
            process.exit(0);
        }
    });
    exports.default = runDoctor;
});

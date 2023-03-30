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
        define(["require", "exports", "path", "./file"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const path_1 = require("path");
    const file_1 = require("./file");
    const writer = {
        write: (path, instanceName) => __awaiter(void 0, void 0, void 0, function* () {
            const sealPath = (0, path_1.join)(process.cwd(), '.glue/seal/services');
            if (!(0, file_1.fileExists)(sealPath)) {
                yield (0, file_1.createFolder)(sealPath);
            }
            const instancePath = (0, path_1.join)(sealPath, instanceName, 'src', instanceName);
            if (!(0, file_1.fileExists)(instancePath)) {
                yield (0, file_1.createFolder)(instancePath);
            }
            yield (0, file_1.copyFolder)(path, instancePath);
        }),
    };
    exports.default = writer;
});

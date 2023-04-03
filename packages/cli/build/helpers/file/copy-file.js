var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
        define(["require", "exports", "fs", "path", "./file-exists"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const fs_1 = __importDefault(require("fs"));
    const path_1 = __importDefault(require("path"));
    const file_exists_1 = __importDefault(require("./file-exists"));
    const copyFile = (source, target) => __awaiter(void 0, void 0, void 0, function* () {
        let targetFile = target;
        // If target is a directory, a new file with the same name will be created
        if ((0, file_exists_1.default)(target)) {
            if (fs_1.default.lstatSync(target).isDirectory()) {
                targetFile = path_1.default.join(target, path_1.default.basename(source));
            }
        }
        yield fs_1.default.writeFileSync(targetFile, fs_1.default.readFileSync(source));
    });
    exports.default = copyFile;
});

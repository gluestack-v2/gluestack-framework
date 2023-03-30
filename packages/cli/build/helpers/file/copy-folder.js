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
        define(["require", "exports", "fs", "path", "./copy-file", "./create-folder", "./file-exists"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const fs_1 = __importDefault(require("fs"));
    const path_1 = __importDefault(require("path"));
    const copy_file_1 = __importDefault(require("./copy-file"));
    const create_folder_1 = __importDefault(require("./create-folder"));
    const file_exists_1 = __importDefault(require("./file-exists"));
    const copyFolder = (source, target, depth = 0) => __awaiter(void 0, void 0, void 0, function* () {
        if (!source.includes('.git')) {
            let files = [];
            // Check if folder needs to be created or integrated
            const targetFolder = path_1.default.join(target, path_1.default.basename(depth ? source : '.'));
            if (!(yield (0, file_exists_1.default)(targetFolder))) {
                yield (0, create_folder_1.default)(targetFolder);
            }
            // Copy
            if (fs_1.default.lstatSync(source).isDirectory() ||
                fs_1.default.lstatSync(source).isSymbolicLink()) {
                files = fs_1.default.readdirSync(source);
                files.forEach((file) => __awaiter(void 0, void 0, void 0, function* () {
                    let curSource = path_1.default.join(source, file);
                    if (fs_1.default.lstatSync(curSource).isDirectory()) {
                        yield copyFolder(curSource, targetFolder, depth++);
                    }
                    else {
                        yield (0, copy_file_1.default)(curSource, targetFolder);
                    }
                }));
            }
        }
    });
    exports.default = copyFolder;
});

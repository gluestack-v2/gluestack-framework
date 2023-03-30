var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./append-file-content", "./create-folder", "./copy-file", "./copy-folder", "./file-exists", "./write-file", "./read-file", "./rm", "./check-folder-is-empty"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.checkFolderIsEmpty = exports.rm = exports.appendFileContent = exports.writeFile = exports.readFile = exports.fileExists = exports.copyFolder = exports.copyFile = exports.createFolder = void 0;
    const append_file_content_1 = __importDefault(require("./append-file-content"));
    exports.appendFileContent = append_file_content_1.default;
    const create_folder_1 = __importDefault(require("./create-folder"));
    exports.createFolder = create_folder_1.default;
    const copy_file_1 = __importDefault(require("./copy-file"));
    exports.copyFile = copy_file_1.default;
    const copy_folder_1 = __importDefault(require("./copy-folder"));
    exports.copyFolder = copy_folder_1.default;
    const file_exists_1 = __importDefault(require("./file-exists"));
    exports.fileExists = file_exists_1.default;
    const write_file_1 = __importDefault(require("./write-file"));
    exports.writeFile = write_file_1.default;
    const read_file_1 = __importDefault(require("./read-file"));
    exports.readFile = read_file_1.default;
    const rm_1 = __importDefault(require("./rm"));
    exports.rm = rm_1.default;
    const check_folder_is_empty_1 = __importDefault(require("./check-folder-is-empty"));
    exports.checkFolderIsEmpty = check_folder_is_empty_1.default;
});

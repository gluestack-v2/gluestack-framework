var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "fs", "path", "os"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const fs_1 = __importDefault(require("fs"));
    const path_1 = __importDefault(require("path"));
    const os_1 = __importDefault(require("os"));
    class GluePluginStore {
        constructor(path) {
            this.path = path;
            this.store = {};
        }
        restore() {
            try {
                if (fs_1.default.existsSync(path_1.default.dirname(this.path))) {
                    const data = fs_1.default.readFileSync(this.path, 'utf8');
                    if (data) {
                        this.store = JSON.parse(data);
                    }
                }
            }
            catch (error) {
                //
            }
        }
        set(key, value) {
            this.store[key] = value;
        }
        get(key) {
            return this.store[key];
        }
        save() {
            try {
                if (!fs_1.default.existsSync(path_1.default.dirname(this.path))) {
                    fs_1.default.mkdirSync(path_1.default.dirname(this.path), { recursive: true });
                }
                fs_1.default.writeFileSync(this.path, JSON.stringify(this.store, null, 2) + os_1.default.EOL);
            }
            catch (error) {
                //
            }
        }
    }
    exports.default = GluePluginStore;
});

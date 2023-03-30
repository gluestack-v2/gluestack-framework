var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./install", "./instance-list", "./plugin-list", "./plugin-init", "./watch"], factory);
    }
})(function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    const install_1 = __importDefault(require("./install"));
    const instance_list_1 = __importDefault(require("./instance-list"));
    const plugin_list_1 = __importDefault(require("./plugin-list"));
    const plugin_init_1 = __importDefault(require("./plugin-init"));
    const watch_1 = __importDefault(require("./watch"));
    const commands = () => {
        return [install_1.default, instance_list_1.default, plugin_list_1.default, plugin_init_1.default, watch_1.default];
    };
    exports.default = commands;
});

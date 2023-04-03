/**
 * Installs the project or plugin
 */
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
        define(["require", "exports", "../actions/plugin-init"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const plugin_init_1 = __importDefault(require("../actions/plugin-init"));
    exports.default = (program, app) => __awaiter(void 0, void 0, void 0, function* () {
        const command = program
            .command('plugin:init')
            .description('Initializes the gluestack app as a plugin');
        command
            .command('instance')
            .description('Initializes the gluestack app as a plugin instance')
            .action(() => (0, plugin_init_1.default)(app, 'instance'));
        command
            .command('container')
            .description('Initializes the gluestack app as a container plugin')
            .action(() => (0, plugin_init_1.default)(app, 'container'));
    });
});

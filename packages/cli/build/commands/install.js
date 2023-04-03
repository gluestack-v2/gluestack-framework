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
        define(["require", "exports", "commander", "../actions/install"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const commander_1 = require("commander");
    const install_1 = __importDefault(require("../actions/install"));
    exports.default = (program, app) => __awaiter(void 0, void 0, void 0, function* () {
        // install group command
        const command = program
            .command('add')
            .alias('install')
            .description('installs a gluestack plugin, use help for more info on subcommands')
            .addArgument(new commander_1.Argument('<plugin-name>', 'name of the plugin from gluestack group'))
            .addArgument(new commander_1.Argument('<instance-name>', 'name of the instance to install the plugin'))
            .action((pluginName, instanceName) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, install_1.default)(app, pluginName, instanceName);
        }));
    });
});

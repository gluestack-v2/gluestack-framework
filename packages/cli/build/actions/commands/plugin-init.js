"use strict";
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
const pluginInit = require('../plugin-init');
module.exports = (program, app) => __awaiter(void 0, void 0, void 0, function* () {
    const command = program
        .command('plugin:init')
        .description('Initializes the gluestack app as a plugin');
    command
        .command('instance')
        .argument('<plugin-name>', 'Plugin name')
        .description('Initializes the gluestack app as a plugin instance')
        .action((pluginName) => pluginInit(app, pluginName, 'instance'));
    command
        .command('container')
        .argument('<plugin-name>', 'Plugin name')
        .description('Initializes the gluestack app as a container plugin')
        .action((pluginName) => pluginInit(app, pluginName, 'container'));
});

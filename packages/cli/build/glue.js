#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const App = require('./lib/app');
const commander = require('./helpers/commander');
// const runDoctor = require('./actions/doctor');
const commanderInit = (app) => __awaiter(void 0, void 0, void 0, function* () {
    // initialise the commander
    yield commander.init();
    // register commands to the commander
    yield commander.addCommands(app);
});
const init = () => {
    return new App();
};
const destroy = (app) => __awaiter(void 0, void 0, void 0, function* () {
    yield app.destroyPlugins();
    // close commander
    yield commander.destroy();
    app.gluePluginStoreFactory.saveAllStores();
});
const glue = (localPlugins = []) => __awaiter(void 0, void 0, void 0, function* () {
    const app = init();
    yield app.initPlugins(localPlugins);
    yield commanderInit(app);
    yield destroy(app);
    return app;
});
module.exports = glue;

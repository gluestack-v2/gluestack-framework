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
        define(["require", "exports", "@gluestack/helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PluginInstanceContainerController = void 0;
    const helpers_1 = require("@gluestack/helpers");
    class PluginInstanceContainerController {
        constructor(app, callerInstance) {
            this.status = 'down';
            this.portNumber = 3100;
            this.containerId = '';
            this.app = app;
            this.callerInstance = callerInstance;
            this.setStatus(this.callerInstance.gluePluginStore.get('status'));
            this.setPortNumber(this.callerInstance.gluePluginStore.get('port_number'));
            this.setContainerId(this.callerInstance.gluePluginStore.get('container_id'));
        }
        getCallerInstance() {
            return this.callerInstance;
        }
        getEnv() {
            return __awaiter(this, void 0, void 0, function* () {
                return {};
            });
        }
        installScript() {
            return ['npm', 'install', '--save', '--legacy-peer-deps'];
        }
        runScript() {
            return __awaiter(this, void 0, void 0, function* () {
                return ['npm', 'run', 'dev', '--', '-p', '9000'];
            });
        }
        buildScript() {
            return ["npm", "run", "build"];
        }
        getDockerJson() {
            return __awaiter(this, void 0, void 0, function* () {
                return {};
            });
        }
        getStatus() {
            return this.status;
        }
        // @ts-ignore
        getPortNumber(returnDefault) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    if (this.portNumber) {
                        return resolve(this.portNumber);
                    }
                    let ports = this.callerInstance.callerPlugin.gluePluginStore.get("ports") || [];
                    helpers_1.DockerodeHelper.getPort(3100, ports)
                        .then((port) => {
                        this.setPortNumber(port);
                        ports.push(port);
                        this.callerInstance.callerPlugin.gluePluginStore.set("ports", ports);
                        return resolve(this.portNumber);
                    })
                        .catch((e) => {
                        reject(e);
                    });
                });
            });
        }
        getContainerId() {
            return this.containerId;
        }
        setStatus(status) {
            this.callerInstance.gluePluginStore.set('status', status || 'down');
            return (this.status = status || 'down');
        }
        setPortNumber(portNumber) {
            this.callerInstance.gluePluginStore.set('port_number', portNumber);
            return this.portNumber;
        }
        setContainerId(containerId) {
            this.callerInstance.gluePluginStore.set('container_id', containerId || null);
            return this.containerId;
        }
        getConfig() { }
        up() {
            return __awaiter(this, void 0, void 0, function* () {
                this.setStatus('up');
                yield this.getPortNumber();
            });
        }
        down() {
            return __awaiter(this, void 0, void 0, function* () {
                this.setStatus('down');
            });
        }
        build() {
            return __awaiter(this, void 0, void 0, function* () {
                yield helpers_1.SpawnHelper.run(this.callerInstance.getInstallationPath(), this.installScript());
                yield helpers_1.SpawnHelper.run(this.callerInstance.getInstallationPath(), this.buildScript());
            });
        }
        getRoutes() {
            return __awaiter(this, void 0, void 0, function* () {
                const routes = [
                    { method: "GET", path: "/" }
                ];
                return Promise.resolve(routes);
            });
        }
    }
    exports.PluginInstanceContainerController = PluginInstanceContainerController;
});

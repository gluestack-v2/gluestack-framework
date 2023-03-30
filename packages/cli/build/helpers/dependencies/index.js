(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./docker", "./docker-compose", "./docker-status", "./hasura", "./node", "./yarn", "./npm", "./tsc"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dependencies = exports.npm = exports.tsc = exports.yarn = exports.node = exports.hasura = exports.dockerStatus = exports.dockerCompose = exports.docker = void 0;
    const docker_1 = require("./docker");
    Object.defineProperty(exports, "docker", { enumerable: true, get: function () { return docker_1.docker; } });
    const docker_compose_1 = require("./docker-compose");
    Object.defineProperty(exports, "dockerCompose", { enumerable: true, get: function () { return docker_compose_1.dockerCompose; } });
    const docker_status_1 = require("./docker-status");
    Object.defineProperty(exports, "dockerStatus", { enumerable: true, get: function () { return docker_status_1.dockerStatus; } });
    const hasura_1 = require("./hasura");
    Object.defineProperty(exports, "hasura", { enumerable: true, get: function () { return hasura_1.hasura; } });
    const node_1 = require("./node");
    Object.defineProperty(exports, "node", { enumerable: true, get: function () { return node_1.node; } });
    const yarn_1 = require("./yarn");
    Object.defineProperty(exports, "yarn", { enumerable: true, get: function () { return yarn_1.yarn; } });
    const npm_1 = require("./npm");
    Object.defineProperty(exports, "npm", { enumerable: true, get: function () { return npm_1.npm; } });
    const tsc_1 = require("./tsc");
    Object.defineProperty(exports, "tsc", { enumerable: true, get: function () { return tsc_1.tsc; } });
    const dependencies = {
        docker: 'docker',
        dockerCompose: 'dockerCompose',
        dockerStatus: 'dockerStatus',
        hasura: 'hasura',
        node: 'node',
        yarn: 'yarn',
        npm: 'npm',
    };
    exports.dependencies = dependencies;
});

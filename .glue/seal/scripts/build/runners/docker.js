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
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const execute_1 = require("../helpers/execute");
const fs_exists_1 = require("../helpers/fs-exists");
class Docker {
    constructor(container_name, servicePath, build, ports, envfile = '') {
        this.ports = ports;
        this.container_name = container_name;
        this.build = (0, path_1.join)(servicePath, build);
        this.volume = (0, path_1.join)(servicePath);
        this.envfile = envfile !== '' ? (0, path_1.join)(servicePath, envfile) : '';
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('> Creating Docker Build...');
            const args = [
                'build',
                '--no-cache',
                '-t',
                this.container_name,
                '-f',
                this.build,
                this.volume
            ];
            console.log('docker', args.join(' '));
            yield (0, execute_1.execute)('docker', args, {
                cwd: this.volume,
                stdio: 'inherit',
                shell: true
            });
            console.log('> Done with Creating Docker Build...');
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('> Initiaiting Docker Run...');
            const args = [
                'run',
                '--detach',
                '--name',
                this.container_name,
                '--hostname',
                this.container_name
            ];
            if (this.envfile !== '' && (yield (0, fs_exists_1.exists)(this.envfile))) {
                args.push('--env-file');
                args.push(this.envfile);
            }
            if (this.ports.length > 0) {
                this.ports.forEach(port => {
                    args.push('-p');
                    args.push(port);
                });
            }
            args.push(this.container_name);
            console.log('docker', args.join(' '));
            yield (0, execute_1.execute)('docker', args, {
                cwd: this.volume,
                stdio: 'inherit',
                shell: true
            });
            console.log('> Done with Initiating Docker Run...');
        });
    }
    static start(container_name, servicePath, build, ports, envfile = '') {
        return __awaiter(this, void 0, void 0, function* () {
            const docker = new Docker(container_name, servicePath, build, ports, envfile);
            yield docker.create();
            yield docker.run();
        });
    }
}
exports.default = Docker;

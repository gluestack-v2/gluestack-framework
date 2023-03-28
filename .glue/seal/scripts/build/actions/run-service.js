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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_exists_1 = require("../helpers/fs-exists");
const parse_yaml_1 = require("../helpers/parse-yaml");
const exit_with_msg_1 = require("../helpers/exit-with-msg");
const seal_service_1 = require("../validations/seal-service");
const local_1 = __importDefault(require("../runners/local"));
const docker_1 = __importDefault(require("../runners/docker"));
exports.default = (directoryName, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { platform, ports } = options;
    // if platform is docker and ports are not provided, exit
    if (platform === 'docker' && ports.length <= 0) {
        yield (0, exit_with_msg_1.exitWithMsg)('> ports are required in case platform is docker');
    }
    // if platform is local and ports are provided, exit
    if (platform === 'local' && ports.length > 0) {
        yield (0, exit_with_msg_1.exitWithMsg)('> ports are not required in case platform is local');
    }
    // if service doesn't exists, exit
    const servicePath = (0, path_1.join)(process.cwd(), '..', 'services', directoryName);
    if (!(yield (0, fs_exists_1.exists)(servicePath))) {
        yield (0, exit_with_msg_1.exitWithMsg)(`> service ${(0, path_1.relative)('.', servicePath)} doesn't exists`);
    }
    // check if given service has a seal.service.yaml or a seal.service.yml file
    const _yamlPath = yield (0, fs_exists_1.exists)((0, path_1.join)(servicePath, 'seal.service.yaml'));
    const _ymlPath = yield (0, fs_exists_1.exists)((0, path_1.join)(servicePath, 'seal.service.yml'));
    // if both yaml as well as yml doesn't exists, exit
    if (!_yamlPath && !_ymlPath) {
        yield (0, exit_with_msg_1.exitWithMsg)(`> service ${(0, path_1.relative)('.', (0, path_1.join)(servicePath, 'seal.service.yaml'))} file doesn't exists`);
    }
    // if seal.service.yaml doesn't exists, use seal.service.yml instead
    const yamlPath = (_yamlPath ? _yamlPath : _ymlPath);
    const content = yield (0, seal_service_1.validateSealService)(yield (0, parse_yaml_1.parseYAML)(yamlPath));
    // if service doesn't contain given platform, exit
    if (!content.platforms[platform]) {
        yield (0, exit_with_msg_1.exitWithMsg)(`service ${(0, path_1.relative)('.', (0, path_1.join)(servicePath, 'seal.service.yaml'))} file doesn't contain ${platform} platform`);
    }
    const { envfile, build } = content.platforms[platform];
    switch (platform) {
        case 'docker':
            yield docker_1.default.start(content.container_name, servicePath, build, ports, envfile);
            break;
        case 'local':
            yield local_1.default.start(servicePath, build);
            break;
    }
});

const Dockerode = require("dockerode");
const yaml = require("json-to-pretty-yaml");
import isPortReachable from "./isPortReachable";

export class DockerodeHelper {
  static docker = new Dockerode();

  static getEnv(dockerConfig: any, envConfig: any, name: string) {
    const dockerodeEnv = this.envParser(envConfig);

    return {
      ...dockerConfig,
      ENV: dockerodeEnv,
      name: name,
    };
  }

  static async up(
    dockerConfig: any,
    envConfig: any,
    hostPort: number,
    name: string,
  ) {
    return new Promise(async (resolve, reject) => {
      const containerByName: any = await this.getContainerByName(name);
      if (containerByName) {
        return resolve({
          status: "up",
          portNumber: hostPort,
          containerId: containerByName.Id,
        });
      }

      const containerOptions = this.getEnv(dockerConfig, envConfig, name);

      await DockerodeHelper.pullImage(dockerConfig.Image);

      this.docker
        .createContainer(containerOptions)
        .then((container: any) => {
          const containerId = container.id;
          container.start((err: any, data: any) => {
            if (err) {
              return reject(err);
            }
          });

          return resolve({
            status: "up",
            portNumber: hostPort,
            containerId: containerId,
          });
        })
        .catch((err: any) => {
          return reject(err);
        });
    });
  }

  static async downByContainerId(containerId: string) {
    return new Promise(async (resolve, reject) => {
      const container = await this.docker.getContainer(containerId);
      if (container) {
        container.remove({ force: true }, (err: any, data: any) => {
          if (err) {
            if (err.statusCode === 404) return resolve(true);
            return reject(err);
          } else {
            return resolve(true);
          }
        });
      }
    });
  }

  static async down(containerId: string, name: string) {
    return new Promise(async (resolve, reject) => {
      if (containerId) {
        await this.downByContainerId(containerId);
      }
      const containerByName: any = await this.getContainerByName(name);

      if (containerByName) {
        await this.downByContainerId(containerByName.Id);
      }
      return resolve(true);
    });
  }

  static async pullImage(imageName: string) {
    return new Promise((resolve, reject) => {
      this.docker.pull(imageName, (err: any, stream: any) => {
        if (err) {
          return reject(err);
        }
        this.docker.modem.followProgress(stream, (err: any, output: any) => {
          if (err) {
            return reject(err);
          }
          console.log();
          for (const item of output) {
            console.log(item.status, item.progress || "");
          }
          console.log();
          return resolve(true);
        });
      });
    });
  }

  static async getContainerByName(name: string) {
    var opts = {
      all: true,
    };

    return new Promise((resolve, reject) => {
      this.docker.listContainers(opts, function (err: any, containers: any) {
        if (err) {
          resolve(null);
        } else {
          for (const container of containers) {
            for (const Name of container.Names) {
              if (Name === `/${name}`) {
                return resolve(container);
              }
            }
          }
          resolve(null);
        }
      });
    });
  }

  static async generateDockerFile(
    dockerConfig: any,
    envConfig: any,
    name: string,
  ) {
    const json = this.getEnv(dockerConfig, envConfig, name);
    return yaml.stringify(json);
  }

  static async generateDockerFileByContainerId(containerId: string) {
    return new Promise(async (resolve, reject) => {
      const docker = new Dockerode();
      const container = docker.getContainer(containerId);
      const info = await container.inspect();

      let dockerfile = `
FROM ${info.Config.Image}

`;

      if (info.Config.Env) {
        dockerfile += `ENV ${info.Config.Env.join("\nENV ")}\n\n`;
      }

      if (info.Config.ExposedPorts) {
        const exposedPorts = Object.keys(info.Config.ExposedPorts);
        dockerfile += `EXPOSE ${exposedPorts.join(" ")}\n`;
      }

      if (info.Config.Entrypoint) {
        dockerfile += `ENTRYPOINT ${info.Config.Entrypoint}\n`;
      }

      if (info.Config.Cmd) {
        dockerfile += `CMD ${info.Config.Cmd}\n`;
      }

      return resolve(dockerfile);
    });
  }

  //@ts-ignore
  static async getPort(port: number, occupiedPorts: number[] = [], depth = 15) {
    if (depth <= 0) {
      return Promise.reject(`Could not find a port number`);
    }

    if (occupiedPorts.includes(port)) {
      return await this.getPort(
        occupiedPorts[occupiedPorts.length - 1] + 1,
        occupiedPorts,
        ++depth,
      );
    }

    const res = await isPortReachable(port, { host: "localhost" });
    if (res) {
      return await this.getPort(port + 1, occupiedPorts, --depth);
    }

    return Promise.resolve(port);
  }

  static envParser(envConfig: any) {
    return Object.keys(envConfig).map((key: any) => {
      return `${key}=${envConfig[key]}`;
    });
  }
}

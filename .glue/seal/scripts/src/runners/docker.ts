import { join } from 'path';
import { execute } from '../helpers/execute';
import { exists } from '../helpers/fs-exists';

export default class Docker {
  private volume: string;
  private container_name: string;
  private build: string;
  private envfile: string;
  private ports: string[];

  constructor(container_name: string, servicePath: string, build: string, ports: string[], envfile: string = '') {
    this.ports = ports;
    this.container_name = container_name;
    this.build = join(servicePath, build);
    this.volume = join(servicePath, 'src');
    this.envfile = envfile !== '' ? join(servicePath, envfile) : '';
  }

  private async create() {
    console.log('> Creating Docker Build...');

    const args: string[] = [
      'build',
      '-t',
      this.container_name,
      '-f',
      this.build,
      this.volume
    ];

    console.log('docker', args.join(' '));

    await execute('docker', args, {
      cwd: this.volume,
      stdio: 'inherit',
      shell: true
    });

    console.log('> Done with Creating Docker Build...');
  }

  private async run() {
    console.log('> Initiaiting Docker Run...');

    const args: string[] = [
      'run',
      '--detach',
      '--name',
      this.container_name,
      '--hostname',
      this.container_name
    ];

    if (this.envfile !== '' && await exists(this.envfile)) {
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

    await execute('docker', args, {
      cwd: this.volume,
      stdio: 'inherit',
      shell: true
    });

    console.log('> Done with Initiating Docker Run...');
  }

  static async start(container_name: string, servicePath: string, build: string, ports: string[], envfile: string = '') {
    const docker: Docker = new Docker(container_name, servicePath, build, ports, envfile);

    await docker.create();
    await docker.run();
  }
}

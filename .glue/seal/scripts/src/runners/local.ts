import { join } from 'path';
import { execute } from '../helpers/execute';

export default class Local {
  private volume: string;
  private build: string;

  constructor(servicePath: string, build: string) {
    this.build = build;
    this.volume = join(servicePath);
  }

  private async run() {
    const args: string[] = [
      '-c',
      this.build
    ];

    await execute('sh', args, {
      cwd: this.volume,
      stdio: 'inherit'
    });
  }

  static async start(servicePath: string, build: string) {
    const local: Local = new Local(servicePath, build);
    await local.run();
  }
}

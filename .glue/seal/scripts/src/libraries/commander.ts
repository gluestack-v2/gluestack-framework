import { Command } from 'commander';
import { readdir } from 'fs/promises';

export default class Commander {
  public cwd: string = process.cwd();
  public program: Command = new Command();

  public static async register() {
    const command = new Commander();
    await command.init();
    await command.addCommands();
    await command.close();
  }

  public async init() {
    this.program
      .name('Seal')
      .version('Seal Run Version v0.0.1')
      .description('Seal CLI tool for Gluestack V2 project');
  }

  public async addCommands () {
    const files: string[] = await readdir('./src/commands');

    for await (const file of files) {
      if (!file.endsWith('.ts')) {
        continue;
      }

      const commands = await import('../commands/' + file.replace('.ts', ''));
      commands.default(this.program);
    }
  }

  public async close () {
    this.program.parseAsync();
  }
}

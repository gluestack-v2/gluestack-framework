import { join } from 'path';
import writer from '../helpers/writer';
import watcher from '../helpers/watcher';
import { info, success, warning } from '../helpers/print';
import AppCLI from '../helpers/lib/app';

export default async (app: AppCLI): Promise<void> => {
  // for await (const plugin of app.plugins) {
  //   for await (const instance of plugin.instances) {
  //     success(`Found instance`, instance.getName());

  //     if (!instance.watch || !instance.watch().length) {
  //       warning(
  //         `${instance.getName()}`,
  //         `contains no watch method or it exists but returns an empty array`
  //       );
  //       continue;
  //     }

  //     const cwd = join(process.cwd(), instance.getInstallationPath());

  //     watcher.watch(cwd, instance.watch(), async (event: string, path: string) => {
  //       info(`${instance.getName()}`, `${event.green} :: ${path.yellow}`);
  //       await writer.write(cwd, instance.getName());
  //     });
  //   }
  // }
};

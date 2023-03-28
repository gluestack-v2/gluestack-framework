const { join } = require('path');
const writer = require('../helpers/writer');
const watcher = require('../helpers/watcher');

const {
  info, success, warning
} = require('../helpers/print');

module.exports = async (app) => {
  for await (const plugin of app.plugins) {
    for await (const instance of plugin.instances) {
      success(`Found instance`, instance.getName());

      if (!instance.watch || !instance.watch().length) {
        warning(
          `${instance.getName()}`,
          `contains no watch method or it exists but returns an empty array`
        );
        continue;
      }

      const cwd = join(process.cwd(), instance.getInstallationPath());

      watcher.watch(cwd, instance.watch(), async (event, path) => {
        info(`${instance.getName()}`, `${event.green} :: ${path.yellow}`);
        await writer.write(cwd, instance.getName());
      });
    }
  }
};

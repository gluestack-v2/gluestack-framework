watch(): any {
  this.app.watch(process.cwd(), this.getInstances(), async (event, path) => {
    const plugin: IPlugin | null = this.app.getPluginByName(
      "@gluestack-v2/glue-plugin-functions"
    );
    const log = console.log.bind(console);
    // Add event listeners.
    if (event === "add") {
      // const instanceName = `${path}`.split("/")[0];
      // TODO: Hardcoded instance name
      const instanceName = "sdk";
      let destPath = [
        this.getSDKInstanceInfo(instanceName)?.destPath,
        this.getGatewayInstanceInfo("gateway")?.destPath,
      ];
      let srcPath = join(process.cwd(), path);
      if (await fileExists(srcPath)) {
        const data = fs.readFileSync(srcPath, {
          encoding: "utf8",
        });
        destPath.forEach((target) => {
          writeFile(`${target}/${path}`, data);
          // @ts-ignore
          plugin.generateFunctionsInServiceGateway();
          // @ts-ignore
          plugin.generateFunctionsInServiceSdk();
        });
      }
    }
    if (event === "change") {
      log(`File ${path} has been changed`);
      const instanceName = "sdk";
      let destPath = [
        this.getSDKInstanceInfo(instanceName)?.destPath,
        this.getGatewayInstanceInfo("gateway")?.destPath,
      ];
      let srcPath = join(process.cwd(), path);
      if (await fileExists(srcPath)) {
        const data = fs.readFileSync(srcPath, {
          encoding: "utf8",
        });
        destPath.forEach((target) => {
          writeFile(`${target}/${path}`, data);
          // @ts-ignore
          plugin.generateFunctionsInServiceGateway();
          // @ts-ignore
          plugin.generateFunctionsInServiceSdk();
        });
      }
    }
    if (event === "unlink") {
      log(`File ${path} has been removed`);

      const instanceName = "sdk";
      let destPath = [
        this.getSDKInstanceInfo(instanceName)?.destPath,
        this.getGatewayInstanceInfo("gateway")?.destPath,
      ];

      destPath.forEach(async (target) => {
        if (await fileExists(`${target}/${path}`)) {
          unlinkSync(`${target}/${path}`);
          // @ts-ignore
          plugin.generateFunctionsInServiceGateway();
          // @ts-ignore
          plugin.generateFunctionsInServiceSdk();
        }
      });
    }
  });
  return [];
}
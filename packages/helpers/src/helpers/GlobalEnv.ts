import * as fs from "fs";
import * as os from "os";

async function getEnv() {
  const path = process.cwd() + "/meta/env.json";
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify({}, null, 2) + os.EOL);
  }

  const rawdata: any = fs.readFileSync(path);
  return JSON.parse(rawdata);
}

async function saveEnv(env: any) {
  const path = process.cwd() + "/meta/env.json";
  fs.writeFileSync(path, JSON.stringify(env, null, 2) + os.EOL);
}

export class GlobalEnv {
  static getKey(instanceName: string, key: string) {
    return `${instanceName.toUpperCase()}_${key.split(" ").join("_")}`;
  }
  static async get(instanceName: string, key: string) {
    const env: any = await getEnv();
    return env[this.getKey(instanceName, key)] || null;
  }

  static async set(instanceName: string, key: string, value: string) {
    const env: any = await getEnv();
    env[this.getKey(instanceName, key)] = value;
    await saveEnv(env);
  }
}

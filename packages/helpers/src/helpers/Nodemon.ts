import { spawn } from "child_process";
import kill from "tree-kill";

export class NodemonHelper {
  static async up(
    cwd: string,
    portNumber: number,
    commanderArray: Array<string>,
  ) {
    return new Promise(async (resolve, reject) => {
      const args = commanderArray.shift();
      const process: any = spawn(args, commanderArray, {
        cwd: cwd,
        stdio: "ignore",
        detached: true,
        shell: true
      });
      if (process) {
        process.unref();
        return resolve({
          status: "up",
          portNumber: portNumber,
          processId: process.pid,
        });
      }
      return reject(new Error("Process not created"));
    });
  }

  static async down(processId: string) {
    return new Promise(async (resolve, reject) => {
      if (processId) {
        kill(parseInt(processId), "SIGKILL", (err) => reject(err));
        resolve(true);
      }
      return resolve(true);
    });
  }
}

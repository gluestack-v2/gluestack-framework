const { spawn } = require('child_process');

// Custom batcher to batch logs
class LogBatcher {
  batchInterval: number | undefined;
  timer: any;
  logs: string[];
  constructor(batchInterval: number) {
    this.batchInterval = batchInterval;
    this.logs = [];
    this.timer = null;
  }

  log(message: string) {
    this.logs.push(message);

    // If there's no active timer, start a new one
    if (!this.timer) {
      this.timer = setTimeout(this.flush.bind(this), this.batchInterval);
    }
  }

  flush() {
    this.logs = [];
    this.timer = null;
  }
}

export const executeMultipleTerminals = (
  command: string,
  args: string[],
  options: any
) => {
  const batcher = new LogBatcher(2000);
  spawn(command, args, options)
    .on('exit', (data: any) => {
      batcher.log(`exit: ${data}`);
    })
    .on('close', (data: any) => {
      batcher.log(`close: ${data}`);
    })
    .on('error', (err: any) => {
      batcher.log(`error: ${err}`);
    })
    .on('message', (message: any) => {
      batcher.log(`message: ${message}`);
    });

  //   child.stdout.on("data", (data: string) => {
  //     batcher.log(`stdout: ${data}`);
  //   });

  //   child.stderr.on("data", (data: string) => {
  //     batcher.log(`stderr: ${data}`);
  //   });

  //   child.on("close", (code: any) => {
  //     batcher.log(`exited with code ${code}`);
  //   });
};

'use server';
import { logger, runCommand, writeLogs } from './script';
export async function logScript() {
  const raw = await logger('Hello from React');
  return raw;
}

export async function runScript(command) {
  const res = await runCommand(command);
  return res;
}

export async function writeLogsScript(command) {
  const res = await writeLogs(command);
  return res;
}

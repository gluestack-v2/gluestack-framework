export default function removeFromEnv(env: any, prefix: string) {
  const result: any = {};
  for (const key in env) {
    if (!key.startsWith(prefix)) {
      result[key] = env[key];
    }
  }
  return result;
}

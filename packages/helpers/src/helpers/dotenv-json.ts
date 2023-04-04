import { parse } from 'dotenv';
import { readFile, fileExists } from "..";

export async function envToJson(path: string) {
  const data: any = {};

  if (!await fileExists(path)) {
    return data;
  }

  const jsonString = await readFile(path, {
    encoding: "utf8"
  });

  try {
    const envConfig = parse(jsonString);
    for (const key in envConfig) {
      data[key] = envConfig[key];
    }
  } catch (err) {}
  return data;
};

export function jsonToEnv(envConfig: any): string {
  let data: any = "";
  
  try {
    for (const key in envConfig) {
      data = data + `${key}="${envConfig[key]}"
`;
    }
  } catch (err) {}
  return data;
};

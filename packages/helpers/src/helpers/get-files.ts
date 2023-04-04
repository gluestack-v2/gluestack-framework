import { readdir } from "fs/promises";

export const getFiles = async (source: string) =>
  (await readdir(source, { withFileTypes: true }))
    .filter(dirent => !dirent.isDirectory())
    .map(dirent => dirent.name);
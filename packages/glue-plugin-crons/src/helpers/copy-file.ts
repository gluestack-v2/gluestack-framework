import fs from "fs";
import { basename, join } from "path";
import fileExists from "./file-exists";
import writeFile from "./write-file";

const copyFile = async (source: string, target: string): Promise<void> => {
  let targetFile = target;

  // If target is a directory, a new file with the same name will be created
  if (await fileExists(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = join(target, basename(source));
    }
  }

  await writeFile(targetFile, fs.readFileSync(source, "utf8"));
};

export default copyFile;

const path = require('path');
const os = require('os');
const fs = require('fs');

export default async (): Promise<void> => {
  const homeDirectoryPath = os.homedir();
  const sealFolderPath = path.join(homeDirectoryPath, '.seal');

  fs.rm(sealFolderPath, { recursive: true }, (err: string) => {
    if (err) {
      console.error(`Error deleting .seal folder: ${err}`);
    } else {
      console.log(`.seal folder deleted successfully`);
    }
  });
};

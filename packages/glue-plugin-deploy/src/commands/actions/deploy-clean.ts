const path = require('path');
const os = require('os');
const fs = require('fs');

export default async (): Promise<void> => {
  const homeDirectoryPath = os.homedir();
  const boltFolderPath = path.join(homeDirectoryPath, '.bolt');

  fs.rm(boltFolderPath, { recursive: true }, (err: string) => {
    if (err) {
      console.error(`Error deleting .bolt folder: ${err}`);
    } else {
      console.error(`.bolt folder deleted successfully`);
    }
  });
};

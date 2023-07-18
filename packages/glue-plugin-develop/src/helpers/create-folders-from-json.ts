import fs from 'fs/promises';

const createFoldersFromJson = async (
  config: any,
  rootPath: string = '.'
): Promise<void> => {
  for (const [folderName, subfolders] of Object.entries(config)) {
    const folderPath = `${rootPath}/${folderName}`;
    try {
      await fs.access(folderPath);
    } catch (e) {
      await fs.mkdir(folderPath);
    }
    if (subfolders && subfolders.constructor === Object) {
      await createFoldersFromJson(subfolders, folderPath);
    } else if (Array.isArray(subfolders) && subfolders.length > 0) {
      for (const subfolder of subfolders) {
        const subfolderPath = `${folderPath}/${subfolder}`;
        try {
          await fs.access(subfolderPath);
        } catch (e) {
          await fs.mkdir(subfolderPath);
        }
      }
    }
  }
};

export default createFoldersFromJson;

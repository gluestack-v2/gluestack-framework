const { join } = require('path');
const { createFolder, fileExists, copyFolder } = require('./file');
const writer = {};

// Moves folders/files into the .glue/seal/services directory and
// creates the .glue/seal/services directory if it doesn't exist

writer.write = async (path, instanceName) => {
  const sealPath = join(process.cwd(), '.glue/seal/services');
  if (!fileExists(sealPath)) {
    await createFolder(sealPath);
  }

  const instancePath = join(sealPath, instanceName, 'src', instanceName);
  if (!fileExists(instancePath)) {
    await createFolder(instancePath);
  }

  await copyFolder(path, instancePath);
};

module.exports = writer;

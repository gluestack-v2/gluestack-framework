import path from 'path';
import fs from 'fs';

import writeFile from '@gluestack-v2/framework-cli/build/helpers/file/write-file';

// Usage: Pass the file path as an argument to the function

const writeMoleculerConfig = (targetMoleculerConfig: string) => {
  let targetMoleculerConfigContent = fs.readFileSync(
    targetMoleculerConfig,
    'utf-8'
  );

  let moleculerImportStatement = `const ChannelsMiddleware = require("@moleculer/channels").Middleware;\n`;
  let moleculerMiddlewareStatenent = `ChannelsMiddleware({
    adapter: "redis://localhost:6379",
  }),
  // **---Add Middlewares Here---**
  `;

  targetMoleculerConfigContent = targetMoleculerConfigContent.replace(
    '// **---Add Imports Here---**',
    moleculerImportStatement
  );

  targetMoleculerConfigContent = targetMoleculerConfigContent.replace(
    '// **---Add Middlewares Here---**',
    moleculerMiddlewareStatenent
  );

  // Create functions service with all the actions and imports
  writeFile(targetMoleculerConfig, targetMoleculerConfigContent);
};

export default writeMoleculerConfig;

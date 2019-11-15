const { configPath, tempPath } = require('./config/config');
const { ensureDir, ensureFile } = require('./utils');
ensureDir(tempPath);
ensureFile(configPath, '{}');


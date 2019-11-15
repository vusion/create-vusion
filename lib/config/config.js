const path = require('path');
const userHome = require('user-home');
const root = path.join(__dirname, '../../');
const configPath = path.join(userHome || root, '.vusion/config.json');
module.exports = {
    configPath,
    tempPath: path.join(root, '.iceworks-tmp'),
};

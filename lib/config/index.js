const shelljs = require('shelljs');
const YAML = require('yaml');

module.exports = function (key) {
    let config = {};
    const shellOut = shelljs.exec(`npx vusion config list`);
    if (shellOut.code) {
        console.error(shellOut.stderr);
        return;
    } else {
        config = YAML.parse(shellOut.toString());
    }
    if (key === 'registry') {
        config.registries = config.registries || {};
        return config.registries[config.download_registry];
    } else {
        return config[key];
    }
};

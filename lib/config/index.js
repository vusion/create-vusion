const fs = require('fs');
const { configPath } = require('./config');
function validateConfigKey(key) {
    const keys = [
        'registry',
        'unpkgHost',
        'token',
    ];

    if (!keys.includes(key)) {
        throw new Error(`Invalid config key ${key}, support keys ${keys.join()}`);
    }
}

module.exports = function ({ action, key, value }) {
    const config = JSON.parse(fs.readFileSync(configPath).toString());
    if (action === 'list' || action === 'get') {
        if (key) {
            validateConfigKey(key);
            return config[key];
        } else {
            return config;
        }
    } else if (action === 'set') {
        validateConfigKey(key);
        config[key] = value;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
    }
};

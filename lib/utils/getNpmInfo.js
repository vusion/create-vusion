const vusion = require('vusion-api');
const service = require('../sdk');

const config = vusion.rc.configurator.load();

module.exports = function (name) {
    const headers = {};
    const token = config.access_token;
    if (token) {
        headers.token = token;
    }
    return service.loadDetail({
        query: {
            name,
        },
        headers,
    }).then(({ result }) => {
        const registry = result.registry || vusion.rc.configurator.getDownloadRegistry();
        const version = result.version;
        return {
            name,
            registry,
            version,
        };
    }).catch((e) => {
        throw new Error(`Material ${name} does not exist on platform!`);
    });
};

const config = require('../config');
const service = require('../sdk');
module.exports = function (name) {
    const headers = {};
    const token = config('access_token');
    if (token) {
        headers.token = token;
    }
    return service.loadDetail({
        query: {
            name,
        },
        headers,
    }).then(({ result }) => {
        if (!result) {
            return Promise.reject('material not exist');
        } else {
            const registry = result.registry || config('registry');
            const version = result.version;
            return {
                name,
                registry,
                version,
            };
        }
    }, () => {
        console.error('load material url error.(load from npm)');
        return {
            name,
            registry: config('registry'),
        };
    });
};

const vusion = require('vusion-api');

module.exports = function (name) {
    return vusion.ms.getTemplate(name).then((template) => {
        const registry = template.registry || vusion.rc.configurator.getDownloadRegistry();
        const version = template.version;
        return {
            name,
            registry,
            version,
        };
    });
};

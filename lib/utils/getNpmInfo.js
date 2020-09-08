module.exports = function (name) {
    const vusion = require('vusion-api');
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

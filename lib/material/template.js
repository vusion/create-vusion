const { template } = require('@vusion/categories-db');

module.exports = function (config) {
    return require('./base')(config, template.map((item) => {
        item.name += `(${item.value})`;
        return item;
    }));
};

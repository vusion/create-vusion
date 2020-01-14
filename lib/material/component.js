const { component } = require('@vusion/categories-db');

module.exports = function (config) {
    return require('./base')(config, component.map((item) => {
        item.name += `(${item.value})`;
        return item;
    }));
};

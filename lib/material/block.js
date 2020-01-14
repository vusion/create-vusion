const { block } = require('@vusion/categories-db');

module.exports = function (config) {
    return require('./base')(config, block.map((item) => {
        item.name += `(${item.value})`;
        return item;
    }));
};

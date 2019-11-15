require('./initFile');

const utils = require('./utils');
const material = require('./material');
module.exports = function (config) {
    config.dir = utils.getUserPath(config.dir);
    utils.overwrite(config.dir, 'The directory is not empty, continue?').then(() => material.download(config.material).then((tmpDir) => material.init(tmpDir, config.dir))).then(() => {
        utils.done(true);
    }, (e) => {
        // eslint-disable-next-line no-console
        console.log(e);
        utils.done(false);
    });
};

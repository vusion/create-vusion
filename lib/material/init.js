require('../initFile');
const utils = require('../utils/index');
const types = {
    block: require('./block'),
    component: require('./component'),
    template: require('./template'),
    repository: require('./repository'),
};
const material = require('.');
module.exports = function name(config) {
    config.dir = utils.getUserPath(config.dir);
    utils.overwrite(config.dir, 'The directory is not empty, continue?').then(
        () => types[config.type](config).then(
            (answers) => material.download(config.material).then(
                (tmpDir) => material.init(tmpDir, config.dir, Object.assign(answers, {
                    name: config.name,
                    access: config.access,
                    team: config.team,
                }))
            )
        ).then(() => {
            utils.done(true);
        }, (e) => {
        // eslint-disable-next-line no-console
            e && console.log(e);
            utils.done(false);
        })
    );
};

require('../initFile');
const utils = require('../utils/index');
const types = {
    block: require('./block'),
    component: require('./component'),
    template: require('./template'),
    repository: require('./repository'),
};
const material = require('.');
module.exports = async function name(config) {
    config.inVusionProject = utils.isVusionProject(process.cwd());
    config.dir = utils.getUserPath(config.dir);
    try {
        await utils.overwrite(config.dir, 'The directory is not empty, continue?');
    } catch (error) {
        process.exit(0);
    }
    try {
        const answers = await types[config.type](config);
        const tmpDir = await material.download(config.material);
        await material.init(tmpDir, config.dir, Object.assign(answers, {
            name: config.name,
            access: config.access,
            team: config.team,
            inVusionProject: config.inVusionProject,
        }), config.type !== 'template');
        utils.done(true);
    } catch (error) {
        // eslint-disable-next-line no-console
        error && console.log(error);
        utils.done(false);
    }
};

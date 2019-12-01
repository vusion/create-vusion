require('../initFile');
const utils = require('../utils/index');
const types = {
    block: require('./block'),
    component: require('./component'),
    template: require('./template'),
    repository: require('./repository'),
};
const material = require('.');
module.exports = async function init(options) {
    options.inVusionProject = utils.isVusionProject(process.cwd());

    options.name = options.packageName.replace(/\.vue$/, '');
    options.dir = utils.getUserPath(options.dir);
    try {
        await utils.overwrite(options.dir, 'The directory is not empty, continue?');
    } catch (error) {
        // error && console.error(error);
        process.exit(0);
    }
    try {
        const answers = await types[options.type](options);
        const tmpDir = await material.download(options.material);
        await material.init(tmpDir, options.dir, Object.assign(answers, {
            name: options.packageName,
            access: options.access,
            team: options.team,
            inVusionProject: options.inVusionProject,
        }), options.type !== 'template');
        utils.done(true);
    } catch (error) {
        error && console.error(error);
        utils.done(false);
    }
};

require('../initFile');
const utils = require('../utils/index');
const logger = require('../logger');
const chalk = require('chalk');

const vusion = require('vusion-api');
const types = {
    block: require('./block'),
    component: require('./component'),
    template: require('./template'),
    repository: require('./repository'),
};
const material = require('.');
module.exports = async function init(options) {
    options.inVusionProject = utils.isVusionProject(process.cwd());

    options.name = options.name.replace(/\.vue$/, '');

    if (options.type === 'block' || options.type === 'component') {
        options.tagName = options.name.replace(/^.+\//, '').replace(/\.vue$/, '');
        options.componentName = vusion.utils.kebab2Camel(options.tagName);
    }
    options.dir = utils.getUserPath(options.dir);
    try {
        await utils.overwrite(options.dir, 'The directory is not empty. Sure to continue?');
    } catch (error) {
        // error && console.error(error);
        process.exit(0);
    }
    try {
        const answers = await types[options.type](options);
        const tmpDir = await material.download(options.material);
        await material.init(tmpDir, options.dir, Object.assign(answers, {
            name: options.name,
            tagName: options.tagName,
            componentName: options.componentName,
            access: options.access,
            team: options.team,
            inVusionProject: options.inVusionProject,
        }), options.type !== 'template');
        logger.done(`Successfully initialized ${options.type} ${chalk.cyan(options.name)}.`);
        // Next
    } catch (error) {
        error && logger.error(error);
        process.exit(1);
    }
};

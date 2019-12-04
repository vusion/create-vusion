const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const utils = require('../utils');
const logger = require('../logger');
const getNpmInfo = require('../utils/getNpmInfo');

const vusion = require('vusion-api');

const types = {
    block: require('./block'),
    component: require('./component'),
    template: require('./template'),
    repository: require('./repository'),
};

const MATERIAL_SOURCES = {
    block: '@vusion-templates/block',
    component: '@vusion-templates/component',
    repository: '@vusion-templates/repository',
    'cloud-admin-lite': 'cloud-admin-lite',
};

module.exports = async function init(options = {}, args = {}) {
    options.inVusionProject = false;
    if (utils.isVusionProject(process.cwd())) {
        options.inVusionProject = true;
        options.path = path.join(`src/${options.type}s`, options.path);
    } else if (utils.isInVusionProject(process.cwd())) {
        options.inVusionProject = true;
    }

    if (options.type === 'block' || options.type === 'component') {
        options.tagName = options.name.replace(/^.+\//, '').replace(/\.vue$/, '');
        options.componentName = vusion.utils.kebab2Camel(options.tagName);
    }

    const absolutePath = utils.getUserPath(options.path);
    if (!utils.isEmpty(absolutePath)) {
        if (args.force)
            await fs.remove(absolutePath);
        else {
            const { overwrite } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'overwrite',
                    message: 'The directory is not empty. Are you sure to continue?',
                    default: false,
                },
            ]);

            if (overwrite)
                await fs.remove(absolutePath);
            else
                return;
        }
    }

    let spinner;
    try {
        let answers = {};
        if (types[options.type])
            answers = await types[options.type](options);

        if (MATERIAL_SOURCES[options.material] && MATERIAL_SOURCES[options.material].startsWith('http')) {
            spinner = ora(`Downloading the material [${chalk.cyan(options.material)}]`).start();

            // const vusion.ms.getCacheDir();
            // 目前是直接下载到需要的文件夹下
            const tempPath = await vusion.ms.download.git({
                url: MATERIAL_SOURCES[options.material],
            }, absolutePath, true);
            spinner.succeed();
        } else {
            let packageName = MATERIAL_SOURCES[options.material];
            let registry = vusion.rc.configurator.getDownloadRegistry();
            if (!packageName) {
                const info = await getNpmInfo(options.material);
                packageName = info.name + (info.version ? `@${info.version}` : '');
                if (info.registry)
                    registry = info.registry;
            }

            // 会根据版本缓存 package
            const cacheDir = vusion.ms.getCacheDir('templates');
            const tempPath = await vusion.ms.download.npm({
                registry,
                name: packageName,
            }, cacheDir);
            await fs.copy(tempPath, absolutePath);
        }

        if (options.type !== 'template') {
            spinner = ora(`Initializing the material...`).start();
            if (options.type !== 'cloud-admin-lite') // vue.config.js 有 freemarker 就会报错
                await vusion.ms.formatTemplate(absolutePath, Object.assign(options, answers));

            const _packageJSONPath = path.resolve(absolutePath, '_package.json');
            const packageJSONPath = path.resolve(absolutePath, 'package.json');
            if (fs.existsSync(_packageJSONPath))
                await fs.move(_packageJSONPath, packageJSONPath, { overwrite: true });
            if (fs.existsSync(packageJSONPath)) {
                const pkg = JSON.parse(await fs.readFile(packageJSONPath, 'utf8'));
                pkg.vusion = pkg.vusion || {};
                pkg.vusion.title = options.title || pkg.vusion.title;
                pkg.vusion.category = options.category;
                pkg.vusion.access = options.access || pkg.vusion.access;
                pkg.vusion.team = options.team || pkg.vusion.team;
                await fs.outputFile(packageJSONPath, JSON.stringify(pkg, null, 2));
            }
            spinner.succeed();
        }

        console.info();
        logger.done(`Successfully initialized ${options.type} ${chalk.cyan(options.name)}.`);

        console.info(`\n👉  Get started with the following commands:\n`);
        console.info(chalk.gray(' $ ') + chalk.cyan('cd ' + options.path));
        !options.inVusionProject && console.info(chalk.gray(' $ ') + chalk.cyan(vusion.rc.configurator.getInstallCommand()));
        if (options.type === 'repository') {
            console.info(chalk.gray(' $ ') + chalk.cyan('vusion init block'));
            console.info(chalk.gray(' $ ') + chalk.cyan('vusion init component'));
        } else
            console.info(chalk.gray(' $ ') + chalk.cyan('npm run dev'));
    } catch (error) {
        spinner && spinner.fail();
        error && logger.error(error);
    }
};

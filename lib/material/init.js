const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const glob = require('glob');
const utils = require('../utils');
const getNpmInfo = require('../utils/getNpmInfo');
const { MATERIAL_SOURCES, FORMAT_TYPES, FORMAT_NAME_TYPES } = require('../../command/type.config');

const vusion = require('vusion-api');
const cli = vusion.cli;

const types = {
    block: require('./block'),
    component: require('./component'),
    template: require('./template'),
    repository: require('./repository'),
    // 'multifile-block': require('./block'),
    // 'multifile-component': require('./component'),
};

module.exports = async function init(options = {}, args = {}) {
    options.inVusionProject = false;
    if (utils.isVusionProject(process.cwd())) {
        options.inVusionProject = true;
        options.path = path.join(`src/${options.type}s`, options.path);
    } else if (utils.isInVusionProject(process.cwd())) {
        options.inVusionProject = true;
    }

    if (FORMAT_NAME_TYPES.includes(options.type)) {
        options.tagName = options.name.replace(/^.+\//, '').replace(/\.vue$/, '');
        options.componentName = vusion.utils.kebab2Camel(options.tagName);
    }

    const dest = utils.getDest(options.path);

    let spinner;
    try {
        let answers = {};
        if (types[options.type])
            answers = await types[options.type](options);

        // 需要等回答完问题后再删除原文件
        if (!utils.isEmpty(dest)) {
            if (args.force)
                await utils.removeWithoutNodeModules(dest);
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
                    await utils.removeWithoutNodeModules(dest);
                else
                    return;
            }
        }

        if (MATERIAL_SOURCES[options.material] && MATERIAL_SOURCES[options.material].startsWith('http')) {
            spinner = ora(`Downloading the material [${chalk.cyan(options.material)}]`).start();

            // const vusion.ms.getCacheDir();
            // 目前是直接下载到需要的文件夹下
            const tempPath = await vusion.ms.download.git({
                url: MATERIAL_SOURCES[options.material],
            }, dest, true);
            spinner.succeed();
        } else {
            let packageName = MATERIAL_SOURCES[options.material];
            let registry = vusion.rc.configurator.getDownloadRegistry();
            let version = 'latest';
            if (!packageName) {
                const info = await getNpmInfo(options.material);
                packageName = info.name;
                version = info.version || version;
                if (info.registry)
                    registry = info.registry;
            }

            // 会根据版本缓存 package
            const cacheDir = vusion.ms.getCacheDir('templates');
            const tempPath = await vusion.ms.download.npm({
                registry,
                name: packageName,
                version,
            }, cacheDir);

            const packageJSONPath = path.resolve(tempPath, 'package.json');
            if (fs.existsSync(packageJSONPath)) {
                const pkg = JSON.parse(await fs.readFile(packageJSONPath, 'utf8'));
                const vusion = pkg.vusion = pkg.vusion || {};
                const ignore = !args.isUser ? [] : vusion.ignore; // 贡献者使用，默认是二次开发，所以全量复制；用户使用，不希望无关文件干扰
                if (ignore && Array.isArray(ignore)) {
                    await new Promise((res, rej) => {
                        glob('**', {
                            ignore,
                            cwd: tempPath,
                            dot: true,
                        }, (err, files) => {
                            if (err) {
                                rej(err);
                            } else {
                                files.forEach((file) => {
                                    const source = path.join(tempPath, file);
                                    const target = path.join(dest, file);
                                    if (utils.isDir(source)) {
                                        return;
                                    }
                                    fs.copySync(source, target);
                                });
                                res();
                            }
                        });
                    }).catch((e) => {
                        console.error(e);
                        process.exit(1);
                    });
                }
            } else {
                await fs.copy(tempPath, dest);
            }
        }

        {
            spinner = ora(`Initializing the material...`).start();
            if (FORMAT_TYPES.includes(options.type)) // 模板都不转换
                await vusion.ms.formatTemplate(dest, Object.assign(options, answers));

            const _packageJSONPath = path.resolve(dest, '_package.json');
            const packageJSONPath = path.resolve(dest, 'package.json');
            if (fs.existsSync(_packageJSONPath))
                await fs.move(_packageJSONPath, packageJSONPath, { overwrite: true });
            if (fs.existsSync(packageJSONPath)) {
                const pkg = JSON.parse(await fs.readFile(packageJSONPath, 'utf8'));
                pkg.vusion = pkg.vusion || {};
                pkg.vusion.title = answers.title || pkg.vusion.title;
                pkg.vusion.category = answers.category || pkg.vusion.category;
                pkg.vusion.team = answers.team || pkg.vusion.team;
                pkg.vusion.access = answers.access || pkg.vusion.access;
                pkg.name = options.name;
                if (args.isUser) {
                    delete pkg.vusion;
                }
                await fs.outputFile(packageJSONPath, JSON.stringify(pkg, null, 2));
            }
            spinner.succeed();
        }

        console.info();
        cli.done(`Successfully initialized ${options.type} ${chalk.cyan(options.name)}.`);

        console.info(`\n👉 Get started with the following commands:\n`);
        console.info(chalk.gray(' $ ') + chalk.cyan('cd ' + options.path));
        !options.inVusionProject && console.info(chalk.gray(' $ ') + chalk.cyan(vusion.rc.configurator.getInstallCommand()));
        if (options.type === 'repository') {
            console.info(chalk.gray(' $ ') + chalk.cyan('vusion init block'));
            console.info(chalk.gray(' $ ') + chalk.cyan('vusion init component'));
        } else
            console.info(chalk.gray(' $ ') + chalk.cyan('npm run dev'));
    } catch (error) {
        spinner && spinner.fail();
        error && cli.error(error);
    }
};

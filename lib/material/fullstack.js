const fs = require('fs-extra');
const path = require('path');
const cp = require('child_process');
const chalk = require('chalk');
const compressing = require('compressing');
const inquirer = require('inquirer');
const ora = require('ora');
const utils = require('../utils');

const downloadFromNPM = async function (template, dest, isUser) {
    const tmpPath = path.join(__dirname, '../../.tmp');
    fs.ensureDirSync(tmpPath);
    const result = cp.execSync(`npm pack ${template}`, {
        cwd: tmpPath,
    });
    const targetFile = path.join(tmpPath, result.toString().replace('\n', ''));
    const targetDir = targetFile.replace(/\.tgz$/, '');
    await compressing.tgz.uncompress(targetFile, targetDir);
    await fs.copy(path.join(targetDir, 'package/template'), dest);
};

const formatTemplatePackage = async function (dest, answers, name, isUser, isCacheMode) {
    const _packageJSONPath = path.resolve(dest, '_package.json');
    const packageJSONPath = path.resolve(dest, 'package.json');
    if (fs.existsSync(_packageJSONPath))
        await fs.move(_packageJSONPath, packageJSONPath, { overwrite: true });

    const _gitignore = path.resolve(dest, '_.gitignore'); // https://github.com/npm/npm/issues/3763
    if (fs.existsSync(_gitignore))
        await fs.move(_gitignore, path.resolve(dest, '.gitignore'), { overwrite: true }); // No overwrite

    if (fs.existsSync(packageJSONPath)) {
        const pkg = JSON.parse(await fs.readFile(packageJSONPath, 'utf8'));
        pkg.vusion = pkg.vusion || {};
        pkg.vusion.title = answers.title || pkg.vusion.title;
        pkg.vusion.category = answers.category || pkg.vusion.category;
        pkg.vusion.team = answers.team || pkg.vusion.team;
        pkg.vusion.access = answers.access || pkg.vusion.access;
        if (!isCacheMode) {
            pkg.template = pkg.template || {};
            pkg.template.inited = true;
        }
        pkg.name = name;
        if (isUser) {
            delete pkg.vusion;
        }
        await fs.outputFile(packageJSONPath, JSON.stringify(pkg, null, 2));
    }
};
module.exports = async function (options = {}, args = {}) {
    const dest = utils.getDest(options.path);

    let spinner;
    try {
        if (!args.notDownload) {
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
        }
        const TemplateName = options.material;
        if (!args.notDownload) {
            await downloadFromNPM(TemplateName, dest, true);
        }
        spinner = ora(`Initializing the material...`).start();
        await formatTemplatePackage(dest, { }, options.name, true, args.cache);
        await formatTemplatePackage(path.join(dest, 'server'), { }, options.name + '-server', true, args.cache);
        await formatTemplatePackage(path.join(dest, 'client'), { }, options.name + '-client', true, args.cache);
        if (args.config) {
            fs.writeFileSync(path.join(dest, 'client/platform.config.json'), args.config);
            fs.writeFileSync(path.join(dest, 'server/config/platform.config.json'), args.config);
        }
        spinner.succeed();

        console.info();
        chalk.green(`Successfully initialized ${options.type} ${chalk.cyan(options.name)}.`);

        console.info(`\n👉 Get started with the following commands:\n`);
        console.info(chalk.gray(' $ ') + chalk.cyan('cd ' + options.path));
        console.info(chalk.gray(' $ ') + chalk.cyan('npm run client:dev'));
        console.info(chalk.gray(' $ ') + chalk.cyan('npm run server:dev'));
    } catch (error) {
        spinner && spinner.fail();
        error && chalk.bold.red(error);
        process.exit(1);
    }
};

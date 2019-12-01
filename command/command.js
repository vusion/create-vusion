const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const pkg = require('../package.json');
const init = require('../lib/material/init');
const run = require('../lib');
const templates = require('./templates');
const utils = require('../lib/utils');

module.exports = async function () {
    program
        .usage('\n\t[User]: <dir> [template-name]\n\t[Contributor]: <type> <name> [dir]')
        .version(pkg.version)
        .arguments('<dir> [template-name]')
        .action((dir, templateName) => {
            run({
                dir,
                material: templateName || templates.template,
            });
        });

    ['block', 'repository', 'component'].forEach((type) => {
        program
            .command(`${type} <package-name> [dir]`)
            .description(`init a ${type}`)
            .action((packageName, dir) => {
                init({
                    type,
                    packageName,
                    dir: dir || utils.getNPMDir(packageName),
                    material: templates[type],
                    access: 'public',
                    team: '',
                });
            });
    });

    program
        .command('template <package-name> [dir]')
        .description(`init a template, default: cloud-admin-template`)
        .option('-t, --template <templateName>', 'base on template')
        .action((packageName, dir) => {
            const type = 'template';
            init({
                type,
                packageName,
                dir: dir || utils.getNPMDir(packageName),
                material: program.option.template || templates[type],
                access: 'public',
                team: '',
            });
        });

    program.parse(process.argv);

    // 没有参数的情况，统一走 init
    if (program.args[0] === undefined) {
        const { type } = await inquirer.prompt([
            {
                type: 'list',
                name: 'type',
                message: 'Select a material type',
                choices: [
                    {
                        name: 'block' + chalk.gray(' - Initialize a vusion block'),
                        value: 'block',
                    },
                    {
                        name: 'component' + chalk.gray(' - Initialize a vusion custom component'),
                        value: 'component',
                    },
                    {
                        name: 'template' + chalk.gray(' - Initialize a template from cloud-admin-template'),
                        value: 'template',
                    },
                    {
                        name: 'repository' + chalk.gray(' - Initialize a material repository to store components and blocks'),
                        value: 'repository',
                    },
                ],
            },
        ]);

        const TIPS = {
            block: ['s-search-form.vue', '@cloud-ui/s-search-form.vue'],
            component: ['s-user-transfer.vue, @cloud-ui/s-user-transfer.vue'],
            template: ['my-admin'],
            repository: ['my-materials'],
        };

        const { packageName, dir } = await inquirer.prompt([
            {
                type: 'input',
                name: 'packageName',
                message: `Please input a package name. It will be also used as the ${type} name.
  For examples: ${TIPS[type].join(', ')}
 `,
                validate(packageName) {
                    return !!packageName;
                },
            },
            {
                type: 'input',
                name: 'dir',
                message: 'Please input a directory',
                default(answers) {
                    return utils.getNPMDir(answers.packageName);
                },
            },
        ]);

        init({
            type,
            packageName,
            dir: dir || utils.getNPMDir(packageName),
            material: program.option.template || templates[type],
            access: 'public',
            team: '',
        });
    }
};

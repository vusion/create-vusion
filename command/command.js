const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const pkg = require('../package.json');
const init = require('../lib/material/init');
const utils = require('../lib/utils');

module.exports = function () {
    program
        .usage(`
[User]: <template-name> <app-name>
[Contributor]: <type> <package-name>
`)
        .version(pkg.version)
        .arguments('[template-name] [app-name]')
        .action(async (templateName, name) => {
            if (name === undefined) {
                const { packageName } = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'packageName',
                        message: `Please input the project name`,
                        default: 'my-project',
                        validate(name) {
                            return !!name;
                        },
                    },
                ]);

                name = packageName;
            }

            return init({
                type: templateName,
                material: templateName,
                name,
                path: name,
                access: 'public',
                team: '',
            });
        });

    ['block', 'component', 'repository'].forEach((type) => {
        program
            .command(`${type} [package-name]`)
            .description(`Initialize a vusion ${type}`)
            .action(async (name) => {
                if (name === undefined) {
                    const TIPS = {
                        block: ['s-search-form.vue', '@cloud-ui/s-search-form.vue'],
                        component: ['s-user-transfer.vue, @cloud-ui/s-user-transfer.vue'],
                        repository: ['my-materials'],
                    };

                    const { packageName } = await inquirer.prompt([
                        {
                            type: 'input',
                            name: 'packageName',
                            message: `Please input a package name.
  It will also be used as the ${type} name and file name.
  For examples: ${chalk.cyan(TIPS[type].join(', '))}
 `,
                            validate(name) {
                                return !!name;
                            },
                        },
                    ]);

                    name = packageName;
                }

                return init({
                    type,
                    material: type,
                    name,
                    path: utils.getFileName(name),
                    access: 'public',
                    team: '',
                });
            });
    });

    program
        .command('template [package-name]')
        .description(`Initialize a vusion template, default: cloud-admin-lite`)
        .option('-t, --template <template-name>', 'base on template')
        .action(async (name, obj) => {
            const type = 'template';

            if (!obj.template) {
                const { template } = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'template',
                        message: 'Please input a based-on template name',
                        default: 'cloud-admin-lite',
                    },
                ]);

                /* eslint-disable require-atomic-updates */
                obj.template = template;
            }

            if (name === undefined) {
                const TIPS = {
                    template: ['my-template'],
                };

                const { packageName } = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'packageName',
                        message: `Please input a package name.
  It will also be used as the ${type} name and file name.
  For examples: ${chalk.cyan(TIPS[type].join(', '))}
 `,
                        validate(name) {
                            return !!name;
                        },
                    },
                ]);

                name = packageName;
            }

            return init({
                type,
                material: obj.template,
                name,
                path: utils.getFileName(name),
                access: 'public',
                team: '',
            });
        });

    program.parse(process.argv);
};

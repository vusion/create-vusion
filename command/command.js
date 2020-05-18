const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const pkg = require('../package.json');
const init = require('../lib/material/init');
const utils = require('../lib/utils');
const { TYPE_TIPS, FORMAT_TYPES, DEFAULT_TEMPLATE, DEFAULT_SERVER_TEMPLATE } = require('./type.config');

module.exports = function () {
    program
        .usage(`
[User]: <template-name> <app-name>
[Contributor]: <type> <package-name>
`)
        .version(pkg.version);

    FORMAT_TYPES.forEach((type) => {
        program
            .command(`${type} [package-name]`)
            .description(`Initialize a vusion ${type}`)
            .option('-f, --force', 'Force overwriting if directory existing')
            .action(async (name, options) => {
                if (name === undefined) {
                    const { packageName } = await inquirer.prompt([
                        {
                            type: 'input',
                            name: 'packageName',
                            message: `Please input a package name.
  It will also be used as the ${type} name and file name.
  For examples: ${chalk.cyan(TYPE_TIPS[type].join(', '))}
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
                }, {
                    force: options.force,
                });
            });
    });

    program
        .command('template [package-name]')
        .description(`Initialize a vusion template, default: ${DEFAULT_TEMPLATE}`)
        .option('-t, --template <template-name>', 'base on template')
        .option('-f, --force', 'Force overwriting if directory existing')
        .action(async (name, options) => {
            const type = 'template';
            options.template = options.template || DEFAULT_TEMPLATE;
            // if (!options.template) {
            //     const { template } = await inquirer.prompt([
            //         {
            //             type: 'input',
            //             name: 'template',
            //             message: 'Please input a based-on template name',
            //             default: DEFAULT_TEMPLATE,
            //         },
            //     ]);

            //     /* eslint-disable require-atomic-updates */
            //     options.template = template;
            // }

            if (name === undefined) {
                const { packageName } = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'packageName',
                        message: `Please input a package name.
  It will also be used as the ${type} name and file name.
  For examples: ${chalk.cyan(TYPE_TIPS[type].join(', '))}
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
                material: options.template,
                name,
                path: utils.getFileName(name),
                access: 'public',
                team: '',
            }, {
                force: options.force,
            });
        });

    program
        .command('app [app-name]')
        .option('-c, --client-template <client-template-name>', 'base on client-template')
        .option('-s, --server-template <server-template-name>', 'base on server-template')
        .option('-f, --force', 'Force overwriting if directory existing')
        .action(async (appName, options) => {
            if (appName === undefined) {
                const { packageName } = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'packageName',
                        message: `Please input the project name`,
                        default: 'my-app',
                        validate(packageName) {
                            return !!packageName;
                        },
                    },
                ]);

                appName = packageName;
            }

            return init({
                type: 'fullstack',
                material: [options.serverTemplate || DEFAULT_SERVER_TEMPLATE, options.clientTemplate || DEFAULT_TEMPLATE],
                name: appName,
                path: appName,
                access: 'public',
                team: '',
            }, {
                force: options.force,
                isUser: true,
            });
        });
    program
        .arguments('[template-name] [app-name]')
        .option('-f, --force', 'Force overwriting if directory existing')
        .option('-d, --directory', 'Project directory if not same with app-name')
        .action(async (templateName, name, options) => {
            if (name === undefined) {
                const { packageName } = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'packageName',
                        message: `Please input the project name`,
                        default: 'my-admin',
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
                path: options.directory || name,
                access: 'public',
                team: '',
            }, {
                force: options.force,
                isUser: true,
            });
        });

    program.parse(process.argv);
};

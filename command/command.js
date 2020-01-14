const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const pkg = require('../package.json');
const init = require('../lib/material/init');
const utils = require('../lib/utils');
const { typeTips, formatTypes, defaultTemplate } = require('./type.config');

module.exports = function () {
    program
        .usage(`
[User]: <template-name> <app-name>
[Contributor]: <type> <package-name>
`)
        .version(pkg.version);

    formatTypes.forEach((type) => {
        program
            .command(`${type} [package-name]`)
            .description(`Initialize a vusion ${type}`)
            .option('-f, --force', 'Force overwriting if directory existing')
            .action(async (name, options) => {
                if (name === undefined) {
                    const TIPS = typeTips;

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
                }, {
                    force: options.force,
                });
            });
    });

    program
        .command('template [package-name]')
        .description(`Initialize a vusion template, default: ${defaultTemplate}`)
        .option('-t, --template <template-name>', 'base on template')
        .option('-f, --force', 'Force overwriting if directory existing')
        .action(async (name, options) => {
            const type = 'template';
            options.template = options.template || defaultTemplate;
            // if (!options.template) {
            //     const { template } = await inquirer.prompt([
            //         {
            //             type: 'input',
            //             name: 'template',
            //             message: 'Please input a based-on template name',
            //             default: defaultTemplate,
            //         },
            //     ]);

            //     /* eslint-disable require-atomic-updates */
            //     options.template = template;
            // }

            if (name === undefined) {
                const TIPS = typeTips;

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
        .arguments('[template-name] [app-name]')
        .option('-f, --force', 'Force overwriting if directory existing')
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
                path: name,
                access: 'public',
                team: '',
            }, {
                force: options.force,
                isUser: true,
            });
        });

    program.parse(process.argv);
};

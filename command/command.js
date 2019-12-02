const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const pkg = require('../package.json');
const init = require('../lib/material/init');
const run = require('../lib/run');
const utils = require('../lib/utils');

module.exports = function () {
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
        .action((name, obj) => {
            const type = 'template';
            return init({
                type,
                material: obj.template || 'cloud-admin-lite',
                name,
                path: utils.getFileName(name),
                access: 'public',
                team: '',
            });
        });

    program
        .usage(`
[User]: [template-name] <dir>
[Contributor]: <type> <name> [dir]
`)
        .version(pkg.version)
        .arguments('[template-name] [dest]')
        .action((templateName, dir) => {
            return run({
                dir,
                material: templateName || 'cloud-admin-lite',
            });
        });


    program.parse(process.argv);
};

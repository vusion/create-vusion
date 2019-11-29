const program = require('commander');
const pkg = require('../package.json');
const init = require('../lib/material/init');
const run = require('../lib');
const templates = require('./templates');
const utils = require('../lib/utils');
module.exports = function () {
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
            .command(`${type} <npm-name> [dir]`)
            .description(`init a ${type}`)
            .action((name, dir) => {
                init({
                    type,
                    name,
                    dir: dir || utils.getNPMDir(name),
                    material: templates[type],
                    access: 'public',
                    team: '',
                });
            });
    });
    program
        .command('template <npm-name> [dir]')
        .description(`init a template, default: cloud-admin-template`)
        .option('-t, --template <templateName>', 'base on template')
        .action((name, dir) => {
            const type = 'template';
            init({
                type,
                name,
                dir: dir || utils.getNPMDir(name),
                material: program.option.template || templates[type],
                access: 'public',
                team: '',
            });
        });
    program.parse(process.argv);
};

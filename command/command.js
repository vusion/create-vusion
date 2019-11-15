const program = require('commander');
const pkg = require('../package.json');
const init = require('../lib/material/init');
const config = require('../lib/config');
const run = require('../lib');
const templates = require('./templates');
module.exports = function () {
    program
        .usage('\n\t[User]: <dir> [templateName]\n\t[Contributor]: <type> <name> [dir]')
        .version(pkg.version)
        .arguments('<dir> [templateName]')
        .action((dir, templateName) => {
            run({
                dir,
                material: templateName || templates.template,
            });
        });
    ['block', 'repository', 'component'].forEach((type) => {
        program
            .command(`${type} <name> [dir]`)
            .description(`init a ${type}`)
            .action((name, dir) => {
                init({
                    type,
                    name,
                    dir: dir || name,
                    material: templates[type],
                });
            });
    });
    program
        .command('template <name> [dir]')
        .description(`init a template`)
        .option('-t, --template <templateName>', 'base on template')
        .action((name, dir) => {
            const type = 'template';
            init({
                type,
                name,
                dir: dir || name,
                material: program.option.template || templates[type],
            });
        });
    program
        .command('config <action> [key] [value]')
        .description(`config list, config get [key], config set <key> [value]`)
        .action((action, key, value) => {
            const result = config({
                action,
                key,
                value,
            });
            if (typeof result === 'string') {
                return result;
            } else if (result) {
                return JSON.stringify(result, null, 4);
            }
            return result;
        });
    program.parse(process.argv);
};

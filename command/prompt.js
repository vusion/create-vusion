const inquirer = require('inquirer');
const chalk = require('chalk');
const init = require('../lib/material/init');
const utils = require('../lib/utils');
const { TYPE_LIST, CONTRIBUTOR_TYPES, TYPE_TIPS, DEFAULT_TEMPLATE } = require('./type.config');

module.exports = async function () {
    let { type } = await inquirer.prompt([{
        type: 'list',
        name: 'type',
        message: 'Select a material type',
        choices: [
            {
                name: 'app' + chalk.gray(` - Initialize a project from a template`),
                value: 'app',
            },
        ].concat(TYPE_LIST),
    }]);
    if (type === 'app') {
        const { templateName } = await inquirer.prompt([{
            type: 'input',
            name: 'templateName',
            message: 'Please input a template name. Default is',
            default: DEFAULT_TEMPLATE,
        }]);
        type = templateName;
    }
    let material;
    if (type === 'template') {
        const { templateName } = await inquirer.prompt([{
            type: 'input',
            name: 'templateName',
            message: 'Please input a template name',
            default: DEFAULT_TEMPLATE,
        }]);
        material = templateName;
    }

    let message = `Please input a package name.
  It will also be used as the ${type} name and file name.
  For examples: ${chalk.cyan((TYPE_TIPS[type] || []).join(', '))}
 `;

    if (!CONTRIBUTOR_TYPES.includes(type))
        message = `Please input the project name`;

    const { name } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message,
            default: !CONTRIBUTOR_TYPES.includes(type) ? 'my-admin' : undefined,
            validate(name) {
                return !!name;
            },
        },
    ]);

    return init({
        type,
        material: material || type,
        name,
        path: utils.getFileName(name),
        access: 'public',
        team: '',
    }, {
        isUser: !CONTRIBUTOR_TYPES.includes(type),
    });
};

const inquirer = require('inquirer');
const chalk = require('chalk');
const init = require('../lib/material/init');
const utils = require('../lib/utils');
const { TYPE_LIST, CONTRIBUTOR_TYPES, TYPE_TIPS, DEFAULT_TEMPLATE, DEFAULT_SERVER_TEMPLATE } = require('./type.config');

module.exports = async function () {
    let projectPath = '';
    let { type } = await inquirer.prompt([{
        type: 'list',
        name: 'type',
        message: 'Select a material type',
        choices: [
            {
                name: 'app' + chalk.gray(` - Initialize a project from a template`),
                value: 'app',
            },
            {
                name: 'fullstack' + chalk.gray(` - Initialize a project from a server template & client template`),
                value: 'fullstack',
            },
        ].concat(TYPE_LIST),
    }]);
    if (type === 'app') {
        const { templateName } = await inquirer.prompt([{
            type: 'input',
            name: 'templateName',
            message: 'Please input a template. Default is',
            default: DEFAULT_TEMPLATE,
        }]);
        type = templateName;
        const { path } = await inquirer.prompt([{
            type: 'input',
            name: 'path',
            message: 'Please input a directory. Default is',
            default: templateName,
        }]);
        projectPath = path;
    }
    let material;
    if (type === 'fullstack') {
        const { serverTemplateName } = await inquirer.prompt([{
            type: 'input',
            name: 'serverTemplateName',
            message: 'Please input a server-template. Default is',
            default: DEFAULT_SERVER_TEMPLATE,
        }]);
        const { clientTemplateName } = await inquirer.prompt([{
            type: 'input',
            name: 'clientTemplateName',
            message: 'Please input a client-template. Default is',
            default: DEFAULT_TEMPLATE,
        }]);
        material = [serverTemplateName, clientTemplateName];
    }

    if (type === 'template') {
        const { templateName } = await inquirer.prompt([{
            type: 'input',
            name: 'templateName',
            message: 'Please input a template',
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
        path: projectPath || utils.getFileName(name),
        access: 'public',
        team: '',
    }, {
        isUser: !CONTRIBUTOR_TYPES.includes(type),
    });
};

const inquirer = require('inquirer');
const chalk = require('chalk');
const init = require('../lib/material/init');
const utils = require('../lib/utils');
const { typeList, contributorTypes, typeTips, defaultTemplate } = require('./type.config');

module.exports = async function () {
    let { type } = await inquirer.prompt([{
        type: 'list',
        name: 'type',
        message: 'Select a material type',
        choices: [
            {
                name: 'app' + chalk.gray(` - Initialize a project based on ${defaultTemplate} (default).`),
                value: 'app',
            },
        ].concat(typeList),
    }]);
    if (type === 'app') {
        const { templateName } = await inquirer.prompt([{
            type: 'input',
            name: 'templateName',
            message: 'Please input a template name',
            default: defaultTemplate,
        }]);
        type = templateName;
    }
    let material;
    if (type === 'template') {
        const { templateName } = await inquirer.prompt([{
            type: 'input',
            name: 'templateName',
            message: 'Please input a template name',
            default: defaultTemplate,
        }]);
        material = templateName;
    }

    const TIPS = typeTips;

    let message = `Please input a package name.
  It will also be used as the ${type} name and file name.
  For examples: ${chalk.cyan((TIPS[type] || []).join(', '))}
 `;

    if (!contributorTypes.includes(type))
        message = `Please input the project name`;

    const { name } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message,
            default: !contributorTypes.includes(type) ? 'my-admin' : undefined,
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
        isUser: !contributorTypes.includes(type),
    });
};

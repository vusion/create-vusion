const inquirer = require('inquirer');
const chalk = require('chalk');
const init = require('../lib/material/init');
const utils = require('../lib/utils');
const { typeList, contributorTypes } = require('./type.config');

module.exports = async function () {
    const { type } = await inquirer.prompt([{
        type: 'list',
        name: 'type',
        message: 'Select a material type',
        choices: typeList,
    }]);

    const TIPS = {
        'cloud-admin-lite': ['my-admin'],
        block: ['s-search-form', '@cloud-ui/s-search-form'],
        component: ['s-user-transfer, @cloud-ui/s-user-transfer'],
        template: ['my-template'],
        repository: ['my-materials'],
        'multifile-block': ['s-search-form.vue', '@cloud-ui/s-search-form.vue'],
        'multifile-component': ['s-user-transfer.vue, @cloud-ui/s-user-transfer.vue'],
    };

    let message = `Please input a package name.
  It will also be used as the ${type} name and file name.
  For examples: ${chalk.cyan(TIPS[type].join(', '))}
 `;

    if (type === 'cloud-admin-lite')
        message = `Please input the project name`;

    const { name } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message,
            default: type === 'cloud-admin-lite' ? 'my-admin' : undefined,
            validate(name) {
                return !!name;
            },
        },
    ]);

    return init({
        type,
        material: type === 'template' ? 'cloud-admin-lite' : type,
        name,
        path: utils.getFileName(name),
        access: 'public',
        team: '',
    }, {
        isUser: !contributorTypes.includes(type),
    });
};

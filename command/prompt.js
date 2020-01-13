const inquirer = require('inquirer');
const chalk = require('chalk');
const init = require('../lib/material/init');
const utils = require('../lib/utils');
const typeList = [
    {
        name: 'cloud-admin-lite' + chalk.gray(' - Initialize a vusion project based on cloud-admin-lite. use together with vusion block.'),
        value: 'cloud-admin-lite',
    },
    {
        name: 'block' + chalk.gray(' - Initialize a vusion block'),
        value: 'block',
    },
    {
        name: 'component' + chalk.gray(' - Initialize a vusion custom component'),
        value: 'component',
    },
    {
        name: 'template' + chalk.gray(' - Initialize a template based on cloud-admin-lite'),
        value: 'template',
    },
    {
        name: 'repository' + chalk.gray(' - Initialize a material repository to store components and blocks'),
        value: 'repository',
    },
];
const contributorTypes = typeList.map((item) => item.value).slice(1);

module.exports = async function () {
    const { type } = await inquirer.prompt([{
        type: 'list',
        name: 'type',
        message: 'Select a material type',
        choices: typeList,
    }]);

    const TIPS = {
        block: ['s-search-form.vue', '@cloud-ui/s-search-form.vue'],
        component: ['s-user-transfer.vue, @cloud-ui/s-user-transfer.vue'],
        template: ['my-template'],
        repository: ['my-materials'],
        'cloud-admin-lite': ['my-admin'],
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

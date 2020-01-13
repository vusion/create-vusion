const chalk = require('chalk');
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
    {
        name: 'multifile-block' + chalk.gray(' - Initialize a vusion multifile block'),
        value: 'multifile-block',
    },
    {
        name: 'multifile-component' + chalk.gray(' - Initialize a vusion multifile custom component'),
        value: 'multifile-component',
    },
];
const contributorTypes = typeList.map((item) => item.value).slice(1);

exports.contributorTypes = contributorTypes;
exports.formatTypes = ['block', 'component', 'repository', 'multifile-block', 'multifile-component'];
exports.typeList = typeList;

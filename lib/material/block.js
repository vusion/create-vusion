const inquirer = require('inquirer');
const { block } = require('@vusion/categories-db');

module.exports = function (config) {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Please input a title (中文名)',
        },
        {
            type: 'list',
            name: 'category',
            message: 'Select a category',
            choices: block.map((item) => {
                item.name += `(${item.value})`;
                return item;
            }),
        },
        {
            type: 'list',
            name: 'access',
            message: 'Choose the access of this material',
            default: 'public',
            choices: [
                {
                    name: '公开',
                    value: 'public',
                },
                {
                    name: '团队',
                    value: 'team',
                },
                {
                    name: '私有',
                    value: 'private',
                },
            ],
        },
        {
            type: 'input',
            name: 'team',
            message: 'Please input a team if needed',
            validate(team, ansers) {
                if (ansers.access === 'team') {
                    return !!team;
                }
                return true;
            },
            when(ansers) {
                return ansers.access !== 'private';
            },
        },

    ]);
};

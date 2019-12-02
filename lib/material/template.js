const inquirer = require('inquirer');
const { template } = require('@vusion/categories-db');

module.exports = function (config) {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Please input a title',
        },
        {
            type: 'list',
            name: 'category',
            message: 'Select a category',
            choices: template,
        },
        // {
        //     type: 'input',
        //     name: 'material',
        //     message: 'Please a template name',
        //     default: templates.template,
        //     when(ansers) {
        //         return ansers.type === 'template';
        //     },
        // },
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
                    name: '私有',
                    value: 'private',
                },
                {
                    name: '团队',
                    value: 'team',
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

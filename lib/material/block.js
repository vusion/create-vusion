const inquirer = require('inquirer');
const { block } = require('@vusion/categories-db');

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
            choices: block,
        },
    ]);
};

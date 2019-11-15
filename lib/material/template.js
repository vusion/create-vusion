const inquirer = require('inquirer');
module.exports = function (config) {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'description',
            message: 'input a description',
        },
        {
            type: 'input',
            name: 'title',
            message: 'input a title',
        },
        {
            type: 'list',
            name: 'category',
            message: 'select a category',
            choices: [
                {
                    name: '基础模板',
                    value: 'basic',
                },
                {
                    name: '其他',
                    value: 'other',
                },
            ],
        },
    ]);
};

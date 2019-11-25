const inquirer = require('inquirer');
module.exports = function (config) {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'input a title',
        },
    ]);
};

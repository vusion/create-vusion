const inquirer = require('inquirer');

module.exports = function (config, choices) {
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
            choices,
        },
        {
            type: 'input',
            name: 'team',
            message: `Please input a team if needed
  (归属某个团队，请填写团队名称；归属个人，请留空)
 `,
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
                    name: '私有',
                    value: 'private',
                },
            ],
        },
    ]);
};

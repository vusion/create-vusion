const inquirer = require('inquirer');
const templates = require('./templates');
const init = require('../lib/material/init');
module.exports = function () {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'type',
                message: 'select a material type',
                choices: [
                    {
                        name: '区块',
                        value: 'block',
                    },
                    {
                        name: '业务组件',
                        value: 'component',
                    },
                    {
                        name: '模板',
                        value: 'template',
                    },
                    {
                        name: '物料仓库',
                        value: 'repository',
                    },
                ],
            },
            {
                type: 'input',
                name: 'name',
                message: 'input a npm name',
                validate(name) {
                    return !!name;
                },
            },
            {
                type: 'input',
                name: 'dir',
                message: 'input a directory',
                default(ansers) {
                    return ansers.name;
                },
            },
            {
                type: 'input',
                name: 'material',
                message: 'input a template name',
                default: templates.template,
                when(ansers) {
                    return ansers.type === 'template';
                },
            },
            {
                type: 'list',
                name: 'access',
                message: 'select a access',
                default: 'public',
                choices: [
                    {
                        name: '公开',
                        value: 1,
                    },
                    {
                        name: '个人',
                        value: 2,
                    },
                    {
                        name: '团队',
                        value: 3,
                    },
                ],
                when(ansers) {
                    return ansers.type !== 'repository';
                },
            },
            {
                type: 'input',
                name: 'team',
                message: 'input a team',
                validate(team, ansers) {
                    if (ansers.access === 3) {
                        return !!team;
                    }
                    return true;
                },
            },
        ]).then((ansers) => {
            if (!ansers.material) {
                ansers.material = templates[ansers.type];
            }
            init(ansers);
        });
};

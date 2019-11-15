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
                    name: '列表',
                    value: 'list',
                },
                {
                    name: '信息展示',
                    value: 'info',
                },
                {
                    name: '数据展示',
                    value: 'data',
                },
                {
                    name: '表格',
                    value: 'table',
                },
                {
                    name: '表单',
                    value: 'form',
                },
                {
                    name: '模态框',
                    value: 'modal',
                },
                {
                    name: '筛选',
                    value: 'select',
                },
                {
                    name: '模态框',
                    value: 'modal',
                },
                {
                    name: '图表',
                    value: 'chart',
                },
                {
                    name: '编辑器',
                    value: 'editor',
                },
                {
                    name: '其他',
                    value: 'other',
                },
            ],
        },
    ]);
};

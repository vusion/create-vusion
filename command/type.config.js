const chalk = require('chalk');
const defaultTemplate = 'cloud-admin-lite';
const map = {
    component: {
        tip: ['s-user-transfer, @cloud-ui/s-user-transfer'],
        source: '@vusion-templates/component',
        label: 'component' + chalk.gray(' - Initialize a vusion custom component'),
    },
    repository: {
        tip: ['my-materials'],
        source: '@vusion-templates/repository',
        label: 'repository' + chalk.gray(' - Initialize a material repository to store components and blocks'),
    },
    'multifile-block': {
        tip: ['s-search-form.vue', '@cloud-ui/s-search-form.vue'],
        source: '@vusion-templates/multifile-block',
        label: 'multifile-block' + chalk.gray(' - Initialize a vusion multifile block'),
    },
    'multifile-component': {
        tip: ['s-user-transfer.vue, @cloud-ui/s-user-transfer.vue'],
        source: '@vusion-templates/multifile-component',
        label: 'multifile-component' + chalk.gray(' - Initialize a vusion multifile custom component'),
    },
    block: {
        tip: ['s-search-form', '@cloud-ui/s-search-form'],
        source: '@vusion-templates/block',
        label: 'block' + chalk.gray(' - Initialize a vusion block'),
    },
    template: {
        tip: ['my-template'],
        label: 'template' + chalk.gray(` - Initialize a template based on ${defaultTemplate}(default).`),
    },
};
const contributorTypes = [
    'block',
    'component',
    'template',
    'repository',
    'multifile-block',
    'multifile-component',
];
const typeList = contributorTypes.map((key) => ({
    value: key,
    name: map[key].label,
}));

exports.contributorTypes = contributorTypes;
exports.typeList = typeList;
const formatNameTypes = ['block', 'component', 'multifile-block', 'multifile-component'];
exports.formatNameTypes = formatNameTypes;
exports.formatTypes = formatNameTypes.concat(['repository']);
const tips = {};
const typeSources = {};
Object.keys(map).forEach((k) => {
    if (map[k].tip) {
        tips[k] = map[k].tip;
    }
    if (map[k].source) {
        typeSources[k] = map[k].source;
    }
});
exports.typeTips = tips;
exports.typeSources = typeSources;
exports.defaultTemplate = defaultTemplate;

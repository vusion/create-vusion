const chalk = require('chalk');
const DEFAULT_TEMPLATE = 'cloud-admin-lite';

const map = {
    component: {
        tip: ['s-user-transfer.vue, @cloud-ui/s-user-transfer.vue'],
        source: '@vusion-templates/component',
        label: 'component' + chalk.gray(' - Initialize a vusion custom component'),
    },
    repository: {
        tip: ['my-materials'],
        source: '@vusion-templates/repository',
        label: 'repository' + chalk.gray(' - Initialize a material repository to store components and blocks'),
    },
    // 'multifile-block': {
    //     tip: ['s-search-form.vue', '@cloud-ui/s-search-form.vue'],
    //     source: '@vusion-templates/multifile-block',
    //     label: 'multifile-block' + chalk.gray(' - Initialize a vusion multifile block'),
    // },
    // 'multifile-component': {
    //     tip: ['s-user-transfer.vue, @cloud-ui/s-user-transfer.vue'],
    //     source: '@vusion-templates/multifile-component',
    //     label: 'multifile-component' + chalk.gray(' - Initialize a vusion multifile custom component'),
    // },
    block: {
        tip: ['s-search-form.vue', '@cloud-ui/s-search-form.vue'],
        source: '@vusion-templates/block',
        label: 'block' + chalk.gray(' - Initialize a vusion block'),
    },
    template: {
        tip: ['my-template'],
        label: 'template' + chalk.gray(` - Initialize a template based on ${DEFAULT_TEMPLATE} (default).`),
    },
};
const CONTRIBUTOR_TYPES = [
    'block',
    'component',
    'template',
    'repository',
    // 'multifile-block',
    // 'multifile-component',
];

const TYPE_LIST = CONTRIBUTOR_TYPES.map((key) => ({
    value: key,
    name: map[key].label,
}));

exports.CONTRIBUTOR_TYPES = CONTRIBUTOR_TYPES;
exports.TYPE_LIST = TYPE_LIST;
const FORMAT_NAME_TYPES = ['block', 'component']; // , 'multifile-block', 'multifile-component'];
exports.FORMAT_NAME_TYPES = FORMAT_NAME_TYPES;
exports.FORMAT_TYPES = FORMAT_NAME_TYPES.concat(['repository']);

const TYPE_TIPS = {};
const MATERIAL_SOURCES = {};
Object.keys(map).forEach((k) => {
    if (map[k].tip) {
        TYPE_TIPS[k] = map[k].tip;
    }
    if (map[k].source) {
        MATERIAL_SOURCES[k] = map[k].source;
    }
});
exports.TYPE_TIPS = TYPE_TIPS;
exports.MATERIAL_SOURCES = MATERIAL_SOURCES;
exports.DEFAULT_TEMPLATE = DEFAULT_TEMPLATE;

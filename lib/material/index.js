const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const shell = require('shelljs');
const ora = require('ora');
const utils = require('../utils');
const download = require('../utils/download');
const { tempPath } = require('../config/config');
const getNpmUrl = require('../utils/getNpmUrl');

const materialUrl = {
    'block-template': 'https://github.com/vusion-templates/block-template',
    'component-template': 'https://github.com/vusion-templates/component-template',
    'repository-template': 'https://github.com/vusion-templates/repository-template',
    'cloud-admin-template': 'https://github.com/vusion-templates/cloud-admin-template',
};
const formatFile = function (file) {
    const map = {
        '_package.json': 'package.json',
    };
    return map[file] || file;
};
module.exports = {
    download(material) {
        return new Promise((res, rej) => {
            let root;
            let spinner;

            const getSpinner = function () {
                if (!spinner) {
                    spinner = ora().start();
                }
            };
            const success = function (root) {
                getSpinner();
                spinner.succeed(`material[${material}] download success`);
                res(root);
            };
            const fail = function (err) {
                getSpinner();
                spinner.fail(`material[${material}] download error`);
                rej(err);
            };
            const overwrite = function (cb) {
                utils.ensureDir(root);
                utils.overwrite(root, 'The material is exists, download again?').then(() => {
                    spinner = ora(`downloading material[${material}]`).start();
                    utils.clearDir(root);
                    cb();
                }, (e) => {
                    if (e.overwrite === false) {
                        ora(`material[${material}] download success(from cache)`).succeed();
                        res(root);
                    } else {
                        rej(e);
                    }
                });
            };
            if (materialUrl[material]) {
                root = path.join(tempPath, material);
                overwrite(() => {
                    download.git(materialUrl[material], root, success, fail);
                });
            } else {
                getNpmUrl(material).then(({ name, registry, version }) => {
                    root = path.join(tempPath, name + (version ? `@${version}` : ''));
                    overwrite(() => {
                        download.npm({
                            name,
                            registry,
                            version,
                        }, root, success, fail);
                    });
                }, fail);
            }
        });
    },
    init(tmpDir, dir, answers) {
        return new Promise((res, rej) => {
            try {
                const spinner = ora(`material init`).start();
                shell.ls('-AR', tmpDir).forEach((file) => {
                    const source = path.join(tmpDir, file);
                    const target = path.join(dir, formatFile(file));
                    if (utils.isDir(source)) {
                        return;
                    }
                    let content = fs.readFileSync(source).toString();
                    if (answers) {
                        content = _.template(content)(answers);
                    }
                    utils.ensureFile(target, content, true);
                });
                spinner.succeed(`material init done`);
                res();
            } catch (e) {
                rej(e);
            }
        });
    },
};

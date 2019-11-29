const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const ora = require('ora');
const glob = require('glob');
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
                spinner.succeed();
                res(root);
            };
            const fail = function (err) {
                getSpinner();
                spinner.fail();
                rej(err);
            };
            const overwrite = function (cb) {
                utils.ensureDir(root);
                spinner = ora(`downloading material[${material}]`).start();
                utils.clearDir(root);
                cb();
                // utils.overwrite(root, 'The material is exists, download again?').then(() => {
                // }, (e) => {
                //     if (e.overwrite === false) {
                //         res(root);
                //     } else {
                //         rej(e);
                //     }
                // });
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
    init(tmpDir, dir, answers, needParse) {
        return new Promise((res, rej) => {
            const spinner = ora(`material init`).start();
            const pkg = utils.getPackage(tmpDir, answers);
            const vusion = pkg.vusion = pkg.vusion || {};
            glob('**', {
                ignore: vusion.ignore || [],
                cwd: tmpDir,
                dot: true,
            }, (err, files) => {
                if (err) {
                    rej(err);
                } else {
                    files.forEach((file) => {
                        const source = path.join(tmpDir, file);
                        const target = path.join(dir, formatFile(file));
                        if (utils.isDir(source)) {
                            return;
                        }
                        let content = fs.readFileSync(source).toString();
                        if (needParse) {
                            try {
                                if (answers) {
                                    content = _.template(content)(answers);
                                }
                            } catch (e) {
                                rej(file + '\n' + e);
                            }
                        }
                        if (formatFile(file) === 'package.json') {
                            const pkg = JSON.parse(content);
                            if (answers) {
                                const vusion = pkg.vusion = pkg.vusion || {};
                                pkg.title = answers.title || pkg.title;
                                vusion.category = answers.category;
                                vusion.access = answers.access || vusion.access;
                                vusion.team = answers.team || vusion.team;
                                content = JSON.stringify(pkg, null, 4);
                            } else {
                                delete pkg.vusion;
                            }
                            utils.ensureFile(target, JSON.stringify(pkg, null, 4), true);
                        } else {
                            utils.ensureFile(target, content, true);
                        }
                    });
                    spinner.succeed();
                    res();
                }
            });
        });
    },
};

const path = require('path');
const fs = require('fs-extra');
const shell = require('shelljs');
const ora = require('ora');
const inquirer = require('inquirer');
const _ = require('lodash');
const pwd = process.cwd();

const utils = {
    getFileName(name) {
        return name.includes('/') ? name.split('/')[1] : name;
    },
    getUserPath(dir) {
        return path.resolve(pwd, dir);
    },
    ensureDir(dir) {
        if (!fs.existsSync(dir)) {
            shell.mkdir('-p', dir);
            return false;
        }
        return true;
    },
    clearDir(dir) {
        shell.rm('-Rf', dir + '/**');
    },
    isDir(file) {
        return fs.statSync(file).isDirectory();
    },
    isEmpty(dir) {
        if (fs.existsSync(dir)) {
            return !shell.ls('-lA', dir).length;
        }
        return true;
    },
    isVusionProject(dir) {
        const pkgPath = path.join(dir, 'package.json');
        if (!fs.existsSync(pkgPath)) {
            return false;
        }
        const vusion = require(pkgPath).vusion || {};
        return vusion.type === 'repository';
    },
    isInVusionProject(dir) {
        const pkgPath = path.join(dir, '../../package.json');
        if (!fs.existsSync(pkgPath)) {
            return false;
        }
        const vusion = require(pkgPath).vusion || {};
        return vusion.type === 'repository';
    },
};
module.exports = utils;

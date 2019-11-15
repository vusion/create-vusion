const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const ora = require('ora');
const inquirer = require('inquirer');
const pwd = process.cwd();

const utils = {
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
        shell.rm('-rf', dir + '/*');
    },
    ensureFile(file, content, overwrite) {
        utils.ensureDir(path.dirname(file));
        if (!fs.existsSync(file) || overwrite) {
            fs.writeFileSync(file, content);
        }
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
    overwrite(dir, message) {
        if (!utils.isEmpty(dir)) {
            return inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'overwrite',
                    message,
                    default: false,
                },
            ]).then((answers) => {
                if (!answers.overwrite) {
                    return Promise.reject(answers);
                }
            });
        }
        return Promise.resolve();
    },
    done(status) {
        if (status) {
            ora().succeed('enjoy yourself');
        } else {
            ora().fail('check your config and try again');
        }
        process.exit(0);
    },
};
module.exports = utils;

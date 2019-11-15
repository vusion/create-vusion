const shell = require('shelljs');
const path = require('path');
const tar = require('tar');

module.exports = {
    git(url, root, res, rej) {
        const shellOut = shell.exec(`git clone -b master --depth 1 ${url} "${root}"`, {
            silent: true,
        });
        if (shellOut.code) {
            rej(shellOut.stderr);
        } else {
            shell.rm('-rf', `${root}/.git`);
            res(root);
        }
    },
    npm({ name, registry, version }, root, res, rej) {
        const parentRoot = path.join(root, '..');
        const shellOut = shell.exec(`cd ${parentRoot} && npm pack ${name}${version ? `@${version}` : ''} ${registry ? `--registry=${registry}` : ''}`, {
            silent: true,
        });
        const npmFile = shellOut.toString().replace(/\n/g, '');

        if (shellOut.code) {
            rej && rej(shellOut.stderr);
        } else {
            tar.x({
                file: path.join(parentRoot, npmFile),
                cwd: root,
                onentry(entry) {
                    entry.path = entry.path.replace(/^package\//, '');
                },
            }).then(() => {
                res && res(root);
            });
        }
    },
};

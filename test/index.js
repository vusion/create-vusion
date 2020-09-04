const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const assert = require('assert');
const info = {
    params: '{"client":"cloud-admin-template","server":"cloud-admin-fullstack","config":"{\\"projectId\\":\\"1\\",\\"tenantId\\":\\"1\\",\\"tenant\\":\\"aa\\"}","name":"test"}',
};
const params = JSON.parse(info.params);
childProcess.execSync('./bin/create-vusion app test -f -c cloud-admin-template -s cloud-admin-fullstack --config ' + JSON.stringify(params.config) + ' --dir ' + __dirname + '/tmp', {
    stdio: 'inherit',
    pwd: __dirname,
});
const client = path.join(__dirname, './tmp/client');
const server = path.join(__dirname, './tmp/server');
assert(fs.existsSync(path.join(client, 'package.json')), 'client 初始化失败');
assert(fs.existsSync(path.join(server, 'package.json')), 'server 初始化失败');
const clientPlatformConfig = require(path.join(client, 'platform.config.json'));
const serverPlatformConfig = require(path.join(server, 'config/platform.config.json'));
assert(clientPlatformConfig.projectId && clientPlatformConfig.tenantId && serverPlatformConfig.projectId && serverPlatformConfig.tenantId, 'platform.config 添加失败');

console.log(chalk.default.green('success'));

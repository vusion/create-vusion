// require('./initFile');

// const utils = require('./utils');
// const material = require('./material');
// module.exports = async function (config) {
//     config.dir = utils.getUserPath(config.dir);
//     try {
//         await utils.overwrite(config.dir, 'The directory is not empty, continue?');
//     } catch (error) {
//         process.exit(0);
//     }
//     try {
//         const tmpDir = await material.download(config.material);
//         await material.init(tmpDir, config.dir);
//         utils.done(true);
//     } catch (error) {
//         // eslint-disable-next-line no-console
//         error && console.log(error);
//         utils.done(false);
//     }
// };

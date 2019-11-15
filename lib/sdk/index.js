const createService = require('./service');
const service = createService(
    {
        loadDetail: {
            url: {
                path: '/internal/template/info',
                method: 'GET',
            },
        },
    },
    {
        config: {
            baseURL: 'https://vusion.netease.com',
        },
    }
);
module.exports = service;

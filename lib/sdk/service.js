const Service = require('request-pre').default;
const axios = require('axios');
const requester = function (requestInfo) {
    const { url, config } = requestInfo;
    const { path, method, body = {}, headers = {}, query = {} } = url;
    let baseURL = '';
    if (config.baseURL) {
        baseURL = config.baseURL;
    }
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    const req = axios({
        params: query,
        baseURL,
        method,
        url: path,
        data: body,
        headers,
    }).then((a) => a.data);
    return req;
};
module.exports = function createService(apiSchemaList, serviceConfig) {
    return new Service(apiSchemaList, serviceConfig, requester);
};

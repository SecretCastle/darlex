/* eslint-disable no-console */
const HttpProxy = require('http-proxy');
const proxy = HttpProxy.createProxy({});

module.exports = options => {
    return function (req, res, next) {
        req.url = req.originalUrl;
        console.log('proxy: ', req.url);
        proxy.web(req, res, options, function (err) {
            err.mod = 'proxy';
            next(err);
        });
    };
};

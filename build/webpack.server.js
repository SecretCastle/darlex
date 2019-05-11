/* eslint-disable no-console */
const express = require('express');
const router = express.Router();
const webpack = require('webpack');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const app = express();
const path = require('path');
const Config = require('../config');
const ProxyUrl = Config.proxyUrl;
const Proxy = require('./proxy');

// 加载webpack配置文件
const config = require('./webpack.dev');

// 如果环境是test，则webpack的mode为none
if (Config.NODE_ENV === 'test') {
    config.mode = 'none';
}

const compiler = webpack(config);
app.use(WebpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    quiet: false,
    stats: {
        colors: true,
        chunks: false
    }
}));
app.use(require('webpack-hot-middleware')(compiler));
app.use(router);

// 是否开启代理
if (Config.proxyEnable) {
    app.use('/', Proxy(ProxyUrl));
}

// favicon
router.get('/favicon.ico', (req, res, next) => {
    res.end();
});

app.listen(Config.port);

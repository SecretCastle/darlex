'use strict';
/**
 * webpack 测试环境
 */
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const Utils = require('./utils');
const chalk = require('chalk');
const Config = require('../config');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');


const devConfig = merge(baseConfig, {
    mode: 'development',
    // 入口文件
    entry: Utils.getEntry(),
    // 功能：当某块打包到一个文件时，如果一个子文件中存在错误，可以精准的定位到错误的位置
    devtool: Config.development.sourceMap ? 'inline-source-map' : 'none',
    devServer: {
        publicPath: Config.development.publicPath,
        quiet: true,
        stats: 'errors-only'
    },
    plugins: [
        // webpack进度条
        new ProgressBarPlugin({
            format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
            clear: true
        }),
        // dev hot reload
        new webpack.HotModuleReplacementPlugin(),
        // 当开启 HMR 的时候使用该插件会显示模块的相对路径，建议用于开发环境。
        new webpack.NamedModulesPlugin()
    ]
});
// 增加htmlwebpackplugins
const webpackDevConfig = Utils.addHtmlWebpackPlugins(devConfig);

module.exports = webpackDevConfig;

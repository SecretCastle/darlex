'use strict';

/**
 * 生产环境
 */
const webpack = require('webpack');
const baseConfig = require('./webpack.base');
const merge = require('webpack-merge');
const Config = require('../config');
const Utils = require('./utils');
const CompressionPlugin = require('compression-webpack-plugin');
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const webpackConfig = merge(baseConfig, {
    mode: 'production',
    entry: Utils.getEntry(),
    plugins: [
        // 设置当前环境为production
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new MiniCssExtractPlugin({
            filename: 'assets/css/[name].[hash].css',
            chunkFilename: 'assets/css/[id].[hash].css',
            hmr: Config.NODE_ENV === 'dev',
            publicPath: Config.build.publicPath
        }),
        // 该插件会根据模块的相对路径生成一个四位数的hash作为模块id, 保证vendor的hash不会变
        new webpack.HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 20
        })
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserJSPlugin(),
            new OptimizeCSSAssetsPlugin()
        ],
        splitChunks: {
            chunks: 'all',
            minSize: 10000, // 最小10kb的chunks
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '-',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    }
});

// 是否开启bundle分析
if (Config.build.bundleAnalyze) {
    webpackConfig.plugins.push(
        new WebpackBundleAnalyzer({
            analyzerMode: 'static'
        }),
    );
}

// 是否开启sourceMap，建议不开启
if (Config.build.sourceMap) {
    // sourcemap
    webpackConfig.plugins.push(
        new webpack.SourceMapDevToolPlugin({
            filename: `${Config.build.sourceMapFolder}/[file].map`
        }),
    );
}

if (Config.build.gzipEnable) {
    webpackConfig.plugins.push(
        new CompressionPlugin({
            test: new RegExp('\\.(' + Config.build.gzipExtensions.join('|') + ')$'),
            filename: '[path].gz[query]',
            threshold: 10240, // 10MB
            algorithm: 'gzip'
        })
    );
}

if (Config.build.performanceInfo) {
    webpackConfig.performance = {
        maxEntrypointSize: 300000, // 入口资源超过300kb，发出警告
        maxAssetSize: 150000, // 单个资源超过100KB，发出警告
    };
}

// 增加htmlwebpackplugins
const webpackProdConfig = Utils.addHtmlWebpackPlugins(webpackConfig);


module.exports = webpackProdConfig;

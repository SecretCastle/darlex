const Config = require('../config');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    context: Config.contextPath,
    entry: Config.skeleton.entry,
    output: {
        filename: Config.skeleton.output,
        path: Config.skeleton.outputPath
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: ['babel-loader', 'eslint-loader']
            },
            {
                test: /\.css$/,
                loader: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[hash:base64:6]',
                            sourceMap: Config.enableCSSSourceMap ? true : false
                        },
                    },
                    'postcss-loader'
                ],
                exclude: [path.resolve(__dirname, '..', 'node_modules')]
            },
            {
                test: /\.less$/,
                loader: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[hash:base64:6]',
                            sourceMap: Config.enableCSSSourceMap ? true : false
                        }
                    },
                    'postcss-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: false
                        }
                    }
                ],
                exclude: [path.resolve(__dirname, '..', 'node_modules')]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserJSPlugin()
        ]
    }
};

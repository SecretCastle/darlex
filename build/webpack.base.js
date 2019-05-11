const path = require('path');
const CleanWebpackPlugins = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Config = require('../config');
const Utils = require('./utils');

const webpackBasicConfig = {
    context: Config.contextPath,
    output: {
        filename: 'js/[name].[hash].bundle.js',
        chunkFilename: 'js/[name].[hash].bundle.js',
        path: path.resolve(__dirname, '..', Config.outputFolderName),
        publicPath: Config.NODE_ENV === 'prod' ? Config.build.publicPath : Config.development.publicPath
    },
    // 解析
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src')
        },
        extensions: ['.js', '.jsx', '.vue', '.css', '.less', '.json', '.ejs', '.png', '.jpg', '.jpeg', '.gif'],
        modules: ['./src', 'node_modules']
    },
    plugins: [
        // 清除打包输出的文件夹
        new CleanWebpackPlugins({
            cleanOnceBeforeBuildPatterns: path.join(process.cwd(), `${Config.outputFolderName}/**/*`)
        }),
        // manifest
        new ManifestPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: ['babel-loader', 'eslint-loader']
            },
            // 不处理node_modules中的css, 使用node_modules
            {
                test: /\.css$/,
                loader: [
                    Config.NODE_ENV === 'prod' ? MiniCssExtractPlugin.loader : 'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[hash:base64:6]',
                            sourceMap: Config.enableCSSSourceMap ? true : false
                        }
                    },
                    'postcss-loader'
                ],
                // 不打包文件
                exclude: [path.resolve(__dirname, '..', 'node_modules')]
            },
            // 单独处理node_modules，不使用node_modules
            {
                test: /\.css$/,
                loader: [
                    Config.NODE_ENV === 'prod' || Config.NODE_ENV === 'test'
                        ? MiniCssExtractPlugin.loader
                        : 'style-loader',
                    'css-loader',
                    'postcss-loader'
                ],
                include: [path.resolve(__dirname, '..', 'node_modules')]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: 'file-loader',
                options: {
                    limit: 1024,
                    name: Utils.assetPath('font/[name].[hash:7].[ext]')
                }
            },

            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000, // 10kb以下文件，使用data64形式输出
                    name: Utils.assetPath('images/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.less/,
                loader: [
                    Config.NODE_ENV === 'prod' || Config.NODE_ENV === 'test'
                        ? MiniCssExtractPlugin.loader
                        : 'style-loader',
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
                            sourceMap: Config.enableCSSSourceMap ? true : false
                        }
                    }
                ],
                exclude: [path.resolve(__dirname, '..', 'node_modules')]
            }
        ]
    }
};

module.exports = webpackBasicConfig;

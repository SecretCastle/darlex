const Config = require('../config');
const glob = require('glob');
const HtmlWebpackPlugins = require('html-webpack-plugin');
const path = require('path');
/**
 * 获取单页面入口
 */
const getSpaEntry = () => {
    return Config.enableHotReload
        ? ['webpack-hot-middleware/client?reload=true', Config.getEntry()]
        : Config.getEntry();
};
/**
 * 获取多页面入口
 */
const getMuiltyEntry = () => {
    const map = {};
    const entryFiles = glob.sync(Config.getEntry(), { matchBase: true });
    for (let i = 0; i < entryFiles.length; i++) {
        const file = entryFiles[i];
        const fileName = file.substring(file.indexOf('views/') + 6, file.lastIndexOf('/'));
        map[fileName] = Config.enableHotReload ? ['webpack-hot-middleware/client?reload=true', file] : file;
    }
    return map;
};
/**
 * 获取入口函数
 */
module.exports.getEntry = () => {
    return Config.spa ? getSpaEntry() : getMuiltyEntry();
};

/**
 * spa应用，htmlwebpack输出
 */
const createSpaHtmlWebpackPlugins = () => {
    return [
        new HtmlWebpackPlugins({
            filename: 'index.html',
            title: Config.htmlWebpackPluginsConfig.title,
            template: Config.htmlWebpackPluginsConfig.template,
            minify: Config.htmlWebpackPluginsConfig.minify ? Config.htmlWebpackPluginsConfig.minifyConfig() : false,
            meta: {
                chartset: 'UTF-8',
                viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
                'X-UA-Compatible': 'ie=edge'
            }
        })
    ];
};


/**
 * 多页应用
 */
const createMuitiHtmlWebpackPlugins = () => {
    const plugins = [];
    // 获取输入文件
    const entryFiles = glob.sync(Config.getEntry(), { matchBase: true });
    for (let idx = 0; idx < entryFiles.length; idx++) {
        // 获取文件路径
        const file = entryFiles[idx];
        // 截取文件路径，获取文件名
        const fileName = file.substring(file.indexOf('views/') + 6, file.lastIndexOf('/'));
        // 增加htmlplugins
        plugins.push(
            new HtmlWebpackPlugins({
                title: Config.htmlWebpackPluginsConfig.title + '-' + fileName,
                filename: fileName + '.html',
                template: Config.htmlWebpackPluginsConfig.template,
                minify: Config.htmlWebpackPluginsConfig.minify ? Config.htmlWebpackPluginsConfig.minifyConfig() : false,
                meta: {
                    chartset: 'UTF-8',
                    viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
                    'X-UA-Compatible': 'ie=edge'
                }
            })
        );
    }
    return plugins;
};

/**
 * 骨架屏装饰器
 */
const decorateSkeletonOfHtmlPlugins = (plugins) => {
    if (plugins.length === 0) {
        return plugins;
    }
    let customHtmlContent = '<script>console.log(\'run\')</script> ';
    // if (Config.skeleton.useSkeleton) {

    // }
    plugins.map(plugin => {
        const htmlConfig = plugin.options;
        Object.assign(htmlConfig, { htmlContent: customHtmlContent });
        plugin.options = htmlConfig;
        return plugin;
    });
    return plugins;
};


/**
 * 增加htmlplugins
 */
module.exports.addHtmlWebpackPlugins = webpackConfig => {
    const plugins = Config.spa ? createSpaHtmlWebpackPlugins() : createMuitiHtmlWebpackPlugins();
    // 骨架屏装饰器注入plugins
    decorateSkeletonOfHtmlPlugins(plugins).forEach(plugin => {
        webpackConfig.plugins.push(plugin);
    });
    return webpackConfig;
};

module.exports.assetPath = _path => {
    const assetsOutputPath = Config.NODE_ENV === 'prod' ? Config.build.assetsFolderPath : Config.build.assetsFolderPath;
    return path.posix.join(assetsOutputPath, _path);
};

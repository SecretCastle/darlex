/* eslint-disable no-console */
'use strict';

const ora = require('ora');
const webpack = require('webpack');
const webpackProdConfig = require('./webpack.prod');
const chalk = require('chalk');
const spinner = ora('Build Project...').start();

webpack(webpackProdConfig, (err, stats) => {
    if (err) {
        throw err;
    }
    spinner.stop();
    process.stdout.write(
        stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n'
    );
    if (stats.hasErrors()) {
        console.log(chalk.red('  Build failed with errors.\n'));
        process.exit(1);
    }
    console.log(chalk.cyan('  Build complete.\n'));
});

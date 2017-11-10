/* eslint-disable no-console */
const ora = require('ora');
const rm = require('rimraf');
const chalk = require('chalk');
const path = require('path');
const webpack = require('webpack');


const webpackEntry     = require('../config/localhost/entry.localhost.config.js');
const webpackOutput    = require('../config/localhost/output.localhost.config.js');
const webpackModule    = require('../config/localhost/module.localhost.config.js');
const webpackResolve   = require('../config/resolve.config.js');
const webpackPlugin    = require('../config/localhost/plugin.localhost.config.js');
const webpackExternals = require('../config/externals.config');


process.env.NODE_ENV = 'production';


let webpackConfig = module.exports = {
    // devtool: 'source-map',
    entry: webpackEntry,
    output: webpackOutput,
    module: webpackModule,
    resolve: webpackResolve,
    plugins: webpackPlugin,
    externals: webpackExternals
};


let spinner = ora('building for localhost...');
spinner.start();

rm(path.resolve(__dirname, '../local/*'), err => {
    if (err) {
        throw err;
    }
    webpack(webpackConfig, function(err, stats) {
        spinner.stop();
        if (err) throw err;

        console.log(chalk.cyan('  Build complete.\n'));
        console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
        ));
    });
});
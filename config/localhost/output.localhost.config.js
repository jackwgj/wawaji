const path = require('path');

const webpackOutput = {
    path: path.resolve(__dirname, '../../local'), // 打包输出目录
    filename: 'static/js/assets/[name].[chunkhash].js', // 打包合并之后的js的命名，默认是入口文件的文件名
    chunkFilename: 'common/[id].js',  // 非入口文件的 其他的被入口文件require的文件的命名规则
    publicPath: '/' // 网站运行时的静态资源目录   该项不会影响webpack对文件的打包生成路径，而是会在html-webpack-plugin在html页面上插入js、css时候影响
};

module.exports = webpackOutput;
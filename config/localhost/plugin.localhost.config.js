const path = require('path');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const webpackEntry = require('./entry.localhost.config.js');

const productChunks = [];
const solutionChunks = [];
for (let i in webpackEntry) {
    if (i.split('/')[0] == 'product') {
        productChunks.push(i);
    } else if (i.split('/')[0] == 'solution') {
        solutionChunks.push(i);
    }
    
}
// console.log('productChunks =',productChunks);
// console.log('solutionChunks =',solutionChunks);

let webpackPlugin = [
    new ExtractTextPlugin({
        filename: 'static/css/[name].[contenthash].css',
    }),
    /* 抽取出所有通用的部分 */
    new webpack.optimize.CommonsChunkPlugin({
        name: 'common', // 需要注意的是，chunk的name不能相同！！！
        minChunks: 8
    }),
    /* 抽取出 产品页 通用的部分 -- 产品页 */
    new webpack.optimize.CommonsChunkPlugin({
        name: 'product-common', // 需要注意的是，chunk的name不能相同！！！
        minChunks: 3,
        chunks: productChunks
    }),
    /* 抽取出 解决方案页 通用的部分 -- 解决方案页 */
    new webpack.optimize.CommonsChunkPlugin({
        name: 'solution-common', // 需要注意的是，chunk的name不能相同！！！
        minChunks: 3,
        chunks: solutionChunks
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        chunks: ['common']
    }),
    new CopyWebpackPlugin([{
        from: path.resolve(__dirname, '../../src/static/css'),
        to: path.resolve(__dirname, '../../local/static/css'),
    }, {
        from: path.resolve(__dirname, '../../src/static/js'),
        to: path.resolve(__dirname, '../../local/static/js'),
    }, {
        from: path.resolve(__dirname, '../../src/static/docs'),
        to: path.resolve(__dirname, '../../local/static/docs')
    }, {
        from: path.resolve(__dirname, '../../src/static/files'),
        to: path.resolve(__dirname, '../../local/static/files')
    }, {
        from: path.resolve(__dirname, '../../src/static/images/ico'),
        to: path.resolve(__dirname, '../../local')
    }]),
    // new webpack.optimize.UglifyJsPlugin({ //webpack内置插件，压缩代码
    //     compress: {
    //         warnings: false
    //     },
    //     sourceMap: false,
    //     except: ['$super', '$', 'exports', 'require'] //排除关键字，使之不被压缩或者去除
    // }),
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery',
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    })
];

// 获取模版的部分路径数组，即在src／html下的路径
let pageArr = Object.keys(webpackEntry);
// console.log('pageArr = ', pageArr)

pageArr.forEach((page) => {
    let htmlPlugin;
    let pageHead = page.split('/')[0];
    if (pageHead === 'index') {
        htmlPlugin = new HtmlwebpackPlugin({
            filename: './index.html',
            template: path.resolve(__dirname, '../../', 'src', './index.html'),
            chunks: ['manifest', 'common', page],
            chunksSortMode: function(chunk1, chunk2){
                var order = ['manifest', 'common', page];
                var order1 = order.indexOf(chunk1.names[0]);
                var order2 = order.indexOf(chunk2.names[0]);
                return order1 - order2; 
            },
            minify: {
                // removeComments: true, // 移除html 注释
                // collapseWhitespace: true, // 移除空白符和换行符
                // removeAttributeQuotes: true  //删除html元素中属性的引号
            },
            // inject: false, // 默认为true
            // hash: true // 为静态资源生成hash值 默认为false
        });
    } else if (pageHead === 'product') {
        htmlPlugin = new HtmlwebpackPlugin({
            filename: `html/${page}.html`,
            template: path.resolve(__dirname, '../../', 'src/html', `./${page}.html`),
            chunks: ['manifest', 'common', 'product-common', page],
            chunksSortMode: function(chunk1, chunk2){
                var order = ['manifest', 'common', 'product-common', page];
                var order1 = order.indexOf(chunk1.names[0]);
                var order2 = order.indexOf(chunk2.names[0]);
                return order1 - order2; 
            },
            minify: {
                // removeComments: true, // 移除html 注释
                // collapseWhitespace: true, // 移除空白符和换行符
                // removeAttributeQuotes: true  //删除html元素中属性的引号
            },
            // inject: false, // 默认为true
            // hash: true // 为静态资源生成hash值 默认为false
        });
    } else if (pageHead === 'solution') {
        htmlPlugin = new HtmlwebpackPlugin({
            filename: `html/${page}.html`,
            template: path.resolve(__dirname, '../../', 'src/html', `./${page}.html`),
            chunks: ['manifest', 'common', 'solution-common', page],
            chunksSortMode: function(chunk1, chunk2){
                var order = ['manifest', 'common', 'solution-common', page];
                var order1 = order.indexOf(chunk1.names[0]);
                var order2 = order.indexOf(chunk2.names[0]);
                return order1 - order2; 
            },
            minify: {
                // removeComments: true, // 移除html 注释
                // collapseWhitespace: true, // 移除空白符和换行符
                // removeAttributeQuotes: true  //删除html元素中属性的引号
            },
            // inject: false, // 默认为true
            // hash: true // 为静态资源生成hash值 默认为false
        });
    } else {
        htmlPlugin = new HtmlwebpackPlugin({
            filename: `html/${page}.html`,
            template: path.resolve(__dirname, '../../', 'src/html', `./${page}.html`),
            chunks: ['manifest', 'common', page],
            chunksSortMode: function(chunk1, chunk2){
                var order = ['manifest', 'common', page];
                var order1 = order.indexOf(chunk1.names[0]);
                var order2 = order.indexOf(chunk2.names[0]);
                return order1 - order2; 
            },
            minify: {
                // removeComments: true, // 移除html 注释
                // collapseWhitespace: true, // 移除空白符和换行符
                // removeAttributeQuotes: true  //删除html元素中属性的引号
            },
            // inject: false, // 默认为true
            // hash: true // 为静态资源生成hash值 默认为false
        });
    }
    webpackPlugin.push(htmlPlugin);
});
module.exports = webpackPlugin;
const path = require('path');
const getDirectory = require('../entryDir');

const pageDir = path.join(__dirname, '../../src/entry');
// console.log('pageDir = ', pageDir)

// const ignoreFileArr = [
//     path.join(__dirname, '../../src/entry/product/product.js')
// ];

// const res = getDirectory(pageDir, ignoreFileArr);

const res = getDirectory(pageDir);
// console.log('res =', res);

let entryObj = {};
res.forEach(function(filename) {
    var pageDirLen = pageDir.length;
    var index = filename.indexOf(pageDir);
    var entryKey = filename.slice(pageDirLen + index + 1).replace(/.js$/, '');
    entryObj[entryKey] = filename;
});
console.log('webpackEntry = ', entryObj);

// webpack入口文件
let webpackEntry = entryObj;

module.exports = webpackEntry;
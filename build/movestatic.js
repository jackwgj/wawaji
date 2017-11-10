// 该命令文件只用来修改开发者文档，无需经过webpack构建
const fs = require('fs');
const path = require('path');
const stat = fs.stat;

let copy = function(src, dst) {
    //读取目录
    fs.readdir(src, function(err, paths) {
        // console.log(paths);
        if (err) {
            throw err;
        }
        paths.forEach(function(path) {
            let _src = src + '/' + path;
            let _dst = dst + '/' + path;
            let readable;
            let writable;
            stat(_src, function(err, st) {
                if (err) {
                    throw err;
                }

                if (st.isFile()) {
                    readable = fs.createReadStream(_src); //创建读取流
                    writable = fs.createWriteStream(_dst); //创建写入流
                    readable.pipe(writable);
                } else if (st.isDirectory()) {
                    exists(_src, _dst, copy);
                }
            });
        });
    });
};

let exists = function(src, dst, callback) {
    //测试某个路径下文件是否存在
    fs.exists(dst, function(exists) {
        if (exists) { //不存在
            callback(src, dst);
        } else { //存在
            fs.mkdir(dst, function() { //创建目录
                callback(src, dst);
            });
        }
    });
};

exists(path.resolve(__dirname, '../src/static/docs'), path.resolve(__dirname, '../dist/static/docs'), copy);
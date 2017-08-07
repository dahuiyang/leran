const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
//载入formidable
let formidable = require('formidable');
//public目录
let publicDir = path.join(__dirname, '..', 'public');
//清空temp目录
clearTemp(path.join(publicDir, 'temp'));

//get处理
router.get('', (req, res) => {
    res.render('upload');
})

//上传处理
router.post('', (req, res) => {
    //创建IncomingFrom对象
    let form = new formidable.IncomingForm();
    //设置编码
    form.encoding = 'utf-8';
    //设置上传临时目录
    form.uploadDir = path.join(publicDir, 'temp');
    //保留后缀
    form.keepExtensions = true;
    //限制大小
    form.maxFieldsSize = 10 * 1024 * 1024;
    //计算md5
    form.hash = 'md5';

    //filebegin事件处理
    form.on('fileBegin', (name, file) => {
        if (form.bytesExpected > 10 * 1024 * 1024) {
            //req.socket.end();
            res.status = 413;
            return form.emit('error', '文件太大');
        }
    })
    //error事件处理
    form.on('error', err => {
        if (res.status === 413) {
            res.header('Connection', 'close');
            res.end();
            return;
        }
        res.send(err);
    })
    //解析req
    form.parse(req, (err, fields, files) => {
        //错误处理
        if (err) {
            return;
        }
        //文件不存在或文件大小为零
        if (files.img && files.img.size === 0) {
            res.send('需要一个文件');
            return;
        }
        //文件后缀名
        let extName = files.img.path.substr(files.img.path.lastIndexOf('.'));
        //不被允许的文件类型处理
        if ('.jpg.jpeg.png'.indexOf(extName) === -1) {
            fs.unlinkSync(files.img.path);
            res.send('不被允许的文件类型处理');
            return;
        }
        let fileName = files.img.hash + extName;
        fs.renameSync(files.img.path, path.join(publicDir, 'images', fileName));
        res.send('http://127.0.0.1:3000/images/' + fileName);
    })
})

//清空temp文件夹
function clearTemp(tPath) {
    try {
        let temps = fs.readdirSync(tPath);
        temps.forEach(file => {
            if (!fs.statSync(path.join(tPath, file)).isDirectory()) {
                fs.unlinkSync(path.join(tPath, file));
            }
        })
    } catch (error) {
        console.error(error);
    }
}
module.exports = router;
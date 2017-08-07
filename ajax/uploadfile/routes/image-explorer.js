const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
//public目录
let publicDir = path.join(__dirname, '..', 'public');
let imagesDir = path.join(publicDir, 'images');
let imagesPath;
router.get('/', (req, res) => {
    readImageDir();
    if (imagesPath.length === 0) {
        return res.send('没有图片<br><a href="/upload">upload image</a>');
    }
    res.render('image-explorer');
})
router.get('/img', (req, res) => {
    readImageDir();
    if (!req.query.n || parseInt(req.query.n) < 0) {
        req.query.n = 0
    }
    if (imagesPath && imagesPath.length > 0 && parseInt(req.query.n) <= imagesPath.length - 1) {
        res.send('http://127.0.0.1:3000/images/' + imagesPath[req.query.n]);
    } else {
        res.sendStatus(404);
    }
})

function readImageDir() {
    imagesPath = fs.readdirSync(imagesDir);
}
module.exports = router;
const path = require('path')
const multer = require('multer')
let fs = require('fs-extra');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var docPath = `./uploads` || './images';
        fs.mkdirsSync(docPath);
        cb(null, docPath)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})
var upload = multer({
    storage,
    fileFilter: function (req, file, callback) {
        if (file.mimetype) {
            callback(null,file, true)
        }
        else {
            callback(null, false)
        }
    }
})
module.exports = upload
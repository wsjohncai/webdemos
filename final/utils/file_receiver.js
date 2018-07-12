let multer = require('multer');

let storage = multer.diskStorage({
    destination:function (req, file, cb) {
        let user = req.cookies.username;
        let path = './files/'+user+'/temp';
        cb(null, path);
    },
    filename:function (req, file, cb) {
        cb(null, file.originalname);
    }
});

module.exports = multer({storage: storage});
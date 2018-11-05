var express = require('express');
var mylog = require('../util/log');
var db = require('../util/db');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.locals.query = req.query;
    var params = {
        title: 'Player(netease api)',
        hisVisit: '查询失败'
    };
    var col = db.getCol('webstat');
    col.then(webCol => {
        if (webCol === null) {
            res.render('play', params);
            return;
        }
        var rs = [];
        webCol.find()
            .execute(doc => { rs.push(doc) })
            .then(() => {
                var total = 0;
                for (var i = 0; i < rs.length; i++) {
                    total += parseInt(rs[i].count);
                }
                params.hisVisit = total;
                res.render('play', params);
            });
    });
});

router.get('/OneMusic.apk', function(req, res) {
    var curDir = __dirname.replace(/\\/g, '/');
    var parDir = curDir.substring(0, curDir.lastIndexOf('/'));
    var apk = parDir + '/res/OneMusic.apk';
    var addr = req.connection.remoteAddress === '::1' ? '' : req.connection.remoteAddress;
    if(addr.length > 0) {
        db.stat('apkstat', addr);
    }
    res.download(apk, 'OneMusic.apk', function(err) {
        if (err) {
            mylog(err, 'downloadlog');
            res.send('download error');
        }
    });
});

module.exports = router;
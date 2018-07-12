var express = require('express');
var router = express.Router();
var db = require('./db');

router.post("/", function (req, res, next) {
    var user = req.body.user;
    var password = req.body.password;
    console.log('Try to login with '+user);
    db('select * from user where name=?',user,function (err,rows) {
        console.log(rows);
        var response;
        if (err) {
            console.log('query error');
            response = {status: "Error"};
        } else if (rows.length <= 0) {
            response = {status: "NotExists"};
        } else {
            var u = rows[0];
            if (u.passwd === password) {
                response = {status: 'Permitted'};
            } else {
                response = {status: 'AccessDenied'};
            }
        }
        res.send(response);
    })
});

module.exports = router;
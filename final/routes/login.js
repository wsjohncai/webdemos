var express = require('express');
var router = express.Router();

var db = require('../utils/test_tables');
let getTable = db('user');

/* GET home page. */
router.get('/', function (req, res) {
    var path = __dirname.toString().replace(/\\/g, '/');
    path = path.substring(0, path.lastIndexOf('/')) + '/public/login.html';
    res.sendFile(path);
});

router.post('/login', function (req, res) {
    var user = req.body.user_name;
    var passwd = req.body.password;
    var hasResult = false;
    //判断用户名密码是否合法
    getTable.then(function (table) {
        return table.select(['name', 'password', 'id'])
            .where('name like :name')
            .bind('name', user)
            .execute(row => {
                console.log(row);
                if (row && row[0].trim() === user) {
                    hasResult = true;
                    let p = row[1].trim();
                    if (p.startsWith(passwd, 0)) {
                        console.log(user + " 登录成功");
                        res.cookie('username', user, {
                            maxAge: 7*24*3600*1000,
                            httpOnly: true,
                            path:'/'
                        });
                        res.send('success');
                    } else {
                        console.log(user + " 登录失败");
                        res.send('fail');
                    }
                }
            });
    }).then(() => {
        if (!hasResult) {
            console.log(user + " 用户不存在");
            res.send('not_exist');
        }
    }).catch(err => {
        console.log(err);
    });
});

router.post('/register', function (req, res) {
    var user = req.body.user_name.toString().trim();
    var passwd = req.body.password.toString().trim();
    var hasRes = false;
    var gtable;

    getTable.then(table => {
        gtable = table;
        return table.select(['name'])
            .where('name like :n')
            .bind('n', user)
            .execute(row => {
                if (row && row[0].trim() === user) {
                    hasRes = true;
                    console.log(user + ' 重复注册');
                    res.send('exist');
                }
            });
    }).then(() => {
        if (hasRes) return null;
        return gtable.insert(['name', 'password'])
            .values([user, passwd])
            .execute();
    }).then(() => {
        if (hasRes) return null;
        return gtable.select(['name','id'])
            .where('name like :n')
            .bind('n', user)
            .execute(row => {
                if (row && row[0].trim() === user) {
                    hasRes = true;
                    console.log(user + ' 注册成功');
                    res.cookie('username', user, {
                        maxAge: 7*24*3600*1000,
                        httpOnly: true,
                        path:'/'
                    });
                    res.redirect('/home');
                }
            })
    }).then(() => {
        if (!hasRes) {
            console.log(user + ' 注册失败');
            res.send('fail');
        }
    }).catch(err => {
        console.log(err);
        res.send('error');
    })
});

module.exports = router;
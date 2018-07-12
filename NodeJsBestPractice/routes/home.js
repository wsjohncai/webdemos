let express = require('express');
let router = express.Router();
let fs = require('fs');

let getTable = require('../utils/test_tables');
let userFolder, userFileFolder, userTempFolder;

router.get('/', function (req, res) {
    let path = __dirname.toString().replace(/\\/g, '/');
    path = path.substring(0, path.lastIndexOf('/'));
    let htmlPath = path + '/public/home.html';
    res.sendFile(htmlPath);
    let name = req.cookies.username;
    userFolder = path + '/files/' + name;
    userFileFolder = userFolder + '/files';
    userTempFolder = userFolder + '/temp';
    fs.mkdir(userFolder, () => {
    });
    fs.mkdir(userFileFolder, () => {
    });
    fs.mkdir(userTempFolder, () => {
    });
});

router.get('/user', (req, res) => {
    let name = req.cookies.username.toString();
    if (name && name !== 'undefined') {
        getTable('user').then(table => {
            console.log('request for user information');
            return table.select(['name', 'real_name', 'real_age', 'birthday'
                , 'address', 'email', 'phone', 'url', 'intro'])
                .where('name like :n')
                .bind('n', name)
                .execute(row => {
                    if (row) {
                        console.log('Get user info from database successfully.');
                        res.send({
                            status: 'success',
                            username: row[0].trim(),
                            real_name: row[1] ? row[1].trim() : '',
                            real_age: row[2] ? row[2].trim() : '',
                            birthday: row[3] ? row[3].trim() : '',
                            address: row[4] ? row[4].trim() : '',
                            email: row[5] ? row[5].trim() : '',
                            phone: row[6] ? row[6].trim() : '',
                            url: row[7] ? row[7].trim() : '',
                            intro: row[8] ? row[8].trim() : ''
                        });
                    } else {
                        res.send({status: 'fail'});
                    }
                })
        }).catch(err => {
            console.log(err);
            res.send({status: 'fail'});
        });
    }
});

let user_table;

router.post('/submit', function (req, res) {
    let b = req.body;
    let hasFailed = false;
    let hasPass = b.password && b.password.length >= 6;
    let nameNotChange = b.old_user_name === b.user_name;
    getTable('user').then(table => {
        user_table = table;
        if (nameNotChange && !hasPass)
            return table;
        return table.select(['name'])
            .where('name like :n')
            .bind('n', b.user_name)
            .execute(row => {
                if (row && !nameNotChange) {
                    hasFailed = true;
                    res.send('exist');
                }
            }).then(() => {
                if (hasFailed) return null;
                if (!nameNotChange) {
                    console.log(b.user_name + ' altered username');
                    return table.update()
                        .set('name', b.user_name)
                        .where('name like "' + b.old_user_name + '"')
                        .execute();
                }
                else return table;
            }).then(() => {
                if (hasFailed) return null;
                if (hasPass) {
                    console.log(b.user_name + ' altered password');
                    return table.update()
                        .set('password', b.password)
                        .where('name like "' + b.old_user_name + '"')
                        .execute()
                }
            })
    }).then(() => {
        if (hasFailed) return null;
        console.log(b.user_name + ' altered all columns');
        return user_table.update()
            .set('real_name', getString(b.real_name))
            .set('real_age', parseInt(b.real_age.toString()))
            .set('birthday', getString(b.birthday))
            .set('address', getString(b.address))
            .set('email', getString(b.email))
            .set('phone', getString(b.phone))
            .set('url', getString(b.url))
            .set('intro', getString(b.intro))
            .where('name like :n')
            .bind('n', b.old_user_name)
            .execute()
            .then(() => {
                res.send('success');
            })
    }).catch(err => {
        res.send('error');
        console.log(err);
    })
});

function getString(o) {
    if (o && o.toString().length > 0) {
        return o.toString();
    } else
        return 'null';
}

router.get('/logout', function (req, res) {
    let username = req.cookies.username;
    if (username) {
        res.clearCookie('username', {expires: new Date(Date.now() - 900000)});
        res.send('success');
    }
});

let file_table;

let receiver = require('../utils/file_receiver');
let upload = receiver.array('uploads');
router.post('/uploadFiles', function (req, res) {
    if (req.query.type === 'file')
        upload(req, res, function (err) {
            if (err) {
                console.log(err);
                res.send({status: 'fail'});
                return;
            }
            let name = req.cookies.username;
            if (req.body.type) {
                let n = req.files[0];
                let oldPath = userTempFolder + '/' + n.originalname;
                fs.rename(oldPath, userFolder + '/head_icon', function (err) {
                    if (err) {
                        console.log(err);
                        res.send({status: 'fail'})
                    }
                    else res.send({status: 'success'});
                });
                return;
            }
            let sendP = req.body.save_path;
            if (sendP === '/')
                sendP = '';
            let suc = 0, fail = 0;
            getTable('files').then(table => {
                for (let i = 0; i < req.files.length; i++) {
                    let file = req.files[i];
                    let fname = file.originalname;
                    file_table = table;
                    let path = userFileFolder + sendP;
                    console.log('upload path:' + path);
                    let hasRow = false;
                    table.select(['username', 'filename', 'path'])
                        .where('username like :n and filename like :f and path like :p')
                        .bind('n', name)
                        .bind('f', fname)
                        .bind('p', path)
                        .execute(row => {
                            console.log('row;' + row);
                            if (row) hasRow = true;
                        }).then(() => {
                        let oldPath = userTempFolder + '/' + file.originalname;
                        //如果已经存在该文件，则直接返回成功，删除临时文件
                        if (hasRow) {
                            fs.unlink(oldPath);
                            if (i === req.files.length - 1) {
                                if (suc === i + 1)
                                    res.send({status: 'success'});
                                else
                                    res.send({status: 'fail', suc: suc, fail: fail})
                            } else suc++;
                            return;
                        }
                        let sizeT = getFileLengthFormatted(file.size);
                        let info = {
                            name: name,
                            path: path,
                            fname: fname,
                            date: getDateString(),
                            size: sizeT,
                            isDir: '0'
                        };
                        fs.stat((path = path + '/' + file.originalname), function (err) {
                            if (!err) return;
                            fs.rename(oldPath, path, function (err) {
                                if (err) {
                                    console.log('文件移动失败:' + err);
                                    fail++;
                                    if (i === req.files.length - 1)
                                        res.send({status: 'fail', suc: suc, fail: fail});
                                    return;
                                }
                                console.log('文件储存成功：' + path + file.originalname);
                                suc++;
                                file_table.insert(['username', 'path', 'filename', 'date', 'size', 'isdir'])
                                    .values([info.name, info.path, info.fname, info.date, info.size, info.isDir])
                                    .execute()
                                    .then(() => {
                                        if (i === req.files.length - 1)
                                            if (suc === i + 1)
                                                res.send({status: 'success'});
                                            else
                                                res.send({status: 'fail', suc: suc, fail: fail})
                                    });
                            });
                        });
                    })
                }
            }).catch(err => {
                console.log(err);
                res.send({status: 'fail'});
            });
        });
    else if (req.query.type === 'folder') {
        let folder = req.body.folder;
        let path = userFileFolder;
        fs.mkdir(path + '/' + folder, function (err) {
            if (err) {
                console.log(err);
                res.send({status: 'fail'});
                return;
            }
            file_table.insert(['username', 'path', 'filename', 'date', 'size', 'isdir'])
                .values([name, path, folder, getDateString(), '0B', '1'])
                .execute();
            res.send({status: 'success'});
        })
    }
});

function getFileLengthFormatted(size) {
    let temp, ts;
    let sizeT = '0B', realSize = size, unit;
    if ((temp = (ts = realSize) / 1024) < 1) {
        sizeT = '' + realSize;
        unit = 'B';
    }
    else if ((temp = (ts = temp) / 1024) < 1) {
        sizeT = '' + ts;
        unit = 'KB';
    }
    else if ((temp = (ts = temp) / 1024) < 1) {
        sizeT = '' + ts;
        unit = 'MB';
    }
    else {
        sizeT = '' + temp;
        unit = 'GB';
    }
    if (sizeT.indexOf('.') !== -1)
        sizeT = sizeT.substring(0, sizeT.indexOf('.') + 2);
    sizeT += unit;
    console.log(sizeT);
    return sizeT;
}

function getDateString() {
    let date = new Date(Date.now());
    let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    let minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    let second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}

router.get('/request_files', function (req, res) {
    let username = req.cookies.username;
    let path = req.query.path;
    if (path === '/')
        path = userFileFolder;
    else
        path = userFileFolder + path;
    let info = {status: 'fail', files: []};
    getTable('files').then(table => {
        file_table = table;
        return table.select(['username', 'path', 'filename', 'date', 'size', 'isdir'])
            .where('username like :n and path like :p')
            .bind('n', username)
            .bind('p', path)
            .execute(row => {
                if (row) {
                    info.files.push({
                        name: removeZero(row[2]),
                        date: row[3].substring(0, 19),
                        size: row[4].substring(0, row[4].indexOf('B') + 1),
                        isdir: row[5].trim().charAt(0)
                    })
                }
            }).then(() => {
                info.status = 'success';
                res.send(info);
            });
    }).catch(err => {
        console.log(err);
        res.send(info);
    });
});

function removeZero(v) {
    v = v.trim();
    for (let i = v.length - 1; i > 0; i--) {
        if (v.charAt(i) !== '0')
            return v.substring(0, i + 1);
    }
}

router.post('/delete', function (req, res) {
    let path = req.body.path;
    let rfiles = req.body.dels;
    let files = [];
    if (req.body.num === 'single')
        files = [rfiles];
    else files = rfiles;
    if (path === '/')
        path = '';
    let name = req.cookies.username;
    let rpath = userFileFolder + path;
    getTable('files').then(table => {
        let suc = 0;
        for (let i = 0; i < files.length; i++) {
            let fname = files[i];
            let isDir = false;
            file_table = table;
            table.select(['username', 'path', 'filename', 'isdir'])
                .where('username like :n and path like :p and filename like :f')
                .bind('n', name)
                .bind('p', rpath)
                .bind('f', fname)
                .execute(row => {
                    if (row) {
                        isDir = row[3].charAt(0) === '1'
                    }
                }).then(() => {
                    let dpath = rpath + '/' + fname;
                    let preDel = file_table.delete()
                        .where('username like :n and path like :p and filename like :f')
                        .bind('n', name)
                        .bind('p', rpath)
                        .bind('f', fname);
                    console.log('delete file:' + dpath);
                    if (isDir) {
                        fs.rmdirSync(dpath);
                        return preDel.execute().then(() => {
                            suc++;
                        });
                    }
                    else {
                        fs.unlinkSync(dpath);
                        return preDel.execute().then(() => {
                            suc++;
                        });
                    }
                }
            ).then(() => {
                if (i === files.length - 1)
                    if (suc === files.length)
                        res.send({status: 'success'});
                    else
                        res.send({status: 'fail', suc: suc});
            })
        }
    }).catch(err => {
        console.log(err);
        res.send({status: 'fail'});
    })
})
;

router.get('/file', function (req, res) {
    let query = req.query.type;
    if (query === 'head_icon') {
        fs.stat(userFolder + '/head_icon', function (err) {
            if (err) {
                console.log(err);
                res.send('fail');
                return;
            }
            let data = fs.readFileSync(userFolder + '/head_icon');
            res.send('data:image/png;base64,' + data.toString('base64'));
        })
    }
});

module.exports = router;
let mysqlx = require('@mysql/xdevapi');
let mylog = require('./log');

let option = {
    user: 'wsjohncai',
    password: '1092647174',
    host: 'localhost',
    port: '33060'
};

let db = {};

db.getCol = function(coll) {
    return mysqlx.getSession(option)
        .then(session=> {
            if(session === null) {
                mylog('Session not Found!', 'dblog');
                return Promise.resolve(null);
            }
            return session.getSchema('onemusic')
                .createCollection(coll, { ReuseExistingObject: true });
        })
        .catch((err)=>{
            mylog(err, 'dblog');
            return Promise.resolve(null);
        });
}

db.stat = function(coll, addr) {
    let colt = this.getCol(coll);
    let time = new Date().getTime();
    colt.then(col => {
        if(col === null) return;
        let rs = [];
        col.find('addr like :a')
            .bind('a', addr)
            .execute(r => {
                rs.push(r);
            })
            .then(() => {
                if (rs.length > 0) {
                    let count = rs[0].count + 1;
                    col.modify('addr like :a')
                        .set('count', count)
                        .set('latest_time', time)
                        .bind('a', addr)
                        .execute();
                } else {
                    col.add({ 'addr': addr, 'count': 1, 'latest_time': time }).execute();
                }
            });
    });
}

module.exports = db;
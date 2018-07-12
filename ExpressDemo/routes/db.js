var db = require('mysql');
var pool = db.createPool({
    host: 'localhost',
    user: 'wsjohncai',
    password: '10926414',
    database: 'test'
});
var query = function (sql, params,  callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            console.log('Failed to connect mysql database');
        } else {
            conn.query(sql, params, function (err, rows) {
                callback(err, rows)
            });
            conn.release();
        }
    })
};
module.exports = query;

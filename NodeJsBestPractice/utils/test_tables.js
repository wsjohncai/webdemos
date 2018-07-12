let mysqlx = require('@mysql/xdevapi');

let option = {
    user: 'wsjohncai',
    password: '1092647174',
    host: 'localhost',
    port: '33060'
};

let table = function (table) {
    if (table && table.length > 0)
        return mysqlx.getSession(option)
            .then(function (session) {
                let db = session.getSchema('test');
                return db.getTable(table);
            });
};

module.exports = table;
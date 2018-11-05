let db = require('./db');
let mylog = require('./log');

let tool = {
    fullstat: function(table) {
        if (table.match(/(webstat)|(apistat)/g) === null) {
            console.log('Can\'t stat on this table: ' + table + '.');
            return;
        }
        db.getCol(table)
            .then(col => {
                if (col === null) return;
                let rs = [];
                col.find().sort('latest_time').execute(doc => {
                    rs.push(doc);
                }).then(() => {
                    let logText = 'Stat Time: ' + new Date().toLocaleString() + '\n';
                    logText += 'Stat on table: '+ table + '\n';
                    logText += '------  Addr  ---------  Time  ---------  Count  ------\n';
                    let total = 0;
                    for (var i = 0; i < rs.length; i++) {
                        logText += rs[i].addr + '   ' + new Date(rs[i].latest_time).toLocaleString() +
                            '   ' + rs[i].count + '\n';
                            total += parseInt(rs[i].count);
                    }
                    logText += 'Total visit times: ' + total + '. End\n';
                    console.log(logText);
                    mylog(logText, 'stat');
                    return;
                })
            }).catch(err => {
                console.log(err);
            });
    }
};

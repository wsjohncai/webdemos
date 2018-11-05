let fs = require('fs');

let mylog = function (msg, filename) {
    let curDir = __dirname.replace(/\\/g,'/');
    let parDir = curDir.substring(0, curDir.lastIndexOf('/'));
    let def = 'log';
    if(filename)
        def = filename;
    if(def.indexOf('/') === 0) def = def.match(/(?<=\/)[0-9a-zA-Z_].+/g)[0];
    let logDir = parDir +'/log/';
    let logFile = logDir+ def;
    fs.mkdir(logDir, ()=>{});
    msg = '----' + new Date() + '----\n' + msg + '\n';
    fs.appendFile(logFile, msg, (err) => {});
}

module.exports = mylog;
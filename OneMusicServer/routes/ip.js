let express = require('express');
let http = require('http');

let router = express.Router();

router.get('/', function(req, res){
    let addr = req.connection.remoteAddress === '::1' ? '' : req.connection.remoteAddress;
    let opt = {
        host: 'ip-api.com',
        path: '/json/'+addr,
        method: 'GET',
        headers: {}
    };

    let req1 = http.request(opt, function(res1){
        res1.setEncoding('utf8');
        
        let resData = '';
        res1.on('data', function(d){
            resData += d;
        }).on('end', function(){
            let resJson = JSON.parse(resData);
            res.send(resJson);
        });
    });

    req1.on('error', function(err) {
        res.send({ status: 'fail' });
    });

    req1.end();
});

module.exports = router;
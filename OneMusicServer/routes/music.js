let express = require('express');
let qm = require('../engine/queryFromQM.js');
let ne = require('../engine/queryFromNE.js');

let router = express.Router();

router.get('/search', function(req, res) {
    let final = {
        ne: { status: 'fail', data: {} },
        qm: { status: 'fail', data: {} }
    }
    ne.search(req.query, function(d1) {
        if (d1.status && d1.status === 'error') {
            final.ne.status = 'fail';
        } else {
            final.ne.status = 'ok';
            final.ne.data = d1;
        }
        qm.search(req.query, function(d2) {
            if (d2.status && d2.status === 'error') {
                final.qm.status = 'fail';
            } else {
                final.qm.status = 'ok';
                final.qm.data = d2;
            }
            res.send(final);
        });
    });
});

router.get('/*', function(req, res) {
    let url = req.url;
    if (req.query.src === 'ne') {
        ne.query(url, req.query, function(data) {
            if (data.status && data.status === 'error') {
                res.send({ status: 'fail' });
            } else {
                res.send({ 'status': 'ok', 'data': data });
            }
        });
    } else if (req.query.src === 'qm') {
        qm.query(url, req.query, function(data) {
            if (data.status && data.status === 'error') {
                res.send({ status: 'fail' });
            } else {
                res.send({ 'status': 'ok', 'data': data });
            }
        });
    } else
        res.send({ status: 'fail' });
});

module.exports = router;
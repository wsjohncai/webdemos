var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('play', { 
        title: 'Player(netease api)'
    });
});

module.exports = router;

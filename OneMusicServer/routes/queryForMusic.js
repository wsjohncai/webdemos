let express = require('express');
let router = express.Router();
let http = require('http');

let neteaseTool = require('../engine/netease_api');

router.get('/search_songs', function(req, res) {
	let opt = {
		'key' : req.query.key,
		'type' : req.query.type ? req.query.type : 1,
		'offset' : req.query.offset ? req.query.offset : 0,
		'limit' : req.query.limit ? req.query.limit : 0
	}
	let data = neteaseTool(opt, function(data) {
		res.send(data);
	});
});

module.exports = router;
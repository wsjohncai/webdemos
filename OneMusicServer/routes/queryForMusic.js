let express = require('express');
let router = express.Router();

let neteaseTool = require('../engine/netease_api');

router.get('/search-songs', function (req, res) {
    let keyword = req.query.key;
    let offset = req.query.offset;
    let limit = req.query.limit;
    let data = neteaseTool(keyword, 1, limit, offset);
    console.log(data);
    res.send(data);
});

module.exports = router;
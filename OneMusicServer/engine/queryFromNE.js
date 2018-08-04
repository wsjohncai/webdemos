let neteaseTool = require('./netease_api');

exports.search = function(query, cb){
    if (!query.keyword) {
        cb({ status: 'fail' });
        return;
    }
    let opt = {
        'keyword': query.keyword,
        'type': query.type ? query.type : 0,
        'offset': query.offset ? query.offset.toString() : '0',
        'limit': query.limit ? query.limit.toString() : '10'
    };
    neteaseTool(opt, function(data) {
        cb(data);
    });
}

exports.query = function(url, query, cb) {
    if (query.songid) {
        let opt = {};
        if (url.indexOf('url') !== -1)
            opt = {
                songid: query.songid,
                songbr: query.songbr ? query.songbr : 128000,
                type: 2
            };
        else if (url.indexOf('comment') !== -1)
            opt = {
                songid: query.songid,
                offset: query.offset ? query.offset.toString() : 0,
                limit: query.limit ? query.limit.toString() : 20,
                type: 4
            };
        else
            opt = {
                songid: query.songid,
                type: url.indexOf('detail') !== -1 ? 1 : url.indexOf('lyric') !== -1 ? 3 : -1
            };
        console.log(opt);
        neteaseTool(opt, function(data) {
            cb(data);
        });
        return;
    }
    cb({ status: 'fail' });
};
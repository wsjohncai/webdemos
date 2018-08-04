let api = require('./qqmusic_api');

exports.search = function(query, cb) {
    let opt = {};
    if (!query.keyword) {
        cb({ status: 'fail' });
        return;
    }
    opt.keyword = query.keyword;
    opt.type = query.type === 'undefined' ? 0 : query.type == 0 || query.type == 5 ? query.type : 0;
    opt.page = query.offset ? query.offset : 0;
    opt.pnum = query.limit ? query.limit : 10;
    opt.type == 0 ? opt.hasBraket = 'true' : opt;

    api(opt, function(data) { cb(data); });
}

exports.query = function(url, query, cb) {
    if (query.songmid && (url.indexOf('detail') != -1 || url.indexOf('lyric') != -1)) {
        if (url.indexOf('detail') != -1)
            query.type = 1;
        else query.type = 3;
        query.hasBraket = 'true';
        api(query, function(data) {
            if (url.indexOf('lyric') !== -1) {
                let buf = new Buffer(data.lyric, 'base64');
                data.lyric = buf.toString();
                if (data.trans && data.trans.length !== 0) {
                    buf = new Buffer(data.trans, 'base64');
                    data.trans = buf.toString();
                }
            }
            cb(data);
        });
    } else if (query.songmid && query.media_mid && url.indexOf('url') != -1) {
        query.type = 2;
        api(query, function(data) {
            let item = data.data.items[0];
            let ud = {
                url: 'http://dl.stream.qqmusic.qq.com/'+item.filename +
                '?vkey='+item.vkey+'&guid='+data.guid,
                cid: data.cid,
                userip: data.userip,
                songmid: item.songmid
            }
            cb(ud);
        });
    } else if (query.songid && url.indexOf('comment') != -1) {
        let opt = {
            songid: query.songid,
            page: query.offset ? query.offset : 0,
            pnum: query.limit ? query.limit : 20,
            type: 4
        };
        api(opt, function(data) { cb(data); });
    } else
        cb({ status: 'fail' });
}
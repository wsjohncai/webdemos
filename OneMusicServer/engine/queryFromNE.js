let neteaseTool = require('./netease_api');

exports.search = function(query, cb) {
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
        let rs = {};
        rs.songs = data.result.songs?data.result.songs:[];
        rs.total = data.result.songCount;
        rs.code = data.code;
        cb(rs);
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
        neteaseTool(opt, function(data) {
            let rs = {}
            if (opt.type === 2) {
                rs.url = data.data[0].url;
                rs.code = data.code;
            } else if (opt.type === 4) {
                rs.hots = data.hotComments ? data.hotComments : null;
                rs.comments = data.comments;
                rs.code = data.code;
                rs.total = data.total;
            } else if (opt.type === 1){
                rs.song = data.songs[0];
                rs.code = data.code;
                rs.privilege = data.privileges[0];
            } else if(opt.type === 3){
                rs.code = data.code;
                rs.lyric = data.lrc.lyric;
                rs.tlrc = data.tlyric.lyric;
            }
            cb(rs);
        });
        return;
    }
    cb({ status: 'fail' });
};
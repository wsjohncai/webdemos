let neteaseTool = require('./netease_api');

exports.search = function(query, cb) {
    if (!query.keyword) {
        cb({ status: 'fail' });
        return;
    }
    let lim = query.limit ? query.limit : 10
    let off = query.offset ? query.offset * lim : 0
    let opt = {
        'keyword': query.keyword,
        'type': query.type ? query.type : 0,
        'offset': off.toString(),
        'limit': lim.toString()
    };
    neteaseTool(opt, function(data) {
        let rs = {};
        // console.log(data)
        rs.songs = data.result ? (data.result.songs ? data.result.songs : []) : [];
        rs.total = data.result ? (data.result.songCount) : 0
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
        else if (url.indexOf('comment') !== -1){
            let lim = query.limit ? query.limit : 20
            let off = query.offset ? query.offset * lim : 0
            opt = {
                songid: query.songid,
                offset: off,
                limit: lim,
                type: 4
            };
        }
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
            } else if (opt.type === 1) {
                rs.song = data.songs[0];
                rs.code = data.code;
                rs.privilege = data.privileges[0];
            } else if (opt.type === 3) {
                rs.code = data.code;
                // console.log(data.uncollected);
                if (data.nolyric && data.nolyric === true || data.uncollected) {
                    rs.lyric = null
                    rs.tlrc = null
                } else {
                    rs.lyric = data.lrc? data.lrc.lyric ? data.lrc.lyric : null : null;
                    rs.tlrc = data.tlyric.lyric ? data.tlyric.lyric : null;
                }
            }
            cb(rs);
        });
        return;
    }
    cb({ status: 'fail' });
};
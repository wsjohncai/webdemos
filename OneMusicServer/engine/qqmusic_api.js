let http = require('http');
var querystring = require('querystring');

module.exports = function(query, handler) {
    let path = '';
    let qs = {};
    let opt = {
        host: 'c.y.qq.com',
        path: '',
        method: 'GET',
        headers: {}
    };

    switch (query.type) {
        case 1: //单首歌曲信息
            path = '/v8/fcg-bin/fcg_play_single_song.fcg';
            qs.format = 'jsonp';
            qs.songmid = query.songmid;
            break;
        case 5: //搜索框搜索结果
            path = '/splcloud/fcgi-bin/smartbox_new.fcg';
            qs.key = query.keyword;
            break;
        case 0: //歌曲列表搜索
            path = '/soso/fcgi-bin/client_search_cp';
            qs.new_json = 1;
            qs.aggr = 1;
            qs.cr = 1;
            qs.p = query.page;
            qs.n = query.pnum;
            qs.w = query.keyword;
            break;
        case 2: //播放链接
            path = '/base/fcgi-bin/fcg_music_express_mobile3.fcg';
            qs.cid = '205361747';
            qs.songmid = query.songmid;
            qs.filename = 'C400' + query.media_mid + '.m4a';
            qs.guid = 1707943335;
            break;
        case 3: //获取歌词
            path = '/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
            opt.headers['Referer'] = 'https://y.qq.com/portal/player.html';
            qs.songmid = query.songmid;
            break;
        case 4: //获取评论
            path = '/base/fcgi-bin/fcg_global_comment_h5.fcg';
            qs.biztype = 1;
            qs.topid = query.songid;
            qs.cmd = 8;
            qs.pagenum = query.page;
            qs.pagesize = query.pnum;
            break;
        default:
            break;
    }
    let con = querystring.stringify(qs);
    opt.path = path + '?' + con;

    let req = http.request(opt, function(res) {
        res.setEncoding('utf8');
        if(res.statusCode != 200){
            handler({status: 'error'});
            return;
        }
        let alldata = '';
        res.on('data', function(data) {
            alldata += data;
        }).on('end', function() {
            if (query.hasBraket)
                alldata = alldata.substring(alldata.indexOf('(') + 1, alldata.length - 1);
            let all = JSON.parse(alldata);
            if(qs.guid) all.guid = qs.guid;
            handler(all);
        });
    });

    req.on('error', function(err) {
        handler({ status: 'error' });
    });

    req.end();
}
var http = require('http');
var querystring = require('querystring');

function test(query, handler) {
    var path = '';
    var qs = {};
    var opt = {
        host: 'c.y.qq.com',
        path: '',
        method: 'GET',
        headers: {}
    };
    console.log('query: ' + JSON.stringify(query));

    switch (query.type) {
        case 1://单首歌曲信息
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
            qs.guid = 3057399792;
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
    var con = querystring.stringify(qs);
    // console.log('Content: ' + con);
    opt.path = path + '?' + con;
    console.log(opt);

    var req = http.request(opt, function(res) {
        // console.log('STATUS: ' + res.statusCode);
        // console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        var alldata = '';
        res.on('data', function(data) {
            alldata += data;
        }).on('end', function() {
            handler(alldata);
        });
    });

    req.end();
}

var t0 = {
    keyword: 'alone',
    type: 0,
    page: 0,
    pnum: 1
};
//无括号
var t5 = {
    keyword: 'alone',
    type: 5
};
var t1_3 = {
    songmid: '001MOpmO1AS2O5',
    type: 3
};
//无括号
var t2 = {
    songmid: '001MOpmO1AS2O5',
    media_mid: '004Qa4ca4f5hac',
    type: 2
};
//无括号
var t4 = {
    songid: '9063002',
    page: 1,
    pnum: 3,
    type: 4
}

test(t4, function(data) {
    // var d = JSON.parse(data);
    // let buf = new Buffer(d.lyric, 'base64');
    // d.lyric = buf.toString();
    // if(d.trans && d.trans.length!==0){
    //     buf = new Buffer(d.trans.toString(), 'base64');
    //     d.trans = buf.toString();
    // }
    console.log(data);
});
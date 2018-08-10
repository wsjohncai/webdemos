let isPlaying = false;

function searchSong() {
    let opt = '?keyword=' + $('#s_input').val() + '&limit=1';
    $.get('/music/search' + opt, function(d) {
        // console.log(data);
        // let obj = JSON.parse(data);
        data = d.ne.data;
        if (data.code === 200) {
            let song = data.songs[0];
            let name = song.name;
            id = song.id;
            if (isPlaying) {
                stopPlaying();
            }
            getUrl(id);
            getLyric(id);
            let artists = '';
            for (var i = 0; i < song.ar.length; i++) {
                artists += song.ar[i].name + '&';
            }
            artists = artists.substr(0, artists.length - 1);
            document.title = name + ' - ' + artists;
            $('.song h2').html(document.title);
            let pic = song.al.picUrl;
            $('.cd').css('background-image', 'url("' + pic + '")');
        }
    });
    return false;
}

function playMusic(o) {
    let player = document.getElementById("player");
    if (!isPlaying) {
        startPlaying();
    } else {
        stopPlaying();
    }
}

function startPlaying() {
    $('#player')[0].play();
    $('.center img').attr('src', '/images/pause.png');
    isPlaying = true;
}

function stopPlaying() {
    $('#player')[0].pause();
    $('.center img').attr('src', '/images/play.png');
    isPlaying = false;
}

function getUrl(id) {
    $.get('/music/url?src=ne&songbr=999000&songid=' + id, function(d) {
        let data = d.data;
        if (data.code === 200) {
            let url = data.url;
            $('#player').attr('src', url);
            startPlaying();
        }
    });
}

function getLyric(id) {
    $.get('/music/lyric?src=ne&songid=' + id, function(d) {
        let data = d.data;
        if (data.code === 200 && !data.nolyric) {
            let lyric = data.lyric.split('\n');
            let tran = data.tlrc ? data.tlrc.split('\n') : '';
            let lyricP = $('.lyric');
            lyricP.empty();
            let tranc = '',
                ttime = '',
                j = 0;
            if (tran !== '') {
                let idx = tran[j].indexOf(']');
                while(idx == tran[j].length-1)
                    idx = tran[++j].indexOf(']');
                ttime = tran[j].substring(1, idx);
                tranc = tran[j].substr(idx + 1);
                j++;
            }
            for (var i = 0; i < lyric.length; i++) {
                //获取当前的原歌词句子
                let ridx = lyric[i].indexOf(']');
                while(ridx === lyric[i].length-1)
                    i++;
                ridx = lyric[i].indexOf(']');
                let otime = lyric[i].substring(1, ridx);
                let p = $('<p></p>').html(lyric[i].substr(ridx + 1));
                lyricP.append(p);
                //判断时间是否与当前原句相等，如果是，那么打印翻译句子，否则跳过
                if (tran !== '') {
                    if (otime === ttime) {
                        let pl = $('<p></p>').html(tranc);
                        lyricP.append(pl);
                        let idx = tran[j].indexOf(']');
                        while(idx == tran[j].length-1)
                            idx = tran[++j].indexOf(']');
                        ttime = tran[j].substring(1, idx);
                        tranc = tran[j].substr(idx + 1);
                        j++;
                    }
                }
            }
        } else if (data.nolyric) {
            $('.lyric').empty().append($('<p></p>').html('没有歌词'));
        }
    });
}
let isPlaying = false;
let isBlur = true;
$(function() {
    let inputTime = 0;
    let itemPoi = -2;
    let lastInputTask;
    //搜索框监听
    $('#s_input').on("click keyup", function(e) {
        isBlur = false;
        if (itemPoi !== -2 || e.type === 'keyup' && (e.keyCode === 38 || e.keyCode === 40)) {
            let items = $('#s_hint li');
            if (e.keyCode === 13) {
                e.preventDefault();
                $(items[itemPoi]).click();
                this.selectionStart = $(this).val().length;
                this.selectionEnd = $(this).val().length;
                items = -2;
                return;
            }
            if (items.length > 0) {
                if (e.keyCode === 38) {
                    if (itemPoi === -2 || itemPoi === 0) itemPoi = items.length - 1;
                    else itemPoi--;
                } else if (e.keyCode === 40) {
                    if (itemPoi === -2 || itemPoi === items.length - 1) itemPoi = 0;
                    else itemPoi++;
                }
                let $input = $('#s_input');
                items.each(function(idx, item) {
                    let $item = $(item);
                    if (idx === itemPoi) {
                        $item.addClass('lighten');
                        $input.val($item.html());
                        $input[0].selectionStart = 0;
                        $input[0].selectionEnd = $input.val().length;
                    } else $item.hasClass('lighten') ? $item.removeClass('lighten') : false;
                });
            }
            return;
        }
        itemPoi = -2;
        let t = new Date().getTime();
        clearTimeout(lastInputTask);
        if (t - inputTime > 800) {
            inputTime = t;
            getHint();
        } else
            lastInputTask = setTimeout(function() {
                getHint();
            }, 1500);
    });
    $('#s_input').blur(() => {
        isBlur = true;
        setTimeout(function() {
            $('#s_hint').empty();
            $('#s_hint').hide();
        }, 500);
    });

    //歌词背景更改
    let dir = ['right', 'left', 'bottom', 'top'];
    let tran = 4;
    let conString = '';
    let lyBgSch = setInterval(function() {
        if (tran === 4) {
            tran = 3;
            let r1 = dir[parseInt(Math.random() * 4)];
            let r2 = dir[parseInt(Math.random() * 4)];
            let cs = [];
            for (let j = 0; j < 5; j++) {
                cs[j] = getRandomColor();
            }
            conString = r1 + (r1 === r2 ? ',' : ' ' + r2 + ',') + cs.toString();
        } else if (tran === 3) {
            conString = conString.replace(/0.1/g, '0.3');
            tran = 2;
        } else if (tran === 2) {
            conString = conString.replace(/0.3/g, '0.4');
            tran = 1;
        } else if (tran === 1) {
            tran = 5;
            conString = conString.replace(/0.4/g, '0.3');
        } else if (tran === 5) {
            tran = 4;
            conString = conString.replace(/0.3/g, '0.1');
        }
        $('.lyric').css('background', '-webkit-linear-gradient(' + conString + ')');
        $('.lyric').css('background', 'linear-gradient(to ' + conString + ')');
        $('.lyric').css('background', '-o-linear-gradient(' + conString + ')');
        $('.lyric').css('background', '-moz-linear-gradient(' + conString + ')');
    }, 1500);

    //歌词滚动条监听
    $('#lyric_scroller').on()
});

function getRandomColor() {
    let c = 'rgba(';
    let t = parseInt(Math.random() * 256)
    t = t < 128 ? t + 128 : t;
    c += t + ',';
    t = parseInt(Math.random() * 256)
    t = t < 128 ? t + 128 : t;
    c += t + ',';
    t = parseInt(Math.random() * 256)
    t = t < 128 ? t + 128 : t;
    c += t + ',';
    c += '0.1)';
    return c;
}

let lastShowTime = 0;

function getHint() {
    let keyIn = $('#s_input').val();
    let $hint = $('#s_hint');
    if (keyIn.length == 0) {
        $hint.hide();
        return;
    }
    let opt = '?keyword=' + keyIn + '&limit=6';
    let queryTime = new Date().getTime();
    $.get('/music/search' + opt, function(d) {
        if (isBlur) return;
        if (queryTime > lastShowTime) {
            lastShowTime = queryTime;
        } else return;
        data = d.ne.data;
        if (data.code === 200 && data.songs.length > 0) {
            $hint.empty();
            for (let i = 0; i < data.songs.length; i++) {
                let s = data.songs[i];
                let artists = '';
                for (let j = 0; j < s.ar.length; j++) {
                    artists += s.ar[j].name + '/';
                }
                artists = artists.substr(0, artists.length - 1);
                let li = $('<li></li>').attr({
                    'onclick': 'loadFromListItem(this, ' + s.id + ')',
                    'title': s.name + ' - ' + artists
                }).text(s.name + ' - ' + artists);
                li.hover(function() {
                    $(this).addClass('lighten');
                }, function() {
                    $(this).removeClass('lighten');
                });
                $hint.append(li);
                $hint.show();
            }
        }
    });
}

function searchSong() {
    let opt = '?keyword=' + $('#s_input').val() + '&limit=1';
    $('#s_hint').empty();
    $('#s_hint').hide();
    $.get('/music/search' + opt, function(d) {
        // console.log(data);
        // let obj = JSON.parse(data);
        data = d.ne.data;
        if (data.code === 200) {
            let song = data.songs[0];
            loadSong(song.id);
        }
    });
    return false;
}

function loadFromListItem(item, id) {
    loadSong(id);
    $('#s_input').val($(item).html());
}

function loadSong(id) {
    let opt = '?src=ne&songid=' + id;
    $.get('music/detail' + opt, function(d) {
        if (d.status === 'ok') {
            let song = d.data.song;
            let id = song.id;
            let name = song.name;
            if (isPlaying) {
                stopPlaying();
            }
            getUrl(id);
            getLyric(id);
            let artists = '';
            for (var i = 0; i < song.ar.length; i++) {
                artists += song.ar[i].name + '/';
            }
            artists = artists.substr(0, artists.length - 1);
            document.title = name + ' - ' + artists;
            $('#stitle').html(document.title);
            let pic = song.al.picUrl;
            $('#cd_bg').css('background-image', 'url("' + pic + '")');
            $('.bg').css('background-image', 'url("' + pic + '")');
        }
    });
}

function getSongLength(u) {
    $.ajax({
        type: 'HEAD',
        url: u,
        complete: function(xhr, data) {
            let len = xhr.getResponseHeader("Content-Length");
            // console.log('headers: ' + xhr.getAllResponseHeaders());
            let intLen;
            if (len) {
                intLen = parseInt(len) / 1024 / 1024;
                $('#stitle').attr('title', '大小：' + intLen.toFixed(2) + 'M, 右键保存');
            }
        }
    })
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
    try {
        $('#player')[0].play();
    } catch (err) {
        if (console) console.log(err);
    }
    $('.center img').attr('src', '/images/pause.png');
    $('#cd_bg').css('animation', 'cdRotate 20s linear 1s infinite normal');
    isPlaying = true;
}

function stopPlaying() {
    try {
        $('#player')[0].pause();
    } catch (err) {
        if (console) console.log(err);
    }
    $('.center img').attr('src', '/images/play.png');
    $('#cd_bg').css('animation', '');
    isPlaying = false;
}

function getUrl(id) {
    $.get('/music/url?src=ne&songbr=999000&songid=' + id, function(d) {
        let data = d.data;
        if (data.code === 200) {
            let url = data.url;
            $('#player').attr('src', url);
            $('#stitle').attr('href', url);
            getSongLength(url);
            startPlaying();
        }
    });
}

function getLyric(id) {
    $.get('/music/lyric?src=ne&songid=' + id, function(d) {
        let data = d.data;
        if (data.code === 200 && !data.nolyric) {
            let lyric = data.lyric ? data.lyric.split('\n') : '';
            if (lyric === '') return;
            let tran = data.tlrc ? data.tlrc.split('\n') : '';
            let lyricP = $('#lyric_container');
            lyricP.empty();
            let tranc = '',
                ttime = '',
                j = 0;
            if (tran !== '') {
                let idx = tran[j].indexOf(']');
                while (idx == tran[j].length - 1)
                    idx = tran[++j].indexOf(']');
                ttime = tran[j].substring(1, idx);
                tranc = tran[j].substr(idx + 1);
                j++;
            }
            for (var i = 0; i < lyric.length; i++) {
                //获取当前的原歌词句子
                let ridx = lyric[i] ? lyric[i].indexOf(']') : -1;
                while (ridx != -1 && ridx === lyric[i].length - 1)
                    ridx = lyric[++i] ? lyric[i].indexOf(']') : -1;
                if (ridx == -1) continue;
                let otime = lyric[i].substring(1, ridx);
                let p = $('<p></p>').html(lyric[i].substr(ridx + 1));
                lyricP.append(p);
                //判断时间是否与当前原句相等，如果是，那么打印翻译句子，否则跳过
                if (tran && tran !== '') {
                    if (otime === ttime) {
                        let pl = $('<p></p>').html(tranc);
                        lyricP.append(pl);
                        let idx = tran[j] ? tran[j].indexOf(']') : -1;
                        while (idx !== -1 && idx == tran[j].length - 1)
                            idx = tran[++j] ? tran[j].indexOf(']') : -1;
                        if (idx == -1) continue;
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
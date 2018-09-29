let isPlaying = false;
let isBlur = true;
let isShowLyric = true;
let scrollHideSchId;
$(function() {
    let inputTime = 0;
    let itemPoi = -2;
    let lastInputTask;

    if(oriQuery.src && oriQuery.id){
        if(oriQuery.src === 'ne')
            loadSong(oriQuery.id);
    }

    //搜索框监听
    $('#s_input').on("click keyup", function(e) {
        isBlur = false;
        if (itemPoi !== -2 || e.type === 'keyup' && (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13)) {
            let items = $('#s_hint li');
            if (e.keyCode === 13) {
                e.preventDefault();
                $(items[itemPoi]).click();
                if (itemPoi === -2) $(this).blur();
                this.selectionStart = $(this).val().length;
                this.selectionEnd = $(this).val().length;
                itemPoi = -2;
                return;
            }
            if (items.length > 0) {
                if (e.keyCode === 38) {
                    if (itemPoi === -2 || itemPoi === 0) itemPoi = items.length - 1;
                    else itemPoi--;
                } else if (e.keyCode === 40) {
                    if (itemPoi === -2 || itemPoi === items.length - 1) itemPoi = 0;
                    else itemPoi++;
                } else return;
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
        if (t - inputTime > 600) {
            inputTime = t;
            getHint();
        } else {
            lastInputTask = setTimeout(function() {
                getHint();
            }, 1000);
        }
    });
    $('#s_input').blur(() => {
        isBlur = true;
        clearTimeout(lastInputTask);
        setTimeout(function() {
            $('#s_hint').empty();
            $('#s_hint').hide();
        }, 400);
    });

    $('#cmt_btn').on('touchstart click', function() {
        if (isShowLyric) {
            $('#lyric_container').hide();
            $('#cmt_container').show();
            stopSyncLyric();
            reLayoutScroller(true);
            $(this).attr({
                'src': 'images/back.png',
                'title': '返回歌词'
            });
            isShowLyric = false;
        } else {
            startSyncLyric();
            $('#cmt_container').hide();
            $('#lyric_container').show();
            reLayoutScroller(true);
            isShowLyric = true;
            $(this).attr({
                'src': 'images/comments.png',
                'title': '查看评论'
            });
        }
    });

    //歌词背景更改
    let dir = ['right', 'left', 'bottom', 'top'];
    let tran = 4;
    let conString = '';
    let lyBgSch = setInterval(function() {
        if (tran === 4) {
            tran = 3;
            let r1 = dir[parseInt(Math.random() * 4)];
            let r2;
            if (r1 === 'right' || r1 === 'left') r2 = dir[parseInt(Math.random() * 2) + 2];
            else r2 = dir[parseInt(Math.random() * 2)];
            let cs = [];
            for (let j = 0; j < 5; j++) {
                cs[j] = getRandomColor();
            }
            conString = r1 + (r1 === r2 ? ',' : ' ' + r2 + ',') + cs.toString();
        } else if (tran === 3) {
            conString = conString.replace(/0.2/g, '0.3');
            tran = 2;
        } else if (tran === 2) {
            conString = conString.replace(/0.3/g, '0.4');
            tran = 1;
        } else if (tran === 1) {
            tran = 5;
            conString = conString.replace(/0.4/g, '0.3');
        } else if (tran === 5) {
            tran = 4;
            conString = conString.replace(/0.3/g, '0.2');
        }
        let lr = $('.lyric');
        lr.css('background', '-webkit-linear-gradient(' + conString + ')');
        lr.css('background', 'linear-gradient(to ' + conString + ')');
        lr.css('background', '-o-linear-gradient(' + conString + ')');
        lr.css('background', '-moz-linear-gradient(' + conString + ')');
    }, 2000);

    //歌词滚动条监听
    if (window.addEventListener) {
        $('.lyric')[0].addEventListener("mousewheel", lyricScroll, false);
        $('.lyric')[0].addEventListener("DOMMouseScroll", lyricScroll, false);
    }
    let sc = $('#lyric_scroller');
    let isScrollerPressed = false;
    let isInBar = false;
    let clickY, clickTime, speed, spPoi = 0;
    $('.lyric').on({
        mouseleave: leave,
        mousemove: move,
        mouseover: function() {
            if (sc.hasClass('needHide'))
                return;
        },
        mouseup: function() {
            isScrollerPressed = false;
        },
        touchstart: function(e) {
            e.preventDefault();
            if (sc.hasClass('needHide')) return;
            clearTimeout(scrollHideSchId);
            clearInterval(autoSchrollId);
            clickY = e.targetTouches[0].clientY;
            clickTime = e.timeStamp;
            speed = [];
            sc.css('opacity', '1');
        },
        touchmove: function(e) {
            e.preventDefault();
            if (sc.hasClass('needHide')) return;
            let curY = e.targetTouches[0].clientY;
            let curT = e.timeStamp;
            let dis = curY - clickY;
            pauseSyncLyricScroll();
            lyricScrollHelper('fling', dis);
            if (spPoi === 3) spPoi = 0;
            speed[spPoi++] = dis / (curT - clickTime);
            clickY = curY;
            clickTime = curT;
            scrollHideSchId = setTimeout(function() {
                sc.css('opacity', '0');
            }, 2500);
        },
        touchend: function() {
            spPoi = 0;
            let t = 0;
            for (let i = 0; i < speed.length; i++) {
                t += speed[i];
            }
            fling(t * 200 / speed.length);
            scrollHideSchId = setTimeout(function() {
                $('#lyric_scroller').css('opacity', '0');
            }, 2500);
        }
    });

    $('#lyric_scroller_hinter').on({
        mouseover: over,
        mouseleave: leave,
        mousemove: move,
        mousedown: function(e) {
            e.preventDefault();
            if (sc.hasClass('needHide'))
                return;
            let y = e.offsetY;
            let min = sc.height() / 2;
            let cur = parseInt(sc.css('top')) - parseInt($(this).css('top'));
            pauseSyncLyricScroll();
            lyricScrollHelper('click', y - cur - min);
        },
        mouseup: function() {
            isScrollerPressed = false;
        }
    });
    sc.on({
        mousedown: function(e) {
            if (sc.hasClass('needHide'))
                return;
            e.preventDefault();
            isScrollerPressed = true;
            clickY = e.pageY;
        },
        mouseup: function() {
            isScrollerPressed = false;
        },
        mouseover: over,
        mousemove: move,
        mouseleave: leave,
        touchmove: move,
        touchstart: function(e) {
            if (sc.hasClass('needHide'))
                return;
            clearTimeout(scrollHideSchId);
            clearInterval(autoSchrollId);
            clickY = e.targetTouches[0].clickY;
            sc.css('opacity', '1');
        },
        touchend: function() {
            scrollHideSchId = setTimeout(function() {
                sc.css('opacity', '0');
            }, 2500);
        }
    });

    function leave(e) {
        let $cur = $(e.currentTarget);
        if (isScrollerPressed && $cur.hasClass('lyric')) isScrollerPressed = false;
        if (isInBar && $cur.attr('id') === 'lyric_scroller') isInBar = false;
        if (sc.hasClass('needHide') || isScrollerPressed || isInBar)
            return;
        e.preventDefault();
        if ($(e.currentTarget).hasClass('lyric'))
            sc.css('opacity', '0');
        $('#lyric_scroller_hinter').css('opacity', '0');
    }

    function over(e) {
        if (sc.hasClass('needHide') || isInBar)
            return;
        e.preventDefault();
        if ($(e.currentTarget).attr('id') === 'lyric_scroller')
            isInBar = true;
        $('#lyric_scroller_hinter').css('opacity', '1');
        sc.css('opacity', '1');
    }

    function move(e) {
        if (sc.hasClass('needHide'))
            return;
        e.preventDefault();
        if (e.type === 'touchmove') {
            let curY = e.targetTouches[0].clientY;
            let dis = curY - clickY;
            pauseSyncLyricScroll();
            lyricScrollHelper('drag', dis);
            clickY = curY;
        } else if (e.type === 'mousemove' && isScrollerPressed) {
            let curY = e.pageY;
            let dis = curY - clickY;
            pauseSyncLyricScroll();
            lyricScrollHelper('drag', dis);
            clickY = curY;
        }
    }

});

function lyricScroll(ev) {
    let sc = $('#lyric_scroller');
    if (sc.hasClass('needHide')) return;
    clearTimeout(scrollHideSchId);
    let e = ev || window.event;
    let delta = e.wheelDelta ? e.wheelDelta : e.detail;
    sc.css('opacity', '1');
    scrollHideSchId = setTimeout(function() {
        sc.css('opacity', '0');
    }, 1500);
    lyricScrollHelper('wheel', delta);
}

//如果是鼠标滚动距离，x小于0表示歌词往上，指示条往下；
//如果是拖动，点击，x小于0表示歌词往下，指示条往上
function lyricScrollHelper(type, x) {
    let $bar = $('#lyric_scroller');
    let $lyricArea = $('#container');
    let $barArea = $('#lyric_scroller_hinter');
    let oriBarTop = parseFloat($bar.css('top'));
    let barHeight = $bar.height();
    let oriLyricTop = parseFloat($lyricArea.css('top'));
    let lyricHeight = $lyricArea.height();
    let lyricMaxMove = $('.lyric').height() - lyricHeight;
    let barMaxMove = $barArea.height() - barHeight;
    let barMaxTop = barMaxMove + parseFloat($barArea.css('top'));
    let lyricScrollY, barScrollY;
    if (type === 'wheel' || type === 'fling') {
        lyricScrollY = x;
        barScrollY = x * barMaxMove / lyricMaxMove;
    } else {
        barScrollY = x;
        lyricScrollY = x * lyricMaxMove / barMaxMove;
    }

    let barFinalScroll = barScrollY + oriBarTop,
        lyricFinalScroll = lyricScrollY + oriLyricTop;
    if (barFinalScroll < parseFloat($barArea.css('top'))) $bar.css('top', '');
    else if (barFinalScroll > barMaxTop) $bar.css('top', barMaxTop + 'px');
    else $bar.css('top', barFinalScroll + 'px');
    if (lyricFinalScroll < lyricMaxMove) {
        $lyricArea.css('top', lyricMaxMove + 'px');
        if (!isShowLyric && !isCommentLoading) {
            popInfo('loading', "Comments is Loading...");
            isCommentLoading = true;
            getComments($('#stitle').attr('data-id'));
        }
        return 0;
    } else if (lyricFinalScroll > 0) {
        $lyricArea.css('top', '');
        return 0;
    }
    else $lyricArea.css('top', lyricFinalScroll + 'px');
    return lyricFinalScroll;
}

let autoSchrollId;

function fling(spd, type) {
    if (Math.abs(spd) < 120 && !type) return;
    clearInterval(autoSchrollId);
    let circle = 9;
    let part = (1 + circle) * circle / 2;
    let off = spd / part;
    autoSchrollId = setInterval(function() {
        let dis = lyricScrollHelper("fling", circle * off)
        circle--;
        if (circle <= 0 || dis === 0) {
            clearInterval(autoSchrollId);
        }
    }, 90);
}


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
    c += '0.2)';
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
    popInfo("loading", "Loading...");
    $.get('/music/search' + opt, function(d) {
        // console.log(data);
        // let obj = JSON.parse(data);
        data = d.ne.data;
        if (data.code === 200) {
            let song = data.songs[0];
            loadSong(song.id);
        }
    }).fail(function() {
        popInfo("fail", "Network Error. Try again later!");
    });
    return false;
}

function loadFromListItem(item, id) {
    popInfo("loading", "Loading...");
    loadSong(id);
    $('#s_input').val($(item).html());
    $('#s_hint').empty();
    $('#s_hint').hide();
}

let marqueTaskId;

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
            cmtOffset = 0;
            getUrl(id);
            getLyric(id);
            getComments(id);
            let artists = '';
            for (var i = 0; i < song.ar.length; i++) {
                artists += song.ar[i].name + '/';
            }
            artists = artists.substr(0, artists.length - 1);
            document.title = name + ' - ' + artists;
            let $title = $('#stitle');
            $title.html(document.title);
            $title.attr('data-id', id);
            clearInterval(marqueTaskId);
            let wid = $title.width();
            let sWid = $title.prop('scrollWidth');
            if (sWid - 2 > wid){
                let t = $title.html()
                $title.html(t + '&nbsp;&nbsp;&nbsp;&nbsp;' + t);
                let aWid = $title.prop('scrollWidth');
                let scw = 0;
                marqueTaskId = setInterval(function() {
                    scw += 2;
                    $title.prop('scrollLeft', scw);
                    if (scw > aWid - sWid) scw = 0;
                }, 80);
            }

            let pic = song.al.picUrl;
            $('#cd_bg').css('background-image', 'url("' + pic + '")');
            $('.bg').css('background-image', 'url("' + pic + '")');
        }
    }).fail(function() {
        popInfo("fail", "Network Error. Try again later!");
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
                $('#stitle+a').attr('title', '大小：' + intLen.toFixed(2) + 'M, 右键保存');
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

let lrcSyncTaskId, reScrollLyricId;
let pauseLyric = false;
let rp = -1,
    rtp = -1;

function startSyncLyric() {
    if ($('.lrcLine').length === 0) return;
    lrcSyncTaskId = setInterval(function() {
        let pPoi = 0,
            tpPoi = 0;
        let curPlayingTime = $('#player')[0].currentTime * 1000;
        for (let i = 0; i < $('.lrcLine').length; i++) {
            let ip = $($('.lrcLine')[i]);
            if (ip.attr('data-time') > curPlayingTime) {
                pPoi = i - 1;
                break;
            }
            if(i === $('.lrcLine').length-1) pPoi = i;
        }
        if(rp === $('.lrcLine').length && pPoi === -1) return;
        for (let i = 0; i < $('.tranLine').length; i++) {
            let ip = $($('.tranLine')[i]);
            if (ip.attr('data-time') > curPlayingTime) {
                tpPoi = i - 1;
                break;
            }
            if(i === $('.tranLine').length-1) tpPoi = i;
        }
        let p = $($('.lrcLine')[pPoi]);
        let tp = $($('.tranLine')[tpPoi]);
        if (rp !== pPoi) {
            if (rp !== -1) $($('.lrcLine')[rp]).removeClass('lrc_cur');
            rp = pPoi;
            p.addClass('lrc_cur');
            if (!pauseLyric && pPoi != -1) {
                let move = (p.height() * (pPoi + 1) + (tp.height() +
                        parseInt(tp.css('margin-bottom'))) * (tpPoi)) * -1 -
                    parseFloat($('#container').css('top')) +
                    $('.lyric').height() / 2;
                fling(move, 'lyricScroll');
            }
        }
        if (rtp !== tpPoi) {
            if (rtp != -1) $($('.tranLine')[rtp]).removeClass('lrc_cur');
            rtp = tpPoi;
            if(p.attr('data-time') === tp.attr('data-time'))tp.addClass('lrc_cur');
            tpPoi++;
        }
    }, 500);
}

function pauseSyncLyricScroll() {
    pauseLyric = true;
    clearTimeout(reScrollLyricId);
    reScrollLyricId = setTimeout(() => { pauseLyric = false; }, 3000);
}

function stopSyncLyric() {
    clearInterval(lrcSyncTaskId);
}

function startPlaying() {
    try {
        $('#player')[0].play();
        popInfo("ok", "Succeed, start playing");
        startSyncLyric();
    } catch (err) {
        popInfo("fail", "Error occurred when playing");
        stopSyncLyric();
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
    stopSyncLyric();
    $('.center img').attr('src', '/images/play.png');
    $('#cd_bg').css('animation', '');
    isPlaying = false;
}

function getUrl(id) {
    $.get('/music/url?src=ne&songbr=999000&songid=' + id, function(d) {
        let data = d.data;
        if (data.code === 200) {
            let url = data.url;
            if (url === null) {
                popInfo('fail', 'Song can\'t be play');
                return;
            }
            $('#player').attr('src', url);
            $('#stitle+a').attr('href', url);
            getSongLength(url);
            startPlaying();
        }
    });
}

function getCmtItem(data) {
    let div = $('<div></div>').addClass('cmt_item');
    let icon = $('<img>');
    let name = $('<span></span>').addClass('username');
    let cmt = $('<p></p>').addClass('comment');
    let beCmt = $('<p></p>').addClass('beCmt');
    let beCmtName = $('<span></span>').addClass('beCmtName');
    let time = $('<p></p>').addClass('cmtTime');
    let likes = $('<p></p>').addClass('cmtLike');
    let likeIcon = $('<img>').attr('src', 'images/like.png');

    function getTime(cmttime) {
        let now = new Date();
        let gap = now.getTime() / 1000 - cmttime / 1000;
        if (gap < 60) return "刚刚";
        gap = gap / 60;
        if (gap < 60) return parseInt(gap) + "分钟前";
        let ny, nm, nd;
        ny = now.getUTCFullYear();
        nm = now.getMonth() + 1;
        nd = now.getDate();
        let tdt = new Date(ny + '.' + nm + '.' + nd).getTime();
        let cmtt = new Date(cmttime);
        let fh = cmtt.getHours().toString();
        fh = fh.length === 1 ? '0' + fh : fh;
        let fmin = cmtt.getMinutes().toString();
        fmin = fmin.length === 1 ? '0' + fmin : fmin;
        let rs0 = fh + ':' + fmin;
        if (cmttime - tdt > 0) {
            return "今天 " + rs0;
        }
        let fm = (cmtt.getMonth() + 1).toString();
        fm = fm.length === 1 ? '0' + fm : fm;
        let fd = cmtt.getDate().toString();
        fd = fd.length === 1 ? '0' + fd : fd;
        let rs = fm + '月' + fd + '日 ' + rs0;
        if (now.getYear() === cmtt.getYear())
            return rs;
        return cmtt.getUTCFullYear() + '年' + rs;
    }

    function getLikeCount(count) {
        if (count < 10000) return count;
        let fc = (count / 10000).toFixed(1);
        return (fc.endsWith('0') ? fc.substr(0, fc.length - 2) : fc) + '万';
    }

    icon.attr('src', data.user.avatarUrl);
    div.append(icon);
    name.html(data.user.nickname);
    div.append(name);
    time.html(getTime(data.time));
    div.append(time);
    likes.html(getLikeCount(data.likedCount));
    likes.prepend(likeIcon);
    div.append(likes);
    cmt.html(data.content);
    div.append(cmt);
    if (data.beReplied.length !== 0) {
        beCmtName.html(data.beReplied[0].user.nickname);
        beCmt.html(data.beReplied[0].content);
        beCmt.prepend(beCmtName);
        div.append(beCmt);
    }
    return div;
}


let cmtOffset = 0;
let cmtNum = 8;
let isCommentLoading = false;

function getComments(id) {
    let opt = '/music/comment?src=ne&songid=' + id + "&offset=" + cmtOffset + "&limit=" + cmtNum;
    $.get(opt, function(d) {
        if (d.status !== 'ok' || d.data.code !== 200) return;
        let off = cmtOffset;
        $('#cmt_btn').show();
        let cmts = d.data.comments;
        let cmtContainer = $('#cmt_container');
        if (cmtOffset == 0) {
            cmtContainer.empty();
            let total = d.data.total;
            let hots = d.data.hots;
            cmtContainer.append($('<p></p>').html('评论数量 ' + total).addClass('cmt_total'));
            cmtContainer.append($('<p></p>').html('精彩评论').addClass('cmt_type'));
            for (var i = 0; i < hots.length; i++) {
                let div = getCmtItem(hots[i]);
                cmtContainer.append(div);
            }
        }
        if (cmtOffset == 0) {
            cmtContainer.append($('<p></p>').html('最新评论').addClass('cmt_type'));
        }
        for (var i = 0; i < cmts.length; i++) {
            let div = getCmtItem(cmts[i]);
            cmtContainer.append(div);
        }
        if (!isShowLyric) {
            reLayoutScroller(false);
            popInfo('ok', 'Comments in page ' + off + ' are loaded');
        }
        cmtOffset++;
        isCommentLoading = false;
    });
}

function getLyric(id) {
    function getTime(t) {
        let ts = t.split(':');
        let m = parseInt(ts[0]);
        let s = parseFloat(ts[1]);
        return (m * 60 + s) * 1000;
    }
    $.get('/music/lyric?src=ne&songid=' + id, function(d) {
        let data = d.data;
        let lyricP = $('#lyric_container');
        lyricP.empty();
        if (data.code === 200 && !data.nolyric) {
            let lyric = data.lyric ? data.lyric.split('\n') : '';
            if (lyric === '') return;
            let tran = data.tlrc ? data.tlrc.split('\n') : '';
            let tranc = '',
                ttime = '',
                j = 0;
            if (tran !== '') {
                let idx = tran[j].indexOf(']');
                while (idx == tran[j].length - 1)
                    idx = tran[++j].indexOf(']');
                ttime = getTime(tran[j].substring(1, idx));
                tranc = tran[j].substr(idx + 1);
                j++;
            }
            for (var i = 0; i < lyric.length; i++) {
                //获取当前的原歌词句子
                let ridx = lyric[i] ? lyric[i].indexOf(']') : -1;
                while (ridx != -1 && ridx === lyric[i].length - 1)
                    ridx = lyric[++i] ? lyric[i].indexOf(']') : -1;
                if (ridx == -1) continue;
                let otime = getTime(lyric[i].substring(1, ridx));
                let p = $('<p></p>').addClass('lrcLine')
                    .attr('data-time', otime)
                    .html(lyric[i].substr(ridx + 1));
                lyricP.append(p);
                //判断时间是否与当前原句相等，如果是，那么打印翻译句子，否则跳过
                if (tran && tran !== '') {
                    if (otime === ttime) {
                        let pl = $('<p></p>').addClass('tranLine')
                            .attr('data-time', otime).html(tranc);
                        lyricP.append(pl);
                        let idx = tran[j] ? tran[j].indexOf(']') : -1;
                        while (idx !== -1 && idx == tran[j].length - 1)
                            idx = tran[++j] ? tran[j].indexOf(']') : -1;
                        if (idx == -1) continue;
                        ttime = getTime(tran[j].substring(1, idx));
                        tranc = tran[j].substr(idx + 1);
                        j++;
                    }
                }
            }
        } else if (data.nolyric) {
            $('.lyric').empty().append($('<p></p>').addClass('lrcLine').html('没有歌词'));
        }

        reLayoutScroller(true);
    });
}

function reLayoutScroller(needFullRefresh) {
    let lybgH = $('.lyric').height();
    let lyH = $('#container').height();
    let sc = $('#lyric_scroller');
    let $barArea = $('#lyric_scroller_hinter');
    let lyricMaxMove = lyH - lybgH;
    if (lyH < lybgH) {
        sc.addClass("needHide");
        sc.height(0);
    } else {
        sc.height(lybgH * $barArea.height() / lyH);
        sc.removeClass('needHide');
    }

    if (needFullRefresh) {
        $('#container').css('top', '');
        sc.css('top', '');
    } else {
        let barHeight = sc.height();
        let barMaxMove = $barArea.height() - barHeight;
        let lyTop = parseFloat($('#container').css('top'));
        let bt = lyTop * barMaxMove / lyricMaxMove;
        bt = bt < 0 ? -1 * bt : bt;
        sc.css('top', bt + parseFloat($barArea.css('top')) + 'px');
    }
}

let popId, imgRotateId;

function popInfo(status, text) {
    clearTimeout(popId);
    clearInterval(imgRotateId);
    let deg = 0;
    $('#status_icon').css('transform', '');
    if (status === 'ok')
        $('#status_icon').attr('src', 'images/ok.png');
    else if (status === 'fail')
        $('#status_icon').attr('src', 'images/fail.png');
    else if (status === 'loading') {
        $('#status_icon').attr('src', 'images/loading.png');
        imgRotateId = setInterval(function() {
            if (deg == 360) deg = 0;
            $('#status_icon').css('transform', 'rotate(' + deg + 'deg)');
            deg += 30;
        }, 150);
    }
    $('#pop_text').text(text);
    $('#popup').show();
    if (status !== "loading")
        popId = setTimeout(function() {
            $('#popup').fadeOut(1000);
        }, 2000)
}
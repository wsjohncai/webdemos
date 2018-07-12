$(function () {
    let dom = $(document);
    let root = $('#folder_root');
    root.click(function (event) {
        let folders = [];
        let liPar = $(event.target);
        if (liPar.prop('tagName') === 'SPAN' || liPar.prop('tagName') === 'EM')
            liPar = liPar.parent().parent();
        if (liPar.prop('tagName') === 'DIV')
            liPar = liPar.parent();
        let cls = liPar.attr('class');
        let willHave;
        liPar.toggleClass('minus', willHave = cls.indexOf('has_items') !== -1 && cls.indexOf('minus') === -1);
        if (willHave)
            liPar.children('ul').slideDown('fast');
        else liPar.children('ul').slideUp('fast');
        while (liPar.prop('tagName') !== 'DIV') {
            if (liPar.prop('tagName') === 'LI') {
                folders.push(liPar.children('div').children('span').text());
            }
            liPar = liPar.parent();
        }
        console.log(folders);
        // let padding = folders.length * 15;
        // let path = '';
        // let p;
        // while ((p = folders.pop()))
        //     path += '/' + p;
        // let rs = requestFiles(path);
        // let ulN = $('<ul></ul>');
        // if (target.prop('tagName') === 'LI')
        //     target.append(ulN);
        // else if (target.prop('tagName').match(/(SPAN|EM)/g))
        //     target.parent().parent().append(ulN);
        // else target.parent().append(ulN);
        // for (let i = 0; i < rs.length; i++) {
        //     let emN1 = $('<em></em>');
        //     let emN2 = $('<em></em>').addClass('left_icon');
        //     let spanN = $('<span></span>').text(rs[i]);
        //     let divN = $('<div></div>').append(emN1, emN2, spanN).css('padding-left', padding + 'px');
        //     let liN = $('<li></li>').append(divN);
        //     ulN.append(liN);
        // }
    });
    $('#cancel_move_btn').click(() => {
        $('#moveto_box').fadeOut(200)
    });

    $('#in_icon').click(function () {
        $(this).addClass('selected');
        $('#in_list').removeClass('selected');
        $('#files_table').children().children().each(function () {
            $(this).addClass('icon_type');
        })
    });
    $('#in_list').click(function () {
        $(this).addClass('selected');
        $('#in_icon').removeClass('selected');
        $('#files_table').children().children().each(function () {
            $(this).removeClass('icon_type');
        })
    });

    //获取用户信息
    $.ajax({
        url: '/home/user',
        method: 'get',
        dataType: 'json',
        success: function (user) {
            console.log('query success');
            if (user && user.status === 'success') {
                username = user.username;
                $('#title_username').text(username + ' 的个人主页');
                $('#user_name').val(username);
                $('#real_age').val(parseInt(user.real_age.toString()));
                $('#real_name').val(user.real_name);
                $('#birthday').val(user.birthday);
                $('#email').val(user.email);
                $('#phone').val(user.phone);
                $('#myurl').val(user.url);
                $('#intro').val(user.intro);
                $('#show_intro').text(user.intro === 'null' ? '暂无简介' : user.intro);
                let a = user.address.toString();
                if (a.length > 0) {
                    provsel.val(a.substring(0, a.indexOf('省') + 1));
                    citysel.text('<option>' + a.substring(a.indexOf('省') + 1, a.indexOf('市') + 1) + '</option>');
                    countysel.text('<option>' + a.substring(a.indexOf('市') + 1, a.length) + '</option>');
                }
            }
        },
        error: function (obj, status) {
            if (status && status === 'timeout')
                popInfo('fail', '连接超时，请稍后重试');
        }
    });
    getIcon();


    //获取根目录文件
    requestFiles(getCurrentFolder());

    let bg = $('#header');
    let offrange = 5.0;
    let doffL = 0, doffT = 0;
    dom.mousemove(e => {
        let offT = e.pageY / dom.height() * offrange - offrange / 2;
        let offL = e.pageX / dom.width() * offrange - offrange / 2;
        if (Math.abs(offL - doffL) > 0.2 || Math.abs(offT - doffT) > 0.2) {
            doffT = offT;
            doffL = offL;
            bg.css({
                'background-position-y': 50 + offT + '%',
                'background-position-x': 50 + offL + '%'
            });
        }
    });
    let con = ['home', 'info', 'files'];
    $('#nav_tabs').click(e => {
        if (e.target.tagName === 'LI') {
            $(this).find('*').removeClass('current');
            $(e.target).addClass('current');
            $('.content').hide();
            $('#' + con[$(e.target).index()]).show();
        }
    });
    let provs = china.provs;
    let provsel = $('#prov');
    let citysel = $('#city');
    let countysel = $('#county');
    let cityList, countyList;
    for (let i = 0; i < provs.length; i++) {
        let pn;
        if (provs[i].name.match(/(北京|上海|重庆|天津)/g))
            pn = provs[i].name + '市';
        else pn = provs[i].name + '省';
        provsel.append('<option>' + pn + '</option>')
    }
    provsel.change(function () {
        let p = provsel.val();
        for (let i = 0; i < provs.length; i++) {
            if (p.substring(0, p.length - 1) === provs[i].name) {
                cityList = provs[i].cities;
                citysel.text('<option>--请选择--</option>');
                countysel.text('<option>--请选择--</option>');
                for (let j = 0; j < cityList.length; j++) {
                    let cn = cityList[j].name + '市';
                    citysel.append('<option>' + cn + '</option>')
                }
                break;
            }
        }
    });
    citysel.change(function () {
        let c = citysel.val();
        for (let i = 0; i < cityList.length; i++) {
            if (c === cityList[i].name + '市') {
                countyList = cityList[i].counties;
                countysel.text('<option>--请选择--</option>');
                for (let j = 0; j < countyList.length; j++) {
                    countysel.append('<option>' + countyList[j].name + '</option>')
                }
            }
        }
    });
    //监听登出按钮
    $('#logout').click(function () {
        $.ajax({
            url: '/home/logout',
            method: 'get',
            success: function (status) {
                if (status === 'success') {
                    popInfo('ok', '退出登录成功');
                    window.location.href = '/';
                }
            },
            error: function (obj, status) {
                if (status && status === 'timeout')
                    popInfo('fail', '连接超时，请稍后重试');
            }
        })
    });
    $('#intro').keyup(function () {
        console.log(this);
        let v = $(this).val();
        if (v.length > 200) {
            $(this).val(v.substring(0, 200));
        }
    });

    let tbody = $('#files_table tbody');

    tbody.click(function (ev) {
        let target = $(ev.target);
        let row;
        if (target.prop('tagName').toString().match('(EM|SPAN)')) {
            row = target.parent().parent();
        } else if (target.prop('tagName') === 'TD') {
            row = target.parent();
        } else if (target.prop('tagName') === 'TR') {
            row = target;
        } else if (target.prop('tagName') === 'INPUT') {
            row = target.parent().parent();
        }
        toggleRowSelection(row, !row.hasClass('selected'));
        selectedFiles.path = getCurrentFolder();
        onSelectFile();
        onSelBtnChange(row);
    });

    $('#sel_btn').click(function () {
        let sel = $(this);
        sel.prop({'src': 'images/deselect.png', 'title': '取消选择'});
        selectedFiles.dels = [];
        let selectedAll = sel.hasClass('selected_all');
        tbody.children().each(function () {
            if (!selectedAll) {
                toggleRowSelection($(this), true);
                selectedFiles.dels.push($(this).children().first().children('span').text())
            } else
                toggleRowSelection($(this), false);
        });
        sel.toggleClass('selected_all', !selectedAll);
        if (selectedAll) {
            sel.fadeOut();
            $('.delete').fadeOut();
        }
    })
});

let username = "";
let selectedFiles = {'path': '', 'dels': [], 'num': 'multiple'};

function onSelectFile() {
    selectedFiles.dels = [];
    $('#files_table tbody').children('.selected').each(function () {
        selectedFiles.dels.push($(this).children().first().children('span').text());
    })
}

function toggleRowSelection(row, check) {
    let input = row.children().first().children('input');
    input.prop('checked', check);
    row.toggleClass('selected', check);
}

function onDelete() {
    if(selectedFiles.dels.length === 1)
        selectedFiles.num = 'single';
    $.ajax({
        url: '/home/delete',
        method: 'post',
        data: selectedFiles,
        traditional: true,
        dataType:'json',
        success: function (status) {
            if(status && status.status==='success') {
                popInfo('ok', '删除成功');
            }
            else popInfo('fail','删除文件失败，请稍候重试');
            requestFiles(getCurrentFolder());
        },
        error: function () {
            popInfo('fail','删除文件失败，请稍候重试');
        }
    })
}

function onSelBtnChange(row) {
    let sel_btn = $('.sel_btn');
    if (selectedFiles.dels.length === 0){
        sel_btn.fadeOut();
        $('.delete').fadeOut();
    }
    else if (selectedFiles.dels.length < row.siblings().length + 1) {
        sel_btn.fadeIn();
        $('.delete').fadeIn();
        sel_btn.toggleClass('selected_all', false);
        sel_btn.prop({'src': 'images/select_all.png', 'title': '全选'});
    } else {
        sel_btn.fadeIn();
        $('.delete').fadeIn();
        sel_btn.toggleClass('selected_all', true);
        sel_btn.prop({'src': 'images/deselect.png', 'title': '取消选择'});
    }
}

function submitInfo() {
    let ps = $('#prov').val();
    let cs = $('#city').val();
    let cos = $('#county').val();
    ps = ps.startsWith('--') ? '' : ps;
    cs = ps.startsWith('--') ? '' : cs;
    cos = ps.startsWith('--') ? '' : cos;
    let data = {
        'real_name': $('#real_name').val(),
        'real_age': $('#real_age').val(),
        'user_name': $('#user_name').val(),
        'old_user_name': username,
        'password': $('#password').val(),
        'birthday': $('#birthday').val(),
        'address': ps + cs + cos,
        'email': $('#email').val(),
        'phone': $('#phone').val(),
        'url': $('#myurl').val(),
        'intro': $('#intro').val()
    };
    $.ajax({
        url: '/home/submit',
        method: 'post',
        data: data,
        success: function (res) {
            if (res === 'success') {
                popInfo('ok', '修改信息成功');
                $('#show_intro').text($('#intro').val())
            } else {
                popInfo('fail', '修改失败');
            }
        },
        error: function (obj, status) {
            if (status && status === 'timeout')
                popInfo('fail', '连接超时，请稍后重试');
        }
    });
    return false;
}

let isPoping = false;

function popInfo(status, text) {
    if (isPoping)
        return;
    isPoping = true;
    if (status === 'ok')
        $('#status_icon').attr('src', 'images/ok.png');
    else
        $('#status_icon').attr('src', 'images/fail.png');
    $('#pop_text').text(text);
    let popup = $('#popup');
    popup.show().fadeOut(3000, function () {
        isPoping = false;
    });
}

function uploadFiles(src, type) {
    let formData = new FormData();
    let files = $(src)[0].files;
    for (let i = 0; i < files.length; i++) {
        formData.append('uploads', files[i]);
    }
    if (type === 'file')
        formData.append('save_path', getCurrentFolder());
    else if (type === 'icon')
        formData.append('type', 'icon');
    $.ajax({
        url: '/home/uploadFiles?type=file',
        method: 'post',
        data: formData,
        dataType: 'json',
        contentType: false,
        processData: false,
        cache: false,
        success: function (status) {
            if (status && status.status === 'success') {
                if (type === 'file') {
                    popInfo('ok', '文件上传成功');
                    requestFiles(getCurrentFolder());
                }
                else if (type === 'icon') getIcon();
            }
            else {
                if (type === 'file') {
                    popInfo('fail', status.suc + '个上传成功' + status.fail + '个失败');
                    if (status.suc)
                        requestFiles(getCurrentFolder());
                }
                else if (type === 'icon')
                    popInfo('fail', '头像上传失败');
            }
            $(src).val('');
        },
        error: function () {
            popInfo('fail', '上传失败，请稍后重试');
            $(src).val('');
        }
    })
}

function getCurrentFolder() {
    let tag = $('#folders_path');
    let path = '';
    tag.children().each(function (index) {
        let w = $(this).text();
        switch (w) {
            case '全部文件':
                break;
            case '>':
                break;
            default:
                path += '/' + w;
                break;
        }
    });
    if (path === '') path = '/';
    return path;
}

function renderTableData(files) {
    let table = $('#files_table');
    if (table.children().prop('tagName') !== 'TBODY')
        table.append($('<tbody></tbody>'));
    table = table.children();
    table.empty();
    for (let i = 0; i < files.length; i++) {
        let tr = $('<tr></tr>');
        if (files[i].isDir) tr.addClass('folder');
        else tr.addClass('file');
        if ($('#in_icon').attr('class'))
            tr.addClass('icon_type');
        let td1 = $('<td></td>');
        let td2 = $('<td></td>');
        let td3 = $('<td></td>');
        let input = $('<input>').prop('type', 'checkbox');
        let em = $('<em></em>');
        let span = $('<span></span>').text(files[i].name);
        td1.append(input, em, span);
        if (files[i].isdir === '0') {
            td2.text(files[i].size);
        }
        td3.text(files[i].date);
        tr.append(td1, td2, td3);
        table.append(tr);
    }

}

function requestFiles(path) {
    $('#sel_btn').fadeOut();
    $('.delete').fadeOut();
    let data = {'path': path};
    $.ajax({
        url: '/home/request_files',
        method: 'get',
        data: data,
        dataType: 'json',
        success: function (resData) {
            if (resData && resData.status === 'success')
                renderTableData(resData.files);
            else
                popInfo('fail', '服务器连接错误，请稍后重试');
        },
        error: function () {
            popInfo('fail', '服务器连接错误，请稍后重试');
        }
    });
}

function uploadIcon() {
    let fm = new FormData();
    fm.append('icon', $('.head_icon_btn input')[0].files[0]);
    $.ajax({})

}

function getIcon() {
    $.ajax({
        url: '/home/file?type=head_icon',
        method: 'get',
        success: function (data) {
            if (data !== 'fail') {
                $('#head_icon').attr('src', data);
            }
        }
    })
}
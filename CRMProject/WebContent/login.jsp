<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8">
    <title>首页</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0">
    <link rel="stylesheet" href="css/login.css">
    <script src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.js"></script>
    <script>
        $(function () {
            var login_box = $('#login_box');
            var reg_box = $('#register_box');
            $('#reg_btn').click(function () {
                login_box.hide();
                reg_box.show();
            });
            $('#cancel_btn').click(function () {
                login_box.show();
                reg_box.hide();
            });
        });

        function formSubmit() {
            var p1 = $('#password').val();
            var p2 = $('#password1').val();
            if (p1 !== p2) {
                popInfo('两次输入的密码不一致！');
            } else {
                var query = {
                    "username": $('#user_name').val(),
                    "password": p1
                };
                $.ajax({
                    url: '/register',
                    method: 'post',
                    data: query,
                    success: function (status) {
                        if (status === 'exist')
                            popInfo('fail', '用户名已存在！');
                        else if (status === 'error' || status === 'fail')
                            popInfo('fail', '系统出错，请稍后重试！');
                        else if (status === 'success') {
                            popInfo('ok', '注册成功');
                            window.location.href = '/home';
                        }
                    },
                    error: function (obj, status) {
                        if (status && status === 'timeout')
                            popInfo('fail', '连接超时，请稍后重试');
                    }
                });
            }
            return false;
        }

        function popInfo(status, text) {
            if (status === 'ok')
                $('#status_icon').attr('src', './images/ok.png');
            else
                $('#status_icon').attr('src', './images/fail.png');
            $('#pop_text').html(text);
            var popup = $('#popup');
            popup.show().fadeOut(3000);
        }

        function onLogin() {
            var data = {
                'username': $('#l_user_name').val(),
                'password': $('#l_password').val()
            };
            $.ajax({
                url: 'user_login.action',
                method: 'get',
                data: data,
                success: function (status) {
                    if (status)
                        if (status === 'success') {
                            popInfo('ok', '登录成功，正在跳转...');
                            window.location.href = '/home';
                        } else if (status === 'fail') {
                            popInfo('fail', '登录失败，密码错误，请重试');
                        } else if (status === 'not_exist') {
                            popInfo('fail', '用户不存在，请先注册');
                        }
                },
                error: function (obj, status) {
                    if (status && status === 'timeout')
                        popInfo('fail', '连接超时，请稍后重试');
                }
            });
            return false;
        }
    </script>
</head>

<body>
<div class="bg"></div>
<div class="form_box login_box" id="login_box">
    <p>登录</p>
    <form onsubmit="return onLogin()">
        <div>
            <span class="label">用户名:</span>
            <input type="text" name="user_name" class="input_field" title="用户名"
                   placeholder="请输入用户名" required id="l_user_name">
        </div>
        <div>
            <span class="label">密码:</span>
            <input type="password" name="password" class="input_field" title="密码"
                   placeholder="请输入密码" required id="l_password">
        </div>
        <div class="btn_div">
            <input type="submit" name="login" class="login_button" value="登录" id="login_btn">
            <input type="button" name="register" class="register_button" id="reg_btn" value="注册">
        </div>
    </form>
</div>
<div class="form_box register_box" id="register_box" hidden>
    <p>注册</p>
    <form onsubmit="return formSubmit()">
        <div class="input_line">
            <span class="label">用户名:</span>
            <input type="text" name="user_name" class="input_field" title="用户名" placeholder="请输入用户名"
                   pattern="[\w_]+" required id="user_name">
            <div class="user_hint float_hint">用户名必须由下划线、英文字符或者数字组合而成</div>
        </div>
        <div class="input_line">
            <span class="label">密码:</span>
            <input type="password" name="password" class="input_field" title="密码" placeholder="请输入密码"
                   pattern="(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])\S{6,16}" required id="password">
            <div class="passwd_hint float_hint">密码长度为6-16位，必须包含大写字母、小写字母以及数字</div>
        </div>
        <div class="input_line">
            <span class="label">确认密码:</span>
            <input type="password" name="password2" class="input_field" title="密码" placeholder="请重新输入密码"
                   pattern="(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])\S{6,16}" required id="password1">
            <div class="passwd2_hint float_hint">重新输入密码，确保两次输入一致</div>
        </div>
        <div class="btn_div">
            <input type="submit" name="submit" class="login_button" id="register_btn" value="提交">
            <input type="button" name="cancel" class="register_button" id="cancel_btn" value="取消">
        </div>
    </form>
</div>
<!--提醒框-->
<div class="popup_div" id="popup" hidden>
    <img id="status_icon" src="./images/ok.png">
    <p id="pop_text"></p>
</div>
</body>

</html>
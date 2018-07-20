package cn.crm.util;

import cn.crm.domain.User;
import cn.crm.service.UserService;

import javax.servlet.http.HttpSession;

public class StateValidate {

    // 检测登录用户的合法性
    public static String validateState(HttpSession session, UserService userService) {
        String status = "";
        String s = (String) session.getAttribute("user");
        System.out.println("Session: " + s);
        if (s != null) {
            if (!s.contains(";"))
                return status;
            String[] attrs = s.split(";");
            User u = new User();
            u.setUser_code(attrs[0]);
            User u1 = userService.checkUser(u);
            if (u1 != null) {
                String text = u1.getUser_code() + u1.getUser_password();
                String code = MD5Utils.md5(text);
                if (code.equals(attrs[1]))
                    status = "success";
                else
                    status = "fail";
            } else
                status = "fail";
        }
        return status;
    }
}

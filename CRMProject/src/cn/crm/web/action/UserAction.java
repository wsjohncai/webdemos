package cn.crm.web.action;

import cn.crm.domain.User;
import cn.crm.service.UserService;
import cn.crm.service.UserServiceImpl;
import com.opensymphony.xwork2.ActionSupport;
import com.opensymphony.xwork2.ModelDriven;

public class UserAction extends ActionSupport implements ModelDriven<User> {

    private User user = new User();
    private UserService userService;
    private String username, password;

    @Override
    public User getModel() {
        return user;
    }

    public void setUserService(UserServiceImpl userService) {
        this.userService = userService;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String login() {
        User u = new User();
        u.setUser_name(username);
        u.setUser_password(password);
        System.out.println(u);
        if (userService.checkUser(u))
            return "loginOK";
        return "not_exist";
    }
}

package cn.crm.service;

import cn.crm.domain.User;

public interface UserService {
    boolean checkUser(User u);
    boolean checkCode(String usercode);
    boolean saveUser(User u);
}

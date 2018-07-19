package cn.crm.service;

import cn.crm.domain.User;

public interface UserService {
    User checkUser(User u);
    boolean checkCode(String usercode);
    boolean saveUser(User u);
}

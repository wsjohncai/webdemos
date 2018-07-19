package cn.crm.dao;

import cn.crm.domain.User;

public interface UserDao {
    User hasUser(User u);
    boolean hasCode(String usercode);
    boolean save(User u);
}

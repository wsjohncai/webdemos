package cn.crm.dao;

import cn.crm.domain.User;

public interface UserDao {
    boolean hasUser(User u);
    boolean hasCode(String usercode);
    boolean save(User u);
}

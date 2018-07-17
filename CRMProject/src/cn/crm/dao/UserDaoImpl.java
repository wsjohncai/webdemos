package cn.crm.dao;

import cn.crm.domain.User;
import org.springframework.orm.hibernate5.support.HibernateDaoSupport;

import java.util.List;

public class UserDaoImpl extends HibernateDaoSupport implements UserDao {
    public void chechCode() {
    }

    @Override
    public boolean hasUser(User u) {
        List<User> list = this.getHibernateTemplate().findByExample(u);
        System.out.println(list);
        return list.size() == 1;
    }
}

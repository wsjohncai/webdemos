package cn.crm.dao;

import cn.crm.domain.User;
import org.springframework.orm.hibernate5.support.HibernateDaoSupport;

import java.util.List;

public class UserDaoImpl extends HibernateDaoSupport implements UserDao {
    @Override
    public boolean hasUser(User u) {
        List<User> list = (List<User>) this.getHibernateTemplate().findByExample(u);
        System.out.println(list);
        return list.size() == 1;
    }

	@Override
	public boolean hasCode(String usercode) {
		return this.getHibernateTemplate().find("from User where user_code=?", usercode).size() != 0;
	}

	@Override
	public boolean save(User u) {
		return getHibernateTemplate().save(u) != null;
	}
}

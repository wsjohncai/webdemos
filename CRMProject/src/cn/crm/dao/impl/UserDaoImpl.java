package cn.crm.dao.impl;

import cn.crm.dao.UserDao;
import cn.crm.domain.User;
import org.springframework.orm.hibernate5.support.HibernateDaoSupport;

import java.util.List;

public class UserDaoImpl extends HibernateDaoSupport implements UserDao {
    @Override
    public boolean hasUser(User u) {
        List<User> list = this.getHibernateTemplate().findByExample(u);
        return list.size() == 1;
    }

	@Override
	public boolean hasCode(String usercode) {
		System.out.println(getHibernateTemplate().find("from User where user_code=?", usercode));
		return this.getHibernateTemplate().find("from User where user_code=?", usercode).size() != 0;
	}

	@Override
	public boolean save(User u) {
		return getHibernateTemplate().save(u) != null;
	}
}

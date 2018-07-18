package cn.crm.service.impl;

import cn.crm.domain.User;
import cn.crm.service.UserService;
import org.springframework.transaction.annotation.Transactional;

import cn.crm.dao.UserDao;

@Transactional
public class UserServiceImpl implements UserService {

	private UserDao userDao;

	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}

	@Override
	public boolean checkUser(User u) {
		return userDao.hasUser(u);
	}

	@Override
	public boolean checkCode(String usercode) {
		return userDao.hasCode(usercode);
	}

	@Override
	public boolean saveUser(User u) {
		return userDao.save(u);
	}
	
}

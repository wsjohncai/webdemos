package cn.crm.service;

import org.springframework.transaction.annotation.Transactional;

import cn.crm.dao.UserDao;

@Transactional
public class UserServiceImpl implements UserService {

	private UserDao userDao;

	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}
	
}

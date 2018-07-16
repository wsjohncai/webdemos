package com.test.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.test.dao.UserDao;
import com.test.pojo.Cat;
import com.test.pojo.User;
import com.test.service.UserService;

@Component(value="userService")
@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserDao userDao;
	
	@Transactional
	@Override
	public void changeCat(User fromUser, User toUser) {
		Cat cat1 = userDao.loseCat(fromUser);
		Cat cat2 = userDao.loseCat(toUser);
		userDao.getCat(toUser,cat1);
		userDao.getCat(fromUser,cat2);
		
	}

}

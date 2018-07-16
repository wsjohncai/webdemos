package com.test.dao;

import com.test.pojo.Cat;
import com.test.pojo.User;

public interface UserDao {
	void getCat(User u, Cat cat);
	Cat loseCat(User u);
}

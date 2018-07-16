package com.test.dao.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.sun.javafx.collections.MappingChange.Map;
import com.test.dao.UserDao;
import com.test.pojo.Cat;
import com.test.pojo.User;

@Component(value="userDao")
@Repository
public class UserDaoImpl implements UserDao {

	@Autowired
	private JdbcTemplate template;
	
	@Override
	public void getCat(User u, Cat cat) {
		System.out.println(u.getName()+"获得一只猫："+cat);
		template.update("update user set cat=? where name=?",new Object[] {cat.toString(), u.getName()});
	}

	@Override
	public Cat loseCat(User u) {
		System.out.println(u.getName()+"失去一只猫");
		java.util.Map<String, Object> map = template.queryForList("select cat from user where name=?", new Object[] {u.getName()}).get(0);
		Cat cat = new Cat((String) map.get("cat"));
		template.update("update user set cat=? where name=?",new Object[] {"", u.getName()});
		return cat;
	}
	
}

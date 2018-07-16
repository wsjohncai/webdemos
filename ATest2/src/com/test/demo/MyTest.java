package com.test.demo;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.sun.org.apache.xml.internal.security.Init;
import com.test.dao.UserDao;
import com.test.mapper.UserMapper;
import com.test.pojo.User;
import com.test.service.UserService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations ="classpath:appContext.xml")
public class MyTest {
	@Autowired
	private JdbcTemplate template;
	
	@Autowired
	private UserService s;
	
	private SqlSessionFactory factory;
	
	@Before
	public void init() throws IOException {
		InputStream inputStream = Resources.getResourceAsStream("mybatis-config.xml");
		factory = new SqlSessionFactoryBuilder().build(inputStream);
	}
	
	@Test
	public void test() throws IOException{
//		AJdkProxy.getProxy(dao).daoTest();
//		CGLibProxy.getProxy().daoTest();
//		List<java.util.Map<String, Object>> users = template.queryForList("select * from user");
//		for (java.util.Map<String, Object> u : users) {
//			System.out.println(u);
//		}
//		template.update("insert into user values(null, 'merry', 'female', 24)");
//		users = template.queryForList("select * from user");
//		for (java.util.Map<String, Object> u : users) {
//			System.out.println(u);
//		}
		
		//事务使用例子
//		User user1 = new User("wang");
//		User user2 = new User("liu");
//		s.changeCat(user1, user2);
		
		//mybatis使用例子
		SqlSession session = factory.openSession();
		UserMapper mapper = session.getMapper(UserMapper.class);
		User u = mapper.queryById(2);
		System.out.println(u);
	}
	
	/**
	@Test
	public void test2(){
		ClassPathXmlApplicationContext context =new ClassPathXmlApplicationContext("application.xml");
		UserDao u = (UserDao) context.getBean("userService");
		u.daoTest();
		context.close();
	}
	
	@Test
	public void test3(){
		ClassPathXmlApplicationContext context =new ClassPathXmlApplicationContext("application.xml");
		User u = (User) context.getBean("user");
		System.out.println(u);
		context.close();
	}
	
	@Test
	public void test4(){
		ClassPathXmlApplicationContext context =new ClassPathXmlApplicationContext("application.xml");
		Person u = (Person) context.getBean("person");
		System.out.println(u);
		context.close();
	}
	*/
}

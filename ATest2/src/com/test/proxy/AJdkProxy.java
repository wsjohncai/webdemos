package com.test.proxy;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

import com.test.dao.UserDao;

public class AJdkProxy {
	
	public static UserDao getProxy(UserDao dao) {
		return (UserDao)Proxy.newProxyInstance(dao.getClass().getClassLoader(), dao.getClass().getInterfaces(), new InvocationHandler() {
			
			@Override
			public Object invoke(Object obj, Method arg1, Object[] arg2) throws Throwable {
				if(arg1.getName().equals("daoTest")) {
					System.out.println("Enhanced daoTest method");
				}
				return arg1.invoke(dao, arg2);
			}
		});
	}
}

package com.test.proxy;

import java.lang.reflect.Method;

import org.springframework.cglib.proxy.Enhancer;
import org.springframework.cglib.proxy.MethodInterceptor;
import org.springframework.cglib.proxy.MethodProxy;

import com.test.dao.UserDao;
import com.test.dao.impl.UserDaoImpl;

public class CGLibProxy {
	public static UserDao getProxy() {
		Enhancer en = new Enhancer();
		en.setSuperclass(UserDaoImpl.class);
		en.setCallback(new MethodInterceptor() {
			
			@Override
			public Object intercept(Object arg0, Method arg1, Object[] arg2, MethodProxy arg3) throws Throwable {
				if(arg1.getName().equals("daoTest")) {
					System.out.println("Enhanced with enhancer in doTest method.");
				}
				return arg3.invokeSuper(arg0, arg2);
			}
		});
		return (UserDao)en.create();
	}
}

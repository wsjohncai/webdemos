package com.test.proxy;

import org.aspectj.lang.ProceedingJoinPoint;
import org.springframework.stereotype.Component;

@Component(value = "myAspect")
public class MyAspect {

	public void enhanceAround(ProceedingJoinPoint pjp) {
		System.out.println("Around enhancement in MyAspect in the front.");
		try {
			pjp.proceed();
		} catch (Throwable e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println("Around enhancement in MyAspect in the after.");
	}

}

package com.test.pojo;

import java.io.Serializable;
import java.util.Arrays;

public class Person implements Serializable {
	//�����顢���ϵȹ���
	String[] strs;

	public String[] getStrs() {
		return strs;
	}

	public void setStrs(String[] strs) {
		this.strs = strs;
	}

	@Override
	public String toString() {
		return "Person [strs=" + Arrays.toString(strs) + "]";
	}
	
}

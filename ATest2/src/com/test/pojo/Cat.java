package com.test.pojo;

import java.io.Serializable;

public class Cat implements Serializable{
	private String name;
	
	public Cat(String name) {
		this.name = name;
	}
	
	@Override
	public String toString() {
		return name;
	}
}

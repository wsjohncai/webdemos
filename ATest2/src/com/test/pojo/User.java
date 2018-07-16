package com.test.pojo;

import java.io.Serializable;

public class User implements Serializable{
	private int id;
	private String name;
	private String cat;
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public User(int id, String name, String cat) {
		this.id = id;
		this.name = name;
		this.cat = cat;
	}

	public User(String name, String cat) {
		this.name = name;
		this.cat = cat;
	}

	public User(String name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return "User [id=" + id + ", name=" + name + ", cat=" + cat + "]";
	}
	
	public String getName() {
		return name;
	}

	public String getCat() {
		return cat;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setCat(String cat) {
		this.cat = cat;
	}
	
	
}

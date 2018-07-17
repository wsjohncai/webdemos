package cn.crm.web.action;

import com.opensymphony.xwork2.ActionSupport;
import com.opensymphony.xwork2.ModelDriven;

import cn.crm.domain.User;
import cn.crm.service.UserService;

public class UserAction extends ActionSupport implements ModelDriven<User> {

	private User user = new User();
	private UserService userService;
	
	@Override
	public User getModel() {
		return user;
	}

	public void setService(UserService userService) {
		this.userService = userService;
	}
	
}

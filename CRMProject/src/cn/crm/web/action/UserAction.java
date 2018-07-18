package cn.crm.web.action;

import cn.crm.domain.User;
import cn.crm.service.UserService;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.ActionSupport;
import com.opensymphony.xwork2.ModelDriven;

public class UserAction extends ActionSupport implements ModelDriven<User> {

	private User user = new User();
	private UserService userService;
	@Override
	public User getModel() {
		return user;
	}

	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	//检查用户名
	public String checkCode() {
		System.out.println("Action-User: " + user);
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setContentType("text/html");
		PrintWriter writer = null;
		String status = "";
		try {
			writer = response.getWriter();
			if (userService.checkCode(user.getUser_code())) {
				status = "exist";
			} else
				status = "not_exist";
			writer.print(status);
			writer.flush();
			writer.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}

	//登录方法
	public String login() {
		System.out.println("Action-User: " + user);
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setContentType("text/html");
		PrintWriter writer = null;
		String status = "";
		try {
			writer = response.getWriter();
			if (!userService.checkCode(user.getUser_code())) {
				status = "not_exist";
			}
			if (status.equals("")) {
				if (userService.checkUser(user)) {
					status = "success";
				} else
					status = "fail";
			}
			writer.print(status);
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			writer.flush();
			writer.close();
		}
		return null;
	}
	
	//注册
	public String register() {
		System.out.println("Action-User: " + user);
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setContentType("text/html");
		PrintWriter writer = null;
		String status = "";
		try {
			writer = response.getWriter();
			if (userService.checkCode(user.getUser_code())) {
				status = "exist";
			}
			if (status.equals("")) {
				user.setUser_state("1");
				if (userService.saveUser(user)) {
					status = "success";
				} else
					status = "fail";
			}
			writer.print(status);
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			writer.flush();
			writer.close();
		}
		return null;
	}
}

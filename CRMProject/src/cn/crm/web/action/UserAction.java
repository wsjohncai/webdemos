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
		System.out.println("User: " + user);
		return user;
	}

	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	//����û�������
	public String checkCode() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setContentType("text/html");
		PrintWriter writer = null;
		String status = "";
		try {
			writer = response.getWriter();
		} catch (IOException e) {
			e.printStackTrace();
		}
		if (userService.checkCode(user.getUser_code())) {
			status = "exist";
		} else
			status = "not_exist";
		writer.print(status);
		writer.flush();
		writer.close();
		return null;
	}

	//��¼
	public String login() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setContentType("text/html");
		PrintWriter writer = null;
		String status = "";
		try {
			writer = response.getWriter();
			if (!userService.checkCode(user.getUser_code())) {
				status = "not_exist";
			}
			if (status == "") {
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
	
	//ע��
	public String register() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setContentType("text/html");
		PrintWriter writer = null;
		String status = "";
		try {
			writer = response.getWriter();
			if (userService.checkCode(user.getUser_code())) {
				status = "exist";
			}
			if (status == "") {
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

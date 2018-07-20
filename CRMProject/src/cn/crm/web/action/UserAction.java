package cn.crm.web.action;

import cn.crm.domain.User;
import cn.crm.service.UserService;
import cn.crm.util.MD5Utils;
import com.opensymphony.xwork2.ActionSupport;
import com.opensymphony.xwork2.ModelDriven;
import org.apache.struts2.ServletActionContext;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

import static cn.crm.util.StateValidate.validateState;

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

	// 检查用户名
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

	//登出方法
	public String logout() {
		HttpSession session = ServletActionContext.getRequest().getSession();
		session.setAttribute("user", null);
		session.setAttribute("usercode", null);
		return "login";
	}
	
	// 登录方法
	public String login() {
		System.out.println("Action-User: " + user);
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setContentType("text/html");
		PrintWriter writer = null;
		String status = "";
		try {
			writer = response.getWriter();
			HttpSession session = ServletActionContext.getRequest().getSession();
			String loginC = validateState(session, userService);
			if (!loginC.equals("")) {
				writer.print(loginC);
				return null;
			}
			if (!userService.checkCode(user.getUser_code())) {
				status = "not_exist";
			}
			if (status.equals("")) {
				if (userService.checkUser(user) != null) {
					String sessionText = user.getUser_code() + ";"
							+ MD5Utils.md5(user.getUser_code() + user.getUser_password());
					session.setAttribute("user", sessionText);
					session.setAttribute("usercode", user.getUser_code());
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

	// 注册
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

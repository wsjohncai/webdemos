package cn.crm.domain;

public class Customer {
	private String cust_id;
	private String cust_name; 
	private String cust_user_id; 
	private String cust_file_path; 
	private Dict cust_source; 
	private Dict cust_industry; 
	private Dict cust_level; 
	private String cust_linkman; 
	private String cust_phone; 
	private String cust_mobile;
	public String getCust_id() {
		return cust_id;
	}
	public void setCust_id(String cust_id) {
		this.cust_id = cust_id;
	}
	public String getCust_name() {
		return cust_name;
	}
	public void setCust_name(String cust_name) {
		this.cust_name = cust_name;
	}
	public String getCust_user_id() {
		return cust_user_id;
	}
	public void setCust_user_id(String cust_user_id) {
		this.cust_user_id = cust_user_id;
	}
	public String getCust_file_path() {
		return cust_file_path;
	}
	public void setCust_file_path(String cust_file_path) {
		this.cust_file_path = cust_file_path;
	}
	public Dict getCust_source() {
		return cust_source;
	}
	public void setCust_source(Dict cust_source) {
		this.cust_source = cust_source;
	}
	public Dict getCust_industry() {
		return cust_industry;
	}
	public void setCust_industry(Dict cust_industry) {
		this.cust_industry = cust_industry;
	}
	public Dict getCust_level() {
		return cust_level;
	}
	public void setCust_level(Dict cust_level) {
		this.cust_level = cust_level;
	}
	public String getCust_linkman() {
		return cust_linkman;
	}
	public void setCust_linkman(String cust_linkman) {
		this.cust_linkman = cust_linkman;
	}
	public String getCust_phone() {
		return cust_phone;
	}
	public void setCust_phone(String cust_phone) {
		this.cust_phone = cust_phone;
	}
	public String getCust_mobile() {
		return cust_mobile;
	}
	public void setCust_mobile(String cust_mobile) {
		this.cust_mobile = cust_mobile;
	}
	@Override
	public String toString() {
		return "Customer [cust_id=" + cust_id + ", cust_name=" + cust_name + ", cust_user_id=" + cust_user_id
				+ ", cust_file_path=" + cust_file_path + ", cust_source=" + cust_source + ", cust_industry="
				+ cust_industry + ", cust_level=" + cust_level + ", cust_linkman=" + cust_linkman + ", cust_phone="
				+ cust_phone + ", cust_mobile=" + cust_mobile + "]";
	}
	
	
}

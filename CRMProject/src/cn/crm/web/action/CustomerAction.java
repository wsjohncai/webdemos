package cn.crm.web.action;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;
import com.opensymphony.xwork2.util.ValueStack;

import cn.crm.domain.Customer;
import cn.crm.domain.PageBean;
import cn.crm.service.CustomerService;
import cn.crm.service.DictService;

public class CustomerAction extends ActionSupport {

	private static final long serialVersionUID = 1L;
	private Customer customer = new Customer();
	private CustomerService customerService;
	private DictService dictService;

	public void setCustomerService(CustomerService customerService) {
		this.customerService = customerService;
	}

	public void setDictService(DictService dictService) {
		this.dictService = dictService;
	}

	public String add() {

		return null;
	}

	// 属性驱动的方式
	// 当前页，默认值就是 1
	private Integer pageCode = 1;

	public void setPageCode(Integer pageCode) {
		if (pageCode == null) {
			pageCode = 1;
		}
		this.pageCode = pageCode;
	}

	// 每页显示的数据的条数
	private Integer pageSize = 3;

	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}

	private String custname;
	private String custsource;
	private String custlevel;
	
	public void setCust_name(String cust_name) {
		this.custname = cust_name;
	}

	public void setCust_source(String cust_source) {
		this.custsource = cust_source;
	}

	public void setCust_level(String cust_level) {
		this.custlevel = cust_level;
	}

	/** 分页的查询方法 */
	public String findByPage() {

		// 调用 service 业务层
		DetachedCriteria criteria = DetachedCriteria.forClass(Customer.class);
		System.out.println("Selections: "+custlevel+"&"+custsource+"&"+custname);
		if (custname != null && !custname.equals(""))
			criteria.add(Restrictions.ilike("cust_name", customer.getCust_name()));
		if (custsource != null)
			criteria.add(Restrictions.eq("cust_source", dictService.findByItemName(custsource)));
		if (custlevel != null)
			criteria.add(Restrictions.eq("cust_level", dictService.findByItemName(custlevel)));
		// 查询
		PageBean<Customer> page = customerService.findByPage(pageCode, pageSize, criteria);

		// 压栈
		ValueStack vs = ActionContext.getContext().getValueStack();

		// 栈顶是 map<"page", page对象>
		vs.set("page", page);
		return "page";
	}

}

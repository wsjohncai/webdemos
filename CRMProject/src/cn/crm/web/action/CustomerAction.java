package cn.crm.web.action;

import cn.crm.domain.Customer;
import cn.crm.domain.Dict;
import cn.crm.domain.PageBean;
import cn.crm.service.CustomerService;
import cn.crm.service.UserService;
import cn.crm.util.StateValidate;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;
import com.opensymphony.xwork2.ModelDriven;
import com.opensymphony.xwork2.util.ValueStack;
import org.apache.struts2.ServletActionContext;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;

public class CustomerAction extends ActionSupport implements ModelDriven<Customer> {

    private static final long serialVersionUID = 1L;
    private CustomerService customerService;
    private Customer customer = new Customer();

    public void setCustomerService(CustomerService customerService) {
        this.customerService = customerService;
    }

    @Override
    public Customer getModel() {
        return customer;
    }

    public String add() {

        return null;
    }

    //编辑操作
    public String edit(){
        Customer c = customerService.findById(customer.getCust_id());
        ValueStack vs = ActionContext.getContext().getValueStack();
        vs.set("customer", c);
        return "editPage";
    }

    //删除
    public String delete(){
        customerService.delete(customer);
        return "afterDel";
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


    /**
     * 分页的查询方法
     */
    public String findByPage() {

        String cust_name = customer.getCust_name();
        Dict cust_source = customer.getCust_source();
        Dict cust_level = customer.getCust_level();

        // 调用 service 业务层
        DetachedCriteria criteria = DetachedCriteria.forClass(Customer.class);
        System.out.println("Selections: " + cust_level + "&" + cust_source + "&" + cust_name + "&" + pageCode + "&" + pageSize);

        String[] vals = new String[3];
        if (cust_name != null && !cust_name.equals("")) {
            vals[0] = cust_name;
            criteria.add(Restrictions.ilike("cust_name", "%"+cust_name+"%"));
        }
        if (cust_source != null && !cust_source.getDict_id().trim().isEmpty()) {
            vals[1] = cust_source.getDict_id();
            criteria.add(Restrictions.eq("cust_source.dict_id", vals[1]));
        }
        if (cust_level != null && !cust_level.getDict_id().trim().isEmpty()) {
            vals[2] = cust_level.getDict_id();
            criteria.add(Restrictions.eq("cust_level.dict_id", vals[2]));
        }

        // 查询
        PageBean<Customer> page = customerService.findByPage(pageCode, pageSize, criteria);
        page.setCons(vals);

        // 获取值栈
        ValueStack vs = ActionContext.getContext().getValueStack();
        // 栈顶是 map<"page", page对象>
        vs.set("page", page);
        return "page";
    }
}

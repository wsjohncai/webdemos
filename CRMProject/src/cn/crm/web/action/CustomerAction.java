package cn.crm.web.action;

import cn.crm.domain.Customer;
import cn.crm.domain.Dict;
import cn.crm.domain.PageBean;
import cn.crm.service.CustomerService;
import cn.crm.service.DictService;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;
import com.opensymphony.xwork2.util.ValueStack;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;

public class CustomerAction extends ActionSupport {

    private static final long serialVersionUID = 1L;
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

    public void setCustname(String custname) {
        this.custname = custname;
    }

    public void setCustsource(String custsource) {
        this.custsource = custsource;
    }

    public void setCustlevel(String custlevel) {
        this.custlevel = custlevel;
    }

    /**
     * 分页的查询方法
     */
    public String findByPage() {

        // 调用 service 业务层
        DetachedCriteria criteria = DetachedCriteria.forClass(Customer.class);
        System.out.println("Selections: " + custlevel + "&" + custsource + "&" + custname + "&" + pageCode + "&" + pageSize);

        String[] vals = new String[3];
        if (custname != null && !custname.equals("")) {
            vals[0] = custname;
            criteria.add(Restrictions.ilike("cust_name", custname));
        }
        if (custsource != null && !(custsource.length() == 0)) {
            vals[1] = custsource;
            Dict d = dictService.findByItemName(custsource);
            if (d != null)
                criteria.add(Restrictions.eq("cust_source", d));
        }
        if (custlevel != null && !(custlevel.length() == 0)) {
            vals[2] = custlevel;
            Dict d = dictService.findByItemName(custlevel);
            if (d != null)
                criteria.add(Restrictions.eq("cust_level", d));
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

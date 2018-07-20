package cn.crm.dao.impl;

import cn.crm.dao.CustomerDao;
import cn.crm.domain.Customer;
import cn.crm.domain.PageBean;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Projections;
import org.springframework.orm.hibernate5.support.HibernateDaoSupport;

import java.util.List;

public class CustomerDaoImpl extends HibernateDaoSupport implements CustomerDao {

    @Override
    public boolean save(Customer customer) {
        return getHibernateTemplate().save(customer) == null;
    }

    @Override
    public void delete(Customer customer) {
        getHibernateTemplate().delete(customer);
    }

    @Override
    public Customer findById(String id) {
        List<Customer> list = (List<Customer>) getHibernateTemplate().find("from Customer where cust_id=?", id);
        return list.size() == 1 ? list.get(0) : null;
    }

    @Override
    public PageBean<Customer> findByPage(Integer pageCode, Integer pageSize, DetachedCriteria criteria) {
        PageBean<Customer> page = new PageBean<Customer>();
        page.setPageCode(pageCode);
        page.setPageSize(pageSize);

        // 先查询总记录数：select count(*)
        criteria.setProjection(Projections.rowCount());

        List<Number> list = (List<Number>) this.getHibernateTemplate().findByCriteria(criteria);

        if (list != null && list.size() > 0) {

            int totalCount = list.get(0).intValue();

            // 总的记录数
            page.setTotalCount(totalCount);
        }

        // 强调：把select count(*) 先清空，变成 select * ...
        criteria.setProjection(null);

        // 提供分页的查询
        List<Customer> beanList = (List<Customer>) this.getHibernateTemplate().findByCriteria(criteria,
                (pageCode - 1) * pageSize, pageSize);

        // 分页查询数据，每页显示的数据 使用limit
        page.setBeanList(beanList);

        return page;

    }

	@Override
	public void update(Customer customer) {
		getHibernateTemplate().update(customer);
	}

}

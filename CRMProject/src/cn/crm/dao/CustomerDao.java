package cn.crm.dao;

import org.hibernate.criterion.DetachedCriteria;

import cn.crm.domain.Customer;
import cn.crm.domain.PageBean;

public interface CustomerDao {
	boolean save(Customer customer);

	PageBean<Customer> findByPage(Integer pageCode, Integer pageSize, DetachedCriteria criteria);
}

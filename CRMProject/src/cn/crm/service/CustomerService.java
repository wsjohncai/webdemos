package cn.crm.service;

import org.hibernate.criterion.DetachedCriteria;

import cn.crm.domain.Customer;
import cn.crm.domain.PageBean;

public interface CustomerService {
	boolean save(Customer customer);

	PageBean<Customer> findByPage(Integer pageCode, Integer pageSize, DetachedCriteria criteria);
}

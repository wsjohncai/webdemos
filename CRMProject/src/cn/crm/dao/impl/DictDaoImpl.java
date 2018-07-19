package cn.crm.dao.impl;

import org.springframework.orm.hibernate5.support.HibernateDaoSupport;

import cn.crm.dao.DictDao;
import cn.crm.domain.Dict;

public class DictDaoImpl extends HibernateDaoSupport implements DictDao {

	@Override
	public Dict findByItemName(String name) {
		return (Dict) getHibernateTemplate().find("from Dict where dict_item_name", name);
	}

}

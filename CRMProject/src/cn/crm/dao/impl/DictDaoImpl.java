package cn.crm.dao.impl;

import cn.crm.dao.DictDao;
import cn.crm.domain.Dict;
import org.springframework.orm.hibernate5.support.HibernateDaoSupport;

import java.util.List;

public class DictDaoImpl extends HibernateDaoSupport implements DictDao {

    @Override
    public Dict findByItemName(String name) {
        List<Dict> list = (List<Dict>) getHibernateTemplate().find("from Dict where dict_item_name=?", name);
        return list.size() == 1 ? list.get(0) : null;
    }

    @Override
    public List<Dict> findByCode(String code) {
        return (List<Dict>) getHibernateTemplate().find("from Dict where dict_type_code=?", code);
    }

}

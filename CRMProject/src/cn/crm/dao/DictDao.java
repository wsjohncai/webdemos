package cn.crm.dao;

import cn.crm.domain.Dict;

public interface DictDao {
	Dict findByItemName(String name);
}

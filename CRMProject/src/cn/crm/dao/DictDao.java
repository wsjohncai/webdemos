package cn.crm.dao;

import cn.crm.domain.Dict;

import java.util.List;

public interface DictDao {
	Dict findByItemName(String name);
	List<Dict> findByCode(String code);
}

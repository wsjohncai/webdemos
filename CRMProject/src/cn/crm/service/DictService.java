package cn.crm.service;

import cn.crm.domain.Dict;

import java.util.List;

public interface DictService {
	Dict findByItemName(String name);
	List<Dict> findByCode(String code);
}

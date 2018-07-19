package cn.crm.service;

import cn.crm.domain.Dict;

public interface DictService {
	Dict findByItemName(String name);
}

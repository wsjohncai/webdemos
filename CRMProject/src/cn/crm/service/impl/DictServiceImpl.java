package cn.crm.service.impl;

import cn.crm.dao.DictDao;
import cn.crm.domain.Dict;
import cn.crm.service.DictService;

public class DictServiceImpl implements DictService {

	private DictDao dictDao;
	
	public void setDictDao(DictDao dictDao) {
		this.dictDao = dictDao;
	}

	@Override
	public Dict findByItemName(String name) {
		return dictDao.findByItemName(name);
	}

}

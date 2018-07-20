package cn.crm.web.action;

import cn.crm.domain.Dict;
import cn.crm.service.DictService;
import cn.crm.util.FastJsonUtil;
import com.opensymphony.xwork2.ActionSupport;
import com.opensymphony.xwork2.ModelDriven;
import org.apache.struts2.ServletActionContext;

import javax.servlet.http.HttpServletResponse;
import java.util.List;

public class DictAction extends ActionSupport implements ModelDriven<Dict> {

    private Dict dict = new Dict();
    private DictService dictService;

    @Override
    public Dict getModel() {
        return dict;
    }

    public String codeForItems(){
        List<Dict> list = dictService.findByCode(dict.getDict_type_code());
        HttpServletResponse response = ServletActionContext.getResponse();
        FastJsonUtil.write_json(response, FastJsonUtil.toJSONString(list));
        return null;
    }

    public void setDictService(DictService dictService) {
        this.dictService = dictService;
    }
}

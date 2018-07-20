<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <TITLE>添加客户</TITLE>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <LINK href="${pageContext.request.contextPath }/css/Style.css" type=text/css rel=stylesheet>
    <LINK href="${pageContext.request.contextPath }/css/Manage.css" type=text/css
          rel=stylesheet>
    <META content="MSHTML 6.00.2900.3492" name=GENERATOR>
    <script src="${pageContext.request.contextPath }/js/jquery-1.4.4.min.js"></script>
    <script type="text/javascript">
    	$(function(){
    		var lvl='${customer.cust_level.dict_id}',src='${customer.cust_source.dict_id}',ids='${customer.cust_industry.dict_id}';
    		var data = {dict_type_code: '006'};
            $.post('dict_codeForItems', data, function (res) {
                $(res).each(function (idx, obj) {
                    var sel_lvl = lvl;
                    sel_lvl = (sel_lvl === obj.dict_id ? 'selected' : '');
                    if(sel_lvl === 'selected')
                    	return;
                    $('#i_lvl').append('<option value="' + obj.dict_id + '" ' + sel_lvl + '>' + obj.dict_item_name + '</option>');
                })
            });
            data = {dict_type_code: '002'};
            $.post('dict_codeForItems', data, function (res) {
                $(res).each(function (idx, obj) {
                    var sel_src = src;
                    sel_src = (sel_src === obj.dict_id ? 'selected' : '');
                    if(sel_src === 'selected')
                    	return;
                    $('#i_src').append('<option value="' + obj.dict_id + '" ' + sel_src + '>' + obj.dict_item_name + '</option>');
                })
            });
            data = {dict_type_code: '001'};
            $.post('dict_codeForItems', data, function (res) {
                $(res).each(function (idx, obj) {
                    var sel_industry = ids;
                    sel_industry = (sel_industry === obj.dict_id ? 'selected' : '');
                    if(sel_industry === 'selected')
                    	return;
                    $('#i_industry').append('<option value="' + obj.dict_id + '" ' + sel_industry + '>' + obj.dict_item_name + '</option>');
                })
            });
    	});
    </script>
</HEAD>
<BODY>
<FORM id=form1 name=form1
      action="<s:url action="customer_update"/>"
      method=post>
    <input type="hidden" name="cust_id" value="${cust_id }"/>

    <TABLE cellSpacing=0 cellPadding=0 width="98%" border=0>
        <TBODY>
        <TR>
            <TD width=15><IMG src="${pageContext.request.contextPath }/images/new_019.jpg"
                              border=0></TD>
            <TD width="100%" background=${pageContext.request.contextPath }/images/new_020.jpg
                height=20></TD>
            <TD width=15><IMG src="${pageContext.request.contextPath }/images/new_021.jpg"
                              border=0></TD>
        </TR>
        </TBODY>
    </TABLE>
    <TABLE cellSpacing=0 cellPadding=0 width="98%" border=0>
        <TBODY>
        <TR>
            <TD width=15 background=${pageContext.request.contextPath }/images/new_022.jpg><IMG
                    src="${pageContext.request.contextPath }/images/new_022.jpg" border=0></TD>
            <TD vAlign=top width="100%" bgColor=#ffffff>
                <TABLE cellSpacing=0 cellPadding=5 width="100%" border=0>
                    <TR>
                        <TD class=manageHead>当前位置：客户管理 &gt; 修改客户</TD>
                    </TR>
                    <TR>
                        <TD height=2></TD>
                    </TR>
                </TABLE>
                <TABLE cellSpacing=0 cellPadding=5 border=0>
                    <TR>
                        <td>客户名称：</td>
                        <td>
                            <INPUT class=textbox id=i_name
                                   style="WIDTH: 180px" maxLength=50 name="cust_name" value="${customer.cust_name }">
                        </td>
                        <td>客户级别 ：</td>
                        <td>
                            <select class=textbox id=i_lvl
                                    style="WIDTH: 180px" maxLength=50 name="cust_level.dict_id">
                                <option value="${customer.cust_level.dict_id}" selected>${customer.cust_level.dict_item_name}</option>
                            </select>
                        </td>
                    </TR>

                    <TR>
                        <td>信息来源：</td>
                        <td>
                            <select class=textbox id=i_src
                                    style="WIDTH: 180px" maxLength=50 name="cust_source.dict_id">
                                <option value="${customer.cust_source.dict_id}" selected>${customer.cust_source.dict_item_name}</option>
                            </select>
                        </td>
                        <td>联系人：</td>
                        <td>
                            <input class=textbox id=i_linkman style="WIDTH: 180px" maxLength=50 name="cust_linkman"
                                   value="${customer.cust_linkman }">
                        </td>
                    </TR>
                    <TR>
                        <td>固定电话 ：</td>
                        <td>
                            <INPUT class=textbox id=i_phone
                                   style="WIDTH: 180px" maxLength=50 name="cust_phone" value="${customer.cust_phone }">
                        </td>
                        <td>移动电话 ：</td>
                        <td>
                            <INPUT class=textbox id=i_mobile
                                   style="WIDTH: 180px" maxLength=50 name="cust_mobile"
                                   value="${customer.cust_mobile }">
                        </td>
                    </TR>

                    <TR>
                        <td>所属行业 ：</td>
                        <td>
                            <select class=textbox id=i_industry style="WIDTH: 180px" maxLength=50
                                    name="cust_industry.dict_id">
                                <option value="${customer.cust_industry.dict_id}" selected>${customer.cust_industry.dict_item_name}</option>
                            </select>
                        </td>
                    </TR>
                    <tr>
                        <td rowspan=2>
                            <INPUT class=button id=sButton2 type=submit
                                   value=" 保存 " name=sButton2>
                        </td>
                    </tr>
                </TABLE>


            </TD>
            <TD width=15 background="${pageContext.request.contextPath }/images/new_023.jpg">
                <IMG src="${pageContext.request.contextPath }/images/new_023.jpg" border=0></TD>
        </TR>
        </TBODY>
    </TABLE>
    <TABLE cellSpacing=0 cellPadding=0 width="98%" border=0>
        <TBODY>
        <TR>
            <TD width=15><IMG src="${pageContext.request.contextPath }/images/new_024.jpg"
                              border=0></TD>
            <TD align=middle width="100%"
                background="${pageContext.request.contextPath }/images/new_025.jpg" height=15></TD>
            <TD width=15><IMG src="${pageContext.request.contextPath }/images/new_026.jpg"
                              border=0></TD>
        </TR>
        </TBODY>
    </TABLE>
</FORM>
</BODY>
</HTML>

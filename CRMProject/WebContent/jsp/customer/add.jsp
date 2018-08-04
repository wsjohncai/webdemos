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
            var data = {dict_type_code: '006'};
            $.post('dict_codeForItems', data, function (res) {
                $(res).each(function (idx, obj) {
                    $('#clvl').append('<option value="' + obj.dict_id + '">' + obj.dict_item_name + '</option>');
                })
            });
            data = {dict_type_code: '002'};
            $.post('dict_codeForItems', data, function (res) {
                $(res).each(function (idx, obj) {
                    $('#csrc').append('<option value="' + obj.dict_id + '">' + obj.dict_item_name + '</option>');
                })
            });
            data = {dict_type_code: '001'};
            $.post('dict_codeForItems', data, function (res) {
                $(res).each(function (idx, obj) {
                    $('#cids').append('<option value="' + obj.dict_id + '">' + obj.dict_item_name + '</option>');
                })
            });
        });
       
    </script>
</HEAD>
<BODY>



    <TABLE cellSpacing=0 cellPadding=0 width="98%" border=0>
        <TBODY>
        <TR>
            <TD width=15><IMG src="${pageContext.request.contextPath }/images/new_019.jpg"
                              border=0></TD>
            <TD width="100%" background="${pageContext.request.contextPath }/images/new_020.jpg"
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
                        <TD class=manageHead>当前位置：客户管理 &gt; 添加客户</TD>
                    </TR>
                    <TR>
                        <TD height=2></TD>
                    </TR>
                </TABLE>

                <FORM id=form1 name=form1 action="<s:url action="customer_add"/>" method=post enctype="multipart/form-data">
                <TABLE cellSpacing=0 cellPadding=5 border=0>
                    <TR>
                        <td>客户名称：</td>
                        <td>
                            <INPUT class=textbox id=cid style="WIDTH: 180px" maxLength=50 name="cust_name">
                        </td>
                        <td>客户级别 ：</td>
                        <td>
                            <select class=textbox id=clvl style="WIDTH: 180px" maxLength=50 name="cust_level.dict_id">
                                <option value="">-- 请选择 --</option>
                            </select>
                        </td>
                    </TR>

                    <TR>

                        <td>信息来源 ：</td>
                        <td>
                            <select class=textbox id=csrc style="WIDTH: 180px" maxLength=50 name="cust_source.dict_id">
                                <option value="">-- 请选择 --</option>
                            </select>
                        </td>
                        <td>联系人：</td>
                        <td>
                            <INPUT class=textbox id=clinkman style="WIDTH: 180px" maxLength=50 name="cust_linkman">
                        </td>
                    </TR>

                    <TR>
                        <td>固定电话 ：</td>
                        <td>
                            <INPUT class=textbox id=ctel style="WIDTH: 180px" maxLength=50 name="cust_phone">
                        </td>
                        <td>移动电话 ：</td>
                        <td>
                            <INPUT class=textbox id=cmobile style="WIDTH: 180px" maxLength=50 name="cust_mobile">
                        </td>
                    </TR>

                    <TR>
                        <td>所属行业 ：</td>
                        <td>
                            <select class=textbox id=cids style="WIDTH: 180px" maxLength=50 name="cust_industry.dict_id">
                                <option value="">-- 请选择 --</option>
                            </select>
                        </td>
                        <td>上传文件 ：</td>
                        <td>
                        <INPUT class=textbox id=ccreateId style="WIDTH: 180px; height: 20px" name="upload" type="file">
                        </td>
                    </TR>
                    <tr><td><input type="submit" style="WIDTH: 50px; height: 20px" value="提交"></td></tr>
                </TABLE>
                </FORM>
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
            <TD align=center width="100%"
                background="${pageContext.request.contextPath }/images/new_025.jpg" height=15></TD>
            <TD width=15><IMG src="${pageContext.request.contextPath }/images/new_026.jpg"
                              border=0></TD>
        </TR>
        </TBODY>
    </TABLE>
</BODY>
</HTML>

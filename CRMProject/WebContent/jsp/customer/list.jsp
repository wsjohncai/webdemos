<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html>
<html>
<head>
    <TITLE>客户列表</TITLE>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <LINK href="${pageContext.request.contextPath }/css/Style.css"
          type=text/css rel=stylesheet>
    <LINK href="${pageContext.request.contextPath }/css/Manage.css"
          type=text/css rel=stylesheet>
    <script type="text/javascript"
            src="${pageContext.request.contextPath }/js/jquery-1.4.4.min.js"></script>
    <SCRIPT>
        var lvl = '${page.cons[2]}', src = '${page.cons[1]}';
        $(function () {
            var data = {dict_type_code: '006'};
            $.post('dict_codeForItems', data, function (res) {
                $(res).each(function (idx, obj) {
                    var sel_lvl = lvl;
                    console.log(sel_lvl);
                    sel_lvl = (sel_lvl === obj.dict_id ? 'selected' : '');
                    console.log(sel_lvl);
                    $('#sel_lvl').append('<option value="' + obj.dict_id + '" ' + sel_lvl + '>' + obj.dict_item_name + '</option>');
                })
            });
            data = {dict_type_code: '002'};
            $.post('dict_codeForItems', data, function (res) {
                $(res).each(function (idx, obj) {
                    var sel_src = src;
                    sel_src = (sel_src === obj.dict_id ? 'selected' : '');
                    $('#sel_src').append('<option value="' + obj.dict_id + '" ' + sel_src + '>' + obj.dict_item_name + '</option>');
                })
            });
        });

        function to_page(page) {
            if (page) {
                $("#page").val(page);
            }
            document.customerForm.submit();
        }

        function submitInfo() {
            var curpage = $('#page').val();
        }
    </SCRIPT>

    <META content="MSHTML 6.00.2900.3492" name=GENERATOR>
</HEAD>
<BODY>
<FORM id="customerForm" name="customerForm" action="customer_findByPage.action" method=post>

    <TABLE cellSpacing=0 cellPadding=0 width="98%" border=0>
        <TBODY>
        <TR>
            <TD width=15><IMG
                    src="${pageContext.request.contextPath }/images/new_019.jpg"
                    border=0></TD>
            <TD width="100%"
                background="${pageContext.request.contextPath }/images/new_020.jpg"
                height=20></TD>
            <TD width=15><IMG
                    src="${pageContext.request.contextPath }/images/new_021.jpg"
                    border=0></TD>
        </TR>
        </TBODY>
    </TABLE>
    <TABLE cellSpacing=0 cellPadding=0 width="98%" border=0>
        <TBODY>
        <TR>
            <TD width=15 background=${pageContext.request.contextPath }
                    /images/new_022.jpg><IMG
                    src="${pageContext.request.contextPath }/images/new_022.jpg"
                    border=0></TD>
            <TD vAlign=top width="100%" bgColor=#ffffff>
                <TABLE cellSpacing=0 cellPadding=5 width="100%" border=0>
                    <TR>
                        <TD class=manageHead>当前位置：客户管理 &gt; 客户列表</TD>
                    </TR>
                    <TR>
                        <TD height=2></TD>
                    </TR>
                </TABLE>
                <TABLE borderColor=#cccccc cellSpacing=0 cellPadding=0
                       width="100%" align=center border=0>
                    <TBODY>
                    <TR>
                        <TD height=25>
                            <TABLE cellSpacing=0 cellPadding=2 border=0>
                                <TBODY>
                                <TR>
                                    <TD>客户名称：</TD>
                                    <TD><input class=textbox style="WIDTH: 80px" value="${page.cons[0]}"
                                               maxLength=50 name="cust_name"/></TD>
                                    <TD>客户级别：</TD>
                                    <TD><select name="cust_level.dict_id" id="sel_lvl">
                                        <option value=""></option>
                                    </select></TD>
                                    <TD>客户来源：</TD>
                                    <TD><select name="cust_source.dict_id" id="sel_src">
                                        <option value=""></option>
                                    </select></TD>
                                    <TD><INPUT class="button" type="submit" value=" 筛选 "></TD>
                                </TR>
                                </TBODY>
                            </TABLE>
                        </TD>
                    </TR>

                    <TR>
                        <TD>
                            <TABLE id=grid
                                   style="BORDER-TOP-WIDTH: 0px; FONT-WEIGHT: normal; BORDER-LEFT-WIDTH: 0px; BORDER-LEFT-COLOR: #cccccc; BORDER-BOTTOM-WIDTH: 0px; BORDER-BOTTOM-COLOR: #cccccc; WIDTH: 100%; BORDER-TOP-COLOR: #cccccc; FONT-STYLE: normal; BACKGROUND-COLOR: #cccccc; BORDER-RIGHT-WIDTH: 0px; TEXT-DECORATION: none; BORDER-RIGHT-COLOR: #cccccc"
                                   cellSpacing=1 cellPadding=2 rules=all border=0>
                                <TBODY>
                                <TR style="FONT-WEIGHT: bold; FONT-STYLE: normal; BACKGROUND-COLOR: #eeeeee; TEXT-DECORATION: none">
                                    <TD>客户名称</TD>
                                    <TD>客户级别</TD>
                                    <TD>客户来源</TD>
                                    <TD>联系人</TD>
                                    <TD>电话</TD>
                                    <TD>手机</TD>
                                    <TD>操作</TD>
                                </TR>
                                <c:forEach items="${page.beanList}" var="customer">
                                    <tr style="FONT-WEIGHT: normal; FONT-STYLE: normal; BACKGROUND-COLOR: white; TEXT-DECORATION: none">
                                        <td>${customer.cust_name }</td>
                                        <td>${customer.cust_level.dict_item_name }</td>
                                        <td>${customer.cust_source.dict_item_name }</td>
                                        <td>${customer.cust_linkman }</td>
                                        <td>${customer.cust_phone }</td>
                                        <td>${customer.cust_mobile }</td>
                                        <td><a href="<s:url action="customer_edit">
                                            <s:param name="cust_id">${customer.cust_id}</s:param></s:url>">修改</a>
                                            &nbsp;&nbsp; <a href="<s:url action="customer_delete">
                                             <s:param name="cust_id">${customer.cust_id}</s:param></s:url>">删除</a>
                                        </td>
                                    </tr>
                                </c:forEach>
                                </TBODY>
                            </TABLE>
                        </TD>
                    </TR>

                    <TR>
                        <TD><SPAN id=pagelink></SPAN>
                            <DIV
                                    style="LINE-HEIGHT: 20px; HEIGHT: 20px; TEXT-ALIGN: right">
                                共[<B>${page.totalCount}</B>]条记录，共[<B>${page.totalPage}</B>]页，每页显示
                                <input name="pageSize" value="${page.pageSize}" style="width: 30px">
                                </input> 条
                                <c:if test="${ page.pageCode > 1 }">[<A
                                    href="javascript:to_page(${page.pageCode-1})">前一页</A>]</c:if>
                                <B>${page.pageCode}</B>
                                <c:if test="${ page.pageCode < page.totalPage }">[<A
                                    href="javascript:to_page(${page.pageCode+1})">后一页</A>] </c:if>
                                到 <input type="text" size="3" id="page" name="pageCode"/> 页
                                <input type="button" value="Go" onclick="to_page()"/>
                            </DIV>
                        </TD>
                    </TR>
                    </TBODY>
                </TABLE>
            </TD>
            <TD width=15
                background="${pageContext.request.contextPath }/images/new_023.jpg"><IMG
                    src="${pageContext.request.contextPath }/images/new_023.jpg"
                    border=0></TD>
        </TR>
        </TBODY>
    </TABLE>
    <TABLE cellSpacing=0 cellPadding=0 width="98%" border=0>
        <TBODY>
        <TR>
            <TD width=15><IMG
                    src="${pageContext.request.contextPath }/images/new_024.jpg"
                    border=0></TD>
            <TD align=middle width="100%"
                background="${pageContext.request.contextPath }/images/new_025.jpg"
                height=15></TD>
            <TD width=15><IMG
                    src="${pageContext.request.contextPath }/images/new_026.jpg"
                    border=0></TD>
        </TR>
        </TBODY>
    </TABLE>
</FORM>
</BODY>
</HTML>

<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE HTML>
<HTML>
<HEAD id=Head1>
<TITLE>顶部</TITLE>
<META http-equiv=Content-Type content="text/html; charset=utf-8">
<STYLE type=text/css>
BODY {
	MARGIN: 0;
	padding: 0;
	BACKGROUND-COLOR: #2a8dc8
}

BODY {
	FONT-SIZE: 12px;
	COLOR: #003366;
	FONT-FAMILY: Verdana, Arial, Helvetica, sans-serif
}

TD {
	FONT-SIZE: 12px;
	COLOR: #003366;
	FONT-FAMILY: Verdana, Arial, Helvetica, sans-serif
}

DIV {
	FONT-SIZE: 12px;
	COLOR: #003366;
	FONT-FAMILY: Verdana, Arial, Helvetica, sans-serif
}

P {
	FONT-SIZE: 12px;
	COLOR: #003366;
	FONT-FAMILY: Verdana, Arial, Helvetica, sans-serif
}
</STYLE>
<script src="${pageContext.request.contextPath}/js/jquery-1.4.4.min.js"></script>
<META content="MSHTML 6.00.2900.3492" name=GENERATOR>
</HEAD>
<body>
	<FORM id=form1 name=form1 action="" method=post>
		<TABLE cellSpacing=0 cellPadding=0 width="100%" border=0>
			<TBODY>
				<TR>
					<TD width=10><IMG src="images/new_001.jpg" border=0></TD>
					<TD background=images/new_002.jpg><FONT size=5><B>客户关系管理系统v1.0</B></FONT></TD>
					<TD background=images/new_002.jpg>
						<TABLE cellSpacing=0 cellPadding=0 width="100%" border=0>
							<TBODY>
								<TR><TD align=right height=35></TD></TR>
								<TR>
									<TD height=35 align="right"><span id="current_user" >当前用户：<%=session.getAttribute("usercode")%></span>&nbsp;&nbsp;&nbsp;&nbsp; 
									<A href="#" target=_top><FONT color=red>修改密码</FONT></A> &nbsp;&nbsp;&nbsp;&nbsp; 
									<A href="${pageContext.request.contextPath}/user_logout.action" target=_top><FONT color=red>安全退出</FONT></A>
									</TD>
								</TR>
							</TBODY>
						</TABLE>
					</TD>
					<TD width=10><IMG src="images/new_003.jpg" border=0></TD>
				</TR>
			</TBODY>
		</TABLE>
	</FORM>
</body>
<script>
var user =<%=session.getAttribute("usercode")%>;
	$(function(){
	});
</script>
</html>
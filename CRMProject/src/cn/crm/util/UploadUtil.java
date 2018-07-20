package cn.crm.util;

import java.util.UUID;

public class UploadUtil {
	
	/**
	 * 传入文件的名称，返回的唯一的名称
	 * 例如：gril.jpg 返回 sdjsljfsjdl.jpg
	 */
	public static String getUUIDName(String filename){
		// 先查找
		int index = filename.lastIndexOf(".");
		// 截取
		String lastname = filename.substring(index, filename.length());
		// 唯一 字符串  fsd-sfsdf-sfsd-sdfsd
		String uuid = UUID.randomUUID().toString().replace("-", "");
		return uuid+lastname;
	}
	
	// 测试
	public static void main(String[] args) {
		String filename = "girl.jpg";
		String uuid = getUUIDName(filename);
		System.out.println(uuid);
	}
}

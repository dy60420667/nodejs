#FileName:lean001.py
#author:www.py40.com

#执行os命令
import os
import shutil
import sys
import json

path_item = sys.path[0]
path_apk_folder =path_item+'\\apk'

def modifyFile(tfile,sstr,rstr):
	print('开始修改文件'+tfile)
	print('原始内容'+sstr)
	print('替换内容'+rstr)
	try:
	    lines=open(tfile,'r',encoding='utf-8').readlines()
	    flen=len(lines)
	    for i in range(flen):
	        if sstr in lines[i]:
	            lines[i]=lines[i].replace(sstr,rstr)
	    open(tfile,'w',encoding='utf-8').writelines(lines)   
	    print('修改文件内容成功：'+rstr)
	except IOError:
		print('输入输出异常')
	except Exception as e:
		print(e)
		print('修改内容失败')

#修改icon
def modifyIcon():
	print('开始修改ic_launcher')
	if not os.path.exists(path_item+"\\ic_launcher.png"):
		print('图片资源不存在，不修改ic_launcher')
		return
	print('图片资源存在，开始修改ic_launcher')
	for filedrawable in os.listdir(path_apk_folder+"\\res"):
		if 'drawable' in filedrawable:
			print('处理文件:'+path_apk_folder+"\\res\\"+filedrawable)
			for fileitem in os.listdir(path_apk_folder+"\\res\\"+filedrawable):
				if 'ic_launcher' in fileitem:
					print('删除文件:'+path_apk_folder+"\\res\\"+filedrawable+"\\"+fileitem)
					os.remove(path_apk_folder+"\\res\\"+filedrawable+"\\"+fileitem)
					
			if 'hdpi' in filedrawable:
				shutil.copy(path_item+"\\ic_launcher.png", path_apk_folder+"\\res\\"+filedrawable)
				print('拷贝文件成功:'+path_apk_folder+"\\res\\"+filedrawable)	
		if 'mipmap' in filedrawable:
			print('处理文件:'+path_apk_folder+"\\res\\"+filedrawable)
			for fileitem in os.listdir(path_apk_folder+"\\res\\"+filedrawable):
				if 'ic_launcher' in fileitem:
					os.remove(path_apk_folder+"\\res\\"+filedrawable+"\\"+fileitem)
					print('删除文件:'+path_apk_folder+"\\res\\"+filedrawable+"\\"+fileitem)
			if 'hdpi' in filedrawable:
				shutil.copy(path_item+"\\ic_launcher.png", path_apk_folder+"\\res\\"+filedrawable)
				print('拷贝文件成功'+path_apk_folder+"\\res\\"+filedrawable)	

#反编译apk
def decomApk():	
	shutil.rmtree(path_apk_folder,True)
	print('删除过期文件'+path_apk_folder)
	path_apk_old  = 'apktool d '+path_item+'\\app.apk -o' +path_item+'\\apk'
	os.system(path_apk_old)	
	print('反编译apk文件成功：'+path_apk_folder)

def changeApk():
	print('开始修改apk内容')

	filejson = open(path_item+"\\tmp.json",'r',encoding='utf-8')
	jsonapk = json.load(filejson);
	filejson.close()

	print(jsonapk)

	#修改包名
	fileManifest = path_apk_folder+"\\AndroidManifest.xml"
	modifyFile(fileManifest,'package=\"damao.com.demopythonfsjdlfjs\"','package=\"'+jsonapk['package']+'\"')
	#修改应用名
	appname = path_apk_folder+"\\res\\values\\strings.xml"
	modifyFile(appname,'app_name\">DemoPython<','app_name\">'+jsonapk['appname']+'<')


def signApk():
	print('开始回编译打包')
	apk_back = 'apktool b '+path_item+"\\apk"
	os.system(apk_back)
	print('回编译打包成功')
	print('开始执行自动签名任务')
	signapkcommond = 'jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore '+path_item+'\\autosign_aa123456.jks -storepass aa123456 '+path_item+'\\apk\\dist\\app.apk autosign';
	print('签名命令:'+signapkcommond)
	os.system(signapkcommond)
	print('签名成功')


print("当前目录为："+path_item)
decomApk()
changeApk()
modifyIcon()
signApk()
print("脚本执行结束：")
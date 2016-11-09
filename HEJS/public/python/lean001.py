#FileName:lean001.py
#author:www.py40.com

#执行os命令
import os
import shutil

path_apk_folder =r'E://python_apk//apk';

shutil.rmtree(path_apk_folder)
print('删除过期文件')
os.system(r'apktool d E://python_apk//app-release.apk -o E://python_apk//apk')

print('反编译apk文件成功');





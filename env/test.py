# coding=utf-8
import os
import sys
sys.path.append("/root/env")
import app_wx
from flask import Flask, request
from werkzeug import secure_filename   # 获取上传文件的文件名
app = Flask(__name__)
model_cv = app_wx.Application("./models")

@app.route('/upload', methods=['GET','POST'])
def upload_img():
    if request.method == 'GET':   # 如果是 GET 请求方式
        return "请不要通过浏览器访问！来自python2.7"
    if request.method == 'POST':   # 如果是 POST 请求方式
        file = request.files['file']   # 获取上传的文件
    if file:
        filename = secure_filename(file.filename)   # 获取上传文件的文件名
        file.save(os.path.join('/img', '{}'.format(filename)))
        pre_result=model_cv.predict(os.path.join('/img', '{}'.format(filename)))
        return pre_result   # 返回保存成功的信息
    return "failed"
# def hello_world():
#     return "Hello World!"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8081)

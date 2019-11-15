import app_wx
model_cv = app_wx.Application("./models")
pre_result=model_cv.predict("1.jpg")
print(pre_result)

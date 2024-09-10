import json  
import ssl  
import json
import sys
from urllib.parse import urlencode  
from urllib.request import urlopen, Request  


# 指定JSON配置文件的路径  
config_file_path = '../../python/config/custom_sendSMS_config.json'  
  
# 打开并读取JSON文件  
with open(config_file_path, 'r') as file:  
    config = json.load(file)
  
def send_sms(phone_number, message):  
    method = 'POST'  # 虽然在代码中未直接使用，但明确方法是个好习惯 
    host = config['host']  # 请替换为实际的 API 主机地址  
    path = config['path']  
    appcode = config['appcode']
    bodys = {  
        'content': 'code:' + message,  
        'template_id': config['template_id'],  # 注意模板的使用  
        'phone_number': phone_number  
    }  
    url = host + path  
  
    # 编码请求体为 URL 编码的表单数据  
    post_data = urlencode(bodys).encode('utf-8')  # 注意：需要编码为字节串  
  
    # 创建请求对象并添加头部  
    request = Request(url, post_data)  
    request.add_header('Authorization', 'APPCODE ' + appcode)  
    request.add_header('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')  
  
    # 设置 SSL 上下文以忽略证书验证（注意：在生产环境中应验证证书）  
    ctx = ssl.create_default_context()  
    ctx.check_hostname = False  
    ctx.verify_mode = ssl.CERT_NONE  
  
    # 发送请求并获取响应  
    try:  
        with urlopen(request, context=ctx) as response:  
            content = response.read()  
            print(content.decode('utf-8'))  # 打印响应内容（解码为 UTF-8）  
  
        # 假设 API 总是返回成功的 JSON 响应（实际应根据 API 文档处理）  
        print(json.dumps({"status": "success", "message": "SMS sent successfully"}))  
    except Exception as e:  
        # 处理请求过程中可能出现的异常  
        print(json.dumps({"status": "error", "message": str(e)}), file=sys.stderr)  
  

if __name__ == "__main__":  
    if len(sys.argv) != 3:  
        print("Usage: python script.py <phone_number> <message>", file=sys.stderr)  
        sys.exit(1)  
  
    phone_number = sys.argv[1]  
    message = sys.argv[2]  
  
    try:  
        send_sms(phone_number, message)  
    except Exception as e:  
        print(json.dumps({"status": "error", "message": str(e)}), file=sys.stderr)  
    else:  
        print(json.dumps({"status": "success", "message": "SMS sent successfully"}))



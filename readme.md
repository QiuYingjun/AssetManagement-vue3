# AssetManagement-vue3

资产管理vue3版，前后端分离。

1. 创建数据库

```cmd
cd server
python model.py
```

2. 启动服务端

```cmd
python main.py
```

3. 运行前端

使用[预览](https://qiuyingjun.github.io/AssetManagement-vue3/#/)网页或本地运行vue。

```cmd
cd front
npm run dev
```

在右上角输入服务器地址。默认地址与服务端的设置一致。

```cmd
http://127.0.0.1:5000
```

也可以通过[localtunnel](https://github.com/localtunnel/localtunnel)把本地端口暴露到公网中，把获取到的url填入。

```cmd
npm install -g localtunnel
lt --port 5000
```


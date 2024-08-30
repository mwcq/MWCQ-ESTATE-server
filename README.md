全栈房地产项目
前端使用 React 框架
后端使用 Node.js 的 Express
数据库使用 MongoDB
使用 MongoDB 和 Socket.io 实现实时对话功能
三方库使用 Prisma、JWT、Cookies、Context API、React Router Dom 等...

## 运行

运行后端服务:

```bash
cd api

npm i

node app.js
# or
nodemon app.js
```

默认端口为 8080 [http://localhost:8080](http://localhost:8080)

## API 路由

本项目包含以下 API 路由:

- `/api/posts`: 处理与帖子相关的请求
- `/api/auth`: 处理身份验证相关的请求
- `/api/test`: 用于测试目的的路由
- `/api/users`: 处理用户相关的请求
- `/api/chats`: 处理聊天功能相关的请求
- `/api/message`: 处理消息相关的请求

每个路由的功能详细信息请参考相应的路由的 controllers 文件。

全局变量如`DATABASE_URL,JWT_SECRET,CLIENT_URL`在 api/.env 创建文件配置

前端仓库链接:[https://github.com/mwcq/MWCQ-ESTATE-client](https://github.com/mwcq/MWCQ-ESTATE-client)

socket 服务器仓库链接:[https://github.com/mwcq/MWCQ-ESTATE-socket](https://github.com/mwcq/MWCQ-ESTATE-socket)

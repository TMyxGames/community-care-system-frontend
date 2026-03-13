<div align="center"> 

# 社区智慧养老服务系统（前端）

🚧 _注意：该项目尚未完善_ 🚧

> ℹ️ 本仓库为社区智慧养老服务系统前端仓库，访问后端仓库请点击[这里](https://github.com/TMyxGames/community-care-system-backend)

</div>

---

## 💭 项目简介

本项目为作者的毕设项目，由作者一人独立开发，历经两个月的探索，最终完成了系统的搭建。 另外，本项目的作者是个编程新手，代码质量较低，如有问题敬请谅解 ๐°(৹˃﹏˂̵৹)°๐

### 功能特色：

- **🔐 账户管理**

    提供**用户注册**、**登录**、**找回密码**、**修改头像**、**修改个人资料**等功能。基于角色权限将用户分为**家属**、**老人**、**社区服务人员**、
**系统管理员**四类角色。采用基于**SpringBoot Mail**的**邮箱验证码**与**JWT认证**保证账户安全。


- **📋 健康档案**

    提供**BMI**、**心率**、**血压**、**血糖**等体征数据的存储。采用 **Vue Data UI** 实现数据可视化展示，并接入 **DeepSeek API** 实现**健康数据分析**。


- **🏥 社区服务**

    提供社区服务项目的**浏览**与**预约**，以及对已完成的服务订单进行**评价**。


- **🚨 安全监控**

    接入**高德地图API**实现对老人的**实时定位**与**电子围栏**绘制。设计了**多级告警机制**并采用 **WebSocket** 实现老人越界实时告警推送。



- **📦 订单接收**

    为服务人员提供的**订单接收**功能，提供从**接收订单**、**开始服务**到**完成服务**的全流程追踪。设计了基于 **JTS** 的人员筛选方法实现**就近派单**。


- **⚙️ 后台管理**

    为系统管理员提供**一站式管理中心**。包含**文章管理**、**服务项目管理**、**服务人员管理**等核心管理功能。

## 🛠️ 技术栈

- **开发语言：** HTML | JavaScript | CSS
- **核心框架：** Vue 3
- **路由管理：** Vue Router
- **状态管理：** Pinia
- **网络请求：** Axios
- **构建工具：** Vite

## 🌐 运行环境

- **浏览器：** Firefox | Chrome | Edge ...
- **IDE：** Visual Studio Code + Volar
- **运行时：** Node.js 24.22.1
- **包管理器：** npm 9.x+

## 📁 项目结构
```
community-care-system/                  # 项目根目录
├─ community-care-system-backend/       # 后端项目
├─ community-care-system-frontend/      # 前端项目
│   ├─ .env.development                     # 开发环境变量配置
│   ├─ .env.production                      # 生产环境变量配置
│   └─ src/                                 # 源代码目录
│       ├─ assets/                              # 静态资源
│       ├─ components/                          # 组件
│       │   ├─ 1_BasePage/                          # 基础页面
│       │   ├─ 2_Auth/                              # 用户认证页面
│       │   ├─ 3_Backend/                           # 后台管理页面
│       │   ├─ 4_Home/                              # 主页
│       │   ├─ 5_HealthData/                        # 健康档案页面
│       │   ├─ 6_Service/                           # 社区服务页面
│       │   ├─ 7_Security/                          # 安全监控页面
│       │   ├─ 8_My/                                # 个人信息页面
│       │   ├─ 9_Message/                           # 消息页面
│       │   ├─ 10_Staff/                            # 接单页面
│       │   └─ Common/                              # 通用组件
│       ├─ router/GlobalJump.js                 # 路由
│       ├─ stores/                              # Pinia仓库
│       │   ├─ address.js                           # 地址
│       │   ├─ area.js                              # 区域
│       │   ├─ article.js                           # 文章
│       │   ├─ auth.js                              # 认证
│       │   ├─ call.js                              # 呼叫记录
│       │   ├─ evaluation.js                        # 评价
│       │   ├─ health.js                            # 健康数据
│       │   ├─ location.js                          # 位置
│       │   ├─ message.js                           # 消息
│       │   ├─ order.js                             # 订单
│       │   ├─ service.js                           # 服务
│       │   ├─ socket.js                            # ws
│       │   └─ user.js                              # 用户
│       ├─ utils/                               # 工具类
│       │   ├─ chartConfig.js                       # 图表配置
│       │   ├─ config.js                            # 路径拼接配置
│       │   ├─ mapUitl.js                           # 地图工具类（已弃用）
│       │   ├─ markdown.js                          # markdown-it封装
│       │   └─ rquest.js                            # Axios封装
│       ├─ App.vue                              # 根组件
│       └─ main.js                              # 入口文件
└─ uploads/                             # 上传文件保存目录
    ├─ user/                                # 用户
    │   └─ avatar/                              # 用户头像
    ├─ carousel/                            # 轮播图
    │   └─ images/                              # 轮播图图片
    ├─ article/                             # 文章
    │   └─ {articleId}/                         # 文章包
    │       ├─ index.md                             # 文章内容
    │       └─ images/                              # 文章图片
    └─ service/                             # 服务
        ├─ contents/                            # 服务详情
        └─ images/                              # 服务图片
```

## 🚀 开始

### 一、创建目录结构
创建一个文件夹，将前端项目和后端项目放进去：
```
community-care-system/                  # 项目根目录
├─ community-care-system-backend/       # 后端项目
└─ community-care-system-frontend/      # 前端项目
```
> ℹ️ `uploads` 目录在项目运行时将自动创建，内部的分类目录也会在相关功能被初次调用时自动创建，无需手动创建

### 二、安装以下依赖

- **axios**
   
   ```bash
   npm install axios
   ```

- **vue-router**
   
    ```bash
    npm install vue-router@4
    ```

- **pinia**

    ```bash
    npm install pinia
    ```

- **element-plus**
   
    ```bash
    npm install element-plus --save
    ```

- **amap-loader**

    ```bash
    npm i @amap/amap-jsapi-loader --save
    ```

- **markdown-it**

    ```bash
    npm install markdown-it
    ```

- **md-editor-v3**

    ```bash
    npm install md-editor-v3
    ```

- **vue-data-ui**
  
  ```bash
  npm install vue-data-ui
  ```

### 三、配置 `.env.development`

**后端请求地址**
- `VITE_API_BASE_URL`
> ℹ️ 后端请求地址默认为 `http://localhost:8081`，如需使用移动设备访问，则需要设置为 `http://192.168.x.x:8081`

**高德地图密钥**
- `VITE_AMAP_API_KEY`
- `VITE_AMAP_SEC_CODE`

### 四、启动项目
```bash
npm run dev
```
简单体验可访问 `https://localhost:5173/`
若要测试定位功能，请访问 `https://192.168.x.x:5173`

### ⚠️ 注意事项

- 若使用选项式API，axios请求需要使用 `this.$http`；若使用组合式API，则需要使用 `request`
- axios封装已将后端返回的Result进行解包，通过axios请求拿到的就是数据本身
- 如果想要显示使用相对路径保存的资源，请使用 `$getFileUrl()`

## 📄 未来打算

如果未来还有精力折腾这个项目的话（或许很难有x_x）会更新以下内容：

**健康档案**
- 查看历史健康数据
- 查看特定时间段健康数据
- 每周 / 每月自动生成健康周报 / 月报
- ~~接入智能穿戴设备实时采集健康数据~~

**消息**
- 增加系统通知、告警提醒消息
- 增加未读数角标
- 增加直接与用户对话的功能（在线联系客服、服务人员等）

**安全监控**
- 记录老人特定时间段内的活动轨迹

**社区服务**
- 增加服务存量机制（根据当前空闲服务人员数量计算存量）
- 增加提前预约功能

**订单接收**
- 优化接单机制（不再自动派单给服务人员）
- 增加安全码机制（防止）
- 增加异常情况处理机制

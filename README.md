<h1 align="center">PMP BLUE BOOK</h1>

---

<img src='./src/assets/logo.png' width='50%'>

一个针对PMP考试的刷题小工具，理论上可以通过修改题库支持任何类型的刷题需要。

## 功能介绍

### 已实现功能

![](./assets/pic.png)

- 支持**刷题**和**背题**模式（背题可以理解成看错题本）
- 答错的题自动收藏（可设置）
- 题库来自[光环云课堂](https://yun.aura.cn/)（持续更新中...）

### 待实现功能

- 支持多选题
- 支持在刷题模式设置只做收藏题或不做收藏题
- 支持背题模式显示答错的选项

## 系统介绍

### 前端

- 💥基于`Vue3`+`Vite2`
- 🗿UI库使用`Ant Design Vue`

### 服务器

- 💥基于`Koa`
- 🔑使用`jsonwebtoken`鉴权
- 💾`sqlite3`数据库

- 📑`log4js`记录日志
- 🔄使用`nodemon`支持热更新

### 综合

- 💥基于`TypeScript`

- 📐集成`ESlint(airbnb)`+`Prettier`+`EditorConfig`进行代码格式化

## 用法

### 安装

```
git https://gitee.com/wingsnow/pmp-blue-book.git

cd pmp-blue-book

npm install
```

### 运行项目（开发模式）

```
npm run preview # 仅前端
```

```
npm run serve # 仅服务器
```

```
npm run watch-serve # 仅服务器（热更新）
```

```
npm run dev # 同时启动前端和服务器
```

### 打包构建（仅前端）

```
npm run dev
```

### 运行项目（打包后）

```
npm run start
```

### 注意事项

#### 关于secrets目录

在`/server/src/secrets`目录内有两个文件，

- `db.db`：sqlite数据库文件，题库也在里面（questions表）。
- `jwt-key`：jsonwebtoken的密钥

如果要用于生产用途或不想暴露密钥，请将`secrets`目录添加到`.gitignore`。

#### 用户密码

用户名和密码保存在数据库文件的users表中，密码明文保存（admin/admin）。如果要加密请自行改造。

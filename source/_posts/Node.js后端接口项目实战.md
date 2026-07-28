---
title: Node.js 后端接口项目实战
date: 2026-06-25 11:00:00
categories:
  - 项目
tags:
  - Node.js
  - Express
  - MySQL
  - 后端开发
  - 项目实战
top_img: /img/bj.jpg
cover: /img/4.jpg
---

## 项目概述

本项目是一个基于 Node.js + Express + MySQL 构建的企业级后端接口服务，采用 RESTful API 设计风格，提供完整的用户认证、权限管理、商品管理、订单管理等功能。项目采用模块化架构，代码结构清晰，遵循最佳实践，可作为后端开发的学习模板或实际项目的基础框架。

作为一个全功能的后端项目，它不仅涵盖了 Node.js 后端开发的核心技术，还涉及了数据库设计、权限系统、接口文档、单元测试、部署运维等多个方面。无论你是前端开发者想要拓展后端能力，还是后端初学者想要系统学习 Node.js，这个项目都非常适合。

> 该项目是学习 Node.js 后端开发的完整实战教程，涵盖了从基础到进阶的全栈式后端开发知识。

## 技术栈详解

### 核心框架

- **Node.js**：JavaScript 运行时环境，基于 V8 引擎
- **Express.js**：轻量级 Web 框架，灵活高效
- **Koa.js**（可选）：下一代 Web 框架，异步中间件
- **Nest.js**（可选）：企业级 Node.js 框架，TypeScript 支持

### 数据库

- **MySQL**：关系型数据库，最流行的开源数据库
- **Sequelize**：Node.js ORM 框架，支持多种数据库
- **TypeORM**（可选）：TypeScript 友好的 ORM 框架
- **Redis**：内存数据库，用于缓存和会话管理

### 安全与认证

- **JWT (JSON Web Token)**：无状态身份认证
- **bcryptjs**：密码加密哈希
- **helmet**：安全 HTTP 头设置
- **cors**：跨域资源共享
- **express-rate-limit**：接口限流防刷

### 开发工具

- **Nodemon**：开发环境热重载
- **ESLint**：代码质量检查
- **Prettier**：代码格式化
- **Jest / Mocha**：单元测试框架
- **Swagger / JSDoc**：接口文档生成

### 工程化

- **PM2**：生产环境进程管理
- **Docker**：容器化部署
- **Git**：版本控制
- **CI/CD**：持续集成持续部署

## 核心功能模块

### 1. 用户认证与授权

完整的用户身份认证和权限管理系统。

**功能特点：**
- 用户注册（邮箱/手机号）
- 用户登录（账号密码/验证码/第三方登录）
- JWT Token 认证
- Token 刷新机制
- 角色权限管理（RBAC）
- 菜单权限管理
- 按钮级权限控制
- 短信验证码 / 邮箱验证码
- 密码重置
- 账号封禁 / 解封

### 2. 用户管理

用户信息的完整管理功能。

**功能特点：**
- 用户列表（分页、搜索、筛选）
- 用户详情
- 新增用户
- 编辑用户信息
- 删除用户
- 用户状态管理（启用/禁用）
- 用户角色分配
- 用户导入导出
- 用户操作日志

### 3. 角色权限管理

基于角色的访问控制系统。

**功能特点：**
- 角色列表
- 角色增删改查
- 角色权限分配
- 角色菜单分配
- 角色状态管理
- 数据权限配置

### 4. 菜单管理

系统菜单和权限标识管理。

**功能特点：**
- 菜单树形结构
- 菜单增删改查
- 菜单排序
- 权限标识配置
- 菜单图标配置
- 菜单类型（目录、菜单、按钮）

### 5. 商品管理

商品信息的完整 CRUD 操作。

**功能特点：**
- 商品列表（分页、搜索、筛选、排序）
- 商品详情
- 新增商品
- 编辑商品
- 删除商品 / 批量删除
- 商品上下架
- 商品分类管理
- 商品规格管理
- 商品库存管理
- 商品图片上传
- 商品审核

### 6. 订单管理

订单的完整生命周期管理。

**功能特点：**
- 订单列表（多状态筛选）
- 订单详情
- 订单创建
- 订单发货
- 订单取消
- 订单退款
- 订单导出
- 订单统计

### 7. 分类管理

分类的树形结构管理。

**功能特点：**
- 分类树形列表
- 分类增删改查
- 分类排序
- 分类图片
- 分类状态管理
- 多级分类支持

### 8. 文件上传

文件上传和管理功能。

**功能特点：**
- 单文件上传
- 多文件上传
- 图片上传（支持压缩、裁剪）
- 文件类型校验
- 文件大小限制
- 文件管理（列表、删除）
- 支持本地存储 / 云存储（阿里云 OSS、腾讯云 COS）

### 9. 系统配置

系统基础配置管理。

**功能特点：**
- 系统参数配置
- 数据字典管理
- 系统日志
- 操作日志
- 登录日志
- 系统监控（CPU、内存、磁盘）

### 10. 数据统计与报表

数据统计分析功能。

**功能特点：**
- 用户增长统计
- 订单销售统计
- 商品销量排行
- 数据可视化图表数据接口
- 数据导出 Excel

## 项目亮点

### 技术亮点

1. **RESTful API 设计**：遵循 REST 规范，接口设计优雅
2. **JWT 无状态认证**：前后端分离架构的标准认证方案
3. **RBAC 权限系统**：完善的角色权限控制
4. **统一响应格式**：一致的接口返回数据结构
5. **全局错误处理**：统一的异常处理和错误码
6. **参数校验**：完善的请求参数验证
7. **数据库事务**：关键操作保证数据一致性
8. **接口限流**：防止接口被恶意刷取

### 架构亮点

1. **模块化架构**：清晰的代码分层和模块划分
2. **中间件机制**：灵活的中间件扩展能力
3. **ORM 抽象**：使用 Sequelize 简化数据库操作
4. **配置分离**：多环境配置，开发/测试/生产隔离
5. **日志系统**：完善的日志记录和错误追踪
6. **可扩展性强**：易于添加新功能模块

### 安全亮点

1. **密码加密**：bcrypt 加密存储用户密码
2. **SQL 注入防护**：ORM 框架天然防注入
3. **XSS 防护**：输入过滤和输出编码
4. **CSRF 防护**：跨站请求伪造防护
5. **接口限流**：防止暴力破解和恶意请求
6. **敏感数据脱敏**：接口返回敏感信息脱敏

## 项目结构

```
nodejs-api-server/
├── src/
│   ├── config/               # 配置文件
│   │   ├── index.js         # 主配置
│   │   ├── database.js      # 数据库配置
│   │   ├── jwt.js           # JWT 配置
│   │   └── ...
│   ├── controllers/          # 控制器层（处理请求参数和响应）
│   │   ├── user.controller.js
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── order.controller.js
│   │   └── ...
│   ├── services/             # 服务层（业务逻辑）
│   │   ├── user.service.js
│   │   ├── auth.service.js
│   │   ├── product.service.js
│   │   ├── order.service.js
│   │   └── ...
│   ├── models/               # 数据模型层（数据库操作）
│   │   ├── user.model.js
│   │   ├── role.model.js
│   │   ├── product.model.js
│   │   ├── order.model.js
│   │   └── ...
│   ├── routes/               # 路由层
│   │   ├── index.js         # 路由入口
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── product.routes.js
│   │   ├── order.routes.js
│   │   └── ...
│   ├── middlewares/          # 中间件
│   │   ├── auth.middleware.js    # 认证中间件
│   │   ├── permission.middleware.js  # 权限中间件
│   │   ├── error.middleware.js   # 错误处理中间件
│   │   ├── validation.middleware.js  # 参数验证中间件
│   │   └── ...
│   ├── utils/                # 工具函数
│   │   ├── jwt.js           # JWT 工具
│   │   ├── password.js      # 密码工具
│   │   ├── response.js      # 统一响应格式
│   │   ├── validate.js      # 参数验证
│   │   ├── upload.js        # 文件上传
│   │   └── ...
│   ├── validators/           # 参数验证规则
│   │   ├── auth.validator.js
│   │   ├── user.validator.js
│   │   └── ...
│   ├── jobs/                 # 定时任务
│   │   └── ...
│   ├── logs/                 # 日志目录
│   ├── tests/                # 单元测试
│   │   ├── user.test.js
│   │   └── ...
│   ├── app.js               # Express 应用初始化
│   └── server.js            # 服务启动入口
├── public/                   # 静态资源目录
├── uploads/                  # 文件上传目录
├── docs/                     # 文档目录
├── .env.development          # 开发环境变量
├── .env.production           # 生产环境变量
├── .env.test                 # 测试环境变量
├── .eslintrc.js              # ESLint 配置
├── .prettierrc.js            # Prettier 配置
├── Dockerfile                # Docker 配置
├── docker-compose.yml        # Docker Compose 配置
├── ecosystem.config.js       # PM2 配置
├── package.json
└── README.md
```

## 核心功能实现

### 统一响应格式

```javascript
// utils/response.js
class ApiResponse {
  static success(data = null, message = '操作成功') {
    return {
      code: 200,
      message,
      data,
      timestamp: Date.now()
    }
  }

  static error(message = '操作失败', code = 500, data = null) {
    return {
      code,
      message,
      data,
      timestamp: Date.now()
    }
  }

  static page(list = [], total = 0, pageNum = 1, pageSize = 10) {
    return {
      code: 200,
      message: '获取成功',
      data: {
        list,
        total,
        pageNum,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      },
      timestamp: Date.now()
    }
  }
}

module.exports = ApiResponse
```

### 全局错误处理中间件

```javascript
// middlewares/error.middleware.js
const ApiResponse = require('../utils/response')

// 404 处理
function notFoundHandler(req, res, next) {
  res.status(404).json(ApiResponse.error('接口不存在', 404))
}

// 全局错误处理
function errorHandler(err, req, res, next) {
  console.error('Error:', err)

  // 参数验证错误
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message)
    return res.status(400).json(
      ApiResponse.error('参数验证失败', 400, errors)
    )
  }

  // JWT 错误
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json(ApiResponse.error('未授权访问', 401))
  }

  // 业务错误
  if (err.code && err.code !== 500) {
    return res.status(err.code).json(
      ApiResponse.error(err.message, err.code)
    )
  }

  // 默认 500 错误
  res.status(500).json(ApiResponse.error('服务器内部错误', 500))
}

module.exports = {
  notFoundHandler,
  errorHandler
}
```

### JWT 认证中间件

```javascript
// middlewares/auth.middleware.js
const jwt = require('jsonwebtoken')
const ApiResponse = require('../utils/response')
const { JWT_SECRET } = require('../config/jwt')

function authMiddleware(req, res, next) {
  // 从请求头获取 token
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json(ApiResponse.error('未登录，请先登录', 401))
  }

  try {
    // 验证 token
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json(ApiResponse.error('登录已过期，请重新登录', 401))
    }
    return res.status(401).json(ApiResponse.error('无效的登录凭证', 401))
  }
}

module.exports = authMiddleware
```

### 用户登录实现

```javascript
// controllers/auth.controller.js
const authService = require('../services/auth.service')
const ApiResponse = require('../utils/response')

class AuthController {
  // 用户登录
  async login(req, res, next) {
    try {
      const { username, password } = req.body
      const result = await authService.login(username, password)
      res.json(ApiResponse.success(result, '登录成功'))
    } catch (error) {
      next(error)
    }
  }

  // 用户注册
  async register(req, res, next) {
    try {
      const userData = req.body
      const result = await authService.register(userData)
      res.json(ApiResponse.success(result, '注册成功'))
    } catch (error) {
      next(error)
    }
  }

  // 刷新 token
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body
      const result = await authService.refreshToken(refreshToken)
      res.json(ApiResponse.success(result, '刷新成功'))
    } catch (error) {
      next(error)
    }
  }

  // 获取当前用户信息
  async getCurrentUser(req, res, next) {
    try {
      const userId = req.user.id
      const result = await authService.getCurrentUser(userId)
      res.json(ApiResponse.success(result))
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new AuthController()
```

```javascript
// services/auth.service.js
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const { JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } = require('../config/jwt')

class AuthService {
  // 登录
  async login(username, password) {
    // 查找用户
    const user = await User.findOne({ where: { username } })
    if (!user) {
      throw new Error('用户不存在')
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new Error('密码错误')
    }

    // 检查用户状态
    if (user.status !== 1) {
      throw new Error('账号已被禁用')
    }

    // 生成 token
    const payload = {
      id: user.id,
      username: user.username,
      roleId: user.roleId
    }

    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    })

    const refreshToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN
    })

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar
      }
    }
  }

  // 注册
  async register(userData) {
    const { username, password, email } = userData

    // 检查用户名是否已存在
    const existingUser = await User.findOne({ where: { username } })
    if (existingUser) {
      throw new Error('用户名已存在')
    }

    // 加密密码
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // 创建用户
    const user = await User.create({
      username,
      password: hashedPassword,
      email
    })

    return {
      id: user.id,
      username: user.username
    }
  }
}

module.exports = new AuthService()
```

### Sequelize 数据模型

```javascript
// models/user.model.js
const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '用户ID'
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: '用户名'
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '密码'
    },
    nickname: {
      type: DataTypes.STRING(50),
      comment: '昵称'
    },
    avatar: {
      type: DataTypes.STRING(255),
      comment: '头像'
    },
    email: {
      type: DataTypes.STRING(100),
      comment: '邮箱'
    },
    phone: {
      type: DataTypes.STRING(20),
      comment: '手机号'
    },
    roleId: {
      type: DataTypes.INTEGER,
      comment: '角色ID'
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      comment: '状态：0-禁用，1-启用'
    },
    createdAt: {
      type: DataTypes.DATE,
      comment: '创建时间'
    },
    updatedAt: {
      type: DataTypes.DATE,
      comment: '更新时间'
    }
  },
  {
    tableName: 'sys_user',
    timestamps: true,
    comment: '用户表'
  }
)

module.exports = User
```

### 路由配置

```javascript
// routes/auth.routes.js
const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const { loginValidator, registerValidator } = require('../validators/auth.validator')

// 公开路由
router.post('/login', loginValidator, authController.login)
router.post('/register', registerValidator, authController.register)
router.post('/refresh-token', authController.refreshToken)

// 需要认证的路由
router.get('/me', authMiddleware, authController.getCurrentUser)

module.exports = router
```

```javascript
// routes/index.js
const express = require('express')
const router = express.Router()

const authRoutes = require('./auth.routes')
const userRoutes = require('./user.routes')
const productRoutes = require('./product.routes')
const orderRoutes = require('./order.routes')

// 路由挂载
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/products', productRoutes)
router.use('/orders', orderRoutes)

module.exports = router
```

### 应用入口

```javascript
// app.js
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware')
const routes = require('./routes')

const app = express()

// 安全中间件
app.use(helmet())

// 跨域配置
app.use(cors())

// 请求体解析
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 请求日志
app.use(morgan('dev'))

// 接口限流
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个 IP 15 分钟内最多 100 个请求
})
app.use('/api/', limiter)

// 静态资源
app.use('/public', express.static('public'))
app.use('/uploads', express.static('uploads'))

// API 路由
app.use('/api', routes)

// Swagger 文档（可选）
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// 404 处理
app.use(notFoundHandler)

// 全局错误处理
app.use(errorHandler)

module.exports = app
```

```javascript
// server.js
const app = require('./app')
const { PORT, NODE_ENV } = require('./config')
const sequelize = require('./config/database')

// 测试数据库连接
async function testDbConnection() {
  try {
    await sequelize.authenticate()
    console.log('数据库连接成功')
  } catch (error) {
    console.error('数据库连接失败:', error)
    process.exit(1)
  }
}

// 启动服务器
async function startServer() {
  await testDbConnection()

  app.listen(PORT, () => {
    console.log(`
========================================
  服务器启动成功！
  环境: ${NODE_ENV}
  端口: ${PORT}
  地址: http://localhost:${PORT}
========================================
    `)
  })
}

startServer()
```

## 数据库设计示例

### 用户表 (sys_user)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT | 用户ID，主键 |
| username | VARCHAR(50) | 用户名，唯一 |
| password | VARCHAR(255) | 密码（加密） |
| nickname | VARCHAR(50) | 昵称 |
| avatar | VARCHAR(255) | 头像URL |
| email | VARCHAR(100) | 邮箱 |
| phone | VARCHAR(20) | 手机号 |
| role_id | INT | 角色ID |
| status | TINYINT | 状态：0禁用 1启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### 角色表 (sys_role)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT | 角色ID，主键 |
| name | VARCHAR(50) | 角色名称 |
| code | VARCHAR(50) | 角色编码 |
| description | VARCHAR(255) | 角色描述 |
| status | TINYINT | 状态 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### 商品表 (product)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT | 商品ID，主键 |
| name | VARCHAR(200) | 商品名称 |
| description | TEXT | 商品描述 |
| price | DECIMAL(10,2) | 商品价格 |
| original_price | DECIMAL(10,2) | 原价 |
| stock | INT | 库存 |
| sales | INT | 销量 |
| category_id | INT | 分类ID |
| image | VARCHAR(255) | 商品图片 |
| status | TINYINT | 状态：0下架 1上架 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

## 快速开始

### 环境要求

- Node.js >= 14.0.0
- MySQL >= 5.7
- Redis（可选）

### 安装步骤

1. **克隆项目**

```bash
git clone <项目地址>
cd nodejs-api-server
```

2. **安装依赖**

```bash
npm install
```

3. **配置环境变量**

复制 `.env.example` 为 `.env.development` 并修改配置：

```env
# 服务配置
PORT=3000
NODE_ENV=development

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_database
DB_USER=root
DB_PASSWORD=your_password

# JWT 配置
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
```

4. **初始化数据库**

```bash
# 执行数据库迁移
npm run db:migrate

# 插入初始数据
npm run db:seed
```

5. **启动开发服务器**

```bash
npm run dev
```

### 常用命令

```bash
# 开发模式
npm run dev

# 生产启动
npm start

# 代码检查
npm run lint

# 代码修复
npm run lint:fix

# 单元测试
npm test

# 测试覆盖率
npm run test:coverage

# 数据库迁移
npm run db:migrate

# 数据库回滚
npm run db:migrate:undo

# 生成种子数据
npm run db:seed
```

## 部署方案

### PM2 部署

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'api-server',
    script: './src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    max_memory_restart: '500M'
  }]
}
```

```bash
# 启动
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs api-server

# 重启
pm2 restart api-server

# 停止
pm2 stop api-server
```

### Docker 部署

```dockerfile
# Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_NAME=api_db
    depends_on:
      - mysql
      - redis

  mysql:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: api_db
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:alpine
    volumes:
      - redis_data:/data

volumes:
  mysql_data:
  redis_data:
```

## 接口文档

### Swagger 集成（推荐）

使用 `swagger-jsdoc` 和 `swagger-ui-express` 自动生成接口文档：

```javascript
// config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API 文档',
      version: '1.0.0',
      description: 'Node.js 后端接口项目 API 文档'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
}

const specs = swaggerJsdoc(options)

module.exports = specs
```

访问 `/api-docs` 即可查看 Swagger 文档。

## 性能优化建议

### 1. 数据库优化

- 添加合适的索引
- 使用连接池
- 合理的分页查询
- 避免 N+1 查询问题
- 使用 EXPLAIN 分析慢查询

### 2. 缓存策略

- 热点数据 Redis 缓存
- 接口结果缓存
- 数据库查询缓存
- 静态资源 CDN 加速

### 3. 代码优化

- 使用异步操作
- 避免阻塞事件循环
- 合理使用连接池
- 流式处理大文件

### 4. 架构优化

- 负载均衡
- 数据库读写分离
- 微服务拆分
- 消息队列解耦

## 开发规范

### 命名规范

- **文件和文件夹**：使用小写，单词用短横线连接
- **变量和函数**：使用小驼峰
- **类名**：使用大驼峰
- **常量**：使用大写下划线
- **数据库表名**：使用小写下划线

### 代码规范

- 使用 ESLint 检查代码质量
- 使用 Prettier 统一代码格式
- 遵循 JavaScript Standard Style 或 Airbnb 风格

### Git 提交规范

使用 Conventional Commits：

```
<type>(<scope>): <subject>
```

### 接口设计规范

- 遵循 RESTful API 设计
- 使用统一的响应格式
- 使用 HTTP 状态码
- 接口版本管理

## 开发心得与总结

通过开发这个 Node.js 后端接口项目，我系统地掌握了 Node.js 后端开发的完整技术栈，积累了丰富的企业级项目开发经验。

### 技术收获

1. **Node.js 深入理解**：事件循环、异步编程、流处理等核心概念
2. **Express 框架**：中间件机制、路由设计、错误处理
3. **数据库设计**：MySQL 表设计、索引优化、事务处理
4. **ORM 框架**：Sequelize 的使用和优化技巧
5. **安全开发**：身份认证、权限控制、常见安全漏洞防护
6. **工程化能力**：项目搭建、代码规范、测试部署

### 项目经验

1. **需求分析**：后端接口设计和数据库设计
2. **架构设计**：模块化架构、分层设计、扩展性考虑
3. **性能优化**：数据库优化、缓存策略、并发处理
4. **问题排查**：日志分析、性能调优、错误追踪

### 后续优化方向

1. 添加 TypeScript 支持
2. 微服务架构改造
3. GraphQL 接口支持
4. 更完善的监控和告警
5. 增加单元测试覆盖率
6. 集成 CI/CD 自动化部署

---

Node.js 后端开发是前端工程师拓展全栈能力的重要方向。掌握 Node.js 不仅能让你独立完成全栈项目，还能让你更深入地理解 Web 开发的本质。希望这个项目能成为你后端开发路上的重要里程碑！

---
title: Axios
date: 2026-03-30 01:33:28
categories:
  - 前端
tags:
  - 前端
  - Axios
  - 网络请求
top_img: /img/bj.jpg
cover: /img/1.jpg
---

# Axios请求

Axios是一个基于Promise的前端HTTP客户端库，作用就是帮助前端代码（比如Vue、React、原生js）向服务器（后端）发送HTTP请求，接受服务器返回的数据。

## 为什么用Axios？

相对于浏览器原生的XMLHttpRequest或者fetch，Axios做了大量的封装与优化，对新手更加友好。

### 轻松发送请求

`axios.post()` 或者 `axios.get()`

### 处理异步请求 避免回调

`async/await` 或 `.then()/.catch()`

- 自动把后端返回的 JSON 字符串转成 JS 对象，不用手动 `JSON.parse()`
- 可以设置请求超时时间、适配各种跨域场景，处理请求头、响应头更方便

### 为什么定义了一个axios实例之后，获取数据的方法变成了instance.get/post()？

`instance` 只是普通变量名，**可以任意替换**，核心是变量指向的 Axios 实例对象，修改时要保证**全局命名统一**，避免因名字不一致导致报错。

instance 就是"继承了全局 axios 所有技能，又加了专属装备"的升级版，所以它能直接用 get/post。

### post和get请求可选有形参（取决于接口的业务需求）

### get和post区别

`GET` 用 `{ params }` 传参，`POST` 用 `data` 传参

- **get**：（不是只能查数据）只读，有长度限制，无法传递大文件（图片、视频）
- **GET 不安全**：参数暴露在 URL 中，容易被偷窥、篡改，**绝对不能传敏感数据（如密码、token）**
- **post**：写，改，无长度限制，可以传递大文件（上传头像，图片）
- **POST 相对安全**：参数在请求体中，不会出现在 URL / 历史记录中，适合传敏感数据

注意：POST 不是加密，只是不暴露，敏感数据仍需 HTTPS 加密。

### 接口函数封装格式

**接口描述**：获取顶部统计卡片数据（比如今日订单数、销售额、用户数等）

- 请求方式：GET
- 请求路径：/stats/cards
- 参数：无
- 返回值：Promise\<统计卡片数据对象\>

```javascript
export const 接口函数名 = () => {
  // 调用封装好的axios实例的get方法，返回Promise
  return instance.get('接口路径');
};
```

**函数命名规范**：小驼峰 + 语义化 + 后缀 Api（如 `getStatsCardsApi`、`userLoginApi`）

前缀：`get`（查）、`add`（增）、`edit`（改）、`delete`（删）、`upload`（上传）

### 接口级配置覆盖全局配置

若配置了 timeout，接口级配置会覆盖 instance 全局配置：

```javascript
// instance 全局配置了60秒超时
const instance = axios.create({ timeout: 60000 });

// 接口级配置30秒，最终生效的是30秒
instance.get('/stats/cards', { timeout: 30000 });
```

### 文件上传接口

```javascript
// 头像上传接口
// 文件上传（图片/文档/视频）必须使用 multipart/form-data 请求头
// FormData 是浏览器提供的专门用来处理「表单文件上传」的对象，
// 能把文件的二进制数据正确封装，配合 multipart/form-data 头，
// 后端才能解析出文件。
// 文件参数必须用 FormData 传递（而非普通对象）
// 使用 POST 请求是文件上传的唯一选择
// （第一个参数：接口路径；
// 第二个参数：formData（文件数据，放在请求体）；
// 第三个参数：配置项（请求头、超时等）
// Content-Type 就是「数据格式标签」
// 普通接口（登录、新增用户）不用手动设，Axios 会自动加 application/json，足够满足需求
export const uploadAccountImgApi = (formData) => {
  return instance.post('/users/avatar_upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
```

## 图标使用方法

### Ant Design 图标

Antd V5版本：

```bash
npm install @ant-design/icons --save
# 或
yarn add @ant-design/icons
```

Antd V4版本及以下：无需单独安装，直接在antd导入需要的图标

后缀名：

- `Outlined`：轮廓型（默认推荐，适配深色 / 浅色主题）
- `Filled`：填充型
- `Twotone`：双色型（可自定义双色）

```javascript
import { 图标名后缀名 } from 'antd'
```

使用示例：

```jsx
const items = [
  // 用 HomeOutlined 替换自定义首页图标
  { key: "/home", label: "后台首页", icon: <HomeOutlined /> },
  // 用 ShoppingOutlined 替换订单图标
  { key: "/order", label: "订单管理", icon: <ShoppingOutlined /> },
  {
    key: "/goods",
    label: "商品管理",
    icon: <AppstoreOutlined />,
    children: [
      { key: "/goods", label: "商品列表" },
      { key: "/goods/add", label: "添加商品" },
      { key: "/goods/types", label: "商品类型" },
    ],
  },
  { key: "/shop", label: "店铺管理", icon: <ShopOutlined /> },
  {
    key: "/account",
    label: "账号管理",
    icon: <UserOutlined />,
    children: [
      { key: "/account", label: "账号列表" },
      { key: "/account/add", label: "添加账号" },
      { key: "/account/edit", label: "修改密码" },
      { key: "/account/center", label: "个人中心" },
    ],
  },
  {
    key: "/statistics",
    label: "销售统计",
    icon: <LineChartOutlined style={{ fontSize: '18px', color: '#1890ff' }} />,
    children: [
      { key: "/statistics/goods", label: "商品统计" },
      { key: "/statistics", label: "订单统计" },
    ],
  },
];
```

### iconfont 的使用方法

1. 登录[阿里图标库官网](https://www.iconfont.cn/)，登录后创建自己的图标项目，将喜欢的图标加入购物车，全部进行下载后，得到压缩包，再解压后删去多余文件，复制到项目的src目录下（比如 `src/assets/iconfont/`）。

2. 推荐使用全局导入 iconfont（在React全局入口文件中）：

```javascript
import './assets/iconfont/iconfont.css'
// 导入全局样式（入口文件）
import './common/base.scss'
```

使用示例：

```jsx
{
  key: "/home",
  label: "后台首页",
  icon: <i className="iconfont icon-home" style={{ fontSize: '18px', color: '#1890ff' }}></i>
},
```

## React 入口文件

`StrictMode`：React 严格模式组件，包裹应用后会：（开发需要注释掉）

- 检测过时的 API 使用
- 警告不安全的生命周期
- 强制组件重复渲染（仅开发环境），提前暴露潜在问题
- 生产环境会自动失效，不影响性能

## ES6

每个主流库（React、Vue、Axios）都有官方文档，明确标注了"导出了什么、该怎么导入"。

打开 [React 官方文档](https://react.dev/reference/react-dom/client/createRoot) 查看详细说明。

---
title: Webpack5 配置与优化完全指南
date: 2026-01-10 11:00:00
categories:
  - 前端
tags:
  - Webpack
  - 工程化
  - 前端
top_img: /img/bj.jpg
cover: /img/1.jpg
---

## 前言

Webpack 是现代前端工程化的核心工具之一。本文将从基础配置到高级优化，全面讲解 Webpack5 的使用方法和最佳实践。

## 一、Webpack 核心概念

### 1.1 五大核心概念

1. **Entry（入口）**：打包的起点
2. **Output（输出）**：打包结果的输出位置
3. **Loader（加载器）**：处理非 JS 文件
4. **Plugin（插件）**：执行更广泛的任务
5. **Mode（模式）**：development / production / none

### 1.2 基础配置

```javascript
// webpack.config.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].js',
    clean: true // 每次打包前清空 dist
  },
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './public/index.html' })
  ],
  mode: 'development'
}
```

## 二、常用 Loader

### 2.1 处理样式

```javascript
module: {
  rules: [
    {
      test: /\.css$/,
      use: [
        'style-loader', // 将 JS 字符串生成为 style 节点
        'css-loader',   // 将 CSS 转化成 CommonJS 模块
        'postcss-loader' // CSS 后处理（加前缀等）
      ]
    },
    {
      test: /\.less$/,
      use: ['style-loader', 'css-loader', 'less-loader']
    },
    {
      test: /\.s[ac]ss$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    }
  ]
}
```

**PostCSS 配置（postcss.config.js）：**

```javascript
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-preset-env')
  ]
}
```

### 2.2 处理图片资源

```javascript
module: {
  rules: [
    {
      test: /\.(png|jpg|jpeg|gif|svg)$/,
      type: 'asset', // webpack5 内置资源模块
      parser: {
        dataUrlCondition: {
          maxSize: 8 * 1024 // 8KB 以下转 base64
        }
      },
      generator: {
        filename: 'images/[name].[hash:6][ext]'
      }
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      type: 'asset/resource',
      generator: {
        filename: 'fonts/[name].[hash:6][ext]'
      }
    }
  ]
}
```

### 2.3 处理 JS / TS

```javascript
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env'],
      plugins: ['@babel/plugin-transform-runtime']
    }
  }
},
{
  test: /\.ts$/,
  use: 'ts-loader',
  exclude: /node_modules/
}
```

## 三、常用 Plugin

### 3.1 常用插件列表

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')      // 生成 HTML
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 提取 CSS
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin') // CSS 压缩
const { DefinePlugin } = require('webpack')                    // 定义全局变量
const CopyPlugin = require('copy-webpack-plugin')              // 复制文件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin // 包分析

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'My App',
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css'
    }),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new CopyPlugin({
      patterns: [{ from: 'public', to: '' }]
    }),
    new BundleAnalyzerPlugin()
  ]
}
```

## 四、开发环境配置

### 4.1 DevServer

```javascript
module.exports = {
  devServer: {
    port: 3000,
    open: true,
    hot: true,          // 热更新
    compress: true,     // gzip 压缩
    historyApiFallback: true, // 支持 history 路由
    proxy: {            // 代理
      '/api': {
        target: 'http://localhost:8080',
        pathRewrite: { '^/api': '' },
        changeOrigin: true
      }
    },
    static: './public'
  }
}
```

### 4.2 Source Map

| 类型 | 说明 | 适用场景 |
| --- | --- | --- |
| `eval` | 速度最快，不生成 map | 开发环境 |
| `cheap-module-eval-source-map` | 速度快，只到行 | 开发环境（推荐） |
| `source-map` | 最完整，最慢 | 生产环境 |

```javascript
module.exports = {
  devtool: process.env.NODE_ENV === 'development' 
    ? 'cheap-module-eval-source-map' 
    : 'source-map'
}
```

## 五、生产环境优化

### 5.1 代码分割

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // 第三方库
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          name: 'vendors'
        },
        // 公共代码
        common: {
          minChunks: 2,
          priority: 5,
          name: 'common',
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: true // 运行时代码单独打包
  }
}
```

### 5.2 压缩优化

```javascript
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,   // 移除 console
            drop_debugger: true   // 移除 debugger
          }
        }
      }),
      new CssMinimizerPlugin()
    ]
  }
}
```

### 5.3 Tree Shaking

Webpack5 生产模式默认开启 Tree Shaking，但需要注意：

```javascript
// package.json
{
  "sideEffects": [
    "*.css",
    "*.scss"
  ]
}
```

## 六、性能优化

### 6.1 提升打包速度

```javascript
// 1. 使用缓存
module.exports = {
  cache: {
    type: 'filesystem', // 持久化缓存
    buildDependencies: {
      config: [__filename]
    }
  }
}

// 2. 缩小 loader 作用范围
{
  test: /\.js$/,
  include: path.resolve(__dirname, 'src'), // 只处理 src
  exclude: /node_modules/,
  use: 'babel-loader'
}

// 3. 多线程构建
const TerserPlugin = require('terser-webpack-plugin')
new TerserPlugin({
  parallel: true // 开启多线程
})
```

### 6.2 减少打包体积

1. 按需引入第三方库
2. 使用 Tree Shaking 移除无用代码
3. 图片压缩
4. 代码分割

## 七、环境区分

### 7.1 多配置文件

```
build/
├── webpack.base.js      # 公共配置
├── webpack.dev.js       # 开发环境
└── webpack.prod.js      # 生产环境
```

```javascript
// webpack.base.js
const { merge } = require('webpack-merge')
const devConfig = require('./webpack.dev')
const prodConfig = require('./webpack.prod')

const baseConfig = {
  // 公共配置...
}

module.exports = (env) => {
  const isDev = env.development
  const config = isDev ? devConfig : prodConfig
  return merge(baseConfig, config)
}
```

### 7.2 环境变量

```javascript
// .env.development
NODE_ENV=development
API_URL=http://localhost:3000

// .env.production
NODE_ENV=production
API_URL=https://api.example.com
```

```javascript
const Dotenv = require('dotenv-webpack')

module.exports = {
  plugins: [
    new Dotenv({
      path: `.env.${process.env.NODE_ENV}`
    })
  ]
}
```

## 八、常用工具

### 8.1 打包分析

```bash
# 生成 stats.json
npx webpack --profile --json > stats.json

# 在线分析
# https://webpack.github.io/analyse/
# 或使用 webpack-bundle-analyzer
```

### 8.2 常用配置模板

```javascript
// 完整的生产配置示例
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash:8].js',
    assetModuleFilename: 'assets/[name].[hash:6][ext]',
    clean: true
  },
  module: {
    rules: [
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'] },
      { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' },
      { test: /\.(png|jpg|gif)$/, type: 'asset', parser: { dataUrlCondition: { maxSize: 8 * 1024 } } }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './public/index.html', minify: true }),
    new MiniCssExtractPlugin({ filename: 'css/[name].[contenthash:8].css' })
  ],
  optimization: {
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
    splitChunks: { chunks: 'all' },
    runtimeChunk: true
  },
  mode: 'production'
}
```

## 九、总结

Webpack5 带来了很多新特性：

1. **内置资源模块**（Asset Modules）：不再需要 file-loader、url-loader
2. **持久化缓存**：大幅提升二次构建速度
3. **更好的 Tree Shaking**：更精准的无用代码移除
4. **更优的代码分割**：更智能的默认配置

掌握 Webpack 配置和优化，是前端工程师的必备技能。希望这篇文章能帮到你！

---
title: Git 常用命令与工作流完全指南
date: 2026-01-15 11:30:00
categories:
  - 前端
tags:
  - Git
  - 工程化
  - 前端
top_img: /img/bj.jpg
cover: /img/11.jpg
---

## 前言

Git 是现代开发中不可或缺的版本控制工具。本文整理了 Git 常用命令和常见工作流，帮助你高效使用 Git。

## 一、基础配置

### 1.1 用户信息

```bash
# 设置用户名和邮箱
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# 查看配置
git config --list
```

### 1.2 常用配置

```bash
# 默认编辑器
git config --global core.editor "code --wait"

# 显示颜色
git config --global color.ui true

# 换行符处理
git config --global core.autocrlf true  # Windows
git config --global core.autocrlf input # Mac/Linux

# 别名
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit
```

## 二、基础操作

### 2.1 初始化仓库

```bash
# 在当前目录初始化
git init

# 克隆远程仓库
git clone https://github.com/user/repo.git
git clone git@github.com:user/repo.git

# 克隆到指定目录
git clone https://github.com/user/repo.git my-project
```

### 2.2 文件操作

```bash
# 查看状态
git status

# 添加文件到暂存区
git add file.txt          # 添加单个文件
git add .                 # 添加所有文件
git add src/              # 添加目录
git add -u                # 添加所有修改/删除的文件（不包括新文件）

# 提交到本地仓库
git commit -m "commit message"
git commit -am "commit message"  # 跳过 add，直接提交已跟踪的文件

# 修改最后一次提交
git commit --amend -m "new message"
```

### 2.3 查看差异

```bash
# 查看工作区和暂存区的差异
git diff

# 查看暂存区和最新提交的差异
git diff --cached
git diff --staged

# 查看工作区和最新提交的差异
git diff HEAD

# 查看两个提交之间的差异
git diff commit1 commit2

# 查看指定文件的差异
git diff file.txt
```

### 2.4 查看历史

```bash
# 查看提交历史
git log

# 简洁显示
git log --oneline

# 图形化显示
git log --graph --oneline --all

# 显示最近 n 条
git log -n 10

# 查看指定文件的历史
git log file.txt

# 显示每次提交的具体改动
git log -p

# 搜索提交信息
git log --grep="keyword"
```

## 三、分支操作

### 3.1 分支管理

```bash
# 查看分支
git branch              # 本地分支
git branch -r           # 远程分支
git branch -a           # 所有分支

# 创建分支
git branch feature      # 创建 feature 分支

# 切换分支
git checkout feature
git switch feature      # 新语法

# 创建并切换
git checkout -b feature
git switch -c feature   # 新语法

# 删除分支
git branch -d feature   # 删除已合并的分支
git branch -D feature   # 强制删除

# 重命名分支
git branch -m old-name new-name
```

### 3.2 合并分支

```bash
# 切换到目标分支
git checkout main

# 合并 feature 分支
git merge feature

# 合并时产生冲突
# 手动解决冲突后
git add .
git commit -m "resolve conflict"
```

### 3.3 Rebase

```bash
# 将当前分支 rebase 到 main
git rebase main

# 解决冲突后
git add .
git rebase --continue

# 放弃 rebase
git rebase --abort
```

**Merge vs Rebase：**

| 特性 | Merge | Rebase |
| --- | --- | --- |
| 历史记录 | 保留完整历史 | 线性历史，更简洁 |
| 安全性 | 安全，不会修改提交 | 会修改提交历史 |
| 适用场景 | 公共分支 | 个人分支 |

> 黄金法则：**不要在公共分支上使用 rebase！**

## 四、远程操作

### 4.1 远程仓库

```bash
# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin https://github.com/user/repo.git

# 修改远程仓库地址
git remote set-url origin https://github.com/user/new-repo.git

# 删除远程仓库
git remote remove origin
```

### 4.2 推送和拉取

```bash
# 推送到远程
git push origin main
git push -u origin main    # 设置上游分支，之后可以直接 git push
git push --all             # 推送所有分支
git push --tags            # 推送标签

# 从远程拉取
git pull                   # 拉取并合并
git pull --rebase          # 拉取并 rebase

# 获取远程更新但不合并
git fetch origin
git fetch --all
```

### 4.3 远程分支

```bash
# 跟踪远程分支
git checkout -b feature origin/feature

# 删除远程分支
git push origin --delete feature
```

## 五、撤销操作

### 5.1 撤销工作区修改

```bash
# 撤销单个文件的修改
git checkout -- file.txt
git restore file.txt      # 新语法

# 撤销所有修改
git checkout -- .
git restore .             # 新语法
```

### 5.2 撤销暂存区

```bash
# 从暂存区撤回
git reset HEAD file.txt
git restore --staged file.txt  # 新语法
```

### 5.3 撤销提交

```bash
# 撤销最后一次提交，保留修改到暂存区
git reset --soft HEAD~1

# 撤销最后一次提交，保留修改到工作区
git reset --mixed HEAD~1
git reset HEAD~1        # 默认

# 撤销最后一次提交，彻底丢弃修改
git reset --hard HEAD~1
```

### 5.4 回退到指定版本

```bash
# 查看提交历史
git log --oneline

# 回退到指定提交
git reset --hard commit_id

# 回退后又想回去
git reflog              # 查看所有操作记录
git reset --hard commit_id
```

## 六、标签操作

```bash
# 查看标签
git tag

# 创建标签
git tag v1.0.0                           # 轻量标签
git tag -a v1.0.0 -m "version 1.0.0"    # 附注标签

# 查看标签信息
git show v1.0.0

# 删除标签
git tag -d v1.0.0

# 推送标签
git push origin v1.0.0
git push --tags

# 删除远程标签
git push origin --delete v1.0.0
```

## 七、储藏（Stash）

```bash
# 储藏当前修改
git stash
git stash save "message"    # 带描述

# 查看储藏列表
git stash list

# 应用最新储藏
git stash apply

# 应用并删除储藏
git stash pop

# 应用指定储藏
git stash apply stash@{1}

# 删除储藏
git stash drop stash@{0}

# 清空所有储藏
git stash clear
```

## 八、常见工作流

### 8.1 Git Flow

```
master        # 生产环境
└── develop    # 开发环境
    ├── feature/login    # 功能分支
    ├── feature/payment
    └── release/v1.0     # 发布分支
```

**工作流程：**
1. 从 develop 切出 feature 分支开发
2. 开发完成后合并回 develop
3. 从 develop 切出 release 分支测试
4. 测试通过后合并到 master 和 develop
5. 打 tag 发布

### 8.2 GitHub Flow

```
main          # 主分支
└── feature-xxx    # 功能分支
```

**工作流程：**
1. 从 main 切出功能分支
2. 在功能分支上开发
3. 发起 Pull Request
4. Code Review
5. 合并到 main
6. 部署

### 8.3 日常开发流程

```bash
# 1. 更新代码
git checkout main
git pull

# 2. 创建功能分支
git checkout -b feature/login

# 3. 开发提交
git add .
git commit -m "feat: login"

# 4. 推送远程
git push -u origin feature/login

# 5. 合并 main（解决冲突）
git checkout main
git pull
git checkout feature/login
git merge main
# 解决冲突
git add .
git commit -m "merge main"

# 6. 发起 PR / MR
# Code Review
# 合并到 main
```

## 九、常见问题

### 9.1 忽略文件

创建 `.gitignore` 文件：

```
node_modules/
dist/
*.log
.env
.DS_Store
.idea/
.vscode/
```

### 9.2 不小心 commit 了大文件

```bash
# 从历史中删除文件
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch path/to/bigfile' \
  --prune-empty --tag-name-filter cat -- --all

# 强制推送
git push --force --all
```

### 9.3 换行符问题

```bash
# 查看文件的换行符
cat -A file.txt

# 转换所有文件
git config --global core.autocrlf true
git rm --cached -r .
git reset --hard
```

## 十、常用速查表

| 命令 | 说明 |
| --- | --- |
| `git init` | 初始化仓库 |
| `git clone` | 克隆仓库 |
| `git add .` | 添加到暂存区 |
| `git commit -m` | 提交 |
| `git status` | 查看状态 |
| `git log` | 查看历史 |
| `git branch` | 分支操作 |
| `git checkout` | 切换分支 |
| `git merge` | 合并分支 |
| `git rebase` | 变基 |
| `git push` | 推送 |
| `git pull` | 拉取 |
| `git fetch` | 获取 |
| `git reset` | 重置 |
| `git stash` | 储藏 |

## 十一、总结

Git 是开发者必备技能：

1. **基础操作**：add、commit、status、log
2. **分支管理**：branch、checkout、merge、rebase
3. **远程操作**：push、pull、fetch
4. **撤销操作**：reset、checkout、restore
5. **工作流**：Git Flow、GitHub Flow

多练习，多使用，Git 就会成为你的得力助手！

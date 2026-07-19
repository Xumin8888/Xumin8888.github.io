---
title: Hexo 部署错误解决
date: 2026-05-05 02:35:00
tags: [前端, React, Vue, Hexo, Xumin, 熊猫, 项目]
cover: /img/cat.jpg
---

Hexo 部署常见错误：Spawn failed command not found 处理笔记  
##Hexo 部署命令 必须在博客项目的根目录执行，而不是 source 子目录里！  
你现在在 boke/source 里，要先回到 boke 根目录：

|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` cd .. 再执行 hexo clean && hexo g && hexo d ``` |

##立刻能解决的 3 个终极方案  
方案 1：删除损坏的部署缓存（90% 的人这样就好）  
在博客根目录执行：

|  |  |
| --- | --- |
| ``` 1 ``` | ``` rm -rf .deploy_git ``` |

然后再部署：

|  |  |
| --- | --- |
| ``` 1 ``` | ``` hexo clean && hexo g && hexo d ``` |

##你以后遇到这个错误的固定处理流程

删除 .deploy\_git

重装部署插件

重新部署

不行就手动上传 public 文件夹

你现在只要做

直接复制这 4 行，执行一次：

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ```  rd /s /q .deploy\_git  npm uninstall hexo-deployer-git  npm install hexo-deployer-git --save  hexo clean \&\& hexo g \&\& hexo d ``` |

一、先搞懂：这两个错误到底是什么意思？

1. Spawn failed

核心原因：Hexo 的 hexo-deployer-git 插件无法正常调用 git 命令，通常是 Git 未安装 环境变量未配置 网络连接失败 部署缓存损坏 导致的。

典型报错：

|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` FATAL Something's wrong. Maybe you can find the solution here httpshexo.iodocstroubleshooting.html  Error Spawn failed ``` |

2. command not found

核心原因：终端无法识别你输入的 hexo git npm 命令，通常是 Node.jsGit 未正确安装、环境变量未配置、终端会话异常 导致的。

典型报错：

|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` bash hexo command not found  bash git command not found ``` |

二、处理流程：按「从简单到复杂」的顺序排查

🔴 第一步：先解决终端 环境基础问题（command not found 必做）

1. 检查基础工具是否安装

打开「命令提示符（CMD）」或「PowerShell」（不要用 Git Bash 先，避免环境问题干扰），依次执行以下命令：

# 检查 Node.js 是否安装成功（版本号 ≥ 14.x）

|  |  |
| --- | --- |
| ``` 1 ``` | ``` node -v ``` |

# 检查 npm 是否安装成功

|  |  |
| --- | --- |
| ``` 1 ``` | ``` npm -v ``` |

# 检查 Git 是否安装成功

|  |  |
| --- | --- |
| ``` 1 ``` | ``` git --version ``` |

如果任意命令显示 不是内部或外部命令，说明对应工具未安装或环境变量未配置，需要先安装：

Node.js：官网下载 LTS 版本，安装时勾选「Add to PATH」

Git：官网下载 Windows 版，安装时默认勾选「Add Git to PATH」

2. 修复 Hexo 命令识别问题

如果 nodenpm 正常，但 hexo 提示 command not found，执行以下命令重新安装 Hexo 客户端：

|  |  |
| --- | --- |
| ``` 1 ``` | ``` npm install -g hexo-cli ``` |

安装完成后，关闭所有终端窗口，重新打开再执行 hexo -v，能输出版本号就是成功。

🟠 第二步：解决 Spawn failed 错误（Hexo 部署专用）

场景 1：部署缓存损坏（最常见）

.deploy\_git 文件夹是 Hexo 部署的缓存目录，损坏后会导致部署失败，直接删除重建即可：

# 1. 进入 Hexo 博客根目录

|  |  |
| --- | --- |
| ``` 1 ``` | ``` cd DpeopleFilesgithubboke ``` |

# 2. 删除损坏的部署缓存（Windows 专用命令）

|  |  |
| --- | --- |
| ``` 1 ``` | ``` rd s q .deploy\_git ``` |

# 3. 重新生成并部署

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` hexo clean  hexo g  hexo d ``` |

场景 2：Hexo Git 部署插件损坏

如果上面的方法无效，重新安装部署插件：

|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` 1. 卸载旧插件  npm uninstall hexo-deployer-git ``` |

# 2. 重新安装插件

|  |  |
| --- | --- |
| ``` 1 ``` | ``` npm install hexo-deployer-git --save ``` |

# 3. 再次尝试部署

|  |  |
| --- | --- |
| ``` 1 ``` | ``` hexo clean \&\& hexo g \&\& hexo d ``` |

场景 3：Git 网络连接失败

终端提示 Recv failure Connection was reset 时，是 GitHub 网络问题，按以下方法解决：

换网络：切换手机热点，避免校园网 公司网的限制

手动配置 Git 代理（临时生效）：

|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` git config --global http.proxy http127.0.0.17890  git config --global https.proxy https127.0.0.17890 ``` |

检查 \_config.yml 部署配置是否正确：

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` deploy  &#x20; type git  &#x20; repo httpsgithub.com你的用户名你的用户名.github.io.git  &#x20; branch main  # 注意：你的仓库默认分支如果是 master，要改成 master ``` |

🟡 第三步：终极兜底方案（不用命令行，纯手动部署，100% 成功）

如果以上方法都无效，直接绕过 Hexo 部署插件，手动上传文件：

步骤 1：生成博客静态文件

# 在 Hexo 博客根目录执行

|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` hexo clean  hexo g ``` |

执行完成后，根目录会生成 public 文件夹，里面就是你的博客所有静态文件。

步骤 2：手动上传到 GitHub

打开 public 文件夹，按 Ctrl + A 全选所有文件和文件夹，Ctrl + C 复制

打开你的 GitHub Pages 仓库：httpsgithub.com你的用户名你的用户名.github.io

点击仓库页面的 Add file → Upload files

把复制的所有文件直接拖到上传框，或点击 choose your files 选择文件

下方 Commit message 填写备注（如 update blog），点击 Commit changes

等待 1-2 分钟，GitHub Pages 会自动部署，刷新博客地址即可看到更新内容

三、常见问题避坑指南

不要混用终端：部署时优先用「命令提示符（CMD）」或「PowerShell」，Git Bash 容易出现环境变量异常

每次部署前必须 hexo clean：清理旧缓存，避免旧配置干扰新部署

仓库分支不要写错：GitHub Pages 默认分支是 main，如果你的仓库是 master，必须修改 \_config.yml 里的 branch 配置

网络波动时不要重复部署：网络差时多次执行 hexo d 会导致 .deploy\_git 缓存损坏，直接用手动上传方案

四、一键修复命令合集（直接复制使用）

# 1. 基础工具检查

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` node -v  npm -v  git --version ``` |

# 2. 修复 Hexo 命令

|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ```  npm install -g hexo-cli ``` |

# 3. 修复 Spawn failed（删除缓存+重装插件）

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` cd DpeopleFilesgithubboke  rd s q .deploy\_git  npm uninstall hexo-deployer-git  npm install hexo-deployer-git --save  hexo clean \&\& hexo g \&\& hexo d ``` |
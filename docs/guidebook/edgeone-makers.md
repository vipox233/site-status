# 在 EdgeOne Makers 部署站点监控

本项目使用 UptimeRobot 定时检查站点。EdgeOne Makers 托管状态页面及其服务端 API，不需要在被监控的服务器上部署本项目。

1. 在 [UptimeRobot](https://dashboard.uptimerobot.com/) 创建监控项，并在 API 管理页面获取 **Read-Only API Key**。不要使用 Main API Key。
2. 在 EdgeOne Makers 新建项目，选择从 GitHub 导入本仓库，框架选 **Nuxt**，Node.js 选 **22**，安装命令 `pnpm install`，构建命令 `pnpm run build`；输出目录使用 Nuxt 框架默认值。
3. 在 Makers 控制台为生产和预览环境按需设置环境变量：`DEPLOYMENT_PLATFORM=auto`、`API_KEY=你的只读密钥`。可另外设置 `SITE_TITLE`、`SITE_ICP` 等 `.env.example` 中的选项。API Key 仅填入控制台，不提交到 Git。
4. 如果想给页面加访问密码，另设 `SITE_PASSWORD` 和随机的 `SITE_SECRE_KEY`；这里变量名沿用当前源码的 `SECRE` 拼写。
5. 保存设置并重新部署，打开预览地址，确认监控项能显示，再绑定自定义域名。设置环境变量后必须重新部署，已有部署不会自动读取新值。

**排查 404：** 构建日志不应出现 `Nuxt version is not supported, skip adding nuxt-pages plugin` 或 `No server-handler detected`。这表示 Makers 没有识别服务端入口，检查项目 Nuxt 版本是否达到 [Makers 要求的 3.16.0](https://cloud.tencent.com/document/product/1552/127382) 以上，并确认输出目录仍是框架默认值。不要用统一重写到 `/index.html` 的规则遮盖 API 路径。

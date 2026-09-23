# 在 EdgeOne Makers 部署站点监控

本项目使用 UptimeRobot 定时检查站点。EdgeOne Makers 托管状态页面及其服务端 API，不需要在被监控的服务器上部署本项目。

1. 在 [UptimeRobot](https://dashboard.uptimerobot.com/) 创建监控项，并在 API 管理页面获取 **Read-Only API Key**。不要使用 Main API Key。
2. 在 EdgeOne Makers 新建项目，从 GitHub 导入本仓库，框架选 **Nuxt**，Node.js 选 **22**，安装命令 `pnpm install`，构建命令 `pnpm run build`。输出目录保留框架默认值，不手动指定 `.output/public`。
3. 为生产和预览环境按需设置 `DEPLOYMENT_PLATFORM=auto`、`API_KEY=你的只读密钥`。标题等可选设置见 `.env.example`。密钥仅填控制台，不提交到 Git。
4. 不需要访问密码时，留空 `SITE_PASSWORD`。需要密码时设置 `SITE_PASSWORD`、`SITE_SECRET_KEY`、`CLIENT_IP_HEADER=eo-connecting-ip`。签名密钥至少 32 字节，可运行 `openssl rand -hex 32` 生成；旧变量名 `SITE_SECRE_KEY` 仍兼容，但不能继续使用 `site-status` 默认值或短密钥。
5. 保存设置并重新部署，打开预览地址确认监控项显示，再绑定自定义域名。修改环境变量后要重新部署。

## 已有项目更新

拉取本次更新后重新部署即可。保持 `DEPLOYMENT_PLATFORM=auto`，删除旧的 `NITRO_PRESET` 环境变量，让 Makers 自动适配。不要手动创建 `.edgeone/nitro.json` 或注入模块文件。

- 想隐藏监控项链接：设置 `SHOW_LINKS=false`，重新部署。旧的 `SHOW_LINK` 仍兼容，新变量优先。
- 已启用访问密码：确认签名密钥满足上述要求。更新后的旧登录 Cookie 会失效，重新登录一次即可。
- 登录连续失败达到 5 次后，等待 10 分钟再试。限流为云函数单实例内存计数，多实例之间不共享；无法识别 IP 时共用一组计数。`CLIENT_IP_HEADER` 仅用于可信代理覆盖的请求头；直接运行 Node 服务时留空。

## 构建报错或预览 404

正常日志应加载 `@edgeone/nuxt-pages`，生成 `.edgeone/assets` 和 `.edgeone/cloud-functions/ssr-node`，并完成服务端入口处理。日志出现 `node-server` 是正常的。

- `Nuxt version is not supported`：检查 Nuxt 是否达到 Makers 要求的 3.16.0 以上。
- 找不到 `.edgeone/nitro.json`，但生成了 `.output/server`：适配模块没有生效。本次已将 `modules` 改成直接数组写法；不要改回 `modules: [...].concat(...)`，该写法会触发插件重复注入字段并被覆盖的问题。
- `No server-handler detected`：服务端入口尚未接入，检查上面的构建错误及输出目录设置。不要添加统一重写到 `/index.html` 的规则遮盖 API 路径。

参考：[Makers Nuxt 文档](https://cloud.tencent.com/document/product/1552/127382)、[构建产物规范](https://pages.edgeone.ai/document/building-output-configuration)、[EO 客户端 IP 请求头](https://edgeone.ai/document/54211)。

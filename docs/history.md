# 开发记录

## 2026-09-23：EdgeOne Makers 兼容修复

- 需求：修复 Makers 显示构建成功、预览却返回 404 的问题。
- 原因：仓库锁定 Nuxt 3.15.2；Makers 当前支持 Nuxt 3.16.0+，因此跳过服务端适配插件，将 Node 服务产物识别为纯静态项目。
- 完成：将 Nuxt 升至兼容的 3.16 系列补丁版，配套升级国际化模块并保留原语言配置目录，同步 pnpm 锁文件，并补充部署说明。
- 验证：本地 pnpm 冻结锁文件安装、`DEPLOYMENT_PLATFORM=auto pnpm run build` 成功；本地首页及 `/api/check` 均返回 HTTP 200。线上部署与 API Key 的实际连通性留待 Makers 新部署验证。

## 2026-09-23：修复 EO 模块注入并整合上游 PR #75

- 需求：解决 Makers 构建找不到 `.edgeone/nitro.json`，评估并采用 [Zephdyn 的上游 PR #75](https://github.com/imsyy/site-status/pull/75)（来源提交 `a9178a1b1fcc5ec44056247240769ccf364711b0`）。
- 原因：`@edgeone/nuxt-pages@1.1.2` 只识别数组形式的 `modules`；原 `.concat(...)` 写法使它插入重复字段，随后被原字段覆盖。插件的 `node-server` preset 本身正常，失效的是输出目录适配。
- 完成：采用数组展开写法，修复 SHOW_LINKS 开关，兼容旧环境变量拼写；整合上游的数据空值处理、国际化、文字可选、后台标签暂停刷新、Cookie/JWT/来源检查和依赖清理。
- 补充修复：将遗留 lodash 防抖调用改为 VueUse `useDebounceFn`；修复 CSS 变量引用与后台请求完成后误恢复倒计时；限流采用有容量上限和到期清理的缓存，可显式信任 EO 客户端 IP 头；完整校验密码摘要格式；JWT 校验算法和 subject，移除响应体中的 token，缺失或短签名密钥时拒绝登录，避免受保护数据因缺少密钥而放行。
- 依赖决定：保留本 fork 的 Nuxt 3.16.2、i18n 9.3.4 及已有 packageExtensions；不覆盖为上游 PR 的旧版本锁文件或引入其中的预发布依赖更新。重新生成锁文件仅移除不用的 crypto-js、类型包和 nuxt-lodash。
- 验证：pnpm 9.12.2 冻结锁文件离线安装成功，`pnpm lint` 通过；直接执行官方适配包的 onPreBuild → Nuxt build → onBuild → onPostBuild，确认注入无重复字段、`.edgeone/nitro.json`、`handler.js` 和路由配置均生成，源配置正常恢复。
- 运行验证：直接调用生成的 EO handler，分别测试公开、密码保护、缺失签名密钥三种场景；首页 200，同源/跨源拦截、错误密码与非法摘要、正确登录、Cookie 属性、JWT subject、登出 Cookie、5 次错误后 429、不同 IP 隔离均通过。以本地模拟 UptimeRobot 响应验证监控数据解析、隐藏链接、服务端缓存和密钥不出现在响应中。
- 边界：以上是本地适配产物验证，尚未验证线上 Makers 发布、真实 API Key 与平台实际传入的请求头。登录限流为单实例内存计数，不跨实例共享。已有访问密码用户需使用至少 32 字节签名密钥，并重新登录。

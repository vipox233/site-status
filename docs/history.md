# 开发记录

## 2026-09-23：EdgeOne Makers 兼容修复

- 需求：修复 Makers 显示构建成功、预览却返回 404 的问题。
- 原因：仓库锁定 Nuxt 3.15.2；Makers 当前支持 Nuxt 3.16.0+，因此跳过服务端适配插件，将 Node 服务产物识别为纯静态项目。
- 完成：将 Nuxt 升至兼容的 3.16 系列补丁版，配套升级国际化模块并保留原语言配置目录，同步 pnpm 锁文件，并补充部署说明。
- 验证：本地 pnpm 冻结锁文件安装、`DEPLOYMENT_PLATFORM=auto pnpm run build` 成功；本地首页及 `/api/check` 均返回 HTTP 200。线上部署与 API Key 的实际连通性留待 Makers 新部署验证。

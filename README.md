# 微轻

微轻是一个面向女性减脂用户的体重记录 APP。本仓库采用 pnpm workspace 管理移动端、后端 API 与共享包。

## 项目结构

```txt
weiqing/
  apps/
    mobile/        # Taro H5 + Capacitor mobile app
    api/           # NestJS API service
  packages/
    shared/        # Shared types, schemas, constants, and pure utilities
  docs/            # Product prompt, phased checklist, and Stitch design package
  scripts/         # Repository scripts and future maintenance utilities
```

## Phase 1 范围

当前阶段只初始化 monorepo 工程骨架，不包含业务代码、页面、数据库、AI 调用或 UI 组件。

## 命令

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build:api
pnpm build:mobile
```

子项目脚本会在后续阶段按实际工程补齐。

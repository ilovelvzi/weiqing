# 微轻

微轻是一个面向体重记录、趋势观察和温柔鼓励的移动应用。本仓库使用 pnpm workspace 管理移动端、后端 API 与共享包。

## 项目结构

```txt
weiqing/
  apps/
    mobile/        # Expo + React Native mobile app
    api/           # NestJS API service
  packages/
    shared/        # Shared types, schemas, constants, and pure utilities
  docs/            # Product prompt, phased checklist, and design package
  scripts/         # Repository scripts and future maintenance utilities
```

## 当前前端路线

移动端当前路线为 Expo + React Native + TypeScript + Expo Router。后端 `apps/api` 和共享包 `packages/shared` 保持现有路线。

## 验证命令

```bash
pnpm install
pnpm --filter @weiqing/shared build
pnpm --filter @weiqing/mobile typecheck
pnpm --filter @weiqing/mobile start
```

`pnpm-lock.yaml` 需要在普通 PowerShell 中通过 `pnpm install` 重新生成，以清理旧移动端锁文件残留。

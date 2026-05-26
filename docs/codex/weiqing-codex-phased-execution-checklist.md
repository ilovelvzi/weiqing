# 微轻 APP — Codex 分阶段执行指令 + 每阶段验收清单 v1.0

> 本文档用于控制 Codex 的执行节奏。不要让 Codex 一次性从 0 做到上线，而是按阶段创建可审查、可回滚、可测试的增量改动。  
> 配套主文档：`docs/codex/weiqing-codex-full-development-prompt.md`  
> 配套设计资料：`docs/design/weiqing-ui-design-organized/`

---

## 0. 核心原则

Codex 执行微轻 APP 开发时，必须遵守以下原则：

1. **一次只做一个阶段**：每次任务只允许完成当前阶段，不允许提前实现后续阶段。
2. **每阶段必须可运行或可验证**：即使功能不完整，也要保证当前代码处于可检查状态。
3. **每阶段必须输出变更总结**：说明新增文件、核心实现、运行命令、已知问题。
4. **每阶段必须运行检查命令**：如果检查命令暂时不可用，必须说明原因。
5. **不要过度工程化**：禁止引入主 Prompt 未允许的库或架构。
6. **优先保证工程稳定，再追求 UI 精细还原**。
7. **UI 还原必须基于 Stitch 设计资料，但不能直接复制 Stitch HTML 到 Taro 页面**。
8. **所有敏感密钥只写入 `.env.example` 占位，不写真实密钥**。
9. **每阶段完成后暂停，等待人工验收后再进入下一阶段**。

---

## 1. 什么时候开始让 Codex 工作？

可以现在开始，但只让 Codex 先做 **Phase 0 / Phase 1**。

不需要等到：

- 所有 UI 细节 100% 完成；
- Neon 数据库已经创建；
- DeepSeek API Key 已经准备好；
- Vercel 已经配置好；
- App Store / Android 上架资料已经准备好。

需要先准备好：

1. 一个空的 Git 仓库；
2. `docs/codex/weiqing-codex-full-development-prompt.md`；
3. `docs/codex/weiqing-codex-phased-execution-checklist.md`；
4. `docs/design/weiqing-ui-design-organized/`；
5. Node.js / pnpm 可用的开发环境；
6. 当前阶段的明确任务指令。

推荐启动策略：

```txt
现在启动 Codex：Phase 0 + Phase 1
本地人工验收通过后：Phase 2
Shared 和工程脚手架稳定后：Phase 3 / Phase 4
后端 API 基本跑通后：Phase 6 / Phase 7 前端
UI 还原放到功能可用之后：Phase 9
```

也就是说：**Codex 现在就可以开始工作，但必须分阶段、小步提交，不要一次性全量生成完整 APP。**

---

## 2. 推荐 Git 工作流

建议每个阶段一个分支或一个 PR。

```txt
main
  ├─ codex/phase-0-repo-preflight
  ├─ codex/phase-1-monorepo-init
  ├─ codex/phase-2-shared-package
  ├─ codex/phase-3-api-foundation
  ├─ codex/phase-4-auth-and-database
  ├─ codex/phase-5-core-api
  ├─ codex/phase-6-ai-module
  ├─ codex/phase-7-mobile-foundation
  ├─ codex/phase-8-mobile-core-pages
  ├─ codex/phase-9-ui-restoration
  ├─ codex/phase-10-capacitor
  ├─ codex/phase-11-tests-and-hardening
  └─ codex/phase-12-deploy-prep
```

合并规则：

```txt
1. 每个阶段完成后先人工 review diff。
2. 确认没有错误方向后再合并。
3. 如果某阶段失败，不要继续下一阶段，先让 Codex 修复当前阶段。
4. 不要在一个 PR 里混合后端、前端、UI 大量无关改动。
```

---

## 3. Codex 通用任务开头模板

每次给 Codex 开新任务时，建议都使用下面这段作为开头：

```md
你正在开发“微轻 APP”。

请先阅读：

1. `docs/codex/weiqing-codex-full-development-prompt.md`
2. `docs/codex/weiqing-codex-phased-execution-checklist.md`
3. `docs/design/weiqing-ui-design-organized/DESIGN_FOR_CODEX.md`，如果本阶段涉及 UI

本次只允许执行当前指定 Phase。
不要提前实现后续 Phase。
不要引入主 Prompt 未允许的技术栈。
完成后请运行本阶段要求的检查命令，并输出：

- 完成内容
- 修改文件
- 运行过的命令
- 检查结果
- 未完成事项
- 下一阶段建议
```

---

# Phase 0 — 仓库预检与资料放置

## 目标

确保 Codex 能读取项目说明、设计资料和阶段执行文档。

## 给 Codex 的任务指令

```md
请执行 Phase 0：仓库预检与资料放置。

目标：
1. 检查仓库根目录是否存在 `docs/codex/weiqing-codex-full-development-prompt.md`。
2. 检查是否存在 `docs/codex/weiqing-codex-phased-execution-checklist.md`。
3. 检查是否存在 `docs/design/weiqing-ui-design-organized/`。
4. 读取设计目录中的 README、DESIGN_FOR_CODEX、PAGE_MAP、MVP_UI_SCOPE。
5. 输出你理解的项目目标、技术栈、MVP 页面范围。

本阶段不要创建应用代码，不要安装依赖。
```

## 人工准备

```txt
repo/
  docs/
    codex/
      weiqing-codex-full-development-prompt.md
      weiqing-codex-phased-execution-checklist.md
    design/
      weiqing-ui-design-organized/
```

## 验收清单

- [ ] Codex 能读取完整 Prompt。
- [ ] Codex 能读取阶段执行文档。
- [ ] Codex 能读取 Stitch 设计资料。
- [ ] Codex 正确复述技术栈：Taro + Capacitor + NestJS + TypeORM + Neon + LangChain + DeepSeek。
- [ ] Codex 正确复述 MVP 范围。
- [ ] Codex 没有开始写应用代码。

## 通过标准

Codex 对项目理解准确，没有擅自开始工程实现。

---

# Phase 1 — Monorepo 工程初始化

## 目标

创建可运行的 pnpm workspace 基础结构。

## 给 Codex 的任务指令

```md
请执行 Phase 1：Monorepo 工程初始化。

只完成以下事项：
1. 初始化 pnpm workspace。
2. 创建 `apps/mobile`、`apps/api`、`packages/shared` 空工程目录。
3. 创建根目录 `package.json`、`pnpm-workspace.yaml`、`tsconfig.base.json`。
4. 配置 ESLint 和 Prettier。
5. 创建 `.env.example`。
6. 创建根目录 README，说明项目结构和启动命令占位。
7. 添加根目录 scripts：`lint`、`typecheck`、`test`、`build:api`、`build:mobile`，如果子项目尚未实现，可以先用占位脚本，但要后续阶段替换。

不要实现 API 业务。
不要实现 Taro 页面。
不要实现数据库实体。
```

## 预期目录

```txt
weiqing/
  apps/
    mobile/
    api/
  packages/
    shared/
  docs/
    codex/
    design/
  scripts/
  .env.example
  .gitignore
  package.json
  pnpm-workspace.yaml
  tsconfig.base.json
  eslint.config.js
  prettier.config.js
  README.md
```

## 建议检查命令

```bash
pnpm install
pnpm lint
pnpm typecheck
```

## 验收清单

- [ ] `pnpm install` 成功。
- [ ] workspace 能识别 `apps/*` 和 `packages/*`。
- [ ] 根目录 TypeScript 配置存在。
- [ ] ESLint / Prettier 配置存在。
- [ ] `.env.example` 包含 API、DATABASE、JWT、DeepSeek、CORS 占位变量。
- [ ] 没有引入 Next.js、Prisma、GraphQL、Tailwind、Redux 等未批准技术。
- [ ] 此阶段没有写复杂业务代码。

## 失败时让 Codex 修复的指令

```md
Phase 1 验收未通过。请只修复 Monorepo 初始化相关问题，不要进入 Phase 2。重点修复：pnpm install、workspace 识别、lint/typecheck 配置。
```

---

# Phase 2 — Shared 包

## 目标

建立前后端共享类型、枚举、Zod schema 和纯工具函数。

## 给 Codex 的任务指令

```md
请执行 Phase 2：Shared 包实现。

只在 `packages/shared` 中实现：
1. 枚举：UserStatus、WeightUnit、Mood、AiTone、RecordSource、AccountDeletionStatus。
2. API 响应类型：ApiResponse、ApiErrorResponse、PaginatedResponse。
3. 用户、体重记录、统计、AI 鼓励相关 DTO 类型。
4. Zod schemas：auth、weight-record、user-profile、user-settings。
5. 工具函数：kg/lb 转换、体重格式化、localDate、timezone 相关基础函数。
6. 基础单元测试。

不要实现 NestJS Entity。
不要实现 Taro 页面。
```

## 建议检查命令

```bash
pnpm --filter @weiqing/shared typecheck
pnpm --filter @weiqing/shared test
pnpm lint
```

## 验收清单

- [ ] `packages/shared/src/index.ts` 正确导出所有公共类型。
- [ ] shared 不依赖 `apps/mobile`。
- [ ] shared 不依赖 `apps/api`。
- [ ] kg/lb 转换结果正确。
- [ ] 日期工具不按服务器 UTC 错误归属本地日期。
- [ ] Zod schema 和后端 DTO 规则方向一致。
- [ ] 单元测试通过。

## 重点人工 review

- `weightKg` 是否统一为 kg。
- `localDate` 是否保持 `YYYY-MM-DD` 字符串。
- 是否错误加入敏感用户字段。

---

# Phase 3 — API 基础框架

## 目标

创建 NestJS 后端基础工程，但暂不实现完整业务。

## 给 Codex 的任务指令

```md
请执行 Phase 3：API 基础框架。

只在 `apps/api` 中完成：
1. 初始化 NestJS TypeScript 项目结构。
2. 配置 `main.ts`、`app.module.ts`。
3. 配置 `/api/v1` 全局前缀。
4. 配置全局 ValidationPipe：whitelist、forbidNonWhitelisted、transform。
5. 配置统一响应 Interceptor。
6. 配置统一异常 Filter。
7. 配置 ConfigModule。
8. 配置 Swagger `/api/docs`。
9. 添加 HealthModule：`GET /api/v1/health`。
10. 添加基础测试。

不要实现数据库 Entity。
不要实现 Auth。
不要实现 Weight Records。
```

## 建议检查命令

```bash
pnpm --filter @weiqing/api lint
pnpm --filter @weiqing/api typecheck
pnpm --filter @weiqing/api test
pnpm --filter @weiqing/api build
```

## 验收清单

- [ ] NestJS 项目能 build。
- [ ] `/api/v1/health` 存在。
- [ ] 全局 ValidationPipe 正确配置。
- [ ] 统一错误格式不泄露内部堆栈到生产响应。
- [ ] Swagger 配置存在。
- [ ] ConfigModule 能读取环境变量。
- [ ] API 尚未实现未计划的业务模块。

---

# Phase 4 — 数据库 Entity、Migration 与 Auth

## 目标

建立数据库模型、TypeORM 配置、认证系统和 `/me`。

## 给 Codex 的任务指令

```md
请执行 Phase 4：数据库 Entity、Migration 与 Auth。

请实现：
1. TypeORM PostgreSQL 配置。
2. DataSource 配置，生产环境 `synchronize: false`。
3. Entity：users、user_profiles、user_settings、refresh_tokens、account_deletion_requests 的基础部分。
4. Migration：创建上述表、唯一索引、必要外键。
5. AuthModule：register、login、refresh、logout。
6. JWT Access Token + Refresh Token Rotation。
7. 密码使用 argon2 hash。
8. Refresh token 数据库只存 hash。
9. JwtAuthGuard。
10. UsersModule：`GET /api/v1/me`。
11. Auth 相关 e2e 测试。

不要实现 weight_records。
不要实现 AI。
不要实现前端。
```

## 需要的环境变量

```env
DATABASE_URL=postgresql://...
DATABASE_DIRECT_URL=postgresql://...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
```

没有真实数据库时，可以先完成代码和 migration 文件，但要说明 migration 未实际运行。

## 建议检查命令

```bash
pnpm --filter @weiqing/api typecheck
pnpm --filter @weiqing/api test
pnpm --filter @weiqing/api build
```

如果数据库已准备好：

```bash
pnpm --filter @weiqing/api migration:run
pnpm --filter @weiqing/api test:e2e
```

## 验收清单

- [ ] 生产环境 `synchronize: false`。
- [ ] migration 文件存在。
- [ ] `users.email_normalized` 唯一约束存在。
- [ ] 注册后自动创建 profile 和 settings。
- [ ] 密码不明文存储。
- [ ] Refresh token 不明文存储。
- [ ] pending_deletion / deleted 用户禁止登录。
- [ ] `/me` 需要 JWT。
- [ ] Protected API 不通过 query/body 接收 userId。
- [ ] Auth 测试通过或说明数据库缺失导致未运行。

---

# Phase 5 — 核心业务 API

## 目标

实现微轻 MVP 的核心后端能力。

## 给 Codex 的任务指令

```md
请执行 Phase 5：核心业务 API。

请实现：
1. WeightRecordsModule：create/update/list/detail/delete/calendar。
2. 每个用户同一 localDate 只能有一条未删除体重记录。
3. POST /weight-records 同日重复提交时更新今日记录。
4. StatsModule：summary、trend。
5. HomeModule：overview 聚合接口。
6. UsersModule：PATCH /me/profile、PATCH /me/settings。
7. AccountModule：delete-request、cancel 可先实现基础版。
8. 所有 DTO 校验。
9. 所有 Protected API 用 JwtAuthGuard。
10. 核心 API e2e 测试。

不要实现 AI DeepSeek 调用。
不要实现前端页面。
```

## 建议检查命令

```bash
pnpm --filter @weiqing/api typecheck
pnpm --filter @weiqing/api test
pnpm --filter @weiqing/api test:e2e
pnpm --filter @weiqing/api build
```

## 验收清单

- [ ] `weight_records.weight_kg` 使用 numeric/decimal，统一 kg。
- [ ] `local_date`、`timezone`、`recorded_at` 均存在。
- [ ] 每日唯一 partial unique index 存在。
- [ ] 趋势查询有 `user_id + local_date` 索引。
- [ ] 历史列表分页，默认 20，最大 50。
- [ ] 首页只需调用 `/home/overview` 即可拿到首页数据。
- [ ] Stats trend 只支持 7d、30d、90d。
- [ ] 删除体重记录使用 soft delete。
- [ ] 用户只能访问自己的数据。
- [ ] API 不返回 password_hash、token_hash 等敏感字段。

---

# Phase 6 — AI 鼓励模块

## 目标

实现 LangChain + DeepSeek 的后端 AI 鼓励语生成，并保证失败可 fallback。

## 给 Codex 的任务指令

```md
请执行 Phase 6：AI 鼓励模块。

请实现：
1. AiModule。
2. AiPromptService。
3. AiService.generateForWeightRecord。
4. LangChain.js + @langchain/deepseek 调用封装。
5. 默认模型从 `DEEPSEEK_MODEL` 读取，默认 deepseek-v4-flash。
6. AI 输出必须是 JSON。
7. AI 输出用 Zod 校验。
8. 校验失败或模型失败时使用本地 fallback 文案。
9. ai_encouragements 表缓存结果。
10. 同一 weight_record_id 只生成一条有效 AI 鼓励。
11. `POST /ai/encouragements/generate`。
12. `GET /ai/encouragements/latest`。
13. AI 接口限流。
14. 测试：缓存、fallback、输出过滤。

不要实现 AI 聊天。
不要实现 RAG。
不要前端直接调用 DeepSeek。
```

## 需要的环境变量

```env
DEEPSEEK_API_KEY=replace_me
DEEPSEEK_MODEL=deepseek-v4-flash
DEEPSEEK_FALLBACK_MODEL=deepseek-v4-pro
AI_PROMPT_VERSION=v1
AI_ENABLE_FALLBACK=true
AI_MAX_NOTE_CHARS=200
```

## 建议检查命令

```bash
pnpm --filter @weiqing/api typecheck
pnpm --filter @weiqing/api test
pnpm --filter @weiqing/api build
```

## 验收清单

- [ ] DeepSeek Key 只在后端环境变量中读取。
- [ ] 前端无 DeepSeek 依赖。
- [ ] 同一条体重记录不会重复调用 AI。
- [ ] AI 失败不会影响体重记录保存。
- [ ] fallback 文案可用。
- [ ] Prompt 禁止医疗诊断、极端减肥建议、身体羞辱。
- [ ] 返回前端的 DTO 不包含 raw_output、input_snapshot、prompt_version。
- [ ] AI 接口有限流。

---

# Phase 7 — Mobile 基础框架

## 目标

建立 Taro React + Capacitor 的移动端基础架构。

## 给 Codex 的任务指令

```md
请执行 Phase 7：Mobile 基础框架。

请在 `apps/mobile` 中实现：
1. Taro + React + TypeScript 项目结构。
2. 只以 H5 作为主要构建目标。
3. Capacitor 基础配置。
4. 全局 SCSS、CSS Variables、设计 token。
5. QueryClient 配置。
6. Zustand stores：auth、ui、checkin、trend、records。
7. `services/http.ts`：统一封装 Taro.request。
8. `services/auth-token.ts`：统一 token 读写。
9. `services/query-keys.ts`。
10. 基础组件：Button、Card、Input、Modal、Toast、Loading、EmptyState、PageShell、BottomTabBar。
11. Launch 页面骨架。
12. 登录 / 注册页面基础功能。

不要实现所有业务页面。
不要做精细 UI 还原。
不要加载 ECharts 到首页。
```

## 建议检查命令

```bash
pnpm --filter @weiqing/mobile typecheck
pnpm --filter @weiqing/mobile build:h5
pnpm lint
```

## 验收清单

- [ ] Taro H5 能构建。
- [ ] Capacitor 配置存在，但不需要立即打开 Xcode/Android Studio。
- [ ] 所有请求经过 `services/http.ts`。
- [ ] 没有页面直接调用 `Taro.request`。
- [ ] Token 逻辑封装在 `auth-token.ts`。
- [ ] TanStack Query 已配置默认 staleTime。
- [ ] Zustand stores 拆分合理，没有巨型 useAppStore。
- [ ] 基础组件不调用业务 API。
- [ ] 登录 / 注册能对接 API 或预留明确接口。

---

# Phase 8 — Mobile 核心页面与数据流

## 目标

实现移动端 MVP 功能页面，优先保证可用，不追求最终视觉。

## 给 Codex 的任务指令

```md
请执行 Phase 8：Mobile 核心页面与数据流。

请实现：
1. 首页：读取 `/home/overview`。
2. 打卡页：提交 `/weight-records`，支持乐观更新。
3. 趋势页：读取 `/stats/trend?range=7d|30d|90d`。
4. 记录页：分页读取 `/weight-records`，支持编辑和删除。
5. 月历视图：读取 `/weight-records/calendar`。
6. 我的页：读取 `/me` 和 `/stats/summary`。
7. 设置页：更新 profile/settings，支持提醒设置。
8. 账号注销页：提交 delete-request。
9. 退出登录：清理 token 和 Query 缓存。
10. 所有页面必须有 loading、error、empty 状态。

本阶段 UI 可以是基础版，但必须遵守移动端布局和性能规则。
不要做 Stitch 精细还原，那是 Phase 9。
```

## 建议检查命令

```bash
pnpm --filter @weiqing/mobile typecheck
pnpm --filter @weiqing/mobile build:h5
pnpm lint
```

## 验收清单

- [ ] 首页只请求 `/home/overview`。
- [ ] 打卡成功后 UI 立即反馈。
- [ ] AI generating/ready/failed/skipped 状态能展示。
- [ ] 趋势页只支持 7d/30d/90d。
- [ ] 历史记录分页加载，默认 20 条。
- [ ] 删除记录后相关缓存刷新。
- [ ] 设置页能修改目标体重、单位、提醒时间。
- [ ] 账号注销后清理本地登录态。
- [ ] 所有页面有 loading/error/empty。
- [ ] ECharts 只在趋势页加载。

---

# Phase 9 — Stitch UI 还原

## 目标

基于 `docs/design/weiqing-ui-design-organized/` 精细还原微轻 UI。

## 给 Codex 的任务指令

```md
请执行 Phase 9：Stitch UI 还原。

请先阅读：
1. `docs/design/weiqing-ui-design-organized/DESIGN_FOR_CODEX.md`
2. `docs/design/weiqing-ui-design-organized/PAGE_MAP.md`
3. `docs/design/weiqing-ui-design-organized/MVP_UI_SCOPE.md`
4. 各页面 `screen.png` 和 `code.html`

请按 MVP 优先级还原：
1. 首页
2. 打卡输入页
3. 打卡成功页
4. 记录列表页
5. 分析/趋势页
6. 我的页
7. 设置页
8. 登录/注册/Onboarding 可适度统一风格补齐

要求：
- 还原 iOS 灰白 + 柔和蓝 + Apple Health-like 视觉方向。
- 转换成 Taro React 组件与 SCSS。
- 不直接复制 Stitch HTML。
- 不使用 Tailwind CDN。
- 不使用 Google Fonts CDN。
- 不引入重型 UI 库。
- 底部安全区适配。
- 点击区域不小于 44px。
```

## 建议检查命令

```bash
pnpm --filter @weiqing/mobile typecheck
pnpm --filter @weiqing/mobile build:h5
pnpm lint
```

## 人工 UI 验收清单

- [ ] 首页接近 `02-home/home-logged-in/screen.png`。
- [ ] 打卡输入页接近 `03-check-in/check-in-input/screen.png`。
- [ ] 打卡成功页接近 `03-check-in/check-in-success/screen.png`。
- [ ] 记录页接近 `04-records/records-list/screen.png`。
- [ ] 分析页接近 `05-analysis/analysis-overview/screen.png`。
- [ ] 我的页接近 `06-profile/profile-home/screen.png`。
- [ ] 整体视觉不是粉紫风，而是 Stitch 里的灰白 + 柔和蓝。
- [ ] 字号层级清晰。
- [ ] 卡片圆角、留白、阴影克制。
- [ ] 没有复制无用 HTML/Tailwind 类名。
- [ ] 移动端竖屏体验良好。

---

# Phase 10 — Capacitor App 能力

## 目标

把 H5 包装成 Capacitor App，并接入必要原生能力。

## 给 Codex 的任务指令

```md
请执行 Phase 10：Capacitor App 能力。

请实现：
1. Capacitor iOS / Android 基础配置。
2. build:h5 后能执行 cap sync。
3. Preferences 或 Secure Storage 的封装适配。
4. Local Notifications：每日打卡提醒。
5. Haptics：打卡成功轻反馈。
6. Network：离线状态提示。
7. StatusBar / SplashScreen 基础配置。
8. 文档说明如何本地打开 iOS / Android 项目。

不要实现复杂推送。
不要接 Apple Health。
不要做应用市场上架脚本。
```

## 建议检查命令

```bash
pnpm --filter @weiqing/mobile build:h5
pnpm --filter @weiqing/mobile cap:sync
```

如果命令不存在，需要 Codex 补充脚本。

## 验收清单

- [ ] `capacitor.config.ts` 正确。
- [ ] H5 构建产物路径和 Capacitor webDir 对齐。
- [ ] 本地提醒设置逻辑与设置页联动。
- [ ] 打卡成功只触发一次 Haptics。
- [ ] 离线时有明确提示。
- [ ] 不在 render 中调用 Capacitor 插件。
- [ ] README 有 iOS/Android 本地运行说明。

---

# Phase 11 — 测试、性能与安全加固

## 目标

系统性修复类型、测试、性能和安全问题。

## 给 Codex 的任务指令

```md
请执行 Phase 11：测试、性能与安全加固。

请完成：
1. 运行全仓库 lint/typecheck/test/build。
2. 修复所有 TypeScript 错误。
3. 修复所有 lint 错误。
4. 增强 API e2e 测试：auth、weight-records、stats、ai fallback。
5. 增强 shared 工具函数测试。
6. 检查 Protected API 是否全部使用 JwtAuthGuard。
7. 检查 API 是否泄露敏感字段。
8. 检查首页是否只请求 `/home/overview`。
9. 检查趋势页 ECharts 是否只在趋势页加载。
10. 检查图表卸载 dispose。
11. 检查历史记录分页。
12. 输出已知性能风险和后续建议。
```

## 必须运行

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build:api
pnpm build:mobile
```

## 验收清单

- [ ] `pnpm lint` 通过。
- [ ] `pnpm typecheck` 通过。
- [ ] `pnpm test` 通过，或明确说明哪些测试依赖外部数据库。
- [ ] `pnpm build:api` 通过。
- [ ] `pnpm build:mobile` 通过。
- [ ] 没有明文密钥。
- [ ] 没有前端调用 DeepSeek。
- [ ] 没有前端直接访问数据库。
- [ ] 没有未授权读取其他用户数据的入口。
- [ ] 关键性能规则符合主 Prompt。

---

# Phase 12 — 部署准备

## 目标

准备 Vercel + Neon + 腾讯云域名部署说明和配置，但不强制立即上线。

## 给 Codex 的任务指令

```md
请执行 Phase 12：部署准备。

请完成：
1. Vercel 部署配置建议。
2. Neon DATABASE_URL / DATABASE_DIRECT_URL 使用说明。
3. API 和 Mobile 的 build 命令说明。
4. 环境变量完整说明。
5. 数据库 migration 运行说明。
6. 腾讯云域名 DNS 指向 Vercel 的说明。
7. 生产环境安全检查清单。
8. README 更新。

不要写真实密钥。
不要假设域名已经备案。
不要自动部署生产环境。
```

## 验收清单

- [ ] `.env.example` 完整。
- [ ] README 有本地启动说明。
- [ ] README 有部署说明。
- [ ] migration 命令清楚。
- [ ] Vercel 环境变量清楚。
- [ ] Neon pooled/direct connection string 用途清楚。
- [ ] 生产环境 `synchronize: false` 被再次强调。
- [ ] 域名和备案风险有说明。

---

## 4. 阶段通过后再进入下一阶段的判断标准

| 阶段 | 能否进入下一阶段的最低条件 |
|---|---|
| Phase 0 | Codex 能读取所有文档和设计资料 |
| Phase 1 | pnpm workspace 初始化成功 |
| Phase 2 | shared 类型和工具函数 typecheck/test 通过 |
| Phase 3 | API skeleton build 通过，health 可用 |
| Phase 4 | Auth 和 `/me` 基本可用，migration 存在 |
| Phase 5 | 核心 API 可测试，weight/stats/home 可用 |
| Phase 6 | AI 有缓存、fallback、限流，不阻塞打卡 |
| Phase 7 | Mobile H5 能 build，登录基础链路存在 |
| Phase 8 | MVP 功能页面可跑通 |
| Phase 9 | 主要页面视觉接近 Stitch |
| Phase 10 | Capacitor sync 可执行，原生能力基础可用 |
| Phase 11 | lint/typecheck/test/build 基本通过 |
| Phase 12 | 部署文档和配置准备完成 |

---

## 5. 不建议让 Codex 一次性完成的原因

不要直接给 Codex 一个任务：

```txt
请根据完整 Prompt 一次性生成完整微轻 APP。
```

原因：

1. 变更太大，review 困难；
2. 前后端、数据库、移动端、AI、UI 容易互相干扰；
3. 一旦底层目录结构错了，后面所有代码都会错；
4. UI 还原容易在功能尚未稳定时增加复杂度；
5. 外部依赖如 Neon、DeepSeek、Vercel 不一定一开始就准备好；
6. 分阶段更容易让 Codex 修复小范围问题。

正确做法：

```txt
先让 Codex 建骨架
再让 Codex 做 shared
再让 Codex 做 API
再让 Codex 做 mobile
最后让 Codex 做 UI 精修和测试
```

---

## 6. 第一条正式 Codex 任务建议

你可以直接把下面这段发给 Codex：

```md
你正在开发“微轻 APP”。

请先阅读：

1. `docs/codex/weiqing-codex-full-development-prompt.md`
2. `docs/codex/weiqing-codex-phased-execution-checklist.md`
3. `docs/design/weiqing-ui-design-organized/README.md`
4. `docs/design/weiqing-ui-design-organized/DESIGN_FOR_CODEX.md`
5. `docs/design/weiqing-ui-design-organized/MVP_UI_SCOPE.md`

本次只执行 Phase 0 和 Phase 1。

Phase 0：确认你能读取项目 Prompt、阶段执行文档和设计资料，并输出你理解的项目目标、技术栈、MVP 范围。

Phase 1：初始化 pnpm workspace，创建 `apps/mobile`、`apps/api`、`packages/shared`、根目录 TypeScript/ESLint/Prettier 配置、`.env.example`、README 和基础 scripts。

限制：
- 不要实现业务 API。
- 不要实现数据库 Entity。
- 不要实现 Taro 页面。
- 不要做 UI 还原。
- 不要引入主 Prompt 未批准的技术栈。

完成后运行：

```bash
pnpm install
pnpm lint
pnpm typecheck
```

如果某个命令因为子项目尚未初始化而暂时不可用，请说明原因，并保证下一阶段能替换占位脚本。

最后输出：
- 完成内容
- 修改文件
- 运行命令
- 检查结果
- 已知问题
- 是否建议进入 Phase 2
```

---

## 7. 人工验收建议

每次 Codex 完成一个阶段后，你至少做 5 件事：

1. 看文件结构是否符合预期；
2. 看 package 依赖有没有乱加；
3. 看是否越界实现了后续阶段；
4. 跑一次它声称通过的命令；
5. 对照本文件的验收清单逐项打勾。

如果 Codex 输出“已完成”，但命令未跑或报错，不要进入下一阶段。

---

## 8. 当前建议

现在已经具备启动 Codex 的条件：

- 技术栈已定；
- 数据库设计已定；
- API 设计已定；
- 前端结构已定；
- AI 方案已定；
- Stitch UI 资料已整理；
- 完整开发 Prompt 已生成；
- 本阶段执行清单已生成。

因此建议：**现在就让 Codex 开始 Phase 0 + Phase 1。**

不要等全部环境变量都准备好。真实 Neon、DeepSeek、Vercel 可以在 Phase 4、Phase 6、Phase 12 再接入。

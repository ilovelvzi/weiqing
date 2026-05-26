# 微轻 APP — Codex 完整开发 Prompt v1.0

> 使用方式：把本文件作为 Codex 的主任务说明。请先把 `weiqing-ui-design-organized/` 放入仓库 `docs/design/weiqing-ui-design-organized/`，然后让 Codex 从本 Prompt 开始执行。

---

## 0. 你的角色

你是一个资深全栈 TypeScript 工程师。请从 0 到 1 实现一个名为 **微轻** 的移动端体重记录 APP MVP。

你必须优先保证：

1. 项目可运行；
2. 前后端类型清晰；
3. 数据库模型正确；
4. 移动端性能稳定；
5. UI 尽量还原 Stitch 设计稿；
6. 不过度工程化。

请在完成每个阶段后运行对应检查命令，并修复 TypeScript、lint、build、test 报错。

---

## 1. 产品定位

**微轻** 是一款面向女性减脂用户的体重记录 APP。

核心体验：

- 每日体重打卡；
- 体重趋势分析；
- 目标体重进度；
- AI 温柔鼓励；
- 低压力、治愈、克制、苹果风；
- 不制造体重焦虑；
- 不提供医疗诊断。

MVP 不做：

- 社区；
- 订阅支付；
- 管理后台；
- 多租户；
- 微信登录；
- Apple Health 深度同步；
- AI 聊天机器人；
- RAG 知识库；
- K8s / Redis / 消息队列 / 微服务。

---

## 2. 技术栈

### 2.1 Monorepo

- pnpm workspace
- TypeScript
- ESLint
- Prettier

### 2.2 Mobile

- Taro + React + TypeScript
- 主要构建目标：Taro H5
- Capacitor 包装 H5 为 iOS / Android App
- SCSS + CSS Variables
- TanStack Query
- Zustand
- Zod
- Day.js
- ECharts
- Capacitor Plugins

必须注意：

- 不使用 Taro React Native；
- 不使用 Next.js；
- 不使用 Tailwind CDN；
- 不使用 Google Fonts CDN；
- 不直接复制 Stitch HTML 到 Taro 页面；
- 必须转换成 Taro `View`、`Text`、`Image`、`ScrollView`、`Input` 等组件。

### 2.3 API

- NestJS + TypeScript
- REST API
- TypeORM
- PostgreSQL
- Neon
- Passport JWT
- Argon2
- class-validator / class-transformer
- Swagger / OpenAPI
- Jest + Supertest

### 2.4 AI

- LangChain.js
- `@langchain/deepseek`
- 默认模型通过环境变量配置，默认值可设为 `deepseek-v4-flash`
- AI 只能在后端调用
- 前端不能直接访问 DeepSeek API

### 2.5 Deployment

- Vercel 部署 H5 与 API
- Neon PostgreSQL
- 腾讯云域名指向 Vercel

---

## 3. 仓库结构

请创建如下结构：

```txt
weiqing/
  apps/
    mobile/
    api/

  packages/
    shared/

  docs/
    design/
      weiqing-ui-design-organized/
    architecture.md
    database.md
    api.md

  scripts/
    seed.ts
    check-env.ts

  .env.example
  .gitignore
  package.json
  pnpm-workspace.yaml
  tsconfig.base.json
  eslint.config.js
  prettier.config.js
  README.md
```

依赖方向：

```txt
apps/mobile -> packages/shared
apps/api    -> packages/shared
```

禁止：

```txt
packages/shared -> apps/mobile
packages/shared -> apps/api
apps/mobile 直接依赖 apps/api 内部代码
apps/mobile 直接访问数据库
apps/mobile 直接调用 DeepSeek
```

---

## 4. Shared 包

`packages/shared` 只放纯类型、枚举、常量、Zod schema、纯工具函数。

建议结构：

```txt
packages/shared/src/
  enums/
    user-status.enum.ts
    weight-unit.enum.ts
    mood.enum.ts
    ai-tone.enum.ts
    record-source.enum.ts
    account-deletion-status.enum.ts
  types/
    api-response.type.ts
    user.type.ts
    weight-record.type.ts
    stats.type.ts
    ai-encouragement.type.ts
  schemas/
    auth.schema.ts
    weight-record.schema.ts
    user-profile.schema.ts
    user-settings.schema.ts
  constants/
  utils/
    date.util.ts
    weight.util.ts
  index.ts
```

核心枚举：

```ts
export enum UserStatus {
  ACTIVE = 'active',
  PENDING_DELETION = 'pending_deletion',
  DELETED = 'deleted',
  SUSPENDED = 'suspended',
}

export enum WeightUnit {
  KG = 'kg',
  LB = 'lb',
}

export enum Mood {
  HAPPY = 'happy',
  CALM = 'calm',
  TIRED = 'tired',
  ANXIOUS = 'anxious',
  NEUTRAL = 'neutral',
}

export enum AiTone {
  GENTLE = 'gentle',
  CELEBRATION = 'celebration',
  COMFORT = 'comfort',
  RESET = 'reset',
}

export enum RecordSource {
  MANUAL = 'manual',
  IMPORTED = 'imported',
}
```

统一响应：

```ts
export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```

---

## 5. 数据库设计

使用 TypeORM Entity + migration。生产环境必须 `synchronize: false`。

核心表：

```txt
users
user_profiles
user_settings
weight_records
ai_encouragements
refresh_tokens
account_deletion_requests
```

### 5.1 核心业务规则

1. 所有主键使用 uuid；
2. 所有表有 `created_at`、`updated_at`；
3. 业务表支持 `deleted_at` 软删除；
4. 体重统一存 kg；
5. `weight_kg` 使用 `numeric(5,2)`；
6. 每个用户同一个 `local_date` 只能有一条未删除体重记录；
7. 日期归属按用户本地日期 `local_date`，不是服务器 UTC 日期；
8. 同时保存 `timezone` 和 `recorded_at`；
9. 账号注销先软删除 / pending，再撤销 token。

### 5.2 WeightRecord 必须字段

```txt
id uuid PK
user_id uuid FK
weight_kg numeric(5,2)
local_date date
timezone varchar(80)
mood enum nullable
note text nullable
source enum default manual
recorded_at timestamptz
created_at timestamptz
updated_at timestamptz
deleted_at timestamptz nullable
```

关键索引 / migration：

```sql
CREATE UNIQUE INDEX uniq_weight_records_user_local_date_active
ON weight_records(user_id, local_date)
WHERE deleted_at IS NULL;

CREATE INDEX idx_weight_records_user_local_date_desc
ON weight_records(user_id, local_date DESC)
WHERE deleted_at IS NULL;

CREATE INDEX idx_weight_records_user_recorded_at_desc
ON weight_records(user_id, recorded_at DESC)
WHERE deleted_at IS NULL;
```

### 5.3 AiEncouragement 必须字段

```txt
id uuid PK
user_id uuid FK
weight_record_id uuid FK unique active
title varchar(80)
message text
tone enum
tags jsonb
model varchar(80)
prompt_version varchar(40)
input_snapshot jsonb nullable
raw_output jsonb nullable
generated_at timestamptz
created_at timestamptz
updated_at timestamptz
deleted_at timestamptz nullable
```

关键索引：

```sql
CREATE UNIQUE INDEX uniq_ai_encouragements_weight_record_active
ON ai_encouragements(weight_record_id)
WHERE deleted_at IS NULL;
```

---

## 6. 后端 API 设计

统一前缀：

```txt
/api/v1
```

全局要求：

1. 所有请求参数必须使用 DTO；
2. DTO 必须用 `class-validator`；
3. `main.ts` 启用全局 `ValidationPipe`：`whitelist: true`、`forbidNonWhitelisted: true`、`transform: true`；
4. 所有登录后接口必须使用 `JwtAuthGuard`；
5. 不能让前端传 `userId` 查询数据，必须从 JWT 中取 `currentUser.id`；
6. 所有用户数据查询必须校验归属；
7. 不返回 `password_hash`、`token_hash`、`raw_output`、`input_snapshot`。

### 6.1 API 清单

```txt
Auth:
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout

User:
GET    /api/v1/me
PATCH  /api/v1/me/profile
PATCH  /api/v1/me/settings

Home:
GET    /api/v1/home/overview

Weight Records:
POST   /api/v1/weight-records
GET    /api/v1/weight-records
GET    /api/v1/weight-records/calendar
GET    /api/v1/weight-records/:id
PATCH  /api/v1/weight-records/:id
DELETE /api/v1/weight-records/:id

Stats:
GET    /api/v1/stats/summary
GET    /api/v1/stats/trend

AI:
POST   /api/v1/ai/encouragements/generate
GET    /api/v1/ai/encouragements/latest

Account:
POST   /api/v1/account/delete-request
POST   /api/v1/account/delete-request/cancel

Health:
GET    /api/v1/health
```

### 6.2 首页聚合接口

必须实现：

```txt
GET /api/v1/home/overview
```

返回：

```ts
interface HomeOverviewDto {
  todayRecord: WeightRecordDto | null;
  latestEncouragement: AiEncouragementDto | null;
  summary: {
    currentWeightKg: number | null;
    targetWeightKg: number | null;
    diffFromLastKg: number | null;
    streakDays: number;
    totalRecords: number;
  };
  trendPreview: Array<{
    localDate: string;
    weightKg: number;
  }>;
}
```

首页最多返回最近 7 条趋势数据。

### 6.3 创建体重记录

```txt
POST /api/v1/weight-records
```

MVP 规则：

- 同一用户同一 `localDate` 已存在记录时，执行 update/upsert；
- 保存体重后触发 AI 鼓励语生成；
- AI 失败不能影响体重记录保存；
- 返回 `encouragementStatus`。

请求：

```ts
class CreateWeightRecordDto {
  weightKg: number;      // 20 - 300
  localDate: string;     // YYYY-MM-DD
  timezone: string;      // IANA timezone
  mood?: Mood;
  note?: string;         // max 500
  source?: RecordSource;
}
```

响应：

```ts
interface CreateWeightRecordResponseDto {
  record: WeightRecordDto;
  encouragement: AiEncouragementDto | null;
  encouragementStatus: 'ready' | 'generating' | 'failed' | 'skipped';
}
```

### 6.4 趋势接口

```txt
GET /api/v1/stats/trend?range=7d|30d|90d
```

只支持 7d、30d、90d。后端计算，不允许前端拉全量历史再计算。

---

## 7. AI 鼓励语模块

AI 模块只做“打卡后温柔鼓励语生成”，不做聊天机器人。

### 7.1 输入上下文

```ts
interface GenerateEncouragementInput {
  currentWeightKg: number;
  previousWeightKg?: number | null;
  targetWeightKg?: number | null;
  initialWeightKg?: number | null;
  streakDays: number;
  totalRecords: number;
  localDate: string;
  timezone: string;
  mood?: Mood | null;
  note?: string | null;
  aiTonePreference: AiTone;
}
```

传给 AI 前必须最小化输入：不要传邮箱、userId、完整历史、token、设备信息。

备注最多传 200 字。

### 7.2 输出结构

必须使用 Zod 校验：

```ts
const AiEncouragementOutputSchema = z.object({
  title: z.string().min(2).max(30),
  message: z.string().min(10).max(160),
  tone: z.enum(['gentle', 'celebration', 'comfort', 'reset']),
  tags: z.array(z.string().min(1).max(12)).max(4),
});
```

### 7.3 Prompt 安全规则

Prompt 必须禁止：

- 医疗诊断；
- 药物建议；
- 极端节食；
- 断食；
- 催吐；
- 过度运动建议；
- 羞辱身体；
- 制造焦虑；
- 承诺具体减重结果；
- “胖了”“失败了”“不够努力”等表达。

### 7.4 Fallback

AI 失败、JSON 解析失败、Zod 校验失败、命中禁止表达时，使用本地 fallback 文案。fallback 也保存到 `ai_encouragements`，`model = local-fallback`。

### 7.5 限流与缓存

- 同一条 `weight_record_id` 只生成一条有效 AI 鼓励；
- 生成前先查缓存；
- 每个用户每分钟最多 3 次 AI 生成；
- AI 失败不影响打卡；
- 前端不能展示 `raw_output`、`input_snapshot`、`prompt_version`。

---

## 8. 前端页面结构

Taro 页面：

```txt
apps/mobile/src/pages/
  launch/index.tsx
  auth/login.tsx
  auth/register.tsx
  onboarding/index.tsx
  index/index.tsx
  check-in/index.tsx
  trend/index.tsx
  records/index.tsx
  profile/index.tsx
  settings/index.tsx
  account-delete/index.tsx
```

底部 Tab 固定 4 个：

```txt
首页
记录
分析
我的
```

打卡不是底部 Tab。打卡入口放在首页主卡片和主要按钮。

### 8.1 页面职责

#### Launch

- 检查 token；
- 调用 `/me`；
- 成功进首页；
- 失败进登录页。

#### Auth

- 登录；
- 注册；
- 保存 token；
- 成功后进入首页或 onboarding。

#### Onboarding

根据设计稿实现：

- welcome；
- basic-info；
- current-weight；
- target-weight-scale；
- preferences；
- ready。

Onboarding 完成后更新：

```txt
PATCH /api/v1/me/profile
PATCH /api/v1/me/settings
```

#### 首页

必须只调用：

```txt
GET /api/v1/home/overview
```

展示：

- 今日体重；
- 目标进度；
- AI 鼓励；
- 最近趋势摘要；
- 打卡入口。

首页禁止：

- 加载完整 ECharts；
- 加载完整历史列表；
- 请求 90 天完整趋势；
- 主动生成 AI。

#### 打卡页

调用：

```txt
POST /api/v1/weight-records
```

需要：

- 体重输入；
- 单位选择 / 精度设置 bottom sheet；
- 心情选择；
- 备注；
- 提交成功状态；
- AI 鼓励卡片；
- Haptics 一次轻反馈。

#### 记录页

调用：

```txt
GET /api/v1/weight-records?page=1&pageSize=20
PATCH /api/v1/weight-records/:id
DELETE /api/v1/weight-records/:id
```

必须分页，默认 20，最大 50。

#### 分析页

调用：

```txt
GET /api/v1/stats/trend?range=7d|30d|90d
GET /api/v1/stats/summary
```

ECharts 只在分析页加载。图表卸载时必须 dispose。

#### 我的 / 设置

调用：

```txt
GET /api/v1/me
PATCH /api/v1/me/profile
PATCH /api/v1/me/settings
POST /api/v1/auth/logout
```

设置包括：

- 昵称；
- 身高；
- 目标体重；
- 体重单位；
- 提醒时间；
- 隐私 / AI 相关开关；
- 退出登录；
- 账号注销入口。

---

## 9. 前端目录结构

```txt
apps/mobile/src/
  pages/
  features/
    auth/
    onboarding/
    home/
    weight/
    stats/
    ai/
    profile/
    settings/
    account/
  components/
    base/
    layout/
    feedback/
  services/
    http.ts
    api-client.ts
    auth-token.ts
    query-client.ts
    query-keys.ts
  stores/
    auth.store.ts
    ui.store.ts
    checkin.store.ts
    trend.store.ts
    records.store.ts
  styles/
    variables.scss
    theme.scss
    mixins.scss
  utils/
```

### 9.1 请求层

所有请求必须经过 `services/http.ts`。

`http.ts` 职责：

- 封装 Taro.request；
- 自动拼接 API_BASE_URL；
- 自动注入 accessToken；
- 统一处理 401；
- refresh token 成功后重试原请求；
- refresh 失败后清理登录态并跳登录页；
- 统一错误结构。

禁止在页面里直接写 `Taro.request`。

### 9.2 TanStack Query

服务端状态全部使用 TanStack Query。

默认配置：

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
```

### 9.3 Zustand

UI 状态使用 Zustand。禁止创建巨型 `useAppStore`。

拆分：

```txt
auth.store.ts
ui.store.ts
checkin.store.ts
trend.store.ts
records.store.ts
```

`user/profile/settings/records/trend` 等服务端数据不要放 Zustand，交给 TanStack Query。

---

## 10. UI 设计稿还原

设计稿位于：

```txt
docs/design/weiqing-ui-design-organized/
```

Codex 必须优先阅读：

```txt
DESIGN_FOR_CODEX.md
MVP_UI_SCOPE.md
PAGE_MAP.md
00-foundation/design.md
每个 MVP 页面目录内的 screen.png 与 code.html
```

### 10.1 当前视觉方向

以 Stitch 包为准：

- iOS 优先；
- 苹果灰白背景；
- 柔和系统蓝 / Cloud Blue 点缀；
- 轻盈、克制、治愈、低压力；
- Apple Health-like 健康应用气质；
- 不使用高饱和粉紫少女风。

### 10.2 色彩 Token

在 `apps/mobile/src/styles/variables.scss` 定义：

```scss
:root {
  --wq-color-bg: #f9f9ff;
  --wq-color-surface: #ffffff;
  --wq-color-surface-low: #f0f3ff;
  --wq-color-surface-container: #e7eefe;
  --wq-color-primary: #205fa5;
  --wq-color-primary-soft: #7eb3ff;
  --wq-color-primary-light: #d4e3ff;
  --wq-color-secondary: #3d6751;
  --wq-color-secondary-light: #bfedd1;
  --wq-color-warning: #fedfa3;
  --wq-color-danger: #ba1a1a;
  --wq-color-text: #151c27;
  --wq-color-text-secondary: #424751;
  --wq-color-outline: #c2c6d2;
  --wq-color-separator: rgba(21, 28, 39, 0.08);
}
```

### 10.3 字体

不要打包字体文件，不依赖 Google Fonts。使用系统字体：

```scss
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', system-ui, sans-serif;
```

### 10.4 圆角 / 间距 / 阴影

```scss
:root {
  --wq-radius-sm: 8px;
  --wq-radius-md: 12px;
  --wq-radius-lg: 16px;
  --wq-radius-xl: 24px;
  --wq-radius-pill: 999px;

  --wq-space-xs: 4px;
  --wq-space-sm: 8px;
  --wq-space-md: 16px;
  --wq-space-lg: 24px;
  --wq-space-xl: 32px;
  --wq-page-padding: 20px;

  --wq-shadow-card: 0 8px 24px -4px rgba(32, 95, 165, 0.04), 0 2px 8px -2px rgba(32, 95, 165, 0.02);
}
```

规则：

- 普通卡片 16px 圆角；
- 首页主卡片 24px 圆角；
- 主按钮、chip、segmented control 使用 pill；
- 页面左右边距 16–20px；
- 可点击区域不小于 44px；
- 阴影必须轻。

### 10.5 MVP 优先页面

必须优先还原：

```txt
01-onboarding/welcome
01-onboarding/basic-info
01-onboarding/current-weight
01-onboarding/target-weight-scale
01-onboarding/preferences
01-onboarding/ready
02-home/home-logged-in
03-check-in/check-in-input
03-check-in/check-in-unit-sheet
03-check-in/check-in-success
04-records/records-list
04-records/record-edit
05-analysis/analysis-overview
06-profile/profile-home
06-profile/profile-edit
06-profile/target-weight
07-settings/reminder-settings
07-settings/privacy-settings
07-settings/edit-nickname-sheet
07-settings/edit-height-sheet
07-settings/reminder-time-sheet
08-account-security/logout-confirm-alert
08-account-security/delete-account-intro
08-account-security/delete-confirm
```

### 10.6 UI 组件

基础组件：

```txt
PageShell
BottomTabBar
Card
Button
Input
TextArea
SegmentedControl
TagChip
MetricCard
WeightNumber
BottomSheet
ConfirmDialog
EmptyState
SkeletonCard
Toast
```

业务组件：

```txt
TodayWeightCard
GoalProgressCard
EncouragementCard
WeightInputCard
WeightTrendChart
WeightRecordItem
MonthCalendar
ProfileStatsCard
ReminderSettingCard
```

---

## 11. 移动端性能规则

必须遵守：

1. 首页只请求 `/home/overview`；
2. 首页不加载完整 ECharts；
3. 首页不渲染完整历史列表；
4. 趋势 / 分析页才加载 ECharts；
5. 历史记录默认 `pageSize=20`，最大 50；
6. 超过 100 条记录使用虚拟列表或分批渲染；
7. 打卡提交使用 mutation + 乐观更新；
8. AI 不能阻塞打卡成功反馈；
9. Zustand store 必须按业务拆分；
10. 组件 props 中的大对象必须 `useMemo`；
11. 列表 item 使用 `React.memo`；
12. 图表组件卸载时必须 `dispose()`；
13. 动画以 `opacity` 和 `transform` 为主；
14. 不在 render 中调用 Capacitor 插件；
15. Preferences 只存轻量设置，不存大列表。

性能目标：

```txt
App 冷启动到首页可见 <= 2.5s
首页二次打开 <= 1s
页面切换响应 <= 300ms
打卡提交后 UI 反馈 <= 200ms
趋势图渲染 <= 500ms
```

---

## 12. Capacitor 能力

使用：

```txt
@capacitor/core
@capacitor/app
@capacitor/device
@capacitor/network
@capacitor/preferences
@capacitor/local-notifications
@capacitor/status-bar
@capacitor/splash-screen
@capacitor/keyboard
@capacitor/haptics
```

用途：

- 本地提醒：每日体重打卡提醒；
- Haptics：打卡成功轻反馈；
- Network：离线提示；
- Preferences：普通设置；
- Secure Storage：refresh token 可后续接入。

MVP 离线策略：

- 离线时允许填写草稿；
- 提交时提示网络不可用；
- 不做复杂离线同步。

---

## 13. 环境变量

`.env.example`：

```env
APP_NAME=微轻
APP_ENV=development

VITE_API_BASE_URL=http://localhost:3000/api/v1

API_PORT=3000
API_BASE_URL=http://localhost:3000

DATABASE_URL=postgresql://user:password@host/db?sslmode=require
DATABASE_DIRECT_URL=postgresql://user:password@host/db?sslmode=require

JWT_ACCESS_SECRET=replace_me
JWT_REFRESH_SECRET=replace_me
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

DEEPSEEK_API_KEY=replace_me
DEEPSEEK_MODEL=deepseek-v4-flash
DEEPSEEK_FALLBACK_MODEL=deepseek-v4-pro
AI_PROMPT_VERSION=v1
AI_ENABLE_FALLBACK=true
AI_MAX_NOTE_CHARS=200

CORS_ORIGIN=http://localhost:10086
```

---

## 14. 实现顺序

请按顺序实现，不要跳跃：

### Phase 1 — 工程初始化

1. 初始化 pnpm workspace；
2. 创建 `apps/mobile`、`apps/api`、`packages/shared`；
3. 配置 TypeScript、ESLint、Prettier；
4. 创建 `.env.example`；
5. 确保 `pnpm install` 成功。

### Phase 2 — Shared

1. 创建枚举；
2. 创建共享类型；
3. 创建 Zod schemas；
4. 创建日期和体重工具函数；
5. 写基础测试。

### Phase 3 — API 数据库与认证

1. NestJS 初始化；
2. TypeORM 配置；
3. Entity；
4. migration；
5. Auth register/login/refresh/logout；
6. JWT Guard；
7. `/me`。

### Phase 4 — 核心 API

1. user profile/settings；
2. weight-records；
3. home overview；
4. stats summary/trend；
5. account delete；
6. health；
7. Swagger。

### Phase 5 — AI 模块

1. AiModule；
2. prompt service；
3. DeepSeek LangChain service；
4. Zod output validation；
5. fallback；
6. caching；
7. rate limit。

### Phase 6 — Mobile 基础框架

1. Taro React 初始化；
2. Capacitor 配置；
3. styles tokens；
4. QueryClient；
5. Zustand stores；
6. http.ts；
7. auth-token.ts；
8. base components。

### Phase 7 — Mobile 页面

按 MVP 优先级实现：

1. Launch / Auth；
2. Onboarding；
3. 首页；
4. 打卡；
5. 记录；
6. 分析；
7. 我的；
8. 设置；
9. 注销。

### Phase 8 — UI 还原

1. 读取 `docs/design/weiqing-ui-design-organized/DESIGN_FOR_CODEX.md`；
2. 逐页参考 `screen.png`；
3. 用 `code.html` 提取布局和文案；
4. 转为 Taro 组件和 SCSS；
5. 不直接复制 Tailwind / HTML。

### Phase 9 — 测试与验收

必须运行：

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build:api
pnpm build:mobile
```

修复所有报错。

---

## 15. 验收标准

### 15.1 功能验收

- 可以注册；
- 可以登录；
- 可以完成 onboarding；
- 可以记录今日体重；
- 同一天重复记录会更新今日记录；
- 可以看到首页概览；
- 可以看到 AI 鼓励；
- 可以看到体重趋势；
- 可以分页查看历史记录；
- 可以编辑 / 删除记录；
- 可以修改目标体重；
- 可以修改提醒设置；
- 可以退出登录；
- 可以发起账号注销。

### 15.2 工程验收

- Monorepo 结构正确；
- 前后端共享类型放在 `packages/shared`；
- TypeORM migration 可运行；
- 生产环境 `synchronize: false`；
- 所有 Protected API 使用 JWT；
- 所有 DTO 有校验；
- API 不泄露敏感字段；
- 前端请求全部经过 `http.ts`；
- 服务端状态使用 TanStack Query；
- UI 状态使用 Zustand；
- 无 TypeScript 报错；
- 无 lint 报错。

### 15.3 UI 验收

- 视觉方向符合 Stitch：灰白 + 柔和蓝 + iOS 健康应用风格；
- 首页接近 `02-home/home-logged-in/screen.png`；
- 打卡页接近 `03-check-in/check-in-input/screen.png`；
- 打卡成功接近 `03-check-in/check-in-success/screen.png`；
- 记录页接近 `04-records/records-list/screen.png`；
- 分析页接近 `05-analysis/analysis-overview/screen.png`；
- 我的页接近 `06-profile/profile-home/screen.png`；
- 底部安全区正确；
- 可点击区域不小于 44px；
- 不引入在线字体 / CDN。

### 15.4 性能验收

- 首页只请求 `/home/overview`；
- 首页不加载 ECharts；
- 历史记录分页；
- AI 不阻塞打卡成功；
- 图表卸载 dispose；
- 无明显滚动卡顿。

---

## 16. 最终输出

完成后，请输出：

1. 已实现功能列表；
2. 未实现 / 二期功能列表；
3. 本地启动命令；
4. 环境变量说明；
5. 数据库 migration 命令；
6. 测试命令与结果；
7. 已知问题；
8. 下一步建议。


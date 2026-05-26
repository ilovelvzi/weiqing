# CODEX_UI_IMPLEMENTATION_PROMPT.md

你正在实现「微轻 APP」移动端 UI。请读取 `docs/design/weiqing-ui-design-organized` 目录中的设计资料，并按以下规则执行。

## 任务

将 Stitch 导出的 UI 设计稿转换为 Taro + React + TypeScript + SCSS 的移动端页面与组件。

## 必读文件

1. `DESIGN_FOR_CODEX.md`
2. `MVP_UI_SCOPE.md`
3. `PAGE_MAP.md`
4. MVP 页面目录下的 `screen.png` 和 `code.html`

## 实现规则

1. 使用 Taro 组件实现，不直接复制原始 HTML。
2. 不使用 Tailwind CDN。
3. 不使用 Google Fonts CDN。
4. 不使用 Material Symbols 在线字体。
5. 样式统一写入 SCSS，并使用 CSS Variables。
6. 基础组件放到 `apps/mobile/src/components`。
7. 业务组件放到 `apps/mobile/src/features`。
8. 页面放到 `apps/mobile/src/pages`。
9. 遵守首页轻量、图表延迟加载、列表分页、动画克制的性能规则。
10. 以 iOS 竖屏体验为主，保证 Safe Area 与 44px 点击热区。

## MVP 页面优先级

第一批：

- 首页：参考 `02-home/home-logged-in`
- 打卡页：参考 `03-check-in/check-in-input`
- 打卡成功：参考 `03-check-in/check-in-success`
- 记录页：参考 `04-records/records-list`
- 分析页：参考 `05-analysis/analysis-overview`
- 我的页：参考 `06-profile/profile-home`

第二批：

- 登录 / 欢迎：参考 `01-onboarding/welcome`
- 新手引导：参考 `01-onboarding/*`
- 设置页：参考 `07-settings/reminder-settings`、`07-settings/privacy-settings`
- 账号注销：参考 `08-account-security/delete-account-intro`、`08-account-security/delete-confirm`

## 风格关键词

Apple-like, iOS, gray-white, cloud blue, airy, healing, gentle, restrained, card-based, large number, low-pressure health companion.

## 输出要求

实现完成后，确保：

- `pnpm dev:mobile` 可以启动；
- `pnpm build:mobile` 可以构建 H5；
- 主要页面无 TypeScript error；
- 页面与设计稿的视觉比例、卡片层级、主色、字号层级接近；
- 不引入和当前技术栈冲突的库。

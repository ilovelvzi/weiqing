# 微轻 UI 设计稿文件映射表
本目录是从 Stitch 导出包整理出来的语义化版本。每个页面目录都保留：

- `screen.png`：视觉参考图
- `code.html`：Stitch 导出的 HTML/CSS 参考

实现时以 `screen.png` 和 `DESIGN_FOR_CODEX.md` 为视觉准绳，`code.html` 只用于提取布局、文案、间距、颜色和组件结构，不要直接复制进 Taro 项目。
| 分类 | 语义文件夹 | 原始文件夹 | MVP | 用途 / 路由 | 标题 | 尺寸 |
|---|---|---|---|---|---|---|
| `00-foundation` | `logo` | `logo` | foundation | App icon / logo reference |  | 1024×1024 |
| `01-onboarding` | `welcome` | `_10` | mvp | pages/launch or onboarding welcome | WeiQing - Welcome | 585×930 |
| `01-onboarding` | `basic-info` | `onboarding_2` | mvp | onboarding step: base info | 基础信息 | 585×1428 |
| `01-onboarding` | `current-weight` | `onboarding_4` | mvp | onboarding step: current weight | 当前体重 | 585×1387 |
| `01-onboarding` | `target-weight-scale` | `onboarding_1` | mvp | onboarding step: target weight ruler | 目标体重 - 微轻 | 585×1326 |
| `01-onboarding` | `preferences` | `onboarding_5` | mvp | onboarding step: permissions/preferences | Preference Settings - Onboarding | 585×1326 |
| `01-onboarding` | `ready` | `onboarding_3` | mvp | onboarding completion | 微轻 - 准备好了 | 585×1501 |
| `02-home` | `home-logged-in` | `_17` | mvp | pages/index/index | WeiQing - Home | 585×2271 |
| `03-check-in` | `check-in-input` | `_16` | mvp | pages/check-in/index | 微轻 - 打卡输入页 | 585×1408 |
| `03-check-in` | `check-in-unit-sheet` | `_8` | mvp | unit/precision bottom sheet | 微轻 - 打卡输入页 | 465×1600 |
| `03-check-in` | `check-in-unit-sheet-narrow` | `sheet_7` | optional | alternate unit sheet | 微轻 - 打卡输入页 | 382×1600 |
| `03-check-in` | `check-in-success` | `sheet_6` | mvp | success sheet / AI encouragement card | 记录完成 - WeiQing | 585×988 |
| `04-records` | `records-list` | `_4` | mvp | pages/records/index list mode | 微轻 - 记录 | 585×1416 |
| `04-records` | `records-chart-tab` | `_11` | optional | records chart tab; trend UI reference | 记录 - 微轻 App | 585×1326 |
| `04-records` | `record-edit` | `_24` | mvp | record edit screen/modal | 微轻 App - 编辑记录 | 585×1326 |
| `04-records` | `records-filter-sheet` | `_28` | optional | filter sheet mobile | 微轻 - 筛选 | 706×1600 |
| `04-records` | `records-filter-wide` | `_31` | optional | filter sheet wide | 微轻 - 筛选 | 1210×1962 |
| `05-analysis` | `analysis-overview` | `_1` | mvp | pages/trend/index / analysis | 微轻 - 分析 | 349×1600 |
| `05-analysis` | `weekly-report` | `_30` | phase2 | weekly report | 体重周报 | 350×1600 |
| `05-analysis` | `monthly-report` | `_29` | phase2 | monthly report | 微轻 - 体重月报 | 585×4558 |
| `06-profile` | `profile-home` | `_9` | mvp | pages/profile/index | 微轻 - 我的 | 326×1600 |
| `06-profile` | `profile-edit` | `_15` | mvp | profile detail/edit | 个人资料 - 微轻 | 493×1600 |
| `06-profile` | `target-weight` | `_14` | mvp | target weight settings | 目标体重 | 585×1326 |
| `06-profile` | `health-data` | `_19` | phase2 | health data indicators | 微轻 - 健康数据 | 444×1600 |
| `07-settings` | `reminder-settings` | `_2` | mvp | reminder settings | 提醒设置 - 微轻 App | 526×1600 |
| `07-settings` | `reminder-settings-alt` | `ios_2` | optional | alternate reminder settings | 提醒设置 - 微轻 App | 511×1600 |
| `07-settings` | `appearance-light` | `_20` | optional | appearance settings light | 外观设置 - 微轻 | 585×1521 |
| `07-settings` | `appearance-dark` | `_25` | optional | appearance settings dark | 外观设置 - 微轻 | 585×1521 |
| `07-settings` | `privacy-settings` | `switch_1` | mvp | privacy / AI toggle settings | 微轻 - 隐私设置 | 311×1600 |
| `07-settings` | `apple-health` | `apple_health` | phase2 | Apple Health integration | Apple Health 设置 | 433×1600 |
| `07-settings` | `data-sync-ok` | `_5` | phase2 | sync status normal | 数据同步 - 微轻 | 557×1600 |
| `07-settings` | `data-sync-offline` | `_26` | phase2 | sync offline state | 数据同步 - 微轻 | 585×1326 |
| `07-settings` | `data-sync-failed` | `_18` | phase2 | sync failed state | 微轻 - 数据同步失败 | 585×1326 |
| `07-settings` | `data-sync-deletion-cooling` | `_32` | phase2 | sync stopped during deletion | 微轻 - 数据同步 | 585×976 |
| `07-settings` | `about` | `_3` | phase2 | about page | 关于微轻 | 524×1600 |
| `07-settings` | `help-feedback` | `_21` | phase2 | help center | 微轻 App - 帮助与反馈 | 585×2389 |
| `07-settings` | `feedback-sheet` | `sheet_1` | phase2 | feedback sheet | 微轻 App - 意见反馈 | 585×1404 |
| `07-settings` | `edit-nickname-sheet` | `sheet_5` | mvp | nickname bottom sheet | 编辑昵称 - 底部面板 | 585×1837 |
| `07-settings` | `edit-height-sheet` | `sheet_2` | mvp | height bottom sheet | 修改身高 - Bottom Sheet | 585×1354 |
| `07-settings` | `edit-height-sheet-alt` | `sheet_8` | optional | height bottom sheet alternate | 修改身高 | 585×1872 |
| `07-settings` | `record-waist-sheet` | `sheet_3` | phase2 | waist input sheet | 记录腰围 Bottom Sheet | 585×1803 |
| `07-settings` | `reminder-time-sheet` | `sheet_4` | mvp | time picker bottom sheet | 选择提醒时间 - 底部抽屉 | 706×1600 |
| `08-account-security` | `account-binding` | `_27` | phase2 | account & binding | 账号与绑定 - 微轻 App | 585×2002 |
| `08-account-security` | `logged-devices` | `_22` | phase2 | logged-in devices | 已登录设备 | 706×1600 |
| `08-account-security` | `device-alert-updated` | `alert_1` | optional | device management alert | 已登录设备管理 | 706×1600 |
| `08-account-security` | `device-alert-remove` | `alert_2` | optional | remove device confirmation | 已登录设备管理 - 微轻 App | 706×1600 |
| `08-account-security` | `logout-confirm-alert` | `alert_3` | mvp | logout confirmation | 已登录设备管理 - 退出确认 | 585×1326 |
| `08-account-security` | `delete-account-intro` | `_23` | mvp | account delete intro | 账号注销 | 465×1600 |
| `08-account-security` | `delete-verify-identity` | `_13` | phase2 | delete verify identity | 验证身份 - 微轻 | 585×876 |
| `08-account-security` | `delete-confirm` | `_12` | mvp | delete account confirmation | 确认注销 | 585×1326 |
| `08-account-security` | `delete-cooling-period` | `_6` | phase2 | deletion cooling period | 微轻 App - 账号注销冷静期 | 639×1600 |
| `08-account-security` | `data-export-request` | `ios_1` | phase2 | data export request | 微轻 - 数据导出 | 592×1600 |
| `08-account-security` | `data-export-ready` | `_7` | phase2 | data export ready | 微轻 - 数据导出 | 551×1600 |

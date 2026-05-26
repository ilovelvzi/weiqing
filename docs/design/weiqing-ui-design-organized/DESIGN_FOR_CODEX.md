# DESIGN_FOR_CODEX.md — 微轻 APP UI 还原规范

## 1. 设计稿来源

本包来自 Stitch 导出的微轻设计系统，已按语义目录整理。Codex 实现时应该优先读取：

1. `MVP_UI_SCOPE.md`：MVP 优先页面范围；
2. `PAGE_MAP.md`：语义目录与原始 Stitch 文件夹映射；
3. `00-foundation/design.md`：完整设计系统；
4. 每个页面目录内的 `screen.png` 与 `code.html`。

## 2. 当前视觉方向

本次 Stitch 包的实际视觉方向是：

- iOS 优先；
- 苹果灰白背景；
- 柔和系统蓝 / Cloud Blue 点缀；
- 轻盈、克制、治愈、低压力；
- 健康数据清晰，但不医疗化；
- 女性减脂陪伴感，但避免高饱和粉色和过度“少女感”。

这和早期讨论中的“奶白 + 淡粉 / 浅紫”相比，当前设计稿已经明显收敛到 **Apple Health-like 灰白 + 蓝色点缀**。实现时请以本设计包为准。

## 3. 色彩 tokens

建议在 `apps/mobile/src/styles/variables.scss` 中定义：

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

如果后续要更贴近 iOS 系统色，可以把这些 tokens 映射到 `systemBackground` / `secondarySystemBackground` / `label` / `secondaryLabel` 语义。

## 4. 字体

设计稿中大量使用 Manrope / Material Symbols，这是 Stitch 的 Web 导出习惯。

实际 App 实现规则：

- 不上传、不打包字体文件；
- 不依赖 Google Fonts；
- 使用系统字体栈：`-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif`；
- 图标不要直接依赖 Material Symbols CDN，应改成轻量 SVG / icon component / CSS 绘制，或后续接入本地图标集。

推荐字号：

| Token | 用途 | 大小 |
|---|---|---:|
| `weight-display` | 首页体重数字 | 48px / 56px |
| `large-title` | 页面大标题 | 34px / 41px |
| `title-1` | 页面标题 | 28px / 34px |
| `card-title` | 卡片标题 | 20px / 25px |
| `headline` | 列表主文案 | 17px / 22px |
| `body` | 正文 | 17px / 22px |
| `subheadline` | 次级信息 | 15px / 20px |
| `caption` | 弱说明 | 13px / 18px |

## 5. 圆角、间距、阴影

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

- 普通卡片：16px 圆角；
- 首页主卡片、报告主卡：24px 圆角；
- 主按钮、chip、segmented control：pill 圆角；
- 阴影必须轻，不使用厚重投影；
- 页面左右边距 16–20px；
- 使用 8pt 网格。

## 6. 导航规则

底部 Tab 固定为 4 个：

1. 首页；
2. 记录；
3. 分析；
4. 我的。

规则：

- 打卡不是底部 Tab；
- 打卡入口放在首页主卡片和底部主按钮；
- 底部 Tab 可以使用轻毛玻璃 / 半透明，但内容卡片不要使用重毛玻璃；
- 所有可点击区域不小于 44px。

## 7. 页面实现优先级

Codex 应优先还原这些 MVP 页面：

- `01-onboarding/welcome`
- `01-onboarding/basic-info`
- `01-onboarding/current-weight`
- `01-onboarding/target-weight-scale`
- `01-onboarding/preferences`
- `01-onboarding/ready`
- `02-home/home-logged-in`
- `03-check-in/check-in-input`
- `03-check-in/check-in-success`
- `04-records/records-list`
- `04-records/record-edit`
- `05-analysis/analysis-overview`
- `06-profile/profile-home`
- `06-profile/profile-edit`
- `06-profile/target-weight`
- `07-settings/reminder-settings`
- `07-settings/privacy-settings`
- `08-account-security/delete-account-intro`
- `08-account-security/delete-confirm`

## 8. Taro 实现注意事项

Stitch 导出的是 HTML + Tailwind + Material Symbols。Codex 不能照搬：

- 不要在 Taro 项目中引入 Tailwind CDN；
- 不要引入 Google Fonts CDN；
- 不要直接复制 `<div>` 结构到 Taro 页面；
- 应转换为 `View`、`Text`、`Image`、`ScrollView`、`Input` 等 Taro 组件；
- 样式转换为 SCSS / CSS Variables；
- 组件拆分到 `features` 和 `components`；
- 页面必须符合前面已定的路由、状态管理和性能规则。

## 9. 组件还原边界

优先沉淀这些基础组件：

- `PageShell`
- `BottomTabBar`
- `Card`
- `Button`
- `SegmentedControl`
- `TagChip`
- `MetricCard`
- `WeightNumber`
- `BottomSheet`
- `ConfirmDialog`
- `EmptyState`
- `SkeletonCard`

业务组件：

- `TodayWeightCard`
- `GoalProgressCard`
- `EncouragementCard`
- `WeightInputCard`
- `WeightTrendChart`
- `WeightRecordItem`
- `MonthCalendar`
- `ProfileStatsCard`
- `ReminderSettingCard`

## 10. 图标规则

Stitch 中的 Material Symbols 只作为语义参考，例如：

- `home` → 首页；
- `edit_note` → 记录；
- `insights` / `analytics` → 分析；
- `person` → 我的；
- `favorite` → Apple Health / 健康；
- `notifications` → 提醒；
- `shield` → 隐私安全。

实现时可用轻量 SVG icon 或自定义 Icon 组件，不要依赖在线字体图标。

## 11. 不进入 MVP 的页面

以下页面可以保留为二期参考，不要求 Codex 在 MVP 一次性实现：

- Apple Health 深度同步；
- 数据导出完整流程；
- 周报 / 月报；
- 设备管理；
- 帮助中心；
- 数据同步状态全流程；
- 健康数据复杂指标；
- 注销冷静期完整恢复流程。

## 12. Codex 验收标准

- 页面视觉接近 `screen.png`，不是直接复刻 HTML；
- 颜色、圆角、卡片、间距保持一致；
- 首页、打卡、记录、分析、我的五个核心页面风格统一；
- 所有页面适配 iPhone 竖屏；
- 底部安全区、顶部安全区处理正确；
- 不引入 Tailwind CDN / Google Fonts / Material Symbols CDN；
- 不为了 UI 还原破坏性能规则。

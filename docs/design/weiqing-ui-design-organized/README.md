# 微轻 UI 设计稿整理包

这是从用户上传的 Stitch 导出包整理后的设计资料，面向后续 Codex 开发使用。

## 目录说明

- `00-foundation/`：设计系统、Logo、原始设计规范文档；
- `01-onboarding/`：新手引导；
- `02-home/`：首页；
- `03-check-in/`：体重打卡；
- `04-records/`：历史记录；
- `05-analysis/`：分析 / 趋势；
- `06-profile/`：我的 / 个人资料；
- `07-settings/`：设置相关；
- `08-account-security/`：账号、安全、注销、导出；
- `assets/contact-sheet-all-screens.png`：所有页面缩略总览。

## 重要文件

- `DESIGN_FOR_CODEX.md`：给 Codex 的 UI 还原规范；
- `CODEX_UI_IMPLEMENTATION_PROMPT.md`：可直接复制进最终开发 Prompt 的 UI 实现章节；
- `PAGE_MAP.md`：原始 Stitch 文件夹与语义目录映射；
- `MVP_UI_SCOPE.md`：MVP 优先还原页面清单。

## 使用方式

建议把本目录放到项目仓库：

```txt
docs/design/weiqing-ui-design-organized/
```

然后在 Codex Prompt 中要求它优先读取 `DESIGN_FOR_CODEX.md` 和 `MVP_UI_SCOPE.md`。

## 注意

Stitch 导出文件中包含 HTML、Tailwind CDN、Google Fonts、Material Symbols。正式实现时不要直接复制这些依赖，应转换为 Taro React + SCSS + 自定义组件。

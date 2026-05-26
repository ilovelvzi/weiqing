import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.taro/**",
      "**/coverage/**",
      ".codex-tools/**"
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended
];

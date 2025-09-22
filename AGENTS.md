# Repository Guidelines

## 项目定位与范围
- 本项目为非商业用途，目标是满足课程 Rubric 要求并交付可演示成果。
- 对于 Rubric 未要求的冗余安全或防御性逻辑可暂缓，必要时在代码中标注 `TODO`（例如 `TODO: add defensive guard`）。
- 常规防御性措施仍需保留，如表单必填校验、基础错误处理，以确保用户体验稳定。

## 必读资料与流程
- 所有开发或改动前，务必重读 `Brief/brief.md`、`Brief/rubric.md`、`Brief/RESTFul.md` 与 `Brief/PRD.md`，确保实现与评估标准一致。
- 任何需求假设或范围变更都要先更新 PRD，再进行编码；如果存在不确定性，请先在文档或注释中记录。
- AI Coding Tool（Codex、Claude Code、Cursor 等）必须在每次迭代时引用本指南及上述文档。

## 项目结构
- `src/main.jsx` 挂载应用；`src/App.jsx` 管理全局布局与路由。
- 共享组件放在 `src/components/`；静态资源位于 `src/assets/`；公开静态文件置于 `public/`。
- `src/server/app.js` 仅作 API 调用范例，不要提交真实凭证。

## 技术栈与 UI 约束
- TailwindCSS v4.1：在 `tailwind.config.js` 中维护 `content` 白名单，样式入口使用 `@import 'tailwindcss';`，自定义工具类遵循 v4 的 `@plugin`/`@utility` 写法。
- DaisyUI v5.1.14：通过 `plugins: [daisyui]` 集成，使用 `data-theme` 或 `theme` 配置切换主题，导航/表单优先采用 DaisyUI 组件。
- Mantine v8.3.0：在顶层使用 `MantineProvider`（可设 `defaultColorScheme`，并启用 `withGlobalStyles`、`withNormalizeCSS`）包裹需要的交互组件（`Modal`、`Drawer`、`Tabs`、`Notifications` 等），注意与 Tailwind/DaisyUI class 共存。
- 响应式仅需覆盖桌面端不同宽度下的布局适配；若 Rubric/Brief 无移动端要求，则无需额外实现移动端 UI。
- React Router：使用 `react-router-dom` 管理页面跳转，按阶段迭代增加路由和懒加载模块。

## 构建与验证
- `npm install` 安装依赖；`npm run dev` 启动开发服务器，默认端口 5173。
- `npm run build` 生成生产包；`npm run preview` 用于发布前自测。
- `npm run lint` 作为最低提交前检查；引入测试后补充运行指令。

## 代码风格与规则
- 统一 2 空格缩进、UTF-8 编码；组件使用 PascalCase，Hooks/函数使用 camelCase。
- 强制遵循 SOLID、DRY、KISS 与可读性原则；保持组件小巧、逻辑可复用，集中管理 Fetch/API 调用。
- Tailwind 工具类按布局 → 间距 → 视觉顺序排列，必要时添加精炼注释说明复杂逻辑。

## 测试与质量
- 当前无自动化测试；新增测试建议放在 `src/__tests__/` 或组件旁，优先采用 Vitest + Testing Library。
- 网络调用请 mock 掉真实 RESTFul API，保证测试稳定。
- 未覆盖测试前至少运行 `npm run lint` 并完成手动冒烟测试（列表 CRUD、录音流程、GenAI 面板）。

## 提交流程
- 提交信息使用简短祈使句，必要时补充 72 字符换行的正文解释背景或关联任务。
- 在 PR 中列出变更摘要、测试结果、关联问题与 UI 截图/录屏，标记涉及 API 或数据结构的影响。

## 安全与配置
- JWT、API Key 等秘钥放在 `.env.local`，切勿写入仓库。
- API 请求统一通过服务层注入 `Authorization`、`username` 等字段，并处理错误和缺失配置提示。
- 若发现凭证泄露，立即旋转密钥并通知维护者。

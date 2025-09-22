ReadySetHire 产品需求文档（PRD）

1. 项目背景与评估范围
ReadySetHire 是 COMP2140/7240 React Web 标准项目，占 React Web Assessment 20%（另含 8% Demo & Code Review）。项目目标是为招聘团队构建一套可扩展的前端应用，覆盖面试模板、题库、候选人管理以及候选人语音答题体验，并预留 GenAI 拓展能力。系统必须依照课程提供的 RESTFul API（https://comp2140a2.uqcloud.net/api）与 Rubric 规范实现，确保演示时具备至少一条可用示例数据。

2. 技术栈与 UI 规范
- 前端框架：React 19 + Vite，使用模块化路由与受控组件。
- 样式系统：TailwindCSS 结合 DaisyUI 主题组件（Navbar、Card、Drawer、Badge 等），保证统一的色彩与暗/亮模式支持。
- 组件库：在保留 DaisyUI 主体的基础上挑选常用 Mantine 组件（如 `@mantine/core` 的 `Modal`、`Drawer`、`Tabs`、`Notifications`），用于交互密集的场景；Mantine 使用需与 DaisyUI 风格调和。
- 代码规范：遵循 SOLID、DRY、KISS、可读性原则；以函数式组件 + Hooks 为主，所有 API 调用统一通过服务层。
- 必读文档：所有开发前须复核 `Brief/brief.md`、`Brief/rubric.md`、`Brief/RESTFul.md` 及本 PRD，任何功能变更需同步更新文档。

3. 信息架构与导航
- 全局使用 AppLayout，包含固定 Header、主导航、内容区、Footer，适配桌面与移动端（Drawer 切换导航）。
- 主导航分为 Dashboard、Interviews、Questions、Applicants 四大入口；候选人使用 `/take/:applicantId` 独立路由。
- 支持 404 和空态页面，提供返回首页操作。

4. 核心功能需求
4.1 Dashboard
- 以 DaisyUI 卡片展示关键模块入口、待办提醒与统计摘要（面试数、待处理候选人等）。
- 提供快速链接到 Interviews/Questions/Applicants，并展示 GenAI 功能入口。

4.2 面试管理（Interviews）
- 列表页显示标题、职位、状态、问题数量、候选人数量及状态分布，支持刷新与错误/空状态提示。
- Add/Edit 复用表单组件，校验必填项（title、job_role、description、status），默认 Draft；提交后返回列表并 toast 提示。
- 支持删除确认对话框（Mantine Modal），操作前校验关联数据提示。

4.3 题库管理（Questions）
- 卡片或表格展示题干、所属面试、难度标签；可按面试筛选、刷新、处理空态。
- 表单校验题干、难度、面试必选；难度使用 DaisyUI Button Group 或 Mantine SegmentedControl。
- 删除操作需确认并提供错误反馈。

4.4 候选人管理（Applicants）
- 列表展示候选人姓名、联系方式、状态徽章、所属面试、唯一邀请链接（可复制）。
- Add/Edit 表单包含 Title、Firstname、Surname、Phone、Email、Interview、Status；创建成功后生成 `/take/:applicantId` 链接。
- 列表提供手动触发 GenAI 摘要及查看回答的入口。

4.5 候选人答题流程（Take Interview）
- 欢迎页显示候选人信息、面试摘要和操作说明；若数据缺失则展示错误页。
- 逐题答题流程：每页单题、仅 Next 按钮；必须先录音方可继续，禁止回退。
- 录音控件支持开始、暂停/恢复、结束，完成后上传并调用转写服务将文本写入 `/applicant_answer`。
- 所有题目完成后更新候选人状态为 Completed，并展示感谢页及后续指引。

4.6 Advanced GenAI
- 需实现创意 GenAI 功能，建议在 Applicants 列表中提供候选人回答摘要面板，支持加载/错误状态及手动刷新；缺失 API Key 时展示占位提示。

5. 数据模型与 API 契约
- Interview：字段包括 id、title、job_role、description、status、username（必填）。增删改需附带 JWT 与 username=eq.{studentId} 过滤。
- Question：字段包括 id、interview_id、question、difficulty、username；难度枚举为 Easy/Intermediate/Advanced。
- Applicant：字段包括 id、interview_id、title、firstname、surname、phone_number、email_address、interview_status、username；状态枚举 Not Started/Completed。
- Applicant Answer：字段包括 id、interview_id、question_id、applicant_id、answer、username；保存转写文本。
- 所有 POST/PATCH 请求应携带 `Prefer: return=representation`，服务层统一拼接 Base URL、Bearer Token、username。

6. 用户体验与无障碍要求
- Header、导航、Footer 在所有页面保持一致，采用 DaisyUI 组件并保证键盘可访问性。
- Loading、Empty、Error 态需具备可见提示；表单实时显示校验信息。
- Audio Recorder 提供 ARIA 标签与状态说明；错误时给出友好提示。
- 色彩与字体遵循课程规范，可通过 DaisyUI 主题或 Tailwind 配色实现。

7. 评估对照与交付物
- 核心功能对应 Rubric 1.1–1.8，确保 CRUD、单页答题、音频转写与答案展示全部覆盖。
- UI/UX 条目对应 Rubric 2.1–2.2：实现一致导航、明确流程、适当视觉引导。
- 代码质量条目对应 Rubric 3.1–3.4：采用函数式组件、共享 API 客户端、全面错误处理、保持代码整洁。
- GenAI 功能对应 Rubric 4.1：在 Applicants 或 Interviews 模块中交付可演示的 AI 摘要或建议。
- Demo & Code Review 准备：准备示例数据、文档说明 GenAI 使用情况，并在 README 中记录。

8. 开发策略与里程碑
- 阶段一：布局与导航骨架
  - 落地 AppLayout（Header、Nav、Content、Footer）骨架，并留出主内容占位。
  - 依次实现 Dashboard、Interviews、Questions、Applicants 四个静态页面入口（每次提交集中在单页）。
  - 添加 DaisyUI/Mantine 主题切换设置及 404、空态基础组件，确保导航完整。
- 阶段二：数据服务与 CRUD 基础
  - 编写统一 `apiClient` 与资源服务层，处理 JWT、username 注入与错误。
  - Interviews 页：先接入列表加载，再补充创建/编辑表单，各步骤单独提交。
  - Questions 页：仿照 Interviews，分步骤完成列表与表单，并引入筛选控件。
  - Applicants 页：实现列表（含邀请链接展示）与表单，最后补充复制链接与状态徽章。
- 阶段三：候选人答题流程
  - `/take/:applicantId` 欢迎页静态内容 → 接入候选人与题目数据 → 实现单题导航与进度。
  - 集成录音 Hook（开始/暂停/恢复/结束）与 UI 状态提示，保持改动聚焦单文件。
  - 完成答案提交、状态更新与感谢页逻辑，涵盖错误处理与加载反馈。
- 阶段四：GenAI 摘要模块
  - 在 Applicants 页加入 GenAI 按钮与侧边面板骨架，先完成 UI。
  - 接入摘要服务，处理加载、错误、无密钥三种场景，并记录在 README/PRD。
- 阶段五：打磨与交付准备
  - 巡检并统一 Loading/Empty/Error 组件与文案，覆盖主要页面。
  - 规划 Lint/测试策略（如 Vitest 起步或手动测试清单），完善提交前检查流程。
  - 准备示例数据脚本、Demo 演示脚本与文档更新，确保项目可演示。

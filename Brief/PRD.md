ReadySetHire 产品需求文档（PRD）

1. 项目背景与评估范围
ReadySetHire 是 COMP2140/7240 React Web 标准项目，占 React Web Assessment 20%（另含 8% Demo & Code Review）。项目目标是为招聘团队构建一套可扩展的前端应用，覆盖面试模板、题库、候选人管理以及候选人语音答题体验，并预留 GenAI 拓展能力。系统必须依照课程提供的 RESTFul API（https://comp2140a2.uqcloud.net/api）与 Rubric 规范实现，确保演示时具备至少一条可用示例数据。

2. 技术栈与 UI 规范
- 前端框架：React 19 + Vite，使用模块化路由与受控组件。
- 样式系统：TailwindCSS v4.1，按官方最新写法在 `tailwind.config.js` 中声明 `content` 范围，并通过 `plugins: [daisyui]` 集成 DaisyUI；样式入口使用 `@import 'tailwindcss';` 与 `@plugin` 语法组织自定义工具类。
- 组件库：DaisyUI v5.1.14 提供视觉基座（Navbar、Card、Drawer、Badge 等），通过 `data-theme` 或 `theme` 配置统一暗/亮风格；Mantine v8.3.0 用于高交互场景（`MantineProvider`、`Modal`、`Drawer`、`Tabs`、`Notifications` 等），保持 CSS reset 兼容并在顶层用 `MantineProvider defaultColorScheme="light"` 包裹。
- 代码规范：遵循 SOLID、DRY、KISS、可读性原则；以函数式组件 + Hooks 为主，所有 API 调用统一通过服务层。
- 必读文档：所有开发前须复核 `Brief/brief.md`、`Brief/rubric.md`、`Brief/RESTFul.md` 及本 PRD，任何功能变更需同步更新文档。

3. 信息架构与导航
- 全局使用 AppLayout，包含固定 Header、主导航、内容区、Footer，适配桌面与移动端（Drawer 切换导航）。
- 主导航分为 Dashboard、Interviews、Questions、Applicants 四大入口；候选人使用 `/take/:applicantId` 独立路由。
- 支持 404 和空态页面，提供返回首页操作。

4. 核心功能需求与页面实现计划
4.1 Dashboard
- 功能要求：以 DaisyUI 卡片展示关键模块入口、待办提醒与统计摘要（面试数、待处理候选人等），提供快速链接及 GenAI 功能入口。
- 实现计划：
  1. 阶段一交付纯静态页面：卡片、导航按钮、占位统计组件，确保布局在移动/桌面端自适应。
  2. 阶段二接入 API 摘要（面试总数、待处理候选人），引入 Skeleton/Spinner 状态。
  3. 阶段四整合 GenAI 概要入口按钮，触发 Applicants 页面侧边面板。

4.2 面试管理（Interviews）
- 功能要求：列表页显示标题、职位、状态、问题数量、候选人数量及状态分布；提供刷新、创建、编辑、删除及跳转；表单校验必填项并默认 Draft；删除需确认。
- 实现计划：
  1. 阶段一建立路由页骨架，包含 DaisyUI Table/Card 占位、`Create Interview` 按钮。
  2. 阶段二接入 `useInterviewList` 查询：实现加载/空/错误态、手动刷新按钮、统计徽章。
  3. 阶段二新增 Mantine Modal 表单组件：表单字段、校验、成功 toast、关闭后刷新列表。
  4. 阶段二补充编辑功能（路由 `/interviews/:id/edit` 或 Modal，单次提交围绕编辑页），删除确认对话框及 API 错误提示。
  5. 阶段二末尾添加跳转按钮至 Questions/Applicants（携带 interviewId 过滤）。

4.3 题库管理（Questions）
- 功能要求：卡片或表格展示题干、所属面试、难度标签；可按面试筛选、刷新、空态提示；表单校验题干、难度、面试；删除需确认。
- 实现计划：
  1. 阶段一输出静态页面与筛选控件（Mantine Select 占位，DaisyUI Badge 展示难度）。
  2. 阶段二实现 `useQuestionList`：根据选择的 Interview 过滤，提供刷新与错误提示。
  3. 阶段二创建表单组件，包含难度 SegmentedControl（Easy/Intermediate/Advanced），提交后归位。
  4. 阶段二添加编辑路由/Modal，与创建表单复用；实现删除确认（Mantine Modal），支持 API 错误上屏。

4.4 候选人管理（Applicants）
- 功能要求：列表展示候选人姓名、联系方式、状态徽章、所属面试、唯一邀请链接（可复制）；表单包含 Title、Firstname、Surname、Phone、Email、Interview、Status；生成 `/take/:applicantId` 链接；支持 GenAI 摘要和回答查看。
- 实现计划：
  1. 阶段一搭建静态列表与筛选控件，包含 DaisyUI Badge、按钮占位、复制链接图标。
  2. 阶段二实现 `useApplicantList` 数据获取；引入状态分组统计、复制链接功能（使用 `navigator.clipboard.writeText`，提供 Mantine 通知反馈）。
  3. 阶段二完善表单，创建成功后展示生成的链接（Mantine CopyButton），编辑沿用同组件。
  4. 阶段三/四实现查看回答侧 panel（与 GenAI 面板区分）：载入 applicant answers、支持加载/错误态。
  5. 阶段四引入 GenAI 摘要按钮，打开 Mantine Drawer/Modal 展示生成内容（含刷新、无 Key 文案）。

4.5 候选人答题流程（Take Interview）
- 功能要求：欢迎页展示候选人与面试信息；逐题答题流程限制前进；必须录音后才能继续；录音需支持暂停/恢复；提交时写入 `/applicant_answer`，全部完成后更新状态并显示感谢页。
- 实现计划：
  1. 阶段一完成 `/take/:applicantId` 路由静态欢迎页（DaisyUI Hero 组件），含开始按钮与错误占位。
  2. 阶段三接入候选人/题目数据：使用 Loader 或 Suspense 处理加载失败，缺失数据显示错误卡片。
  3. 阶段三实现单题导航组件：题干展示、进度条、`Next` 按钮禁用逻辑（未录音前禁用）。
  4. 阶段三集成自定义 `useAudioRecorder` Hook：封装 MediaRecorder，输出录音状态、Blob URL、错误；UI 使用 DaisyUI Button + Mantine Notifications 反馈。
  5. 阶段三实现提交：将音频 Blob 传入占位转写函数 -> 保存文本到 `/applicant_answer` -> 更新 applicant 状态 -> 进入感谢页；处理 API 错误与重试提示。

4.6 Advanced GenAI
- 功能要求：创意 GenAI 功能，建议在 Applicants 列表中提供候选人回答摘要面板，支持加载/错误状态及手动刷新；缺失 API Key 时展示占位提示。
- 实现计划：
  1. 阶段四创建摘要服务模块：从 `.env.local` 读取密钥，缺失时返回占位结果并在 UI 显示提醒。
  2. 阶段四在 Applicants 页面引入 Mantine Drawer/Modal 组件显示摘要，提供刷新、关闭、加载 Skeleton、错误警示。
  3. 阶段四补充 Dashboard 入口卡片，快捷打开对应候选人摘要。

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
  - 安装并初始化 React Router（`react-router-dom`），搭建基础路由映射。
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
  - Dashboard 卡片提供 GenAI 快捷入口。
- 阶段五：打磨与交付准备
  - 巡检并统一 Loading/Empty/Error 组件与文案，覆盖主要页面。
  - 规划 Lint/测试策略（如 Vitest 起步或手动测试清单），完善提交前检查流程。
  - 准备示例数据脚本、Demo 演示脚本与文档更新，确保项目可演示。

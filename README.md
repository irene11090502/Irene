# Personal Growth Dashboard · 个人成长工作台

一个 Notion 极简风、温柔粉色主题的个人成长记录 Web App，专为教师暑期成长记录设计。
所有数据保存在浏览器 `localStorage`，无任何后端依赖。

## 技术栈

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** + 自定义 Notion 粉色主题
- **Shadcn 风格** 组件（手写，基于 Tailwind）
- **Framer Motion** 动画
- **Lucide React** 图标
- **Zustand** 状态管理（持久化到 localStorage）
- 图片以 **base64** 本地保存

## 快速开始

```bash
npm install
npm run dev      # 开发模式 http://localhost:3000
npm run build    # 生产构建
npm run start    # 启动生产服务
```

> 首次加载会注入一组示例数据（5 周计划 + 部分样例内容 + 例假记录）。
> 数据保存在 localStorage key `pgd-store-v1`，可在浏览器中清除。

## 打包为桌面 App（Electron）

本项目已配置为可一键打包成**可双击打开的桌面程序**（Mac `.app`/`.dmg`、Windows `.exe`）。
原理：Next.js 先静态导出为 `out/` 文件夹，Electron 用内置 http 服务在本地加载它，
**无需启动服务器、完全离线、数据仍在 localStorage**。

```bash
npm install                      # 安装依赖（含 electron / electron-builder）

npm run dist:mac                # 打 Mac 包 → release/Personal Growth Dashboard-*.dmg
npm run dist:win                # 在 Windows 上打 exe 包（mac 上构建 win 需 wine，建议在 Windows 本机执行）
```

打包完成后：

- **Mac**：双击 `release/Personal Growth Dashboard-*.dmg`，把应用拖进「应用程序」即可。
  若系统提示「无法验证开发者」，右键 → 打开，或执行 `xattr -cr "/Applications/Personal Growth Dashboard.app"`。
- **Windows**：运行 `release/Personal Growth Dashboard Setup *.exe` 安装。

> 当前为**未签名**构建，仅供本地使用。对外分发前请用 Apple Developer ID（Mac）
> 或代码签名证书（Windows）签名，并在 `electron-builder.yml` 中配置 `mac.identity` / `win.certificateFile`。

## 目录结构

```
personal-growth-dashboard/
├── app/
│   ├── layout.tsx          # 根布局（metadata + 全局样式）
│   ├── globals.css         # Notion 粉色主题 / CSS 变量
│   └── page.tsx            # 主页面（hydration 守卫 + 布局组合）
├── components/
│   ├── ui/                 # Shadcn 风格基础组件
│   │   ├── button.tsx  card.tsx  input.tsx  textarea.tsx
│   │   ├── badge.tsx  progress.tsx  modal.tsx
│   ├── common/             # 通用组件
│   │   ├── Section.tsx      # 可折叠模块容器
│   │   ├── ImageUpload.tsx  # base64 图片上传/预览
│   │   ├── RichTextEditor.tsx # 富文本编辑器（contentEditable）
│   │   └── LineChart.tsx    # SVG 折线图
│   ├── layout/             # 页面骨架
│   │   ├── DesktopWidget.tsx # 顶部桌面组件（时间/日期/每日金句）
│   │   ├── Sidebar.tsx      # 左侧周导航（新建/删除/重命名/切换）
│   │   └── WeekView.tsx     # 右侧周详情（7 列网格 + 统计 + 例假）
│   ├── week/               # 每日模块
│   │   ├── DayColumn.tsx    # 单日卡片（组合各模块）
│   │   ├── TodoList.tsx     # 待办（拖拽排序 + 优先级）
│   │   ├── StudyModule.tsx  # 学习（生词 / 语法）
│   │   ├── ReadingModule.tsx# 阅读（记录 / 笔记 / 摘抄练字）
│   │   ├── WorkModule.tsx   # 工作（备课/批改/回复学生/自定义）
│   │   ├── TravelModule.tsx # 旅行（目的地/预算/清单）
│   │   ├── MoodModule.tsx   # 情绪记录
│   │   ├── DiaryModule.tsx  # 日记（文字 + 图片）
│   │   ├── WeeklyGoals.tsx  # 本周目标
│   │   └── PeriodModule.tsx # 例假（预测/日历高亮/提醒）
│   └── stats/
│       └── GrowthStats.tsx  # 成长统计（进度条 + 折线图）
└── lib/
    ├── types.ts            # 领域类型定义
    ├── store.ts            # Zustand 全局 store（localStorage 持久化）
    ├── mockData.ts         # 示例数据生成器
    ├── date.ts             # 日期工具（周一对齐 / 标签 / 预测）
    ├── quotes.ts           # 每日金句（中 + 英）
    └── utils.ts            # cn() / uid()
```

## 功能一览

- **左侧周导航**：按年分组，新建 / 删除 / 重命名周计划，自动生成本周 7 天日期。
- **7 列日视图**：周一～周日独立卡片，每列包含：
  - 待办：增删改、勾选、拖拽排序、优先级
  - 学习：生词（错词标记 / 完成）、语法
  - 阅读：阅读记录、富文本读书笔记、摘抄练字图片
  - 工作：备课 / 批改 / 回复学生 / 自定义，勾选完成
  - 旅行：目的地、预算、旅行清单
  - 情绪：😀🙂😔😡😴 + 备注
  - 日记：文字 + 图片上传/预览/历史
- **本周目标**：可勾选、编辑、自定义。
- **例假记录**：开始/结束/周期，自动预测下次，日历高亮，临近提醒。
- **成长统计**：完成率、连续打卡、阅读页数、学习/工作时长、生词数量，进度条 + 折线图。
- **桌面组件**：实时时间、日期、每日金句（中英），每日自动更新。

## 说明

- 不连接任何数据库，所有状态由 Zustand + `persist` 中间件写入 `localStorage`。
- 图片上传经 `FileReader` 转为 base64 后保存（大图会占用较多 localStorage 配额，建议适度使用）。
- “工作时长”按已完成工作任务 × 30 分钟估算；“学习时长”取自阅读累计分钟。

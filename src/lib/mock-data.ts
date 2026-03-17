/**
 * 博客模拟数据 — 部署验证阶段使用，后续接入 Supabase 后替换
 */

export interface Post {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: Author;
  tags: string[];
  coverImage?: string;
  createdAt: string;
  views: number;
  likes: number;
  comments: number;
}

export interface Author {
  name: string;
  avatar: string;
  title: string;
}

export const TAGS = [
  "全部", "前端", "后端", "AI", "架构", "DevOps", "移动端", "数据库", "开源"
];

const authors: Author[] = [
  { name: "张三丰", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix", title: "全栈工程师" },
  { name: "李四光", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka", title: "前端架构师" },
  { name: "王五岳", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Dusty", title: "AI 算法工程师" },
  { name: "赵六合", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Mimi", title: "后端开发工程师" },
];

export const POSTS: Post[] = [
  {
    id: "1",
    title: "2026 年前端框架趋势：React Server Components 彻底改变了什么？",
    summary: "深入分析 RSC 对前端开发范式的影响，从数据获取到状态管理，再到部署方式的全面变革。本文结合实战项目经验，带你看清前端的下一个十年。",
    content: `## 引言\n\nReact Server Components（RSC）已经不再是实验性功能。2026 年，几乎所有新项目都在拥抱这一范式。\n\n## RSC 改变了什么？\n\n### 1. 数据获取不再是前端的事\n\n\`\`\`tsx\n// 服务端组件直接查数据库\nasync function PostList() {\n  const posts = await db.post.findMany();\n  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;\n}\n\`\`\`\n\n### 2. Bundle Size 大幅缩减\n\n服务端组件的代码不会发送到浏览器，这意味着我们可以自由使用 \`dayjs\`、\`lodash\` 等库而不影响首屏性能。\n\n### 3. 状态管理简化\n\n全局状态管理器（Redux、Zustand）的使用场景大幅缩减，因为大部分状态直接在服务端解决。\n\n## 实战建议\n\n- 新项目直接用 Next.js App Router\n- 旧项目渐进式迁移\n- 优先考虑服务端数据获取\n\n## 总结\n\nRSC 不是银弹，但它确实解决了前端领域长久以来的痛点。`,
    author: authors[1],
    tags: ["前端", "架构"],
    createdAt: "2026-03-15T10:30:00Z",
    views: 12580,
    likes: 342,
    comments: 67,
  },
  {
    id: "2",
    title: "用 Claude Code 搭建全栈应用：从零到部署只要 30 分钟",
    summary: "手把手教你用 AI 辅助编程工具 Claude Code 搭建一个完整的博客系统，包含前端、后端、数据库和一键部署。适合想快速上手 AI 编程的开发者。",
    content: `## 为什么选 Claude Code？\n\n和 Cursor、Copilot 不同，Claude Code 是命令行工具，更适合全栈项目。\n\n## 搭建步骤\n\n### Step 1: 初始化项目\n\n\`\`\`bash\nnpx create-next-app@latest my-blog --typescript --tailwind\ncd my-blog\n\`\`\`\n\n### Step 2: 让 Claude Code 生成代码\n\n直接告诉它你要什么：\n\n> "帮我创建一个博客系统，包含文章列表、详情页、标签筛选"\n\n### Step 3: 部署到 Vercel\n\n\`\`\`bash\ngit push origin main\n# Vercel 自动部署\n\`\`\`\n\n## 总结\n\nAI 编程工具让全栈开发的门槛大幅降低。`,
    author: authors[0],
    tags: ["AI", "前端", "后端"],
    createdAt: "2026-03-14T08:15:00Z",
    views: 8930,
    likes: 256,
    comments: 43,
  },
  {
    id: "3",
    title: "PostgreSQL 17 新特性：JSON 性能提升 300%，告别 MongoDB？",
    summary: "PostgreSQL 17 在 JSON 处理、并行查询和逻辑复制方面带来了巨大提升。本文深入测试各项新特性的实际性能表现。",
    content: `## PostgreSQL 17 核心更新\n\n### JSON 处理性能飞跃\n\n新增 \`JSON_TABLE\` 函数，性能比旧版 \`jsonb_to_recordset\` 快 3 倍。\n\n\`\`\`sql\nSELECT * FROM JSON_TABLE(\n  '[{"name":"Alice","age":30},{"name":"Bob","age":25}]',\n  '$[*]' COLUMNS(\n    name TEXT PATH '$.name',\n    age INT PATH '$.age'\n  )\n);\n\`\`\`\n\n### 并行查询增强\n\n并行 Hash Join 和 Merge Join 现在支持更多场景。\n\n### 逻辑复制改进\n\n支持 DDL 复制，不再只能复制 DML。\n\n## 基准测试\n\n| 场景 | PG 16 | PG 17 | 提升 |\n|------|-------|-------|------|\n| JSON 查询 | 120ms | 38ms | 3.2x |\n| 并行聚合 | 450ms | 180ms | 2.5x |\n\n## 总结\n\n对于 95% 的业务场景，PostgreSQL 已经足以替代 MongoDB。`,
    author: authors[3],
    tags: ["数据库", "后端"],
    createdAt: "2026-03-13T14:20:00Z",
    views: 6720,
    likes: 198,
    comments: 31,
  },
  {
    id: "4",
    title: "LangGraph + Claude：构建可靠的多 Agent 系统实战指南",
    summary: "多 Agent 系统不再是概念验证。本文分享生产环境中使用 LangGraph 编排 Agent 团队的经验，包括状态管理、错误恢复和人工审批节点设计。",
    content: `## 多 Agent 系统的挑战\n\n1. **状态管理复杂** — 多个 Agent 共享上下文\n2. **错误恢复** — 单个 Agent 失败不应拖垮整个流程\n3. **人工介入** — 关键步骤需要审批\n\n## LangGraph 解决方案\n\n\`\`\`python\nfrom langgraph.graph import StateGraph\n\ngraph = StateGraph(AgentState)\ngraph.add_node("researcher", researcher_agent)\ngraph.add_node("coder", coder_agent)\ngraph.add_node("reviewer", reviewer_agent)\n\ngraph.add_edge("researcher", "coder")\ngraph.add_edge("coder", "reviewer")\ngraph.add_conditional_edges("reviewer", should_approve)\n\`\`\`\n\n## 生产经验总结\n\n- 每个 Agent 超时时间不超过 5 分钟\n- 重要步骤设置人工审批\n- 使用 checkpoint 做断点恢复\n\n## 总结\n\nLangGraph 让多 Agent 编排变得可控且可靠。`,
    author: authors[2],
    tags: ["AI", "架构", "后端"],
    createdAt: "2026-03-12T09:45:00Z",
    views: 15320,
    likes: 489,
    comments: 82,
  },
  {
    id: "5",
    title: "Docker Compose 到 Kubernetes：小团队的渐进式容器化之路",
    summary: "不是所有团队都需要 K8s。本文分享一个 5 人团队从单机 Docker Compose 逐步迁移到 K8s 的真实历程，包括踩过的坑和省钱方案。",
    content: `## 起点：Docker Compose\n\n\`\`\`yaml\nservices:\n  web:\n    build: .\n    ports:\n      - "3000:3000"\n  db:\n    image: postgres:16\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n\`\`\`\n\n## 第一步：加监控\n\n引入 Prometheus + Grafana，容器化部署。\n\n## 第二步：加 CI/CD\n\nGitHub Actions 自动构建镜像，推送到 GHCR。\n\n## 第三步：迁移到 K3s\n\n不用完整 K8s，K3s 足够小团队使用。\n\n## 成本对比\n\n| 方案 | 月成本 |\n|------|--------|\n| 单机 Compose | ¥200 |\n| K3s 3 节点 | ¥600 |\n| 托管 K8s | ¥2000+ |\n\n## 总结\n\n按需选择，不盲目上 K8s。`,
    author: authors[0],
    tags: ["DevOps", "架构"],
    createdAt: "2026-03-11T16:00:00Z",
    views: 4560,
    likes: 134,
    comments: 22,
  },
  {
    id: "6",
    title: "Swift 6 并发模型：actor 和 async/await 的最佳实践",
    summary: "Swift 6 强制严格并发检查，本文教你如何平滑迁移旧代码，以及在新项目中正确使用 actor 隔离和结构化并发。",
    content: `## Swift 6 的重大变化\n\nStrict concurrency 从警告变为错误，所有跨隔离域的数据传递必须显式声明。\n\n## Actor 基础\n\n\`\`\`swift\nactor DataStore {\n    private var items: [Item] = []\n    \n    func add(_ item: Item) {\n        items.append(item)\n    }\n    \n    func getAll() -> [Item] {\n        items\n    }\n}\n\`\`\`\n\n## 迁移建议\n\n1. 先开启 strict concurrency 警告\n2. 逐个修复 Sendable 问题\n3. 用 \`@MainActor\` 标注 UI 层代码\n\n## 总结\n\nSwift 6 的并发模型虽然学习曲线陡峭，但带来了真正的线程安全。`,
    author: authors[1],
    tags: ["移动端"],
    createdAt: "2026-03-10T11:30:00Z",
    views: 3210,
    likes: 87,
    comments: 15,
  },
];

export function getPostById(id: string): Post | undefined {
  return POSTS.find(p => p.id === id);
}

export function getPostsByTag(tag: string): Post[] {
  if (tag === "全部") return POSTS;
  return POSTS.filter(p => p.tags.includes(tag));
}

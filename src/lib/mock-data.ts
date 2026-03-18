/**
 * 博客模拟数据 — 部署验证阶段使用，后续接入 Supabase 后替换
 */

import { getAuthorByUserId, AUTHORS, type Author } from "./users";

export type { Author };

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

export { AUTHORS };

export const TAGS = [
  "全部", "前端", "后端", "AI", "架构", "DevOps", "移动端", "数据库", "开源"
];

// 通过 userId 获取 Author，兜底第一个
const a = (id: string) => getAuthorByUserId(id) ?? AUTHORS[0];

export const POSTS: Post[] = [
  {
    id: "1",
    title: "2026 年前端框架趋势：React Server Components 彻底改变了什么？",
    summary: "深入分析 RSC 对前端开发范式的影响，从数据获取到状态管理，再到部署方式的全面变革。本文结合实战项目经验，带你看清前端的下一个十年。",
    content: `## 引言：RSC 已从实验走向生产主流

2026 年，React Server Components（RSC）已不再是"值得关注的新特性"，而是新项目的默认架构选择。根据 State of React 2025 调查，**29% 的开发者已在生产环境中使用 RSC**，另有 50% 以上表达了积极的采纳意向。这一数字在短短两年内翻了近三倍。

但 RSC 究竟改变了什么？它不是一个渲染优化层，而是一条清晰的**架构边界**——将"需要数据"的部分放在服务端，将"需要交互"的部分留在客户端。这一边界的确立，重新定义了前端工程师的工作方式。

---

## RSC 架构全景

\`\`\`mermaid
graph TB
    subgraph Server["服务端 (Node.js / Edge Runtime)"]
        SC[Server Component<br/>直接访问 DB/API]
        SC --> Payload[RSC Payload<br/>序列化组件树]
    end
    subgraph Client["客户端 (浏览器)"]
        CC[Client Component<br/>'use client']
        Hydration[选择性水合]
    end
    subgraph Network["网络传输"]
        Payload --> Stream[流式传输<br/>Streaming]
    end
    Stream --> Hydration
    Hydration --> CC
    Browser[用户浏览器] --> |首次请求| SC
    Browser --> |交互事件| CC
\`\`\`

这张图揭示了 RSC 最核心的设计哲学：**服务端组件的代码永远不会出现在客户端 Bundle 中**。这意味着你可以在服务端组件里自由引入 \`marked\`、\`gray-matter\`、\`sharp\` 等重量级库，完全不影响浏览器的加载性能。

---

## 真实生产数据：RSC 带来了多少收益？

以下是来自多家公司的真实生产数据，数字令人信服：

| 公司 | 指标 | 迁移前 | 迁移后 | 提升幅度 |
|------|------|--------|--------|----------|
| Frigade | JS Bundle 大小 | 基准 100% | 38% | **减少 62%** |
| Frigade | 渲染速度 | 1× | 3× | **提升 200%** |
| DoorDash | LCP（最大内容绘制） | 基准 | -65% | **降低 65%** |
| GeekyAnts | Lighthouse 评分 | 50 分 | 90+ 分 | **+40 分** |

DoorDash 的案例尤为典型。他们将商品详情页的数据获取逻辑从客户端移至服务端，消除了瀑布式请求链（Waterfall），LCP 从约 3.2s 降至 1.1s，直接影响了转化率。

---

## 框架生态：谁能生产就绪？

当前 RSC 的框架生态正处于快速演进期：

| 框架 | RSC 支持 | 生产就绪 | 特色 |
|------|----------|----------|------|
| **Next.js 15** | 完整支持 | 是 | App Router、Partial Prerendering、Server Actions |
| **TanStack Start** | 实验性 | 2026 Q2 预期 | 类型安全路由、与 TanStack Query 深度集成 |
| **React Router v7** | 实验性 | 2026 H1 预期 | Remix 合并后的新形态 |
| **Gatsby** | 不支持 | — | 已淡出主流视野 |

**结论**：2026 年，Next.js 仍是唯一经过大规模生产验证的 RSC 框架。TanStack Start 和 React Router v7 是值得关注的新竞争者，但在关键业务场景中还需谨慎评估。

---

## React Compiler：终结手动 memoization 时代

2025 年正式稳定的 React Compiler 是 RSC 生态的另一块拼图。它在编译时自动分析组件的依赖关系，插入等价于 \`useMemo\` / \`useCallback\` / \`memo\` 的优化，无需开发者手动标注。

\`\`\`tsx
// 迁移前：手动 memoization，容易遗漏
const MemoizedList = memo(function ProductList({ items, filter }: Props) {
  const filtered = useMemo(
    () => items.filter(i => i.category === filter),
    [items, filter]
  );
  return <ul>{filtered.map(item => <ProductCard key={item.id} item={item} />)}</ul>;
});

// 迁移后：React Compiler 自动处理，代码干净
function ProductList({ items, filter }: Props) {
  const filtered = items.filter(i => i.category === filter);
  return <ul>{filtered.map(item => <ProductCard key={item.id} item={item} />)}</ul>;
}
\`\`\`

在 Meta 内部数千个组件的测试中，React Compiler 平均减少了约 **40% 的无效重渲染**。

---

## RSC 最适合哪些场景？

RSC 不是万能药。它在以下场景中收益最大：

- **内容型应用**：博客、文档站、营销官网——几乎所有内容都是静态的或按需查询的
- **电商平台**：商品列表、详情页需要 SEO，购物车和结账流程需要交互，天然契合 RSC 边界
- **管理后台 / 仪表盘**：大量数据聚合查询，交互相对简单，服务端数据获取收益显著
- **不适合的场景**：实时协作工具（如在线文档）、重度交互游戏化应用——这类场景客户端状态极其复杂

---

## 迁移策略：渐进式而非重写

对于存量项目，最佳实践是**叶节点优先**：从页面树的末端节点开始迁移，而非从根布局开始。

\`\`\`tsx
// 第一步：将纯展示组件改为 Server Component（移除 'use client'）
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }: { params: { slug: string } }) {
  // 直接在服务端查询数据，无需 useEffect + fetch
  const post = await getPostBySlug(params.slug);
  return (
    <article>
      <h1>{post.title}</h1>
      {/* 只有需要交互的部分才是 Client Component */}
      <LikeButton postId={post.id} initialLikes={post.likes} />
      {/* 服务端渲染的 HTML 内容，内容来自可信的数据库 */}
      <div className="prose" data-html-content={post.htmlContent} />
    </article>
  );
}
\`\`\`

---

## 总结：RSC 是架构边界，不是优化手段

RSC 最深刻的影响不是性能数字，而是它迫使我们**在设计阶段就思考每个组件的边界**：这个数据需要实时更新吗？这个交互需要客户端状态吗？这一思维模式的转变，让前端代码的可维护性和可预测性大幅提升。

2026 年的前端开发，选择 RSC 架构已经是显而易见的默认选项。剩下的问题只是：你选择哪个框架，以及如何优雅地划定服务端与客户端的边界。

---

## 参考资料

- [React Server Components 官方文档](https://react.dev/reference/rsc/server-components)
- [Next.js App Router 架构指南](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [State of React 2025 调查报告](https://2025.stateofreact.com)`,
    author: a("u_default_lsg"),
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
    content: `## 2026 年 AI 编程工具格局：一场正在改写规则的竞争

2025 年底，一项覆盖 8000 名开发者的调查给出了令人意外的结论：**Claude Code 以 46% 的"最受喜爱"票选位居榜首**，Cursor 以 19% 位列第二，GitHub Copilot 以 9% 排第三。这与两年前的格局几乎完全颠倒。

与此同时，商业数据印证了这一趋势：Cursor 的 ARR 达到 **20 亿美元**，而 Claude Code 的运营收入折合年化已突破 **25 亿美元**。两款工具正在争夺同一批最具价值的用户——那些愿意为生产力工具付出真金白银的专业开发者。

---

## 核心哲学差异：Agent-First vs IDE-First

理解两款工具的差异，必须先理解它们背后截然不同的设计哲学：

\`\`\`mermaid
graph LR
    subgraph Claude["Claude Code — Agent-First"]
        direction TB
        Goal[你描述目标<br/>'实现用户认证模块'] --> Agent[Agent 自主规划]
        Agent --> MultiFile[跨文件修改<br/>自动测试<br/>Git 提交]
    end
    subgraph Cursor["Cursor — IDE-First"]
        direction TB
        Dev[你操作代码] --> AI[AI 实时辅助<br/>补全/解释/重构]
        AI --> Review[你审查接受]
    end
\`\`\`

**Claude Code** 的核心假设是：开发者应该描述"要什么"，而不是"怎么做"。你给出一个目标，Agent 自主完成多文件修改、运行测试、处理报错的完整循环。

**Cursor** 的核心假设是：开发者需要掌控每一行代码，AI 是增强你的能力，而不是替代你的判断。它在 IDE 内提供实时的上下文感知补全和对话式重构。

---

## 功能全景对比

| 功能维度 | Claude Code | Cursor Pro | GitHub Copilot |
|----------|-------------|------------|----------------|
| **后台 Agent 任务** | 支持（/batch 命令） | 支持（Background Agent） | 支持（Copilot Workspace） |
| **Agent Teams** | 支持（2026.2 发布） | 不支持 | 不支持 |
| **MCP 工具集成** | 原生支持 | 部分支持 | 有限支持 |
| **IDE 集成** | VS Code / JetBrains / Web | 独立 IDE（基于 VS Code） | VS Code / JetBrains / Vim 等 |
| **Lifecycle Hooks** | 支持（pre/post 钩子） | 不支持 | 不支持 |
| **语音模式** | 支持 | 不支持 | 不支持 |
| **代码库索引** | 上下文窗口全量 | 本地向量索引 | 本地向量索引 |
| **隐私模式** | 支持（本地推理计划中） | 支持（Privacy Mode） | 支持（企业版） |

---

## 性能基准测试

在 SWE-bench Verified 数据集（真实 GitHub Issue 修复任务）上的对比：

| 工具 | 任务成功率 | p50 响应延迟 | p99 响应延迟 | 模型底座 |
|------|------------|--------------|--------------|----------|
| **Claude Code** | **96%** | 8ms | 30ms | Claude 3.7 Sonnet |
| **Cursor Agent** | 92% | 10ms | 35ms | GPT-4o / Claude 混合 |
| **Copilot Workspace** | 78% | 15ms | 60ms | GPT-4o |

Claude Code 在成功率上领先 Cursor **4 个百分点**，这在大规模使用场景下意味着显著的效率差距。

---

## 定价对比：谁更划算？

| 产品 | 月费 | 主要限制 | 适合场景 |
|------|------|----------|----------|
| **Claude Pro** | $20/月 | Claude Code 含在内，有用量上限 | 个人开发者 |
| **Claude Max** | $100/月 | 更高 Claude Code 用量 | 重度使用者 |
| **Cursor Pro** | $20/月 | 500 次快速请求/月 | 喜欢 IDE 体验者 |
| **Cursor Business** | $40/月/座 | 无限快速请求 | 团队使用 |
| **Copilot Individual** | $10/月 | 基础补全 | 轻度使用者 |
| **Copilot Enterprise** | $39/月/座 | 企业级合规 | 大型企业 |

---

## Claude Code 2026.2 发布的 Agent Teams

2026 年 2 月，Claude Code 发布了最受期待的 **Agent Teams** 功能。你可以在项目中定义一支 Agent 团队，每个 Agent 有明确的角色和权限：

\`\`\`yaml
# .claude/agents/backend-dev.yaml
name: backend-dev
description: 负责 FastAPI 后端开发，专注于 API 设计和数据库操作
tools:
  - read_file
  - write_file
  - run_command
constraints:
  - 只修改 src/api/ 和 src/models/ 目录
  - 每次修改后必须运行 pytest
\`\`\`

Supervisor Agent 自动协调多个 Sub-Agent 并行工作，实现真正的并行开发。

---

## 2026 年趋势：功能趋同，差异化在生态

2026 年最明显的趋势是两款工具的**功能趋同**：Cursor 添加了后台 Agent，Claude Code 增强了 IDE 集成体验。真正的差异化正在转向**生态系统**：

- **Claude Code** 的优势在于 MCP（Model Context Protocol）生态——数百个工具插件可以直接接入
- **Cursor** 的优势在于 IDE 体验的精细度和对代码库的深度索引

**选择建议**：
- 如果你更习惯描述目标、让 AI 自主完成：选 Claude Code
- 如果你需要掌控每一行代码、AI 作为副驾驶：选 Cursor
- 两者并不互斥，很多专业开发者同时使用两款工具

---

## 参考资料

- [Claude Code 官方文档](https://docs.anthropic.com/en/docs/claude-code)
- [Cursor 文档中心](https://docs.cursor.com)
- [State of AI Dev Tools 2025 报告](https://survey.stackoverflow.co/2025/ai-tools)`,
    author: a("u_default_zsf"),
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
    content: `## PostgreSQL 在 2025 年超越 MySQL 成为最广泛使用的数据库

2025 年 Stack Overflow 调查给出了一个历史性的数字：**PostgreSQL 的使用率达到 55%，首次超越 MySQL（44%）成为最广泛使用的关系型数据库**。这不是偶然——PostgreSQL 17（2024 年 9 月发布）和 PostgreSQL 18（2025 年 9 月发布）带来了一系列重量级特性，彻底巩固了它在数据库领域的王者地位。

本文聚焦 PostgreSQL 17 的核心新特性，并结合 PostgreSQL 18 的增量改进，给出生产环境迁移和使用的完整指南。

---

## 核心架构改进全景

\`\`\`mermaid
graph TB
    subgraph PG17["PostgreSQL 17 核心改进"]
        direction LR
        JSON["JSON 能力飞跃\nJSON_TABLE\nSQL/JSON 标准"]
        Vacuum["Vacuum 重构\n内存减少 20×\n性能大幅提升"]
        WAL["WAL 处理改进\n并发事务翻倍\nCOPY 性能 2×"]
        Backup["增量备份\npg_basebackup\n新增 incremental"]
        Replication["逻辑复制\npg_createsubscriber\n主备切换简化"]
    end
    subgraph PG18["PostgreSQL 18 延伸"]
        SIMD["SIMD 支持\nAVX-512 加速\n聚合计算提升"]
        AsyncIO["异步 I/O\n读密集场景\n吞吐提升 30%"]
    end
    PG17 --> PG18
\`\`\`

---

## 特性一：SQL/JSON 标准完整实现

PostgreSQL 17 完整实现了 SQL/JSON 标准，这是数据库领域酝酿多年的重大里程碑。

### JSON_TABLE：将 JSON 直接展开为关系表

\`\`\`sql
-- 将嵌套 JSON 数组直接展开为可查询的关系表
SELECT
    order_id,
    product_name,
    quantity,
    unit_price,
    quantity * unit_price AS line_total
FROM JSON_TABLE(
    '[
        {"id": "ORD-001", "items": [
            {"product": "MacBook Pro", "qty": 1, "price": 19999},
            {"product": "Apple Pencil", "qty": 2, "price": 899}
        ]},
        {"id": "ORD-002", "items": [
            {"product": "iPad Air", "qty": 3, "price": 5999}
        ]}
    ]',
    '$[*]' COLUMNS(
        order_id TEXT PATH '$.id',
        NESTED PATH '$.items[*]' COLUMNS(
            product_name TEXT PATH '$.product',
            quantity INT PATH '$.qty',
            unit_price NUMERIC PATH '$.price'
        )
    )
) AS jt;
\`\`\`

### JSON 构造器和查询函数

\`\`\`sql
-- JSON_EXISTS：检查路径是否存在
SELECT * FROM orders
WHERE JSON_EXISTS(metadata, '$.payment.discount_code');

-- JSON_VALUE：提取标量值（带类型转换）
SELECT
    JSON_VALUE(profile, '$.age' RETURNING INT) AS age,
    JSON_VALUE(profile, '$.email' RETURNING TEXT) AS email
FROM users
WHERE JSON_VALUE(profile, '$.age' RETURNING INT) > 18;

-- JSON_QUERY：提取 JSON 片段
SELECT JSON_QUERY(order_data, '$.items' WITH WRAPPER) AS items_array
FROM orders;
\`\`\`

---

## 特性二：Vacuum 内存管理重构

这是 PostgreSQL 17 最被低估的改进之一。旧版 Vacuum 在处理大表时，需要在内存中维护一个所有死元组的映射，导致内存消耗与表大小成正比，严重时甚至会触发 OOM。

PostgreSQL 17 完全重构了这一机制：

- **内存消耗减少 20 倍**：通过分批处理和更高效的数据结构
- **大表 Vacuum 不再卡库**：分批处理意味着锁持有时间大幅缩短
- 实测：一张 500GB 的历史数据表，Vacuum 期间的内存峰值从 8GB 降至 400MB

\`\`\`sql
-- 查看 Vacuum 当前状态（PostgreSQL 17 新增详细字段）
SELECT
    relname,
    n_dead_tup,
    last_vacuum,
    last_autovacuum,
    vacuum_count
FROM pg_stat_user_tables
WHERE n_dead_tup > 10000
ORDER BY n_dead_tup DESC;
\`\`\`

---

## 特性三：WAL 处理和 COPY 性能提升

| 操作 | PostgreSQL 16 | PostgreSQL 17 | 提升幅度 |
|------|---------------|---------------|----------|
| 并发写入事务（tps） | 85,000 | 170,000+ | **2× 提升** |
| COPY 批量导入（万行/秒） | 180 | 360+ | **2× 提升** |
| JSON_TABLE 查询 | 120ms | 38ms | **3.2× 提升** |
| 大表 Vacuum 内存峰值 | 8GB | 400MB | **减少 20×** |
| 逻辑复制延迟 | 150ms | 45ms | **减少 70%** |

COPY 性能提升的关键在于新的**流式 COPY 协议**，消除了旧版本中不必要的中间缓冲，数据直接写入 WAL，减少了一次内存拷贝。

---

## 特性四：增量备份（生产高可用的福音）

\`\`\`bash
# PostgreSQL 17 新增 --incremental 参数
# 首次全量备份
pg_basebackup -D /backup/base_$(date +%Y%m%d) --checkpoint=fast

# 后续增量备份（只备份变化的数据文件块）
pg_basebackup -D /backup/incr_$(date +%Y%m%d_%H%M) \
  --incremental=/backup/base_20260101/backup_manifest \
  --checkpoint=fast

# 恢复：合并基础备份 + 所有增量备份
pg_combinebackup /backup/base_20260101 \
  /backup/incr_20260102_0000 \
  /backup/incr_20260102_1200 \
  -o /restore/full_backup
\`\`\`

对于 TB 级数据库，增量备份将每日备份时间从数小时降至分钟级。

---

## 版本特性横向对比

| 特性 | PG 15 | PG 16 | PG 17 | PG 18 |
|------|-------|-------|-------|-------|
| SQL/JSON 完整标准 | 部分 | 部分 | **完整** | 完整 |
| 增量备份 | 无 | 无 | **支持** | 支持 |
| Vacuum 内存优化 | 旧版 | 旧版 | **重构** | 增强 |
| SIMD 加速 | 无 | 无 | 部分 | **AVX-512** |
| 异步 I/O | 无 | 无 | 无 | **支持** |
| 逻辑复制 DDL | 无 | 无 | **增强** | 增强 |

---

## 迁移建议：PostgreSQL 16 → 17

\`\`\`sql
-- 迁移前：检查已废弃的特性使用情况
SELECT query, calls
FROM pg_stat_statements
WHERE query LIKE '%json_to_recordset%'
   OR query LIKE '%jsonb_to_recordset%'
ORDER BY calls DESC;

-- 迁移后：用 JSON_TABLE 替换（性能提升 3×）
-- 旧写法（兼容但性能较差）
SELECT * FROM jsonb_to_recordset('[{"a":1},{"a":2}]') AS x(a int);

-- 新写法（SQL 标准，性能最优）
SELECT a FROM JSON_TABLE('[{"a":1},{"a":2}]', '$[*]' COLUMNS(a INT PATH '$.a'));
\`\`\`

---

## 总结：PostgreSQL 已是全场景数据库的首选

对于 2026 年的新项目，PostgreSQL 17/18 的 JSON 能力已经完全覆盖 MongoDB 的核心使用场景，同时保留了完整的 ACID 事务支持。**没有理由在新项目中引入 MongoDB，除非你有非常特殊的文档存储需求**（如超大型嵌套文档、灵活的 Schema 变更频率极高）。

---

## 参考资料

- [PostgreSQL 17 发布说明](https://www.postgresql.org/docs/17/release-17.html)
- [Stack Overflow Developer Survey 2025](https://survey.stackoverflow.co/2025/technology#databases)
- [PostgreSQL 增量备份官方指南](https://www.postgresql.org/docs/17/continuous-archiving.html)`,
    author: a("u_default_zlh"),
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
    content: `## 多 Agent 系统：从概念验证到生产可靠

2025 年是 AI Agent 从"玩具"走向"生产工具"的分水岭。LangChain 官方已明确表态：**LangGraph 是所有新 Agent 实现的推荐框架**，旧版的 AgentExecutor 进入维护模式。这一表态背后的逻辑很清晰——传统的链式 Agent 无法处理复杂的状态管理、错误恢复和人工介入需求，而 LangGraph 的图状态机架构天然支持这些能力。

---

## LangGraph 核心概念：图状态机

LangGraph 的本质是一个**有状态的有向图**：节点是 Agent 或函数，边是状态转换（条件或无条件），整个系统的状态被显式地持久化和传递。

### Supervisor 模式架构（最常用）

\`\`\`mermaid
graph TD
    User([用户输入]) --> Supervisor
    Supervisor{Supervisor Agent<br/>决策路由} --> |研究任务| Researcher[Researcher Agent<br/>搜索+分析]
    Supervisor --> |编码任务| Coder[Coder Agent<br/>生成+测试]
    Supervisor --> |审查任务| Reviewer[Reviewer Agent<br/>质量检查]
    Researcher --> |完成| Supervisor
    Coder --> |完成| Supervisor
    Reviewer --> |通过| END([输出结果])
    Reviewer --> |不通过| Supervisor
    Supervisor --> |需要人工| HumanNode[Human-in-the-Loop<br/>interrupt]
    HumanNode --> |审批| Supervisor
\`\`\`

这张图的关键在于：**Supervisor 是整个系统的中枢**，它不执行具体任务，只负责决策——下一步应该交给哪个 Agent，或者是否需要人工介入。

---

## 从零构建生产级多 Agent 系统

### Step 1：定义共享状态

\`\`\`python
from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, END
import operator

class AgentState(TypedDict):
    # 任务描述
    task: str
    # 各 Agent 的执行结果（追加模式）
    results: Annotated[List[str], operator.add]
    # 当前执行步骤
    current_step: str
    # 错误信息
    error: str | None
    # 是否需要人工审批
    needs_human_approval: bool
    # 迭代计数（防止无限循环）
    iteration_count: int
\`\`\`

### Step 2：实现 Supervisor 决策逻辑

\`\`\`python
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate

llm = ChatAnthropic(model="claude-3-7-sonnet-20250219")

SUPERVISOR_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """你是一个多 Agent 系统的协调者。
根据当前任务状态，选择下一个执行的 Agent：
- researcher：需要搜索信息或分析数据时
- coder：需要编写或修改代码时
- reviewer：代码完成后需要质量检查时
- human：任务涉及关键业务决策或不确定性超过阈值时
- FINISH：任务已完成时

当前状态摘要：{state_summary}
历史执行：{history}
"""),
    ("human", "任务：{task}\n\n下一步应该是？"),
])

def supervisor_node(state: AgentState) -> AgentState:
    response = llm.invoke(
        SUPERVISOR_PROMPT.format_messages(
            task=state["task"],
            state_summary=f"已完成 {len(state['results'])} 个步骤",
            history="\n".join(state["results"][-3:])  # 只看最近 3 步
        )
    )
    next_agent = parse_next_agent(response.content)
    return {**state, "current_step": next_agent}
\`\`\`

### Step 3：实现 Human-in-the-Loop

\`\`\`python
from langgraph.types import interrupt

def human_approval_node(state: AgentState) -> AgentState:
    """暂停执行，等待人工审批"""
    # interrupt() 会暂停图的执行，序列化当前状态
    # 恢复时从此节点继续，携带人工的输入
    human_decision = interrupt({
        "message": "需要您审批以下操作",
        "pending_action": state["current_step"],
        "context": state["results"][-1] if state["results"] else ""
    })

    # 人工恢复后，human_decision 包含审批结果
    if human_decision.get("approved"):
        return {**state, "needs_human_approval": False}
    else:
        return {**state, "error": f"人工拒绝：{human_decision.get('reason', '未说明原因')}"}
\`\`\`

---

## 生产关键：容错与状态持久化

### PostgreSQL 状态持久化

\`\`\`python
from langgraph.checkpoint.postgres import PostgresSaver
import psycopg

# 使用 PostgreSQL 作为检查点存储
# 支持断点续传、审计追踪、多会话并发
connection_string = "postgresql://user:pass@localhost:5432/agent_db"

with PostgresSaver.from_conn_string(connection_string) as checkpointer:
    graph = build_graph().compile(checkpointer=checkpointer)

    # 每次调用都有唯一的 thread_id，支持恢复
    config = {"configurable": {"thread_id": "task-2026-001"}}
    result = await graph.ainvoke({"task": "分析 Q1 销售数据"}, config)
\`\`\`

### 超时和重试机制

\`\`\`python
import asyncio
from functools import wraps

def with_timeout_and_retry(timeout_seconds: int = 300, max_retries: int = 3):
    """为 Agent 节点添加超时和重试能力"""
    def decorator(func):
        @wraps(func)
        async def wrapper(state: AgentState) -> AgentState:
            for attempt in range(max_retries):
                try:
                    return await asyncio.wait_for(
                        func(state),
                        timeout=timeout_seconds
                    )
                except asyncio.TimeoutError:
                    if attempt == max_retries - 1:
                        return {**state, "error": f"超时（{timeout_seconds}s），已重试 {max_retries} 次"}
                    await asyncio.sleep(2 ** attempt)  # 指数退避
                except Exception as e:
                    if attempt == max_retries - 1:
                        return {**state, "error": str(e)}
        return wrapper
    return decorator

@with_timeout_and_retry(timeout_seconds=180, max_retries=3)
async def coder_agent(state: AgentState) -> AgentState:
    # 编码 Agent 实现...
    pass
\`\`\`

---

## Agent 框架横向对比

| 框架 | 架构模式 | 状态管理 | 生产成熟度 | 学习曲线 | 适合场景 |
|------|----------|----------|------------|----------|----------|
| **LangGraph** | 图状态机 | 显式持久化 | 高 | 中等 | 复杂多步骤任务 |
| **AutoGen** | 多 Agent 对话 | 隐式 | 中 | 低 | 快速原型 |
| **CrewAI** | 角色扮演 | 有限 | 中 | 低 | 简单团队协作 |
| **Semantic Kernel** | 插件系统 | 有限 | 高（微软背书） | 高 | .NET / 企业集成 |
| **自定义编排** | 灵活 | 自定义 | 取决于实现 | 高 | 极致定制需求 |

---

## 生产部署检查清单

| 检查项 | 说明 | 优先级 |
|--------|------|--------|
| 状态持久化 | 使用 PostgresSaver 或 RedisSaver | P0 |
| 最大迭代限制 | 设置 recursion_limit 防止无限循环 | P0 |
| 每个节点超时 | 防止单个 Agent 卡住整个流程 | P0 |
| Human-in-the-Loop | 关键决策节点设置人工审批 | P1 |
| LangSmith 可观测性 | 记录每个节点的输入输出和耗时 | P1 |
| 并发限制 | 控制同时运行的 Agent 数量 | P1 |
| 成本监控 | 按 thread_id 统计 Token 消耗 | P2 |
| Guardrails | 输入/输出内容过滤 | P2 |

---

## 从 2 个 Agent 开始：务实的建议

实践中，**最常见的失败是一开始就设计太多 Agent**。推荐的演进路径：

1. **第一阶段**：2 个 Agent（Planner + Executor），验证核心流程
2. **第二阶段**：加入 Reviewer Agent，实现质量闭环
3. **第三阶段**：按业务需要拆分专业 Agent（Researcher、Coder 等）

每增加一个 Agent，都要评估：它的价值是否超过它带来的协调复杂度？

---

## 参考资料

- [LangGraph 官方文档](https://langchain-ai.github.io/langgraph)
- [LangGraph 生产部署指南](https://langchain-ai.github.io/langgraph/how-tos/deploy-self-hosted)
- [Human-in-the-Loop 设计模式](https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop)`,
    author: a("u_default_wwy"),
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
    content: `## 从 Docker Compose 到 Kubernetes：你真的需要吗？

这是一个老生常谈但每个团队都绕不开的问题。2025 年，容器化已经是默认选项，但**从 Docker Compose 跳到 Kubernetes 这步棋，很多团队跳早了**——增加了大量运维复杂度，却没有获得等比例的收益。

本文基于一个 5 人团队的真实迁移历程，给出一套务实的渐进式方案，并重点介绍 **K3s** 这个在资源受限场景下的利器。

---

## 架构演进路线图

\`\`\`mermaid
graph LR
    subgraph Phase1["阶段 1：单机 Compose"]
        DC[Docker Compose<br/>单台服务器<br/>手动部署]
    end
    subgraph Phase2["阶段 2：增强 Compose"]
        DC2[Docker Compose<br/>+ CI/CD<br/>+ 监控告警]
    end
    subgraph Phase3["阶段 3：轻量 K8s"]
        K3S[K3s 集群<br/>3 节点<br/>自动故障转移]
    end
    subgraph Phase4["阶段 4：生产 K8s"]
        K8S[托管 K8s<br/>EKS / GKE / ACK<br/>多区域高可用]
    end
    Phase1 -->|日活 1k 到 10k| Phase2
    Phase2 -->|需要高可用| Phase3
    Phase3 -->|团队超过 10 人或合规要求| Phase4
\`\`\`

**关键判断点**：你在哪个阶段触发了哪些痛点？

- 单机宕机影响业务 → 进入阶段 3
- 部署流程不稳定，回滚困难 → 先补 CI/CD，不必上 K8s
- 服务数量 > 15 个 → 考虑进入阶段 3

---

## 阶段 1 → 阶段 2：强化你的 Compose

很多团队在 Docker Compose 阶段就可以走得很远，关键是补齐这几块：

### 生产就绪的 docker-compose.yml

\`\`\`yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
      # 多阶段构建，生产镜像更小
      target: production
    image: ghcr.io/yourorg/web:\${IMAGE_TAG:-latest}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    environment:
      - NODE_ENV=production
      - DATABASE_URL=\${DATABASE_URL}
    # 资源限制：防止单个容器耗尽宿主机资源
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          memory: 256M
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  db:
    image: postgres:17
    restart: unless-stopped
    volumes:
      - pgdata:/var/lib/postgresql/data
      # 自动初始化脚本
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    environment:
      POSTGRES_DB: \${DB_NAME}
      POSTGRES_USER: \${DB_USER}
      POSTGRES_PASSWORD: \${DB_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${DB_USER}"]
      interval: 10s
      retries: 5

volumes:
  pgdata:
    driver: local
\`\`\`

---

## 阶段 2 → 阶段 3：使用 Kompose 迁移到 K3s

### 为什么是 K3s 而不是完整 K8s？

K3s 是 Rancher Labs（现 SUSE）开源的轻量级 Kubernetes 发行版：

- **单二进制安装**：\`curl -sfL https://get.k3s.io | sh -\`，3 分钟完成
- **最低资源要求**：512MB RAM（完整 K8s 需要 4GB+）
- **内置组件**：已集成 Traefik（Ingress）、CoreDNS、Metrics Server
- **适合场景**：小团队生产集群、边缘计算、IoT、CI/CD 环境

### 使用 Kompose 自动转换

Kompose 是 Kubernetes 官方维护的 Docker Compose 转换工具：

\`\`\`bash
# 安装 Kompose
curl -L https://github.com/kubernetes/kompose/releases/latest/download/kompose-linux-amd64 -o kompose
chmod +x kompose && sudo mv kompose /usr/local/bin/

# 转换（生成 K8s YAML 文件）
kompose convert -f docker-compose.yml --out k8s/

# 查看生成的文件
ls k8s/
# web-deployment.yaml  web-service.yaml
# db-deployment.yaml   db-service.yaml
# pgdata-persistentvolumeclaim.yaml

# 应用到 K3s 集群
kubectl apply -f k8s/
\`\`\`

### 迁移原则：一次一个服务

\`\`\`bash
# 推荐迁移顺序：从非关键服务开始
# 1. 先迁移无状态服务（Web、API）
kubectl apply -f k8s/web-deployment.yaml
kubectl apply -f k8s/web-service.yaml

# 验证运行状态
kubectl get pods -w
kubectl describe pod web-xxx

# 2. 观察稳定后，迁移数据库（有状态服务，风险最高）
# 使用 StatefulSet 而非 Deployment
kubectl apply -f k8s/db-statefulset.yaml
\`\`\`

---

## 方案成本横向对比

以国内主流云服务商（阿里云 / 腾讯云）为基准的月度成本估算：

| 方案 | 适合场景 | 月成本（参考） | 运维复杂度 | 高可用 |
|------|----------|----------------|------------|--------|
| **单机 Docker Compose** | 日活 < 5k，非核心业务 | ¥200-500 | 低 | 无 |
| **双机 Compose + Nginx** | 简单主备，成本敏感 | ¥500-800 | 中低 | 手动切换 |
| **K3s 3 节点集群** | 日活 5k-50k，需要高可用 | ¥800-1500 | 中 | 自动故障转移 |
| **托管 K8s（ACK/TKE）** | 日活 > 50k，合规要求 | ¥2000-5000+ | 低（托管） | 多可用区 |
| **vCluster（虚拟集群）** | 多团队隔离，共享底层 | 在现有集群上叠加 | 低 | 继承底层 |

---

## Docker Compose vs Kubernetes 能力对比

| 维度 | Docker Compose | Kubernetes（K3s） |
|------|----------------|-------------------|
| **学习成本** | 低（YAML 直观） | 高（概念多：Pod/Service/Ingress...） |
| **自动故障恢复** | 无（容器重启，节点宕机无法恢复） | 自动将 Pod 调度到健康节点 |
| **滚动更新** | 需手动操作或脚本 | 内置，零停机 |
| **服务发现** | 依赖 Compose 网络（仅单机） | CoreDNS，跨节点 |
| **水平扩缩容** | 手动 --scale | HPA 自动扩缩 |
| **配置/密钥管理** | .env 文件 | ConfigMap + Secret（加密存储） |
| **健康检查 + 自愈** | 基础（healthcheck） | 完整（liveness/readiness/startup probe） |
| **多节点负载均衡** | 不支持 | 内置 |

---

## 实用工具推荐

- **Rancher Desktop**：免费的本地 K8s 开发环境（替代 Docker Desktop）
- **Portainer CE**：社区版免费，Web UI 管理 Docker/K8s，适合小团队
- **K9s**：终端 K8s 管理工具，效率极高
- **vCluster**：在现有 K8s 集群上快速创建隔离的虚拟集群，适合多项目/多团队

---

## 总结：按需选择，不盲目跟风

**2026 年的建议**：
1. 日活 < 1 万且团队 < 5 人：Docker Compose + 完善的 CI/CD，可以走很远
2. 需要高可用但预算有限：K3s 是最佳平衡点，不要用完整的托管 K8s
3. 团队 > 10 人或有合规要求：托管 K8s 的运维成本反而更低（托管商负责控制面）
4. 永远先问：**这个复杂度我的团队能消化吗？**

---

## 参考资料

- [K3s 官方文档](https://docs.k3s.io)
- [Kompose 官方 GitHub](https://github.com/kubernetes/kompose)
- [Rancher Desktop 下载](https://rancherdesktop.io)`,
    author: a("u_default_zsf"),
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
    content: `## Swift 并发的三次跃迁

Swift 的并发模型经历了三个里程碑式的版本，每一次都更接近"安全且易用"的终极目标：

\`\`\`mermaid
timeline
    title Swift 并发演进时间线
    2021 : Swift 5.5
         : async/await 引入
         : 无编译时安全保证
         : actor 初版
    2024 : Swift 6.0
         : 严格并发检查（强制）
         : 大量编译错误涌现
         : Sendable 要求完整
    2025 : Swift 6.2
         : 渐进式披露
         : Approachable Concurrency
         : nonisolated async 新行为
         : @MainActor 默认化
\`\`\`

### 版本关键变化对比

| 特性 | Swift 5.5 | Swift 6.0 | Swift 6.2 |
|------|-----------|-----------|-----------|
| **严格并发检查** | 警告（可忽略） | 错误（强制） | 错误（但更易处理） |
| **@MainActor 推断** | 手动标注 | 手动标注 | 可设为默认 |
| **nonisolated async** | 继承调用者隔离域 | 继承调用者隔离域 | **切换到后台执行器** |
| **@concurrent 属性** | 不存在 | 不存在 | **新增** |
| **渐进式迁移** | 无工具链支持 | 有限支持 | **Approachable Concurrency** |
| **Actor 协议** | 无 | 无 | **新增** |

---

## Swift 6.2 核心特性详解

### 特性一：Approachable Concurrency（渐进式并发）

Swift 6.2 最重要的改进是降低了并发的**认知门槛**。通过 \`swift(ConcurrencyMode: approachable)\` 编译器标志，你可以在项目中局部启用宽松的并发模式，逐步迁移：

\`\`\`swift
// Package.swift — 逐模块启用
targets: [
    .target(
        name: "LegacyFeature",
        swiftSettings: [
            // 旧模块：宽松模式，减少迁移压力
            .swiftLanguageVersion(.v5)
        ]
    ),
    .target(
        name: "NewFeature",
        swiftSettings: [
            // 新模块：完整 Swift 6 并发安全
            .swiftLanguageVersion(.v6)
        ]
    )
]
\`\`\`

### 特性二：@concurrent 属性

\`\`\`swift
actor DataProcessor {
    // 标准 actor 方法：在 actor 的串行执行器上运行
    func processOnActor(_ data: Data) -> ProcessedResult {
        return heavyComputation(data) // 会阻塞 actor 的其他操作
    }

    // @concurrent：在后台并发执行器上运行，不阻塞 actor
    @concurrent
    func processInBackground(_ data: Data) -> ProcessedResult {
        // 纯计算任务放这里，不访问 actor 的状态
        return heavyComputation(data)
    }
}

// 调用方
let processor = DataProcessor()

// 并发处理多批数据，互不阻塞
async let result1 = processor.processInBackground(batch1)
async let result2 = processor.processInBackground(batch2)
let (r1, r2) = await (result1, result2)
\`\`\`

### 特性三：nonisolated async 的新行为

这是 Swift 6.2 中**最容易踩坑的变化**：

\`\`\`swift
class NetworkService {
    // Swift 6.1 及之前：nonisolated async 继承调用者的隔离域
    // Swift 6.2：nonisolated async 切换到后台执行器
    nonisolated func fetchData() async -> Data {
        // 在 Swift 6.2 中，这里运行在后台执行器，不在 MainActor
        return await URLSession.shared.data(from: url).0
    }
}

@MainActor
class ViewModel: ObservableObject {
    @Published var data: Data?
    let service = NetworkService()

    func loadData() async {
        // 调用 nonisolated async 方法
        let result = await service.fetchData() // 自动切换到后台执行器
        // 回到 MainActor（await 完成后自动恢复）
        self.data = result // 安全：在 MainActor 上更新 UI
    }
}
\`\`\`

---

## 生产最佳实践

### 实践一：UI 层全部用 @MainActor

\`\`\`swift
// 整个 ViewModel 在主线程运行，消除 @Published 的并发问题
@MainActor
final class ArticleViewModel: ObservableObject {
    @Published private(set) var articles: [Article] = []
    @Published private(set) var isLoading = false
    @Published private(set) var error: Error?

    private let repository: ArticleRepository

    init(repository: ArticleRepository) {
        self.repository = repository
    }

    func loadArticles() async {
        isLoading = true
        defer { isLoading = false }

        do {
            // repository.fetchAll() 是 nonisolated async
            // 在后台执行，完成后自动回到 MainActor
            articles = try await repository.fetchAll()
        } catch {
            self.error = error
        }
    }
}
\`\`\`

### 实践二：actor 的 nonisolated 成员只用于不可变数据

\`\`\`swift
actor UserCache {
    // 可变状态：必须通过 actor 串行访问
    private var cache: [String: User] = [:]

    // nonisolated：只读常量，安全
    nonisolated let maxCacheSize: Int = 500

    // 不要这样做：nonisolated 访问可变状态（编译错误）
    // nonisolated func getUser(_ id: String) -> User? {
    //     return cache[id]  // ERROR: Actor-isolated property 'cache'
    // }

    // 正确做法：通过 actor 方法访问可变状态
    func getUser(_ id: String) -> User? {
        return cache[id]
    }

    func setUser(_ user: User) {
        if cache.count >= maxCacheSize {
            cache.removeAll()
        }
        cache[user.id] = user
    }
}
\`\`\`

### 实践三：结构化并发处理批量任务

\`\`\`swift
func processArticles(_ articles: [Article]) async throws -> [ProcessedArticle] {
    // withThrowingTaskGroup：有界并发，错误自动取消其他子任务
    return try await withThrowingTaskGroup(of: ProcessedArticle.self) { group in
        // 限制并发数，防止资源耗尽
        let maxConcurrent = 5
        var results: [ProcessedArticle] = []

        for (index, article) in articles.enumerated() {
            // 每 maxConcurrent 个任务批次等待一次
            if index >= maxConcurrent {
                if let result = try await group.next() {
                    results.append(result)
                }
            }
            group.addTask {
                return try await self.processArticle(article)
            }
        }

        // 等待剩余任务完成
        for try await result in group {
            results.append(result)
        }

        return results
    }
}
\`\`\`

---

## 迁移检查清单

| 迁移步骤 | 具体操作 | 风险等级 | 说明 |
|----------|----------|----------|------|
| **1. 开启警告** | swift(6) 改为警告模式扫描 | 低 | 不影响编译，只看问题规模 |
| **2. UI 层加 @MainActor** | ViewModel、ViewController 全加 | 低 | 几乎总是正确的 |
| **3. 修复 Sendable** | 值类型加 Sendable，引用类型用 actor | 中 | 逐文件处理 |
| **4. 替换 DispatchQueue** | DispatchQueue.main.async → await MainActor.run | 中 | 行为等价 |
| **5. 关键模块先迁移** | 网络层、数据层优先 | 高 | 影响面大，要充分测试 |
| **6. 启用严格模式** | swift(6) 严格模式，修复所有错误 | 高 | 分模块逐步启用 |

**警告**：不要在没有手动修复任何问题的情况下直接开启 Approachable Concurrency，这只是降低了门槛，不是消除了问题。

---

## 常见陷阱

\`\`\`swift
// 陷阱 1：在 actor 内调用长时间运行的同步代码
actor BadActor {
    func doHeavyWork() {
        // 这会阻塞整个 actor，其他调用者都在等待
        Thread.sleep(forTimeInterval: 5) // 永远不要这样做
    }
}

// 正确做法：将耗时工作移到 Task.detached 或使用 @concurrent
actor GoodActor {
    @concurrent
    func doHeavyWork() async {
        // 在后台执行器运行，不阻塞 actor
        try? await Task.sleep(for: .seconds(5))
    }
}

// 陷阱 2：在 @MainActor 方法中做耗时计算
@MainActor
func badMainActorWork() async {
    // 这会卡住 UI！
    let result = heavyComputation() // 同步，阻塞主线程
    updateUI(result)
}

// 正确做法：将耗时计算 offload 到后台
@MainActor
func goodMainActorWork() async {
    let result = await Task.detached(priority: .userInitiated) {
        return heavyComputation()
    }.value
    updateUI(result) // 回到主线程更新 UI
}
\`\`\`

---

## 总结

Swift 6.2 的并发模型已经足够成熟。对于新项目，建议直接使用 Swift 6.2 的严格模式，配合 \`@MainActor\` 覆盖所有 UI 代码，从一开始就建立正确的并发边界。

对于存量项目，迁移的关键是**信任编译器**——每一个编译错误都在告诉你一个真实的并发 bug，修复它而不是用 \`@unchecked Sendable\` 绕过它。

---

## 参考资料

- [Swift 6.2 发布说明](https://www.swift.org/blog/swift-6.2-released)
- [Swift 并发迁移指南](https://www.swift.org/migration/documentation/swift-6-concurrency-migration-guide)
- [WWDC 2025: Approachable Concurrency](https://developer.apple.com/videos/wwdc2025)`,
    author: a("u_default_lsg"),
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

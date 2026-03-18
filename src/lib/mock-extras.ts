/**
 * 扩展模拟数据 — 沸点/课程/活动/评论/通知
 * 作者数据统一从 users.ts 读取，不再内联硬编码
 */

import type { Author } from "./mock-data";
import { getAuthorByUserId } from "./users";

// 快捷取 Author（兜底 AUTHORS[0]）
const a = (id: string) => getAuthorByUserId(id)!;

// 原始 4 个作者的快捷引用
const A_ZSF = a("u_default_zsf");
const A_LSG = a("u_default_lsg");
const A_WWY = a("u_default_wwy");
const A_ZLH = a("u_default_zlh");

// 新增作者引用（让沸点/评论更多样化）
const A_CSY = a("u_preset_005"); // 陈思远 - 高级前端工程师
const A_LXY = a("u_preset_006"); // 林晓雨 - 前端技术负责人
const A_GZY = a("u_preset_017"); // 高志远 - Go 后端架构师
const A_DRF = a("u_preset_027"); // 邓锐峰 - 机器学习工程师
const A_SXC = a("u_preset_042"); // 苏晓晨 - 云原生架构师
const A_DAP = a("u_preset_047"); // 戴鹏飞 - iOS 高级工程师

// ── 沸点（短内容） ──
export interface Pin {
  id: string;
  author: Author;
  content: string;
  images?: string[];
  topic?: string;
  createdAt: string;
  likes: number;
  comments: number;
}

export const PINS: Pin[] = [
  {
    id: "p1",
    author: A_ZSF,
    content: "刚把项目从 Webpack 迁移到 Turbopack，冷启动从 12s 降到 1.2s，热更新几乎无感。Next.js 16 的 DX 真的提升了一个量级 🚀",
    topic: "前端",
    createdAt: "2026-03-17T08:30:00Z",
    likes: 234,
    comments: 18,
  },
  {
    id: "p2",
    author: A_WWY,
    content: "Claude 4.6 的代码生成能力比 4.5 又强了一截。刚测试了一下，复杂的多文件重构任务基本一次通过，之前 4.5 需要 2-3 轮修正。Agent 团队协作模式是真的好用。",
    topic: "AI",
    createdAt: "2026-03-17T07:15:00Z",
    likes: 567,
    comments: 42,
  },
  {
    id: "p3",
    author: A_ZLH,
    content: "分享一个 PostgreSQL 17 的坑：jsonb_path_query 在嵌套超过 5 层的 JSON 上性能会急剧下降。解决方案是用 GIN 索引 + 扁平化存储，查询速度提升了 20 倍。",
    topic: "后端",
    createdAt: "2026-03-17T06:00:00Z",
    likes: 189,
    comments: 31,
  },
  {
    id: "p4",
    author: A_LSG,
    content: "今天面试遇到一个候选人，手写了一个 mini React reconciler，diff 算法解释得清清楚楚。这种基础功扎实的开发者太难得了。\n\n顺便推荐 《Build Your Own React》这篇文章，想深入理解 React 原理的同学必读。",
    topic: "前端",
    createdAt: "2026-03-16T22:00:00Z",
    likes: 412,
    comments: 56,
  },
  {
    id: "p5",
    author: A_ZSF,
    content: "K8s 集群又挂了…这次是 etcd 磁盘写满导致的。教训：永远给 etcd 单独挂 SSD，设置合理的 compaction 策略。\n\n运维三大定律：\n1. 凡是能出错的一定会出错\n2. 出错时间一定是凌晨三点\n3. 备份永远少做了一次",
    topic: "DevOps",
    createdAt: "2026-03-16T18:30:00Z",
    likes: 876,
    comments: 93,
  },
  {
    id: "p6",
    author: A_WWY,
    content: "LangGraph 0.4 发布了！新增的 Command 模式太好用了，终于可以优雅地实现 Agent 之间的动态路由。之前要写一堆 conditional_edges，现在 Agent 自己决定下一步走哪。",
    topic: "AI",
    createdAt: "2026-03-16T15:00:00Z",
    likes: 345,
    comments: 27,
  },
  {
    id: "p7",
    author: A_ZLH,
    content: "Redis 8.0 稳定版终于发布了。多线程 I/O 默认开启，实测 QPS 提升了 2.3 倍。另外 Redis Functions 终于可以替代 Lua 脚本了，TypeScript 写 Redis 扩展的体验太丝滑了。",
    topic: "后端",
    createdAt: "2026-03-16T12:00:00Z",
    likes: 231,
    comments: 19,
  },
  {
    id: "p8",
    author: A_LSG,
    content: "CSS anchor positioning 终于全浏览器支持了！以后做 tooltip、popover 再也不用 JS 计算位置了。写了个 demo，代码量直接减少 80%。原生 CSS 越来越强 💪",
    topic: "前端",
    createdAt: "2026-03-16T09:00:00Z",
    likes: 298,
    comments: 22,
  },
  // ── 新增沸点（更多作者参与） ──
  {
    id: "p9",
    author: A_CSY,
    content: "Vite 6 的 Environment API 太强了！终于可以在同一个项目里同时处理 SSR 和客户端构建，再也不用拆两个 vite.config 了。迁移指南写得很清楚，半小时搞定。",
    topic: "前端",
    createdAt: "2026-03-15T20:00:00Z",
    likes: 176,
    comments: 14,
  },
  {
    id: "p10",
    author: A_DRF,
    content: "用 LoRA 微调了一个代码审查模型，基于 CodeLlama 34B。在我们内部数据集上，Bug 检出率比 GPT-4 高了 12%。关键是推理成本降了 90%，本地 A100 就能跑。",
    topic: "AI",
    createdAt: "2026-03-15T16:00:00Z",
    likes: 423,
    comments: 38,
  },
  {
    id: "p11",
    author: A_GZY,
    content: "Go 1.24 的 range over function 终于稳定了！迭代器模式写起来优雅多了。不过要注意，闭包捕获变量的行为和以前不太一样，踩了个坑排查了半天。",
    topic: "后端",
    createdAt: "2026-03-15T12:30:00Z",
    likes: 198,
    comments: 21,
  },
  {
    id: "p12",
    author: A_SXC,
    content: "今天帮客户做了一次 K8s 集群压测，发现 Istio sidecar 在高并发下会成为瓶颈。换成 Ambient Mesh 后，P99 延迟直接降了 40%。Service Mesh 的无 Sidecar 方案终于成熟了。",
    topic: "DevOps",
    createdAt: "2026-03-15T09:00:00Z",
    likes: 267,
    comments: 29,
  },
  {
    id: "p13",
    author: A_LXY,
    content: "React 19 的 use() hook 真的改变了数据获取方式。配合 Suspense boundary，loading 状态管理变得前所未有的简洁。再也不想写 isLoading/isError 三件套了。",
    topic: "前端",
    createdAt: "2026-03-14T21:00:00Z",
    likes: 312,
    comments: 33,
  },
  {
    id: "p14",
    author: A_DAP,
    content: "SwiftUI 在 iOS 20 上终于支持自定义 NavigationTransition 了！之前要用 UIKit bridge 实现的过渡动画，现在 3 行代码搞定。苹果这次更新诚意满满。",
    topic: "移动端",
    createdAt: "2026-03-14T14:00:00Z",
    likes: 145,
    comments: 11,
  },
];

export const PIN_TOPICS = ["推荐", "前端", "后端", "AI", "DevOps", "移动端", "开源", "职场"];

// ── 课程 ──
export interface Course {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  instructor: Author;
  price: number;         // 0 = 免费
  originalPrice?: number;
  students: number;
  rating: number;
  tags: string[];
  chapters: number;
  duration: string;
  level: "入门" | "进阶" | "高级";
}

export const COURSES: Course[] = [
  {
    id: "c1",
    title: "React Server Components 实战：从入门到企业级架构",
    description: "从零搭建 RSC 应用，涵盖数据获取、缓存策略、流式渲染、部署优化等核心主题。",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
    instructor: A_LSG,
    price: 0,
    students: 12680,
    rating: 4.9,
    tags: ["前端", "React"],
    chapters: 48,
    duration: "24 小时",
    level: "进阶",
  },
  {
    id: "c2",
    title: "LangGraph 多 Agent 系统设计与实现",
    description: "手把手教你构建可靠的 AI Agent 团队，包含状态管理、工具调用、人机协作等核心模式。",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop",
    instructor: A_WWY,
    price: 199,
    originalPrice: 399,
    students: 8430,
    rating: 4.8,
    tags: ["AI", "Python"],
    chapters: 36,
    duration: "18 小时",
    level: "高级",
  },
  {
    id: "c3",
    title: "PostgreSQL 从入门到精通：2026 版",
    description: "全面覆盖 PG 17 新特性，包括 JSON 性能优化、逻辑复制增强、查询执行器改进等。",
    coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=225&fit=crop",
    instructor: A_ZLH,
    price: 149,
    originalPrice: 299,
    students: 15200,
    rating: 4.9,
    tags: ["数据库", "后端"],
    chapters: 56,
    duration: "32 小时",
    level: "入门",
  },
  {
    id: "c4",
    title: "Docker + K8s 容器化实战：小团队部署指南",
    description: "从 Docker Compose 到 K3s 的渐进式容器化方案，适合 2-10 人研发团队。",
    coverImage: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=225&fit=crop",
    instructor: A_ZSF,
    price: 99,
    originalPrice: 199,
    students: 9870,
    rating: 4.7,
    tags: ["DevOps", "架构"],
    chapters: 32,
    duration: "16 小时",
    level: "进阶",
  },
  {
    id: "c5",
    title: "Swift 6 并发编程完全指南",
    description: "深入 actor 模型、structured concurrency、async/await 底层原理与最佳实践。",
    coverImage: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400&h=225&fit=crop",
    instructor: A_DAP,
    price: 0,
    students: 6340,
    rating: 4.8,
    tags: ["移动端", "iOS"],
    chapters: 28,
    duration: "14 小时",
    level: "高级",
  },
  {
    id: "c6",
    title: "TypeScript 类型体操：从新手到大师",
    description: "100+ 类型挑战实战，掌握 Conditional Types、Mapped Types、Template Literal Types 等高级技巧。",
    coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop",
    instructor: A_CSY,
    price: 79,
    originalPrice: 159,
    students: 21500,
    rating: 4.9,
    tags: ["前端", "TypeScript"],
    chapters: 42,
    duration: "20 小时",
    level: "进阶",
  },
];

// ── 活动 ──
export interface Event {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  location: string;
  online: boolean;
  participants: number;
  maxParticipants?: number;
  host: string;
  status: "upcoming" | "ongoing" | "ended";
  tags: string[];
}

export const EVENTS: Event[] = [
  {
    id: "e1",
    title: "2026 全球前端技术大会 (GFTC)",
    description: "聚焦 RSC、Edge Computing、AI-First UI 三大主题，20+ 国际讲师，3 天深度分享。",
    coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop",
    startDate: "2026-04-15",
    endDate: "2026-04-17",
    location: "深圳会展中心",
    online: true,
    participants: 3200,
    maxParticipants: 5000,
    host: "DevBlog 技术社区",
    status: "upcoming",
    tags: ["前端", "架构"],
  },
  {
    id: "e2",
    title: "AI Agent Hackathon 2026 春季赛",
    description: "48 小时极限编程，用 LangGraph/CrewAI 构建最具创意的 Agent 应用，总奖金 10 万元。",
    coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=300&fit=crop",
    startDate: "2026-03-22",
    endDate: "2026-03-24",
    location: "线上",
    online: true,
    participants: 860,
    maxParticipants: 1000,
    host: "AI 开发者社区",
    status: "upcoming",
    tags: ["AI", "开源"],
  },
  {
    id: "e3",
    title: "PostgreSQL 中国用户大会",
    description: "PG 17 深度解析、国产化适配、高可用架构实战，来自阿里/腾讯/华为的一线 DBA 分享。",
    coverImage: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&h=300&fit=crop",
    startDate: "2026-03-10",
    endDate: "2026-03-11",
    location: "北京国家会议中心",
    online: false,
    participants: 1500,
    host: "PG 中文社区",
    status: "ongoing",
    tags: ["数据库", "后端"],
  },
  {
    id: "e4",
    title: "开源之夏 2026",
    description: "面向高校学生的开源实习计划，参与 100+ 顶级开源项目，获得导师指导与丰厚奖金。",
    coverImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=300&fit=crop",
    startDate: "2026-05-01",
    endDate: "2026-09-30",
    location: "线上",
    online: true,
    participants: 4200,
    host: "中科院软件所",
    status: "upcoming",
    tags: ["开源"],
  },
  {
    id: "e5",
    title: "Cloud Native Meetup 上海站",
    description: "K8s、Service Mesh、eBPF 技术分享，现场 Demo 演示 + 圆桌讨论。",
    coverImage: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=300&fit=crop",
    startDate: "2026-02-28",
    endDate: "2026-02-28",
    location: "上海张江科学城",
    online: false,
    participants: 280,
    maxParticipants: 300,
    host: "CNCF 上海站",
    status: "ended",
    tags: ["DevOps", "架构"],
  },
];

// ── 评论 ──
export interface Comment {
  id: string;
  postId: string;
  author: Author;
  content: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
}

export const COMMENTS: Comment[] = [
  // 文章 1 的评论
  {
    id: "cm1",
    postId: "1",
    author: A_ZLH,
    content: "RSC 确实很好，但学习曲线也不低。我们团队花了两周才完全理解 Server/Client 边界的划分逻辑。建议作者补充一些常见的 \"use client\" 误用场景。",
    createdAt: "2026-03-17T06:00:00Z",
    likes: 28,
    replies: [
      {
        id: "cm1r1",
        postId: "1",
        author: A_LSG,
        content: "好建议！最常见的误区是在 Server Component 里用 useState/useEffect。简单规则：需要浏览器 API 或用户交互的才标记 \"use client\"。",
        createdAt: "2026-03-17T06:30:00Z",
        likes: 15,
      },
      {
        id: "cm1r2",
        postId: "1",
        author: A_CSY,
        content: "补充一点：第三方组件库如果没有 \"use client\" 标记，在 RSC 中直接导入会报错。建议在 wrapper 层统一加标记。",
        createdAt: "2026-03-17T07:00:00Z",
        likes: 9,
      },
    ],
  },
  {
    id: "cm2",
    postId: "1",
    author: A_WWY,
    content: "性能数据很有说服力！我们迁移到 RSC 后 LCP 从 2.8s 降到了 0.9s，FCP 基本无变化。服务端组件确实解决了瀑布流请求的问题。",
    createdAt: "2026-03-17T04:00:00Z",
    likes: 42,
  },
  {
    id: "cm3",
    postId: "1",
    author: A_ZSF,
    content: "React Compiler 那部分写得很好。不过想补充一点：Compiler 目前对自定义 Hooks 的优化还不够完善，复杂场景下建议还是手动 memo。",
    createdAt: "2026-03-16T22:00:00Z",
    likes: 19,
  },
  {
    id: "cm3b",
    postId: "1",
    author: A_LXY,
    content: "我们团队的迁移策略是先把叶子节点组件改成 Server Component，效果立竿见影。推荐从 footer、sidebar 这种纯展示组件开始。",
    createdAt: "2026-03-16T20:00:00Z",
    likes: 24,
  },
  // 文章 2 的评论
  {
    id: "cm4",
    postId: "2",
    author: A_ZSF,
    content: "30 分钟从零到部署，这标题不夸张吗？我试了一下，确实可以…Claude Code 搭配 Vercel 的部署体验真的太顺滑了。",
    createdAt: "2026-03-16T20:00:00Z",
    likes: 56,
    replies: [
      {
        id: "cm4r1",
        postId: "2",
        author: A_WWY,
        content: "关键是要会写 prompt。我第一次试花了 2 小时才搞定，后来学会了分步骤描述需求，确实快了很多。",
        createdAt: "2026-03-16T20:30:00Z",
        likes: 23,
      },
      {
        id: "cm4r2",
        postId: "2",
        author: A_DRF,
        content: "对比了一下 Claude Code 和 Cursor Agent，复杂项目 Claude Code 确实更稳。Cursor 在单文件编辑上体验更好。两个搭配用效率最高。",
        createdAt: "2026-03-16T21:00:00Z",
        likes: 31,
      },
    ],
  },
  // 文章 3 的评论
  {
    id: "cm5",
    postId: "3",
    author: A_LSG,
    content: "JSON 性能提升 300% 是实测数据吗？在什么数据规模下？我们的 JSONB 查询在 100 万行级别还是挺慢的。",
    createdAt: "2026-03-16T18:00:00Z",
    likes: 34,
    replies: [
      {
        id: "cm5r1",
        postId: "3",
        author: A_ZLH,
        content: "100 万行的话建议用 jsonb_path_ops GIN 索引，我们实测查询时间从 2s 降到了 50ms。文章里有提到这个索引类型。",
        createdAt: "2026-03-16T18:30:00Z",
        likes: 18,
      },
    ],
  },
  {
    id: "cm5b",
    postId: "3",
    author: A_GZY,
    content: "我们从 MongoDB 迁到 PG 17 后，JSON 查询性能确实翻了几倍。加上事务支持，终于不用在应用层做补偿逻辑了。",
    createdAt: "2026-03-16T16:00:00Z",
    likes: 27,
  },
  // 文章 4 的评论
  {
    id: "cm6",
    postId: "4",
    author: A_ZLH,
    content: "Supervisor 模式 + PostgreSQL checkpoint 这个组合太实用了。我们在生产环境用了三个月，故障恢复从完全重来变成了断点续跑。",
    createdAt: "2026-03-16T15:00:00Z",
    likes: 67,
  },
  {
    id: "cm6b",
    postId: "4",
    author: A_DRF,
    content: "Human-in-the-loop 那段写得特别好。我们的 Agent 系统也加了人工审批节点，误操作率从 8% 降到了 0.3%。关键业务一定要加这个。",
    createdAt: "2026-03-16T13:00:00Z",
    likes: 52,
  },
  // 文章 5 的评论
  {
    id: "cm7",
    postId: "5",
    author: A_WWY,
    content: "K3s 真的是小团队的福音。我们 3 个人的团队用 K3s 管了 20 多个微服务，完全够用。唯一要注意的是 etcd 替换成了 SQLite，大规模不太合适。",
    createdAt: "2026-03-16T12:00:00Z",
    likes: 45,
  },
  {
    id: "cm7b",
    postId: "5",
    author: A_SXC,
    content: "成本对比那张表特别实用。补充一点：阿里云 ACK Serverless 现在也很便宜，按 Pod 计费，适合流量波动大的场景。",
    createdAt: "2026-03-16T10:00:00Z",
    likes: 33,
  },
  // 文章 6 的评论
  {
    id: "cm8",
    postId: "6",
    author: A_ZSF,
    content: "Swift 6 的 strict concurrency checking 一开始确实很痛苦，编译器报了 200+ warning。但花两天全部修完后，之前几个难以复现的 race condition 就再也没出现过了。",
    createdAt: "2026-03-16T10:00:00Z",
    likes: 38,
  },
  {
    id: "cm8b",
    postId: "6",
    author: A_DAP,
    content: "@concurrent 属性是我等了两年的功能。之前在 actor 里做 CPU 密集型计算只能 Task.detached，现在优雅多了。强烈推荐升级 6.2。",
    createdAt: "2026-03-16T08:00:00Z",
    likes: 29,
  },
];

export function getCommentsByPostId(postId: string): Comment[] {
  return COMMENTS.filter((c) => c.postId === postId);
}

// ── 通知 ──
export interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "system";
  from?: Author;
  content: string;
  postTitle?: string;
  postId?: string;
  createdAt: string;
  read: boolean;
}

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "like",
    from: A_ZLH,
    content: "赞了你的文章",
    postTitle: "2026 年前端框架趋势：React Server Components 彻底改变了什么？",
    postId: "1",
    createdAt: "2026-03-17T08:00:00Z",
    read: false,
  },
  {
    id: "n2",
    type: "comment",
    from: A_WWY,
    content: "评论了你的文章：\"性能数据很有说服力！\"",
    postTitle: "2026 年前端框架趋势：React Server Components 彻底改变了什么？",
    postId: "1",
    createdAt: "2026-03-17T04:00:00Z",
    read: false,
  },
  {
    id: "n2b",
    type: "comment",
    from: A_CSY,
    content: "回复了评论：\"第三方组件库如果没有 use client 标记…\"",
    postTitle: "2026 年前端框架趋势：React Server Components 彻底改变了什么？",
    postId: "1",
    createdAt: "2026-03-17T07:00:00Z",
    read: false,
  },
  {
    id: "n3",
    type: "follow",
    from: A_LSG,
    content: "关注了你",
    createdAt: "2026-03-16T22:00:00Z",
    read: true,
  },
  {
    id: "n3b",
    type: "follow",
    from: A_DRF,
    content: "关注了你",
    createdAt: "2026-03-16T21:00:00Z",
    read: false,
  },
  {
    id: "n4",
    type: "system",
    content: "你的文章《LangGraph + Claude：构建可靠的多 Agent 系统实战指南》已被推荐到首页",
    postTitle: "LangGraph + Claude：构建可靠的多 Agent 系统实战指南",
    postId: "4",
    createdAt: "2026-03-16T18:00:00Z",
    read: true,
  },
  {
    id: "n5",
    type: "like",
    from: A_GZY,
    content: "赞了你的沸点",
    createdAt: "2026-03-16T15:00:00Z",
    read: true,
  },
  {
    id: "n6",
    type: "comment",
    from: A_ZLH,
    content: "回复了你的评论：\"好建议！最常见的误区是…\"",
    postTitle: "2026 年前端框架趋势：React Server Components 彻底改变了什么？",
    postId: "1",
    createdAt: "2026-03-16T12:00:00Z",
    read: true,
  },
  {
    id: "n7",
    type: "system",
    content: "系统升级：DevBlog 新增沸点、课程、活动功能，快来体验吧！",
    createdAt: "2026-03-15T10:00:00Z",
    read: true,
  },
];

// ── 当前用户（头像从 users.ts 统一获取） ──
export const CURRENT_USER: Author & { bio: string; followers: number; following: number; totalViews: number; totalLikes: number; joinDate: string } = {
  ...A_ZSF,
  bio: "热爱开源，专注前后端全栈开发。分享技术，记录成长。",
  followers: 2860,
  following: 128,
  totalViews: 156000,
  totalLikes: 8900,
  joinDate: "2024-06-15",
};

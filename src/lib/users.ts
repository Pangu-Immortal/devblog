/**
 * 预制用户集中管理 — 60 个预制用户 + Author 导出 + 查询函数
 *
 * 前 4 个保留原始 userId（u_default_*），向后兼容。
 * 新增 56 个使用 u_preset_005 ~ u_preset_060。
 * 密码统一 123456（base64 编码）。
 * 头像从 ALL_AVATARS 前 60 个分配。
 *
 * 导出：PRESET_USERS / AUTHORS / getAuthorByUserId
 */

import { ALL_AVATARS } from "./avatars";

// Author 接口内联定义，避免与 mock-data.ts 的循环依赖
export interface Author {
  userId: string;
  name: string;
  avatar: string;
  title: string;
}

// base64 编码（与 auth-context.tsx 一致）
const encode = (s: string) => typeof btoa !== "undefined" ? btoa(s) : s;

// 注册时存储的用户记录（含密码）
export interface StoredUser {
  userId: string;
  name: string;
  avatar: string;
  title: string;
  email: string;
  password: string;
}

// ── 60 个预制用户定义（name / title / email） ──
const USER_DEFS: { userId: string; name: string; title: string; email: string }[] = [
  // 前 4 个保留原始 userId，向后兼容
  { userId: "u_default_zsf", name: "张三丰",  title: "全栈工程师",       email: "test@devblog.com" },
  { userId: "u_default_lsg", name: "李四光",  title: "前端架构师",       email: "li4@devblog.com" },
  { userId: "u_default_wwy", name: "王五岳",  title: "AI 算法工程师",    email: "wang5@devblog.com" },
  { userId: "u_default_zlh", name: "赵六合",  title: "后端开发工程师",    email: "zhao6@devblog.com" },

  // ── 前端 (12) ──
  { userId: "u_preset_005", name: "陈思远",  title: "高级前端工程师",     email: "chen5@devblog.com" },
  { userId: "u_preset_006", name: "林晓雨",  title: "前端技术负责人",     email: "lin6@devblog.com" },
  { userId: "u_preset_007", name: "杨明辉",  title: "React 技术专家",    email: "yang7@devblog.com" },
  { userId: "u_preset_008", name: "刘佳琪",  title: "前端性能优化专家",   email: "liu8@devblog.com" },
  { userId: "u_preset_009", name: "周文博",  title: "Vue.js 核心贡献者",  email: "zhou9@devblog.com" },
  { userId: "u_preset_010", name: "吴婉婷",  title: "前端工程化专家",     email: "wu10@devblog.com" },
  { userId: "u_preset_011", name: "黄子豪",  title: "TypeScript 布道师",  email: "huang11@devblog.com" },
  { userId: "u_preset_012", name: "孙雅琪",  title: "UI/UX 工程师",      email: "sun12@devblog.com" },
  { userId: "u_preset_013", name: "徐浩然",  title: "小程序开发专家",     email: "xu13@devblog.com" },
  { userId: "u_preset_014", name: "马思琪",  title: "Next.js 开发者",    email: "ma14@devblog.com" },
  { userId: "u_preset_015", name: "胡俊杰",  title: "前端可视化工程师",   email: "hu15@devblog.com" },
  { userId: "u_preset_016", name: "郭美玲",  title: "Web 性能顾问",      email: "guo16@devblog.com" },

  // ── 后端 (10) ──
  { userId: "u_preset_017", name: "高志远",  title: "Go 后端架构师",      email: "gao17@devblog.com" },
  { userId: "u_preset_018", name: "罗小凤",  title: "Java 技术专家",      email: "luo18@devblog.com" },
  { userId: "u_preset_019", name: "梁浩宇",  title: "Python 高级工程师",  email: "liang19@devblog.com" },
  { userId: "u_preset_020", name: "谢婷婷",  title: "Node.js 技术负责人", email: "xie20@devblog.com" },
  { userId: "u_preset_021", name: "韩文昊",  title: "微服务架构师",       email: "han21@devblog.com" },
  { userId: "u_preset_022", name: "唐雨萱",  title: "Rust 开发工程师",    email: "tang22@devblog.com" },
  { userId: "u_preset_023", name: "冯睿智",  title: "分布式系统专家",     email: "feng23@devblog.com" },
  { userId: "u_preset_024", name: "董晓燕",  title: "API 设计专家",       email: "dong24@devblog.com" },
  { userId: "u_preset_025", name: "彭泽宇",  title: "Spring Boot 专家",   email: "peng25@devblog.com" },
  { userId: "u_preset_026", name: "曾丽华",  title: "后端性能调优师",     email: "zeng26@devblog.com" },

  // ── AI (8) ──
  { userId: "u_preset_027", name: "邓锐峰",  title: "机器学习工程师",     email: "deng27@devblog.com" },
  { userId: "u_preset_028", name: "萧雨晴",  title: "NLP 算法专家",       email: "xiao28@devblog.com" },
  { userId: "u_preset_029", name: "任天翔",  title: "大模型训练工程师",   email: "ren29@devblog.com" },
  { userId: "u_preset_030", name: "姜若兰",  title: "CV 算法工程师",      email: "jiang30@devblog.com" },
  { userId: "u_preset_031", name: "沈昊天",  title: "AI Agent 架构师",    email: "shen31@devblog.com" },
  { userId: "u_preset_032", name: "钟敏慧",  title: "推荐系统工程师",     email: "zhong32@devblog.com" },
  { userId: "u_preset_033", name: "陆子昂",  title: "深度学习研究员",     email: "lu33@devblog.com" },
  { userId: "u_preset_034", name: "方晓琳",  title: "AI 产品工程师",      email: "fang34@devblog.com" },

  // ── 全栈 (6) ──
  { userId: "u_preset_035", name: "于浩然",  title: "全栈技术负责人",     email: "yu35@devblog.com" },
  { userId: "u_preset_036", name: "贺诗雨",  title: "全栈独立开发者",     email: "he36@devblog.com" },
  { userId: "u_preset_037", name: "丁志强",  title: "创业公司 CTO",       email: "ding37@devblog.com" },
  { userId: "u_preset_038", name: "程雅文",  title: "全栈产品工程师",     email: "cheng38@devblog.com" },
  { userId: "u_preset_039", name: "范逸飞",  title: "T 型全栈开发者",     email: "fan39@devblog.com" },
  { userId: "u_preset_040", name: "叶小萌",  title: "SaaS 全栈工程师",    email: "ye40@devblog.com" },

  // ── DevOps (6) ──
  { userId: "u_preset_041", name: "史泽华",  title: "SRE 工程师",         email: "shi41@devblog.com" },
  { userId: "u_preset_042", name: "苏晓晨",  title: "云原生架构师",       email: "su42@devblog.com" },
  { userId: "u_preset_043", name: "魏建国",  title: "K8s 运维专家",       email: "wei43@devblog.com" },
  { userId: "u_preset_044", name: "蒋雨桐",  title: "CI/CD 平台工程师",   email: "jiang44@devblog.com" },
  { userId: "u_preset_045", name: "余志鹏",  title: "基础设施工程师",     email: "yu45@devblog.com" },
  { userId: "u_preset_046", name: "潘秋月",  title: "DevOps 教练",        email: "pan46@devblog.com" },

  // ── 移动端 (5) ──
  { userId: "u_preset_047", name: "戴鹏飞",  title: "iOS 高级工程师",     email: "dai47@devblog.com" },
  { userId: "u_preset_048", name: "夏梦瑶",  title: "Android 架构师",     email: "xia48@devblog.com" },
  { userId: "u_preset_049", name: "蔡文龙",  title: "Flutter 技术专家",   email: "cai49@devblog.com" },
  { userId: "u_preset_050", name: "田悦华",  title: "React Native 工程师", email: "tian50@devblog.com" },
  { userId: "u_preset_051", name: "石磊",    title: "移动端性能专家",     email: "shi51@devblog.com" },

  // ── 数据库 (4) ──
  { userId: "u_preset_052", name: "崔宏伟",  title: "DBA 技术专家",       email: "cui52@devblog.com" },
  { userId: "u_preset_053", name: "龚玉婷",  title: "数据库内核工程师",   email: "gong53@devblog.com" },
  { userId: "u_preset_054", name: "卢建华",  title: "分布式数据库专家",   email: "lu54@devblog.com" },
  { userId: "u_preset_055", name: "侯冰清",  title: "数据治理顾问",       email: "hou55@devblog.com" },

  // ── 安全/测试 (4) ──
  { userId: "u_preset_056", name: "孟庆辉",  title: "安全攻防工程师",     email: "meng56@devblog.com" },
  { userId: "u_preset_057", name: "白素云",  title: "测试架构师",         email: "bai57@devblog.com" },
  { userId: "u_preset_058", name: "秦凯旋",  title: "渗透测试专家",       email: "qin58@devblog.com" },
  { userId: "u_preset_059", name: "尹佳慧",  title: "质量保障负责人",     email: "yin59@devblog.com" },

  // ── 管理 (5) ──
  { userId: "u_preset_060", name: "郑伟杰",  title: "技术总监",           email: "zheng60@devblog.com" },
];

// ── 生成 PRESET_USERS (含密码) ──
export const PRESET_USERS: StoredUser[] = USER_DEFS.map((u, i) => ({
  ...u,
  avatar: ALL_AVATARS[i % ALL_AVATARS.length], // 前 60 个头像一一对应
  password: encode("123456"),
}));

// ── 生成 AUTHORS (不含密码，纯展示) ──
export const AUTHORS: Author[] = PRESET_USERS.map(({ userId, name, avatar, title }) => ({
  userId,
  name,
  avatar,
  title,
}));

/**
 * 根据 userId 查找 Author
 */
export function getAuthorByUserId(id: string): Author | undefined {
  return AUTHORS.find(a => a.userId === id);
}

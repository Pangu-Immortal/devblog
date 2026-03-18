"use client";

import Link from "next/link";
import { TrendingUp, Award, BookOpen } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { AUTHORS } from "@/lib/users";

const hotArticles = [
  { rank: 1, title: "2026 年前端框架趋势：React Server Components 彻底改变了什么？", id: "1", hot: "12.5k" },
  { rank: 2, title: "用 Claude Code 搭建全栈应用：从零到部署只要 30 分钟", id: "2", hot: "9.8k" },
  { rank: 3, title: "PostgreSQL 17 新特性：JSON 性能提升 300%，告别 MongoDB？", id: "3", hot: "7.2k" },
  { rank: 4, title: "LangGraph + Claude：构建可靠的多 Agent 系统实战指南", id: "4", hot: "6.1k" },
  { rank: 5, title: "Docker Compose 到 Kubernetes：小团队的渐进式容器化之路", id: "5", hot: "5.4k" },
];

// 从 60 人 AUTHORS 池选 5 个推荐作者（覆盖不同领域）
const recommendedAuthors = [
  { ...AUTHORS[0],  desc: "全栈工程师 · 128 篇文章" },     // 张三丰
  { ...AUTHORS[4],  desc: "高级前端工程师 · 86 篇文章" },   // 陈思远
  { ...AUTHORS[16], desc: "Go 后端架构师 · 64 篇文章" },    // 高志远
  { ...AUTHORS[26], desc: "机器学习工程师 · 52 篇文章" },   // 邓锐峰
  { ...AUTHORS[40], desc: "SRE 工程师 · 41 篇文章" },       // 史泽华
];

const hotColumns = [
  { name: "前端进阶之路", tag: "前端" },
  { name: "系统设计面试", tag: "架构" },
  { name: "AI 应用实战", tag: "AI" },
];

export default function Sidebar() {
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const { isLoggedIn, openLoginPrompt } = useAuth();

  const toggleFollow = (userId: string) => {
    if (!isLoggedIn) { openLoginPrompt(); return; }
    setFollowed(prev => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId); else next.add(userId);
      // 同步到 localStorage
      const arr: string[] = JSON.parse(localStorage.getItem("devblog_follows") || "[]");
      if (next.has(userId)) { if (!arr.includes(userId)) arr.push(userId); }
      else { const idx = arr.indexOf(userId); if (idx >= 0) arr.splice(idx, 1); }
      localStorage.setItem("devblog_follows", JSON.stringify(arr));
      return next;
    });
  };

  return (
    <aside className="w-72 flex-shrink-0 space-y-6">
      {/* 热榜 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
          <TrendingUp size={16} className="text-orange-500" />
          热门榜单
        </div>
        <div className="space-y-3">
          {hotArticles.map((item) => (
            <Link key={item.rank} href={`/posts/${item.id}`} className="flex items-start gap-2 group">
              <span className={`text-sm font-bold w-5 text-center flex-shrink-0 ${
                item.rank <= 3 ? "text-orange-500" : "text-gray-400"
              }`}>
                {item.rank}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {item.title}
                </p>
                <p className="text-xs text-gray-400">{item.hot} 热度</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 推荐作者 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
          <Award size={16} className="text-blue-500" />
          推荐作者
        </div>
        <div className="space-y-3">
          {recommendedAuthors.map((author) => (
            <div key={author.userId} className="flex items-center gap-3">
              <Link href={`/search?q=${encodeURIComponent(author.name)}`} className="flex items-center gap-3 flex-1 min-w-0 group">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-8 h-8 rounded-full bg-gray-100"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{author.name}</p>
                  <p className="text-xs text-gray-400">{author.desc}</p>
                </div>
              </Link>
              <button
                onClick={() => toggleFollow(author.userId)}
                className={`text-xs border rounded-full px-3 py-0.5 transition-colors flex-shrink-0 ${
                  followed.has(author.userId)
                    ? "bg-gray-100 text-gray-500 border-gray-200"
                    : "text-blue-600 border-blue-200 hover:bg-blue-50"
                }`}
              >
                {followed.has(author.userId) ? "已关注" : "关注"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 推荐专栏 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
          <BookOpen size={16} className="text-green-500" />
          热门专栏
        </div>
        <div className="space-y-2">
          {hotColumns.map((col) => (
            <Link
              key={col.name}
              href={`/search?q=${encodeURIComponent(col.tag)}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span>📚</span>
              <span>{col.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

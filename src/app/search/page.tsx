"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import { Search } from "lucide-react";
import { POSTS } from "@/lib/mock-data";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<"relevance" | "newest" | "popular">("relevance");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const matched = POSTS.filter(
      p => p.title.toLowerCase().includes(q) ||
           p.summary.toLowerCase().includes(q) ||
           p.tags.some(t => t.toLowerCase().includes(q)) ||
           p.author.name.toLowerCase().includes(q) ||
           p.content.toLowerCase().includes(q)
    );
    if (sortBy === "newest") matched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (sortBy === "popular") matched.sort((a, b) => b.views - a.views);
    return matched;
  }, [query, sortBy]);

  return (
    <>
      {/* 搜索框 */}
      <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-4 py-3 mb-6">
        <Search size={20} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索文章、作者、标签..."
          className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
          autoFocus
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-xs text-gray-400 hover:text-gray-600">清除</button>
        )}
      </div>

      {/* 结果 */}
      {query.trim() ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">找到 {results.length} 篇相关文章</span>
            <div className="flex gap-2">
              {([["relevance", "最相关"], ["newest", "最新"], ["popular", "最热"]] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSortBy(key)}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    sortBy === key ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 px-4">
            {results.length === 0 ? (
              <div className="py-20 text-center text-gray-400">
                <Search size={48} className="mx-auto mb-4 text-gray-300" />
                <p>未找到与 &quot;{query}&quot; 相关的内容</p>
                <p className="text-xs mt-2">试试其他关键词？</p>
              </div>
            ) : (
              results.map(post => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <Search size={64} className="mx-auto mb-4 text-gray-200" />
          <p className="text-gray-400">输入关键词搜索文章</p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {["React", "AI", "PostgreSQL", "Docker", "Swift", "Claude"].map(tag => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="text-sm px-4 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-blue-300 hover:text-blue-600"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Suspense fallback={<div className="text-center py-20 text-gray-400">加载中...</div>}>
          <SearchContent />
        </Suspense>
      </main>
    </div>
  );
}

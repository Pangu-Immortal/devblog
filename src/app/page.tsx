"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import TagBar from "@/components/TagBar";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import { getPostsByTag } from "@/lib/mock-data";

export default function Home() {
  const [activeTag, setActiveTag] = useState("全部");
  const posts = getPostsByTag(activeTag);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 mt-2">
        <TagBar activeTag={activeTag} onTagChange={setActiveTag} />
        <div className="flex gap-6 mt-2">
          {/* 文章列表 */}
          <div className="flex-1 min-w-0 bg-white rounded-xl border border-gray-200 px-4">
            {posts.length === 0 ? (
              <div className="py-20 text-center text-gray-400">该分类暂无文章</div>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
          {/* 右侧栏 */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>
        </div>
      </main>
    </div>
  );
}

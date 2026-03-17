"use client";

import Link from "next/link";
import { Search, PenLine, Bell, User } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* 左侧 Logo + 导航 */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-blue-600 tracking-tight">
            DevBlog
          </Link>
          <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors font-medium">首页</Link>
            <span className="hover:text-blue-600 transition-colors cursor-pointer">沸点</span>
            <span className="hover:text-blue-600 transition-colors cursor-pointer">课程</span>
            <span className="hover:text-blue-600 transition-colors cursor-pointer">活动</span>
          </div>
        </div>

        {/* 右侧 搜索 + 操作 */}
        <div className="flex items-center gap-3">
          {searchOpen ? (
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5">
              <Search size={16} className="text-gray-400" />
              <input
                autoFocus
                className="bg-transparent outline-none text-sm ml-2 w-40"
                placeholder="搜索文章..."
                onBlur={() => setSearchOpen(false)}
              />
            </div>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="p-2 hover:bg-gray-100 rounded-full">
              <Search size={18} className="text-gray-500" />
            </button>
          )}
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Bell size={18} className="text-gray-500" />
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-1.5 rounded-full hover:bg-blue-700 transition-colors">
            <PenLine size={14} />
            写文章
          </button>
          <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
            <User size={16} className="text-gray-500" />
          </button>
        </div>
      </div>
    </nav>
  );
}

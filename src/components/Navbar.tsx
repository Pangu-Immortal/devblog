"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, PenLine, Bell, User, LogOut, Settings, BookOpen, Flame, LogIn } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { NOTIFICATIONS } from "@/lib/mock-extras";

const NAV_LINKS = [
  { href: "/", label: "首页" },
  { href: "/pins", label: "沸点" },
  { href: "/courses", label: "课程" },
  { href: "/events", label: "活动" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 计算未读通知数
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    try {
      const ids: string[] = JSON.parse(localStorage.getItem("devblog_read_notifications") || "[]");
      setReadIds(new Set(ids));
    } catch { /* ignore */ }
    // 监听 localStorage 变化（同一页面内自定义事件）
    const handler = () => {
      try {
        const ids: string[] = JSON.parse(localStorage.getItem("devblog_read_notifications") || "[]");
        setReadIds(new Set(ids));
      } catch { /* ignore */ }
    };
    window.addEventListener("notifications-updated", handler);
    return () => window.removeEventListener("notifications-updated", handler);
  }, []);
  const unreadCount = useMemo(() => {
    return NOTIFICATIONS.filter(n => !n.read && !readIds.has(n.id)).length;
  }, [readIds]);

  // 点击外部关闭用户菜单
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // 搜索提交
  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  // 判断当前导航是否激活（basePath 下的路径匹配）
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname === "/devblog" || pathname === "/devblog/";
    return pathname.startsWith(href) || pathname.startsWith(`/devblog${href}`);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* 左侧 Logo + 导航 */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-blue-600 tracking-tight">
            DevBlog
          </Link>
          <div className="hidden md:flex items-center gap-1 text-sm">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  isActive(link.href)
                    ? "text-blue-600 bg-blue-50 font-medium"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* 右侧 搜索 + 操作 */}
        <div className="flex items-center gap-2">
          {/* 搜索 */}
          {searchOpen ? (
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5">
              <Search size={16} className="text-gray-400" />
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleSearch(); if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); } }}
                className="bg-transparent outline-none text-sm ml-2 w-40"
                placeholder="搜索文章..."
                onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
              />
            </div>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="p-2 hover:bg-gray-100 rounded-full" title="搜索">
              <Search size={18} className="text-gray-500" />
            </button>
          )}

          {isLoggedIn ? (
            <>
              {/* 通知 */}
              <Link href="/notifications" className="relative p-2 hover:bg-gray-100 rounded-full" title="消息通知">
                <Bell size={18} className="text-gray-500" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
              </Link>

              {/* 写文章 */}
              <Link
                href="/write"
                className="flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-1.5 rounded-full hover:bg-blue-700 transition-colors"
              >
                <PenLine size={14} />
                <span className="hidden sm:inline">写文章</span>
              </Link>

              {/* 用户头像 + 下拉菜单 */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-8 h-8 rounded-full overflow-hidden hover:ring-2 hover:ring-blue-200 transition-all"
                >
                  <img
                    src={user!.avatar}
                    alt={user!.name}
                    className="w-full h-full bg-gray-200"
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-50">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user!.name}</p>
                      <p className="text-xs text-gray-400">{user!.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User size={16} /> 个人主页
                    </Link>
                    <Link
                      href="/write"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <PenLine size={16} /> 写文章
                    </Link>
                    <Link
                      href="/pins"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Flame size={16} /> 我的沸点
                    </Link>
                    <Link
                      href="/courses"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <BookOpen size={16} /> 我的课程
                    </Link>
                    <div className="border-t border-gray-100 my-1" />
                    <Link
                      href="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full"
                    >
                      <Settings size={16} /> 设置
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut size={16} /> 退出登录
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* 未登录：登录按钮 */}
              <Link
                href={`/login?redirect=${encodeURIComponent(pathname)}`}
                className="flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-1.5 rounded-full hover:bg-blue-700 transition-colors"
              >
                <LogIn size={14} />
                <span className="hidden sm:inline">登录</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 移动端导航 */}
      <div className="md:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto">
        {NAV_LINKS.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              isActive(link.href)
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

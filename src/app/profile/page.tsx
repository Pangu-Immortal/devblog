"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import { Calendar, Heart, FileText, MessageCircle, Edit3 } from "lucide-react";
import { POSTS } from "@/lib/mock-data";
import { CURRENT_USER, PINS } from "@/lib/mock-extras";
import { useAuth } from "@/lib/auth-context";

function formatCount(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + "万";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "刚刚";
  if (m < 60) return `${m} 分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} 小时前`;
  return `${Math.floor(h / 24)} 天前`;
}

export default function ProfilePage() {
  const { isLoggedIn, user: authUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.replace("/login?redirect=/profile");
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !authUser) return null;

  const [activeTab, setActiveTab] = useState<"posts" | "pins" | "likes">("posts");

  // 展示用修改后的名字/头像，筛选数据用 userId（改名不影响"资产"归属）
  const user = { ...CURRENT_USER, name: authUser.name, avatar: authUser.avatar, title: authUser.title };
  const userPosts = POSTS.filter(p => p.author.userId === CURRENT_USER.userId);
  const userPins = PINS.filter(p => p.author.userId === CURRENT_USER.userId);

  const likedPosts = POSTS.slice(0, 3); // 模拟赞过的文章

  const tabs = [
    { key: "posts" as const, label: "文章", count: userPosts.length, icon: FileText },
    { key: "pins" as const, label: "沸点", count: userPins.length, icon: MessageCircle },
    { key: "likes" as const, label: "赞过", count: likedPosts.length, icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-5">
            <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full bg-gray-100" />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{user.title}</span>
              </div>
              <p className="text-sm text-gray-500 mb-3">{user.bio}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(user.joinDate).toLocaleDateString("zh-CN")} 加入</span>
              </div>
            </div>
            <Link href="/settings" className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 px-3 py-1.5 border border-gray-200 rounded-full hover:border-blue-300">
              <Edit3 size={14} /> 编辑资料
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{formatCount(user.followers)}</div>
              <div className="text-xs text-gray-400">关注者</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{user.following}</div>
              <div className="text-xs text-gray-400">关注了</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{formatCount(user.totalViews)}</div>
              <div className="text-xs text-gray-400">总阅读</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{formatCount(user.totalLikes)}</div>
              <div className="text-xs text-gray-400">总获赞</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-white rounded-xl border border-gray-200 p-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 flex-1 justify-center py-2 rounded-lg text-sm transition-colors ${
                activeTab === tab.key ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <tab.icon size={14} />
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "posts" && (
          <div className="bg-white rounded-xl border border-gray-200 px-4">
            {userPosts.length === 0 ? (
              <div className="py-20 text-center text-gray-400">暂无文章</div>
            ) : (
              userPosts.map(post => <PostCard key={post.id} post={post} />)
            )}
          </div>
        )}

        {activeTab === "pins" && (
          <div className="space-y-4">
            {userPins.length === 0 ? (
              <div className="py-20 text-center text-gray-400">暂无沸点</div>
            ) : (
              userPins.map(pin => (
                <div key={pin.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-2">{pin.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>{timeAgo(pin.createdAt)}</span>
                    <span>{pin.likes} 赞</span>
                    <span>{pin.comments} 评论</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "likes" && (
          <div className="bg-white rounded-xl border border-gray-200 px-4">
            {likedPosts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </main>
    </div>
  );
}

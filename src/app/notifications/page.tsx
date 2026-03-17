"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Heart, MessageCircle, UserPlus, Bell, CheckCheck } from "lucide-react";
import { NOTIFICATIONS } from "@/lib/mock-extras";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "刚刚";
  if (m < 60) return `${m} 分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} 小时前`;
  return `${Math.floor(h / 24)} 天前`;
}

const typeIcons = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  system: Bell,
};

const typeColors = {
  like: "text-red-500 bg-red-50",
  comment: "text-blue-500 bg-blue-50",
  follow: "text-green-500 bg-green-50",
  system: "text-orange-500 bg-orange-50",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState("all");
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const filtered = filter === "all" ? notifications :
    filter === "unread" ? notifications.filter(n => !n.read) :
    notifications.filter(n => n.type === filter);

  const filters = [
    { key: "all", label: "全部" },
    { key: "unread", label: `未读 (${unreadCount})` },
    { key: "like", label: "点赞" },
    { key: "comment", label: "评论" },
    { key: "follow", label: "关注" },
    { key: "system", label: "系统" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">消息通知</h1>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
              <CheckCheck size={16} /> 全部已读
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                filter === f.key ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Bell size={48} className="mx-auto mb-4 text-gray-200" />
              <p>暂无通知</p>
            </div>
          ) : (
            filtered.map(n => {
              const Icon = typeIcons[n.type];
              return (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                    n.read ? "bg-white border-gray-200" : "bg-blue-50/50 border-blue-200"
                  } hover:bg-gray-50`}
                >
                  {n.from ? (
                    <img src={n.from.avatar} alt="" className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0" />
                  ) : (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${typeColors[n.type]}`}>
                      <Icon size={18} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {n.from && <span className="text-sm font-medium text-gray-900">{n.from.name}</span>}
                      <span className="text-sm text-gray-600">{n.content}</span>
                      {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                    </div>
                    {n.postTitle && (
                      <Link href={`/posts/${n.postId}`} className="text-sm text-blue-600 hover:underline line-clamp-1">
                        {n.postTitle}
                      </Link>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${typeColors[n.type]}`}>
                    <Icon size={14} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Heart, MessageCircle, Share2, ImageIcon } from "lucide-react";
import { PINS, PIN_TOPICS } from "@/lib/mock-extras";
import { useAuth } from "@/lib/auth-context";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "刚刚";
  if (m < 60) return `${m} 分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} 小时前`;
  return `${Math.floor(h / 24)} 天前`;
}

export default function PinsPage() {
  const [activeTopic, setActiveTopic] = useState("推荐");
  const [likedPins, setLikedPins] = useState<Set<string>>(new Set());
  const { isLoggedIn, openLoginPrompt } = useAuth();

  const filtered = activeTopic === "推荐" ? PINS : PINS.filter(p => p.topic === activeTopic);

  const toggleLike = (id: string) => {
    if (!isLoggedIn) { openLoginPrompt(); return; }
    setLikedPins(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-4">沸点</h1>

        {/* 话题筛选 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {PIN_TOPICS.map(topic => (
            <button
              key={topic}
              onClick={() => setActiveTopic(topic)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeTopic === topic
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* 发布框 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <textarea
            className="w-full resize-none text-sm text-gray-700 placeholder-gray-400 outline-none"
            rows={3}
            placeholder="说点什么..."
          />
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-600">
              <ImageIcon size={16} /> 图片
            </button>
            <button
              onClick={() => { if (!isLoggedIn) { openLoginPrompt(); return; } }}
              className="bg-blue-600 text-white text-sm px-6 py-1.5 rounded-full hover:bg-blue-700"
            >
              发布
            </button>
          </div>
        </div>

        {/* 沸点列表 */}
        <div className="space-y-4">
          {filtered.map(pin => (
            <div key={pin.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <img src={pin.author.avatar} alt={pin.author.name} className="w-9 h-9 rounded-full bg-gray-100" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{pin.author.name}</span>
                    <span className="text-xs text-gray-400">{pin.author.title}</span>
                  </div>
                  <span className="text-xs text-gray-400">{timeAgo(pin.createdAt)}</span>
                </div>
                {pin.topic && (
                  <span className="ml-auto text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{pin.topic}</span>
                )}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-3">{pin.content}</p>
              <div className="flex items-center gap-6 text-gray-400">
                <button
                  onClick={() => toggleLike(pin.id)}
                  className={`flex items-center gap-1 text-sm hover:text-red-500 transition-colors ${likedPins.has(pin.id) ? "text-red-500" : ""}`}
                >
                  <Heart size={16} fill={likedPins.has(pin.id) ? "currentColor" : "none"} />
                  {pin.likes + (likedPins.has(pin.id) ? 1 : 0)}
                </button>
                <button className="flex items-center gap-1 text-sm hover:text-blue-500">
                  <MessageCircle size={16} /> {pin.comments}
                </button>
                <button className="flex items-center gap-1 text-sm hover:text-green-500">
                  <Share2 size={16} /> 分享
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

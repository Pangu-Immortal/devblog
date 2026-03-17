"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth-context";
import { ArrowLeft, Camera, Save } from "lucide-react";

// 头像种子列表，提供可选的头像风格
const AVATAR_SEEDS = [
  "Felix", "Dusty", "Mimi", "Aneka", "Luna", "Sage", "Pixel", "Nova",
  "Echo", "Blaze", "Coral", "Drift", "Fern", "Glow", "Haze", "Iris",
];

export default function SettingsPage() {
  const { isLoggedIn, user, updateUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.replace("/login?redirect=/settings");
  }, [isLoggedIn, router]);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [saved, setSaved] = useState(false);

  // 从 localStorage 加载用户扩展信息
  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setTitle(user.title);
    setSelectedAvatar(user.avatar);
    try {
      const extra = JSON.parse(localStorage.getItem("devblog_user_extra") || "{}");
      setBio(extra.bio || "热爱开源，专注技术分享。");
    } catch {
      setBio("热爱开源，专注技术分享。");
    }
  }, [user]);

  if (!isLoggedIn || !user) return null;

  const handleSave = () => {
    // 通过 AuthContext 更新用户信息（同步 React state + localStorage）
    updateUser({ name, title, avatar: selectedAvatar });
    localStorage.setItem("devblog_user_extra", JSON.stringify({ bio }));
    // 更新注册用户列表中对应的用户
    try {
      const users = JSON.parse(localStorage.getItem("devblog_users") || "[]");
      const idx = users.findIndex((u: { email: string }) => u.email === user.email);
      if (idx >= 0) {
        users[idx] = { ...users[idx], name, title, avatar: selectedAvatar };
        localStorage.setItem("devblog_users", JSON.stringify(users));
      }
    } catch { /* ignore */ }
    setSaved(true);
    setTimeout(() => router.push("/profile"), 800);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <Link href="/profile" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-6">
          <ArrowLeft size={16} /> 返回个人主页
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-6">编辑资料</h1>

          {/* 头像选择 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Camera size={14} className="inline mr-1" /> 选择头像
            </label>
            <div className="flex items-center gap-4 mb-4">
              <img src={selectedAvatar} alt="当前头像" className="w-16 h-16 rounded-full bg-gray-100 border-2 border-blue-400" />
              <div className="text-sm text-gray-500">点击下方头像切换</div>
            </div>
            <div className="grid grid-cols-8 gap-2">
              {AVATAR_SEEDS.map(seed => {
                const url = `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`;
                return (
                  <button
                    key={seed}
                    onClick={() => setSelectedAvatar(url)}
                    className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                      selectedAvatar === url ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <img src={url} alt={seed} className="w-full h-full bg-gray-100" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* 昵称 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">昵称</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400"
              placeholder="你的昵称"
            />
          </div>

          {/* 头衔 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">头衔</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400"
              placeholder="例如：全栈工程师"
            />
          </div>

          {/* 个人简介 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 resize-none"
              placeholder="介绍一下自己..."
            />
          </div>

          {/* 保存按钮 */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Save size={16} /> 保存修改
            </button>
            {saved && <span className="text-sm text-green-600">保存成功，正在跳转...</span>}
          </div>
        </div>
      </main>
    </div>
  );
}

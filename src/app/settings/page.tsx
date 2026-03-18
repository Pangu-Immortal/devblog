"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth-context";
import { ALL_AVATARS, AVATAR_GROUPS } from "@/lib/avatars";
import { ArrowLeft, Camera, Save } from "lucide-react";

// 风格 Tab 名称列表
const STYLE_TABS = ["全部", ...Object.keys(AVATAR_GROUPS)] as const;

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
  const [activeTab, setActiveTab] = useState<string>("全部"); // 当前风格 Tab

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

  // 根据 Tab 过滤头像列表
  const displayAvatars = activeTab === "全部"
    ? ALL_AVATARS
    : (AVATAR_GROUPS[activeTab] ?? ALL_AVATARS);

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
              <div className="text-sm text-gray-500">点击下方头像切换（共 {ALL_AVATARS.length} 个）</div>
            </div>

            {/* 风格 Tab 切换 */}
            <div className="flex gap-2 mb-3 flex-wrap">
              {STYLE_TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    activeTab === tab
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {tab}
                  {tab !== "全部" && <span className="ml-1 opacity-60">({(AVATAR_GROUPS[tab] ?? []).length})</span>}
                </button>
              ))}
            </div>

            {/* 头像网格（10 列，可滚动） */}
            <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-100 p-2">
              <div className="grid grid-cols-10 gap-2">
                {displayAvatars.map((url, i) => (
                  <button
                    key={`${activeTab}-${i}`}
                    onClick={() => setSelectedAvatar(url)}
                    className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedAvatar === url ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <img src={url} alt={`头像 ${i + 1}`} className="w-full h-full bg-gray-100" />
                  </button>
                ))}
              </div>
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

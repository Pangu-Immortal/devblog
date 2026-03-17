"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function LoginPrompt() {
  const { showLoginPrompt, closeLoginPrompt } = useAuth();
  const pathname = usePathname();

  if (!showLoginPrompt) return null;

  const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/40" onClick={closeLoginPrompt} />
      {/* 弹窗 */}
      <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm mx-4 text-center">
        <button onClick={closeLoginPrompt} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <LogIn size={28} className="text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">请先登录</h3>
        <p className="text-sm text-gray-500 mb-6">登录后即可进行点赞、评论、关注等操作</p>
        <div className="flex gap-3">
          <Link
            href={redirectUrl}
            onClick={closeLoginPrompt}
            className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            去登录
          </Link>
          <button
            onClick={closeLoginPrompt}
            className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}

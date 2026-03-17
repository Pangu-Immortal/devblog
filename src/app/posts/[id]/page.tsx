import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, ThumbsUp, MessageCircle, Share2, Bookmark } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getPostById, POSTS } from "@/lib/mock-data";

export function generateStaticParams() {
  return POSTS.map((post) => ({ id: post.id }));
}

function formatCount(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + "万";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

export default async function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = getPostById(id);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 返回 */}
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-6">
          <ArrowLeft size={16} />
          返回首页
        </Link>

        <article className="bg-white rounded-xl border border-gray-200 p-8">
          {/* 标题 */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>

          {/* 作者信息 */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full bg-gray-100"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{post.author.name}</span>
                <span className="text-xs text-gray-400">{post.author.title}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                <span>{new Date(post.createdAt).toLocaleDateString("zh-CN")}</span>
                <span className="flex items-center gap-0.5"><Eye size={12} /> {formatCount(post.views)}</span>
              </div>
            </div>
            <button className="ml-auto text-sm text-blue-600 border border-blue-200 rounded-full px-4 py-1 hover:bg-blue-50">
              关注
            </button>
          </div>

          {/* 标签 */}
          <div className="flex gap-2 mb-6">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {/* 正文 — Markdown 渲染简化版 */}
          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px]">
            {post.content}
          </div>

          {/* 底部操作栏 */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors">
                <ThumbsUp size={18} />
                <span className="text-sm">{formatCount(post.likes)}</span>
              </button>
              <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors">
                <MessageCircle size={18} />
                <span className="text-sm">{formatCount(post.comments)}</span>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors">
                <Bookmark size={18} />
                <span className="text-sm">收藏</span>
              </button>
              <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors">
                <Share2 size={18} />
                <span className="text-sm">分享</span>
              </button>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}

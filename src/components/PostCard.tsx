import Link from "next/link";
import { Eye, ThumbsUp, MessageCircle } from "lucide-react";
import type { Post } from "@/lib/mock-data";

function formatCount(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + "万";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "刚刚";
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} 天前`;
  return `${Math.floor(days / 30)} 月前`;
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.id}`} className="block">
      <article className="py-4 border-b border-gray-100 hover:bg-gray-50/50 px-4 -mx-4 transition-colors group">
        <div className="flex gap-4">
          {/* 文章内容 */}
          <div className="flex-1 min-w-0">
            {/* 作者信息 */}
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1.5">
              <span className="text-gray-600 font-medium">{post.author.name}</span>
              <span>·</span>
              <span>{timeAgo(post.createdAt)}</span>
              <span>·</span>
              {post.tags.map(tag => (
                <span key={tag} className="text-blue-500">{tag}</span>
              ))}
            </div>

            {/* 标题 */}
            <h2 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
              {post.title}
            </h2>

            {/* 摘要 */}
            <p className="text-sm text-gray-500 line-clamp-2 mb-2">
              {post.summary}
            </p>

            {/* 统计数据 */}
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Eye size={13} />
                {formatCount(post.views)}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp size={13} />
                {formatCount(post.likes)}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={13} />
                {formatCount(post.comments)}
              </span>
            </div>
          </div>

          {/* 封面图占位 */}
          {post.coverImage && (
            <div className="w-28 h-20 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
              <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

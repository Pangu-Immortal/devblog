"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, Heart, MessageCircle, Share2, Bookmark, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { getCommentsByPostId } from "@/lib/mock-extras";
import { useAuth } from "@/lib/auth-context";
import type { Post } from "@/lib/mock-data";
import type { Comment } from "@/lib/mock-extras";

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
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} 天前`;
  return new Date(dateStr).toLocaleDateString("zh-CN");
}

function CommentItem({ comment, onReply, onLike, likedComments }: {
  comment: Comment;
  onReply: (parentId: string) => void;
  onLike: (id: string) => void;
  likedComments: Set<string>;
}) {
  return (
    <div className="py-4 border-b border-gray-50 last:border-0">
      <div className="flex items-start gap-3">
        <img src={comment.author.avatar} alt={comment.author.name} className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900">{comment.author.name}</span>
            <span className="text-xs text-gray-400">{comment.author.title}</span>
            <span className="text-xs text-gray-400 ml-auto">{timeAgo(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => onLike(comment.id)}
              className={`flex items-center gap-1 text-xs transition-colors ${
                likedComments.has(comment.id) ? "text-red-500" : "text-gray-400 hover:text-red-500"
              }`}
            >
              <Heart size={14} fill={likedComments.has(comment.id) ? "currentColor" : "none"} />
              {comment.likes + (likedComments.has(comment.id) ? 1 : 0)}
            </button>
            <button
              onClick={() => onReply(comment.id)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500"
            >
              <MessageCircle size={14} /> 回复
            </button>
          </div>
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 pl-3 border-l-2 border-gray-100 space-y-3">
              {comment.replies.map(reply => (
                <div key={reply.id} className="flex items-start gap-2">
                  <img src={reply.author.avatar} alt="" className="w-6 h-6 rounded-full bg-gray-100 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium text-gray-900">{reply.author.name}</span>
                      <span className="text-xs text-gray-400">{timeAgo(reply.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600">{reply.content}</p>
                    <button
                      onClick={() => onLike(reply.id)}
                      className={`flex items-center gap-1 text-xs mt-1 transition-colors ${
                        likedComments.has(reply.id) ? "text-red-500" : "text-gray-400 hover:text-red-500"
                      }`}
                    >
                      <Heart size={12} fill={likedComments.has(reply.id) ? "currentColor" : "none"} />
                      {reply.likes + (likedComments.has(reply.id) ? 1 : 0)}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PostDetailClient({ post }: { post: Post }) {
  const id = post.id;
  const { isLoggedIn, openLoginPrompt, user: authUser } = useAuth();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [userComments, setUserComments] = useState<{ id: string; content: string; createdAt: string }[]>([]);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState(false);

  useEffect(() => {
    try {
      const likes: string[] = JSON.parse(localStorage.getItem("devblog_likes") || "[]");
      setLiked(likes.includes(id));
      const bookmarks: string[] = JSON.parse(localStorage.getItem("devblog_bookmarks") || "[]");
      setBookmarked(bookmarks.includes(id));
      const follows: string[] = JSON.parse(localStorage.getItem("devblog_follows") || "[]");
      setFollowed(follows.includes(post.author.name));
      const likeCounts = JSON.parse(localStorage.getItem("devblog_like_counts") || "{}");
      setLikeCount(likeCounts[id] || 0);
      const uc = JSON.parse(localStorage.getItem("devblog_user_comments") || "[]");
      setUserComments(uc.filter((c: { postId: string }) => c.postId === id));
      const lc: string[] = JSON.parse(localStorage.getItem("devblog_liked_comments") || "[]");
      setLikedComments(new Set(lc));
    } catch { /* ignore */ }

    const viewKey = `devblog_viewed_${id}`;
    if (!sessionStorage.getItem(viewKey)) {
      sessionStorage.setItem(viewKey, "1");
      const views = JSON.parse(localStorage.getItem("devblog_views") || "{}");
      views[id] = (views[id] || 0) + 1;
      localStorage.setItem("devblog_views", JSON.stringify(views));
      setViewCount(views[id]);
    } else {
      const views = JSON.parse(localStorage.getItem("devblog_views") || "{}");
      setViewCount(views[id] || 0);
    }
  }, [id, post.author.name]);

  const mockComments = getCommentsByPostId(id);

  const toggleLike = () => {
    if (!isLoggedIn) { openLoginPrompt(); return; }
    const newLiked = !liked;
    setLiked(newLiked);
    const delta = newLiked ? 1 : -1;
    setLikeCount(prev => prev + delta);
    const likes: string[] = JSON.parse(localStorage.getItem("devblog_likes") || "[]");
    if (newLiked) likes.push(id); else likes.splice(likes.indexOf(id), 1);
    localStorage.setItem("devblog_likes", JSON.stringify(likes));
    const counts = JSON.parse(localStorage.getItem("devblog_like_counts") || "{}");
    counts[id] = (counts[id] || 0) + delta;
    localStorage.setItem("devblog_like_counts", JSON.stringify(counts));
  };

  const toggleBookmark = () => {
    if (!isLoggedIn) { openLoginPrompt(); return; }
    const newVal = !bookmarked;
    setBookmarked(newVal);
    const arr: string[] = JSON.parse(localStorage.getItem("devblog_bookmarks") || "[]");
    if (newVal) arr.push(id); else arr.splice(arr.indexOf(id), 1);
    localStorage.setItem("devblog_bookmarks", JSON.stringify(arr));
  };

  const toggleFollow = () => {
    if (!isLoggedIn) { openLoginPrompt(); return; }
    const newVal = !followed;
    setFollowed(newVal);
    const arr: string[] = JSON.parse(localStorage.getItem("devblog_follows") || "[]");
    if (newVal) arr.push(post.author.name); else arr.splice(arr.indexOf(post.author.name), 1);
    localStorage.setItem("devblog_follows", JSON.stringify(arr));
  };

  const handleShare = async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch { /* fallback */ }
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  const toggleCommentLike = (commentId: string) => {
    if (!isLoggedIn) { openLoginPrompt(); return; }
    setLikedComments(prev => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId); else next.add(commentId);
      localStorage.setItem("devblog_liked_comments", JSON.stringify([...next]));
      return next;
    });
  };

  const submitComment = () => {
    if (!isLoggedIn) { openLoginPrompt(); return; }
    if (!commentText.trim()) return;
    const nc = { id: `uc_${Date.now()}`, postId: id, content: commentText.trim(), createdAt: new Date().toISOString() };
    const updated = [nc, ...userComments];
    setUserComments(updated);
    setCommentText("");
    setReplyingTo(null);
    const all = JSON.parse(localStorage.getItem("devblog_user_comments") || "[]");
    all.unshift(nc);
    localStorage.setItem("devblog_user_comments", JSON.stringify(all));
  };

  const totalComments = mockComments.length + mockComments.reduce((a, c) => a + (c.replies?.length || 0), 0) + userComments.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-6">
          <ArrowLeft size={16} /> 返回首页
        </Link>

        <article className="bg-white rounded-xl border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>

          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
            <Link href="/profile">
              <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full bg-gray-100 hover:ring-2 hover:ring-blue-200 transition-all" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Link href="/profile" className="text-sm font-medium text-gray-900 hover:text-blue-600">{post.author.name}</Link>
                <span className="text-xs text-gray-400">{post.author.title}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                <span>{new Date(post.createdAt).toLocaleDateString("zh-CN")}</span>
                <span className="flex items-center gap-0.5"><Eye size={12} /> {formatCount(post.views + viewCount)}</span>
              </div>
            </div>
            <button
              onClick={toggleFollow}
              className={`ml-auto text-sm border rounded-full px-4 py-1 transition-colors ${
                followed ? "bg-gray-100 text-gray-500 border-gray-200" : "text-blue-600 border-blue-200 hover:bg-blue-50"
              }`}
            >
              {followed ? "已关注" : "关注"}
            </button>
          </div>

          <div className="flex gap-2 mb-6">
            {post.tags.map(tag => (
              <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full hover:bg-blue-100 transition-colors">
                {tag}
              </Link>
            ))}
          </div>

          <div className="max-w-none">
            <MarkdownRenderer content={post.content} />
          </div>

          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100 relative">
            <div className="flex items-center gap-6">
              <button onClick={toggleLike} className={`flex items-center gap-1.5 transition-colors ${liked ? "text-red-500" : "text-gray-500 hover:text-red-500"}`}>
                <Heart size={18} fill={liked ? "currentColor" : "none"} />
                <span className="text-sm">{formatCount(post.likes + likeCount)}</span>
              </button>
              <a href="#comments" className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors">
                <MessageCircle size={18} />
                <span className="text-sm">{totalComments}</span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={toggleBookmark} className={`flex items-center gap-1.5 transition-colors ${bookmarked ? "text-yellow-500" : "text-gray-500 hover:text-yellow-500"}`}>
                <Bookmark size={18} fill={bookmarked ? "currentColor" : "none"} />
                <span className="text-sm">{bookmarked ? "已收藏" : "收藏"}</span>
              </button>
              <button onClick={handleShare} className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors">
                <Share2 size={18} />
                <span className="text-sm">分享</span>
              </button>
            </div>
            {shareToast && (
              <div className="absolute -top-10 right-0 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg">链接已复制到剪贴板</div>
            )}
          </div>
        </article>

        {/* 评论区 */}
        <div id="comments" className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">评论 ({totalComments})</h3>
          <div className="flex items-start gap-3 mb-6 pb-6 border-b border-gray-100">
            <img src={authUser?.avatar || "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix"} alt="我" className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0" />
            <div className="flex-1">
              {replyingTo && (
                <div className="text-xs text-blue-600 mb-2 flex items-center gap-2">
                  回复评论中 <button onClick={() => setReplyingTo(null)} className="text-gray-400 hover:text-gray-600">取消</button>
                </div>
              )}
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onFocus={() => { if (!isLoggedIn) { openLoginPrompt(); } }}
                placeholder={isLoggedIn ? "写下你的评论..." : "登录后发表评论..."}
                rows={3}
                className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-300 resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={submitComment}
                  disabled={!commentText.trim()}
                  className="flex items-center gap-1 bg-blue-600 text-white text-sm px-4 py-1.5 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={14} /> 发表评论
                </button>
              </div>
            </div>
          </div>

          {userComments.map(uc => (
            <div key={uc.id} className="py-4 border-b border-gray-50">
              <div className="flex items-start gap-3">
                <img src={authUser?.avatar || "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix"} alt="我" className="w-8 h-8 rounded-full bg-gray-100" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">{authUser?.name || "我"}</span>
                    <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">作者</span>
                    <span className="text-xs text-gray-400">{timeAgo(uc.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700">{uc.content}</p>
                </div>
              </div>
            </div>
          ))}

          {mockComments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={(parentId) => { setReplyingTo(parentId); }}
              onLike={toggleCommentLike}
              likedComments={likedComments}
            />
          ))}

          {mockComments.length === 0 && userComments.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <MessageCircle size={32} className="mx-auto mb-2 text-gray-300" />
              <p>暂无评论，来说第一句吧</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

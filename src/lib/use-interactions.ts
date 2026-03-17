/**
 * 全局交互状态管理 — localStorage 持久化
 * 管理点赞、收藏、关注等用户行为状态
 */
"use client";

import { useState, useEffect, useCallback } from "react";

// ── 通用 Set 状态 Hook（localStorage 持久化） ──
function usePersistedSet(key: string): [Set<string>, (id: string) => boolean] {
  const [items, setItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) setItems(new Set(JSON.parse(stored)));
    } catch { /* ignore */ }
  }, [key]);

  const toggle = useCallback((id: string) => {
    setItems((prev) => {
      const next = new Set(prev);
      const added = !next.has(id);
      if (added) next.add(id); else next.delete(id);
      localStorage.setItem(key, JSON.stringify([...next]));
      return next;
    });
    return !items.has(id); // 返回操作后的状态
  }, [key, items]);

  return [items, toggle];
}

// ── 通用计数器 Hook（localStorage 持久化） ──
function usePersistedCounts(key: string): [Record<string, number>, (id: string, delta: number) => void] {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) setCounts(JSON.parse(stored));
    } catch { /* ignore */ }
  }, [key]);

  const update = useCallback((id: string, delta: number) => {
    setCounts((prev) => {
      const next = { ...prev, [id]: (prev[id] || 0) + delta };
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  }, [key]);

  return [counts, update];
}

// ── 点赞 Hook ──
export function useLikes() {
  const [liked, toggleLike] = usePersistedSet("devblog_likes");
  const [extraCounts, updateCount] = usePersistedCounts("devblog_like_counts");

  const toggle = useCallback((id: string) => {
    const wasLiked = liked.has(id);
    toggleLike(id);
    updateCount(id, wasLiked ? -1 : 1);
  }, [liked, toggleLike, updateCount]);

  const isLiked = useCallback((id: string) => liked.has(id), [liked]);
  const getExtraCount = useCallback((id: string) => extraCounts[id] || 0, [extraCounts]);

  return { isLiked, toggle, getExtraCount };
}

// ── 收藏 Hook ──
export function useBookmarks() {
  const [bookmarked, toggleBookmark] = usePersistedSet("devblog_bookmarks");

  const isBookmarked = useCallback((id: string) => bookmarked.has(id), [bookmarked]);
  const toggle = useCallback((id: string) => { toggleBookmark(id); }, [toggleBookmark]);

  return { isBookmarked, toggle };
}

// ── 关注 Hook ──
export function useFollows() {
  const [followed, toggleFollow] = usePersistedSet("devblog_follows");

  const isFollowed = useCallback((name: string) => followed.has(name), [followed]);
  const toggle = useCallback((name: string) => { toggleFollow(name); }, [toggleFollow]);

  return { isFollowed, toggle };
}

// ── 浏览量 Hook（每次访问自增，同一会话不重复计） ──
export function useViews() {
  const [extraViews, updateView] = usePersistedCounts("devblog_views");
  // 浏览记录通过 sessionStorage 管理，不需要持久化 Set

  const recordView = useCallback((id: string) => {
    const sessionKey = `devblog_viewed_${id}`;
    if (typeof window !== "undefined" && !sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, "1");
      updateView(id, 1);
    }
  }, [updateView]);

  const getExtraViews = useCallback((id: string) => extraViews[id] || 0, [extraViews]);

  return { recordView, getExtraViews };
}

// ── 评论存储 Hook ──
export interface UserComment {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
  likes: number;
  parentId?: string; // 回复的评论 ID
}

export function useUserComments() {
  const [comments, setComments] = useState<UserComment[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("devblog_user_comments");
      if (stored) setComments(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const addComment = useCallback((postId: string, content: string, parentId?: string) => {
    const newComment: UserComment = {
      id: `uc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      postId,
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      parentId,
    };
    setComments((prev) => {
      const next = [newComment, ...prev];
      localStorage.setItem("devblog_user_comments", JSON.stringify(next));
      return next;
    });
    return newComment;
  }, []);

  const getByPostId = useCallback((postId: string) => {
    return comments.filter((c) => c.postId === postId);
  }, [comments]);

  return { comments, addComment, getByPostId };
}

"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { PRESET_USERS, type StoredUser } from "./users";
import { getRandomAvatar } from "./avatars";

// 用户信息
export interface AuthUser {
  userId: string;
  name: string;
  avatar: string;
  title: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  updateUser: (updates: Partial<Omit<AuthUser, "userId">>) => void; // 更新当前用户信息，userId 不可变
  showLoginPrompt: boolean;     // 是否显示登录弹窗
  openLoginPrompt: () => void;  // 打开登录弹窗
  closeLoginPrompt: () => void; // 关闭登录弹窗
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = "devblog_users";
const CURRENT_USER_KEY = "devblog_current_user";

// 简单 base64 编码（仅模拟，非安全加密）
const encode = (s: string) => typeof btoa !== "undefined" ? btoa(s) : s;
const decode = (s: string) => typeof atob !== "undefined" ? atob(s) : s;

// 生成 URL 安全的唯一 userId（nanoid 风格，21 字符，碰撞概率极低）
const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-";
function generateUserId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(21));
  let id = "u_";
  for (let i = 0; i < 21; i++) id += ALPHABET[bytes[i] & 63]; // 6 bit per char
  return id;
}

// 预置账号直接引用 users.ts 中的 PRESET_USERS
const DEFAULT_USERS = PRESET_USERS;

function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      // 首次访问，初始化 4 个默认账号
      localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return [...DEFAULT_USERS];
    }
    const users: StoredUser[] = JSON.parse(raw);
    // 兼容旧数据：确保所有默认用户都存在
    let updated = false;
    for (const du of DEFAULT_USERS) {
      if (!users.some(u => u.userId === du.userId)) {
        users.push(du);
        updated = true;
      }
    }
    if (updated) localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return users;
  } catch {
    return [...DEFAULT_USERS];
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // 初始化：从 localStorage 恢复登录状态
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      if (raw) setUser(JSON.parse(raw));
      // 确保预置账号存在
      getStoredUsers();
    } catch { /* ignore */ }
  }, []);

  const login = useCallback((email: string, password: string) => {
    const users = getStoredUsers();
    const found = users.find(u => u.email === email && decode(u.password) === password);
    if (!found) return { ok: false, error: "邮箱或密码错误" };
    const authUser: AuthUser = { userId: found.userId, name: found.name, avatar: found.avatar, title: found.title, email: found.email };
    setUser(authUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authUser));
    return { ok: true };
  }, []);

  const register = useCallback((name: string, email: string, password: string) => {
    const users = getStoredUsers();
    if (users.some(u => u.email === email)) return { ok: false, error: "该邮箱已被注册" };
    const userId = generateUserId();
    // 已分配的头像列表，避免新用户头像重复
    const usedAvatars = users.map(u => u.avatar);
    const newUser: StoredUser = {
      userId,
      name,
      email,
      password: encode(password),
      avatar: getRandomAvatar(usedAvatars), // 从 100 个头像池随机选取
      title: "开发者",
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    // 自动登录
    const authUser: AuthUser = { userId, name: newUser.name, avatar: newUser.avatar, title: newUser.title, email: newUser.email };
    setUser(authUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authUser));
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  }, []);

  const updateUser = useCallback((updates: Partial<Omit<AuthUser, "userId">>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates, userId: prev.userId }; // userId 不可变
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
      // 同步更新 users 列表中对应用户的信息
      try {
        const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
        const idx = users.findIndex(u => u.userId === prev.userId);
        if (idx >= 0) {
          users[idx] = { ...users[idx], ...updates, userId: prev.userId };
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
      } catch { /* ignore */ }
      return updated;
    });
  }, []);

  const openLoginPrompt = useCallback(() => setShowLoginPrompt(true), []);
  const closeLoginPrompt = useCallback(() => setShowLoginPrompt(false), []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      login,
      register,
      logout,
      updateUser,
      showLoginPrompt,
      openLoginPrompt,
      closeLoginPrompt,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

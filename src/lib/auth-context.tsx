"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

// 用户信息
export interface AuthUser {
  name: string;
  avatar: string;
  title: string;
  email: string;
}

// 注册时存储的用户记录（含密码）
interface StoredUser extends AuthUser {
  password: string; // base64 编码
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void; // 更新当前用户信息
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

// 预置默认账号
const DEFAULT_USER: StoredUser = {
  name: "张三丰",
  email: "test@devblog.com",
  password: encode("123456"),
  avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix",
  title: "全栈工程师",
};

function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      // 首次访问，初始化默认账号
      localStorage.setItem(USERS_KEY, JSON.stringify([DEFAULT_USER]));
      return [DEFAULT_USER];
    }
    return JSON.parse(raw);
  } catch {
    return [DEFAULT_USER];
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
    const authUser: AuthUser = { name: found.name, avatar: found.avatar, title: found.title, email: found.email };
    setUser(authUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authUser));
    return { ok: true };
  }, []);

  const register = useCallback((name: string, email: string, password: string) => {
    const users = getStoredUsers();
    if (users.some(u => u.email === email)) return { ok: false, error: "该邮箱已被注册" };
    // 基于名字生成头像种子
    const seed = name + Date.now();
    const newUser: StoredUser = {
      name,
      email,
      password: encode(password),
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(seed)}`,
      title: "开发者",
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    // 自动登录
    const authUser: AuthUser = { name: newUser.name, avatar: newUser.avatar, title: newUser.title, email: newUser.email };
    setUser(authUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authUser));
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  }, []);

  const updateUser = useCallback((updates: Partial<AuthUser>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
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

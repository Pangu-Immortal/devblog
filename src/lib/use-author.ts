/**
 * useAuthorDisplay — 根据 userId 获取作者最新显示信息
 * 如果 author.userId 等于当前登录用户的 userId，返回登录用户的最新 name/avatar/title
 */
import { useAuth } from "./auth-context";
import type { Author } from "./mock-data";

export function useAuthorDisplay(author: Author): Author {
  const { user } = useAuth();
  if (user && author.userId === user.userId) {
    return { ...author, name: user.name, avatar: user.avatar, title: user.title };
  }
  return author;
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Eye, Edit3, Send, ImageIcon, Link2, Code, Bold, Italic, List, ListOrdered, Quote, Heading2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const TOOLBAR_ITEMS = [
  { icon: Bold, label: "加粗", prefix: "**", suffix: "**" },
  { icon: Italic, label: "斜体", prefix: "*", suffix: "*" },
  { icon: Heading2, label: "标题", prefix: "## ", suffix: "" },
  { icon: Code, label: "代码", prefix: "`", suffix: "`" },
  { icon: Quote, label: "引用", prefix: "> ", suffix: "" },
  { icon: List, label: "无序列表", prefix: "- ", suffix: "" },
  { icon: ListOrdered, label: "有序列表", prefix: "1. ", suffix: "" },
  { icon: Link2, label: "链接", prefix: "[", suffix: "](url)" },
];

export default function WritePage() {
  const { isLoggedIn, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !isLoggedIn) router.replace("/login?redirect=/write");
  }, [isHydrated, isLoggedIn, router]);

  if (!isHydrated || !isLoggedIn) return null;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [preview, setPreview] = useState(false);
  const [published, setPublished] = useState(false);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag));

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) return;
    setPublished(true);
  };

  if (published) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">文章发布成功！</h2>
          <p className="text-gray-500 mb-6">你的文章已提交审核，审核通过后将展示在首页。</p>
          <div className="flex gap-3 justify-center">
            <Link href="/" className="px-6 py-2 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700">返回首页</Link>
            <button onClick={() => { setPublished(false); setTitle(""); setContent(""); setTags([]); }}
              className="px-6 py-2 border border-gray-200 text-sm rounded-full text-gray-600 hover:bg-gray-50">
              继续写文章
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">写文章</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-gray-100"
            >
              {preview ? <Edit3 size={16} /> : <Eye size={16} />}
              {preview ? "编辑" : "预览"}
            </button>
            <button
              onClick={handlePublish}
              disabled={!title.trim() || !content.trim()}
              className="flex items-center gap-1.5 bg-blue-600 text-white text-sm px-5 py-1.5 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={14} /> 发布
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* Title */}
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="请输入文章标题..."
            className="w-full text-2xl font-bold text-gray-900 placeholder-gray-300 outline-none mb-4"
          />

          {/* Tags */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
            {tags.map(t => (
              <span key={t} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                {t}
                <button onClick={() => removeTag(t)} className="hover:text-red-500">×</button>
              </span>
            ))}
            {tags.length < 5 && (
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                placeholder="添加标签（回车确认）"
                className="text-sm outline-none text-gray-500 placeholder-gray-300 w-40"
              />
            )}
          </div>

          {preview ? (
            /* Preview */
            <div className="min-h-[400px]">
              <MarkdownRenderer content={content || "*暂无内容*"} />
            </div>
          ) : (
            <>
              {/* Toolbar */}
              <div className="flex items-center gap-1 mb-3 pb-3 border-b border-gray-100">
                {TOOLBAR_ITEMS.map(item => (
                  <button
                    key={item.label}
                    title={item.label}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded"
                  >
                    <item.icon size={16} />
                  </button>
                ))}
              </div>
              {/* Editor */}
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="开始写作吧，支持 Markdown 语法..."
                className="w-full min-h-[400px] text-sm text-gray-700 leading-relaxed outline-none resize-none font-mono"
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

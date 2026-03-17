import { TrendingUp, Award, BookOpen } from "lucide-react";

const hotArticles = [
  { rank: 1, title: "2026 前端十大趋势预测", hot: "12.5k" },
  { rank: 2, title: "Claude 4 发布：AI 编程新纪元", hot: "9.8k" },
  { rank: 3, title: "Rust 在后端领域的崛起", hot: "7.2k" },
  { rank: 4, title: "微服务已死？单体架构回归", hot: "6.1k" },
  { rank: 5, title: "零基础学 TypeScript 完全指南", hot: "5.4k" },
];

export default function Sidebar() {
  return (
    <aside className="w-72 flex-shrink-0 space-y-6">
      {/* 热榜 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
          <TrendingUp size={16} className="text-orange-500" />
          热门榜单
        </div>
        <div className="space-y-3">
          {hotArticles.map((item) => (
            <div key={item.rank} className="flex items-start gap-2 cursor-pointer group">
              <span className={`text-sm font-bold w-5 text-center flex-shrink-0 ${
                item.rank <= 3 ? "text-orange-500" : "text-gray-400"
              }`}>
                {item.rank}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {item.title}
                </p>
                <p className="text-xs text-gray-400">{item.hot} 热度</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 推荐作者 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
          <Award size={16} className="text-blue-500" />
          推荐作者
        </div>
        <div className="space-y-3">
          {[
            { name: "张三丰", desc: "全栈工程师 · 128 篇文章", avatar: "Felix" },
            { name: "王五岳", desc: "AI 算法工程师 · 86 篇文章", avatar: "Dusty" },
            { name: "赵六合", desc: "后端工程师 · 64 篇文章", avatar: "Mimi" },
          ].map((author) => (
            <div key={author.name} className="flex items-center gap-3 cursor-pointer group">
              <img
                src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${author.avatar}`}
                alt={author.name}
                className="w-8 h-8 rounded-full bg-gray-100"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{author.name}</p>
                <p className="text-xs text-gray-400">{author.desc}</p>
              </div>
              <button className="text-xs text-blue-600 border border-blue-200 rounded-full px-3 py-0.5 hover:bg-blue-50">
                关注
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 推荐专栏 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
          <BookOpen size={16} className="text-green-500" />
          热门专栏
        </div>
        <div className="space-y-2">
          {["前端进阶之路", "系统设计面试", "AI 应用实战"].map((col) => (
            <div key={col} className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer py-1">
              📚 {col}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Star, Users, Clock, BookOpen } from "lucide-react";
import { COURSES } from "@/lib/mock-extras";
import type { Course } from "@/lib/mock-extras";

function formatCount(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + "万";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

function CourseCard({ course }: { course: Course }) {
  const [enrolled, setEnrolled] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video bg-gray-100 overflow-hidden">
        <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <div className="flex gap-2 mb-2">
          {course.tags.map(t => (
            <span key={t} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{t}</span>
          ))}
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            course.level === "入门" ? "bg-green-50 text-green-600" :
            course.level === "进阶" ? "bg-orange-50 text-orange-600" :
            "bg-red-50 text-red-600"
          }`}>{course.level}</span>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">{course.title}</h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{course.description}</p>
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1"><Star size={12} className="text-yellow-500" /> {course.rating}</span>
          <span className="flex items-center gap-1"><Users size={12} /> {formatCount(course.students)}</span>
          <span className="flex items-center gap-1"><BookOpen size={12} /> {course.chapters}节</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <img src={course.instructor.avatar} alt="" className="w-5 h-5 rounded-full" />
          <span className="text-xs text-gray-500">{course.instructor.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {course.price === 0 ? (
              <span className="text-sm font-bold text-green-600">免费</span>
            ) : (
              <>
                <span className="text-sm font-bold text-orange-600">¥{course.price}</span>
                {course.originalPrice && (
                  <span className="text-xs text-gray-400 line-through">¥{course.originalPrice}</span>
                )}
              </>
            )}
          </div>
          <button
            onClick={() => setEnrolled(!enrolled)}
            className={`text-xs px-4 py-1.5 rounded-full transition-colors ${
              enrolled
                ? "bg-gray-100 text-gray-500"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {enrolled ? "已加入" : course.price === 0 ? "免费学习" : "立即购买"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const [filter, setFilter] = useState("全部");
  const tags = ["全部", "前端", "后端", "AI", "DevOps", "移动端"];
  const filtered = filter === "全部" ? COURSES : COURSES.filter(c => c.tags.includes(filter));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">课程</h1>
          <div className="flex gap-2">
            {tags.map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filter === t ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(c => <CourseCard key={c.id} course={c} />)}
        </div>
        {filtered.length === 0 && (
          <div className="text-center text-gray-400 py-20">该分类暂无课程</div>
        )}
      </main>
    </div>
  );
}

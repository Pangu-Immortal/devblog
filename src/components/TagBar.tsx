"use client";

import { TAGS } from "@/lib/mock-data";

interface TagBarProps {
  activeTag: string;
  onTagChange: (tag: string) => void;
}

export default function TagBar({ activeTag, onTagChange }: TagBarProps) {
  return (
    <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
      {TAGS.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagChange(tag)}
          className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
            activeTag === tag
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

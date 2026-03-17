"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Calendar, MapPin, Users, Globe } from "lucide-react";
import { EVENTS } from "@/lib/mock-extras";
import type { Event } from "@/lib/mock-extras";

function EventCard({ event }: { event: Event }) {
  const [joined, setJoined] = useState(false);
  const statusColors = {
    upcoming: "bg-blue-50 text-blue-600 border-blue-200",
    ongoing: "bg-green-50 text-green-600 border-green-200",
    ended: "bg-gray-50 text-gray-500 border-gray-200",
  };
  const statusLabels = { upcoming: "即将开始", ongoing: "进行中", ended: "已结束" };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-[2/1] bg-gray-100 overflow-hidden relative">
        <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
        <span className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full border ${statusColors[event.status]}`}>
          {statusLabels[event.status]}
        </span>
      </div>
      <div className="p-5">
        <div className="flex gap-2 mb-2">
          {event.tags.map(t => (
            <span key={t} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{t}</span>
          ))}
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{event.description}</p>
        <div className="space-y-2 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>{event.startDate}{event.endDate !== event.startDate ? ` ~ ${event.endDate}` : ""}</span>
          </div>
          <div className="flex items-center gap-2">
            {event.online ? <Globe size={14} /> : <MapPin size={14} />}
            <span>{event.location}</span>
            {event.online && <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">线上</span>}
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} />
            <span>{event.participants} 人已报名{event.maxParticipants ? ` / ${event.maxParticipants}` : ""}</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">主办方：{event.host}</span>
          {event.status !== "ended" ? (
            <button
              onClick={() => setJoined(!joined)}
              className={`text-sm px-5 py-1.5 rounded-full transition-colors ${
                joined
                  ? "bg-gray-100 text-gray-500"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {joined ? "已报名" : "立即报名"}
            </button>
          ) : (
            <span className="text-sm text-gray-400">活动已结束</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const filters = [
    { key: "all", label: "全部" },
    { key: "upcoming", label: "即将开始" },
    { key: "ongoing", label: "进行中" },
    { key: "ended", label: "已结束" },
  ];
  const filtered = statusFilter === "all" ? EVENTS : EVENTS.filter(e => e.status === statusFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">活动</h1>
          <div className="flex gap-2">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  statusFilter === f.key ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(e => <EventCard key={e.id} event={e} />)}
        </div>
        {filtered.length === 0 && (
          <div className="text-center text-gray-400 py-20">暂无相关活动</div>
        )}
      </main>
    </div>
  );
}

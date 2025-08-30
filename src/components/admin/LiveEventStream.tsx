"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Rss } from "lucide-react";

const initialEvents = [
  "User 'john@doe.com' uploaded 'report.pdf'",
  "System backup started.",
  "Admin 'admin@enterprise.com' logged in.",
  "High CPU usage detected on server-01.",
];

export function LiveEventStream() {
  const [events, setEvents] = useState(initialEvents);

  return (
    <div className="p-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-lg shadow-slate-900/5 dark:shadow-black/10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
          <Rss className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          Live Event Stream
        </h3>
        <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
        {events.map((event, index) => (
          <div key={index} className="text-sm flex items-start gap-3">
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-0.5">{new Date(Date.now() - index * 60000).toLocaleTimeString()}</span>
            <p className="text-slate-700 dark:text-slate-200">{event}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";

import { FileTypeAnalyticsData } from "@/types/admin-files";

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const typeColors: { [key: string]: string } = {
  video: "bg-purple-500",
  image: "bg-emerald-500",
  archive: "bg-slate-500",
  document: "bg-blue-500",
  audio: "bg-amber-500",
  other: "bg-gray-400",
};

export function FileTypeAnalytics({ analytics }: { analytics: FileTypeAnalyticsData }) {
  return (
    <div className="p-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-lg shadow-slate-900/5 dark:shadow-black/10">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">File Type Distribution</h3>
      <div className="space-y-3">
        {analytics.fileTypes.map(typeStat => (
          <div key={typeStat.type}>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">{typeStat.type}</span>
              <span className="text-slate-500 dark:text-slate-400">{typeStat.count.toLocaleString()} files ({typeStat.percentage.toFixed(1)}%) - {formatBytes(typeStat.size)}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
              <div className={`${typeColors[typeStat.type]} h-2.5 rounded-full`} style={{ width: `${typeStat.percentage}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";

import { FileStats } from "@/types/admin";
import { Loader2 } from "lucide-react";

interface FileAnalyticsProps {
  fileStats: FileStats;
  loading: boolean;
}

const typeColors: Record<string, string> = {
  image: "bg-blue-500",
  video: "bg-purple-500",
  audio: "bg-green-500",
  document: "bg-amber-500",
  archive: "bg-red-500",
  other: "bg-slate-500",
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

export function FileAnalytics({ fileStats, loading }: FileAnalyticsProps) {
  if (loading) {
    return <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />;
  }

  const totalCount = fileStats.totalFiles;

  return (
    <div className="p-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-lg shadow-slate-900/5 dark:shadow-black/10">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">File Type Distribution</h3>
      <div className="space-y-3">
        {Object.entries(fileStats.typeDistribution).map(([type, data]) => {
          const percentage = totalCount > 0 ? (data.count / totalCount) * 100 : 0;
          return (
            <div key={type}>
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">{type}</span>
                <span className="text-slate-500 dark:text-slate-400">{data.count.toLocaleString()} files ({formatBytes(data.size)})</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div className={`${typeColors[type]} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
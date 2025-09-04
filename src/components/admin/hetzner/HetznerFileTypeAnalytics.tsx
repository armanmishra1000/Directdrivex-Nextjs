"use client";

import { HetznerFileTypeAnalytics as Analytics } from "@/types/hetzner";
import { PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

const chartColors = [
  'bg-gradient-to-r from-blue-500 to-blue-600',
  'bg-gradient-to-r from-emerald-500 to-emerald-600',
  'bg-gradient-to-r from-amber-500 to-amber-600',
  'bg-gradient-to-r from-red-500 to-red-600',
  'bg-gradient-to-r from-purple-500 to-purple-600',
  'bg-gradient-to-r from-slate-500 to-slate-600',
];

export function HetznerFileTypeAnalytics({ analytics }: { analytics: Analytics | null }) {
  if (!analytics || analytics.file_types.length === 0) return null;

  return (
    <div className="p-6 border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
          <PieChart className="w-5 h-5 text-emerald-500" /> File Type Distribution
        </h3>
        <span className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-emerald-600">
          Total: {analytics.total_files.toLocaleString()} files
        </span>
      </div>
      <div className="space-y-3">
        {analytics.file_types.map((type, index) => (
          <div key={type._id} className="p-3 transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
            <div className="flex justify-between mb-1 text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-200">{type._id}</span>
              <span className="text-slate-500 dark:text-slate-400">{type.count.toLocaleString()} files ({type.percentage.toFixed(1)}%) - {type.size_formatted}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className={cn("h-2 rounded-full", chartColors[index % chartColors.length])}
                style={{ width: `${type.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
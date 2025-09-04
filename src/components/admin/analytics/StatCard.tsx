"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  icon: React.ElementType;
  mainMetric: string;
  label: string;
  breakdown: { label: string; value: string; color?: string }[];
  loading: boolean;
  error?: string;
}

export function StatCard({ title, icon: Icon, mainMetric, label, breakdown, loading, error }: StatCardProps) {
  return (
    <div className="p-6 border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
        <Icon className="w-5 h-5 text-slate-400" />
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-24"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
      ) : error ? (
        <div className="flex items-center justify-center h-24 text-sm text-red-600">{error}</div>
      ) : (
        <div>
          <div className="mb-4">
            <div className="text-4xl font-bold text-slate-900 dark:text-white">{mainMetric}</div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            {breakdown.map((item, index) => (
              <div key={index}>
                <div className={cn("text-lg font-semibold", item.color || "text-slate-800 dark:text-slate-200")}>{item.value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
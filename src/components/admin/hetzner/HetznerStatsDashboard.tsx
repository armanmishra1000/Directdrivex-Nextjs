"use client";

import { HetznerStats } from "@/types/hetzner";
import { CloudUpload, HardDrive, Clock, AlertTriangle, ArrowUp, Minus, Check } from "lucide-react";

interface HetznerStatsDashboardProps {
  stats: HetznerStats | null;
}

const StatCard = ({ icon: Icon, value, label, trend, trendType, color }: { icon: React.ElementType, value: string, label: string, trend: string, trendType: 'positive' | 'negative' | 'neutral', color: string }) => (
  <div className="p-6 border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10">
    <div className="flex items-center gap-4">
      <div className={`flex items-center justify-center w-12 h-12 rounded-xl text-white ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">{value}</div>
        <div className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</div>
      </div>
    </div>
    <div className={`mt-4 flex items-center gap-2 text-xs font-semibold ${trendType === 'positive' ? 'text-emerald-600' : trendType === 'negative' ? 'text-red-600' : 'text-slate-500'}`}>
      {trendType === 'positive' && <ArrowUp className="w-3 h-3" />}
      {trendType === 'negative' && <AlertTriangle className="w-3 h-3" />}
      {trendType === 'neutral' && <Minus className="w-3 h-3" />}
      <span>{trend}</span>
    </div>
  </div>
);

export function HetznerStatsDashboard({ stats }: HetznerStatsDashboardProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard icon={CloudUpload} value={stats.total_files.toLocaleString()} label="Backed Up Files" trend="Active" trendType="positive" color="bg-gradient-to-br from-blue-500 to-blue-600" />
      <StatCard icon={HardDrive} value={stats.total_storage_formatted} label="Total Storage" trend="Stable" trendType="neutral" color="bg-gradient-to-br from-purple-500 to-purple-600" />
      <StatCard icon={Clock} value={stats.recent_backups.toLocaleString()} label="Recent Backups (7d)" trend="Good" trendType="positive" color="bg-gradient-to-br from-emerald-500 to-emerald-600" />
      <StatCard icon={AlertTriangle} value={stats.failed_backups.toLocaleString()} label="Failed Backups" trend={stats.failed_backups > 0 ? "Issues" : "None"} trendType={stats.failed_backups > 0 ? "negative" : "positive"} color="bg-gradient-to-br from-amber-500 to-red-600" />
    </div>
  );
}
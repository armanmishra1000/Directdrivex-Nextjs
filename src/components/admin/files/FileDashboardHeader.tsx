"use client";

import { Folder, Server, Cloud, Database, List, LayoutGrid, Filter, Trash2 } from "lucide-react";
import { FileStats } from "@/types/admin";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => (
  <div className="p-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700">
    <div className="flex items-center justify-between">
      <div className={`w-10 h-10 ${color}/10 text-${color} rounded-lg flex items-center justify-center`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <p className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
    <p className="text-sm text-slate-600 dark:text-slate-400">{title}</p>
  </div>
);

interface FileDashboardHeaderProps {
  stats: FileStats;
  loading: boolean;
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
  onToggleFilters: () => void;
  onCleanup: () => void;
}

export function FileDashboardHeader({ stats, loading, viewMode, onViewModeChange, onToggleFilters, onCleanup }: FileDashboardHeaderProps) {
  const formatNumber = (num: number) => num.toLocaleString();
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
      <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Files" value={loading ? '...' : formatNumber(stats.totalFiles)} icon={Folder} color="blue-500" />
        <StatCard title="Total Storage" value={loading ? '...' : formatBytes(stats.totalStorage)} icon={Server} color="emerald-500" />
        <StatCard title="Google Drive Files" value={loading ? '...' : formatNumber(stats.gdriveFiles)} icon={Cloud} color="purple-500" />
        <StatCard title="Hetzner Files" value={loading ? '...' : formatNumber(stats.hetznerFiles)} icon={Database} color="amber-500" />
      </div>
      <div className="lg:col-span-2 flex lg:flex-col items-stretch justify-end gap-2">
        <div className="flex-1 flex items-center gap-2">
          <button onClick={onToggleFilters} className="w-full h-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <div className="flex h-full rounded-lg border border-slate-300 dark:border-slate-600">
            <button onClick={() => onViewModeChange('list')} className={cn("p-3 rounded-l-md", viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600')}>
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => onViewModeChange('grid')} className={cn("p-3 rounded-r-md", viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600')}>
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button onClick={onCleanup} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-amber-800 dark:text-amber-300 bg-amber-400/20 dark:bg-amber-500/20 border border-amber-400/30 dark:border-amber-500/30 rounded-lg hover:bg-amber-400/30 dark:hover:bg-amber-500/30">
          <Trash2 className="w-4 h-4" /> System Cleanup
        </button>
      </div>
    </div>
  );
}
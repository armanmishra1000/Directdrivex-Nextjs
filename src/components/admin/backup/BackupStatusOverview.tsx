"use client";

import { File, Shield, Clock, AlertTriangle, Server, Database, Play, RefreshCw } from "lucide-react";
import { BackupStatus } from "@/types/backup";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  subtext?: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, subtext, loading }) => (
  <div className="p-4 transition-all duration-300 border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10 hover:-translate-y-1 hover:shadow-xl">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</p>
          {loading ? (
            <div className="w-20 h-8 mt-1 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          ) : (
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">{value}</p>
          )}
        </div>
      </div>
    </div>
    {subtext && !loading && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{subtext}</p>}
  </div>
);

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 TB";
  const tb = bytes / (1024 * 1024 * 1024 * 1024);
  return `${tb.toFixed(1)} TB`;
};

interface BackupStatusOverviewProps {
  status: BackupStatus | null;
  loading: boolean;
}

export function BackupStatusOverview({ status, loading }: BackupStatusOverviewProps) {
  const getHetznerStatus = () => {
    if (!status) return { text: 'Unknown', color: 'text-slate-500' };
    switch (status.hetzner_status) {
      case 'connected': return { text: 'Connected', color: 'text-emerald-500' };
      case 'disconnected': return { text: 'Disconnected', color: 'text-red-500' };
      case 'error': return { text: 'Error', color: 'text-red-500' };
      case 'not_configured': return { text: 'Not Configured', color: 'text-amber-500' };
      default: return { text: 'Unknown', color: 'text-slate-500' };
    }
  };

  return (
    <div className="p-6 border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10">
      <h2 className="mb-4 text-xl font-semibold text-slate-800 dark:text-slate-200">Backup Status Overview</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Total Files" value={status?.backup_summary.total_files.toLocaleString() || 0} icon={File} color="bg-blue-600" loading={loading} />
        <StatCard title="Backed Up" value={status?.backup_summary.backed_up_files.toLocaleString() || 0} icon={Shield} color="bg-emerald-600" subtext={`${status?.backup_summary.backup_percentage || 0}% complete`} loading={loading} />
        <StatCard title="In Progress" value={status?.backup_summary.in_progress || 0} icon={Clock} color="bg-amber-500" loading={loading} />
        <StatCard title="Failed" value={status?.backup_summary.failed || 0} icon={AlertTriangle} color="bg-red-600" loading={loading} />
        <StatCard title="Hetzner Status" value={getHetznerStatus().text} icon={Server} color={getHetznerStatus().color.replace('text-', 'bg-')} loading={loading} />
        <StatCard title="Total Backup Size" value={formatBytes(status?.backup_summary.total_backup_size || 0)} icon={Database} color="bg-indigo-600" loading={loading} />
      </div>
      <div className="flex flex-wrap gap-4 mt-6">
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700">
          <Play className="w-4 h-4" /> Trigger Mass Backup
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700">
          <RefreshCw className="w-4 h-4" /> Run Cleanup
        </button>
      </div>
    </div>
  );
}
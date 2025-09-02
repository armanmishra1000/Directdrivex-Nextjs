"use client";

import { File, HardDrive, Server, Trash2 } from "lucide-react";
import { StorageStats } from "@/types/file-browser";
import { FaGoogleDrive } from "react-icons/fa";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => (
  <div className="p-4 transition-all duration-300 border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10 hover:-translate-y-1 hover:shadow-xl">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</p>
        <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">{value}</p>
      </div>
      <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
  </div>
);

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 GB";
  const gb = bytes / (1024 * 1024 * 1024);
  return `${gb.toFixed(1)} GB`;
};

interface FileBrowserHeaderProps {
  stats: StorageStats;
  onCleanup: () => void;
}

export function FileBrowserHeader({ stats, onCleanup }: FileBrowserHeaderProps) {
  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">File Browser</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Manage all cloud storage files.</p>
        </div>
        <button 
          onClick={onCleanup}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-amber-600 border rounded-lg hover:bg-amber-700"
        >
          <Trash2 className="w-4 h-4" />
          Orphaned Files Cleanup
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Files" value={stats.totalFiles.toLocaleString()} icon={File} color="bg-blue-600" />
        <StatCard title="Total Storage" value={formatBytes(stats.totalStorage)} icon={HardDrive} color="bg-emerald-600" />
        <StatCard title="Google Drive Files" value={stats.gdriveFiles.toLocaleString()} icon={FaGoogleDrive} color="bg-green-600" />
        <StatCard title="Hetzner Files" value={stats.hetznerFiles.toLocaleString()} icon={Server} color="bg-red-600" />
      </div>
    </div>
  );
}
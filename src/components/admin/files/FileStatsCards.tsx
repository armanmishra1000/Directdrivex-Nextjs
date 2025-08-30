"use client";

import { Folder, HardDrive, Server } from "lucide-react";
import { StorageStats } from "@/types/admin-files";

// A custom icon for Google Drive
const GoogleDriveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 18h-12a2 2 0 0 1 -2 -2v-8a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2z" />
    <path d="M12 6l-6 10h12z" />
  </svg>
);

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const StatCard = ({ icon: Icon, value, label, color }: { icon: React.ElementType, value: string, label: string, color: string }) => (
  <div className="flex items-center p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${color}/10 text-${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
    </div>
  </div>
);

export function FileStatsCards({ stats }: { stats: StorageStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard icon={Folder} value={stats.totalFiles.toLocaleString()} label="Total Files" color="blue-500" />
      <StatCard icon={HardDrive} value={formatBytes(stats.totalStorage)} label="Total Storage" color="emerald-500" />
      <StatCard icon={GoogleDriveIcon} value={stats.gdriveFiles.toLocaleString()} label="Google Drive Files" color="green-500" />
      <StatCard icon={Server} value={stats.hetznerFiles.toLocaleString()} label="Hetzner Files" color="purple-500" />
    </div>
  );
}
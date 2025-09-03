"use client";

import { useState, useEffect } from "react";
import { FaGoogleDrive as DriveIcon } from "react-icons/fa";
import { Plus, RefreshCw, CheckCircle, Database, Zap, PieChart, File, HardDrive, Folder, Circle, Pause, Trash2, Eye, Clock } from "lucide-react";
import { mockAccounts, mockStats, mockCacheInfo } from "./data";
import { GoogleDriveAccount, GoogleDriveStats, CacheInfo } from "@/types/gdrive";
import { cn } from "@/lib/utils";

const formatBytes = (bytes: number, targetUnit: 'GB' | 'TB' = 'GB') => {
  if (bytes === 0) return `0 ${targetUnit}`;
  const k = 1024;
  const i = targetUnit === 'GB' ? 3 : 4;
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${targetUnit}`;
};

const StatCard = ({ title, value, subtext, icon: Icon, iconBg }: { title: string, value: string, subtext: string, icon: React.ElementType, iconBg: string }) => (
  <div className="p-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-400/20 rounded-2xl">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        <p className="text-emerald-600 dark:text-emerald-400 text-sm">{subtext}</p>
      </div>
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", iconBg)}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

const AccountCard = ({ account }: { account: GoogleDriveAccount }) => {
  const storagePercentage = account.storage_quota > 0 ? (account.storage_used / account.storage_quota) * 100 : 0;

  return (
    <div className="p-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-400/20 rounded-2xl hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{account.email}</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">ID: {account.account_id}</p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", account.is_active ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300")}>
            <Circle className="w-2 h-2 fill-current" />
            {account.is_active ? 'Active' : 'Inactive'}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            <CheckCircle className="w-3 h-3" />
            {account.health_status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <File className="w-4 h-4 text-blue-600" />
            <span className="text-slate-600 dark:text-slate-400 text-sm">Files</span>
          </div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{account.files_count.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <HardDrive className="w-4 h-4 text-emerald-600" />
            <span className="text-slate-600 dark:text-slate-400 text-sm">Storage</span>
          </div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{formatBytes(account.storage_used)}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-600 dark:text-slate-400 text-sm">Storage Usage</span>
          <span className="text-slate-900 dark:text-slate-100 font-medium text-sm">{storagePercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${storagePercentage}%` }}></div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-slate-600 dark:text-slate-400 text-sm">Performance Score</span>
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          {account.performance_score.toFixed(1)}%
        </span>
      </div>

      {account.folder_info && (
        <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg mb-4">
          <div className="flex items-center gap-3 mb-2">
            <Folder className="w-4 h-4 text-blue-600" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 dark:text-slate-100 text-sm truncate">{account.folder_info.folder_name}</p>
              <p className="text-slate-600 dark:text-slate-400 text-xs font-mono truncate">{account.folder_info.folder_path}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span className="text-emerald-600 dark:text-emerald-400 text-xs">Data Fresh</span>
            <span className="text-slate-500 dark:text-slate-500 text-xs ml-auto">
              Updated: 5m ago
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md text-sm transition-colors">
          <Eye className="w-3 h-3" /> Details
        </button>
        <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm transition-colors">
          <RefreshCw className="w-3 h-3" /> Refresh
        </button>
        <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-md text-sm transition-colors">
          <Pause className="w-3 h-3" /> Deactivate
        </button>
        <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm transition-colors">
          <Trash2 className="w-3 h-3" /> Delete Files
        </button>
      </div>

      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs">
        <Clock className="w-3 h-3" />
        <span>Last activity: 2 hours ago</span>
      </div>
    </div>
  );
};

export function GoogleDriveManagement() {
  const [accounts, setAccounts] = useState<GoogleDriveAccount[]>([]);
  const [stats, setStats] = useState<GoogleDriveStats | null>(null);
  const [cacheInfo, setCacheInfo] = useState<CacheInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setAccounts(mockAccounts);
      setStats(mockStats);
      setCacheInfo(mockCacheInfo);
      setLoading(false);
    }, 1500);
  }, []);

  const totalStorageUsed = stats ? stats.total_storage_used : 0;
  const totalStorageQuota = stats ? stats.total_storage_quota : 0;
  const quotaPercentage = totalStorageQuota > 0 ? (totalStorageUsed / totalStorageQuota) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center">
              <DriveIcon className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Google Drive Management</h1>
          </div>
          {cacheInfo && (
            <div className="flex items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <CheckCircle className="w-3 h-3" />
                Data Fresh
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                Last updated: 2 minutes ago
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" /> Add Account
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Accounts" value={stats?.total_accounts.toString() || '0'} subtext={`${stats?.active_accounts || 0} active`} icon={DriveIcon} iconBg="bg-blue-500/10 text-blue-500" />
        <StatCard title="Storage Used" value={formatBytes(totalStorageUsed)} subtext={`of ${formatBytes(totalStorageQuota, 'TB')}`} icon={Database} iconBg="bg-emerald-500/10 text-emerald-500" />
        <StatCard title="Avg Performance" value={`${stats?.average_performance.toFixed(1) || '0.0'}%`} subtext="Excellent" icon={Zap} iconBg="bg-amber-500/10 text-amber-500" />
        <div className="p-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-400/20 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Quota Usage</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{quotaPercentage.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center">
              <PieChart className="w-6 h-6" />
            </div>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${quotaPercentage}%` }}></div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading accounts...</p>
        </div>
      ) : accounts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {accounts.map(account => <AccountCard key={account.account_id} account={account} />)}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <DriveIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No Google Drive Accounts</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Add your first Google Drive service account to get started.</p>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" /> Add Account
          </button>
        </div>
      )}
    </div>
  );
}
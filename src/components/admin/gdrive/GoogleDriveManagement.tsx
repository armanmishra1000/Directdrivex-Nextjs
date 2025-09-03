"use client";

import { useState, useEffect } from 'react';
import { GoogleDriveAccount, GoogleDriveStats, CacheInfo } from '@/types/gdrive';
import { mockAccounts, mockStats, mockCacheInfo } from './data';
import { FaGoogleDrive } from 'react-icons/fa';
import { Plus, RefreshCw, AlertTriangle, Loader2, Database, Activity, PieChart, CheckCircle, Clock, Info, Eye, Pause, Play, Trash2, UserX } from 'lucide-react';
import { cn } from '@/lib/utils';

// Utility functions
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(1))} ${sizes[i]}`;
};

const formatDateTime = (dateString: string): string => {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return date.toLocaleDateString();
};

export function GoogleDriveManagement() {
  const [accounts, setAccounts] = useState<GoogleDriveAccount[]>([]);
  const [stats, setStats] = useState<GoogleDriveStats>(mockStats);
  const [cacheInfo, setCacheInfo] = useState<CacheInfo>(mockCacheInfo);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAccounts(mockAccounts);
      setStats(mockStats);
      setCacheInfo(mockCacheInfo);
      setLoading(false);
    }, 1500);
  }, []);

  const refreshAllAccounts = () => {
    setIsRefreshing(true);
    setError('');
    setTimeout(() => {
      setAccounts([...mockAccounts].sort(() => Math.random() - 0.5)); // Shuffle for visual feedback
      setStats(mockStats);
      setCacheInfo({ ...mockCacheInfo, last_updated: new Date().toISOString() });
      setIsRefreshing(false);
    }, 2000);
  };

  const getCacheInfo = () => {
    switch (cacheInfo.status) {
      case 'fresh': return { text: 'Data Fresh', icon: CheckCircle, className: 'bg-green-100 text-green-800' };
      case 'stale': return { text: 'Data Stale', icon: Clock, className: 'bg-yellow-100 text-yellow-800' };
      case 'error': return { text: 'Update Error', icon: AlertTriangle, className: 'bg-red-100 text-red-800' };
      default: return { text: 'Unknown', icon: Info, className: 'bg-gray-100 text-gray-800' };
    }
  };

  const getHealthStatus = (status: GoogleDriveAccount['health_status']) => {
    switch (status) {
      case 'healthy': return { text: 'Healthy', className: 'bg-green-100 text-green-800' };
      case 'warning': return { text: 'Warning', className: 'bg-yellow-100 text-yellow-800' };
      case 'quota_warning': return { text: 'Quota Warning', className: 'bg-orange-100 text-orange-800' };
      case 'critical': return { text: 'Critical', className: 'bg-red-100 text-red-800' };
      default: return { text: 'Unknown', className: 'bg-gray-100 text-gray-800' };
    }
  };

  const getPerformanceClass = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-blue-100 text-blue-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const { icon: CacheIcon, text: cacheText, className: cacheClassName } = getCacheInfo();
  const quotaUsage = stats.total_storage_quota > 0 ? (stats.total_storage_used / stats.total_storage_quota) * 100 : 0;

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-white dark:bg-slate-900 rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-start pb-4 mb-8 border-b-2 border-slate-200 dark:border-slate-700">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <FaGoogleDrive className="text-blue-500" /> Google Drive Management
          </h2>
          <div className="flex items-center gap-4 text-sm">
            <span className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-full font-semibold text-xs", cacheClassName)}>
              <CacheIcon className="w-3 h-3" /> {cacheText}
            </span>
            <span className="text-slate-500 dark:text-slate-400 italic">
              Last updated: {formatDateTime(cacheInfo.last_updated)}
            </span>
          </div>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <button className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50">
            <Plus className="w-4 h-4" /> Add Account
          </button>
          <button onClick={refreshAllAccounts} disabled={loading || isRefreshing} className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-white bg-slate-600 rounded-md hover:bg-slate-700 disabled:opacity-50">
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            {isRefreshing ? 'Refreshing...' : 'Refresh All'}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 p-4 mb-6 text-red-800 bg-red-100 border border-red-200 rounded-md">
          <AlertTriangle className="w-5 h-5" /> {error}
        </div>
      )}

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FaGoogleDrive} title="Total Accounts" value={stats.total_accounts} detail={`${stats.active_accounts} active`} color="bg-blue-500" />
        <StatCard icon={Database} title="Storage Used" value={formatBytes(stats.total_storage_used)} detail={`of ${formatBytes(stats.total_storage_quota)}`} color="bg-green-500" />
        <StatCard icon={Activity} title="Avg Performance" value={`${stats.average_performance.toFixed(1)}%`} detail="Excellent" color="bg-orange-500" />
        <StatCard icon={PieChart} title="Quota Usage" value={`${quotaUsage.toFixed(2)}%`} color="bg-purple-500" progressBar={quotaUsage} />
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <Loader2 className="w-8 h-8 mb-4 animate-spin" />
          <p>Loading accounts...</p>
        </div>
      )}

      {/* Accounts Grid */}
      {!loading && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {accounts.map(account => (
            <AccountCard key={account.account_id} account={account} getHealthStatus={getHealthStatus} getPerformanceClass={getPerformanceClass} />
          ))}
        </div>
      )}
    </div>
  );
}

// StatCard Component
const StatCard = ({ icon: Icon, title, value, detail, color, progressBar }: any) => (
  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-l-4" style={{ borderColor: color.replace('bg-', '#') }}>
    <div className="flex items-center gap-4">
      <div className={cn("flex items-center justify-center w-12 h-12 text-white rounded-full", color)}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">{title}</p>
        {detail && <span className="text-xs text-slate-500">{detail}</span>}
      </div>
    </div>
    {progressBar !== undefined && (
      <div className="w-full h-2 mt-4 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div className={cn("h-full", color)} style={{ width: `${progressBar}%` }} />
      </div>
    )}
  </div>
);

// AccountCard Component
const AccountCard = ({ account, getHealthStatus, getPerformanceClass }: any) => {
  const { text: healthText, className: healthClassName } = getHealthStatus(account.health_status);
  const performanceClassName = getPerformanceClass(account.performance_score);

  return (
    <div className={cn("p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg transition-all hover:shadow-xl hover:-translate-y-1", !account.is_active && "opacity-60")}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-start pb-4 mb-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate">{account.email}</h3>
          <span className="text-xs text-slate-500">ID: {account.account_id}</span>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2 mt-2 sm:mt-0">
          <span className={cn("px-2 py-1 text-xs font-semibold rounded", account.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}>
            {account.is_active ? 'Active' : 'Inactive'}
          </span>
          <span className={cn("px-2 py-1 text-xs font-semibold rounded", healthClassName)}>{healthText}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4">
        <div className="flex justify-around mb-4 text-center">
          <StatItem icon={File} label="Files" value={account.files_count.toLocaleString()} />
          <StatItem icon={HardDrive} label="Storage" value={formatBytes(account.storage_used)} />
        </div>
        <div className="mb-4">
          <div className="flex justify-between mb-1 text-sm text-slate-600 dark:text-slate-300">
            <span>Storage Usage</span>
            <span>{account.storage_percentage.toFixed(2)}%</span>
          </div>
          <div className="w-full h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div className={cn("h-full", account.storage_percentage > 80 ? "bg-orange-500" : "bg-blue-500")} style={{ width: `${account.storage_percentage}%` }} />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600 dark:text-slate-300">Performance Score</span>
          <span className={cn("px-2 py-1 text-sm font-semibold rounded", performanceClassName)}>{account.performance_score.toFixed(1)}%</span>
        </div>
      </div>

      {/* Folder Info */}
      {account.folder_info && (
        <div className="p-3 mb-4 border-l-4 rounded-r-md bg-slate-100 dark:bg-slate-800 border-blue-500">
          <div className="flex items-center gap-3 mb-1">
            <FaGoogleDrive className="w-5 h-5 text-blue-500" />
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-100">{account.folder_info.folder_name}</div>
              <div className="text-xs font-mono text-slate-500">{account.folder_info.folder_path}</div>
            </div>
          </div>
          <div className={cn("flex items-center gap-1.5 text-xs", account.data_freshness === 'fresh' ? 'text-green-600' : 'text-yellow-600')}>
            {account.data_freshness === 'fresh' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            <span>{account.data_freshness === 'fresh' ? 'Data Fresh' : 'Data Stale'}</span>
            <small className="ml-2 text-slate-500">Updated: {formatDateTime(account.last_quota_check)}</small>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        <ActionButton icon={Eye} label="Details" />
        <ActionButton icon={RefreshCw} label="Refresh" />
        <ActionButton icon={account.is_active ? Pause : Play} label={account.is_active ? 'Deactivate' : 'Activate'} className={account.is_active ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"} />
        <ActionButton icon={Trash2} label="Delete Files" className="bg-red-500 hover:bg-red-600" />
        <ActionButton icon={UserX} label="Remove" className="bg-red-500 hover:bg-red-600" />
      </div>

      {/* Last Activity */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Clock className="w-3 h-3" />
        <span>Last activity: {formatDateTime(account.last_activity)}</span>
      </div>
    </div>
  );
};

const StatItem = ({ icon: Icon, label, value }: any) => (
  <div className="flex flex-col items-center gap-1">
    <Icon className="w-5 h-5 text-blue-500" />
    <span className="text-xs text-slate-500">{label}</span>
    <span className="font-semibold text-slate-800 dark:text-slate-100">{value}</span>
  </div>
);

const ActionButton = ({ icon: Icon, label, className }: any) => (
  <button className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-md transition-colors disabled:opacity-50", className || "bg-slate-500 hover:bg-slate-600")}>
    <Icon className="w-3 h-3" /> {label}
  </button>
);
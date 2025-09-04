"use client";

import { StorageUsageAnalytics } from "@/types/analytics";

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export function StorageDistribution({ data }: { data: StorageUsageAnalytics | null }) {
  const totalUsers = data ? data.storage_distribution.reduce((sum, range) => sum + range.count, 0) : 0;

  return (
    <div className="p-6 border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10">
      <h3 className="mb-4 font-semibold text-slate-800 dark:text-slate-200">Storage Distribution</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h4 className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">Storage Ranges</h4>
          <div className="space-y-3">
            {data?.storage_distribution.map((range, index) => (
              <div key={index}>
                <div className="flex justify-between text-xs">
                  <span>{range.range}</span>
                  <span>{range.count} users</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700">
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-purple-600" style={{ width: `${totalUsers > 0 ? (range.count / totalUsers) * 100 : 0}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">Top Users by Storage</h4>
          <ul className="space-y-2">
            {data?.top_users.map((user, index) => (
              <li key={index} className="flex justify-between p-2 text-xs rounded-md bg-slate-50 dark:bg-slate-900/50">
                <span className="truncate">{user.email}</span>
                <span className="font-semibold">{formatBytes(user.storage_used)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
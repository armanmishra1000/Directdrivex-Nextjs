"use client";

import { ActivityPatterns as ActivityPatternsType } from "@/types/analytics";

export function ActivityPatterns({ data, onPeriodChange }: { data: ActivityPatternsType | null, onPeriodChange: (period: string) => void }) {
  const maxUploads = data ? Math.max(...data.upload_patterns.map(d => d.uploads), 0) : 0;
  const maxDownloads = data ? Math.max(...data.download_patterns.map(d => d.downloads), 0) : 0;

  return (
    <div className="p-6 border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 dark:text-slate-200">Activity Patterns</h3>
        <select onChange={(e) => onPeriodChange(e.target.value)} defaultValue="7" className="px-2 py-1 text-sm bg-white border rounded-md dark:bg-slate-800 border-slate-300 dark:border-slate-600">
          <option value="7">Last 7 days</option>
          <option value="14">Last 14 days</option>
          <option value="30">Last 30 days</option>
        </select>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h4 className="mb-2 text-sm font-medium text-center text-slate-600 dark:text-slate-400">Uploads by Hour</h4>
          <div className="flex items-end h-32 gap-1">
            {data?.upload_patterns.map((item, index) => (
              <div key={index} className="flex-1 h-full bg-blue-200 dark:bg-blue-900/50 rounded-t-sm" style={{ height: `${maxUploads > 0 ? (item.uploads / maxUploads) * 100 : 0}%` }}></div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-medium text-center text-slate-600 dark:text-slate-400">Downloads by Hour</h4>
          <div className="flex items-end h-32 gap-1">
            {data?.download_patterns.map((item, index) => (
              <div key={index} className="flex-1 h-full bg-emerald-200 dark:bg-emerald-900/50 rounded-t-sm" style={{ height: `${maxDownloads > 0 ? (item.downloads / maxDownloads) * 100 : 0}%` }}></div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h4 className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">Most Active Users</h4>
        <ul className="space-y-2">
          {data?.most_active_users.map((user, index) => (
            <li key={index} className="flex justify-between p-2 text-xs rounded-md bg-slate-50 dark:bg-slate-900/50">
              <span>{user.email}</span>
              <span className={user.last_login ? "" : "text-red-500"}>
                {user.last_login ? `Last login: ${new Date(user.last_login).toLocaleDateString()}` : 'Never logged in'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
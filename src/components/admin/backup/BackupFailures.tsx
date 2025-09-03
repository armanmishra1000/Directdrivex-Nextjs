"use client";

import { AlertTriangle, FileX } from "lucide-react";
import { BackupFailure, FailurePattern } from "@/types/backup";
import { mockFailurePatterns } from "./data";

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

interface BackupFailuresProps {
  failures: BackupFailure[];
  loading: boolean;
  period: number;
  onPeriodChange: (days: number) => void;
}

export function BackupFailures({ failures, loading, period, onPeriodChange }: BackupFailuresProps) {
  return (
    <div className="p-6 border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-800 dark:text-slate-200">
          <AlertTriangle className="w-5 h-5 text-red-500" /> Backup Failures
        </h2>
        <select
          value={period}
          onChange={(e) => onPeriodChange(Number(e.target.value))}
          className="px-3 py-1 text-sm bg-white border rounded-md dark:bg-slate-800 border-slate-300 dark:border-slate-600"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      <div className="mb-6">
        <h3 className="mb-3 text-lg font-medium text-slate-800 dark:text-slate-200">Most Common Errors</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockFailurePatterns.map((pattern, i) => (
            <div key={i} className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
              <p className="text-sm font-medium text-red-800 dark:text-red-300">{pattern.error_type}</p>
              <p className="text-xs text-red-600 dark:text-red-400">{pattern.count} occurrences</p>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
          <thead className="text-xs uppercase text-slate-700 bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
            <tr>
              <th scope="col" className="px-6 py-3">Filename</th>
              <th scope="col" className="px-6 py-3">Size</th>
              <th scope="col" className="px-6 py-3">Failed At</th>
              <th scope="col" className="px-6 py-3">Error</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700">
                  <td className="px-6 py-4"><div className="w-48 h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="w-16 h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="w-24 h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="w-32 h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" /></td>
                </tr>
              ))
            ) : failures.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">No backup failures in this period.</td>
              </tr>
            ) : (
              failures.map(failure => (
                <tr key={failure.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-red-50/50 dark:hover:bg-red-900/10">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <FileX className="w-4 h-4 text-red-400" />
                      <span className="truncate max-w-xs">{failure.filename}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{formatBytes(failure.size_bytes)}</td>
                  <td className="px-6 py-4">{new Date(failure.failed_at).toLocaleString()}</td>
                  <td className="px-6 py-4 text-red-600 dark:text-red-400 max-w-xs truncate" title={failure.backup_error}>
                    {failure.backup_error}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
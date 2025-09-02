"use client";

import { List, File as FileIcon } from "lucide-react";
import { BackupQueue as BackupQueueType } from "@/types/backup";
import { cn } from "@/lib/utils";

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

interface BackupQueueProps {
  queue: BackupQueueType | null;
  loading: boolean;
}

export function BackupQueue({ queue, loading }: BackupQueueProps) {
  return (
    <div className="p-6 border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-800 dark:text-slate-200">
          <List className="w-5 h-5" /> Backup Queue
        </h2>
        {!loading && queue && (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {queue.queue_files.length} of {queue.total_in_queue} files in queue
          </p>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
          <thead className="text-xs uppercase text-slate-700 bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
            <tr>
              <th scope="col" className="px-6 py-3">Filename</th>
              <th scope="col" className="px-6 py-3">Size</th>
              <th scope="col" className="px-6 py-3">Upload Date</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">User ID</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700">
                  <td className="px-6 py-4"><div className="w-48 h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="w-16 h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="w-24 h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="w-20 h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="w-16 h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" /></td>
                </tr>
              ))
            ) : queue?.queue_files.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">Backup queue is empty.</td>
              </tr>
            ) : (
              queue?.queue_files.map(file => (
                <tr key={file.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/20">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <FileIcon className="w-4 h-4 text-slate-400" />
                      <span className="truncate max-w-xs">{file.filename}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{formatBytes(file.size_bytes)}</td>
                  <td className="px-6 py-4">{new Date(file.upload_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={cn("px-2 py-1 text-xs font-medium rounded-full",
                      file.backup_status === 'in_progress' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                    )}>
                      {file.backup_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{file.user_id}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
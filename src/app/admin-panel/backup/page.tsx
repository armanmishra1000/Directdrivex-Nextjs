"use client";

import { useState, useEffect } from "react";
import { DatabaseBackup, RefreshCw } from "lucide-react";
import { BackupStatusOverview } from "@/components/admin/backup/BackupStatusOverview";
import { BackupQueue } from "@/components/admin/backup/BackupQueue";
import { BackupFailures } from "@/components/admin/backup/BackupFailures";
import { mockBackupStatus, mockBackupQueue, mockBackupFailures } from "@/components/admin/backup/data";
import { BackupStatus, BackupQueue as BackupQueueType, BackupFailure } from "@/types/backup";

export default function BackupManagementPage() {
  const [loading, setLoading] = useState(true);
  const [backupStatus, setBackupStatus] = useState<BackupStatus | null>(null);
  const [backupQueue, setBackupQueue] = useState<BackupQueueType | null>(null);
  const [backupFailures, setBackupFailures] = useState<BackupFailure[]>([]);
  const [failurePeriod, setFailurePeriod] = useState(30);

  const refreshAll = () => {
    setLoading(true);
    // Simulate API fetch
    setTimeout(() => {
      setBackupStatus(mockBackupStatus);
      setBackupQueue(mockBackupQueue);
      setBackupFailures(mockBackupFailures.filter(f => {
        const failureDate = new Date(f.failed_at);
        const periodStartDate = new Date();
        periodStartDate.setDate(periodStartDate.getDate() - failurePeriod);
        return failureDate >= periodStartDate;
      }));
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    refreshAll();
  }, [failurePeriod]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 text-white rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
            <DatabaseBackup className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Backup Management</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Monitor and manage system-wide file backups.</p>
          </div>
        </div>
        <button
          onClick={refreshAll}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh All'}
        </button>
      </div>

      {/* Backup Status Overview */}
      <BackupStatusOverview status={backupStatus} loading={loading} />

      {/* Backup Queue */}
      <BackupQueue queue={backupQueue} loading={loading} />

      {/* Backup Failures */}
      <BackupFailures 
        failures={backupFailures} 
        loading={loading} 
        period={failurePeriod}
        onPeriodChange={setFailurePeriod}
      />
    </div>
  );
}
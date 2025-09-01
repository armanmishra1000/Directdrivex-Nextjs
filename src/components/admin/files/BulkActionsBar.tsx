"use client";

import { Trash, Shield, DatabaseBackup } from "lucide-react";

interface BulkActionsBarProps {
  selectedCount: number;
  onBulkAction: (action: string, reason?: string) => void;
}

export function BulkActionsBar({ selectedCount, onBulkAction }: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center justify-between animate-fade-in-down">
      <span className="font-medium text-amber-800 dark:text-amber-300">{selectedCount} files selected</span>
      <div className="flex items-center gap-2">
        <button onClick={() => onBulkAction('delete')} className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 rounded-md flex items-center gap-1.5">
          <Trash className="w-4 h-4" /> Delete
        </button>
        <button onClick={() => onBulkAction('quarantine')} className="px-3 py-1.5 text-sm font-medium text-amber-600 bg-amber-100 hover:bg-amber-200 rounded-md flex items-center gap-1.5">
          <Shield className="w-4 h-4" /> Quarantine
        </button>
        <button onClick={() => onBulkAction('backup')} className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-md flex items-center gap-1.5">
          <DatabaseBackup className="w-4 h-4" /> Force Backup
        </button>
      </div>
    </div>
  );
}
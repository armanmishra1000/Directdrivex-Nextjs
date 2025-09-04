"use client";

import { CheckSquare, Trash2, RotateCcw } from "lucide-react";
import { useState } from "react";

interface HetznerBulkActionsBarProps {
  selectedCount: number;
  onExecute: (action: string, reason?: string) => void;
  onClear: () => void;
}

export function HetznerBulkActionsBar({ selectedCount, onExecute, onClear }: HetznerBulkActionsBarProps) {
  const [action, setAction] = useState('');
  const [reason, setReason] = useState('');

  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-4 p-4 border shadow-md sm:flex-row bg-gradient-to-r from-emerald-50 to-green-100 dark:from-emerald-900/50 dark:to-green-900/50 rounded-2xl border-emerald-200 dark:border-emerald-800">
      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-200">
        <CheckSquare className="w-5 h-5" />
        <span>{selectedCount} {selectedCount === 1 ? 'file' : 'files'} selected</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select value={action} onChange={(e) => setAction(e.target.value)} className="h-10 px-3 text-sm bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-600">
          <option value="">Choose action...</option>
          <option value="delete">Delete from Backup</option>
          <option value="recover">Recover from Backup</option>
        </select>
        <input type="text" placeholder="Reason (optional)" value={reason} onChange={(e) => setReason(e.target.value)} className="h-10 px-3 text-sm bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-600" />
        <button onClick={() => onExecute(action, reason)} disabled={!action} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50">
          Execute
        </button>
        <button onClick={onClear} className="px-4 py-2 text-sm font-medium bg-white border rounded-lg text-slate-700 dark:text-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600">
          Cancel
        </button>
      </div>
    </div>
  );
}
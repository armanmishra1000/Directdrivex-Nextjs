"use client";

import { Trash2, Shield, Cloud, X } from "lucide-react";

export function BulkActionsBar({ selectedCount, onClear }: { selectedCount: number, onClear: () => void }) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between p-3 mb-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-lg">
      <p className="text-sm font-medium text-amber-800 dark:text-amber-300">{selectedCount} files selected</p>
      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 text-sm text-emerald-700 bg-emerald-100 rounded-md flex items-center gap-1"><Shield className="w-4 h-4" /> Integrity Check</button>
        <button className="px-3 py-1.5 text-sm text-blue-700 bg-blue-100 rounded-md flex items-center gap-1"><Cloud className="w-4 h-4" /> Force Backup</button>
        <button className="px-3 py-1.5 text-sm text-red-700 bg-red-100 rounded-md flex items-center gap-1"><Trash2 className="w-4 h-4" /> Delete</button>
        <button onClick={onClear} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-full"><X className="w-4 h-4" /></button>
      </div>
    </div>
  );
}
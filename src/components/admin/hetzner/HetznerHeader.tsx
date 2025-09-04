"use client";

import { Server, SlidersHorizontal, RefreshCw } from "lucide-react";

interface HetznerHeaderProps {
  loading: boolean;
  showFilters: boolean;
  onToggleFilters: () => void;
  onRefresh: () => void;
}

export function HetznerHeader({ loading, showFilters, onToggleFilters, onRefresh }: HetznerHeaderProps) {
  return (
    <div className="relative p-8 overflow-hidden border shadow-lg bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-800 dark:to-black border-slate-700 rounded-2xl">
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2032%2032%22%20width=%2232%22%20height=%2232%22%20fill=%22none%22%20stroke=%22rgb(255%20255%20255%20/%200.1)%22%3E%3Cpath%20d=%22M0%20.5H31.5V32%22/%3E%3C/svg%3E')]"></div>
      <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg">
            <Server className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Hetzner File Management</h1>
            <p className="mt-1 text-slate-300">Manage and monitor your Hetzner storage backup files with advanced analytics.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFilters}
            className={`flex items-center gap-2 px-4 py-2 font-semibold text-white transition-colors border-2 rounded-lg border-slate-600 hover:bg-slate-700 ${showFilters ? 'bg-slate-700' : 'bg-slate-800/50'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 font-semibold text-white transition-colors border-2 rounded-lg bg-slate-800/50 border-slate-600 hover:bg-slate-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
}
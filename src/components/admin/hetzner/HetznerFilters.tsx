"use client";

import { Search, X } from "lucide-react";

interface HetznerFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  onSearch: () => void;
  onClearFilters: () => void;
}

export function HetznerFilters({ filters, onFiltersChange, onSearch, onClearFilters }: HetznerFiltersProps) {
  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="p-6 space-y-4 border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10">
      <div className="relative">
        <Search className="absolute w-5 h-5 -translate-y-1/2 left-4 top-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search files by name, type, or owner..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          className="w-full py-3 pl-12 pr-4 bg-white border rounded-lg dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <select value={filters.fileType} onChange={(e) => handleFilterChange('fileType', e.target.value)} className="w-full h-11 px-3 bg-white border rounded-lg dark:bg-slate-900 border-slate-300 dark:border-slate-600">
          <option value="">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="audio">Audio</option>
          <option value="document">Documents</option>
          <option value="archive">Archives</option>
          <option value="other">Other</option>
        </select>
        <input type="text" placeholder="Owner email..." value={filters.owner} onChange={(e) => handleFilterChange('owner', e.target.value)} className="w-full h-11 px-3 bg-white border rounded-lg dark:bg-slate-900 border-slate-300 dark:border-slate-600" />
        <select value={filters.backupStatus} onChange={(e) => handleFilterChange('backupStatus', e.target.value)} className="w-full h-11 px-3 bg-white border rounded-lg dark:bg-slate-900 border-slate-300 dark:border-slate-600">
          <option value="">All Status</option>
          <option value="completed">Backed Up</option>
          <option value="failed">Failed</option>
        </select>
        <input type="number" placeholder="Min Size (MB)" value={filters.sizeMin || ''} onChange={(e) => handleFilterChange('sizeMin', e.target.value ? Number(e.target.value) : null)} className="w-full h-11 px-3 bg-white border rounded-lg dark:bg-slate-900 border-slate-300 dark:border-slate-600" />
        <input type="number" placeholder="Max Size (MB)" value={filters.sizeMax || ''} onChange={(e) => handleFilterChange('sizeMax', e.target.value ? Number(e.target.value) : null)} className="w-full h-11 px-3 bg-white border rounded-lg dark:bg-slate-900 border-slate-300 dark:border-slate-600" />
      </div>
      <div className="flex justify-end">
        <button onClick={onClearFilters} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border rounded-lg text-slate-700 dark:text-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600">
          <X className="w-4 h-4" /> Clear All
        </button>
      </div>
    </div>
  );
}
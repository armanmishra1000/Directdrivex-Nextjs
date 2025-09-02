"use client";

import { useState } from "react";
import { Search, X, List, LayoutGrid, SlidersHorizontal } from "lucide-react";
import { FilterState } from "@/types/file-browser";
import { cn } from "@/lib/utils";

interface FileFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
}

export function FileFilters({ filters, onFilterChange, viewMode, onViewModeChange }: FileFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onFilterChange({ [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '', type: 'all', owner: '', storage: 'all', status: 'all',
    });
  };

  return (
    <div className="p-4 space-y-4 border bg-slate-100 dark:bg-slate-900/50 rounded-xl border-slate-200 dark:border-slate-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-grow">
          <Search className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleInputChange}
            placeholder="Search by file name or owner..."
            className="w-full pl-10 pr-4 bg-white border rounded-lg h-11 dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center justify-center w-full gap-2 px-3 text-sm font-medium bg-white border rounded-lg h-11 text-slate-700 dark:text-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 md:w-auto">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="md:hidden">Advanced Filters</span>
          </button>
          <div className="flex items-center p-1 bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-600">
            <button onClick={() => onViewModeChange('list')} className={cn("p-2 rounded-md", viewMode === 'list' && "bg-blue-600 text-white")}>
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => onViewModeChange('grid')} className={cn("p-2 rounded-md", viewMode === 'grid' && "bg-blue-600 text-white")}>
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 gap-4 pt-4 border-t sm:grid-cols-2 lg:grid-cols-5 border-slate-300 dark:border-slate-700">
          <select name="type" value={filters.type} onChange={handleInputChange} className="w-full h-11 px-3 bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-600">
            <option value="all">All Types</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="document">Document</option>
            <option value="archive">Archive</option>
            <option value="audio">Audio</option>
            <option value="other">Other</option>
          </select>
          <select name="storage" value={filters.storage} onChange={handleInputChange} className="w-full h-11 px-3 bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-600">
            <option value="all">All Storage</option>
            <option value="gdrive">Google Drive</option>
            <option value="hetzner">Hetzner</option>
          </select>
          <select name="status" value={filters.status} onChange={handleInputChange} className="w-full h-11 px-3 bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-600">
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="uploading">Uploading</option>
            <option value="failed">Failed</option>
            <option value="deleted">Deleted</option>
          </select>
          <input type="text" name="owner" value={filters.owner} onChange={handleInputChange} placeholder="Filter by owner..." className="w-full h-11 px-3 bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-600" />
          <button onClick={clearFilters} className="flex items-center justify-center w-full gap-2 px-3 text-sm font-medium bg-white border rounded-lg h-11 text-slate-700 dark:text-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600">
            <X className="w-4 h-4" /> Clear
          </button>
        </div>
      )}
    </div>
  );
}
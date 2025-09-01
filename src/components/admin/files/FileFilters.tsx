"use client";

import { Search, X } from "lucide-react";

interface FileFiltersProps {
  isVisible: boolean;
  filters: any;
  onFilterChange: (filters: any) => void;
}

export function FileFilters({ isVisible, filters, onFilterChange }: FileFiltersProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onFilterChange({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '', type: 'all', owner: '', location: 'all', status: 'all', minSize: '', maxSize: '',
    });
  };

  if (!isVisible) return null;

  return (
    <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 animate-fade-in-down">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 items-end">
        <div className="xl:col-span-2">
          <label htmlFor="search" className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" name="search" value={filters.search} onChange={handleInputChange} placeholder="Filename or Owner..." className="w-full h-11 pl-10 pr-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg" />
          </div>
        </div>
        <div>
          <label htmlFor="type" className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">File Type</label>
          <select name="type" value={filters.type} onChange={handleInputChange} className="w-full h-11 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg">
            <option value="all">All Types</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="document">Document</option>
            <option value="archive">Archive</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="location" className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
          <select name="location" value={filters.location} onChange={handleInputChange} className="w-full h-11 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg">
            <option value="all">All Locations</option>
            <option value="Google Drive">Google Drive</option>
            <option value="Hetzner">Hetzner</option>
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
          <select name="status" value={filters.status} onChange={handleInputChange} className="w-full h-11 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg">
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="uploading">Uploading</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <div className="flex gap-2">
          <div>
            <label htmlFor="minSize" className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Min Size (MB)</label>
            <input type="number" name="minSize" value={filters.minSize} onChange={handleInputChange} className="w-full h-11 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg" />
          </div>
          <div>
            <label htmlFor="maxSize" className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Max Size (MB)</label>
            <input type="number" name="maxSize" value={filters.maxSize} onChange={handleInputChange} className="w-full h-11 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg" />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={clearFilters} className="w-full h-11 flex items-center justify-center gap-2 px-3 text-sm font-medium bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600">
            <X className="w-4 h-4" /> Clear
          </button>
        </div>
      </div>
    </div>
  );
}
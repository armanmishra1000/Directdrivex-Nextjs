"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileFiltersProps {
  filters: any;
  setFilters: (filters: any) => void;
}

export function FileFilters({ filters, setFilters }: FileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({
      search: "", fileType: "all", owner: "", location: "all",
      status: "all", minSize: "", maxSize: "",
    });
  };

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)} className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center gap-2">
        <Filter className="w-4 h-4" /> Filters
      </button>
      <div className={cn("transition-all duration-300 ease-in-out overflow-hidden", isOpen ? "max-h-96 mt-4" : "max-h-0")}>
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <select name="fileType" value={filters.fileType} onChange={handleInputChange} className="h-10 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm">
              <option value="all">All Types</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="document">Document</option>
              <option value="archive">Archive</option>
              <option value="other">Other</option>
            </select>
            <input type="text" name="owner" value={filters.owner} onChange={handleInputChange} placeholder="Owner email..." className="h-10 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm" />
            <select name="location" value={filters.location} onChange={handleInputChange} className="h-10 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm">
              <option value="all">All Locations</option>
              <option value="gdrive">Google Drive</option>
              <option value="hetzner">Hetzner</option>
            </select>
            <select name="status" value={filters.status} onChange={handleInputChange} className="h-10 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm">
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="uploading">Uploading</option>
              <option value="failed">Failed</option>
            </select>
            <input type="number" name="minSize" value={filters.minSize} onChange={handleInputChange} placeholder="Min size (bytes)" className="h-10 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm" />
            <input type="number" name="maxSize" value={filters.maxSize} onChange={handleInputChange} placeholder="Max size (bytes)" className="h-10 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm" />
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={clearFilters} className="px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg flex items-center gap-1">
              <X className="w-4 h-4" /> Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
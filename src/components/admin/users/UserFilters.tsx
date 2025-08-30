"use client";

import { Search, ListFilter } from "lucide-react";

interface UserFiltersProps {
  filters: { search: string; role: string; status: string };
  setFilters: React.Dispatch<React.SetStateAction<{ search: string; role: string; status: string }>>;
}

export function UserFilters({ filters, setFilters }: UserFiltersProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="relative md:col-span-2 lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleInputChange}
            placeholder="Search by email..."
            className="w-full h-11 pl-10 pr-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          name="role"
          value={filters.role}
          onChange={handleInputChange}
          className="h-11 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Roles</option>
          <option value="regular">Regular</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Super Admin</option>
        </select>
        <select
          name="status"
          value={filters.status}
          onChange={handleInputChange}
          className="h-11 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
        </select>
      </div>
    </div>
  );
}
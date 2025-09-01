"use client";

import { useState, useEffect } from "react";
import { 
  Download, 
  RefreshCw, 
  Loader2, 
  AlertTriangle, 
  FileText, 
  Activity, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Wifi,
  WifiOff,
  Calendar,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useActivityLogs } from "@/hooks/useActivityLogs";

export default function ActivityLogsPage() {
  const {
    logs,
    loading,
    error,
    filters,
    pagination,
    availableActions,
    availableAdmins,
    realTimeEnabled,
    filteredLogs,
    loadLogs,
    exportLogs,
    refreshLogs,
    handlePageChange,
    handlePageSizeChange,
    updateFilters,
    clearFilters,
    formatAction,
    formatTimestamp,
    getActionBadgeClass,
    setRealTimeEnabled
  } = useActivityLogs();

  // Local state for form inputs
  const [searchInput, setSearchInput] = useState(filters.search);
  const [actionFilter, setActionFilter] = useState(filters.action);
  const [adminFilter, setAdminFilter] = useState(filters.admin);
  const [dateFromFilter, setDateFromFilter] = useState(filters.dateFrom);
  const [dateToFilter, setDateToFilter] = useState(filters.dateTo);

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateFilters({ search: searchInput });
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchInput, updateFilters]);

  // Handle filter changes
  const handleFilterChange = (filterName: string, value: string) => {
    switch (filterName) {
      case 'action':
        setActionFilter(value);
        updateFilters({ action: value });
        break;
      case 'admin':
        setAdminFilter(value);
        updateFilters({ admin: value });
        break;
      case 'dateFrom':
        setDateFromFilter(value);
        updateFilters({ dateFrom: value });
        break;
      case 'dateTo':
        setDateToFilter(value);
        updateFilters({ dateTo: value });
        break;
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchInput('');
    setActionFilter('all');
    setAdminFilter('all');
    setDateFromFilter('');
    setDateToFilter('');
    clearFilters();
  };

  // Handle export with error handling
  const handleExport = async () => {
    try {
      await exportLogs('csv');
    } catch (err) {
      // Error is already handled in the hook
      console.error('Export failed:', err);
    }
  };

  // Generate pagination pages for display
  const generatePaginationPages = () => {
    const maxPagesToShow = 5;
    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;
    
    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const paginationPages = generatePaginationPages();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 text-purple-500 rounded-lg bg-purple-500/10 dark:bg-purple-400/10 dark:text-purple-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Activity Logs</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Monitor all administrative actions and system access
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Real-time indicator */}
          <div className="flex items-center gap-2">
            {realTimeEnabled ? (
              <div 
                className="cursor-pointer" 
                title="Real-time updates enabled - click to disable"
                onClick={() => setRealTimeEnabled(false)}
              >
                <Wifi className="w-4 h-4 text-green-500" />
              </div>
            ) : (
              <div 
                className="cursor-pointer" 
                title="Real-time updates disabled - click to enable"
                onClick={() => setRealTimeEnabled(true)}
              >
                <WifiOff className="w-4 h-4 text-slate-400" />
              </div>
            )}
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {realTimeEnabled ? 'Live' : 'Manual'}
            </span>
          </div>
          
          <button
            onClick={handleExport}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-white border rounded-lg text-slate-700 dark:text-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          
          <button
            onClick={refreshLogs}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="overflow-hidden border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10">
        
        {/* Filters */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/50">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <label htmlFor="search" className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                Search
              </label>
              <div className="relative">
                <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                <input
                  id="search"
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by email, action, or details..."
                  className="w-full py-2 pr-4 text-sm bg-white border rounded-lg pl-9 dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Action Filter */}
            <div>
              <label htmlFor="action-filter" className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                Action
              </label>
              <select
                id="action-filter"
                value={actionFilter}
                onChange={(e) => handleFilterChange('action', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Actions</option>
                {availableActions.map(action => (
                  <option key={action} value={action}>
                    {formatAction(action)}
                  </option>
                ))}
              </select>
            </div>

            {/* Admin Filter */}
            <div>
              <label htmlFor="admin-filter" className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                Admin
              </label>
              <select
                id="admin-filter"
                value={adminFilter}
                onChange={(e) => handleFilterChange('admin', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Admins</option>
                {availableAdmins.map(admin => (
                  <option key={admin} value={admin}>
                    {admin}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="date-from" className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                  From
                </label>
                <div className="relative">
                  <Calendar className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none left-3 top-1/2 text-slate-400" />
                  <input
                    id="date-from"
                    type="date"
                    value={dateFromFilter}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    className="w-full py-2 pr-3 text-sm bg-white border rounded-lg pl-9 dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="date-to" className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                  To
                </label>
                <div className="relative">
                  <Calendar className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none left-3 top-1/2 text-slate-400" />
                  <input
                    id="date-to"
                    type="date"
                    value={dateToFilter}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    className="w-full py-2 pr-3 text-sm bg-white border rounded-lg pl-9 dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
            >
              <Filter className="w-4 h-4" />
              Clear Filters
            </button>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing {logs ? logs.length : 0} of {pagination.totalItems} logs
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 mb-4 text-purple-500 animate-spin" />
                <p className="text-slate-600 dark:text-slate-400">Loading activity logs...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-96">
              <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
              <p className="max-w-md text-center text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={refreshLogs}
                className="px-4 py-2 mt-4 text-red-600 transition-colors bg-red-100 rounded-lg dark:bg-red-900/20 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40"
              >
                Try Again
              </button>
            </div>
          ) : !logs || logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96">
              <FileText className="w-12 h-12 mb-4 text-slate-400" />
              <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-white">
                No activity logs found
              </h3>
              <p className="max-w-md text-center text-slate-500 dark:text-slate-400">
                {Object.values(filters).some(filter => filter && filter !== 'all')
                  ? "No logs match your current filter criteria. Try adjusting the filters above."
                  : "There are no activity logs to display at this time."
                }
              </p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs font-medium uppercase border-b text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                <tr>
                  <th scope="col" className="px-6 py-4">Timestamp</th>
                  <th scope="col" className="px-6 py-4">Admin</th>
                  <th scope="col" className="px-6 py-4">Action</th>
                  <th scope="col" className="px-6 py-4">IP Address</th>
                  <th scope="col" className="px-6 py-4">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y dark:bg-slate-800 divide-slate-200 dark:divide-slate-700">
                {logs.map((log, index) => (
                  <tr 
                    key={log.id || index}
                    className="transition-all duration-200 border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50 border-l-3 hover:border-l-purple-500"
                  >
                    <td className="px-6 py-4 font-mono text-xs whitespace-nowrap text-slate-900 dark:text-slate-100">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-slate-100">
                      {log.admin_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                          getActionBadgeClass(log.action)
                        )}
                      >
                        {formatAction(log.action)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs whitespace-nowrap text-slate-600 dark:text-slate-400">
                      {log.ip_address || 'N/A'}
                    </td>
                    <td className="max-w-xs px-6 py-4 text-slate-600 dark:text-slate-400">
                      <div className="truncate" title={log.details || 'No details'}>
                        {log.details || 'No details'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && logs && logs.length > 0 && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t bg-slate-50/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="text-sm text-slate-700 dark:text-slate-300">
                Showing page {pagination.currentPage} of {pagination.totalPages} 
                <span className="ml-2 text-slate-500 dark:text-slate-400">
                  ({pagination.totalItems} total logs)
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.currentPage === 1}
                  className="p-2 transition-colors rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="First page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="p-2 transition-colors rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page numbers */}
                {paginationPages.map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={cn(
                      "px-3 py-1 text-sm font-medium rounded-md transition-colors",
                      page === pagination.currentPage
                        ? "bg-purple-600 text-white"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600"
                    )}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="p-2 transition-colors rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="p-2 transition-colors rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Last page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}